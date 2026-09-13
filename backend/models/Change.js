const mongoose = require('mongoose');

const changeSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  participantName: { type: String, required: true },
  field: { type: String, required: true },
  oldValue: { type: Number, required: true },
  newValue: { type: Number, required: true },
  reason: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Change', changeSchema);
