export default function GameNav({
  view,
  onChange,
  mapCount,
  foundCount,
  totalStates,
  bonusFoundCount,
  totalBonus,
}) {
  return (
    <nav className="game-nav game-nav-four" aria-label="Game sections">
      <button
        type="button"
        className={view === 'states' ? 'active' : ''}
        onClick={() => onChange('states')}
        aria-current={view === 'states' ? 'page' : undefined}
      >
        <span className="nav-icon" aria-hidden>
          ⊞
        </span>
        <span className="nav-label">States</span>
        <span className="nav-sub">
          {foundCount}/{totalStates}
        </span>
      </button>
      <button
        type="button"
        className={view === 'bonus' ? 'active' : ''}
        onClick={() => onChange('bonus')}
        aria-current={view === 'bonus' ? 'page' : undefined}
      >
        <span className="nav-icon" aria-hidden>
          ★
        </span>
        <span className="nav-label">Bonus</span>
        <span className="nav-sub">
          {bonusFoundCount}/{totalBonus}
        </span>
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
      <button
        type="button"
        className={view === 'stats' ? 'active' : ''}
        onClick={() => onChange('stats')}
        aria-current={view === 'stats' ? 'page' : undefined}
      >
        <span className="nav-icon" aria-hidden>
          🏆
        </span>
        <span className="nav-label">Stats</span>
      </button>
    </nav>
  );
}
