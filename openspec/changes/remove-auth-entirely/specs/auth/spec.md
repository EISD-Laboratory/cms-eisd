# Spec Delta

## REMOVED Requirements

### Requirement: User login
**Reason**: Authentication removed entirely — CMS is open with no login step.
**Migration**: Delete `src/pages/Login.tsx`, `/login` route, `src/lib/auth-client.ts` sign-in calls, and any Better Auth endpoint references.

### Requirement: User logout
**Reason**: No sessions exist, so there is nothing to invalidate.
**Migration**: Remove all `signOut` usages and session-cookie handling from the frontend.

### Requirement: Session persistence
**Reason**: No session concept remains.
**Migration**: Remove `AuthContext`/`useSession`/`get-session` polling; pages render directly.

### Requirement: Route protection
**Reason**: All dashboard and API routes are open; no unauthorized state exists.
**Migration**: Remove `ProtectedRoute` guard logic (render children unconditionally) and any 401 redirect handling.
