import { STATES, TOTAL_STATES } from '../data/states';

export default function StatsBar({ findings }) {
  const foundCount = findings.length;
  const remaining = TOTAL_STATES - foundCount;
  const foundCodes = new Set(findings.map((f) => f.stateCode));
  const rarityEarned = findings.reduce((sum, f) => {
    const state = STATES.find((s) => s.code === f.stateCode);
    return sum + (state?.rarity ?? 0);
  }, 0);
  const maxRarity = STATES.reduce((sum, s) => sum + s.rarity, 0);
  const rarityPct = maxRarity > 0 ? Math.round((rarityEarned / maxRarity) * 100) : 0;

  const hardestLeft = STATES.filter((s) => !foundCodes.has(s.code))
    .sort((a, b) => b.rarity - a.rarity)[0];

  return (
    <div className="stats-bar">
      <div className="stat">
        <span className="stat-value">{foundCount}</span>
        <span className="stat-label">Found</span>
      </div>
      <div className="stat">
        <span className="stat-value">{remaining}</span>
        <span className="stat-label">To go</span>
      </div>
      <div className="stat">
        <span className="stat-value">{rarityPct}%</span>
        <span className="stat-label">Rarity pts</span>
      </div>
      {hardestLeft && remaining > 0 && (
        <div className="stat stat-wide stat-hunt">
          <span className="stat-label">Next hunt</span>
          <span className="stat-value stat-small">
            {hardestLeft.name}
            <span className="stat-rarity"> · {hardestLeft.rarity}/10</span>
          </span>
        </div>
      )}
      {remaining === 0 && (
        <div className="stat stat-wide stat-complete">
          <span className="stat-value stat-small">All 50 states found!</span>
        </div>
      )}
    </div>
  );
}
