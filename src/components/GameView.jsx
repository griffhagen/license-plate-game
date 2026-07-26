import { useEffect, useState } from 'react';
import StatsBar from './StatsBar';
import SharePanel from './SharePanel';
import { STATES, TOTAL_STATES } from '../data/states';
import { TOTAL_BONUS } from '../data/bonusPlates';
import { splitFindings } from '../data/registry';
import PlateGrid, { getFilterCounts } from './PlateGrid';
import BonusPage from './BonusPage';
import StateModal from './StateModal';
import MapPage from './MapPage';
import StatsPage from './StatsPage';
import GameNav from './GameNav';
import TripProgress from './TripProgress';
import GridToolbar from './GridToolbar';
import TripMenu from './TripMenu';
import { startLocationCapture } from '../utils/geo';
import { hasGeoCoords } from '../utils/findingLocation';
import { isIos, isStandaloneApp, safariLocationHint } from '../utils/device';
import { clearJoinFromUrl, getJoinGameIdFromUrl } from '../utils/joinUrl';
import { downloadGameBackup } from '../utils/gameBackup';
import { playFoundFeedback } from '../utils/feedback';

const SAFARI_DISMISS_KEY = 'plate-safari-dismissed';

export default function GameView({
  game,
  leaveGame,
  markFound,
  unmarkFound,
  addLocationToFinding,
  refreshGame,
  error,
  setError,
  pendingCount,
  flushPending,
  theme,
  toggleTheme,
  installed,
  canPrompt,
  promptInstall,
}) {
  const [view, setView] = useState('states');
  const [stateFilter, setStateFilter] = useState('missing');
  const [stateSearch, setStateSearch] = useState('');
  const [iosInstallHint, setIosInstallHint] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [bonusFilter, setBonusFilter] = useState('missing');
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

  const { stateFindings, bonusFindings } = splitFindings(game.findings);
  const foundCount = stateFindings.length;
  const bonusFoundCount = bonusFindings.length;
  const mapCount = game.findings.filter(hasGeoCoords).length;
  const stateFilterCounts = getFilterCounts(STATES, stateFindings);
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

  const handleRefresh = async () => {
    if (refreshing) return;
    setRefreshing(true);
    try {
      await refreshGame();
    } catch {
      setError('Could not refresh — check your connection.');
    } finally {
      setRefreshing(false);
    }
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
        .then(() => {
          playFoundFeedback();
          closeModal();
        })
        .catch((err) => setError(err.message))
        .finally(() => setBusy(false));
      return;
    }

    const locationPromise = startLocationCapture();
    locationPromise.then((geo) =>
      finishWithGeo(geo, (g) => markFound(selected.code, g).then(() => playFoundFeedback()))
    );
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

  const handleInstall = async () => {
    if (canPrompt) {
      await promptInstall();
      setMenuOpen(false);
      return;
    }
    if (isIos()) {
      setIosInstallHint(true);
      return;
    }
    setMenuOpen(false);
  };

  const findingForSelected =
    selectedFinding ?? game.findings.find((f) => f.stateCode === selected?.code);

  const showModal = selected && (view === 'states' || view === 'bonus');

  return (
    <div className="app game game-with-nav">
      <header className="game-top">
        <div className="game-top-row">
          <div className="game-title-block">
            <span className="game-eyebrow">Road trip</span>
            <h1>{game.name}</h1>
          </div>
          <div className="game-top-actions">
            <button
              type="button"
              className={`btn-icon ${refreshing ? 'btn-icon-spinning' : ''}`}
              onClick={handleRefresh}
              aria-label="Refresh trip data"
              disabled={refreshing}
            >
              ⟳
            </button>
            <button
              type="button"
              className="btn-icon"
              onClick={() => setMenuOpen(true)}
              aria-label="Trip menu"
            >
              ⋯
            </button>
          </div>
        </div>
        {view === 'states' && <TripProgress foundCount={foundCount} />}
      </header>

      {restoreMsg && (
        <p className="toast toast-success" role="status">
          {restoreMsg}
        </p>
      )}

      {showShare && (
        <SharePanel
          gameId={game.id}
          gameName={game.name}
          players={game.players}
          onClose={() => setShowShare(false)}
        />
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

      {pendingCount > 0 && (
        <div className="toast toast-warn" role="status">
          <p>
            {pendingCount} plate{pendingCount !== 1 ? 's' : ''} saved on this phone,
            waiting for signal. {pendingCount !== 1 ? 'They' : 'It'}&apos;ll sync
            automatically.
          </p>
          <div className="toast-actions">
            <button type="button" className="btn-text" onClick={() => flushPending()}>
              Try now
            </button>
          </div>
        </div>
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

      {view === 'states' && (
        <>
          <StatsBar findings={game.findings} />
          <GridToolbar
            filter={stateFilter}
            onFilterChange={setStateFilter}
            counts={stateFilterCounts}
            search={stateSearch}
            onSearchChange={setStateSearch}
            searchPlaceholder="Search states…"
          />
          <PlateGrid
            plates={STATES}
            findings={stateFindings}
            onSelect={openState}
            filter={stateFilter}
            search={stateSearch}
            emptyMessages={{
              found: 'No state plates found yet — switch to To find and tap one you spot.',
              missing: 'You found all 50 states! 🎉',
              rare: 'No rare state plates left to hunt — nice work!',
            }}
          />
        </>
      )}

      {view === 'bonus' && (
        <BonusPage
          bonusFindings={bonusFindings}
          onSelect={openState}
          filter={bonusFilter}
          onFilterChange={setBonusFilter}
        />
      )}

      {view === 'map' && (
        <MapPage findings={game.findings} onGoToPlates={() => setView('states')} />
      )}

      {view === 'stats' && <StatsPage game={game} />}

      <GameNav
        view={view}
        onChange={setView}
        mapCount={mapCount}
        foundCount={foundCount}
        totalStates={TOTAL_STATES}
        bonusFoundCount={bonusFoundCount}
        totalBonus={TOTAL_BONUS}
      />

      <TripMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onInvite={() => {
          setShowShare(true);
          setMenuOpen(false);
        }}
        onExport={() => {
          downloadGameBackup(game);
          setMenuOpen(false);
        }}
        onLeave={handleLeave}
        theme={theme}
        onToggleTheme={toggleTheme}
        showInstall={!installed}
        onInstall={handleInstall}
      />

      {iosInstallHint && (
        <div className="modal-backdrop" onClick={() => setIosInstallHint(false)} role="presentation">
          <div className="modal sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Add to Home Screen">
            <div className="sheet-handle" aria-hidden />
            <button type="button" className="modal-close" onClick={() => setIosInstallHint(false)} aria-label="Close">
              ×
            </button>
            <h2>Add to Home Screen</h2>
            <p className="install-hint-text">
              Tap the Share icon <strong>⬆️</strong> in Safari's toolbar, then choose
              <strong> "Add to Home Screen."</strong>
            </p>
          </div>
        </div>
      )}

      {showModal && (
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
