# Vacations System

Full Stack project: MongoDB | Node.js (TypeScript) | React (TypeScript)

A vacations browsing and management system with Like/Unlike, AI-powered destination
recommendations, and a natural-language chat interface backed by a real MCP (Model
Context Protocol) server built into the backend.

## GitHub repository

https://github.com/SamuelSion/vacations-system


## Running the project

Requires Docker and Docker Compose.

```bash
docker compose up -d --build
```

This starts three services:
- **mongo** — MongoDB database (port 27017)
- **backend** — Node.js/Express REST API (port 4000)
- **frontend** — React app (port 5173)


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


### Automated tests

- **Backend** (Mocha + Chai + Supertest): `npm test` inside `Backend/`. Needs MongoDB running and
  a `.env` file. The tests create and delete their own users and vacations. With Docker running:
  `docker compose exec backend npm test`.
- **Frontend** (Vitest + Testing Library): `npm test` inside `Frontend/`. No server needed.


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
