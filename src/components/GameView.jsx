import { useEffect, useState } from 'react';
import StatsBar from './StatsBar';
import SharePanel from './SharePanel';
import StateGrid from './StateGrid';
import StateModal from './StateModal';
import MapPage from './MapPage';
import GameNav from './GameNav';
import { startLocationCapture } from '../utils/geo';
import { hasGeoCoords } from '../utils/findingLocation';
import { isIos, isStandaloneApp, safariLocationHint } from '../utils/device';
import { clearJoinFromUrl, getJoinGameIdFromUrl } from '../utils/joinUrl';
import { downloadGameBackup } from '../utils/gameBackup';

export default function GameView({
  game,
  leaveGame,
  markFound,
  unmarkFound,
  addLocationToFinding,
  error,
  setError,
}) {
  const [view, setView] = useState('tracker');
  const [selected, setSelected] = useState(null);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [safariLinkCopied, setSafariLinkCopied] = useState(false);
  const [restoreMsg, setRestoreMsg] = useState(() => sessionStorage.getItem('plate-restore-msg'));

  useEffect(() => {
    if (restoreMsg) {
      sessionStorage.removeItem('plate-restore-msg');
    }
  }, [restoreMsg]);

  const mapCount = game.findings.filter(hasGeoCoords).length;

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

  const finishWithGeo = (geo, save) => {
    if (geo.latitude == null || geo.longitude == null) {
      setError(geo.errorMessage || 'Could not get your location.');
      setBusy(false);
      return;
    }
    save(geo)
      .then(() => closeModal())
      .catch((err) => setError(err.message))
      .finally(() => setBusy(false));
  };

  const handleMarkFound = (withoutLocation = false) => {
    if (!selected) return;
    setBusy(true);
    setError(null);

    if (withoutLocation) {
      markFound(selected.code, { latitude: null, longitude: null, label: null })
        .then(() => closeModal())
        .catch((err) => setError(err.message))
        .finally(() => setBusy(false));
      return;
    }

    // Start GPS immediately on tap (iOS requires same user gesture)
    const locationPromise = startLocationCapture();
    locationPromise.then((geo) => finishWithGeo(geo, (g) => markFound(selected.code, g)));
  };

  const handleAddLocation = () => {
    if (!selected) return;
    setBusy(true);
    setError(null);
    const locationPromise = startLocationCapture();
    locationPromise.then((geo) =>
      finishWithGeo(geo, (g) => addLocationToFinding(selected.code, g))
    );
  };

  const safariHint = safariLocationHint();
  const copySafariLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setSafariLinkCopied(true);
    } catch {
      window.prompt('Copy this link, open Safari, and paste in the address bar:', url);
      setSafariLinkCopied(true);
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

      {restoreMsg && (
        <p className="restore-success" role="status">
          {restoreMsg}
        </p>
      )}

      <p className="backup-hint">
        Export saves your progress to this phone. Restore it from the home screen if the server was reset.
      </p>

      {showShare && (
        <SharePanel gameId={game.id} gameName={game.name} players={game.players} />
      )}

      {safariHint && (
        <p className="location-safari-banner" role="note">
          {safariHint}
          {isIos() && isStandaloneApp() && (
            <>
              <button type="button" className="btn-text" onClick={copySafariLink}>
                {safariLinkCopied ? 'Link copied' : 'Copy link for Safari'}
              </button>
              <a className="safari-open-link" href={window.location.href}>
                Or tap here, then choose Open in Safari
              </a>
            </>
          )}
        </p>
      )}

      {error && (
        <p className="form-error" role="alert">
          {error}
          {isIos() && isStandaloneApp() && (
            <button type="button" className="btn-text" onClick={copySafariLink} style={{ marginLeft: 8 }}>
              Copy link for Safari
            </button>
          )}
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
          onMarkFound={() => handleMarkFound(false)}
          onMarkWithoutLocation={() => handleMarkFound(true)}
          onAddLocation={handleAddLocation}
          onUnmark={handleUnmark}
          busy={busy}
        />
      )}
    </div>
  );
}
