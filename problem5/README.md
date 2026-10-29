# User API

Express + TypeScript CRUD API for users. Data is stored in SQLite.

## Requirements

- Node.js 22 or later (`node:sqlite`)

## Setup

```bash
npm install
```

## Run

Development (compile + watch):

```bash
npm run dev
```

Production:

```bash
npm run build
npm start
```

Server listens on `http://localhost:3000`.

## Config

| Env | Default | Meaning |
| --- | --- | --- |
| `PORT` | `3000` | HTTP port |
| `DATABASE_PATH` | `data/app.db` | SQLite file. Tests use `:memory:`. |

## API

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/health` | Liveness |
| POST | `/users` | Body: `name`, `email`, `status` (`active` \| `inactive`) |
| GET | `/users` | Query: `page`, `limit`, `search`, `status` |
| GET | `/users/:id` | |
| PUT | `/users/:id` | Partial body; at least one field |
| DELETE | `/users/:id` | |

Duplicate `email` returns `409`.

```bash
curl -i http://localhost:3000/health

curl -i http://localhost:3000/users \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alex","email":"alex@example.com","status":"active"}'

curl -i "http://localhost:3000/users?page=1&limit=10&search=alex&status=active"

curl -i http://localhost:3000/users/1

curl -i http://localhost:3000/users/1 \
  -X PUT \
  -H 'Content-Type: application/json' \
  -d '{"name":"Alex Updated"}'

curl -i http://localhost:3000/users/1 -X DELETE
```

## Test

```bash
npm test
```

Uses an in-memory database (`DATABASE_PATH=:memory:`).