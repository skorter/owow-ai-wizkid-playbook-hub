# OWOW Playbook AI — Backend

Phase 1 goal: a clean, scalable backend foundation (Express + PostgreSQL + Prisma).

## Setup

1) Install dependencies:

```bash
cd backend
npm install
```

2) Create your environment file:

- Copy `.env.example` to `.env`
- Update `DATABASE_URL` to your local Postgres credentials/database

3) Generate Prisma client:

```bash
npm run prisma:generate
```

## Run the server

Development (auto-restart):

```bash
npm run dev
```

Production style:

```bash
npm start
```

## Health check

Open in your browser or Postman:

- `GET http://localhost:5000/api/health`

Expected JSON:

```json
{
  "success": true,
  "message": "OWOW Playbook AI backend is running",
  "timestamp": "..."
}
```

