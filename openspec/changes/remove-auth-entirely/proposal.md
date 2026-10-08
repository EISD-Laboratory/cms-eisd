# Proposal

## Why

The owner wants zero references to any authentication framework (e.g. Better Auth) anywhere in the working tree, and has decided auth itself goes away entirely — the CMS becomes open, with no login, session, or roles. This unblocks a framework-neutral, backend-free starter where learners rebuild only content APIs.

## What Changes

- **BREAKING**: Remove authentication entirely — no login, logout, session persistence, route protection, roles (`admin`/`user`), 401/403 behavior, or user management.
- **BREAKING**: Delete Better Auth framework surface: `better-auth` dependency in `apps/frontend/package.json`, `src/lib/auth-client.ts`, `src/context/AuthContext.tsx`, `src/context/auth-state.ts`, `src/context/useAuth.ts`, `src/types/auth.ts`, `src/lib/roles.ts` (if auth-only), `src/pages/Login.tsx` + `/login` route, `src/components/ProtectedRoute.tsx` guard logic, and all `useAuth`/`signOut` usages in pages.
- **BREAKING**: Shrink Prisma schema at `packages/db/prisma/schema.prisma` to content-only models (`Event`, `MediumArticle`, `Achievement`, `AchievementMember`); delete `User`, `Session`, `Account`, `Verification` and any Better Auth columns/indexes.
- **BREAKING**: Scrub Better Auth mentions from docs: `docs/CHALLENGE.md` (auth contract table, session-check noise note, `User/Session/Account/Verification` model list, 401/403 + role rules), `docs/PLAN_V1.md` (login/session/route-protection rows), `docs/ROADMAP.md` (authentication line), `README.md` (roles/session sections).
- Archived history under `openspec/changes/archive/` is left untouched (read-only record); only the working tree and active specs change.

## Capabilities

### New Capabilities

- None — this change only retires behavior.

### Modified Capabilities

- `auth`: all 4 requirements (login, logout, session persistence, route protection) are REMOVED — system has no login or protected routes.
- `auth/role-based-access`: all 4 requirements (role assignment, write protection, UI restrictions, role in session) are REMOVED — no roles exist.
- `dashboard`: remove role-gated actions requirement; `GET /api/dashboard` becomes unauthenticated, all actions always visible.
- `achievements`: remove 401/403 and role-gated UI requirements; list/create/update/delete are open with no auth checks.
- `backend-starter`: schema preservation drops to 4 content models; rebuild contract drops auth mount point, 401/403, and role rules.

## Impact

- Affected code: `apps/frontend/` (auth wiring, login route, route guards, role-conditional UI); `packages/db/prisma/schema.prisma` (4 models deleted); `docs/CHALLENGE.md`, `docs/PLAN_V1.md`, `docs/ROADMAP.md`, `README.md`.
- Affected specs: `auth`, `auth/role-based-access`, `dashboard`, `achievements`, `backend-starter`.
- Dependencies removed: `better-auth` (frontend); no server auth library is introduced.
- No migration history is shipped; implementer regenerates migrations against the 4-model schema.
