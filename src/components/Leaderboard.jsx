export default function Leaderboard({ players, findings }) {
  const counts = new Map(players.map((p) => [p.id, { name: p.name, total: 0 }]));
  for (const f of findings) {
    const entry = counts.get(f.playerId) ?? { name: f.playerName, total: 0 };
    entry.total += 1;
    counts.set(f.playerId, entry);
  }

  const ranked = Array.from(counts.values()).sort((a, b) => b.total - a.total);
  const topScore = ranked[0]?.total ?? 0;

  if (ranked.length === 0) {
    return <p className="grid-empty">No players yet.</p>;
  }

  return (
    <ol className="leaderboard-list">
      {ranked.map((p, i) => (
        <li key={p.name + i} className={`leaderboard-row ${p.total === topScore && topScore > 0 ? 'leaderboard-lead' : ''}`}>
          <span className="leaderboard-rank">{i + 1}</span>
          <span className="leaderboard-name">{p.name}</span>
          <span className="leaderboard-score">{p.total}</span>
        </li>
      ))}
    </ol>
  );
}
