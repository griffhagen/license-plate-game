export default function GameNav({ view, onChange, mapCount }) {
  return (
    <nav className="game-nav" aria-label="Game sections">
      <button
        type="button"
        className={view === 'tracker' ? 'active' : ''}
        onClick={() => onChange('tracker')}
        aria-current={view === 'tracker' ? 'page' : undefined}
      >
        <span className="nav-icon" aria-hidden>
          ⊞
        </span>
        Tracker
      </button>
      <button
        type="button"
        className={view === 'map' ? 'active' : ''}
        onClick={() => onChange('map')}
        aria-current={view === 'map' ? 'page' : undefined}
      >
        <span className="nav-icon" aria-hidden>
          🗺
        </span>
        Map
        {mapCount > 0 && <span className="nav-badge">{mapCount}</span>}
      </button>
    </nav>
  );
}
