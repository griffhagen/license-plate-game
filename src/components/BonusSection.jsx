import { BONUS_PLATES, TOTAL_BONUS } from '../data/bonusPlates';
import PlateGrid from './PlateGrid';

export default function BonusSection({ bonusFindings, onSelect }) {
  const foundCount = bonusFindings.length;

  return (
    <section className="bonus-section" aria-labelledby="bonus-heading">
      <div className="bonus-section-header">
        <h2 id="bonus-heading">Bonus plates</h2>
        <span className="bonus-section-count">
          {foundCount}/{TOTAL_BONUS}
        </span>
      </div>
      <p className="bonus-section-hint">
        Canada, Mexico, D.C., and tribal nation plates — extra credit, not part of the 50 states.
      </p>
      <PlateGrid
        plates={BONUS_PLATES}
        findings={bonusFindings}
        onSelect={onSelect}
        filter="all"
        bonus
      />
    </section>
  );
}
