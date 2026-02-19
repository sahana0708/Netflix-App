# Netflix Clone

Full-stack Netflix-style app: **React** (frontend), **Node.js/Express** (backend), **PostgreSQL on Aiven** (database), **TMDB API** (movies).

## Features

- **Auth:** Sign Up (username, email, password) and Login. Passwords hashed with bcrypt. Protected routes; redirect to Login when not authenticated.
- **Landing (protected):** Dark Netflix-style UI, hero banner (trending movie), Movies Recommendation carousel, genre rows (Action, Comedy, Horror, Romance, Sci-Fi, Thriller) via TMDB.

## Prerequisites

- Node.js 18+
- PostgreSQL database (e.g. Aiven). Backend uses a `.env` with `DATABASE_URL`, TMDB keys, and optionally `NODE_TLS_REJECT_UNAUTHORIZED=0` for Aiven SSL.

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env   # if you need a template; project may already have .env
# Edit .env: DATABASE_URL, TMDB_API_KEY, TMDB_READ_ACCESS_TOKEN, PORT, FRONTEND_URL
# For Aiven, add: NODE_TLS_REJECT_UNAUTHORIZED=0
npm install
npm run init-db       # creates `users` table
npm run dev           # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev           # http://localhost:5173 (proxies /api to backend)
```

### 3. Use the app

- Open **http://localhost:5173**. You’ll be redirected to Login.
- Use **Sign up** to create an account (username, email, password).
- After signup you’re sent to **Login**. Log in to reach the main **Landing** page (hero + carousel + genre rows).

## Project layout

- `backend/` – Express API: `/api/auth/signup`, `/api/auth/login`, `/api/movies/trending`, `/api/movies/recommendations`, `/api/movies/by-genre/:id`; DB connection and `users` table.
- `frontend/` – React (Vite), Tailwind, AuthContext, Sign Up / Login pages, protected Landing with TMDB data.

## Env vars (backend `.env`)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (e.g. Aiven) |
| `TMDB_API_KEY` | TMDB API key |
| `TMDB_READ_ACCESS_TOKEN` | TMDB read access token (Bearer) |
| `PORT` | Server port (default 5000) |
| `FRONTEND_URL` | Frontend origin for CORS (e.g. http://localhost:5173) |
| `NODE_TLS_REJECT_UNAUTHORIZED` | Set to `0` for Aiven/self-signed DB cert if needed |
