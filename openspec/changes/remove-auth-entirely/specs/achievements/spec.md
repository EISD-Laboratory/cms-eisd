# Spec Delta

## MODIFIED Requirements

### Requirement: Create member achievement
The system SHALL allow anyone to create a member achievement record with one or more members (each member has a name and their own 4-letter assistant code), competition category, competition level, achievement result, competition name, and required competition year-month (`YYYY-MM`), with no authentication or role checks.

#### Scenario: Admin creates team achievement
- **WHEN** caller submits two members (each with name and unique 4-letter code), category `Hackathon`, level `National`, result `1st Place`, competition name, and year-month `2026-09`
- **THEN** system creates the record with both member-code pairs and returns it with generated id and timestamps

#### Scenario: Admin creates achievement with Other category
- **WHEN** caller submits category `Other` with custom category text (e.g. `Game Jam`)
- **THEN** system stores the custom text as the effective category and returns the created record

#### Scenario: Validation rejects bad input
- **WHEN** caller submits empty member names, an assistant code not exactly 4 letters, `Other` without custom text, empty competition name, or missing/malformed year-month (not `YYYY-MM` or month outside `01-12`)
- **THEN** system returns 400 with field-level errors and creates nothing

#### Scenario: Duplicate assistant code rejected
- **WHEN** caller submits a member whose assistant code is already used by another record
- **THEN** system returns 409 with a field-level error naming the code and creates nothing

#### Scenario: Non-admin cannot create
- **WHEN** any caller submits a valid achievement record (roles do not exist)
- **THEN** system creates the record; no 403 is ever returned and creation is open to all callers

#### Scenario: Unauthenticated cannot create
- **WHEN** any caller submits a valid achievement record (sessions do not exist)
- **THEN** system creates the record; no 401 is ever returned and creation is open to all callers

### Requirement: List and filter achievements
The system SHALL allow anyone to list achievements ordered by competition year-month descending (then most recently updated), with search and filters including year/year-month, with no authentication checks.

#### Scenario: List ordered by year-month
- **WHEN** any caller lists achievements
- **THEN** system returns records ordered by `competitionYearMonth` descending, then `updatedAt` descending

#### Scenario: Search and filter
- **WHEN** any caller filters by category, level, result, or year/year-month, or searches competition name / member name
- **THEN** system returns only matching records

#### Scenario: Unauthenticated cannot list
- **WHEN** any caller lists achievements (sessions do not exist)
- **THEN** system returns matching records; no 401 is ever returned and listing is open to all callers

### Requirement: Update member achievement
The system SHALL allow anyone to update any field of an achievement record with the same validation as creation, with no authentication or role checks.

#### Scenario: Admin updates result and names
- **WHEN** caller updates result from `Finalist` to `2nd Place` and edits the member-name list
- **THEN** system persists the changes, updates `updatedAt`, and returns the updated record

#### Scenario: Update validates Other category
- **WHEN** caller changes category to `Other` without custom category text
- **THEN** system returns 400 and persists nothing

#### Scenario: Update missing record
- **WHEN** caller updates a non-existent id
- **THEN** system returns 404

#### Scenario: Non-admin cannot update
- **WHEN** any caller submits a valid update (roles do not exist)
- **THEN** system persists the update; no 403 is ever returned and update is open to all callers

### Requirement: Delete member achievement
The system SHALL allow anyone to permanently delete an achievement record, with no authentication or role checks.

#### Scenario: Admin deletes record
- **WHEN** caller deletes an existing achievement id
- **THEN** system removes the record and subsequent reads return 404 for that id

#### Scenario: Delete missing record
- **WHEN** caller deletes a non-existent id
- **THEN** system returns 404

#### Scenario: Non-admin cannot delete
- **WHEN** any caller deletes an existing achievement id (roles do not exist)
- **THEN** system removes the record; no 403 is ever returned and delete is open to all callers

### Requirement: Achievements page and navigation
The system SHALL provide an open Achievements list page at `/achievements` linked from the sidebar, plus create/edit forms and delete confirmation; all write controls are always visible to every visitor.

#### Scenario: Sidebar navigation
- **WHEN** any visitor views Dashboard, Events, Articles, or Achievements pages
- **THEN** sidebar shows an Achievements entry linking to `/achievements`

#### Scenario: Admin manages from UI
- **WHEN** visitor opens the Achievements page
- **THEN** system shows list with search/filter (including year filter + year-month sort), month input on the form, New-achievement action, per-row edit and delete actions with a confirmation step before delete

#### Scenario: Member role is read-only in UI
- **WHEN** any visitor opens the Achievements page (read-only roles do not exist)
- **THEN** system always shows create, edit, and delete actions; nothing is ever hidden by role
