export default function TripMenu({ open, onClose, onExport, onLeave }) {
  if (!open) return null;

  return (
    <div className="menu-backdrop" onClick={onClose} role="presentation">
      <div
        className="trip-menu"
        role="dialog"
        aria-label="Trip options"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="trip-menu-header">
          <h2>Trip options</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <p className="trip-menu-hint">
          Export a backup to this phone. Restore it from the home screen if the server was reset.
        </p>
        <button type="button" className="btn-secondary menu-action" onClick={onExport}>
          Export backup
        </button>
        <button type="button" className="btn-ghost danger menu-action" onClick={onLeave}>
          Leave trip
        </button>
      </div>
    </div>
  );
}
