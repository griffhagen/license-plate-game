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

function displayCode(code) {
  return code.length <= 3 ? code : code.slice(0, 3);
}

export default function PlateGrid({
  plates,
  findings,
  onSelect,
  filter = 'all',
  emptyMessages = {},
}) {
  const findingMap = Object.fromEntries(findings.map((f) => [f.stateCode, f]));
  const visible = plates.filter((plate) =>
    matchesFilter(plate, Boolean(findingMap[plate.code]), filter)
  );

  if (visible.length === 0) {
    return (
      <p className="grid-empty">
        {emptyMessages[filter] ??
          (filter === 'found'
            ? 'None found yet.'
            : filter === 'missing'
              ? 'All found!'
              : 'Nothing to show.')}
      </p>
    );
  }

  return (
    <div className="state-grid">
      {visible.map((plate) => {
        const finding = findingMap[plate.code];
        const found = Boolean(finding);
        return (
          <button
            key={plate.code}
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
      })}
    </div>
  );
}
