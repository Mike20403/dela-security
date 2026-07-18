# Plan: Security Dashboard Foundation First

Build foundation before feature UI. Single source for tokens, models, query keys, errors, mock repository, schemas, and provider configuration. Keep architecture scalable without speculative wrappers or unused infrastructure.

## Phases 8

1. **Phase 1: Reproducible Project Baseline**
    - **Objective:** Establish pinned, repeatable React 18/Vite/Yarn toolchain.
    - **Files/Functions to Modify/Create:** `package.json`, `yarn.lock`, `.yarnrc.yml`, `.nvmrc`, Vite configs, TypeScript configs, `.gitignore`
    - **Tests to Write:** Minimal application bootstrap smoke test
    - **Steps:**
        1. Query Context7 for current Vite, React 18, TypeScript 5, Yarn, and Vitest compatibility.
        2. Pin required major versions instead of accepting incompatible latest scaffold defaults.
        3. Configure Yarn 4 with `node-modules` linker for reviewer compatibility.
        4. Add scripts for development, tests, typecheck, lint, formatting, and build.
        5. Write failing bootstrap test.
        6. Add minimal entry point and make test pass.
        7. Run initial quality gates.

2. **Phase 2: Quality and Test Infrastructure**
    - **Objective:** Make correctness checks available before production modules exist.
    - **Files/Functions to Modify/Create:** `eslint.config.js`, Prettier config, `vitest.config.ts`, `src/test/setup.ts`, `src/test/render.tsx`, `src/test/query-client.ts`
    - **Tests to Write:** Provider-aware render helper; isolated QueryClient cache; DOM matcher setup
    - **Steps:**
        1. Enable strict TypeScript, including unchecked index and exact optional-property checks.
        2. Configure ESLint with zero-warning enforcement.
        3. Configure Prettier without duplicating ESLint formatting rules.
        4. Add Vitest, jsdom, React Testing Library, `user-event`, and `jest-dom`.
        5. Write failing test-infrastructure checks.
        6. Implement fresh QueryClient and reusable render helper.
        7. Pass tests, typecheck, lint, format check, and build.

3. **Phase 3: Design System and Tokens**
    - **Objective:** Establish one semantic visual language shared by Tailwind and Ant Design.
    - **Files/Functions to Modify/Create:** `src/core/theme/tokens.ts`, `src/core/theme/antd-theme.ts`, `src/styles/tokens.css`, `src/styles/global.css`, `src/core/utils/cn.ts`
    - **Tests to Write:** Ant theme references canonical tokens; required semantic tokens exist; `cn` resolves conflicting utilities
    - **Steps:**
        1. Query Context7 for Tailwind v4 CSS variables and Ant Design v5 theme/CSS-variable integration.
        2. Define primitive tokens: palette, typography, spacing, radius, elevation, motion, and breakpoints.
        3. Define semantic tokens: surface, text, border, focus, action, severity, and status.
        4. Map canonical tokens to CSS custom properties.
        5. Map same token source to Ant Design `ThemeConfig`.
        6. Configure Tailwind utilities without maintaining duplicate color values.
        7. Add one `cn()` helper using `clsx` and `tailwind-merge`.
        8. Validate contrast, focus visibility, reduced motion, and responsive foundations.

4. **Phase 4: Application Core and Error Handling**
    - **Objective:** Create reusable provider hierarchy, routing, query defaults, and error boundaries.
    - **Files/Functions to Modify/Create:** `src/app/App.tsx`, `src/app/providers.tsx`, `src/app/router.tsx`, `src/app/query-client.ts`, `src/app/AppErrorBoundary.tsx`, `src/core/errors/`
    - **Tests to Write:** Providers render route; `/alerts` resolves; unknown route handled; route error shown safely; unknown errors normalize consistently
    - **Steps:**
        1. Query Context7 for React Router v6 error routes, Ant Design contextual APIs, and React Query v5 defaults.
        2. Write failing provider, routing, and error-normalization tests.
        3. Compose `ConfigProvider`, Ant `App`, `QueryClientProvider`, and `RouterProvider`.
        4. Define explicit retry, `staleTime`, and `gcTime` policies.
        5. Add minimal `AppError` code model and `normalizeError(unknown)`.
        6. Add route-level and React rendering error states.
        7. Avoid global error toasts that duplicate local query feedback.
        8. Pass all quality gates.

5. **Phase 5: Domain and Data Foundation**
    - **Objective:** Establish canonical alert models, realistic data, repository boundary, mock API, and query keys.
    - **Files/Functions to Modify/Create:** `src/core/types/alerts.ts`, `src/pages/alerts/api/alerts-repository.ts`, `fetch-alerts-repository.ts`, MSW handlers, `mock-alerts.ts`, `alert-query-keys.ts`, `src/pages/alerts/hooks/useAlerts.ts`
    - **Tests to Write:** 30+ records satisfy model invariants; all severities/statuses represented; fetch responses are isolated; delay is configurable; first-load failure is controlled; query keys remain stable
    - **Steps:**
        1. Define assignment models once in `src/core/types/alerts.ts`.
        2. Write failing model-fixture and repository tests.
        3. Create domain-facing `AlertsRepository`, not generic CRUD infrastructure.
        4. Add a native fetch repository and stateful MSW REST handlers with configurable 600–900 ms delay.
        5. Add controllable 20% browser-development first-load error behavior.
        6. Return copied records to prevent accidental fixture mutation.
        7. Define centralized hierarchical query keys.
        8. Implement `useAlerts` against repository contract.
        9. Pass tests and all quality gates.

6. **Phase 6: Alert Read Experience**
    - **Objective:** Build page shell, reactive stats, reusable tabs, and complete table states.
    - **Files/Functions to Modify/Create:** `AlertsPage`, `SummaryStats`, `TabNavigation`, `AlertsTable`, badges, formatters, derivation utilities
    - **Tests to Write:** Aggregation; tab counts; status selection; loading skeleton; retry; empty state; 15-row pagination; hidden single-page pagination; drawer row selection
    - **Steps:**
        1. Write failing pure derivation and user-interaction tests.
        2. Implement restrained security-console page composition.
        3. Add four responsive stat cards derived from visible records.
        4. Add reusable typed `TabNavigation`.
        5. Add Ant Design table with semantic severity and status treatments.
        6. Add loading, error, retry, partial-data, and empty states.
        7. Add pagination and reset page when result set changes.
        8. Pass tests and all quality gates.

7. **Phase 7: Validation, Filters, and Mutations**
    - **Objective:** Add validated filters and optimistic drawer actions using shared foundations.
    - **Files/Functions to Modify/Create:** Filter schema, `FilterPanel`, `useAlertFilters`, filtering utilities, `AlertDetailDrawer`, `useAlertMutation`
    - **Tests to Write:** Search fields; multi-select filters; inclusive dates; combined filters; active count; reset behavior; Escape closes drawer; optimistic status/assignment; mutation rollback
    - **Steps:**
        1. Query Context7 for React Hook Form/Yup typing and React Query optimistic updates.
        2. Write failing schema, filtering, drawer, and mutation tests.
        3. Define Yup schema as form trust-boundary source of truth.
        4. Add search, severity, category, and date-range controls.
        5. Connect filtered data to stats, tabs, and pagination.
        6. Reset filters and tab atomically.
        7. Add drawer displaying every alert field.
        8. Add optimistic status and “Assign to me” mutations.
        9. Snapshot cache and roll back failed mutations.
        10. Pass tests and all quality gates.

8. **Phase 8: Hardening and Documentation**
    - **Objective:** Finish accessibility, responsive polish, submission documentation, and final verification.
    - **Files/Functions to Modify/Create:** `README.md`, accessibility refinements, error-state refinements, project metadata
    - **Tests to Write:** Critical keyboard flow; focus restoration; accessible names; partial-data rendering; final regression suite
    - **Steps:**
        1. Audit keyboard interaction, focus, labels, contrast, motion, and drawer restoration.
        2. Remove generic gradients, decorative widgets, excessive cards, oversized headings, and visual noise.
        3. Verify narrow and desktop layouts.
        4. Document setup, structure, token strategy, repository seam, cache timing, assumptions, trade-offs, and AI workflow.
        5. Run full test, typecheck, lint with zero warnings, format check, and production build.
        6. Use web search only after repeated exact errors survive official documentation review.
        7. Add no stretch dependency unless core quality gates remain green.

## Open Questions

1. Use Tailwind v4 CSS-first tokens? Approved default: yes.
2. Use Yarn 4 with `node-modules` linker? Approved default: yes.
3. Initialize Git repository during Phase 1? Approved default: yes.
4. Include stretch goal D after core completion? Approved default: accessible keyboard basics only.
5. Hardcoded current analyst name? Approved default: `Alex Morgan`.

## Deliberate Deferrals

- Axios: no HTTP backend exists; `AlertsRepository` provides replaceable boundary.
- MSW deferral reversed by user decision: standard network-boundary mocking now backs the native fetch repository in browser development and tests.
- Generic API client, CRUD framework, dependency-injection container, auth, token refresh, global event bus, and state library: no current requirement.
- Generic Ant component wrappers: add only after repeated product behavior appears.
- Stretch dependencies: add only after core quality gates pass.
