# The Challenge — Rebuild the Backend

There is **no backend** in this repo. It was deleted on purpose. The frontend
(`apps/frontend/`) runs entirely on checked-in fixtures, the database schema is
preserved, and the product requirements are untouched. Your job: **build a new
backend, in any stack you like, that makes the frontend work for real** — then
serves the public site too.

## 1. Run the starter (nothing to install beyond this)

**Prereqs:** Node 24 + `pnpm` (see `pnpm-workspace.yaml`), Docker for Postgres.

```bash
# from the repo root
pnpm install
docker compose up -d            # Postgres: postgres/postgres, db cms_eisd, :5432

cd apps/frontend
pnpm dev                        # Vite on http://localhost:5173
```

Open `/dashboard`, `/events`, `/articles`, `/achievements`. Each page renders
fixture content with no backend running:

| Page | Proves fixtures work when you see |
|------|-----------------------------------|
| `/dashboard` | "Mock Open Day" (inline `MOCK_DASHBOARD` in `Dashboard.tsx`) |
| `/events` | "Pameran Sains Tahunan" (`src/mocks/events.fixtures.ts`) |
| `/articles` | "Panel Surya Mini untuk Lab…" (`src/mocks/articles.fixtures.ts`) |
| `/achievements` | "Global Hackathon 2026" (`src/mocks/achievements.fixtures.ts`) |

**Mock mode is the default.** Every data lib reads `VITE_USE_MOCKS` and uses
fixtures unless it is explicitly `'false'`:

| Env var | Default | Meaning |
|---------|---------|---------|
| `VITE_USE_MOCKS` | unset → mocks | Set `VITE_USE_MOCKS=false` to exercise your real API (pages still fall back to fixtures on network failure, so flip it only when your server is up) |
| `VITE_API_URL` | `http://localhost:3000` | Where the frontend expects your API |

**Mock login is the default.** There is no backend session to check: opening
`/login` and submitting any non-empty username + password creates a
frontend-local mock session (persisted in `localStorage`, cleared on logout)
and navigates to `/dashboard`. Route guards read only that local flag and
never call a backend.

## 2. The data model (fixed input — do not redesign)

The content-only Prisma schema lives at **`packages/db/prisma/schema.prisma`**
(moved out of the deleted backend tree). It is the exact model the frontend
and specs assume. All four models must be served as-is:

`Event`, `MediumArticle`, `Achievement`, `AchievementMember`.

There are no user, session, or account tables — the mock login lives in
`localStorage` and needs no database.

Run `prisma migrate dev` against it yourself to create your own migration
history — none is shipped. If the owner shared the `v1-backend-reference` git
tag with you, it holds the previous working backend, its migrations, and its
`seed.ts` (useful for how the first admin user was bootstrapped — bootstrapping
it is otherwise your design decision).

## 3. The contract (what your backend must satisfy)

Base URL defaults to `http://localhost:3000`. JSON bodies. All endpoints are
open — no sessions, no credentials, no role checks. Missing/unpublished reads
get **404**; bad input gets **400** with field errors (duplicate assistant
code → **409**).

### Login (mock, frontend-local — nothing to rebuild)

The Login view at `/login` is a frontend mockup: any non-empty username +
password signs in locally and lands on `/dashboard`; logout clears the local
flag and returns to `/login`. There is no auth endpoint to implement, no
session to check, and no roles of any kind.

### Events

| Call | Notes |
|------|-------|
| `GET /api/events` | Admin list (all events). Public site uses same path published-only (see below) |
| `POST /api/events` | Creates **Draft**, generates unique slug from title (suffix on collision) |
| `PUT /api/events/:id` | Edit; drafts stay drafts, published edits go live immediately |
| `POST /api/events/:id/publish` / `/unpublish` | Stamps/clears `publishedAt` (server timestamp wins) |
| `DELETE /api/events/:id` | Permanent, behind UI confirmation |

Fields: `title`, `slug` (auto), `coverImage` (**16:9 enforced**), `headerImage`,
`galleryImages[]` (max 4), `previewDescription`, `content`, `location`,
`startDate`/`endDate` (end ≥ start), `publishedAt`. **Status is computed on
every read, never stored or edited:** `today < start` → Incoming,
`start ≤ today ≤ end` → On Going, `today > end` → Finished.

### Medium articles (URL in, metadata out)

| Call | Notes |
|------|-------|
| `GET /api/articles` | Admin list **must include drafts** (published-only is the public behavior, not the admin one) |
| `POST /api/articles { url }` | Fetches Open Graph metadata once, creates **Draft**. 400s the form classifies: `invalid` (bad URL), `unreachable` (no content/timeout), `metadata` (no OG tags) |
| `POST /api/articles/:id/publish` / `/unpublish` | Same two-state pattern as events (server timestamp) |
| `PUT /api/articles/:id`, `DELETE /api/articles/:id` | Edit (re-fetch OG on URL change) / permanent delete with confirmation |

Snapshot rule: the fetched title/description/cover/publishedDate is frozen at
save time — the public site reads the snapshot, nothing ever re-scrapes Medium.

### Dashboard

`GET /api/dashboard` (open, no authentication) returns one aggregation:
counts (`totalEvents`, `publishedEvents`, `draftEvents`, `totalArticles`,
`publishedArticles`, `draftArticles`, `upcomingEvents`, `totalAchievements`,
`finalistAchievements`, `championAchievements`), `achievementsByYear`
(`YYYY-MM` → count), `upcomingEventsList` (Incoming, soonest first),
`latestEvents`, `latestArticles`. Empty states, never errors, when there is no
content. Exactly three KPI cards (events / articles / achievements) — no drafts
card; drafts live in the per-card breakdowns.

### Uploads

`POST /api/storage/upload` (multipart) → stores in object storage (reference
used Cloudflare R2), returns a public URL; the DB keeps only the reference.
Rules: reject oversized files **before** upload with a clear limit (frontend
gates at 5 MB), validate cover 16:9, show upload progress (large galleries must
not look frozen), compress where feasible, delete orphaned images. The
frontend's `ImageUpload`/`GalleryUpload` currently simulate all of this with
timers — wire them to your endpoint with progress events.

### Public read-only API (the public website's contract)

- `GET /api/events` → published only · `GET /api/events/:slug` → one published event
- `GET /api/articles` → published only · `GET /api/articles/:id` → one published article
- `GET /api/achievements` → **all records, no published filter** · `GET /api/achievements/:id`
- Consistent JSON, 200 + payload on success, 404 for missing/unpublished.

### Achievements — ⭐ stretch scope (do last)

Achievements are in the schema and fully specified
(`openspec/specs/achievements/`), **but no reference implementation ever
existed** — not even in the tagged answer key. Build them with no answer key:

- Full CRUD at `/api/achievements[/:id]` (`PUT` for update), query filters
  `category`/`level`/`result`/`yearMonth`/`year`/`search`, ordered
  `competitionYearMonth` desc then `updatedAt` desc.
- Field rules: 1+ members, each a name + unique 4-letter code (uppercase,
  unique within and across records, duplicates → **409**); category enum
  (`Other` needs 1–100 char custom text); level `International`/`National`;
  result `1st/2nd/3rd Place` (= Champions) or `Finalist`; name 1–200 chars;
  year-month strict `YYYY-MM`. Bad input → **400** with field errors.
- No draft state — created records are immediately visible and publicly served.

## 4. Definition of done (V1 success criteria)

You are done when an admin can, unassisted (**from `PLAN_V1.md` §4**):

1. Log in and see a dashboard summarizing current content.
2. Create an Event from scratch, including images and rich content, save as Draft, later Publish it.
3. Edit or delete an existing Event.
4. Add a Medium article by pasting only its URL and see title/cover/description/date populate automatically.
5. Publish, edit, or delete that article entry.
6. Trust event status (Incoming / On Going / Finished) is always correct with no manual updates.
7. Record a member Achievement, edit/delete it later, see totals on the dashboard, and have it served publicly.

Source of truth, in order: `PLAN_V1.md`, `openspec/specs/` (`auth`, `dashboard`,
`events/event-management`, `articles/medium-article-management`,
`achievements`, `api/public-content-api`, `storage/cloudflare-r2-integration`),
this file's contract tables (derived from what `apps/frontend/src` actually
calls — if the frontend and a doc disagree, the frontend wins and the doc
should be fixed). Your stack, your backend location, your structure — none are
prescribed. Good luck.
