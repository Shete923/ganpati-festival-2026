import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge.jsx';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' });
}

export default function EventCard({ event }) {
  return (
    <Link to={`/events/${event.slug}`} className="event-card">
      <div className="event-card-header">
        <h3>{event.name}</h3>
        <StatusBadge status={event.status} />
      </div>
      <p className="event-date">{formatDate(event.date)}</p>
      {event.inCharge && <p className="event-incharge">In-charge: {event.inCharge}</p>}
    </Link>
  );
}
