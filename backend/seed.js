// Seeds the database with the 12 Ganpati Festival 2026 events.
// Run with: npm run seed
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Event = require('./models/Event');
const Team = require('./models/Team');
const AartiSchedule = require('./models/AartiSchedule');
const { guessSongRules, rapidFireRules } = require('./utils/eventRules');
const { defaultAartiSchedule } = require('./utils/aartiSchedule');

const DEFAULT_PASSWORD = process.env.DEFAULT_COORD_PASSWORD || 'ganpati2026';

// Office Olympics is the only event whose scoring structure was specified
// (its 7 games). Every other event's scoring rules were not finalized, so
// they default to a single generic "Points" field which coordinators/admins
// can reconfigure later without any code changes.
const olympicsFields = [
  'Blind Route', 'Bottle Flexible', 'Paper Cup Balance', 'Balancing Using Ball',
  'Coin Balancing', 'Pen Relay', 'Team Work Balloon'
].map((label, i) => ({ key: `g${i + 1}`, label, max: null, allowNegative: false }));

const genericFields = [{ key: 'points', label: 'Points', max: null, allowNegative: false }];
const rapidFireFields = [{ key: 'points', label: 'Points', max: null, allowNegative: true }];
const guessSongFields = [{ key: 'points', label: 'Points', max: null, allowNegative: true }];

const events = [
  { name: 'Team Registration', slug: 'team-registration', date: '2026-09-13', isRegistration: true, scoringFields: [] },
  { name: 'Sthapana (Ganpati Installation)', slug: 'sthapana', date: '2026-09-14', scoringFields: genericFields },
  { name: 'Games', slug: 'games', date: '2026-09-15', scoringFields: genericFields },
  { name: 'Rapid Fire', slug: 'rapid-fire', date: '2026-09-16', inCharge: 'Vedant & Tanuja', scoringFields: rapidFireFields, rules: rapidFireRules },
  { name: 'Olympics Activities (7 games — see Section 02)', slug: 'office-olympics', date: '2026-09-17', inCharge: 'Shraddha, Vidya, Yash, Omkar', scoringFields: olympicsFields },
  { name: 'Guess the Song (Ganpati)', slug: 'guess-song', date: '2026-09-18', inCharge: 'Piyush, Puja & Pratiksha', scoringFields: guessSongFields, rules: guessSongRules },
  { name: 'Potluck + Treasure Hunt', slug: 'potluck-treasure-hunt', date: '2026-09-19', scoringFields: genericFields },
  { name: 'Sunday — No Office Event', slug: 'sunday-no-event', date: '2026-09-20', status: 'no-event', scoringFields: genericFields },
  { name: 'Traditional Day', slug: 'traditional-day', date: '2026-09-21', scoringFields: genericFields },
  { name: 'Retro Day + Activity (to be decide)', slug: 'retro-day-activity', date: '2026-09-22', inCharge: 'Sushant & Vedant', scoringFields: genericFields },
  { name: 'Creative Storytelling', slug: 'creative-storytelling', date: '2026-09-23', inCharge: 'Harshadha Mam', scoringFields: genericFields },
  { name: 'Sports (In-door)', slug: 'sports-in-door', date: '2026-09-24', scoringFields: genericFields },
  { name: 'Visarjan', slug: 'visarjan', date: '2026-09-25', scoringFields: genericFields }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Event.deleteMany({});
  await Team.deleteMany({});
  await AartiSchedule.deleteMany({});
  await AartiSchedule.insertMany(defaultAartiSchedule);

  const hash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  for (const e of events) {
    await Event.create({ ...e, coordinatorPasswordHash: hash });
  }

  console.log(`Seeded ${events.length} events.`);
  console.log(`Default coordinator password for every event: "${DEFAULT_PASSWORD}"`);
  console.log('Change this by setting DEFAULT_COORD_PASSWORD in .env before re-seeding.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
