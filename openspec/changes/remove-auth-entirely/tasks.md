# Tasks

## 1. Frontend auth removal

- [ ] 1.1 Delete `src/lib/auth-client.ts`, `src/context/AuthContext.tsx`, `src/context/auth-state.ts`, `src/context/useAuth.ts`, `src/types/auth.ts`, `src/lib/roles.ts`, `src/pages/Login.tsx` and verify none of those paths exist
- [ ] 1.2 Unwrap `ProtectedRoute` (pass-through render) and remove `AuthProvider` wrapper plus `/login` route from `src/App.tsx`, and verify `tsc -b` passes with no auth imports
- [ ] 1.3 Remove all `useAuth`/`signOut` usages and role-conditional UI in `Dashboard`, `Events`, `EventForm`, `Articles`, `ArticleForm`, `Achievements`, `AchievementForm` (all actions always visible), and verify `tsc -b` passes
- [ ] 1.4 Remove `withCredentials` and the 401→`/login` interceptor from `src/lib/api.ts`, and verify no `401`, `/login`, or `withCredentials` strings remain under `src/`
- [ ] 1.5 Remove `better-auth` from `apps/frontend/package.json`, reinstall to update the lockfile, and verify `better-auth` appears in neither manifest nor lockfile

## 2. Schema trim

- [ ] 2.1 Delete `User`, `Session`, `Account`, `Verification` models from `packages/db/prisma/schema.prisma` keeping `Event`, `MediumArticle`, `Achievement`, `AchievementMember` intact, and verify `prisma validate` succeeds with exactly 4 models

## 3. Docs scrub

- [ ] 3.1 Rewrite `docs/CHALLENGE.md` auth surface (drop Auth table, session-check note, auth model list, 401/403 + role rules; renumber definition-of-done) and verify no `Better Auth`/`/api/auth`/`401`/`403`/`role`/`session` strings remain
- [ ] 3.2 Scrub `docs/PLAN_V1.md`, `docs/ROADMAP.md`, and `README.md` login/session/role sections, and verify no auth-framework or login/logout/session/role language remains outside archive history

## 4. Final verification

- [ ] 4.1 Run repo-wide grep for `better-auth|betterAuth|Better Auth|useAuth|AuthContext|auth-client|signIn|get-session|signOut|/login|password` across `apps/`, `packages/`, `docs/`, `openspec/specs/`, `README.md` and verify zero matches (archive excluded)
- [ ] 4.2 Run `tsc -b && vite build` in `apps/frontend`, `prisma validate` on the trimmed schema, and `openspec validate --change remove-auth-entirely` and verify all three succeed
