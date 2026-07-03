# CoreSphere Pulse AI — Phases C–F Build Plan

Phases A (org structure) and B (AI Orb + Daily Briefing) are done. This plan covers the remaining four phases, each self-contained and verifiable. New persisted features use **real Lovable Cloud tables + storage with RLS** (not mock data), while existing static content (product info, scenario copy) stays in typed TS modules the UI reads directly.

## Phase C — Knowledge & Product Intelligence
New routes + one new table for the FAQ gap loop (reuses existing `failed_searches`).

- **Product Intelligence Hub** (`/products`): typed data module `src/lib/products.ts` covering Accounts, Cards, Loans, Leo, Mobile Banking, Internet Banking, SME, Corporate — each with Overview, Features, Benefits, FAQs, Escalation Paths, Talking Points. Country-aware (reads `org-structure` countries, Nigeria default). Route with search + category tabs.
- **Operational Alert Center** (`/alerts`): reads existing `incident_banners` table (role-visible), grouped by type (NIBSS, card delays, fraud, app incidents, downtime). Team Lead / L&D can create/close; staff read-only.
- **FAQ Governance + Gap Detector**: extend `src/routes/faq.tsx`. AI drafts suggestions only (existing writer fn); publish action gated by role. Gap detector reads `failed_searches` and surfaces recommended FAQs to Team Lead + L&D.
- **Knowledge Decay Detection** + **Incident Learning Center**: derived views over `sop_versions` (stale SOPs) and closed `incident_banners` (lessons). No new tables.

Data: no new tables required (reuses `failed_searches`, `incident_banners`, `sop_versions`). Static product content in TS.

## Phase D — Recognition: Hall of Excellence
Rename + upgrade `src/routes/hall-of-fame.tsx`, add storage + one table.

- Rename Hall of Fame → **CoreSphere Hall of Excellence** (route stays `/hall-of-fame`, nav label + headings updated).
- **3D Recognition Wall**: 3 champions (Learning Excellence, Operational Readiness, Continuous Improvement) with portrait frame, dept, title, Pulse Points, Readiness. Champions computed from existing leaderboards.
- **Admin photo upload**: new **storage bucket `recognition`** (public read, admin write) + new table `recognition_photos` (user_id, category, photo_path, caption). Admin/L&D upload via signed flow.
- **Monthly Recognition Ceremony** archives + **Departmental Recognition** (incl. sub-unit champions: Containment, Block Card, Email, Live Chat, Video Validation/KYC): table `recognition_archives` (month, category, department, winner, points). **CoreSphere Spotlight** AI stories generated from archive rows via existing AI gateway.
- Reputation shown as Pulse Points (recognition-only; no HR use).

Data: bucket `recognition`; tables `recognition_photos`, `recognition_archives`.

## Phase E — Executive Intelligence
Extend `src/components/exec/ExecutiveIntelligence.tsx`, no new tables (aggregates existing data).

- **Executive Command Center** (Group Head only): Operational Health, Readiness Trends, Department Rankings, Voice of Customer, Compliance, Knowledge Risks, AI Insights. Strategic only — governance guardrails already enforced (no promotion/pay/succession).
- **Voice of Customer Dashboard**: complaint categories, escalations, pain points, trends — derived from `feedback` table + scenario/alert data.
- **Operational Wins Board** + **Pulse Health Index** executive KPI (composite from `learningHealth()` + compliance + engagement).

Data: none new; reads `feedback`, `risk_snapshots`, gamification/leaderboards.

## Phase F — Engagement & Scalability
One new table + framework wiring.

- **Digital Suggestion Box** (`/suggestions`): new table `suggestions` (user_id, category, body, status, ai_category, ai_summary). Staff submit; AI auto-categorizes on submit via server fn; management trend reports (grouped counts, no author exposure to peers). RLS: authors read own; Team Lead/L&D/Group Head read all.
- **Country Expansion Framework**: wire the existing `countries` list through products/policies/alerts (Nigeria active, others scaffolded with "Coming soon" state). Country switcher in relevant headers.
- **Login Experience** polish: tie sign-in success into the Phase B Daily Briefing (greeting + fresh quote on first load).

Data: table `suggestions`.

## Technical notes
- All new server logic uses `createServerFn` + `requireSupabaseAuth`; role checks via existing `has_role`. AI features use the existing Lovable AI gateway server functions — no mock AI.
- Every new public table ships with GRANTs + RLS + policies in the same migration; storage bucket gets `storage.objects` policies (public read, admin/L&D write).
- New routes registered by the TanStack file-based router; nav entries added in `AppSidebar.tsx` + `directory`/role gating.
- Governance (`ai-governance.ts`) extended with FAQ publishing rules.

## Suggested order & rough size
1. **Phase C** — largest (3 routes + governance), no migrations. ~medium-large.
2. **Phase D** — 2 tables + 1 bucket + recognition UI. ~medium.
3. **Phase E** — exec dashboards, no migrations. ~medium.
4. **Phase F** — 1 table + framework wiring + login polish. ~small-medium.

Each phase ends with a typecheck + a preview smoke test before moving on.