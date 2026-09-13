export default function WinnerCard({ leaderboard }) {
  const winner = leaderboard.find(r => r.rank === 1);
  if (!winner) return <div className="empty-state">Winner not decided yet.</div>;
  return (
    <div className="winner-card">
      <span className="winner-trophy">🏆</span>
      <div>
        <div className="winner-name">{winner.name}</div>
        <div className="winner-points">{winner.total} points</div>
      </div>
    </div>
  );
}
