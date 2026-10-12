# Vacations System

Full Stack project: MongoDB | Node.js (TypeScript) | React (TypeScript)

A vacations browsing and management system with Like/Unlike, AI-powered destination
recommendations, and a natural-language chat interface backed by a real MCP (Model
Context Protocol) server built into the backend.

## GitHub repository

https://github.com/SamuelSion/vacations-system

## Verified local status

Verified with Docker Compose on 2026-10-12:

- MongoDB, backend, and frontend containers are healthy.
- The frontend loads vacation data and images from the backend.
- User and admin login, and the admin likes report endpoint, work.
- Backend and frontend TypeScript production builds pass.

## Running the project

Requires Docker and Docker Compose.

```bash
docker compose up -d --build
```

This starts three services:
- **mongo** — MongoDB database (port 27017)
- **backend** — Node.js/Express REST API (port 4000)
- **frontend** — React app (port 5173)

Every service has a healthcheck, and each one starts only after the service it
depends on is `healthy` (MongoDB, then Backend, then Frontend). Check with `docker ps`.

A one-off **seed** job runs on every `docker compose up`. It is safe to repeat:
it fills the database with 14 real vacation destinations (with real photos) and a
few demo likes only when the database has no vacations yet, so it never deletes
existing data. It also makes sure the three demo accounts below exist and work.

> If the demo accounts ever return 401 (for example after `HASH_SALT` was changed),
> run `docker compose run --rm seed` - it resets their passwords to the ones below.
> Changing `HASH_SALT` makes the passwords of all other users invalid.

Open the app at: **http://localhost:5173**

### Demo accounts

| Role  | Name         | Email                  | Password    |
|-------|--------------|------------------------|-------------|
| Admin | Dana Levi    | admin@vacations.com    | admin1234   |
| User  | Moshe Cohen  | user@vacations.com     | user1234    |
| User  | Noa Shapira  | noa@vacations.com      | noa1234     |

### Environment variables

Copy `.env.example` to `.env` at the project root and fill in:
- `OPENAI_API_KEY` — required for the AI Recommendation page and the MCP chat page.
- `JWT_SECRET` / `HASH_SALT` — change these to any random strings for a real deployment.

## Project structure

```
Database/     MongoDB export (for submission)
Backend/      Node.js + Express + TypeScript REST API, MCP server, seed script
Frontend/     React + TypeScript + MUI client
```

## Architecture notes

- **Auth:** JWT-based, password hashed with HMAC-SHA512 + salt. Role is always
  forced server-side on registration (never trusted from the client).
- **MCP:** A real MCP server (`@modelcontextprotocol/sdk`) is built in the backend,
  exposing tools to query the vacations database (counts, averages, filters by
  status/country). An AI agent (LangChain `createAgent`) runs server-side and
  uses those tools - through a real in-process MCP Client <-> Server connection
  (via `InMemoryTransport`) - to answer free-text questions, keeping the OpenAI
  API key on the server and requiring no public tunnel.
- **Images:** Uploaded vacation images are stored on disk in the backend
  (`src/assets/images`); only the file name is stored in MongoDB.
