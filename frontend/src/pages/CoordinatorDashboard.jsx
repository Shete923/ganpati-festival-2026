import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api.js';
import StatusBadge from '../components/StatusBadge.jsx';
import PointsTable from '../components/PointsTable.jsx';
import ChangeHistory from '../components/ChangeHistory.jsx';
import TeamRegistration from '../components/TeamRegistration.jsx';

export default function CoordinatorDashboard() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const load = () => {
    api.get(`/coordinator/${slug}/dashboard`)
      .then(res => setData(res.data))
      .catch(() => {
        localStorage.removeItem('coordinatorToken');
        navigate('/coordinator-login');
      });
  };

  useEffect(() => { load(); }, [slug]);

  const savePoints = async (entries) => {
    await api.put(`/coordinator/${slug}/points`, { entries });
    await load();
  };

  const finalize = async () => {
    if (!window.confirm('Finalize this event? Points and ranking will become read-only.')) return;
    await api.post(`/coordinator/${slug}/finalize`);
    load();
  };

  const goLive = async () => {
    await api.put(`/coordinator/${slug}/status`, { status: 'live' });
    load();
  };

  const logout = () => {
    localStorage.removeItem('coordinatorToken');
    navigate('/coordinator-login');
  };

  if (!data) return <div className="page">Loading...</div>;
  if (data.event.isRegistration) {
    return <TeamRegistration slug={slug} teams={data.teams} onChange={load} onLogout={logout} />;
  }
  const { event, leaderboard, changes } = data;

  return (
    <div className="page">
      <div className="event-header">
        <h1>{event.name}</h1>
        <StatusBadge status={event.status} />
      </div>
      <div className="dashboard-toolbar">
        {event.status === 'upcoming' && !event.finalized && (
          <button className="btn btn-secondary btn-small" onClick={goLive}>Mark as Live</button>
        )}
        <button className="btn btn-link" onClick={logout}>Logout</button>
      </div>

      <section className="card">
        <h2>Enter Points</h2>
        <PointsTable event={event} leaderboard={leaderboard} onSave={savePoints} readOnly={event.finalized} />
      </section>

      <section className="card">
        <h2>Change History</h2>
        <ChangeHistory changes={changes} />
      </section>

      <section className="card actions-row">
        {!event.finalized ? (
          <button className="btn btn-danger btn-large" onClick={finalize}>Finalize Event</button>
        ) : (
          <p className="finalized-note">✓ This event is finalized. Results are locked and public.</p>
        )}
        <a className="btn btn-secondary" href={`/api/events/${slug}/export/results.csv`}>Export Results CSV</a>
        <a className="btn btn-secondary" href={`/api/events/${slug}/export/changes.csv`}>Export Changes CSV</a>
      </section>
    </div>
  );
}
