require('dotenv').config();
const mongoose = require('mongoose');
const Team = require('./models/Team');

const nameChanges = [
  ['Sonali Garade', 'Sonali Garade Mam'],
  ['Sonali Gorade', 'Sonali Garade Mam'],
  ['Sudhir Gorade', 'Sudhir Gorade Sir']
];

async function migrateParticipantNames() {
  await mongoose.connect(process.env.MONGO_URI);

  for (const [oldName, newName] of nameChanges) {
    const result = await Team.updateMany(
      { members: oldName },
      { $set: { 'members.$[member]': newName } },
      { arrayFilters: [{ member: oldName }] }
    );
    console.log(`${oldName} -> ${newName}: updated ${result.modifiedCount} team(s)`);
  }

  await mongoose.disconnect();
}

migrateParticipantNames().catch(async error => {
  console.error('Participant name migration failed:', error);
  await mongoose.disconnect();
  process.exitCode = 1;
});