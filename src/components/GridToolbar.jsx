const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'missing', label: 'To find' },
  { id: 'found', label: 'Found' },
  { id: 'rare', label: 'Rare ★' },
];

export default function GridToolbar({ filter, onFilterChange, counts }) {
  return (
    <div className="grid-toolbar">
      <p className="grid-toolbar-hint">Tap a plate to log a sighting</p>
      <div className="filter-chips" role="tablist" aria-label="Filter plates">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            className={`filter-chip ${filter === f.id ? 'active' : ''}`}
            onClick={() => onFilterChange(f.id)}
          >
            {f.label}
            {counts[f.id] != null && <span className="filter-chip-count">{counts[f.id]}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
