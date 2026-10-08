# Spec Delta

## MODIFIED Requirements

### Requirement: Prisma schema is preserved at a backend-independent location
The starter SHALL keep the content-only Prisma schema — `Event`, `MediumArticle`, `Achievement`, `AchievementMember` — at a location outside the deleted backend tree, so learners rebuild against the exact data model the frontend and specs assume. No `User`, `Session`, `Account`, or `Verification` models exist.

#### Scenario: All models present at the new home
- **WHEN** a learner opens the relocated `schema.prisma`
- **THEN** the four content models listed above are defined with their fields, uniques, and indexes intact, and no auth tables are present

#### Scenario: Schema location is documented
- **WHEN** a learner reads `CHALLENGE.md`
- **THEN** it states the exact path of `schema.prisma` and that the data model is fixed input, not something to redesign

### Requirement: Rebuild contract is documented in CHALLENGE.md
The starter SHALL include a `CHALLENGE.md` at `docs/CHALLENGE.md` that states the API surface to rebuild (content endpoints, publish/unpublish transitions, image-handling expectations, and the computed event-status rule) with no auth mount point, no 401/403 rules, and no role rules, and points at `docs/PLAN_V1.md` plus `openspec/specs/` as the source of truth, so learners never have to guess the target.

#### Scenario: Contract covers every frontend integration
- **WHEN** a learner compares `CHALLENGE.md` against the frontend integration points (`/api/events`, `/api/articles`, dashboard aggregation, storage upload)
- **THEN** each integration has a documented expected behavior and the V1 success criteria are restated as the definition of done

#### Scenario: Stretch scope is marked
- **WHEN** a learner reads the scope section of `CHALLENGE.md`
- **THEN** achievements are explicitly marked as stretch scope (present in the schema, beyond the V1 plan) rather than left ambiguous
