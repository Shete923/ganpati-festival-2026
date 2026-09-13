const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
  name: { type: String, required: true, trim: true }
}, { timestamps: true });

// Prevent the same team name being added twice to the same event
participantSchema.index({ event: 1, name: 1 }, { unique: true });

module.exports = mongoose.model('Participant', participantSchema);
