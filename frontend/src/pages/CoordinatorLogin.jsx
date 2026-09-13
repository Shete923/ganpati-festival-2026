import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api.js';

export default function CoordinatorLogin() {
  const [events, setEvents] = useState([]);
  const [slug, setSlug] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { api.get('/events?includeRegistration=true').then(res => setEvents(res.data)); }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/coordinator/login', { slug, password });
      localStorage.setItem('coordinatorToken', res.data.token);
      navigate(`/coordinator/${slug}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page narrow">
      <h1>Coordinator Login</h1>
      <form onSubmit={handleLogin} className="form">
        <label htmlFor="event-select">Event</label>
        <select id="event-select" value={slug} onChange={e => setSlug(e.target.value)} required>
          <option value="">Select event</option>
          {events.map(e => <option key={e.slug} value={e.slug}>{e.name}</option>)}
        </select>

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        {error && <div className="error-msg">{error}</div>}
        <button className="btn btn-primary btn-large" type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
