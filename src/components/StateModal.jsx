import { rarityLabel } from '../data/states';
import PlateImage from './PlateImage';

export default function StateModal({
  state,
  finding,
  onClose,
  onMarkFound,
  onUnmark,
  busy,
}) {
  const isFound = Boolean(finding);

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
            {(finding.latitude != null && finding.longitude != null) && (
              <a
                className="map-link"
                href={`https://maps.apple.com/?ll=${finding.latitude},${finding.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open in Maps
              </a>
            )}
            <button type="button" className="btn-ghost danger" onClick={onUnmark} disabled={busy}>
              Remove finding
            </button>
          </div>
        ) : (
          <button type="button" className="btn-primary" onClick={onMarkFound} disabled={busy}>
            {busy ? 'Getting location…' : 'I spotted this plate!'}
          </button>
        )}
      </div>
    </div>
  );
}
