import { STATES } from '../data/states';
import PlateImage from './PlateImage';

export function getFilterCounts(findings) {
  const foundCodes = new Set(findings.map((f) => f.stateCode));
  const found = foundCodes.size;
  const missing = STATES.length - found;
  const rare = STATES.filter((s) => s.rarity >= 8 && !foundCodes.has(s.code)).length;
  return { all: STATES.length, found, missing, rare };
}

function matchesFilter(state, found, filter) {
  if (filter === 'found') return found;
  if (filter === 'missing') return !found;
  if (filter === 'rare') return state.rarity >= 8 && !found;
  return true;
}

export default function StateGrid({ findings, onSelect, filter = 'all' }) {
  const findingMap = Object.fromEntries(findings.map((f) => [f.stateCode, f]));
  const visible = STATES.filter((state) =>
    matchesFilter(state, Boolean(findingMap[state.code]), filter)
  );

  if (visible.length === 0) {
    return (
      <p className="grid-empty">
        {filter === 'found' && 'No plates found yet — switch to To find and tap one you spot.'}
        {filter === 'missing' && 'You found them all! 🎉'}
        {filter === 'rare' && 'No rare plates left to hunt — nice work!'}
      </p>
    );
  }

  return (
    <div className="state-grid">
      {visible.map((state) => {
        const finding = findingMap[state.code];
        const found = Boolean(finding);
        return (
          <button
            key={state.code}
            type="button"
            className={`state-cell ${found ? 'found' : ''} rarity-${state.rarity}`}
            onClick={() => onSelect(state, finding)}
            aria-label={`${state.name}${found ? ', found' : ', not found'}`}
          >
            <div className="cell-plate-wrap">
              <PlateImage code={state.code} size="sm" className="cell-plate" />
              <span className="cell-code">{state.code}</span>
              {found && <span className="cell-check">✓</span>}
              {state.rarity >= 8 && !found && <span className="cell-rare">★</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
