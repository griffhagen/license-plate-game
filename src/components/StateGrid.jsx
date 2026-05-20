import { STATES } from '../data/states';
import PlateImage from './PlateImage';

export default function StateGrid({ findings, onSelect }) {
  const findingMap = Object.fromEntries(findings.map((f) => [f.stateCode, f]));

  return (
    <div className="state-grid">
      {STATES.map((state) => {
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
            </div>
            {found && <span className="cell-check">✓</span>}
            {state.rarity >= 8 && !found && <span className="cell-rare">★</span>}
          </button>
        );
      })}
    </div>
  );
}
