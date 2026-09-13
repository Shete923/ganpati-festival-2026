import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Events from './pages/Events.jsx';
import EventDetails from './pages/EventDetails.jsx';
import CoordinatorLogin from './pages/CoordinatorLogin.jsx';
import CoordinatorDashboard from './pages/CoordinatorDashboard.jsx';
import Winners from './pages/Winners.jsx';
import AartiSchedule from './pages/AartiSchedule.jsx';
import Teams from './pages/Teams.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:slug" element={<EventDetails />} />
          <Route path="/coordinator-login" element={<CoordinatorLogin />} />
          <Route path="/coordinator/:slug" element={<CoordinatorDashboard />} />
          <Route path="/winners" element={<Winners />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/aarti-schedule" element={<AartiSchedule />} />
        </Routes>
      </main>
    </>
  );
}
