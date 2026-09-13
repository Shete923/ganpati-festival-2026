# Ganpati Festival 2026 — Event Points & Results Management

V1.0 — React + Node/Express + MongoDB.

## What this does
Coordinators enter round/game points on their phone → the system automatically
calculates totals, event rank, event winner, overall festival points, and overall
rank. Every edit to an already-saved score is logged (old value, new value,
reason, timestamp) and shown publicly. Finalizing an event locks it. Every
event/overall/change list can be exported as CSV. No login needed to view the
public site; coordinators log in with **Event + Password** only for their own event.

## Project structure
```
backend/    Express + MongoDB API
frontend/   React (Vite) app
```

## 1. Set up MongoDB
Pick ONE:
- **Local MongoDB**: install MongoDB Community Server, run it, and use
  `mongodb://localhost:27017/ganpati-festival-2026` as your connection string.
- **MongoDB Atlas (free, no local install)**: create a free cluster at
  mongodb.com/atlas → Database Access (create a user) → Network Access (allow
  your IP, or 0.0.0.0/0 for simplicity) → Connect → copy the connection string,
  e.g. `mongodb+srv://user:pass@cluster0.xxxx.mongodb.net/ganpati-festival-2026`.

No manual schema setup is needed — Mongoose creates collections automatically
the first time data is written (the seed script does this).

## 2. Run the backend
```
cd backend
npm install
cp .env.example .env
# edit .env: set MONGO_URI to your connection string, and a real JWT_SECRET
npm run seed     # loads the festival events and Team Registration with a default coordinator password
npm run dev      # starts the API on http://localhost:5000
```

## 3. Run the frontend
```
cd frontend
npm install
npm run dev      # starts the site on http://localhost:5173
```
Open http://localhost:5173 in your browser. The Vite dev server proxies
`/api` calls to the backend automatically.

## Environment variables (backend/.env)
| Variable | Purpose | Example |
|---|---|---|
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/ganpati-festival-2026 |
| JWT_SECRET | Signs coordinator login sessions — use a long random string | a1b2c3... |
| DEFAULT_COORD_PASSWORD | Password set for every event when you run `npm run seed` | ganpati2026 |
| PORT | API port | 5000 |

## Coordinator login
All scoring events and the Team Registration workspace use the same password after seeding (`DEFAULT_COORD_PASSWORD`,
default `ganpati2026`). To give each event its own password, either:
- Change `DEFAULT_COORD_PASSWORD` per event manually in `seed.js` before
  seeding, or
- Update a specific event's password directly in MongoDB
  (`coordinatorPasswordHash` must be a bcrypt hash — you can generate one with
  `node -e "console.log(require('bcryptjs').hashSync('yourpassword',10))"`
  inside the backend folder).

## What's configurable (no code changes needed)
- **Registered teams and members** — choose **Team Registration** in Coordinator
  Login. Add teams once, maintain their member names, and the registered teams
  are automatically available in every non-finalized scoring event.
- **Scoring fields per event** — stored on each event document
  (`scoringFields: [{ key, label, max, allowNegative }]`). Office Olympics is
  pre-loaded with its 7 games; every other event defaults to a single generic
  "Points" field since exact round rules weren't finalized. Edit these
  directly in MongoDB (or add an admin field-editor screen in V2) once rules
  are confirmed.
- **Overall festival points per rank** — each event's `overallPoints` array
  (default `[10,7,5,3,2,1]`, rank 1 gets index 0, etc. — the last value repeats
  for lower ranks). Edit per event once the real point distribution is decided.
- **Event rules text, description, status** — editable directly in MongoDB.

## What's deliberately NOT built (V2 candidates)
Charts/analytics, notifications, multi-admin roles, in-app editing of scoring
config (currently done via MongoDB), self-service password reset — per the
brief, kept out of V1 to ship something working fast.

## Test workflow
1. Seed data → open frontend → Coordinator Login → pick "Team Registration".
2. Add teams and member names, then edit or remove them as needed.
3. Pick "Office Olympics" → enter points for all 7 games → Save Points.
4. Confirm totals/rank appear automatically.
5. Change one score; a reason is optional → check Change History.
6. Open the public event page in another tab → confirm the leaderboard and
   change history match.
7. Finalize Event → confirm inputs become read-only and winner is shown.
8. Export Results CSV / Changes CSV from the dashboard.
9. Go to Winners page → confirm the Overall Festival Leaderboard updated.
10. Resize the browser / open on a phone → confirm tables scroll and inputs
    are touch-friendly.

## Free public deployment

GitHub Pages hosts the React frontend. The Express API must run on a Node host,
and MongoDB must run on MongoDB Atlas; GitHub Pages cannot run Node or MongoDB.

1. Create a GitHub repository and push this project to the `main` branch.
2. Create a free Render Web Service from the repository. Render can use the
  included `render.yaml`, or set `backend` as the root directory, `npm ci` as
  the build command, and `npm start` as the start command.
3. Add `MONGO_URI`, `DEFAULT_COORD_PASSWORD`, and `CORS_ORIGIN` in Render. Set
  `CORS_ORIGIN` to the final GitHub Pages URL, for example
  `https://your-user.github.io/your-repository`.
4. Copy the Render service URL and add this GitHub repository variable under
  Settings → Secrets and variables → Actions → Variables:
  `VITE_API_URL=https://your-api.onrender.com/api`.
5. Enable GitHub Pages using GitHub Actions. The included
  `.github/workflows/deploy-frontend.yml` builds and publishes `frontend/dist`.

The public frontend uses hash URLs such as `/#/teams`, so refreshing a page on
GitHub Pages continues to work. Never commit `.env` files, database passwords,
or JWT secrets.
