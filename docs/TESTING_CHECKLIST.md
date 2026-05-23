# Manual testing checklist — OWOW Playbook Hub

Use this before demos, PR merge, or release. Check boxes as you complete each item.

---

## 1. Setup

- [ ] PostgreSQL running and `DATABASE_URL` set in `backend/.env`
- [ ] `cd backend && npm install && npx prisma migrate deploy` (or `prisma migrate dev` on dev)
- [ ] `cd backend && npx prisma db seed` (if demo data needed)
- [ ] `backend/.env` copied from `backend/.env.example` with real secrets **not** committed
- [ ] `cd backend && npm run dev` — API on `http://localhost:5001`
- [ ] `frontend/.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:5001`
- [ ] `cd frontend && npm install && npm run dev` — UI on `http://localhost:3000`
- [ ] `GET http://localhost:5001/api/health` returns OK

---

## 2. Auth tests

- [ ] Login as **employee** — lands in playbook area
- [ ] Login as **HR admin** — can open `/admin/dashboard`
- [ ] Logout — token cleared; protected routes redirect to `/login`
- [ ] Refresh page while logged in — session restored via `/api/auth/me`
- [ ] Open `/admin/dashboard` as employee — redirected to playbook (not admin)
- [ ] Invalid/expired token — redirected to login (no crash)
- [ ] Navigation shows correct links for role

---

## 3. Employee tests

- [ ] **Dashboard** loads; search bar navigates to search
- [ ] **Topics** loads categories and published articles
- [ ] **Article detail** `/playbook/[slug]` loads published content
- [ ] Unpublished/missing slug shows unavailable state (not draft body)
- [ ] **Onboarding** lists steps; only published articles in steps
- [ ] Mark article complete (local progress) works from onboarding flow
- [ ] **Profile** shows user; edit profile saves via API
- [ ] **Feedback** submit from dashboard/article/search — success message
- [ ] **Missing info** submit — success message
- [ ] Feedback/missing-info errors show friendly message (disconnect backend to verify)

---

## 4. Admin tests

- [ ] **Admin dashboard** loads metrics and recent articles
- [ ] **Documents hub** — Articles tab: list, filter, create, edit, delete
- [ ] **Categories** tab: CRUD works
- [ ] **Onboarding** tab: create/edit steps, multi-article links
- [ ] **Missing Requests** tab: list and status updates
- [ ] **Drafts** filter shows draft articles only
- [ ] **Archived** filter shows archived articles
- [ ] Unpublished article warnings visible in onboarding editor where applicable
- [ ] **Analytics** page loads (placeholders/empty states OK)
- [ ] Tab load errors show message + retry (disconnect API briefly)

---

## 5. AI tests

### Status

- [ ] `GET /api/ai/status` — `configured` matches `AI_SEARCH_USE_OPENAI` + key
- [ ] Profile **AI Settings** shows backend status line (loading → ready/error)

### Global search (Phase 12)

- [ ] `POST /api/ai/search` — `"How does onboarding work?"` → sources + `confidence > 0`
- [ ] `"What is the remote work policy?"` → Remote Work Policy in sources
- [ ] `"Does OWOW have a dragon feeding policy?"` → `sources: []`, `confidence: 0`, `fallback: true`, HR missing-info answer
- [ ] Empty question → **400** with message
- [ ] UI `/playbook/search?q=...` shows loading, answer, sources; no crash on error

### Ask-page (Phase 13)

- [ ] `POST /api/ai/ask-page` — slug `remote-work-policy`, `"What should I remember from this policy?"` → answer + `source.title` = Remote Work Policy
- [ ] Same slug, `"Summarize this article"` → summary-style answer
- [ ] Same slug, `"Can I feed dragons while working remotely?"` → no-info in **current article**, `fallback: true`
- [ ] Empty question → **400**
- [ ] Slug `does-not-exist` → **404**
- [ ] Draft slug (if any) as employee → **404** / unavailable (no draft body)
- [ ] Article page **Ask AI** panel: loading, answer, retry on error

### Fallback mode

- [ ] Set `AI_SEARCH_USE_OPENAI=false`, restart backend
- [ ] Search still returns answers from sources (fallback)
- [ ] Ask-page still returns article-based fallback
- [ ] No unrelated articles in ask-page response

---

## 6. Regression tests

- [ ] Phase 12 dragon search still no-result (see above)
- [ ] Phase 13 ask-page still single-article only
- [ ] Employee onboarding skips unpublished linked articles
- [ ] Admin onboarding UI warns on unpublished links
- [ ] `SearchLog` rows created for search and ask-page (Prisma Studio optional)
- [ ] Stop DB / break SearchLog — AI response still returns 200

---

## 7. Build / lint

```bash
cd frontend && npm run lint && npm run build
```

- [ ] Frontend lint passes
- [ ] Frontend build passes

Backend (no lint script in package.json):

```bash
cd backend && node -e "require('./src/app')"
```

- [ ] Backend app module loads without error

---

## 8. Secret safety (before commit)

```bash
git status --short
git grep -n "sk-"
git grep -n "sk-proj-"
```

- [ ] No real API keys in tracked files
- [ ] `backend/.env` not staged
- [ ] Only placeholder keys in `.env.example` / docs

---

## Postman quick pack

| Request | Expected |
|---------|----------|
| `GET /api/ai/status` | 200, `configured` boolean |
| `POST /api/ai/search` + onboarding question | 200, sources non-empty |
| `POST /api/ai/search` + dragon question | 200, `sources: []` |
| `POST /api/ai/ask-page` + valid slug | 200, `source` populated |
| `POST /api/ai/ask-page` + dragon question | 200, no-info answer |
| `POST /api/ai/ask-page` + `question: ""` | 400 |

---

## Sign-off

| Tester | Date | Notes |
|--------|------|-------|
| | | |
