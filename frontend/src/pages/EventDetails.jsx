import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.js';
import StatusBadge from '../components/StatusBadge.jsx';
import Leaderboard from '../components/Leaderboard.jsx';
import ChangeHistory from '../components/ChangeHistory.jsx';
import WinnerCard from '../components/WinnerCard.jsx';

export default function EventDetails() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setData(null);
    setNotFound(false);
    api.get(`/events/${slug}`)
      .then(res => setData(res.data))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) return <div className="page">Event not found.</div>;
  if (!data) return <div className="page">Loading...</div>;

  const { event, leaderboard, changes } = data;

  return (
    <div className="page">
      <div className="event-header">
        <h1>{event.name}</h1>
        <StatusBadge status={event.status} />
      </div>
      <p className="event-date">
        {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>
      {event.inCharge && <p className="event-incharge">In-charge: {event.inCharge}</p>}

      <section className="card">
        <h2>Rules</h2>
        <p className="event-rules">{event.rules}</p>
      </section>

      {event.finalized && (
        <section className="card">
          <h2>Winner</h2>
          <WinnerCard leaderboard={leaderboard} />
        </section>
      )}

      <section className="card">
        <h2>Leaderboard</h2>
        <Leaderboard rows={leaderboard} compact />
        {leaderboard.length > 0 && (
          <a className="btn btn-secondary btn-small" href={`/api/events/${slug}/export/results.csv`}>Export Results CSV</a>
        )}
      </section>

      <section className="card">
        <h2>Change History</h2>
        <p className="section-note">Any edit to an already-saved score is logged here for transparency.</p>
        <ChangeHistory changes={changes} />
      </section>
    </div>
  );
}
