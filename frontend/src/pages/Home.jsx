import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Sumago Infotech Ganpati Utsav 2026 · Satpur Office</p>
          <h1>Ganpati Bappa<br /><em>Morya</em></h1>
          <p className="hero-lede">Celebrating devotion, culture, and community through our annual Ganpati Festival. Join us for a week of sacred rituals, vibrant celebrations, and timeless traditions.</p>
          <div className="hero-buttons">
            <Link to="/events" className="btn btn-primary">Explore Events</Link>
            <Link to="/aarti-schedule" className="btn btn-quiet">Aarti Schedule</Link>
          </div>
        </div>
        <div className="hero-image" role="img" aria-label="Ganpati idol surrounded by marigold garlands">
          <video autoPlay loop muted playsInline poster={`${import.meta.env.BASE_URL}ganapati-hero.jfif`} aria-hidden="true">
            <source src={`${import.meta.env.BASE_URL}hero-ganapati.mp4`} type="video/mp4" />
          </video>
        </div>
      </section>

      <section className="festival-strip">
        <div><span className="strip-icon">✦</span><strong>Celebration Schedule</strong><small>Sthapana: 14th Ganesh<br />14 Sep – 25 Sep 2026</small></div>
        <div><span className="strip-icon">◷</span><strong>Aarti Timings</strong><small>Morning Aarti: 10:00 AM<br />Evening Aarti: 6:15 PM</small></div>
        <div><span className="strip-icon">◴</span><strong>Event Timing</strong><small>5pm onwards</small></div>
        <div><span className="strip-icon">⌖</span><strong>Visit Us</strong><small>Sumago Infotech,<br />D24, Satpur Office, Nashik</small></div>
      </section>

      <footer className="home-footer"><div><strong>✦ Sumago Ganpati Utsav</strong><p>Celebrating faith, culture, and togetherness at Sumago Infotech Pvt. Ltd.</p></div><div><strong>Quick Links</strong><Link to="/events">Schedule</Link><Link to="/events">Events</Link><Link to="/winners">Winners</Link></div><div><strong>Contact</strong><p>Sumago Infotech, Satpur Office, Nashik<br />+91 20 XXXX XXXX</p></div><div><strong>Follow Us</strong><p className="socials">◎ &nbsp; ◉ &nbsp; in</p></div><small className="copyright">© 2026 Sumago Infotech Pvt. Ltd. All rights reserved.</small></footer>
    </div>
  );
}
