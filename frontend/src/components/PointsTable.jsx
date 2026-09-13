import { useState, useEffect } from 'react';

// Reusable points entry table. Columns come entirely from event.scoringFields,
// so the same component works for Office Olympics (7 games) or any other
// event with a totally different set of rounds.
export default function PointsTable({ event, leaderboard, onSave, readOnly }) {
  const [rows, setRows] = useState([]);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    setRows(leaderboard.map(r => ({ ...r, scores: { ...r.scores } })));
  }, [leaderboard]);

  const updateScore = (participantId, key, value) => {
    setRows(prev => prev.map(r => r.participantId === participantId
      ? { ...r, scores: { ...r.scores, [key]: value } }
      : r));
  };

  const handleSave = async () => {
    setError('');
    setSavedMsg('');
    setSaving(true);
    try {
      const entries = rows.map(r => ({ participantId: r.participantId, scores: r.scores, reason }));
      await onSave(entries);
      setSavedMsg('Saved successfully');
      setReason('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save, please try again');
    } finally {
      setSaving(false);
    }
  };

  if (rows.length === 0) return <div className="empty-state">No teams added yet. Add teams above first.</div>;

  return (
    <div className="points-table-wrap">
      <div className="table-scroll">
        <table className="points-table">
          <thead>
            <tr>
              <th className="sticky-col">Team</th>
              {event.scoringFields.map(f => <th key={f.key}>{f.label}</th>)}
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const total = event.scoringFields.reduce((s, f) => s + (Number(r.scores[f.key]) || 0), 0);
              return (
                <tr key={r.participantId}>
                  <td className="sticky-col team-name"><strong>{r.name}</strong>{r.members?.length > 0 && <small className="team-members">{r.members.join(' · ')}</small>}</td>
                  {event.scoringFields.map(f => (
                    <td key={f.key}>
                      <input
                        type="number"
                        inputMode="numeric"
                        disabled={readOnly}
                        value={r.scores[f.key] ?? ''}
                        onChange={e => updateScore(r.participantId, f.key, e.target.value)}
                        className="points-input"
                      />
                    </td>
                  ))}
                  <td className="total-cell">{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!readOnly && (
        <div className="save-bar">
          <input
            type="text"
            placeholder="Reason (optional)"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="reason-input"
          />
          <button className="btn btn-primary btn-large" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save Points'}
          </button>
          {savedMsg && <span className="saved-msg">✓ {savedMsg}</span>}
          {error && <span className="error-msg">{error}</span>}
        </div>
      )}
    </div>
  );
}
