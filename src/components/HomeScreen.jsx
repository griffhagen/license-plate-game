import { useRef, useState, useEffect } from 'react';
import { getJoinGameIdFromUrl } from '../utils/joinUrl';
import { readBackupFile } from '../utils/gameBackup';

function timeAgo(iso) {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return '';
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.round(days / 30);
  return months === 1 ? 'a month ago' : `${months} months ago`;
}

export default function HomeScreen({
  startGame,
  joinExisting,
  importBackup,
  error,
  setError,
  trips = [],
  resumeTrip,
  forgetTripById,
}) {
  const joinFromUrl = getJoinGameIdFromUrl();
  const [mode, setMode] = useState(joinFromUrl ? 'join' : 'start');
  const [gameName, setGameName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [gameCode, setGameCode] = useState(joinFromUrl ?? '');

  useEffect(() => {
    if (joinFromUrl) {
      setMode('join');
      setGameCode(joinFromUrl);
    }
  }, [joinFromUrl]);

  const [submitting, setSubmitting] = useState(false);
  const [restoreName, setRestoreName] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (mode === 'start') {
        await startGame(gameName.trim(), playerName.trim());
      } else {
        await joinExisting(gameCode, playerName.trim());
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="app home">
      <header className="home-hero">
        <span className="hero-plate">USA</span>
        <h1>License Plate Game</h1>
        <p>Spot all 50 states on your road trip — together.</p>
      </header>

      <ol className="home-steps">
        <li>Start or join a trip</li>
        <li>Tap plates as you spot them</li>
        <li>Share the code with your crew</li>
      </ol>

      <div className="mode-tabs" role="tablist" aria-label="Start or join">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'start'}
          className={mode === 'start' ? 'active' : ''}
          onClick={() => setMode('start')}
        >
          New trip
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'join'}
          className={mode === 'join' ? 'active' : ''}
          onClick={() => setMode('join')}
        >
          Join trip
        </button>
      </div>

      {joinFromUrl && mode === 'join' && (
        <p className="join-banner">
          Invited to trip <strong>{joinFromUrl}</strong>
        </p>
      )}

      <form className="home-form card" onSubmit={handleSubmit}>
        {mode === 'start' ? (
          <label>
            Trip name
            <input
              type="text"
              placeholder="Summer 2026 Road Trip"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              required
              maxLength={60}
              autoComplete="off"
            />
          </label>
        ) : (
          <label>
            Game code
            <input
              type="text"
              placeholder="abc12345"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value.toLowerCase())}
              required
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              inputMode="text"
            />
          </label>
        )}
        <label>
          Your name
          <input
            type="text"
            placeholder="Alex"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            required
            maxLength={30}
            autoComplete="name"
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn-primary btn-lg" disabled={submitting}>
          {submitting ? 'Loading…' : mode === 'start' ? 'Start trip' : 'Join trip'}
        </button>
      </form>

      {trips.length > 0 && (
        <section className="past-trips card" aria-labelledby="past-trips-heading">
          <h2 id="past-trips-heading">Past trips</h2>
          <ul>
            {trips.map((trip) => (
              <li key={trip.gameId}>
                <button
                  type="button"
                  className="past-trip-open"
                  disabled={submitting}
                  onClick={async () => {
                    setError(null);
                    setSubmitting(true);
                    try {
                      await resumeTrip(trip);
                    } catch (err) {
                      setError(err.message);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  <span className="past-trip-name">{trip.name}</span>
                  <span className="past-trip-meta">
                    {trip.foundCount} plate{trip.foundCount === 1 ? '' : 's'} ·{' '}
                    {timeAgo(trip.lastPlayed)} · code {trip.gameId}
                  </span>
                </button>
                <button
                  type="button"
                  className="btn-text past-trip-forget"
                  aria-label={`Remove ${trip.name} from this list`}
                  onClick={() => forgetTripById(trip.gameId)}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <p className="past-trips-hint">Saved on this device only.</p>
        </section>
      )}

      <details className="restore-section card">
        <summary>Restore from backup file</summary>
        <p className="restore-hint">
          Upload a JSON file you exported earlier if the server lost your trip.
        </p>
        <label>
          Your name
          <input
            type="text"
            placeholder="Alex"
            value={restoreName}
            onChange={(e) => setRestoreName(e.target.value)}
            maxLength={30}
          />
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json,text/json,text/plain"
          className="restore-file-input"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            setError(null);
            setSubmitting(true);
            try {
              if (!restoreName.trim()) {
                throw new Error('Enter your name before restoring');
              }
              const backup = await readBackupFile(file);
              await importBackup(backup, restoreName.trim());
            } catch (err) {
              setError(err.message);
            } finally {
              setSubmitting(false);
              e.target.value = '';
            }
          }}
        />
        <button
          type="button"
          className="btn-secondary restore-btn"
          disabled={submitting}
          onClick={() => fileInputRef.current?.click()}
        >
          {submitting ? 'Restoring…' : 'Choose backup file'}
        </button>
      </details>

      <section className="home-features">
        <div className="feature">
          <span aria-hidden>🌎</span>
          <p>Bonus plates: Canada, Mexico, D.C. & tribal nations</p>
        </div>
        <div className="feature">
          <span aria-hidden>📍</span>
          <p>Map where each plate was spotted</p>
        </div>
        <div className="feature">
          <span aria-hidden>👥</span>
          <p>Live sync for everyone on the trip</p>
        </div>
        <div className="feature">
          <span aria-hidden>⭐</span>
          <p>Rarity scores and state fun facts</p>
        </div>
      </section>

      <p className="pwa-hint">
        iPhone: Share → <strong>Add to Home Screen</strong>
      </p>
    </div>
  );
}
