import { useEffect, useState } from 'react';
import StatsBar from './StatsBar';
import SharePanel from './SharePanel';
import StateGrid, { getFilterCounts } from './StateGrid';
import StateModal from './StateModal';
import MapPage from './MapPage';
import GameNav from './GameNav';
import TripProgress from './TripProgress';
import GridToolbar from './GridToolbar';
import TripMenu from './TripMenu';
import { startLocationCapture } from '../utils/geo';
import { hasGeoCoords } from '../utils/findingLocation';
import { isIos, isStandaloneApp, safariLocationHint } from '../utils/device';
import { clearJoinFromUrl, getJoinGameIdFromUrl } from '../utils/joinUrl';
import { downloadGameBackup } from '../utils/gameBackup';
import { TOTAL_STATES } from '../data/states';

const SAFARI_DISMISS_KEY = 'plate-safari-dismissed';

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
  const [filter, setFilter] = useState('missing');
  const [selected, setSelected] = useState(null);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [safariLinkCopied, setSafariLinkCopied] = useState(false);
  const [safariDismissed, setSafariDismissed] = useState(
    () => sessionStorage.getItem(SAFARI_DISMISS_KEY) === '1'
  );
  const [restoreMsg, setRestoreMsg] = useState(() => sessionStorage.getItem('plate-restore-msg'));

  useEffect(() => {
    if (restoreMsg) {
      sessionStorage.removeItem('plate-restore-msg');
    }
  }, [restoreMsg]);

  const foundCount = game.findings.length;
  const mapCount = game.findings.filter(hasGeoCoords).length;
  const filterCounts = getFilterCounts(game.findings);
  const safariHint = safariLocationHint();
  const showSafariBanner = safariHint && isIos() && isStandaloneApp() && !safariDismissed;

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

  const dismissSafariBanner = () => {
    sessionStorage.setItem(SAFARI_DISMISS_KEY, '1');
    setSafariDismissed(true);
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

  const handleLeave = () => {
    setMenuOpen(false);
    leaveGame();
  };

  const findingForSelected =
    selectedFinding ?? game.findings.find((f) => f.stateCode === selected?.code);

  return (
    <div className="app game game-with-nav">
      <header className="game-top">
        <div className="game-top-row">
          <div className="game-title-block">
            <span className="game-eyebrow">Road trip</span>
            <h1>{game.name}</h1>
          </div>
          <button
            type="button"
            className="btn-icon"
            onClick={() => setMenuOpen(true)}
            aria-label="Trip menu"
          >
            ⋯
          </button>
        </div>
        <TripProgress foundCount={foundCount} />
        <div className="game-top-actions">
          <button
            type="button"
            className={`btn-invite ${showShare ? 'active' : ''}`}
            onClick={() => setShowShare((s) => !s)}
          >
            {showShare ? 'Hide invite' : 'Invite players'}
          </button>
        </div>
      </header>

      {restoreMsg && (
        <p className="toast toast-success" role="status">
          {restoreMsg}
        </p>
      )}

      {showShare && (
        <SharePanel gameId={game.id} gameName={game.name} players={game.players} />
      )}

      {showSafariBanner && (
        <aside className="toast toast-warn" role="note">
          <p>{safariHint}</p>
          <div className="toast-actions">
            <button type="button" className="btn-text" onClick={copySafariLink}>
              {safariLinkCopied ? 'Link copied' : 'Copy for Safari'}
            </button>
            <button type="button" className="btn-text" onClick={dismissSafariBanner}>
              Dismiss
            </button>
          </div>
        </aside>
      )}

      {error && (
        <div className="toast toast-error" role="alert">
          <p>{error}</p>
          <div className="toast-actions">
            {isIos() && isStandaloneApp() && (
              <button type="button" className="btn-text" onClick={copySafariLink}>
                Copy for Safari
              </button>
            )}
            <button type="button" className="btn-text" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      {view === 'tracker' ? (
        <>
          <StatsBar findings={game.findings} />
          <GridToolbar filter={filter} onFilterChange={setFilter} counts={filterCounts} />
          <StateGrid findings={game.findings} onSelect={openState} filter={filter} />
        </>
      ) : (
        <MapPage findings={game.findings} onGoToPlates={() => setView('tracker')} />
      )}

      <GameNav
        view={view}
        onChange={setView}
        mapCount={mapCount}
        foundCount={foundCount}
        totalStates={TOTAL_STATES}
      />

      <TripMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onExport={() => {
          downloadGameBackup(game);
          setMenuOpen(false);
        }}
        onLeave={handleLeave}
      />

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
