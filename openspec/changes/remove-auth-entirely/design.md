# Design

## Context

See proposal.md (Why). Current state: `apps/frontend` is wired to Better Auth (`better-auth` dep, `src/lib/auth-client.ts` → `/api/auth/*`, `AuthContext`/`useSession`, `Login.tsx`, `ProtectedRoute`, `useAuth`/`signOut` in 7 pages, `lib/api.ts` 401→`/login` redirect, `lib/roles.ts` + `types/auth.ts` role gating). Schema `packages/db/prisma/schema.prisma` holds 8 models, 4 of which (`User`, `Session`, `Account`, `Verification`) exist only for auth. Docs (`CHALLENGE.md`, `PLAN_V1.md`, `ROADMAP.md`, `README.md`) and specs (`auth`, `auth/role-based-access`, plus auth refs in `dashboard`, `achievements`, `backend-starter`) assume login/sessions/roles. No backend server exists in the tree, so this is a pure working-tree deletion with no runtime migration.

## Goals / Non-Goals

**Goals:**
- Leave zero `better-auth`/`Better Auth`/`betterAuth` strings and zero login/session/role/401/403 behavior in the working tree (excluding `openspec/changes/archive/`).
- Keep content stack (Events, Articles, Achievements, Dashboard aggregation, uploads, public API) untouched and building after auth removal.

**Non-Goals:**
- No replacement auth (no sessions, JWT, OAuth, or framework-neutral login) — CMS is open.
- No rewrite of archived history under `openspec/changes/archive/`.
- No new backend scaffolding; content API rebuild stays a separate concern.

## Decisions

### D1: Delete auth files outright, don't stub them
Delete `lib/auth-client.ts`, `context/AuthContext.tsx`, `context/auth-state.ts`, `context/useAuth.ts`, `types/auth.ts`, `pages/Login.tsx`, and `lib/roles.ts`; strip `ProtectedRoute` to pass-through (or delete + unwrap in `App.tsx`), remove `AuthProvider` wrapper and `/login` route, drop `better-auth` from `package.json` (reinstall lockfile).
- *Rationale*: Stubs rot and re-invite framework coupling; deletion is greppable and verifiable.
- *Alternative*: Keep no-op `useAuth` returning a fake admin — rejected (hides the open-access intent, leaves dead imports).

### D2: Trim schema to 4 content models, regenerate migrations fresh
Delete `User`, `Session`, `Account`, `Verification` blocks from `schema.prisma`; keep `Event`, `MediumArticle`, `Achievement`, `AchievementMember` byte-identical. No migration files shipped — implementer runs `prisma migrate dev` fresh.
- *Rationale*: Auth tables have no content value; keeping them preserves the framework shape the owner wants gone.
- *Alternative*: Keep empty `User` table for future use — rejected (reintroduces the auth surface).

### D3: Open-access semantics everywhere
`lib/api.ts`: remove `withCredentials` + 401→`/login` interceptor. Pages: remove `useAuth`/`signOut` (drop logout buttons or leave header without them), render all CRUD actions unconditionally. Specs/docs: 401/403 and `admin`/`user` language becomes "all callers/visitors".
- *Rationale*: Single rule ("no auth checks") is easier to verify than per-route edits.
- *Alternative*: Per-endpoint allowlist — rejected (no endpoints need guarding).

### D4: Docs scrub is surgical, archive is frozen
Edit `CHALLENGE.md` (drop §Auth table, session-check note, auth model list, 401/403 + role paragraphs; renumber definition-of-done), `PLAN_V1.md` (drop login/session/route-protection rows), `ROADMAP.md` (drop auth bullet), `README.md` (drop roles/session sections). Leave `openspec/changes/archive/*` untouched.
- *Rationale*: Archive is the audit trail of why Better Auth was chosen then removed; rewriting it falsifies history.
- *Alternative*: Scrub archive too — rejected (destroys the reference record).

## Risks / Trade-offs

- **[Orphaned imports break build]** → Mitigation: tasks order deletion leaf-to-root (pages → App → context → deps) with `tsc -b && vite build` as the gate.
- **[Hidden role checks missed]** → Mitigation: final verification greps for `better-auth|betterAuth|Better Auth|useAuth|AuthContext|auth-client|signIn|get-session|signOut|/login|401|403|role|session|password` across `apps/`, `packages/`, `docs/`, `openspec/specs/`, `README.md`.
- **[Public-write exposure]** → Accepted trade-off: owner explicitly chose open CMS; documented in proposal and specs, not mitigated.
- **[Lockfile churn]** → Mitigation: remove only `better-auth` (+ `@better-auth/*` if present) via package manager; verify no other dep imports it.

## Migration Plan

1. Land as a single atomic commit (no staged rollout — no server is running).
2. After merge: fresh `prisma migrate dev` against the 4-model schema; `pnpm install` to drop `better-auth` from lockfile.
3. Rollback: revert the commit (auth models + frontend wiring restore together; no data migration needed since no auth tables were ever populated in the starter).

## Open Questions

None — scope (full removal, no replacement) was confirmed with the owner before planning.
