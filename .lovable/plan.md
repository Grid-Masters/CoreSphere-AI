## Goal
Make the existing nav reachable from every viewport, with a desktop sidebar that collapses to an icon rail and a mobile drawer triggered from the top bar.

## Changes

1. **`src/components/layout/AppShell.tsx`**
   - Introduce a `collapsed` state (persisted to `localStorage` under `coresphere.sidebar.collapsed`) and a `mobileOpen` state.
   - Pass both down to `AppSidebar` and `TopBar`.
   - Use a CSS var (`--sidebar-w`) so the main column reflows when the rail collapses (`16rem` ↔ `4rem`).

2. **`src/components/layout/AppSidebar.tsx`**
   - Accept `collapsed`, `mobileOpen`, `onCloseMobile` props.
   - Desktop: render at `w-16` when collapsed — hide group labels, hide brand wordmark, hide link labels (keep icons centered). Wrap each icon link in a tooltip showing the label when collapsed.
   - Mobile: render as a slide-in drawer (fixed overlay + panel) when `mobileOpen`, dismiss on backdrop click / route change / Esc. Reuse the same nav groups — no duplication.
   - Add a small chevron toggle at the sidebar footer for desktop collapse/expand.

3. **`src/components/layout/TopBar.tsx`**
   - Add a hamburger button (visible `<lg`) that calls `onOpenMobile`.
   - Add a desktop collapse toggle (visible `lg+`) next to the hamburger as a secondary entry point.
   - Keep search/notifications/user block intact; on very small widths, collapse the search into an icon that expands the input.

4. **`src/styles.css`** (minor)
   - Add `--sidebar-w-expanded: 16rem;` and `--sidebar-w-collapsed: 4rem;` tokens for consistency.

## Out of scope
- No pinned/recents panel (per your answer).
- No command palette.
- No route/content changes.

## Technical notes
- Use existing `lucide-react` icons (`Menu`, `PanelLeftClose`, `PanelLeftOpen`).
- Tooltips via existing `@/components/ui/tooltip`.
- Drawer is a simple fixed `<aside>` with backdrop — no new dependency.
- Active-state highlighting logic stays as-is.
