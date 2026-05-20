import { useEffect, useState } from 'react';
import StatsBar from './StatsBar';
import SharePanel from './SharePanel';
import StateGrid from './StateGrid';
import StateModal from './StateModal';
import MapPage from './MapPage';
import GameNav from './GameNav';
import { getCurrentLocation } from '../utils/geo';
import { clearJoinFromUrl, getJoinGameIdFromUrl } from '../utils/joinUrl';
import { downloadGameBackup } from '../utils/gameBackup';

export default function GameView({ game, leaveGame, markFound, unmarkFound, error, setError }) {
  const [view, setView] = useState('tracker');
  const [selected, setSelected] = useState(null);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showShare, setShowShare] = useState(false);

  const mapCount = game.findings.filter(
    (f) => f.latitude != null && f.longitude != null
  ).length;

  useEffect(() => {
    const joinId = getJoinGameIdFromUrl();
    if (joinId && joinId === game.id.toLowerCase()) {
      setShowShare(true);
      clearJoinFromUrl();
    }
  }, [game.id]);

  useEffect(() => {
    if (view === 'map') {
      setSelected(null);
      setSelectedFinding(null);
    }
  }, [view]);

  const openState = (state, finding) => {
    setSelected(state);
    setSelectedFinding(finding ?? null);
  };

  const closeModal = () => {
    setSelected(null);
    setSelectedFinding(null);
  };

  const handleMarkFound = async () => {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      const geo = await getCurrentLocation();
      await markFound(selected.code, geo);
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleUnmark = async () => {
    if (!selected) return;
    setBusy(true);
    setError(null);
    try {
      await unmarkFound(selected.code);
      closeModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const findingForSelected =
    selectedFinding ??
    game.findings.find((f) => f.stateCode === selected?.code);

  return (
    <div className="app game game-with-nav">
      <header className="game-header">
        <div className="game-header-main">
          <h1>{game.name}</h1>
          <div className="game-header-actions">
            <button type="button" className="btn-text" onClick={() => setShowShare((s) => !s)}>
              {showShare ? 'Hide invite' : 'Invite'}
            </button>
            <button
              type="button"
              className="btn-text"
              onClick={() => downloadGameBackup(game)}
            >
              Export
            </button>
            <button type="button" className="btn-ghost" onClick={leaveGame}>
              Leave
            </button>
          </div>
        </div>
      </header>

      <p className="backup-hint">
        Export saves your progress to this phone. Restore it from the home screen if the server was reset.
      </p>

      {showShare && (
        <SharePanel gameId={game.id} gameName={game.name} players={game.players} />
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
          <button type="button" className="btn-text" onClick={() => setError(null)} style={{ marginLeft: 8 }}>
            Dismiss
          </button>
        </p>
      )}

      {view === 'tracker' ? (
        <>
          <StatsBar findings={game.findings} />
          <StateGrid findings={game.findings} onSelect={openState} />
        </>
      ) : (
        <MapPage findings={game.findings} />
      )}

      <GameNav view={view} onChange={setView} mapCount={mapCount} />

      {selected && view === 'tracker' && (
        <StateModal
          state={selected}
          finding={findingForSelected}
          onClose={closeModal}
          onMarkFound={handleMarkFound}
          onUnmark={handleUnmark}
          busy={busy}
        />
      )}
    </div>
  );
}
