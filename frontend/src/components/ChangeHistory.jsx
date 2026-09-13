export default function ChangeHistory({ changes }) {
  if (!changes || changes.length === 0) {
    return <div className="empty-state">No changes recorded yet.</div>;
  }
  return (
    <div className="change-history">
      {changes.map(c => (
        <div key={c._id} className="change-item">
          <div className="change-top">
            <strong>{c.participantName}</strong> — {c.field}
          </div>
          <div className="change-values">{c.oldValue} → {c.newValue}</div>
          <div className="change-reason">Reason: {c.reason}</div>
          <div className="change-time">{new Date(c.createdAt).toLocaleString('en-IN')}</div>
        </div>
      ))}
    </div>
  );
}
