import { useEffect, useState } from 'react';
import api from '../api.js';

export default function AartiSchedule() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    api.get('/aarti-schedule').then(res => setSchedule(res.data));
  }, []);

  return (
    <div className="page">
      <p className="eyebrow">Daily Devotion</p>
      <h1>Aarti Schedule</h1>
      <p className="schedule-intro">Join us for morning and evening aarti throughout the Ganpati festival.</p>
      <div className="aarti-grid">
        {schedule.map(item => (
          <article className="aarti-card" key={item._id || item.date}>
            <div className="aarti-card-heading">
              <div><h2>{item.date}</h2><span>{item.day}</span></div>
              <span className="aarti-symbol">✦</span>
            </div>
            <div className="aarti-times">
              <div className="aarti-slot"><span className="aarti-label">Morning Aarti</span><strong>10:00 AM</strong><p>{item.morning || 'To be announced'}</p></div>
              <div className="aarti-slot"><span className="aarti-label">Evening Aarti</span><strong>6:15 PM</strong><p>{item.evening || 'To be announced'}</p></div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
