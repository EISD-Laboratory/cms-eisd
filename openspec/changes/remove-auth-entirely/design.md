# Design

## Context

See proposal.md (Why). Current state: `apps/frontend` is wired to Better Auth (`better-auth` dep, `src/lib/auth-client.ts` → `/api/auth/*`, `AuthContext`/`useSession`, `Login.tsx` sign-in, `ProtectedRoute`, `useAuth`/`signOut` in 7 pages, `lib/api.ts` 401→`/login` redirect, `lib/roles.ts` + `types/auth.ts` role gating). The Login view markup itself is framework-agnostic (form + inputs + button) and stays; only the submit handler and session provider are Better Auth-coupled. Schema `packages/db/prisma/schema.prisma` holds 8 models, 4 of which (`User`, `Session`, `Account`, `Verification`) exist only for auth. No backend server exists in the tree, so this is a pure working-tree change with no runtime migration.

## Goals / Non-Goals

**Goals:**
- Login view and logout buttons keep their exact look and placement; only their behavior becomes local.
- Leave zero `better-auth`/`Better Auth`/`betterAuth` strings and zero backend auth calls in the working tree (excluding `openspec/changes/archive/`).
- Keep content stack (Events, Articles, Achievements, Dashboard aggregation, uploads, public API) untouched and building after the change.

**Non-Goals:**
- No Register page (none exists; owner declined adding one).
- No credential validation beyond required fields; no roles of any kind (`auth/role-based-access` is removed, mock session carries no role).
- No backend auth endpoint and no replacement auth library — the mock is dependency-free.
- No rewrite of archived history under `openspec/changes/archive/`.

## Decisions

### D1: Local mock session module replaces `auth-client.ts`
Delete `lib/auth-client.ts`; add a small dependency-free mock session store (e.g. `lib/mock-auth.ts`) holding `{ id, username }` in React state mirrored to `localStorage` (key `cms.mockSession`), with `signIn(username)`, `signOut()`, and a synchronous read on mount so reload persistence needs no network.
- *Rationale*: Same provider/hook shape means `AuthContext`, `ProtectedRoute`, and pages change minimally; `localStorage` gives reload persistence with zero backend.
- *Alternative*: Keep `auth-client.ts` but reimplement its exports as mocks — rejected (the filename invites re-coupling; deletion is greppable).

### D2: Rewire `AuthContext` to the mock store, keep its public shape
`AuthProvider` exposes the same `{ user, isAuthenticated, loading, signOut }` value backed by the mock store (`loading` is false after the synchronous `localStorage` read). `Login.tsx` submit handler calls `signIn(username)` and navigates to the originally requested page or `/dashboard`; the 7 pages using `useAuth()`/`signOut()` keep working untouched. Delete role types (`types/auth.ts` role, `lib/roles.ts`) since no roles exist.
- *Rationale*: Only provider internals and the login submit change; all consumer pages and logout buttons are preserved as requested.
- *Alternative*: Inline mock logic per page — rejected (duplicates session handling across 8+ files).

### D3: Make `ProtectedRoute` enforce the mock session, drop the TEMP bypass
Replace the `return children` bypass with the existing guard logic against the mock `isAuthenticated` (loading state first, then redirect to `/login` with preserved destination).
- *Rationale*: The guard code already exists below the bypass; this restores the intended UX on mock state and removes the stale `TEMP — REVERT ME` comment.
- *Alternative*: Leave the bypass and rely on pages being open — rejected (spec requires unauthenticated redirect to Login).

### D4: Trim schema to 4 content models, regenerate migrations fresh
Delete `User`, `Session`, `Account`, `Verification` blocks from `schema.prisma`; keep `Event`, `MediumArticle`, `Achievement`, `AchievementMember` byte-identical. No migration files shipped — implementer runs `prisma migrate dev` fresh.
- *Rationale*: The mock session lives in `localStorage`; auth tables have no content value and preserve the framework shape the owner wants gone.
- *Alternative*: Keep tables for a future real backend — rejected (reintroduces the auth surface this change removes).

### D5: Docs scrub is surgical, archive is frozen
Edit `CHALLENGE.md` (auth contract table becomes mock-login description, drop session-check noise note and 401/403 + role paragraphs; renumber definition-of-done), `PLAN_V1.md` (login/session/route-protection rows become mock rows), `ROADMAP.md` (drop auth bullet), `README.md` (drop roles/session sections). Leave `openspec/changes/archive/*` untouched.
- *Rationale*: Archive is the audit trail of why Better Auth was chosen then removed; rewriting it falsifies history.
- *Alternative*: Scrub archive too — rejected (destroys the reference record).

## Risks / Trade-offs

- **[Mock looks like real security]** → Mitigation: code comments + spec wording state plainly that any credentials sign in and there is no server check; never persist a password.
- **[Orphaned imports break build]** → Mitigation: tasks order store-first (mock module → provider → login/guard → dep removal) with `tsc -b && vite build` as the gate.
- **[Hidden framework references missed]** → Mitigation: final verification greps for `better-auth|betterAuth|Better Auth|auth-client|get-session|sign-in/username|withCredentials` across `apps/`, `packages/`, `docs/` (archive excluded).
- **[Lockfile churn]** → Mitigation: remove only `better-auth` (+ `@better-auth/*` if present) via package manager; verify no other dep imports it.

## Migration Plan

1. Land as a single atomic commit (no staged rollout — no server is running).
2. After merge: fresh `pnpm install` to drop `better-auth` from lockfile; `prisma migrate dev` against the 4-model schema.
3. Rollback: revert the commit (mock store, provider, schema, and docs restore together; no data migration needed since no auth tables were ever populated in the starter).

## Open Questions

None — mock behavior (local-only navigation, Login kept, no Register) and framework removal were confirmed with the owner before planning.
