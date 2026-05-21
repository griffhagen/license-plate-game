import { TOTAL_STATES } from '../data/states';

export default function TripProgress({ foundCount }) {
  const pct = Math.round((foundCount / TOTAL_STATES) * 100);
  return (
    <div className="trip-progress" aria-label={`${foundCount} of ${TOTAL_STATES} states found`}>
      <div className="trip-progress-labels">
        <span className="trip-progress-count">
          <strong>{foundCount}</strong> of {TOTAL_STATES} states
        </span>
        <span className="trip-progress-pct">{pct}%</span>
      </div>
      <div className="trip-progress-track" role="progressbar" aria-valuenow={foundCount} aria-valuemin={0} aria-valuemax={TOTAL_STATES}>
        <div className="trip-progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
