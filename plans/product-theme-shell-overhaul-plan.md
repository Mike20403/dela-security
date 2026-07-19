# Plan: Product Theme and App Shell Overhaul

Replace the stock Tailwind color palette with a distinct security-product brand palette, add a real collapsible dark sidebar shell with a logo mark, and strengthen visual hierarchy — without changing the underlying token architecture from the prior migration.

**Phases 4**

1. **Phase 1: Brand Palette Refresh**
   - **Objective:** Replace raw reference color values with a distinct brand palette; keep all architecture, contrast, and severity distinctness intact.
   - **Files:** `src/core/theme/internal/reference-tokens.ts`, `src/core/theme/theme.test.ts`
   - **Steps:**
      1. Write failing test asserting no reference hex value matches Tailwind's default `slate`/`blue`/`red`/`amber`/`orange`/`green` scales, and that the brand primary is visually distinct from every feedback role.
      2. Set primary/action color to a deep indigo-violet `#4F3CC9` (hover `#3F2FA8`), distinct from any severity color.
      3. Replace neutral scale with a custom cool-neutral scale shifted from stock `slate` values.
      4. Replace feedback danger/warning/caution/success hues with values distinct from stock Tailwind, keeping the same semantic roles and WCAG contrast (>=4.5 body, >=3 focus/UI).
      5. Update all contrast and mapping tests to the new values.

2. **Phase 2: Logo Mark**
   - **Objective:** Add a real product logo mark instead of text-only branding.
   - **Files:** `src/app/Logo.tsx` (new), `src/app/Logo.test.tsx` (new)
   - **Steps:**
      1. Write failing test asserting the logo renders an accessible SVG mark with an appropriate accessible name and scales via `width`/`height` props.
      2. Implement a simple geometric shield/hex mark as an inline SVG React component using the new brand token color, no external icon dependency.
      3. No decorative animation; keep it a static, product-appropriate mark.

3. **Phase 3: Collapsible Dark Sidebar Shell**
   - **Objective:** Replace the flat single-background layout with a real app shell: dark sidebar with logo and navigation, light content area, and a working collapse toggle.
   - **Files:** `src/app/AppShell.tsx` (new), `src/app/AppShell.test.tsx` (new), `src/app/route-elements.tsx` (`RootLayout`), `src/pages/alerts/AlertsPage.tsx`
   - **Steps:**
      1. Write failing tests: sidebar/nav landmarks exist; "Alerts" nav item is present and marked active; collapse toggle hides text labels and keeps the logo/icon visible; skip link still moves focus to main content; content area background is visually distinct from sidebar background.
      2. Build `AppShell` with a dark sidebar (`background.foreground`-based dark surface, not reusing content canvas), logo, product name (hidden when collapsed), single real "Alerts" nav item, and a collapse toggle button with correct `aria-expanded`/accessible name.
      3. Move `RootLayout` to render `<AppShell><Outlet /></AppShell>`.
      4. Remove the duplicate "DELA Security / Security Operations" header block from `AlertsPage`; keep monitored-directory, last-updated, and refresh controls in the page content area.
      5. Verify responsive behavior at narrow widths.

4. **Phase 4: Visual Hierarchy Pass**
   - **Objective:** Strengthen hierarchy so summary values, headings, and table structure read clearly instead of uniform flat text.
   - **Files:** `SummaryStats.tsx`, `AlertsTable.tsx`, `FilterPanel.tsx`, `tokens.css` (only if a new heading scale role is genuinely needed)
   - **Steps:**
      1. Write failing tests for stronger value/label size contrast and a visually distinct table header background from card backgrounds.
      2. Increase summary value prominence and reduce redundant card borders.
      3. Give the table header a distinct subtle background from `background.surface` cards.
      4. Re-verify all five states (loading, hard error, cached-warning, empty, populated) and the drawer render correctly with the new palette and shell.

## Decisions Locked

- Sidebar: dark background, collapsible via toggle button, default expanded.
- Logo: geometric shield/hex mark, brand-colored, no external icon library.
- Primary brand color: `#4F3CC9` (indigo-violet), distinct from all severity/status colors.
- No dark-mode toggle for the whole app; only the sidebar itself is dark (fixed, not a full app dark theme).

## Deliberate Exclusions

- No additional fake nav items beyond the one real "Alerts" route.
- No theme switcher / user-facing dark-mode toggle.
- No new UI/icon dependency; logo and any icons are hand-written SVG.
- No change to existing data, query, or mutation behavior.
