import { useEffect, useState } from 'react';
import api from '../api.js';
import EventCard from '../components/EventCard.jsx';

export default function Events() {
  const [events, setEvents] = useState([]);

  useEffect(() => { api.get('/events').then(res => setEvents(res.data)); }, []);

  return (
    <div className="page">
      <h1>Events</h1>
      <div className="events-grid">
        {events.map(e => <EventCard key={e._id} event={e} />)}
      </div>
    </div>
  );
}
