import { TOTAL_BONUS } from '../data/bonusPlates';

export default function BonusProgress({ foundCount }) {
  const pct = Math.round((foundCount / TOTAL_BONUS) * 100);
  return (
    <div className="trip-progress bonus-progress" aria-label={`${foundCount} of ${TOTAL_BONUS} bonus plates found`}>
      <div className="trip-progress-labels">
        <span className="trip-progress-count">
          <strong>{foundCount}</strong> of {TOTAL_BONUS} bonus
        </span>
        <span className="trip-progress-pct">{pct}%</span>
      </div>
      <div
        className="trip-progress-track"
        role="progressbar"
        aria-valuenow={foundCount}
        aria-valuemin={0}
        aria-valuemax={TOTAL_BONUS}
      >
        <div className="trip-progress-fill bonus-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
