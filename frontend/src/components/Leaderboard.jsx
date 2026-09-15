export default function Leaderboard({ rows, compact = false }) {
  if (!rows || rows.length === 0) {
    return <div className="empty-state">No results yet.</div>;
  }
  return (
    <div className="table-scroll">
      <table className={compact ? 'leaderboard-table event-leaderboard-table' : 'leaderboard-table'}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            {!compact && <th>Members</th>}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.participantId} className={r.rank === 1 ? 'rank-1' : ''}>
              <td>{r.rank}</td>
              <td>{r.name}</td>
              {!compact && <td>{r.members?.length ? r.members.join(' · ') : '—'}</td>}
              <td>{r.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
