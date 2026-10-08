# Spec Delta

## REMOVED Requirements

### Requirement: Role assignment
**Reason**: Roles removed entirely — no `admin`/`user` distinction remains.
**Migration**: Delete role fields, role assignment UI/API, and `src/types/auth.ts` role types.

### Requirement: Role-based write protection
**Reason**: No role checks; all write endpoints are open.
**Migration**: Remove 403 guards on POST/PUT/DELETE; delete `RolesGuard`-equivalent logic from any future backend.

### Requirement: Role-based UI restrictions
**Reason**: No read-only role; all actions are always visible.
**Migration**: Remove role-conditional hiding of edit/delete buttons.

### Requirement: Role persists in session
**Reason**: No session remains to carry a role.
**Migration**: Remove role-from-session reads on every request.
