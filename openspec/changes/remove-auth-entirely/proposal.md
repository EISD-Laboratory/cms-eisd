# Proposal

## Why

The owner wants zero references to any authentication framework (e.g. Better Auth) anywhere in the working tree, but the Login view and logout buttons stay as frontend-local mockups with no backend. The `auth` spec must be updated to mock-only semantics instead of describing server-backed sessions.

## What Changes

- Keep the existing Login view (`src/pages/Login.tsx`, `/login` route) and the logout buttons in page headers; no Register page is added (none exists today).
- Convert login/logout/session to frontend-local mock behavior: any submitted non-empty credentials navigate to `/dashboard`; logout clears local mock state and returns to `/login`; the mock session persists across reloads via `localStorage`; route guards check only the local mock flag and never call a backend.
- **BREAKING**: Delete Better Auth framework surface: `better-auth` dependency in `apps/frontend/package.json`, `src/lib/auth-client.ts`, and all `/api/auth/*` calls; rewire `src/context/AuthContext.tsx` to the mock store and drop role types (`src/types/auth.ts` role, `src/lib/roles.ts`).
- **BREAKING**: Shrink Prisma schema at `packages/db/prisma/schema.prisma` to content-only models (`Event`, `MediumArticle`, `Achievement`, `AchievementMember`); delete `User`, `Session`, `Account`, `Verification` and any Better Auth columns/indexes (the mock session lives in `localStorage`, no DB tables needed).
- **BREAKING**: Scrub Better Auth mentions from docs: `docs/CHALLENGE.md` (auth contract table becomes mock-login description, drop session-check noise note and 401/403 + role rules), `docs/PLAN_V1.md` (login/session/route-protection rows become mock rows), `docs/ROADMAP.md` (authentication line), `README.md` (roles/session sections).
- Archived history under `openspec/changes/archive/` is left untouched (read-only record); only the working tree and active specs change.

## Capabilities

### New Capabilities

- None — this change only redefines existing behavior.

### Modified Capabilities

- `auth`: all 4 requirements (login, logout, session persistence, route protection) become frontend-local mock behavior with no backend, no credential validation, and no auth framework.
- `auth/role-based-access`: all 4 requirements (role assignment, write protection, UI restrictions, role in session) are REMOVED — no roles exist.
- `dashboard`: remove role-gated actions requirement; `GET /api/dashboard` becomes unauthenticated, all actions always visible.
- `achievements`: remove 401/403 and role-gated UI requirements; list/create/update/delete are open with no auth checks.
- `backend-starter`: schema preservation drops to 4 content models; rebuild contract drops auth mount point, 401/403, and role rules.

## Impact

- Affected code: `apps/frontend/` (mock session store, login rewiring, route guards, `ProtectedRoute`, `lib/api.ts`); `packages/db/prisma/schema.prisma` (4 models deleted); `docs/CHALLENGE.md`, `docs/PLAN_V1.md`, `docs/ROADMAP.md`, `README.md`.
- Affected specs: `auth`, `auth/role-based-access`, `dashboard`, `achievements`, `backend-starter`.
- Dependencies removed: `better-auth` (frontend); no server auth library is introduced.
- No migration history is shipped; implementer regenerates migrations against the 4-model schema.
- Assumption: mock login accepts any non-empty credentials; no error-path validation beyond required fields, and no password is ever persisted.
