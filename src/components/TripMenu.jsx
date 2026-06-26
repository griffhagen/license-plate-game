export default function TripMenu({
  open,
  onClose,
  onInvite,
  onExport,
  onLeave,
  theme,
  onToggleTheme,
}) {
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
          <h2>Trip menu</h2>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        <nav className="trip-menu-list">
          <button type="button" className="trip-menu-item" onClick={onInvite}>
            <span className="trip-menu-item-icon" aria-hidden>
              👥
            </span>
            <span className="trip-menu-item-text">
              <strong>Invite players</strong>
              <small>Share code or link with your crew</small>
            </span>
          </button>
          <button type="button" className="trip-menu-item" onClick={onExport}>
            <span className="trip-menu-item-icon" aria-hidden>
              ↓
            </span>
            <span className="trip-menu-item-text">
              <strong>Export backup</strong>
              <small>Save progress to this phone</small>
            </span>
          </button>
          {onToggleTheme && (
            <button type="button" className="trip-menu-item" onClick={onToggleTheme}>
              <span className="trip-menu-item-icon" aria-hidden>
                {theme === 'light' ? '☀️' : '🌙'}
              </span>
              <span className="trip-menu-item-text">
                <strong>{theme === 'light' ? 'Light mode' : 'Dark mode'}</strong>
                <small>Tap to switch theme</small>
              </span>
            </button>
          )}
          <button type="button" className="trip-menu-item trip-menu-item-danger" onClick={onLeave}>
            <span className="trip-menu-item-icon" aria-hidden>
              ←
            </span>
            <span className="trip-menu-item-text">
              <strong>Leave trip</strong>
              <small>Return to home screen</small>
            </span>
          </button>
        </nav>

      </div>
    </div>
  );
}
