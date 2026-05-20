import { rarityLabel } from '../data/states';
import PlateImage from './PlateImage';
import { hasGeoCoords } from '../utils/findingLocation';
import { isIos, isStandaloneApp } from '../utils/device';

export default function StateModal({
  state,
  finding,
  onClose,
  onMarkFound,
  onMarkWithoutLocation,
  onAddLocation,
  onUnmark,
  busy,
}) {
  const isFound = Boolean(finding);
  const hasLocation = isFound && hasGeoCoords(finding);
  const showSafariTip = isIos() && isStandaloneApp();

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="state-modal-title"
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className={`modal-plate-frame ${isFound ? 'found' : ''}`}>
          <PlateImage code={state.code} size="lg" className="modal-plate-img" />
        </div>
        <h2 id="state-modal-title">{state.name}</h2>
        <p className="rarity-badge">
          {rarityLabel(state.rarity)} · {state.rarity}/10 rarity
        </p>
        <p className="state-fact">{state.fact}</p>

        {isFound ? (
          <div className="finding-details">
            <p>
              Spotted by <strong>{finding.playerName}</strong>
            </p>
            <p className="found-time">{new Date(finding.foundAt).toLocaleString()}</p>
            {finding.locationLabel && (
              <p className="found-location">📍 {finding.locationLabel}</p>
            )}
            {hasLocation && (
              <a
                className="map-link"
                href={`https://maps.apple.com/?ll=${finding.latitude},${finding.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Maps
              </a>
            )}
            {!hasLocation && (
              <>
                <p className="location-missing">No GPS saved for this plate yet.</p>
                <p className="location-hint">
                  Tap Allow if your phone asks — Ask in Settings is OK.
                </p>
                <button type="button" className="btn-primary" onClick={onAddLocation} disabled={busy}>
                  {busy ? 'Waiting for location…' : 'Add location now'}
                </button>
              </>
            )}
            <button type="button" className="btn-ghost danger" onClick={onUnmark} disabled={busy}>
              Remove finding
            </button>
          </div>
        ) : (
          <>
            {showSafariTip ? (
              <p className="location-hint location-hint-warn">
                Using the home-screen icon? GPS often fails on iPhone — use <strong>Open in Safari</strong> on the game screen, or save without location and add it in Safari later.
              </p>
            ) : (
              <p className="location-hint">
                When your phone asks, tap <strong>Allow</strong>. Keeping Safari on &ldquo;Ask&rdquo; for websites is fine.
              </p>
            )}
            <button type="button" className="btn-primary" onClick={onMarkFound} disabled={busy}>
              {busy ? 'Waiting for location…' : 'I spotted this plate!'}
            </button>
            <button
              type="button"
              className="btn-text location-skip"
              onClick={onMarkWithoutLocation}
              disabled={busy}
            >
              Save without map location
            </button>
          </>
        )}
      </div>
    </div>
  );
}
