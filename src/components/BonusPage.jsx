import { BONUS_PLATES } from '../data/bonusPlates';
import PlateGrid, { getFilterCounts } from './PlateGrid';
import GridToolbar from './GridToolbar';
import BonusProgress from './BonusProgress';

export default function BonusPage({ bonusFindings, onSelect, filter, onFilterChange }) {
  const filterCounts = getFilterCounts(BONUS_PLATES, bonusFindings);

  return (
    <div className="bonus-page">
      <BonusProgress foundCount={bonusFindings.length} />
      <p className="bonus-page-intro">
        Canadian provinces, Mexican states, D.C., and tribal nation plates — extra credit beyond the 50 states.
      </p>
      <GridToolbar
        filter={filter}
        onFilterChange={onFilterChange}
        counts={filterCounts}
        hint="Tap a bonus plate when you spot one on the road"
      />
      <PlateGrid
        plates={BONUS_PLATES}
        findings={bonusFindings}
        onSelect={onSelect}
        filter={filter}
        groupByCategory
        emptyMessages={{
          found: 'No bonus plates logged yet — switch to To find.',
          missing: 'You found every bonus plate! 🎉',
          rare: 'No rare bonus plates left — nice work!',
        }}
      />
    </div>
  );
}
