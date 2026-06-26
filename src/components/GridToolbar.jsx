const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'missing', label: 'To find' },
  { id: 'found', label: 'Found' },
  { id: 'rare', label: 'Rare ★' },
];

export default function GridToolbar({
  filter,
  onFilterChange,
  counts,
  hint,
  search,
  onSearchChange,
  searchPlaceholder = 'Search…',
}) {
  return (
    <div className="grid-toolbar">
      <p className="grid-toolbar-hint">{hint ?? 'Tap a plate to log a sighting'}</p>
      {onSearchChange && (
        <div className="grid-search">
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="grid-search-input"
          />
          {search && (
            <button
              type="button"
              className="grid-search-clear"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>
      )}
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
