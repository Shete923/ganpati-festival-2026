const mongoose = require('mongoose');

const pointsSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  participant: { type: mongoose.Schema.Types.ObjectId, ref: 'Participant', required: true },
  // Map of scoringField.key -> numeric value, e.g. { g1: 8, g2: 10 }
  scores: { type: Map, of: Number, default: {} }
}, { timestamps: true });

pointsSchema.index({ event: 1, participant: 1 }, { unique: true });

module.exports = mongoose.model('Points', pointsSchema);
