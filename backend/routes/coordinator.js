const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Event = require('../models/Event');
const Participant = require('../models/Participant');
const Points = require('../models/Points');
const Change = require('../models/Change');
const Team = require('../models/Team');
const auth = require('../middleware/auth');
const { buildLeaderboard } = require('../utils/ranking');
const { syncTeamsToEvents } = require('../utils/teams');
const { guessSongRules, rapidFireRules } = require('../utils/eventRules');

// LOGIN - Event name (slug) + password, nothing more complicated
router.post('/login', async (req, res) => {
  const { slug, password } = req.body;
  let event = await Event.findOne({ slug });
  if (!event && slug === 'team-registration') {
    const coordinatorPasswordHash = await bcrypt.hash(process.env.DEFAULT_COORD_PASSWORD || 'ganpati2026', 10);
    event = await Event.create({
      name: 'Team Registration',
      slug: 'team-registration',
      date: '2026-09-13',
      scoringFields: [],
      isRegistration: true,
      coordinatorPasswordHash
    });
  }
  if (!event) return res.status(404).json({ error: 'Event not found' });

  const match = await bcrypt.compare(password || '', event.coordinatorPasswordHash);
  if (!match) return res.status(401).json({ error: 'Incorrect password' });

  const token = jwt.sign(
    { eventId: event._id, slug: event.slug },
    process.env.JWT_SECRET,
    { expiresIn: '12h' }
  );
  res.json({ token, event: { name: event.name, slug: event.slug } });
});

async function registrationData() {
  await syncTeamsToEvents();
  return Team.find().sort({ name: 1 });
}

// DASHBOARD DATA for the logged-in coordinator's own event only
router.get('/:slug/dashboard', auth, async (req, res) => {
  const event = await Event.findById(req.eventId).select('-coordinatorPasswordHash');
  if (event.isRegistration) {
    return res.json({ event, teams: await registrationData() });
  }
  if (event.slug === 'rapid-fire-quiz' && event.rules === 'Rules to be announced by the coordinator.') {
    event.rules = rapidFireRules;
  }
  if (event.slug === 'guess-song' && event.rules === 'Rules to be announced by the coordinator.') {
    event.rules = guessSongRules;
  }
  await syncTeamsToEvents();
  const participants = await Participant.find({ event: event._id }).populate('team', 'members');
  const pointsList = await Points.find({ event: event._id });
  const leaderboard = buildLeaderboard(participants, pointsList, event.scoringFields);
  const changes = await Change.find({ event: event._id }).sort({ createdAt: -1 });
  res.json({ event, leaderboard, changes });
});

// REGISTERED TEAMS - shared by every scoring event
router.post('/:slug/teams', auth, async (req, res) => {
  const event = await Event.findById(req.eventId);
  if (!event?.isRegistration) return res.status(404).json({ error: 'Team registration is unavailable here' });

  const name = req.body.name?.trim();
  const members = Array.isArray(req.body.members)
    ? req.body.members.map(member => String(member).trim()).filter(Boolean)
    : [];
  if (!name) return res.status(400).json({ error: 'Team name is required' });

  try {
    const team = await Team.create({ name, members });
    await syncTeamsToEvents();
    res.json(team);
  } catch (err) {
    res.status(400).json({ error: 'That team name is already registered' });
  }
});

router.put('/:slug/teams/:id', auth, async (req, res) => {
  const event = await Event.findById(req.eventId);
  if (!event?.isRegistration) return res.status(404).json({ error: 'Team registration is unavailable here' });

  const name = req.body.name?.trim();
  const members = Array.isArray(req.body.members)
    ? req.body.members.map(member => String(member).trim()).filter(Boolean)
    : [];
  if (!name) return res.status(400).json({ error: 'Team name is required' });

  try {
    const team = await Team.findByIdAndUpdate(req.params.id, { name, members }, { new: true, runValidators: true });
    if (!team) return res.status(404).json({ error: 'Team not found' });
    await syncTeamsToEvents();
    res.json(team);
  } catch (err) {
    res.status(400).json({ error: 'That team name is already registered' });
  }
});

router.delete('/:slug/teams/:id', auth, async (req, res) => {
  const event = await Event.findById(req.eventId);
  if (!event?.isRegistration) return res.status(404).json({ error: 'Team registration is unavailable here' });

  const team = await Team.findByIdAndDelete(req.params.id);
  if (!team) return res.status(404).json({ error: 'Team not found' });
  const participants = await Participant.find({ team: team._id }).select('_id');
  await Points.deleteMany({ participant: { $in: participants.map(participant => participant._id) } });
  await Participant.deleteMany({ team: team._id });
  res.json({ success: true });
});

// ADD TEAM/PARTICIPANT
router.post('/:slug/participants', auth, async (req, res) => {
  const event = await Event.findById(req.eventId);
  if (event.isRegistration) return res.status(400).json({ error: 'Use team registration to manage teams' });
  if (event.finalized) return res.status(400).json({ error: 'Event is finalized, cannot add teams' });

  const { name } = req.body;
  if (!name || !name.trim()) return res.status(400).json({ error: 'Team name is required' });

  try {
    const participant = await Participant.create({ event: event._id, name: name.trim() });
    res.json(participant);
  } catch (err) {
    res.status(400).json({ error: 'That team already exists for this event' });
  }
});

// REMOVE TEAM/PARTICIPANT
router.delete('/:slug/participants/:id', auth, async (req, res) => {
  const event = await Event.findById(req.eventId);
  if (event.finalized) return res.status(400).json({ error: 'Event is finalized, cannot remove teams' });

  await Participant.deleteOne({ _id: req.params.id, event: event._id });
  await Points.deleteOne({ participant: req.params.id, event: event._id });
  res.json({ success: true });
});

// SAVE POINTS (bulk, one row per team) - body: { entries: [{ participantId, scores, reason }] }
// Automatically calculates totals/ranks on read; here we only persist raw scores
// and log any change to a value that already existed.
router.put('/:slug/points', auth, async (req, res) => {
  const event = await Event.findById(req.eventId);
  if (event.finalized) return res.status(400).json({ error: 'Event is finalized, editing is disabled' });

  const { entries } = req.body;
  if (!Array.isArray(entries)) return res.status(400).json({ error: 'Invalid request body' });

  const validKeys = event.scoringFields.map(f => f.key);
  const fieldConfig = Object.fromEntries(event.scoringFields.map(f => [f.key, f]));

  for (const entry of entries) {
    const { participantId, scores = {}, reason } = entry;
    const participant = await Participant.findOne({ _id: participantId, event: event._id });
    if (!participant) continue;

    // Validate every field before writing anything for this row
    for (const key of Object.keys(scores)) {
      if (!validKeys.includes(key)) continue;
      const val = Number(scores[key]);
      const conf = fieldConfig[key];
      if (scores[key] === '' || scores[key] === null) continue; // allow blank/untouched cells
      if (isNaN(val)) return res.status(400).json({ error: `Invalid number entered for ${conf.label} (${participant.name})` });
      if (!conf.allowNegative && val < 0) return res.status(400).json({ error: `${conf.label} cannot be negative` });
      if (conf.max !== null && conf.max !== undefined && val > conf.max) {
        return res.status(400).json({ error: `${conf.label} cannot exceed ${conf.max}` });
      }
    }

    let pointsDoc = await Points.findOne({ event: event._id, participant: participantId });
    if (!pointsDoc) {
      pointsDoc = new Points({ event: event._id, participant: participantId, scores: {} });
    }

    for (const key of Object.keys(scores)) {
      if (!validKeys.includes(key)) continue;
      if (scores[key] === '' || scores[key] === null) continue;
      const newVal = Number(scores[key]);
      const oldVal = pointsDoc.scores.get(key);

      // Existing value changed -> gets logged; a reason is optional.
      if (oldVal !== undefined && oldVal !== null && oldVal !== newVal) {
        await Change.create({
          event: event._id,
          participantName: participant.name,
          field: fieldConfig[key].label,
          oldValue: oldVal,
          newValue: newVal,
          reason: reason?.trim() || 'Not provided'
        });
      }
      pointsDoc.scores.set(key, newVal);
    }

    await pointsDoc.save();
  }

  res.json({ success: true });
});

// FINALIZE EVENT - locks points/ranking/winner
router.post('/:slug/finalize', auth, async (req, res) => {
  const event = await Event.findById(req.eventId);
  event.finalized = true;
  event.status = 'completed';
  await event.save();
  res.json({ success: true });
});

// UPDATE STATUS (upcoming/live) - lets coordinator mark event as live on the day
router.put('/:slug/status', auth, async (req, res) => {
  const event = await Event.findById(req.eventId);
  const { status } = req.body;
  if (!['upcoming', 'live'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  if (event.finalized) return res.status(400).json({ error: 'Event is finalized' });
  event.status = status;
  await event.save();
  res.json({ success: true });
});

module.exports = router;
