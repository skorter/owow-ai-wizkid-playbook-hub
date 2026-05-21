# OWOW Playbook AI — Frontend–Backend Integration Audit

**Document type:** Phase 1 — Project audit (documentation only)  
**Project:** OWOW Playbook AI / WizKid Helper  
**Date:** May 2026  
**Status:** No application code changes in this phase

---

## Executive summary

The OWOW Playbook AI platform consists of a **Next.js frontend** (premium dark admin UI + employee playbook) and an **Express + Prisma + PostgreSQL backend** with JWT authentication and role-based access. The admin experience is **fully designed on mock data**; the backend exposes **real CRUD and analytics APIs** that are **not yet connected** to the frontend.

This audit maps what exists today, identifies gaps on both sides, outlines integration risks, and defines a phased plan for connecting frontend and backend without rewriting the architecture or redesigning existing pages.

---

## 1. Current project overview

### Repository structure

| Area | Path | Stack |
|------|------|--------|
| Frontend | `frontend/` | Next.js 16 (App Router), React, TypeScript, CSS Modules, Lucide icons |
| Backend | `backend/` | Express, Prisma, PostgreSQL, JWT, bcrypt |
| Database | `backend/prisma/` | PostgreSQL via `DATABASE_URL` |

### Design constraints (must preserve)

- Premium OWOW dark SaaS UI (charcoal cards, yellow accents, custom SVG charts)
- Admin sidebar: **Dashboard**, **Analytics**, **Documents** only
- Admin routes: `/admin/dashboard`, `/admin/analytics`, `/admin/documents`
- No chart libraries (custom SVG only)
- Avoid new dependencies unless strictly necessary
- Do not rewrite the app architecture or remove existing routes/layouts

### Two parallel content systems

Today the product runs on **two disconnected data layers**:

| Surface | Data source |
|---------|-------------|
| Admin (`/admin/*`) | `frontend/src/data/adminMockData.ts` |
| Employee playbook (`/playbook/*`) | Static files under `frontend/src/lib/data/*` |
| Login | `frontend/src/lib/data/auth.ts` + `localStorage` |
| Backend API + DB | Seeded via `backend/prisma/seed.js` |

The frontend performs **no HTTP API calls** (`fetch`, `/api/`, or `NEXT_PUBLIC_*` usage was not found). The backend is runnable and testable via Postman; admin pages do not consume it yet.

### Product vision

The platform is intended to serve as:

- Internal company knowledge system  
- AI onboarding assistant  
- HR/admin content management hub  
- Analytics dashboard  
- AI-powered employee support platform  

---

## 2. Frontend routes and features

### 2.1 Route map

| Route | Purpose | Data source |
|-------|---------|-------------|
| `/` | Landing placeholder | None |
| `/login` | Sign-in; redirects by role | Mock users (`MOCK_USERS`) |
| `/admin/dashboard` | HR admin overview | `adminMockData.ts` |
| `/admin/analytics` | Usage and performance insights | `adminMockData.ts` |
| `/admin/documents` | Content management hub | `adminMockData.ts` + local React state |
| `/admin/profile` | Admin profile shell | Static / placeholder |
| `/playbook/dashboard` | Employee home | `lib/data/*` |
| `/playbook/search` | AI search UI (client state) | `lib/data/search.ts` |
| `/playbook/topics` | Category browser | `lib/data/categories.ts` |
| `/playbook/onboarding` | Onboarding journey | `lib/data/onboarding.ts` |
| `/playbook/[slug]` | Article page shell | `categories.ts` (slug lookup) |
| `/playbook/profile` | Profile and settings | `lib/data/user.ts`, `profile.ts` |

### 2.2 Admin shell

**Layout:** `frontend/src/components/admin/AdminLayout/AdminLayout.tsx`  
**Navigation:** Dashboard, Analytics, Documents (fixed; do not expand without product decision)

**Shared components:**

- `AdminPageContainer`, `AdminMetricCard`, `AdminPanelCard`
- `AdminButton`, `AdminStatusBadge`
- Design tokens: `admin-tokens.css`

### 2.3 Admin Dashboard (`/admin/dashboard`)

| Feature | Implementation |
|---------|----------------|
| KPI metric cards | `dashboardMetrics` |
| Most searched topics bar chart | `TopicsBarChart` → `searchedTopics` |
| Content distribution donut | `ContentDonutChart` → `contentDistributionSegments` |
| Missing information requests panel | `dashboardMissingInfo` |
| Recent articles panel | `dashboardRecentArticles` |
| Interactions | Hover tooltips, glow, responsive layout |

### 2.4 Admin Analytics (`/admin/analytics`)

| Feature | Implementation |
|---------|----------------|
| Analytics KPI cards | `analyticsMetrics` |
| Usage trends (7-day dual line) | `UsageTrendsChart` → `usageTrendsData` |
| Peak usage hours | `PeakHoursChart` → `peakHoursChartData` |
| Unanswered questions panel | `analyticsUnansweredQuestions` |
| Performance cards | `performanceCards` |
| Visual polish | Gradient fills, glow, tooltips |

### 2.5 Admin Documents (`/admin/documents`)

**Title:** Documents & Content (broader CMS hub than articles alone)

| Area | Features |
|------|----------|
| KPI cards | Total articles, published, drafts, categories |
| Toolbar | Search, category/status/sort filters, grid/list toggle |
| Management tabs | Articles, Categories, Onboarding, Missing Requests, Drafts, Archived |
| Article flows | Create drawer, edit drawer, preview drawer; publish / save draft / archive (local state) |
| Category flow | Create modal (name, slug, description, color, visibility — UI only for extra fields) |
| Insights panel | Content health score (82%), most viewed, most requested missing topic, recent edits, AI suggestions, missing queue |
| Feedback | Toast on local actions; no API |

**Supporting components:** `ManagementTabs`, `InsightsPanel`, `ArticleHubDrawers`, `CategoryFormModal`, `HubDrawer`, `HubModal`, `HubToast`

### 2.6 Employee playbook (integration deferred)

Employee routes are **UI-complete on static data**. They should be integrated **after** admin auth and CMS paths are stable. Key files:

- `lib/data/categories.ts` — hierarchical topics (not 1:1 with DB category list)
- `lib/data/onboarding.ts` — grouped steps (differs from backend flat `OnboardingStep`)
- `lib/data/search.ts`, `answer.ts` — mock AI responses

### 2.7 Authentication (frontend today)

- **Login:** `frontend/src/app/login/page.tsx` validates against `MOCK_USERS`
- **Storage:** `localStorage` keys `role` (`admin` | `user`) and `user` JSON
- **Routing:** `admin` → `/admin/dashboard`; else → `/playbook/dashboard`
- **Admin guard:** No Next.js middleware; `/admin` routes are not server-protected

---

## 3. Backend endpoints and models

### 3.1 Runtime configuration

| Variable | Purpose |
|----------|---------|
| `PORT` | Default `5001` (see `backend/.env.example`) |
| `DATABASE_URL` | PostgreSQL connection |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | Token signing |
| `BCRYPT_SALT_ROUNDS` | Password hashing |
| `OPENAI_API_KEY` | Reserved for future AI (not wired) |

### 3.2 Prisma models

| Model | Purpose |
|-------|---------|
| `User` | `email`, `fullName`, `passwordHash`, `role` (`HR_ADMIN`, `EMPLOYEE`, `NEW_EMPLOYEE`) |
| `Category` | `name`, `slug` (unique) |
| `Article` | `title`, `slug`, `summary`, `content`, `tags`, `status` (`DRAFT`, `PUBLISHED`, `ARCHIVED`), `categoryId`, `authorId` |
| `SearchLog` | `question`, `answer`, `source`, `userId` |
| `Feedback` | `type`, `message`, optional `articleId`, `userId` |
| `MissingInfoReport` | `type`, `title`, `description`, `status` (`OPEN`, `REVIEWED`, `RESOLVED`), optional links |
| `OnboardingStep` | `title`, `content`, `order`, `isActive`, optional `articleId` |

**Not in schema:** article view counts, category description/color/visibility, content health score.

### 3.3 API endpoints

Base URL: `http://localhost:5001` (example)

#### Health

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/health` | Public |

#### Authentication

| Method | Path | Auth | Response |
|--------|------|------|----------|
| POST | `/api/auth/register` | Public | User + token (`EMPLOYEE` only) |
| POST | `/api/auth/login` | Public | User + token |
| GET | `/api/auth/me` | Bearer | Current user |

#### Articles

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/api/articles` | Public | **Published only**; `?category`, `?search` |
| GET | `/api/articles/slug/:slug` | Public | Published only |
| GET | `/api/articles/:id` | Public | Published only |
| POST | `/api/articles` | `HR_ADMIN` | Create |
| PUT | `/api/articles/:id` | `HR_ADMIN` | Update (incl. status) |
| DELETE | `/api/articles/:id` | `HR_ADMIN` | Hard delete |

#### Categories

| Method | Path | Auth |
|--------|------|------|
| GET | `/api/categories` | Public |
| GET | `/api/categories/:id` | Public |
| POST | `/api/categories` | `HR_ADMIN` |
| PUT | `/api/categories/:id` | `HR_ADMIN` |
| DELETE | `/api/categories/:id` | `HR_ADMIN` (blocked if articles exist) |

#### Feedback

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/feedback` | Authenticated |
| GET | `/api/feedback` | `HR_ADMIN` |
| GET/PUT/DELETE | `/api/feedback/:id` | `HR_ADMIN` |

#### Missing information

| Method | Path | Auth |
|--------|------|------|
| POST | `/api/missing-info` | Authenticated |
| GET | `/api/missing-info` | `HR_ADMIN` (optional `?status`) |
| GET/PUT/DELETE | `/api/missing-info/:id` | `HR_ADMIN` |

#### Analytics (all `HR_ADMIN`)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/analytics/overview` | Counts: users, articles by status, searches, feedback, missing info, onboarding |
| GET | `/api/analytics/searches` | Total + recent search logs |
| GET | `/api/analytics/popular-questions` | Grouped question counts |
| GET | `/api/analytics/feedback` | Feedback by type + recent |
| GET | `/api/analytics/missing-info` | Missing info breakdown + recent |

#### Onboarding

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| GET | `/api/onboarding` | Bearer | Active steps; `?includeInactive=true` for `HR_ADMIN` |
| GET | `/api/onboarding/:id` | Bearer | |
| POST/PUT/DELETE | `/api/onboarding` | `HR_ADMIN` | Full CRUD |

#### AI

| Method | Path | Status |
|--------|------|--------|
| GET | `/api/ai` | **Placeholder** (`aiReady` only; no search) |

### 3.4 Seed data (integration testing)

| Email | Role | Password |
|-------|------|----------|
| `hr.admin@owow.example` | `HR_ADMIN` | `Password123` |
| `employee@owow.example` | `EMPLOYEE` | `Password123` |
| `new.employee@owow.example` | `NEW_EMPLOYEE` | `Password123` |

Categories, articles, and onboarding steps are seeded from `backend/prisma/seed.js` (slugs aligned with playbook content, not admin mock labels).

---

## 4. Mock data that needs API replacement

### 4.1 Admin — `frontend/src/data/adminMockData.ts`

| Mock export | Used by | Replace with |
|-------------|---------|--------------|
| `dashboardMetrics` | Dashboard KPIs | `GET /api/analytics/overview` (+ mapping) |
| `searchedTopics` | Topics bar chart | `GET /api/analytics/popular-questions` |
| `contentDistributionSegments` | Donut chart | Category article counts (overview or categories + articles) |
| `dashboardMissingInfo` | Dashboard panel | `GET /api/analytics/missing-info` or `GET /api/missing-info` |
| `dashboardRecentArticles` | Dashboard panel | Recent articles query (admin list — see backend gaps) |
| `analyticsMetrics` | Analytics KPIs | Partial: overview/feedback; several KPIs have **no API** |
| `usageTrendsData` | Usage trends chart | **No API** — new endpoint or aggregation |
| `peakHoursChartData` | Peak hours chart | **No API** — new endpoint |
| `analyticsUnansweredQuestions` | Analytics panel | **No API** — derive or new endpoint |
| `performanceCards` | Analytics footer | **No API** — derive or new endpoint |
| `documentStats` | Documents KPIs | `GET /api/analytics/overview` |
| `documentsList` | Articles / drafts / archived tabs | Admin articles API (all statuses) |
| `contentCategories` | Categories tab | `GET /api/categories` (+ article counts) |
| `onboardingSteps` | Onboarding tab | `GET /api/onboarding?includeInactive=true` |
| `missingInfoRequests` | Missing tab | `GET /api/missing-info` |
| `documentInsights` | Insights panel | Mix of analytics + missing-info; **content health** remains undefined in API |

### 4.2 Employee — `frontend/src/lib/data/*` (later phases)

| File | Replace with |
|------|----------------|
| `auth.ts` | `POST /api/auth/login`, `GET /api/auth/me` |
| `categories.ts` | Categories + articles API (requires navigation/content migration strategy) |
| `onboarding.ts` | `GET /api/onboarding` (mapper for grouped vs flat model) |
| `search.ts`, `answer.ts` | Future `POST /api/ai/*` + `SearchLog` |
| `user.ts`, `profile.ts` | `/me` and future profile endpoints |

### 4.3 Login

| Current | Target |
|---------|--------|
| `MOCK_USERS` + `localStorage` role `admin`/`user` | JWT + backend roles `HR_ADMIN` / `EMPLOYEE` / `NEW_EMPLOYEE` |

---

## 5. Backend gaps

### 5.1 Required for admin CMS

1. **Admin article listing** — List all statuses with filters (`status`, `category`, `search`) for `HR_ADMIN`. Current `GET /api/articles` returns **published only**.
2. **Admin article by ID** — Fetch draft/archived by id for edit drawer (current get-by-id is published-only).
3. **Category article counts** — For categories table and content distribution donut (`_count.articles` or dedicated field).

### 5.2 Required for analytics page parity

4. **Usage trends** — Daily searches and active users over N days.  
5. **Peak usage hours** — Hour-of-day aggregation from `SearchLog.createdAt`.  
6. **Optional metrics** — Search success rate, average response time, daily active users (may need AI pipeline or heuristics on `SearchLog.answer`).

### 5.3 Required for product vision

7. **AI search MVP** — Implement `aiService` + routes; persist `SearchLog`.  
8. **Ask AI about current page** — Contextual endpoint for article/page assistant.  
9. **Optional schema extensions** — `Article.views`, `Category.description`, `Category.color`, `Category.isActive`.

### 5.4 Behavioral / data-shape gaps

| Gap | Detail |
|-----|--------|
| Archive vs delete | UI “archive” → `status: ARCHIVED`; “delete permanently” → `DELETE` (hard delete) |
| Missing info types | Enum values (`MISSING_ARTICLE`, `OUTDATED_INFORMATION`, etc.) ≠ UI labels (`Policy gap`, `Benefits`) — map in frontend |
| Request counts | UI shows aggregated counts per topic; API returns individual reports — aggregate client- or server-side |
| Restore archived | Use `PUT` with `status: DRAFT` or `PUBLISHED` (no dedicated restore route) |

---

## 6. Frontend gaps

1. **API client layer** — Base URL, Bearer token, typed responses, error handling.  
2. **Real authentication** — Login, JWT storage, `/me`, logout, role mapping.  
3. **Route protection** — Middleware or guard for `/admin/*` (currently open).  
4. **Data mappers** — Backend enums ↔ UI labels (status, roles, missing-info types).  
5. **Loading / empty / error states** — All admin data surfaces.  
6. **Documents hub** — Replace local `useState` seeds with API + refetch after mutations.  
7. **Category form** — API accepts `name`/`slug` only; color/visibility/description need schema extension or UI-only fields.  
8. **Onboarding admin tab** — Map `content`, `order`, `isActive`, `articleId` vs current display fields.  
9. **Employee playbook** — Still static; connect after admin path is proven.  
10. **Admin profile** — Replace hardcoded user in `AdminLayout` with `/me`.  
11. **Gradual mock removal** — Shrink `adminMockData.ts` to dev fallbacks only.

---

## 7. Integration risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Dual content models | Admin mock ≠ DB seed ≠ `categories.ts` hierarchy | Phased migration; mappers; single source of truth per surface |
| Role mismatch | `admin`/`user` vs `HR_ADMIN`/`EMPLOYEE` | Central role map in auth layer |
| Published-only reads | Drafts/archived invisible to admin | Backend admin articles endpoint first |
| `categoryId` vs name | Forms use names; API needs IDs | Load categories into selects before create/edit |
| No view counts | UI shows “views” | Add schema or hide column until supported |
| Analytics ahead of API | Charts without endpoints | New analytics routes or simplify UI interim |
| AI not implemented | Search and ask-page blocked | Phase 10–11 after CMS + auth |
| Onboarding shape mismatch | Grouped (employee) vs flat (API) | Dedicated mappers per surface |
| CORS and env | Wrong base URL | `NEXT_PUBLIC_API_URL`, document in `.env.example` |
| Token storage | XSS vs httpOnly cookies | Document decision in Phase 3 |
| Unprotected admin routes | Anyone can open `/admin` | Middleware in Phase 3 |

---

## 8. Recommended integration phases

| Phase | Name | Scope |
|-------|------|--------|
| **1** | Project audit | This document; mapping only; **no code** |
| **2** | API client setup | `fetch` helper, env, types, error pattern |
| **3** | Authentication | Login, JWT, `/me`, admin guard, logout |
| **4** | Admin dashboard | Overview, popular questions, missing info, recent articles, donut |
| **5** | Admin analytics | Wire existing analytics; add or stub missing chart endpoints |
| **6** | Documents — articles | Admin list, CRUD, drafts/archived tabs |
| **7** | Categories | CRUD; optional schema for color/description |
| **8** | Onboarding | Admin tab ↔ `/api/onboarding` |
| **9** | Missing requests + feedback | Status updates, admin lists |
| **10** | AI search | Employee search + `SearchLog` |
| **11** | Ask AI about page | Contextual assistant |
| **12** | Final polish | Remove mocks, types, errors, role-based UI |
| **13** | Testing | Postman + E2E admin flows |
| **14** | Documentation + PR | API mapping table, test notes, PR description |

### Suggested implementation order

1. Phase 2 → Phase 3 (foundation)  
2. Phase 4 + **backend admin-articles support** (small targeted backend change before or with Phase 6)  
3. Phase 6 → 7 → 8 → 9 (CMS hub)  
4. Phase 5 (analytics; may require new backend routes)  
5. Phase 10–11 (employee AI)  
6. Phase 12–14 (quality and handoff)

### Optional Phase 1.5 (backend only)

If dashboard/documents integration is blocked:

- Extend `articleService` / routes for HR admin list (all statuses) and get-by-id (any status).  
- Add minimal analytics endpoints for usage trends and peak hours **or** agree to simplify analytics UI until data exists.

---

## 9. Files expected to change in each phase

> Paths are relative to repository root. **Create** = new file; **Modify** = existing file; **Backend** = server-side only.

### Phase 1 — Project audit

| Action | Path |
|--------|------|
| **Create** | `docs/FRONTEND_BACKEND_INTEGRATION_AUDIT.md` (this document) |

No application code changes.

---

### Phase 2 — API client setup

| Action | Path |
|--------|------|
| Create | `frontend/src/lib/api/client.ts` |
| Create | `frontend/src/lib/api/types.ts` |
| Create | `frontend/src/lib/api/endpoints.ts` (optional) |
| Create | `frontend/.env.example` (`NEXT_PUBLIC_API_URL`) |

---

### Phase 3 — Authentication connection

| Action | Path |
|--------|------|
| Modify | `frontend/src/app/login/page.tsx` |
| Modify | `frontend/src/types/auth.ts` |
| Modify | `frontend/src/components/admin/AdminLayout/AdminLayout.tsx` |
| Create | `frontend/src/lib/auth/session.ts` or `frontend/src/context/AuthProvider.tsx` |
| Create | `frontend/src/middleware.ts` |
| Deprecate / trim | `frontend/src/lib/data/auth.ts` |

---

### Phase 4 — Admin dashboard integration

| Action | Path |
|--------|------|
| Modify | `frontend/src/app/admin/dashboard/page.tsx` |
| Modify | `frontend/src/components/admin/charts/TopicsBarChart.tsx` |
| Modify | `frontend/src/components/admin/charts/ContentDonutChart.tsx` |
| Create | `frontend/src/lib/mappers/adminDashboard.ts` |
| Trim | `frontend/src/data/adminMockData.ts` (dashboard exports) |
| Backend (if needed) | `backend/src/services/articleService.js`, routes for recent/admin articles |

---

### Phase 5 — Analytics page integration

| Action | Path |
|--------|------|
| Modify | `frontend/src/app/admin/analytics/page.tsx` |
| Modify | `frontend/src/components/admin/charts/UsageTrendsChart.tsx` |
| Modify | `frontend/src/components/admin/charts/PeakHoursChart.tsx` |
| Create | `frontend/src/lib/mappers/adminAnalytics.ts` |
| Trim | `frontend/src/data/adminMockData.ts` (analytics exports) |
| Backend (if needed) | `backend/src/services/analyticsService.js`, `analyticsController.js`, `analyticsRoutes.js` |

---

### Phase 6 — Documents articles integration

| Action | Path |
|--------|------|
| Modify | `frontend/src/app/admin/documents/page.tsx` |
| Modify | `frontend/src/components/admin/documents/ArticleHubDrawers.tsx` |
| Modify | `frontend/src/components/admin/documents/CategoryFormModal.tsx` (use `categoryId`) |
| Create | `frontend/src/lib/mappers/articles.ts` |
| Trim | `frontend/src/data/adminMockData.ts` (documents list) |
| Backend (required) | `backend/src/services/articleService.js`, `backend/src/routes/articleRoutes.js`, `articleController.js` |

---

### Phase 7 — Categories integration

| Action | Path |
|--------|------|
| Modify | `frontend/src/app/admin/documents/page.tsx` (categories tab) |
| Modify | `frontend/src/components/admin/documents/CategoryFormModal.tsx` |
| Create / extend | `frontend/src/lib/mappers/categories.ts` |
| Backend (optional) | `backend/prisma/schema.prisma` + migration for description, color, `isActive` |

---

### Phase 8 — Onboarding integration

| Action | Path |
|--------|------|
| Modify | `frontend/src/app/admin/documents/page.tsx` (onboarding tab) |
| Create | `frontend/src/lib/mappers/onboarding.ts` |
| Trim | `adminMockData.ts` onboarding exports |

---

### Phase 9 — Missing requests + feedback integration

| Action | Path |
|--------|------|
| Modify | `frontend/src/app/admin/documents/page.tsx` (missing tab) |
| Create | `frontend/src/lib/mappers/missingInfo.ts` |
| Modify | Dashboard/analytics panels if feedback surfaced |
| Trim | `adminMockData.ts` missing exports |

---

### Phase 10 — AI search integration

| Action | Path |
|--------|------|
| Backend | `backend/src/services/aiService.js`, `aiController.js`, `aiRoutes.js` |
| Modify | `frontend/src/app/playbook/search/page.tsx` and related components |
| Modify | `frontend/src/lib/data/search.ts` (replace or fallback) |
| Create | `frontend/src/lib/api/ai.ts` |

---

### Phase 11 — Ask AI about this page

| Action | Path |
|--------|------|
| Backend | Extend AI routes (context + article id/slug) |
| Modify | `frontend/src/app/playbook/[slug]/page.tsx` and assistant UI components |

---

### Phase 12 — Final polish

| Action | Path |
|--------|------|
| Modify | `frontend/src/data/adminMockData.ts` (remove or dev-only) |
| Modify | Shared types under `frontend/src/types/` |
| Review | Error boundaries, loading skeletons, role-based UI |

---

### Phase 13 — Testing

| Action | Path |
|--------|------|
| Create | `docs/TESTING_INTEGRATION.md` (optional) |
| Manual | Postman collection / environment for `localhost:5001` |

---

### Phase 14 — Documentation + PR preparation

| Action | Path |
|--------|------|
| Create / update | `docs/API_MAPPING.md` |
| Update | Root `README.md` (setup, env, run both apps) |
| PR | Description with test plan and known limitations |

---

## 10. Conclusion and next steps

### What is ready today

| Layer | Status |
|-------|--------|
| Admin UI (dashboard, analytics, documents) | Complete on mock data; design stable |
| Backend auth | JWT login, register, `/me`, roles |
| Backend CMS APIs | Articles, categories, onboarding, missing-info, feedback (with noted limits) |
| Backend analytics | Overview, searches, popular questions, feedback and missing-info analytics |
| Frontend ↔ backend wiring | **Not started** |

### What must not change in integration

- Admin sidebar items and three admin routes  
- Premium dark UI and CSS Module patterns  
- Custom SVG charts (no new chart libraries)  
- Overall App Router structure and component locations (extend, do not rewrite)

### Recommended next steps

1. **Review and approve** this audit with the team.  
2. **Decide** token storage approach and `NEXT_PUBLIC_API_URL` for local/staging.  
3. **Implement Phase 2** (API client) — no UI redesign.  
4. **Implement Phase 3** (auth) — required before any `HR_ADMIN` analytics or CMS calls.  
5. **Schedule backend Phase 1.5** if needed: admin articles list (all statuses) before Phase 6.  
6. **Proceed phase by phase**; do not connect employee playbook until admin flows are verified.

### Sign-off

| Item | Value |
|------|--------|
| Phase 1 deliverable | `docs/FRONTEND_BACKEND_INTEGRATION_AUDIT.md` |
| Application code changed in Phase 1 | **None** |
| Next phase to implement | **Phase 2 — API client setup** (pending approval) |

---

*End of audit document.*
