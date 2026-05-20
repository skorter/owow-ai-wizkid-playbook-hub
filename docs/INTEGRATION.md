# OWOW Playbook Hub — Integration Guide

## 1. Project overview

**OWOW Playbook AI** (WizKid Playbook Hub) is an internal employee playbook with HR admin tooling. Employees browse published policies and guides, complete onboarding, search the playbook with AI, and ask questions about individual articles. HR admins manage articles, categories, onboarding steps, feedback, missing-info reports, and analytics.

**Stack:** Next.js (App Router) + TypeScript frontend, Express + Prisma + PostgreSQL backend, JWT auth, OpenAI via backend only.

**Local URLs:**

- Frontend: `http://localhost:3000` (default Next.js port)
- Backend: `http://localhost:5001`

## 2. Architecture overview

```
┌─────────────────┐     HTTPS/JSON      ┌──────────────────┐
│  Next.js UI     │ ◄─────────────────► │  Express API     │
│  (employee +    │   JWT Bearer        │  + Prisma        │
│   admin areas)  │                     │  + OpenAI client │
└─────────────────┘                     └────────┬─────────┘
                                                 │
                                                 ▼
                                        ┌──────────────────┐
                                        │  PostgreSQL      │
                                        └──────────────────┘
```

- **No direct OpenAI calls from the browser.**
- **Mappers** in `frontend/src/lib/mappers/` translate API shapes to UI types.
- **API client** in `frontend/src/lib/api/` centralizes fetch, auth headers, and errors.

## 3. Frontend / backend separation

| Layer | Responsibility |
|--------|----------------|
| `frontend/src/lib/api/` | HTTP client, endpoints, AI helpers, unwrap utilities |
| `frontend/src/lib/mappers/` | Domain mapping (articles, playbook, admin, feedback, etc.) |
| `frontend/src/app/playbook/` | Employee experience |
| `frontend/src/app/admin/` | HR admin experience |
| `backend/src/routes/` | REST route mounting |
| `backend/src/services/` | Business logic, AI, Prisma access |
| `backend/src/middleware/` | Auth, roles, errors |

## 4. Employee experience

Routes under `/playbook/*` (guarded by `PlaybookAuthGuard`):

- **Dashboard** — entry, search shortcut, support actions
- **Search** — Phase 12 global AI search (`POST /api/ai/search`)
- **Topics** — categories and article links
- **Article** `/playbook/[slug]` — published content + Phase 13 ask-page AI
- **Onboarding** — steps linked to published articles; local progress in browser
- **Profile** — session user, onboarding progress, AI status indicator

Employees only receive **PUBLISHED** articles from public article endpoints.

## 5. HR / admin experience

Routes under `/admin/*` (guarded by `AdminAuthGuard`, role `HR_ADMIN`):

- **Dashboard** — overview, recent articles, actions
- **Documents hub** — articles, categories, onboarding editor, missing requests, drafts/archived filters
- **Analytics** — metrics and placeholders from analytics API

Admins use `/api/articles/admin/*` and full article CRUD including drafts and archived statuses.

## 6. Authentication flow

1. User submits email/password on `/login`.
2. Backend `POST /api/auth/login` returns JWT + user.
3. Frontend stores token (`authToken` in `localStorage`) and user snapshot.
4. Protected routes call `GET /api/auth/me` to refresh session.
5. **Logout** clears token and session; guards redirect to `/login`.
6. **Expired/invalid token** → `401` → session cleared → redirect login.
7. **Employee on admin URL** → redirect to `/playbook/dashboard`.
8. **Non-admin token on admin routes** → `403` or role check → redirect employee area.

## 7. Role permissions

| Role | Access |
|------|--------|
| `EMPLOYEE`, `NEW_EMPLOYEE` | Playbook routes, feedback, missing-info submit, AI search/ask-page |
| `HR_ADMIN` | All employee capabilities + admin CMS, analytics, feedback/missing-info lists |

Backend enforces roles with `authMiddleware` + `roleMiddleware("HR_ADMIN")` on admin mutations and lists.

## 8. Public vs admin content separation

| Concern | Employee | Admin |
|---------|----------|-------|
| Article list | `GET /api/articles` — published only | `GET /api/articles/admin/all` — all statuses |
| Article by slug | Published only | N/A (use admin by id) |
| Onboarding | Published linked articles only | Full step editor, unpublished warnings |
| AI search corpus | Published articles only | Same endpoint; admin UI uses search separately |

Unpublished slugs return **404** for employees (article unavailable UI).

## 9. Onboarding flow

- Steps stored in `OnboardingStep` + `OnboardingStepArticle` (multi-article per step).
- Employee API returns active steps with **published** articles only.
- Completion tracked in **browser localStorage** (`onboardingProgress` key per user).
- Returning from article with `?from=onboarding&step=N` updates onboarding UI.

## 10. Feedback flow

- Employee submits via `FeedbackModal` → `POST /api/feedback` (authenticated).
- Payload type `ARTICLE` when `articleId` present; message includes rating prefix.
- Admin lists/updates/deletes via documents hub / feedback APIs.

## 11. Missing information request flow

- Employee submits via `MissingInfoModal` → `POST /api/missing-info`.
- Admin triages in Documents hub **Missing Requests** tab.
- AI no-result copy encourages missing-info submission on global search.

## 12. AI integration

| Endpoint | Purpose |
|----------|---------|
| `GET /api/ai/status` | Configured vs fallback, model names |
| `POST /api/ai/search` | Global playbook search (Phase 12) |
| `POST /api/ai/ask-page` | Single-article Q&A (Phase 13) |

Frontend: `@/lib/api/ai` — `getAIStatus`, `aiSearch`, `askPageAI`.

See also [AI_SETUP.md](./AI_SETUP.md) for environment variables.

## 13. AI Search behavior (Phase 12)

1. Validate question (required, max 500 chars).
2. Load all **PUBLISHED** articles.
3. Extract **significant terms** (stopwords removed: `owow`, `policy`, question words, etc.).
4. Rank articles; require meaningful term overlap and minimum top score (0.25).
5. If no sources → standard no-result message, `confidence: 0`, **no OpenAI call**.
6. If sources → OpenAI chat with source excerpts, or keyword fallback answer.
7. Save `SearchLog` (`source: PLAYBOOK_SEARCH`); failures logged only server-side.

**Imaginary example:** “Does OWOW have a dragon feeding policy?” → empty sources, HR missing-info message.

## 14. Ask AI About This Page (Phase 13)

1. Validate question + `articleId` or `slug` (or `pageContext` only).
2. Load **one published** article.
3. Relevance check (summary-style questions always allowed; multi-term questions require all terms in article).
4. If not relevant → fixed no-info sentence for **this article only**.
5. OpenAI or excerpt fallback from **that article only** — no global search.
6. Save `SearchLog` (`source: AI_CHAT`).

**Imaginary on-page example:** “Can I feed dragons while working remotely?” on Remote Work Policy → no-info in current article.

## 15. Fallback mode

Enabled when `AI_SEARCH_USE_OPENAI=false` or API key missing/invalid.

- **Search:** short answer from top ranked sources; `fallback: true`.
- **Ask-page:** excerpt/summary from current article; `fallback: true`.
- **Provider** field may still show `openai` if key exists but request fails — UI treats `fallback` flag for messaging.

## 16. Environment variables

**Backend** (`backend/.env` — never commit):

| Variable | Purpose |
|----------|---------|
| `PORT` | API port (5001) |
| `DATABASE_URL` | PostgreSQL |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Auth tokens |
| `OPENAI_API_KEY` | OpenAI (backend only) |
| `OPENAI_MODEL` | Chat model |
| `AI_SEARCH_USE_OPENAI` | `true` to enable OpenAI |
| `AI_SEARCH_MAX_SOURCES`, `AI_SEARCH_MIN_SCORE` | Ranking tuning |

**Frontend** (`frontend/.env.local`):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend base URL |

Copy from `backend/.env.example` and `frontend/.env.example` (placeholders only).

## 17. Security notes

- **OpenAI API key lives only in `backend/.env`.**
- **Frontend never calls OpenAI.**
- **Do not commit** `backend/.env` or real keys.
- **`.env.example` files** use placeholders only.
- Before commits run:
  ```bash
  git grep -n "sk-"
  git grep -n "sk-proj-"
  ```
  Expect only docs/examples/route paths — not real keys.
- JWT sent as `Authorization: Bearer <token>`.
- Raw provider errors are not exposed to clients.

## 18. Known limitations

- Keyword ranking only (no embeddings / pgvector).
- Ask-page and search use strict term overlap; common words can affect ranking.
- Onboarding completion is local-only until server tracking is added.
- Profile AI toggles are UI placeholders (confidence/tone not persisted).
- Static preview articles (no API id) hide ask-page AI panel.
- OpenAI key may need `model.request` scope for chat completions.

## 19. Future improvements

- Semantic search (embeddings) and pgvector
- Server-side onboarding completion
- Persisted user AI preferences
- Phase 14+ analytics depth
- Related-question suggestions on search results

## Related docs

- [API_MAPPING.md](./API_MAPPING.md) — endpoint table
- [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) — manual QA
- [AI_SETUP.md](./AI_SETUP.md) — OpenAI setup
