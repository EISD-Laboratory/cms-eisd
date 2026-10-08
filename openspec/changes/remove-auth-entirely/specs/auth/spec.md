# Spec Delta

## MODIFIED Requirements

### Requirement: User login
The system SHALL provide a mock Login view that signs the user in locally with any submitted username and password, without calling any backend or validating credentials.

#### Scenario: Successful login
- **WHEN** user submits any non-empty username and password on the Login view
- **THEN** system creates a frontend-local mock session and navigates to the dashboard

#### Scenario: Failed login
- **WHEN** user submits the login form with an empty username or password
- **THEN** system remains on the Login view and prompts for the missing field (no credential validation exists; any non-empty credentials succeed)

#### Scenario: Role-based redirect
- **WHEN** user signs in through the mock Login view
- **THEN** system navigates to the dashboard with all actions visible (roles do not exist; there is no read-only variant)

### Requirement: User logout
The system SHALL allow a user to log out, clearing the frontend-local mock session.

#### Scenario: Successful logout
- **WHEN** user clicks logout
- **THEN** mock session is cleared and user is returned to the Login view

### Requirement: Session persistence
The system SHALL maintain the frontend-local mock session across page reloads.

#### Scenario: Session persists across reloads
- **WHEN** user reloads the page while a mock session exists
- **THEN** user remains signed in and sees the current page

#### Scenario: Expired session
- **WHEN** a stored mock session exists
- **THEN** no expiry applies and the session remains valid until logout (mock sessions do not expire)

### Requirement: Route protection
The system SHALL guard dashboard routes with the frontend-local mock session instead of a backend check.

#### Scenario: Unauthenticated access attempt
- **WHEN** user without a mock session attempts to access a protected route
- **THEN** system redirects to the Login view

#### Scenario: Authenticated access
- **WHEN** user with a mock session accesses a protected route
- **THEN** system allows access to the requested page
