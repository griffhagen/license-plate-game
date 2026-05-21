export default function GameNav({ view, onChange, mapCount, foundCount, totalStates }) {
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
        <span className="nav-label">Plates</span>
        <span className="nav-sub">{foundCount}/{totalStates}</span>
      </button>
      <button
        type="button"
        className={view === 'map' ? 'active' : ''}
        onClick={() => onChange('map')}
        aria-current={view === 'map' ? 'page' : undefined}
      >
        <span className="nav-icon" aria-hidden>
          ◉
        </span>
        <span className="nav-label">Map</span>
        {mapCount > 0 ? (
          <span className="nav-badge">{mapCount}</span>
        ) : (
          <span className="nav-sub">GPS</span>
        )}
      </button>
    </nav>
  );
}
