const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const Event = require('../models/Event');
const Participant = require('../models/Participant');
const Points = require('../models/Points');
const Change = require('../models/Change');
const { buildLeaderboard } = require('../utils/ranking');
const { syncTeamsToEvents } = require('../utils/teams');
const { guessSongRules, rapidFireRules } = require('../utils/eventRules');

// GET all events (public list) - never expose password hashes
router.get('/', async (req, res) => {
  const filter = req.query.includeRegistration === 'true' ? {} : { isRegistration: { $ne: true } };
  const events = await Event.find(filter).sort({ date: 1 }).select('-coordinatorPasswordHash');
  if (req.query.includeRegistration === 'true' && !events.some(event => event.slug === 'team-registration')) {
    events.unshift({
      name: 'Team Registration',
      slug: 'team-registration',
      date: '2026-09-13',
      isRegistration: true
    });
  }
  res.json(events);
});

// GET single event with leaderboard + change history (public)
router.get('/:slug', async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug }).select('-coordinatorPasswordHash');
  if (!event) return res.status(404).json({ error: 'Event not found' });
  if (event.isRegistration) return res.status(404).json({ error: 'Event not found' });
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

// CSV export - event results
router.get('/:slug/export/results.csv', async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug });
  if (!event) return res.status(404).send('Event not found');

  const participants = await Participant.find({ event: event._id }).populate('team', 'members');
  const pointsList = await Points.find({ event: event._id });
  const leaderboard = buildLeaderboard(participants, pointsList, event.scoringFields);

  const fields = ['rank', 'name', ...event.scoringFields.map(f => f.key), 'total'];
  const rows = leaderboard.map(r => {
    const row = { rank: r.rank, name: r.name, total: r.total };
    event.scoringFields.forEach(f => { row[f.key] = r.scores[f.key] || 0; });
    return row;
  });

  const parser = new Parser({ fields });
  const csv = parser.parse(rows);
  res.header('Content-Type', 'text/csv');
  res.attachment(`${event.slug}_results.csv`);
  res.send(csv);
});

// CSV export - change history
router.get('/:slug/export/changes.csv', async (req, res) => {
  const event = await Event.findOne({ slug: req.params.slug });
  if (!event) return res.status(404).send('Event not found');

  const changes = await Change.find({ event: event._id }).sort({ createdAt: 1 });
  const parser = new Parser({ fields: ['participantName', 'field', 'oldValue', 'newValue', 'reason', 'createdAt'] });
  const csv = parser.parse(changes.map(c => c.toObject()));
  res.header('Content-Type', 'text/csv');
  res.attachment(`${event.slug}_changes.csv`);
  res.send(csv);
});

module.exports = router;
