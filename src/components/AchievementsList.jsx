import { getAchievementProgress } from '../data/achievements';

export default function AchievementsList({ findings }) {
  const achievements = getAchievementProgress(findings);
  const earnedCount = achievements.filter((a) => a.earned).length;

  return (
    <div className="achievements">
      <p className="achievements-summary">
        {earnedCount} of {achievements.length} badges earned
      </p>
      <ul className="achievements-list">
        {achievements.map((a) => (
          <li key={a.id} className={`achievement-item ${a.earned ? 'earned' : ''}`}>
            <span className="achievement-emoji" aria-hidden>
              {a.emoji}
            </span>
            <span className="achievement-text">
              <strong>{a.name}</strong>
              <small>{a.description}</small>
            </span>
            {a.earned && <span className="achievement-check">✓</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
