# OWOW Playbook AI — OpenAI setup (Phase 11.11+)

This document describes how OpenAI is wired for **backend-only** AI Search. Phase 11.11 prepares configuration and status endpoints; **Phase 12** implements full search and answers.

## Install OpenAI SDK (backend only)

```bash
cd backend
npm install openai
```

Do **not** install `openai` in the frontend.

## Environment variables

Add these to `backend/.env` (never commit the real file):

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small
AI_SEARCH_USE_OPENAI=true
AI_SEARCH_MAX_SOURCES=5
AI_SEARCH_MIN_SCORE=0.15
```

Copy from `backend/.env.example` for local development defaults.

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | Secret key from [OpenAI API keys](https://platform.openai.com/api-keys) |
| `OPENAI_MODEL` | Chat model for answers (Phase 12) |
| `OPENAI_EMBEDDING_MODEL` | Embedding model for retrieval (Phase 12+) |
| `AI_SEARCH_USE_OPENAI` | `true` to enable OpenAI when key is present |
| `AI_SEARCH_MAX_SOURCES` | Max articles passed to the model (default `5`) |
| `AI_SEARCH_MIN_SCORE` | Min relevance score for keyword ranking (default `0.15`) |

## Why OpenAI is backend-only

- The API key must never reach the browser.
- Do **not** use `NEXT_PUBLIC_OPENAI_API_KEY`.
- The Next.js app calls Express (`NEXT_PUBLIC_API_URL`, default `http://localhost:5001`).
- Only `backend/src/services/openaiClient.js` initializes the OpenAI client.

## Fallback mode

The server **always starts**, even without a key.

| Condition | `configured` | `provider` |
|-----------|--------------|------------|
| `AI_SEARCH_USE_OPENAI=false` or missing `OPENAI_API_KEY` | `false` | `fallback` |
| `AI_SEARCH_USE_OPENAI=true` and valid `OPENAI_API_KEY` | `true` | `openai` |

`GET /api/ai/status` never returns the API key or raw env values.

## Test `/api/ai/status`

### Without OpenAI

```env
AI_SEARCH_USE_OPENAI=false
# OPENAI_API_KEY unset or commented
```

```bash
cd backend && npm run dev
```

```http
GET http://localhost:5001/api/ai/status
```

Expected:

```json
{
  "configured": false,
  "provider": "fallback",
  "model": "gpt-4.1-mini",
  "embeddingModel": "text-embedding-3-small",
  "maxSources": 5,
  "minScore": 0.15
}
```

### With OpenAI

```env
OPENAI_API_KEY=sk-...
AI_SEARCH_USE_OPENAI=true
```

Restart the backend, then:

```http
GET http://localhost:5001/api/ai/status
```

Expected: `"configured": true`, `"provider": "openai"`.

### Placeholder search (authenticated)

```http
POST http://localhost:5001/api/ai/search
Authorization: Bearer <employee-or-admin-jwt>
Content-Type: application/json

{ "question": "How do I request leave?" }
```

Phase 11.11 returns a placeholder answer and empty `sources` — not full RAG yet.

## Frontend helpers (Phase 12)

- `getAIStatus()` → `GET /api/ai/status`
- `aiSearch(question)` → `POST /api/ai/search`
- `askPageAI({ question, slug?, articleId?, pageContext? })` → `POST /api/ai/ask-page`

Import from `@/lib/api` or `@/lib/api/ai`.

## Troubleshooting

| Issue | Check |
|-------|--------|
| Always `fallback` | `AI_SEARCH_USE_OPENAI=true` and non-empty `OPENAI_API_KEY` |
| Backend won't start | Unrelated to OpenAI — client is lazy-loaded |
| 401 on `/api/ai/search` | Send `Authorization: Bearer <token>` from login |
| Key in logs | Never log `aiConfig.apiKey`; grep codebase if unsure |

## Phase 12 (implemented)

- `POST /api/ai/search` loads **PUBLISHED** articles only, ranks matches, calls OpenAI chat (or fallback), saves `SearchLog`
- `/playbook/search` uses `aiSearch()` with loading, answer, and source cards

## Phase 13 (implemented)

- `POST /api/ai/ask-page` — answers from **one** published article (by `slug` or `articleId`); optional `pageContext` append only
- Article page `/playbook/[slug]` — **Ask AI about this page** panel (published API articles only)
- `SearchLog` entries use source `AI_CHAT` for ask-page questions

## Phase 14 (documentation & polish)

- Integration guide, API mapping table, manual testing checklist
- Shared API error helpers and loading/error UI patterns

## Phase 15+ (next)

- Embeddings / semantic ranking (optional)
- Related questions from search context

No pgvector or vector DB yet.

## Related docs

- [INTEGRATION.md](./INTEGRATION.md) — architecture, auth, AI behavior, security
- [API_MAPPING.md](./API_MAPPING.md) — endpoint table
- [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) — manual QA
