const express = require('express');
const AartiSchedule = require('../models/AartiSchedule');
const { ensureAartiSchedule } = require('../utils/aartiSchedule');

const router = express.Router();

router.get('/', async (req, res) => {
  await ensureAartiSchedule();
  const schedule = await AartiSchedule.find().sort({ date: 1 });
  res.json(schedule);
});

module.exports = router;
