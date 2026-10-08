# Spec Delta

## MODIFIED Requirements

### Requirement: Achievements KPI on dashboard
The system SHALL display a Total achievements KPI on the dashboard with Champions and Finalist breakdown details, backed by an open `GET /api/dashboard` (no authentication), showing exactly three KPI cards (Total events, Total articles, Total achievements) and no Drafts card.

#### Scenario: KPI display with data
- **WHEN** user views the dashboard and achievements exist
- **THEN** system shows total achievements count plus Champions count (results `1st Place`, `2nd Place`, `3rd Place`) and Finalist count (result `Finalist`)

#### Scenario: KPI row shows only totals
- **WHEN** user views the dashboard
- **THEN** system shows exactly three KPI cards (Total events, Total articles, Total achievements) and no Drafts card; draft counts remain visible in the per-card breakdowns

#### Scenario: KPI empty state
- **WHEN** user views the dashboard with zero achievements
- **THEN** system shows total 0 with Finalist 0 and Champion 0 rather than an error

#### Scenario: Stats API includes achievements
- **WHEN** any caller requests `GET /api/dashboard`
- **THEN** response includes `totalAchievements`, `finalistAchievements`, `championAchievements`, and `achievementsByYear` (counts keyed by `YYYY-MM`) alongside existing event/article counts without changing existing fields

## REMOVED Requirements

### Requirement: Role-based dashboard actions
**Reason**: Roles removed — all dashboard actions are always available to every visitor.
**Migration**: Render edit/delete actions unconditionally; remove `admin`-only gating.
