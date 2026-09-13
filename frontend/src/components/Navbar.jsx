import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <img src="/company-logo.jpeg" alt="Sumago Infotech logo" />
        <span className="brand-copy"><strong>Ganpati Festival</strong><small>2026</small></span>
      </Link>
      <div className="nav-links">
        <Link to="/events">Events</Link>
        <Link to="/teams">View Teams</Link>
        <Link to="/aarti-schedule">Aarti</Link>
        <Link to="/winners">Winners</Link>
        <Link to="/coordinator-login" className="nav-coord-link">Coordinator</Link>
      </div>
      <span className="site-credit">Made by Vedant Shete · AI&amp;ML Trainer</span>
    </nav>
  );
}
