const express = require('express');
const Team = require('../models/Team');

const router = express.Router();

// Public roster; team changes remain coordinator-only.
router.get('/', async (req, res) => {
  const teams = await Team.find().sort({ name: 1 }).select('name members');
  res.json(teams);
});

module.exports = router;
