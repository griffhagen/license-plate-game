import { useState, useEffect } from 'react';
import { getJoinGameIdFromUrl } from '../utils/joinUrl';

export default function HomeScreen({ startGame, joinExisting, error, setError }) {
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

      <div className="mode-tabs">
        <button
          type="button"
          className={mode === 'start' ? 'active' : ''}
          onClick={() => setMode('start')}
        >
          Start Game
        </button>
        <button
          type="button"
          className={mode === 'join' ? 'active' : ''}
          onClick={() => setMode('join')}
        >
          Join Game
        </button>
      </div>

      {joinFromUrl && mode === 'join' && (
        <p className="join-banner">
          You&apos;ve been invited to join game <strong>{joinFromUrl}</strong>
        </p>
      )}

      <form className="home-form" onSubmit={handleSubmit}>
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
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Loading…' : mode === 'start' ? 'Create & Play' : 'Join Trip'}
        </button>
      </form>

      <section className="home-features">
        <div className="feature">
          <span>📍</span>
          <p>Logs where you spotted each plate</p>
        </div>
        <div className="feature">
          <span>👥</span>
          <p>Share a code — everyone sees live progress</p>
        </div>
        <div className="feature">
          <span>⭐</span>
          <p>Rarity scores & state fun facts</p>
        </div>
      </section>

      <p className="pwa-hint">
        On iPhone: tap Share → <strong>Add to Home Screen</strong> for the full app experience.
      </p>
    </div>
  );
}
