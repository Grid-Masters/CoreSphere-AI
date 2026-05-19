## CoreSphere AI — Governance, Hierarchy & UX Refinement Pass

A focused presentation-layer pass to bring the app in line with the corrected enterprise hierarchy, governance rules, and UX polish. No new backend tables — this is hierarchy/wording/role-experience refinement plus a few small client features (theme, greeting rotator, products & news).

### 1. Role hierarchy correction (`src/lib/directory.ts`, `src/components/RoleSwitcher.tsx`)
- Replace `qa` role label "Senior QA Officer" → "QA Team Lead". No more "Senior QA" anywhere.
- Add `sysadmin` role + one demo entry (System Administrator).
- Standardize every non-Group-Head `roleLabel` to the format **"Customer Experience Executive • <Operational Role>"**:
  - Adaeze Okafor → `Customer Experience Executive • FHD Service Officer`
  - Musa Bello → `Customer Experience Executive • Inbound Service Officer`
  - Esther James → `Customer Experience Executive • Multimedia Service Officer`
  - Tunde Aina → `Customer Experience Executive • Social Media Service Officer`
  - QA officers → `Customer Experience Executive • QA Team Lead`
  - L&D → `Customer Experience Executive • Learning & Development Officer`
  - Team Lead → `Customer Experience Executive • Team Lead, <Dept>`
  - Group Head → keep `Group Head, Customer Fulfilment`
- Update `roleLabels` map accordingly.

### 2. Login-first experience
- `src/router.tsx`: redirect unauthenticated visits to `/login`. "Authenticated" = a flag in localStorage set by login submit.
- Remove the demo role switcher from the top bar (`TopBar.tsx`).
- Move role switching into a hidden **Admin** option only available when logged in as the System Administrator demo user (so demos still work), accessible from settings.
- Login form: typing any seeded email auto-resolves to that profile (case-insensitive lookup in `directory`). Unknown email shows inline error.

### 3. Monthly QA terminology
- Rename "Weekly Quizzes" → "Monthly Assessments", "weekly scorecard" → "monthly scorecard", "Audits This Week" → "Audits This Month", etc., across `RoleDashboards.tsx`, `qa-coaching.tsx`, `assessments.tsx`, `mock-data.ts` (`qaScores` already monthly; just adjust labels).
- `score-buddy.tsx` recent items already monthly; update copy.

### 4. Rename "Score Buddy" → "Performance Intelligence"
- Rename route file `src/routes/score-buddy.tsx` → `src/routes/performance-intelligence.tsx`.
- Update sidebar nav entry, page title, hero copy. Keep old route as a redirect for safety.

### 5. Group Head → Executive Operations Center
- Rewrite `GroupHeadDashboard`:
  - Title: **"Executive Operations Center"**, subtitle: *"You oversee enterprise operational communications and executive intelligence."* (removes the "Only you can publish…" line).
  - Remove any "my QA score / coaching / assessments" widgets for this role.
  - 12 KPI tiles: Department KPI overview, Enterprise Health Index, Department QA trends, Compliance risk, Operational heatmaps, Coaching effectiveness, SLA performance, Learning completion, Fraud escalation, AI usage, Department engagement rankings, Knowledge intelligence.
  - Each tile is a `<button>` that opens a `Sheet` drill-down with mock department/staff breakdown tables, mini sparkline, and "Top performers / Watch list". One reusable `<KpiDrillSheet>` component.

### 6. Team Lead scope lock-down
- `TeamLeadDashboard` filters strictly by `user.department` (already does for roster; tighten copy to make scope explicit: *"Visibility scoped to <Dept>."*).
- Add a **"Departmental FAQs"** panel with mock list + "Upload FAQ" / "New Guidance" buttons (client-only mock — opens a dialog that pushes to local state). Add note: "Visible only to <Dept> staff."

### 7. L&D maker-checker (copy only)
- Reinforce wording: *"L&D uploads → Unit Head approves → Publish."* No functional change required beyond labels.

### 8. Settings page (`src/routes/settings.tsx`)
- Remove "Password" row entirely. Add note: *"Authentication is managed via your UBA enterprise email credentials."*
- **Theme picker**: wire Light/Dark/Auto buttons to a real theme controller. Add `useTheme` hook + `<html class="dark">` toggle, persist to `localStorage` under `coresphere.theme`. Apply on first paint via inline script in `__root.tsx`'s shell to avoid FOUC. Ensure `src/styles.css` already has dark tokens (verify; add if missing).
- **Notifications panel**: for non-Group-Head users, lock critical toggles (Leadership announcements, Compliance alerts, Mandatory enterprise notifications) — render as disabled with a small lock icon + tooltip "Managed by Group Head per UBA InfoSec policy". Group Head sees them editable.

### 9. Dynamic motivational greeting (`src/components/dashboards/RoleDashboards.tsx`)
- New `<Greeting>` component (replaces existing):
  - Time-of-day aware ("Good morning/afternoon/evening, <First> 👋").
  - Rotating quote from a curated pool of ~20 banking-professional quotes (`src/lib/quotes.ts`).
  - Rotation: pick on mount using `Date.now() / (1000*60*15)` so it changes ~every 15 min without hydration mismatch; fade-in via CSS.

### 10. Global Products & News strip
- New `src/components/ProductsAndNews.tsx` rendering scrolling/horizontal cards with: title, body, priority (Critical/Important/Info), department tag, timestamp, pinned flag.
- Data source: mock array in `src/lib/news.ts` (~10 entries covering product launches, fraud bulletins, regulatory notices, service updates, campaigns).
- Mounted into every role dashboard at the top (above greeting for Staff, below KPI strip for leadership) so it's visible to all roles including sysadmin.
- Pinned cards shown first; non-pinned auto-scroll horizontally (CSS marquee with `prefers-reduced-motion` respect).

### 11. Sidebar / TopBar polish
- Sidebar: replace any "Score Buddy" entry with "Performance Intelligence".
- TopBar: drop demo role pill; show real `roleLabel` under name.

### Out of scope (acknowledged, deferred)
- Real auth (signup/JWT); we keep the existing localStorage demo gate.
- Drill-down KPI sheets use mock data only — no Supabase queries.
- No new migrations.

### Technical notes
- Theme: add `dark` class strategy and dark CSS variables in `src/styles.css` if not already present.
- Quote rotation must be SSR-safe → pick the index from a `useEffect` after mount, so SSR renders quote #0 and client swaps in the time-bucketed one.
- All wording changes are i18n-free string updates.

### Files touched
Edited: `src/lib/directory.ts`, `src/lib/mock-data.ts`, `src/components/RoleSwitcher.tsx`, `src/components/layout/TopBar.tsx`, `src/components/layout/AppSidebar.tsx`, `src/components/dashboards/RoleDashboards.tsx`, `src/routes/__root.tsx`, `src/routes/login.tsx`, `src/routes/settings.tsx`, `src/routes/qa-coaching.tsx`, `src/routes/assessments.tsx`, `src/routes/score-buddy.tsx` (→ redirect), `src/styles.css`, `src/router.tsx`.
Created: `src/lib/quotes.ts`, `src/lib/news.ts`, `src/lib/theme.ts`, `src/components/ProductsAndNews.tsx`, `src/components/exec/KpiDrillSheet.tsx`, `src/routes/performance-intelligence.tsx`.
