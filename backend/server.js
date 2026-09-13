require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const eventsRouter = require('./routes/events');
const overallRouter = require('./routes/overall');
const coordinatorRouter = require('./routes/coordinator');
const aartiRouter = require('./routes/aarti');
const teamsRouter = require('./routes/teams');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json());

app.use('/api/events', eventsRouter);
app.use('/api/overall-leaderboard', overallRouter);
app.use('/api/coordinator', coordinatorRouter);
app.use('/api/aarti-schedule', aartiRouter);
app.use('/api/teams', teamsRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

// Generic error handler so the frontend always gets a JSON error, not a crash
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  });
