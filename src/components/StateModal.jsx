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
        className="modal sheet"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="state-modal-title"
      >
        <div className="sheet-handle" aria-hidden />
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <span className={`status-pill ${isFound ? 'found' : 'open'}`}>
          {isFound ? '✓ Found' : 'Not spotted yet'}
        </span>

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
              <div className="location-prompt">
                <p className="location-missing">No map pin yet</p>
                <button type="button" className="btn-primary" onClick={onAddLocation} disabled={busy}>
                  {busy ? 'Waiting for location…' : 'Add map location'}
                </button>
              </div>
            )}
            <button type="button" className="btn-ghost danger" onClick={onUnmark} disabled={busy}>
              Remove finding
            </button>
          </div>
        ) : (
          <div className="modal-actions">
            {showSafariTip && (
              <p className="location-hint location-hint-warn">
                Home-screen app? Use Safari for GPS, or save without a map pin.
              </p>
            )}
            <button type="button" className="btn-primary btn-lg" onClick={onMarkFound} disabled={busy}>
              {busy ? 'Waiting for location…' : 'I spotted this plate!'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={onMarkWithoutLocation}
              disabled={busy}
            >
              Save without location
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
