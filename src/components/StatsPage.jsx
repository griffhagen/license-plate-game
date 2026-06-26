import Leaderboard from './Leaderboard';
import AchievementsList from './AchievementsList';
import TripRecap from './TripRecap';

export default function StatsPage({ game }) {
  return (
    <div className="stats-page">
      <section className="stats-section">
        <h2 className="stats-section-heading">Leaderboard</h2>
        <Leaderboard players={game.players} findings={game.findings} />
      </section>

      <section className="stats-section">
        <h2 className="stats-section-heading">Achievements</h2>
        <AchievementsList findings={game.findings} />
      </section>

      <section className="stats-section">
        <h2 className="stats-section-heading">Trip recap</h2>
        <TripRecap game={game} findings={game.findings} />
      </section>
    </div>
  );
}
