Empowered Indian — Backend API (Node/Express + MongoDB)

Overview
This service powers the Empowered Indian API, serving data for political/administrative hierarchies, public works and expenditures (MPLADS/MLAADS), analytics, and civic engagement features.

Stack
- Node.js + Express
- MongoDB / Mongoose
- Helmet, CORS, rate limiting, sanitizers for security
- Sentry for error monitoring

Getting Started
- Requirements: Node.js 18+, MongoDB Atlas or local MongoDB
- Install: `npm install`
- Dev: `npm run dev` (default: http://localhost:5000)
- Start: `npm start`

Environment Variables
Copy `.env.example` to `.env` and set values:
- `MONGODB_URI` — Connection string (DO NOT COMMIT)
- `DATABASE_NAME` — Database name
- `JWT_SECRET` and `JWT_EXPIRES_IN` — Auth token settings
- `CORS_ORIGINS` — Comma-separated list of allowed origins
- `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_APP_PASSWORD`, `EMAIL_FROM_NAME`
- `FRONTEND_URL` — For email verification links
- `SENTRY_DSN` — Error monitoring DSN
- Performance and security tuning: `ENABLE_RATE_LIMIT`, `DB_*`, `CACHE_TTL_*`

Scripts
- `npm run dev` — Start with nodemon
- `npm start` — Start in production
- `npm run lint` / `npm run lint:fix` — ESLint (flat config)
- `npm run create-indexes` — Ensure required DB indexes
- `npm run analyze-performance` / `npm run db-optimize` — Diagnostics

API
- Base path: `/api`
- Health: `GET /health`
- See routes in `routes/` for available endpoints.

Security
- Never commit `.env` or secrets. Use `.env.example` as a template only.
- Rotate any credentials previously committed and rewrite history before publishing.
- Validate inputs and avoid exposing internal error details in production.

License
AGPL-3.0. See `LICENSE`.

Code of Conduct
See `CODE_OF_CONDUCT.md` for community expectations.
