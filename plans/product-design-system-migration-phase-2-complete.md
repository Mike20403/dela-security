# Phase 2 Complete: Framework Integration Migration

Connected the canonical system tokens to static CSS, Tailwind CSS v4, and Ant Design without runtime JavaScript token injection. Legacy `--app-*` variables are fully removed and replaced with an intentional static `--dela-sys-*` contract. Alert severity and status colors remain class-driven through a clearly scoped, Phase 3-marked compatibility stylesheet instead of inline styles.

## Files created/changed

- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/main.tsx`
- `src/core/theme/theme.test.ts`
- `src/core/theme/internal/legacy-alert-compat.ts`
- `src/core/theme/internal/legacy-alert-compat.test.ts`
- `src/pages/alerts/AlertsPage.tsx`
- `src/pages/alerts/components/AlertsTable.tsx`
- `src/pages/alerts/components/AlertsTableSkeleton.tsx`
- `src/pages/alerts/components/FilterPanel.tsx`
- `src/pages/alerts/components/SummaryStats.tsx`

## Removed

- `src/core/theme/internal/legacy-theme-compat.ts`
- `src/core/theme/internal/legacy-theme-compat.test.ts`
- Runtime `applyCssVariables()` invocation
- Unused legacy breakpoint/duration utility classes

## Tests created/changed

- Static `--dela-sys-*` CSS contract sourced from `systemTokens`
- Tailwind alias mapping to `--dela-sys-*`
- No `--app-*` variables remain
- No runtime token injection required for first paint
- Static severity/status compatibility utility classes exist
- WCAG contrast checks for severity and status foreground/background pairs

## Review Status

APPROVED

## Git Commit Message

refactor: migrate tokens to static system CSS

- replace runtime app tokens with static dela-sys variables
- align Tailwind and Ant Design to canonical system tokens
- keep alert color utilities class-driven pending phase 3
