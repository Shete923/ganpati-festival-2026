// Shared calculation logic so totals/ranks are computed the same way everywhere
// (public pages, coordinator dashboard, CSV export, overall leaderboard).

function computeTotal(scores, scoringFields) {
  return scoringFields.reduce((sum, f) => sum + (Number(scores[f.key]) || 0), 0);
}

function buildLeaderboard(participants, pointsList, scoringFields) {
  const pointsByParticipant = {};
  pointsList.forEach(p => { pointsByParticipant[p.participant.toString()] = p; });

  const rows = participants.map(p => {
    const pointsDoc = pointsByParticipant[p._id.toString()];
    const scores = pointsDoc ? Object.fromEntries(pointsDoc.scores) : {};
    const total = computeTotal(scores, scoringFields);
    return { participantId: p._id.toString(), name: p.name, members: p.team?.members || [], scores, total };
  });

  // Sort descending by total, then assign dense competition ranking (ties share a rank)
  rows.sort((a, b) => b.total - a.total);
  let rank = 0;
  let prevTotal = null;
  let position = 0;
  rows.forEach(r => {
    position += 1;
    if (r.total !== prevTotal) {
      rank = position;
      prevTotal = r.total;
    }
    r.rank = rank;
  });

  return rows;
}

module.exports = { computeTotal, buildLeaderboard };
