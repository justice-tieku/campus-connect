# CampusConnect

Web platform for university students to publish project ideas, recruit teammates, and browse campus opportunities. Admins moderate users and content.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS (`frontend/`)
- Backend: Node.js, Express, Prisma (`backend/`)
- Database: PostgreSQL
- Auth: bcrypt password hashes + JWT in an **httpOnly** cookie (`cc_token`)

## Prerequisites

- Node.js 20+
- Docker Desktop (recommended) **or** a local PostgreSQL 16 instance
- Windows PowerShell examples below; paths with spaces are quoted

## Setup

```powershell
cd "C:\Users\Justice\Documents\campus connect"

# 1. Start Postgres
docker compose up -d

# 2. Backend env (never commit real secrets)
copy backend\.env.example backend\.env

# 3. Install, generate Prisma client, apply migrations, seed demo data
cd backend
npm install
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed

# 4. Frontend
cd ..\frontend
npm install
```

If you are not using Docker, set `DATABASE_URL` in `backend\.env` to your Postgres connection string, then run the Prisma commands.

### Environment variables (`backend/.env`)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | Signing key for session cookies |
| `PORT` | API port (default `4000`) |
| `CLIENT_ORIGIN` | Frontend origin for CORS (default `http://localhost:5173`) |
| `NODE_ENV` | `development` or `production` |
| `COOKIE_SECURE` | Set `true` behind HTTPS in production |

See `backend/.env.example`.

## Run locally

Use two terminals.

```powershell
cd "C:\Users\Justice\Documents\campus connect\backend"
npm run dev
```

```powershell
cd "C:\Users\Justice\Documents\campus connect\frontend"
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). Vite proxies `/api` to the backend so cookies stay first-party in development.

## Demo accounts

These are **synthetic** seed credentials, not real people:

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@campusconnect.dev` | `AdminDemo123!` |
| Student (project owner) | `student@campusconnect.dev` | `StudentDemo123!` |
| Student (joiner) | `teammate@campusconnect.dev` | `TeammateDemo123!` |

Public registration always creates a **student**. Admin accounts are seeded or granted in the database.

## Tests

```powershell
cd "C:\Users\Justice\Documents\campus connect\backend"
npm test
```

Tests need a reachable Postgres (`DATABASE_URL` in `.env`) and cover registration/login cookies, profile updates, project search, join-request authorization, and admin-route blocking.

## API

Route list: [docs/api.md](docs/api.md).

## Deploy (do not deploy without hosting credentials)

1. Provision PostgreSQL and set `DATABASE_URL` + a strong `JWT_SECRET`.
2. Run `npx prisma migrate deploy` and `npm run prisma:seed` (or skip seed in production).
3. Backend: `npm run build` then `npm start` on a Node host (Render, Fly, Railway, etc.). Set `CLIENT_ORIGIN` to the frontend URL, `COOKIE_SECURE=true`, and `NODE_ENV=production`.
4. Frontend: `npm run build` and serve `frontend/dist` (Vercel/Netlify/static host). Point the app at the API via a reverse proxy or same-origin `/api`, or set CORS accordingly.

## Security notes

- Passwords are hashed with bcrypt; plaintext is never stored.
- Protected routes require a valid cookie; students cannot call `/api/admin/*` or edit another user’s projects.
- Login and register are rate-limited. Helmet and CORS are enabled.

## Later (not in this MVP)

Socket.IO messaging, richer notifications, Cloudinary uploads, extra opportunity application flows.
