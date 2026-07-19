# Dela Security Alerts Dashboard

Focused React dashboard for triaging directory-security alerts. `/alerts` provides status summaries, validated filters, a keyboard-accessible alert table, detail actions, and resilient loading/error states.

## Prerequisites and setup

- Node.js 22.12 or newer (`.nvmrc` pins 22.12.0)
- Yarn 4.17.1 through Corepack

```sh
corepack enable
yarn install --immutable
yarn dev
```

Open `http://localhost:5173/alerts`. Browser development uses MSW; no backend is required.

## Scripts

| Command             | Purpose                                |
| ------------------- | -------------------------------------- |
| `yarn dev`          | Start Vite development server          |
| `yarn test`         | Run Vitest suite once                  |
| `yarn test:watch`   | Run tests in watch mode                |
| `yarn typecheck`    | Run strict TypeScript project checks   |
| `yarn lint`         | Run ESLint with zero warnings          |
| `yarn format:check` | Check Prettier formatting              |
| `yarn build`        | Typecheck and create production bundle |

## Architecture

- `src/app`: providers, router, query policy, and render/error boundaries.
- `src/core`: domain types, normalized errors, shared utilities, and theme source.
- `src/pages/alerts`: vertical alert feature containing derivations, filters, components, hooks, repository contract, schemas, and MSW handlers.
- `src/test`: provider-aware rendering, isolated query clients, and MSW lifecycle.

`AlertsRepository` is domain-specific seam. Production-facing implementation uses native `fetch`; tests and browser development intercept same HTTP boundary with MSW. Yup validates full responses at trust boundary. React Query owns server state; component/form state stays local.

## Runtime policy

Queries remain fresh for 30 seconds, are garbage-collected after 5 minutes, and retry retryable failures at most twice. Mock API serves 32 deterministic records with 600–900 ms latency. Browser development has controlled 20% first-list failure to exercise recovery.

Malformed initial list payload is hard failure: no untrusted records render and validation details stay hidden. If malformed refresh arrives after valid cache exists, cached data remains visible with nonblocking warning and retry. Records are never silently dropped or partially accepted.

Mutations update status and assignment optimistically. Cache snapshots provide race-safe rollback on failure; repository details never reach UI feedback.

## Design system

Two internal token layers plus one domain presentation map, never mixed:

- **Reference tokens** (`src/core/theme/internal/reference-tokens.ts`): raw palette, spacing, type, radius, shadow, motion, breakpoint, focus primitives. Internal only — components never import these directly.
- **System tokens** (`src/core/theme/tokens.ts`, exports `systemTokens` and `publicSystemCssVariables`): the intentional public contract. Every system value resolves to a reference value (enforced by `theme.test.ts`). `tokens.css` publishes system tokens as `--dela-sys-*` CSS variables and re-exposes a subset under Tailwind's own `--color-*`/`--spacing-*`/... namespace so Tailwind utilities and Ant Design (`antd-theme.ts`, via `cssVar`) read the same values. No `--app-*`, no duplicate palette.
- **Alert presentation** (`src/pages/alerts/alert-presentation.ts`): a typed, exhaustive map from `AlertSeverity`/`AlertStatus` to label, order, and static utility class names sourced from system feedback roles. This is the one place severity/status colors and labels live — table, filter panel, drawer, and summary stats all read from it instead of keeping their own copies.

Decision rule for adding to any layer: a component token is added only after the same component-specific value has been needed more than once; a domain value is promoted out of `alert-presentation.ts` into a public system/`--dela-alert-*` token only if another feature domain proves it needs to reuse and re-theme it independently. Architecture is theme-ready but only light theme ships — no dark-mode toggle exists.

## Accessibility

Rows support Enter/Space, drawer opening moves focus inside, Escape/close restores exact connected opener, and removed openers fall back to page heading. Labels, focus indicators, reduced motion, responsive filter controls, horizontal table containment, and drawer width `min(40rem, 100vw)` cover keyboard and narrow-screen use. Table width belongs to its scroll container; page has no fixed-width assumption.

## Assumptions and trade-offs

- Current analyst is `Alex Morgan`; workflow is assign-only, not reassignment or clearing.
- Status and assignment are only supported mutations; authentication, persistence, and real backend are out of scope.
- Native `fetch` replaces Axios. Deterministic fixtures replace Faker. React Query plus local state replaces global state.
- No generic API/component wrappers: current repetition does not justify them.
- Full Ant Design inclusion produces accepted bundle-size warning: final JS is 1,283.30 kB minified / 400.61 kB gzip. Dashboard needs Table, Drawer, forms, date controls, and accessibility behavior; manual chunking or single-route lazy loading would add complexity without improving this exercise's first route.

## AI-assisted workflow

AI suggestions were treated as hypotheses. Accepted: repository seam, schema trust boundary, MSW network tests, optimistic snapshot rollback, controlled drawer lifecycle, and focused DOM contracts. Rejected: Axios/Faker/global state, generic wrappers, manual chunks, route lazy loading solely for warning removal, visual gradients, and timer-based focus hacks. Verification used red/green focused tests, full regression suite, strict typecheck, zero-warning lint, formatting, production build, and diff review.

## Known limitations

Mock state resets with worker/server lifecycle; no auth, audit log, durable storage, localization, or virtualization. Wide table scrolls on narrow screens rather than hiding security fields. Browser focus and responsive behavior should receive final manual checks because jsdom cannot reproduce layout, animation, or every assistive-technology interaction.
