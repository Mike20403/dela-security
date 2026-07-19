# Plan: Icons, Responsive Sidebar, Production-Ready Copy

Add a real icon pack for SaaS-quality UI, fix the sidebar-induced responsive layout break at root cause, and remove all non-production UI copy.

**Phases 3**

1. **Phase 1: Icon Pack Integration**
   - **Objective:** Install `lucide-react`; replace every text-as-icon usage with a real accessible icon.
   - **Files:** `package.json`, `src/app/AppShell.tsx`, `src/pages/alerts/AlertsPage.tsx`
   - **Steps:**
      1. Write failing tests asserting icon presence (via accessible name/role or test id) replacing prior text placeholders ("A" collapsed label).
      2. Install exact `lucide-react` dependency.
      3. Replace sidebar collapse toggle with `PanelLeftClose`/`PanelLeftOpen` icon, keep existing `aria-label`/`aria-expanded` contract.
      4. Replace "Alerts" nav icon with `ShieldAlert` (decorative, `aria-hidden`, label text remains for accessible name).
      5. Replace Refresh button text-only affordance with a `RefreshCw` icon plus visible label.
      6. Run full tests/typecheck/lint/format/build.

2. **Phase 2: Responsive Sidebar Fix**
   - **Objective:** Fix root cause of layout break: fixed-width sidebar sitting inline with main content at all viewport widths.
   - **Files:** `src/app/AppShell.tsx`, `src/app/AppShell.test.tsx`
   - **Steps:**
      1. Write failing tests asserting: below the `lg` breakpoint the sidebar is an off-canvas overlay (translated out of view by default, opened via a dedicated mobile menu button, includes a backdrop that closes it) and does not occupy inline layout width; at `lg` and above it behaves as the current inline collapsible sidebar; `main` never has a fixed/inline sidebar width dependency causing overflow.
      2. Implement responsive classes: mobile overlay sidebar (`fixed inset-y-0 left-0 -translate-x-full lg:translate-x-0 lg:static`), backdrop element, mobile-only menu-open button in the main content area (or a slim top bar) with correct `aria-expanded`/`aria-controls`.
      3. Ensure `main` uses `w-full min-w-0 flex-1` so it never assumes sidebar reserved width on narrow screens.
      4. Add tests verifying no duplicate/inaccessible focus traps, Escape closes the mobile overlay, and desktop collapse behavior is unchanged.
      5. Run full tests/typecheck/lint/format/build.

3. **Phase 3: Production-Ready Copy**
   - **Objective:** Remove all non-production/mock-data UI text.
   - **Files:** `src/pages/alerts/AlertsPage.tsx`, `src/pages/alerts/AlertsPage.test.tsx`
   - **Steps:**
      1. Write failing tests asserting the monitored-directory line and "Development (mock data)" text no longer render in any environment.
      2. Remove the `monitoredDirectory` constant, its paragraph, and the `import.meta.env.DEV` conditional badge entirely.
      3. Keep last-updated and refresh controls, since those reflect real query state, not mock/dev messaging.
      4. Run full tests/typecheck/lint/format/build.

## Decisions Locked

- Icon library: `lucide-react`.
- Nav icon: `ShieldAlert`.
- Monitored-directory line: removed entirely, not replaced with different copy.
- Sidebar: off-canvas overlay below `lg`, existing inline collapse behavior preserved at `lg` and above.

## Verification Note

Browser tool is currently disabled for this session. Verification relies on strict test contracts (rendered DOM state, class presence, ARIA attributes) rather than live visual screenshots. A final manual browser check is recommended once tool access returns.
