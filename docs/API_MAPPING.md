# API mapping — frontend ↔ backend

Base URL (local): `http://localhost:5001`

Auth column: **Public** = no JWT; **Optional** = JWT attached if present; **Required** = JWT required; **Admin** = JWT + `HR_ADMIN` role.

---

## Auth

| Area | Method | Endpoint | Auth | Used by | Description |
|------|--------|----------|------|---------|-------------|
| Auth | POST | `/api/auth/register` | Public | (optional) | Register user |
| Auth | POST | `/api/auth/login` | Public | `/login` | Login; returns JWT + user |
| Auth | GET | `/api/auth/me` | Required | Guards, profile | Current user / session refresh |
| Auth | PUT | `/api/auth/me` | Required | Profile edit modal | Update name/profile fields |

---

## Health

| Area | Method | Endpoint | Auth | Used by | Description |
|------|--------|----------|------|---------|-------------|
| Health | GET | `/api/health` | Public | Dev / ops | API health |
| Health | GET | `/api/health/database` | Public | Dev / ops | DB connectivity |

---

## Articles

| Area | Method | Endpoint | Auth | Used by | Description |
|------|--------|----------|------|---------|-------------|
| Articles | GET | `/api/articles` | Public | Topics, search suggestions, playbook mappers | Published articles list (filters: category, search) |
| Articles | GET | `/api/articles/slug/:slug` | Public | `/playbook/[slug]` | Published article by slug |
| Articles | GET | `/api/articles/:id` | Public | (legacy/id links) | Published article by id |
| Articles | GET | `/api/articles/admin/all` | Admin | Admin documents hub | All statuses; filters for drafts/archived |
| Articles | GET | `/api/articles/admin/:id` | Admin | Article editor | Single article any status |
| Articles | POST | `/api/articles` | Admin | Create article modal | Create article |
| Articles | PUT | `/api/articles/:id` | Admin | Edit article modal | Update title, content, **status** (DRAFT/PUBLISHED/ARCHIVED) |
| Articles | DELETE | `/api/articles/:id` | Admin | Admin dashboard / documents | Delete article |

Publish/archive/restore are done via **PUT** `status` field, not separate routes.

---

## Categories

| Area | Method | Endpoint | Auth | Used by | Description |
|------|--------|----------|------|---------|-------------|
| Categories | GET | `/api/categories` | Public | Topics, documents hub | Category list |
| Categories | GET | `/api/categories/:id` | Public | Admin category edit | Single category |
| Categories | POST | `/api/categories` | Admin | New category modal | Create category |
| Categories | PUT | `/api/categories/:id` | Admin | Edit category | Update category |
| Categories | DELETE | `/api/categories/:id` | Admin | Delete category | Delete category |

---

## Onboarding

| Area | Method | Endpoint | Auth | Used by | Description |
|------|--------|----------|------|---------|-------------|
| Onboarding | GET | `/api/onboarding` | Required | Employee onboarding, admin tab | List steps (employee: published articles only) |
| Onboarding | GET | `/api/onboarding/:id` | Required | Admin step editor | Single step |
| Onboarding | POST | `/api/onboarding` | Admin | Create step modal | Create step + article links |
| Onboarding | PUT | `/api/onboarding/:id` | Admin | Edit step modal | Update step / multi-article links |
| Onboarding | DELETE | `/api/onboarding/:id` | Admin | Delete step | Remove step |

---

## Feedback

| Area | Method | Endpoint | Auth | Used by | Description |
|------|--------|----------|------|---------|-------------|
| Feedback | POST | `/api/feedback` | Required | `FeedbackModal` (article, search, dashboard, topics) | Submit feedback |
| Feedback | GET | `/api/feedback` | Admin | Documents / admin lists | List feedback |
| Feedback | GET | `/api/feedback/:id` | Admin | Detail | Single feedback |
| Feedback | PUT | `/api/feedback/:id` | Admin | Admin edit | Update feedback |
| Feedback | DELETE | `/api/feedback/:id` | Admin | Admin delete | Delete feedback |

---

## Missing info

| Area | Method | Endpoint | Auth | Used by | Description |
|------|--------|----------|------|---------|-------------|
| Missing info | POST | `/api/missing-info` | Required | `MissingInfoModal` | Submit missing-info report |
| Missing info | GET | `/api/missing-info` | Admin | Documents — Missing Requests tab | List reports |
| Missing info | GET | `/api/missing-info/:id` | Admin | Detail drawer | Single report |
| Missing info | PUT | `/api/missing-info/:id` | Admin | Status update | Update status (OPEN/REVIEWED/RESOLVED) |
| Missing info | DELETE | `/api/missing-info/:id` | Admin | Delete | Delete report |

---

## AI

| Area | Method | Endpoint | Auth | Used by | Description |
|------|--------|----------|------|---------|-------------|
| AI | GET | `/api/ai/status` | Public | Profile AI settings, dev | OpenAI configured vs fallback |
| AI | GET | `/api/ai/` | Public | Dev | Module ready message |
| AI | POST | `/api/ai/search` | Optional | `/playbook/search` | Global playbook AI search (Phase 12) |
| AI | POST | `/api/ai/ask-page` | Optional | `/playbook/[slug]` Ask panel | Single-article AI (Phase 13) |

---

## Analytics

| Area | Method | Endpoint | Auth | Used by | Description |
|------|--------|----------|------|---------|-------------|
| Analytics | GET | `/api/analytics/overview` | Admin | `/admin/analytics` | Dashboard overview metrics |
| Analytics | GET | `/api/analytics/searches` | Admin | Analytics | Search-related stats |
| Analytics | GET | `/api/analytics/popular-questions` | Admin | Analytics, admin dashboard | Popular questions |
| Analytics | GET | `/api/analytics/feedback` | Admin | Analytics | Feedback stats |
| Analytics | GET | `/api/analytics/missing-info` | Admin | Analytics | Missing-info stats |
| Analytics | GET | `/api/analytics/usage-trends` | Admin | Analytics | Usage trends |
| Analytics | GET | `/api/analytics/peak-hours` | Admin | Analytics | Peak hours |
| Analytics | GET | `/api/analytics/unanswered-questions` | Admin | Analytics | Unanswered / weak matches |
| Analytics | GET | `/api/analytics/performance` | Admin | Analytics | Performance placeholder |

---

## Frontend API modules

| Module | Path | Role |
|--------|------|------|
| Client | `frontend/src/lib/api/client.ts` | fetch, JWT, `ApiError` |
| Endpoints | `frontend/src/lib/api/endpoints.ts` | Path constants |
| AI | `frontend/src/lib/api/ai.ts` | AI status, search, ask-page |
| Errors | `frontend/src/lib/api/errors.ts` | `getApiErrorMessage` |
| Unwrap | `frontend/src/lib/api/unwrap.ts` | List/entity response helpers |
| Mappers | `frontend/src/lib/mappers/*.ts` | Articles, playbook, feedback, missing-info, onboarding, admin |

---

## Response shapes (AI)

**Search** `POST /api/ai/search`:

```json
{
  "answer": "string",
  "sources": [{ "id", "title", "slug", "summary", "category", "score" }],
  "confidence": 0,
  "provider": "openai | fallback",
  "fallback": true
}
```

**Ask-page** `POST /api/ai/ask-page`:

```json
{
  "answer": "string",
  "source": { "id", "title", "slug", "summary", "category" },
  "confidence": 0,
  "provider": "openai | fallback",
  "fallback": true
}
```

Errors: `{ "message": "..." }` with HTTP 400 / 404 / 401 / 403 / 500.
