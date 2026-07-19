# Plan: Product Design System Migration

Migrate the assignment-level theme into one scalable product token graph with reference and system layers, then centralize alert presentation as typed feature metadata. Upgrade the dashboard into a compact, professional security-operations workspace without adding unsupported product capabilities or decorative UI.

## Phases 6

1. **Phase 1: Product Token Contracts**
    - **Objective:** Define the intentional public token API and layer ownership before framework migration.
    - **Files/Functions to Modify/Create:** `src/core/theme/tokens.ts`, `src/core/theme/theme.test.ts`
    - **Tests to Write:** Reference/system layer contract; aliases reference valid values; feedback is independent from alert severity/status; intentional public CSS token allowlist
    - **Steps:**
        1. Write failing contract tests for `referenceTokens` and `systemTokens`.
        2. Replace size names that cannot grow cleanly with stable numeric scales.
        3. Define shared background, foreground, border, action, feedback, selection, focus, typography, spacing, radius, elevation, and motion roles.
        4. Keep reference tokens internal to the design-system implementation.
        5. Define an intentional public system-token set instead of exporting every leaf.
        6. Keep existing exports temporarily only where migration compatibility requires them.
        7. Run focused tests, then all quality gates.

2. **Phase 2: Framework Integration Migration**
    - **Objective:** Connect product semantics consistently to CSS, Tailwind CSS v4, and Ant Design v5.
    - **Files/Functions to Modify/Create:** `src/styles/tokens.css`, `src/styles/global.css`, `src/core/theme/antd-theme.ts`, `src/main.tsx`, theme integration tests
    - **Tests to Write:** `--dela-sys-*` contract; Tailwind semantic aliases; Ant seed/alias mapping; feedback independence; contrast
    - **Steps:**
        1. Write failing integration tests for stable `dela` naming.
        2. Replace `--app-*` with intentional `--dela-sys-*` variables.
        3. Expose framework-native semantic Tailwind utilities only.
        4. Map generic Ant feedback from system feedback roles, never alert state colors.
        5. Add documented Ant component tokens only for repeated product density needs.
        6. Remove unused runtime breakpoint variables and utilities.
        7. Remove runtime DOM token injection when static CSS covers first paint safely.
        8. Run focused tests and all quality gates.

3. **Phase 3: Alert Presentation Metadata**
    - **Objective:** Centralize alert labels, options, ordering, and semantic presentation without creating a second token system.
    - **Files/Functions to Modify/Create:** `src/pages/alerts/alert-presentation.ts`, `AlertsTable`, `FilterPanel`, `AlertDetailDrawer`, `SummaryStats`
    - **Tests to Write:** Exhaustive severity/status records; every domain union handled; consistent presentation across table, filter, drawer, and stats
    - **Steps:**
        1. Write failing exhaustive metadata tests.
        2. Create one typed presentation source for severity and status labels, order, and system-semantic classes.
        3. Use exact domain statuses: `open`, `in_review`, `resolved`, and `suppressed`.
        4. Replace duplicate labels, options, and class maps in alert components.
        5. Align severity/status tags across table and drawer.
        6. Remove raw color props and direct palette usage.
        7. Run focused tests and all quality gates.

4. **Phase 4: Product Workspace Shell**
    - **Objective:** Present the dashboard as a credible security SaaS workspace while keeping every displayed capability real.
    - **Files/Functions to Modify/Create:** Application shell, `AlertsPage`, product header components
    - **Tests to Write:** Product/workspace landmarks; monitored-directory context; freshness state; refresh action; responsive shell; skip link
    - **Steps:**
        1. Write failing shell and accessibility tests.
        2. Add restrained DELA Security identity and Security Operations workspace context.
        3. Show monitored directory, mock/development environment, last-updated time, and refresh action using existing data.
        4. Add skip link and clear navigation/main landmarks.
        5. Keep typography compact and operational.
        6. Do not add fake sidebar routes, authentication, notifications, or tenant controls.
        7. Run focused tests and all quality gates.

5. **Phase 5: Dashboard Interaction Polish**
    - **Objective:** Improve hierarchy, density, scan speed, and investigation flow using the new system tokens.
    - **Files/Functions to Modify/Create:** `SummaryStats`, `FilterPanel`, `AlertsTable`, `AlertsTableSkeleton`, `TabNavigation`, `AlertDetailDrawer`
    - **Tests to Write:** Result context; compact responsive layout; sticky header; eight-column skeleton; drawer sections; keyboard flow
    - **Steps:**
        1. Write failing semantic layout and behavior tests.
        2. Reduce card-heavy summary styling and strengthen value/label hierarchy.
        3. Clarify filter toolbar hierarchy and active-filter feedback.
        4. Improve table hierarchy, sticky header, data typography, timezone context, caption, and overflow discoverability.
        5. Make loading skeleton reflect the real table.
        6. Group drawer content into overview, context, ownership, analysis, and remediation sections.
        7. Preserve optimistic updates, accessibility, and focus restoration.
        8. Run focused tests and all quality gates.

6. **Phase 6: Migration Hardening**
    - **Objective:** Remove legacy contracts, document usage rules, and verify final product quality.
    - **Files/Functions to Modify/Create:** Theme/component tests, `README.md`, migration completion records
    - **Tests to Write:** No legacy `--app-*`; no duplicate alert metadata; contrast; loading/empty/error/cached/populated/drawer states; responsive and keyboard regressions
    - **Steps:**
        1. Search for and remove all legacy token names and compatibility aliases.
        2. Replace brittle utility-string tests with semantic contracts where possible.
        3. Verify all main query and interaction states.
        4. Verify narrow, laptop, and wide layout contracts.
        5. Verify keyboard, focus, zoom-ready layout, and reduced motion.
        6. Document token layers, decision rules, framework bridges, and feature presentation ownership.
        7. Run immutable install, full tests, typecheck, zero-warning lint, format check, and production build.
        8. Perform final browser review before commit handoff.

## Token Usage Rules

1. Components never consume reference palette values directly.
2. Shared UI intent consumes system tokens.
3. Domain values consume a typed feature presentation map that points to system semantics.
4. Component tokens are added only after a repeated component-specific decision exists.
5. A domain alias becomes a public token only when the concept is reused across features and must theme independently.

## Open Questions Resolved

1. Severity ownership: keep presentation in Alerts feature until another product domain proves reuse.
2. Suppressed alerts: remain in All per assignment.
3. Product shell: compact top bar only; no fake sidebar.
4. Theme support: architecture remains theme-ready, but only light theme ships.
5. Density: compact desktop with accessible mobile touch targets.

## Deliberate Exclusions

- No Style Dictionary or token build generator for one application and one theme.
- No public `--dela-alert-*` token family yet.
- No dark-mode toggle without a product requirement.
- No wrapper for every Ant component.
- No fake charts, trends, SLA metrics, routes, or workflow data.
- No manual bundle splitting solely to suppress a warning.
