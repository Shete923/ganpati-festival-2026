const mongoose = require('mongoose');

const aartiScheduleSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  day: { type: String, required: true },
  morning: { type: String, default: '' },
  evening: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('AartiSchedule', aartiScheduleSchema);
