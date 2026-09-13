const Event = require('../models/Event');
const Participant = require('../models/Participant');
const Team = require('../models/Team');

async function migrateExistingParticipants() {
  if (await Team.exists({})) return;

  const existing = await Participant.find().select('name').lean();
  const names = [...new Set(existing.map(participant => participant.name.trim()).filter(Boolean))];
  if (names.length === 0) return;

  await Team.insertMany(names.map(name => ({ name, members: [] })), { ordered: false }).catch(() => {});
}

async function syncTeamsToEvents() {
  await migrateExistingParticipants();
  const teams = await Team.find().sort({ name: 1 });
  const events = await Event.find({ isRegistration: { $ne: true }, finalized: { $ne: true } });

  for (const event of events) {
    for (const team of teams) {
      const existing = await Participant.findOne({ event: event._id, $or: [{ team: team._id }, { name: team.name }] });
      if (existing) {
        existing.team = team._id;
        existing.name = team.name;
        await existing.save();
      } else {
        await Participant.create({ event: event._id, team: team._id, name: team.name });
      }
    }
  }

  return teams;
}

module.exports = { syncTeamsToEvents };