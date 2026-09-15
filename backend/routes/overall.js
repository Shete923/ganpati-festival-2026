const express = require('express');
const router = express.Router();
const { Parser } = require('json2csv');
const Event = require('../models/Event');
const Participant = require('../models/Participant');
const Points = require('../models/Points');
const { buildLeaderboard } = require('../utils/ranking');

// Aggregates overall points across all FINALIZED events.
// Teams are matched across events by name (case-insensitive), since the same
// team names (Team A, Team B...) are expected to participate across events.
async function computeOverall() {
  const events = await Event.find({ finalized: true });
  const totals = {}; // normalizedName -> { name, total }

  for (const event of events) {
    const participants = await Participant.find({ event: event._id });
    const pointsList = await Points.find({ event: event._id });
    const leaderboard = buildLeaderboard(participants, pointsList, event.scoringFields);
    const pointsArr = event.overallPoints || [];

    leaderboard.forEach(row => {
      const key = row.name.trim().toLowerCase();
      const idx = row.rank - 1;
      const awarded = idx < pointsArr.length ? pointsArr[idx] : (pointsArr[pointsArr.length - 1] || 0);
      if (!totals[key]) totals[key] = { name: row.name, total: 0 };
      totals[key].total += awarded;
    });
  }

  const rows = Object.values(totals).sort((a, b) => b.total - a.total);
  let rank = 0, prevTotal = null, position = 0;
  rows.forEach(r => {
    position += 1;
    if (r.total !== prevTotal) { rank = position; prevTotal = r.total; }
    r.rank = rank;
  });
  return rows;
}

async function isChampionshipReady() {
  const events = await Event.find({ isRegistration: { $ne: true } }).select('finalized');
  return events.length > 0 && events.every(event => event.finalized);
}

router.get('/', async (req, res) => {
  if (!(await isChampionshipReady())) return res.json([]);
  res.json(await computeOverall());
});

router.get('/export.csv', async (req, res) => {
  if (!(await isChampionshipReady())) return res.status(403).json({ error: 'Overall leaderboard is locked until all events are finalized' });
  const rows = await computeOverall();
  const parser = new Parser({ fields: ['rank', 'name', 'total'] });
  const csv = parser.parse(rows);
  res.header('Content-Type', 'text/csv');
  res.attachment('overall_leaderboard.csv');
  res.send(csv);
});

module.exports = router;
