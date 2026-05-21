import { useRef, useState, useEffect } from 'react';
import { getJoinGameIdFromUrl } from '../utils/joinUrl';
import { readBackupFile } from '../utils/gameBackup';

export default function HomeScreen({ startGame, joinExisting, importBackup, error, setError }) {
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
