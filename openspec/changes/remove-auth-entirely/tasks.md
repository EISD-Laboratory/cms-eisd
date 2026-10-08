# Tasks

## 1. Mock session store

- [ ] 1.1 Add dependency-free `src/lib/mock-auth.ts` (mock session `{ id, username }`, `localStorage` persistence, `signIn`/`signOut`/session hook) and verify it imports with no `better-auth` references
- [ ] 1.2 Rewire `AuthProvider` to the mock store keeping the `{ user, isAuthenticated, loading, signOut }` shape, delete role types (`src/types/auth.ts` role, `src/lib/roles.ts`), and verify `tsc -b` passes with all 7 `useAuth`/`signOut` pages untouched

## 2. Login view and route guard

- [ ] 2.1 Rewire `Login.tsx` submit to mock `signIn` + navigate (preserving the intended destination), keeping all markup and styles, and verify arbitrary non-empty credentials land on `/dashboard`
- [ ] 2.2 Enforce the mock session in `ProtectedRoute` (remove the TEMP bypass) and verify deep links without a session redirect to `/login` while signed-in reloads stay put

## 3. Framework removal

- [ ] 3.1 Delete `src/lib/auth-client.ts`, remove `better-auth` from `apps/frontend/package.json`, reinstall to update the lockfile, and verify `better-auth` appears in neither manifest nor lockfile
- [ ] 3.2 Strip `withCredentials` and the 401→`/login` interceptor from `src/lib/api.ts`, and verify no `401`, `/login` redirect logic, or `withCredentials` strings remain under `src/`

## 4. Schema trim

- [ ] 4.1 Delete `User`, `Session`, `Account`, `Verification` models from `packages/db/prisma/schema.prisma` keeping `Event`, `MediumArticle`, `Achievement`, `AchievementMember` intact, and verify `prisma validate` succeeds with exactly 4 models

## 5. Docs scrub

- [ ] 5.1 Rewrite `docs/CHALLENGE.md` auth surface (auth table becomes mock-login description, drop session-check note, 401/403 + role rules; renumber definition-of-done) and verify no `Better Auth`/`/api/auth`/`401`/`403` strings remain
- [ ] 5.2 Scrub `docs/PLAN_V1.md` (mock rows), `docs/ROADMAP.md`, and `README.md` (roles/session sections), and verify no auth-framework or role language remains outside archive history

## 6. Final verification

- [ ] 6.1 Run repo-wide grep for `better-auth|betterAuth|Better Auth|auth-client|get-session|sign-in/username|withCredentials` across `apps/`, `packages/`, `docs/`, `openspec/specs/`, `README.md` and verify zero matches (archive excluded)
- [ ] 6.2 Run `tsc -b && vite build` in `apps/frontend`, `prisma validate` on the trimmed schema, and `openspec validate --change remove-auth-entirely` and verify all three succeed
