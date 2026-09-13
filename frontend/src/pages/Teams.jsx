import { useEffect, useState } from 'react';
import api from '../api.js';

export default function Teams() {
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/teams')
      .then(response => setTeams(response.data))
      .catch(() => setError('Unable to load teams right now.'));
  }, []);

  return (
    <div className="page">
      <h1>Festival Teams</h1>
      <p className="teams-intro">See who is participating together in this year&apos;s Ganpati Festival.</p>

      {error && <div className="error-msg">{error}</div>}
      {!error && teams.length === 0 && <div className="empty-state">No teams have been registered yet.</div>}
      <div className="public-teams-grid">
        {teams.map(team => (
          <article className="public-team-card" key={team._id}>
            <h2>{team.name}</h2>
            {team.members?.length ? (
              <ul>
                {team.members.map((member, index) => <li key={`${team._id}-${member}-${index}`}>{member}</li>)}
              </ul>
            ) : <p className="empty-state">No members added yet.</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
