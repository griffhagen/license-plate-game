import PlateImage from './PlateImage';

export function getFilterCounts(plates, findings) {
  const foundCodes = new Set(findings.map((f) => f.stateCode));
  const found = plates.filter((p) => foundCodes.has(p.code)).length;
  const missing = plates.length - found;
  const rare = plates.filter((p) => p.rarity >= 8 && !foundCodes.has(p.code)).length;
  return { all: plates.length, found, missing, rare };
}

function matchesFilter(plate, found, filter) {
  if (filter === 'found') return found;
  if (filter === 'missing') return !found;
  if (filter === 'rare') return plate.rarity >= 8 && !found;
  return true;
}

function matchesSearch(plate, query) {
  if (!query) return true;
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return plate.name.toLowerCase().includes(q) || plate.code.toLowerCase().includes(q);
}

function displayCode(code) {
  return code.length <= 3 ? code : code.slice(0, 3);
}

function PlateCell({ plate, finding, onSelect }) {
  const found = Boolean(finding);
  return (
    <button
      type="button"
      className={`state-cell ${found ? 'found' : ''} rarity-${plate.rarity}`}
      onClick={() => onSelect(plate, finding)}
      aria-label={`${plate.name}${found ? ', found' : ', not found'}`}
    >
      <div className="cell-plate-wrap">
        <PlateImage code={plate.code} size="sm" className="cell-plate" />
        <span className="cell-code">{displayCode(plate.code)}</span>
        {found && <span className="cell-check">✓</span>}
        {plate.rarity >= 8 && !found && <span className="cell-rare">★</span>}
      </div>
    </button>
  );
}

function groupByCategory(plates) {
  const groups = [];
  const indexByCategory = new Map();
  for (const plate of plates) {
    const category = plate.category ?? 'Other';
    if (!indexByCategory.has(category)) {
      indexByCategory.set(category, groups.length);
      groups.push({ category, plates: [] });
    }
    groups[indexByCategory.get(category)].plates.push(plate);
  }
  return groups;
}

export default function PlateGrid({
  plates,
  findings,
  onSelect,
  filter = 'all',
  emptyMessages = {},
  groupByCategory: shouldGroup = false,
  search = '',
}) {
  const findingMap = Object.fromEntries(findings.map((f) => [f.stateCode, f]));
  const visible = plates.filter(
    (plate) =>
      matchesFilter(plate, Boolean(findingMap[plate.code]), filter) && matchesSearch(plate, search)
  );

  if (visible.length === 0) {
    return (
      <p className="grid-empty">
        {search
          ? `No plates match “${search}.”`
          : emptyMessages[filter] ??
            (filter === 'found'
              ? 'None found yet.'
              : filter === 'missing'
                ? 'All found!'
                : 'Nothing to show.')}
      </p>
    );
  }

  if (shouldGroup) {
    const groups = groupByCategory(visible);
    return (
      <>
        {groups.map(({ category, plates: groupPlates }) => (
          <section key={category} className="state-grid-group">
            <h3 className="state-grid-group-heading">{category}</h3>
            <div className="state-grid">
              {groupPlates.map((plate) => (
                <PlateCell key={plate.code} plate={plate} finding={findingMap[plate.code]} onSelect={onSelect} />
              ))}
            </div>
          </section>
        ))}
      </>
    );
  }

  return (
    <div className="state-grid">
      {visible.map((plate) => (
        <PlateCell key={plate.code} plate={plate} finding={findingMap[plate.code]} onSelect={onSelect} />
      ))}
    </div>
  );
}
