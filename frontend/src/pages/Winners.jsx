import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.js';
import Leaderboard from '../components/Leaderboard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

export default function Winners() {
  const [events, setEvents] = useState([]);
  const [overall, setOverall] = useState([]);

  useEffect(() => {
    api.get('/events').then(res => setEvents(res.data));
    api.get('/overall-leaderboard').then(res => setOverall(res.data));
  }, []);

  const completed = events.filter(e => e.status === 'completed');
  const overallRows = overall.map(r => ({ ...r, participantId: r.name }));

  return (
    <div className="page">
      <h1>Winners & Final Results</h1>

      <section className="card">
        <h2>Overall Festival Leaderboard</h2>
        <Leaderboard rows={overallRows} />
        {overallRows.length > 0 && (
          <a className="btn btn-secondary btn-small" href="/api/overall-leaderboard/export.csv">Export Overall CSV</a>
        )}
      </section>

      <section className="card">
        <h2>Completed Events</h2>
        {completed.length === 0 && <div className="empty-state">No events finalized yet.</div>}
        {completed.map(e => (
          <div key={e._id} className="completed-event-row">
            <Link to={`/events/${e.slug}`}>{e.name}</Link>
            <StatusBadge status={e.status} />
          </div>
        ))}
      </section>
    </div>
  );
}
