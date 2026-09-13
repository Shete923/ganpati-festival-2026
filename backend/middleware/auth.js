const jwt = require('jsonwebtoken');

// Verifies the JWT AND that it belongs to the event named in the URL,
// so an Office Olympics coordinator can never edit Rapid Fire, etc.
function coordinatorAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided' });

  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.slug !== req.params.slug) {
      return res.status(403).json({ error: 'Not authorized for this event' });
    }
    req.eventId = decoded.eventId;
    req.slug = decoded.slug;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired session, please log in again' });
  }
}

module.exports = coordinatorAuth;
