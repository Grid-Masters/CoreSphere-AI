## CoreSphere AI — Operational Realism & Enterprise Intelligence Pass

This pass focuses on wiring the existing scaffolding into a believable daily-use banking operations ecosystem. All changes are frontend/presentation with mock-data realism; no new tables required.

### 1. Daily Workflow Intelligence Panels

New component `src/components/workflow/TodaysWorkflow.tsx` — role-aware task panel with due dates, priority dots, status pills, and quick action buttons. Mounted into each role dashboard in `RoleDashboards.tsx`.

Role task sets in `src/lib/workflows.ts`:
- **Staff**: KYC Refresher SOP, Fraud Escalation review, QA coaching ack, Monthly Assessment, Product Update, New Training Video
- **QA Team Lead**: 6 Pending Evaluations, 3 Coaching Sessions, 2 Compliance Flags, 4 Staff Awaiting Review, Monthly Audit Progress
- **Team Lead**: 4 Staff Pending SOP, 2 Escalated Complaints, SLA Warning, Compliance Follow-Up, Team Assessment Review — scoped to `user.department`
- **L&D**: Pending SOP Approval, Video Upload, Monthly Assessment Rollout, Completion Analytics, Knowledge Gap, Content Review
- **Group Head**: Enterprise Compliance Review, Lowest Performing Department, Training Drop, SLA Risk, Fraud Spike, Operational Risk

### 2. Compliance Health Indicator

New `src/components/governance/ComplianceHealth.tsx` — large circular gauge with 92% score, trend delta, risk color coding, and metric breakdown (SOP completion, assessment completion, ack rate, open flags, overdue training). Clickable to open drill-down sheet. Mounted on QA/Team Lead/L&D/Group Head dashboards.

### 3. AI-Powered At-Risk Staff Detection

New `src/components/governance/AtRiskStaff.tsx` — leverages mock `src/lib/at-risk.ts` with deterministic risk scoring (low SOP %, declining QA, missed acks, assessment fail risk, escalation count). Each staff card shows risk band, top contributing factors, and AI-generated recommendations (coaching / learning path / intervention). Visible to QA Team Lead, Team Lead (filtered by department), Group Head.

### 4. Acknowledgement Tracking

New `src/components/governance/AckTracker.tsx` and `src/components/governance/AckButton.tsx`. Critical content (SOPs, fraud alerts, advisories) gets an "Acknowledge & Mark as Read" button that persists to existing `acknowledgments` Supabase table. Leader view shows ack rates per department + overdue list (mock aggregates for now, real own-acks persisted).

### 5. Enterprise Search Upgrade

Refactor TopBar search into a command-palette `src/components/search/EnterpriseSearch.tsx` (Cmd/Ctrl+K). Searches across mock corpus (SOPs, policies, FAQs, coaching, videos, assessments, announcements, advisories) with typo-tolerant fuzzy ranking, category grouping, recent searches, and "AI Answer" affordance. Logs zero-result queries to `failed_searches`.

### 6. AI Response Format Upgrade

Refactor `CoreSphereAI.tsx` so assistant replies render structured banking-operations blocks: Summary, Required Actions, Escalation Path, SLA Timeline, Compliance Notes, Related SOPs, Warnings, Recommended Next Steps. Use Lovable AI Gateway (`google/gemini-3-flash-preview`) via a new TanStack server function `src/lib/coresphere-ai.functions.ts` with strict system prompt grounding responses in our mock SOP catalog (passed in context).

### 7. Executive Snapshot Mode (Group Head only)

Rebuild `GroupHeadDashboard` into an executive command center with:
- Enterprise Operational Health hero gauge
- Strongest / Weakest department cards with sparklines
- Learning completion trend, compliance gap heatmap, fraud escalation trend, AI usage metrics, staff engagement trend, operational efficiency tiles
- Each tile opens `KpiDrillSheet` (already exists) with department/staff breakdowns

### 8. Realistic Enterprise Activity Feed

New `src/components/feed/EnterpriseActivityFeed.tsx` with simulated rolling events (SOP Updated, Fraud Alert Issued, Product Update Released, Team Completed Assessment, Compliance Deadline Reminder, QA Coaching Completed, Monthly Audit Closed). Auto-prepends a new entry every ~25s using `useEffect` interval. Mounted on all dashboards in a side rail.

### 9. Scenario-Based Operational Intelligence

New `src/components/ops/ScenarioBanner.tsx` — rotates through simulated operational scenarios (Failed Transfer Spike, Fraud Escalation Surge, Product Outage, Compliance Deadline, SLA Breach Risk, High Complaint Volume). Shows scenario + recommended actions + escalation guidance. Mounted at top of relevant dashboards.

### 10. Micro-Interactions & Polish

- `src/components/ui-bits/AnimatedCounter.tsx` — count-up KPI numbers (respects `prefers-reduced-motion`)
- Add `animate-pulse` notification dots, hover lift on cards, skeleton loaders
- Subtle keyframes added to `styles.css`: `fade-up`, `count-shimmer`, `pulse-soft`

### Files to Create
- `src/components/workflow/TodaysWorkflow.tsx`
- `src/components/governance/ComplianceHealth.tsx`
- `src/components/governance/AtRiskStaff.tsx`
- `src/components/governance/AckTracker.tsx`
- `src/components/governance/AckButton.tsx`
- `src/components/search/EnterpriseSearch.tsx`
- `src/components/feed/EnterpriseActivityFeed.tsx`
- `src/components/ops/ScenarioBanner.tsx`
- `src/components/ui-bits/AnimatedCounter.tsx`
- `src/lib/workflows.ts`
- `src/lib/at-risk.ts`
- `src/lib/compliance-health.ts`
- `src/lib/search-corpus.ts`
- `src/lib/activity-feed.ts`
- `src/lib/scenarios.ts`
- `src/lib/coresphere-ai.functions.ts`
- `src/routes/api/coresphere.ts` (fallback route — actual path TBD based on stack)

### Files to Edit
- `src/components/dashboards/RoleDashboards.tsx` — mount new panels per role
- `src/components/CoreSphereAI.tsx` — structured response rendering + gateway call
- `src/components/layout/TopBar.tsx` — Cmd-K enterprise search trigger
- `src/styles.css` — micro-interaction keyframes
- `src/start.ts` — verify `attachSupabaseAuth` is registered (read-only check)

### Out of Scope
- No new database tables. Existing `acknowledgments` and `failed_searches` are reused.
- No real auth integration changes.
- No real-time streaming for activity feed (interval-based mock).
- Drill-down sheets remain mock-data backed.

### Technical Notes
- Lovable AI Gateway is called server-side via `createServerFn` + Lovable AI provider helper (`google/gemini-3-flash-preview`).
- All visibility rules for Team Lead remain `user.department` scoped on the client (matches existing pattern).
- Animation respects `prefers-reduced-motion`.
