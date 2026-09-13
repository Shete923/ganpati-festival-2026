const mongoose = require('mongoose');

// Each event defines its own scoring fields (round names / game names).
// This is what makes the system reusable instead of hard-coded per event.
const scoringFieldSchema = new mongoose.Schema({
  key: { type: String, required: true },      // internal id, e.g. "g1"
  label: { type: String, required: true },    // display name, e.g. "Blind Route"
  max: { type: Number, default: null },        // null = no max configured
  allowNegative: { type: Boolean, default: false }
}, { _id: false });

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  date: { type: String, required: true }, // ISO date string e.g. "2026-09-17"
  description: { type: String, default: '' },
  inCharge: { type: String, default: '' },
  rules: { type: String, default: 'Rules to be announced by the coordinator.' },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'completed', 'no-event'],
    default: 'upcoming'
  },
  scoringFields: {
    type: [scoringFieldSchema],
    default: () => [{ key: 'points', label: 'Points', max: null, allowNegative: false }]
  },
  // Points awarded toward the OVERALL festival leaderboard, indexed by rank position.
  // e.g. [10,7,5,3,2,1] => rank1 gets 10, rank2 gets 7, ... rank6+ gets 1 (last value repeats).
  // Configurable per event since the real distribution has not been finalized.
  overallPoints: { type: [Number], default: [10, 7, 5, 3, 2, 1] },
  coordinatorPasswordHash: { type: String, required: true },
  finalized: { type: Boolean, default: false },
  isRegistration: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
