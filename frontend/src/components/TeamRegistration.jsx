import { useState } from 'react';
import api from '../api.js';

const EMPLOYEE_NAMES = [
  'Sudhir Gorade Sir',
  'Sonali Garade Mam',
  'Omkar Shirsagar',
  'Sanket Batwal',
  'Piyush Gamne',
  'Kishor Patil',
  'Yash Govardhane',
  'Pooja Satbhai',
  'Vidya Handore',
  'Shraddha Handore',
  'Satish Aurange',
  'Dipti Pawar',
  'Shivani Sonawane',
  'Savita Mane/Hijare',
  'Pratiksha Karavate',
  'Mahesh Mhaske',
  'Vivek Patil',
  'Vrushali Varpe',
  'Yash Ghodke',
  'Dhananjay Raut',
  'Rohini Gaikwad',
  'Vishwambhar Gore',
  'Anoop Nanekar',
  'Varsha Rajguru',
  'Ravindra Kandekar',
  'Pooja Dalvi',
  'Janhavi Sanap',
  'Mangesh Kawade',
  'Harshada Satpute',
  'Ritika Uphade',
  'Shankar Tile',
  'Tanuja Deshmukh',
  'Prasad Pawar',
  'Payal Patil',
  'Aarti Kale /Pawar',
  'Rohit Raut',
  'Keshav Mahale',
  'Sakshi Kudale',
  'Megha Ghate',
  'Snehal Chavan',
  'Sushant Joshi',
  'Pranjali Mahajan',
  'Pankaj Pathak',
  'Vedant Shete',
  'Rutuja Gadekar',
  'Kedar Dixit',
  'Yash Bidgar',
  'Tanuja Jadhav',
  'Saurabhi Kulkarni',
  'Chandrakant',
  'Balaji',
  'Chetan',
  'Anurag',
  'Kailash',
  'Mahesh',
  'Mukesh',
  'Pranav',
  'Rahul',
  'Satish',
  'Furkhan'
];

const TEAM_NAMES = [
  'वक्रतुंड (Vakratunda)',
  'एकदंत (Ekadanta)',
  'कृष्णपिंगाक्ष (Krishnapingaksha)',
  'गजवक्त्र (Gajavaktra)',
  'लंबोदर (Lambodara)',
  'विकट (Vikata)',
  'विघ्नराज (Vighnaraja)',
  'धूम्रवर्ण (Dhumravarna)',
  'भालचंद्र (Bhalachandra)',
  'गजानन (Gajanan)',
  'Mahindra Team'
];

function cleanMembers(members) {
  return members.map(member => member.trim()).filter(Boolean);
}

function MemberSelect({ value, onChange, index, options = EMPLOYEE_NAMES }) {
  const names = options.includes(value) || !value ? options : [value, ...options];

  return (
    <select value={value} onChange={event => onChange(event.target.value)} aria-label={`Member ${index + 1} name`}>
      <option value="">Select member {index + 1}</option>
      {names.map(memberName => <option key={memberName} value={memberName}>{memberName}</option>)}
    </select>
  );
}

function TeamNameSelect({ value, onChange, id }) {
  const names = TEAM_NAMES.includes(value) || !value ? TEAM_NAMES : [value, ...TEAM_NAMES];

  return (
    <select id={id} value={value} onChange={event => onChange(event.target.value)} required>
      <option value="">Select team name</option>
      {names.map(teamName => <option key={teamName} value={teamName}>{teamName}</option>)}
    </select>
  );
}

export default function TeamRegistration({ slug, teams, onChange, onLogout }) {
  const [name, setName] = useState('');
  const [members, setMembers] = useState(['']);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editMembers, setEditMembers] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const addMemberField = () => setMembers(current => [...current, '']);
  const updateMemberField = (index, value) => setMembers(current => current.map((member, i) => i === index ? value : member));
  const removeMemberField = (index) => setMembers(current => current.filter((_, i) => i !== index));

  const addTeam = async (event) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.post(`/coordinator/${slug}/teams`, { name, members: cleanMembers(members) });
      setName('');
      setMembers(['']);
      await onChange();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to register team');
    } finally {
      setSaving(false);
    }
  };

  const startEdit = (team) => {
    setEditingId(team._id);
    setEditName(team.name);
    setEditMembers(team.members.length ? [...team.members] : ['']);
    setError('');
  };

  const updateTeam = async (event, id) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await api.put(`/coordinator/${slug}/teams/${id}`, { name: editName, members: cleanMembers(editMembers) });
      setEditingId(null);
      await onChange();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update team');
    } finally {
      setSaving(false);
    }
  };

  const removeTeam = async (id) => {
    if (!window.confirm('Remove this registered team and its event scores?')) return;
    setError('');
    try {
      await api.delete(`/coordinator/${slug}/teams/${id}`);
      await onChange();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to remove team');
    }
  };

  return (
    <div className="page">
      <div className="event-header registration-heading">
        <div>
          <p className="eyebrow">Festival Setup</p>
          <h1>Team Registration</h1>
        </div>
        <button className="btn btn-link" onClick={onLogout}>Logout</button>
      </div>

      <section className="card registration-card">
        <h2>Register a Team</h2>
        <p className="section-note">These teams will be available automatically in every festival event.</p>
        <form onSubmit={addTeam} className="registration-form">
          <label htmlFor="team-name">Team name</label>
          <TeamNameSelect id="team-name" value={name} onChange={setName} />
          <div className="member-heading"><span>Team members</span><button type="button" className="btn btn-secondary btn-small" onClick={addMemberField}>Add member</button></div>
          <div className="member-fields">
            {members.map((member, index) => (
              <div className="member-input" key={`new-member-${index}`}>
                <MemberSelect value={member} onChange={value => updateMemberField(index, value)} index={index} />
                {members.length > 1 && <button type="button" className="btn-remove" onClick={() => removeMemberField(index)} aria-label="Remove member">✕</button>}
              </div>
            ))}
          </div>
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? 'Saving...' : 'Register Team'}</button>
        </form>
      </section>

      {error && <div className="error-msg registration-error">{error}</div>}

      <section className="card registration-card">
        <h2>Registered Teams</h2>
        {teams.length === 0 && <div className="empty-state">No teams registered yet.</div>}
        <div className="registered-teams">
          {teams.map(team => editingId === team._id ? (
            <form className="registered-team editing-team" key={team._id} onSubmit={event => updateTeam(event, team._id)}>
              <label htmlFor={`edit-name-${team._id}`}>Team name</label>
              <TeamNameSelect id={`edit-name-${team._id}`} value={editName} onChange={setEditName} />
              <div className="member-heading"><span>Team members</span><button type="button" className="btn btn-secondary btn-small" onClick={() => setEditMembers(current => [...current, ''])}>Add member</button></div>
              {editMembers.map((member, index) => (
                <div className="member-input" key={`edit-member-${index}`}>
                  <MemberSelect value={member} onChange={value => setEditMembers(current => current.map((item, i) => i === index ? value : item))} index={index} />
                  {editMembers.length > 1 && <button type="button" className="btn-remove" onClick={() => setEditMembers(current => current.filter((_, i) => i !== index))} aria-label="Remove member">✕</button>}
                </div>
              ))}
              <div className="team-actions"><button className="btn btn-primary btn-small" type="submit" disabled={saving}>Save changes</button><button className="btn btn-link" type="button" onClick={() => setEditingId(null)}>Cancel</button></div>
            </form>
          ) : (
            <article className="registered-team" key={team._id}>
              <div className="registered-team-top"><h3>{team.name}</h3><div className="team-actions"><button className="btn btn-secondary btn-small" onClick={() => startEdit(team)}>Edit</button><button className="btn btn-danger btn-small" onClick={() => removeTeam(team._id)}>Remove</button></div></div>
              <p className="member-list">{team.members.length ? team.members.join(' · ') : 'No members added yet.'}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
