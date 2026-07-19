# Phase 3 Complete: Alert Presentation Metadata

Centralized alert severity and status labels, ordering, and presentation classes into one typed feature-owned source. Removed the internal legacy alert compatibility adapter entirely and corrected severity color mapping to restore the four visually distinct severity colors required by the assignment: critical (red), high (orange), medium (yellow), and low (neutral).

## Files created/changed

- `src/pages/alerts/alert-presentation.ts`
- `src/pages/alerts/alert-presentation.test.ts`
- `src/core/theme/tokens.ts`
- `src/core/theme/theme.test.ts`
- `src/styles/tokens.css`
- `src/pages/alerts/AlertsPage.tsx`
- `src/pages/alerts/components/AlertsTable.tsx`
- `src/pages/alerts/components/FilterPanel.tsx`
- `src/pages/alerts/components/AlertDetailDrawer.tsx`
- `src/pages/alerts/components/SummaryStats.tsx`

## Removed

- `src/core/theme/internal/legacy-alert-compat.ts`
- `src/core/theme/internal/legacy-alert-compat.test.ts`

## Key Decisions

- Added a minimal, generic `systemTokens.color.feedback.caution` role (orange) reusing the existing reference orange scale, distinct from `warning` (amber).
- Severity mapping: `critical → danger`, `high → caution`, `medium → warning`, `low → neutral`.
- Status mapping: `open → info`, `in_review → warning`, `resolved → success`, `suppressed → neutral`.
- Severity and status utility classes now reference `systemTokens` feedback roles directly; no second alert-only token system was introduced.

## Tests Created/Changed

- Exhaustive typed severity and status presentation records
- Pairwise-distinct foreground and background colors across all four severities
- WCAG contrast checks for every feedback and status pair
- Static CSS contract updated for the new `caution` role

## Review Status

APPROVED

## Git Commit Message

refactor: centralize alert presentation metadata

- add one typed severity and status presentation source
- restore four distinct severity colors via new caution role
- remove legacy alert compatibility adapter
