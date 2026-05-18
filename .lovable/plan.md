
# CoreSphere AI — Enterprise Intelligence Build

One-pass build of all 20+ features. Hybrid data: metrics computed from mock data, user actions persisted to Lovable Cloud. AI features routed through Lovable AI Gateway. Official UBA logo fetched from the web (red wordmark) and bundled as the brand asset; if the fetch returns nothing usable, fall back to a generated UBA-styled placeholder mark and flag it.

## 1. UBA Brand System

- Fetch the official UBA logo (red wordmark + lion mark variant). Save to `src/assets/uba-logo.svg` (or `.png` with transparency). Add `uba-logo-mono.svg` for dark surfaces.
- Create `src/components/brand/UbaLogo.tsx` — single source of truth, `size` + `variant="full"|"mark"|"mono"` props, responsive scaling, proper aspect ratio.
- Wire into: TopBar, AppSidebar (Brand), login, onboarding, AI assistant panel header, certificates, executive dashboard, loading screens, protected SOP viewer watermark layer, assessment header, QA header, coaching header, announcements, incident banners, mobile drawer.
- Tighten tokens in `src/styles.css`: UBA red scale (`--uba-red-50..900`), enterprise neutrals, executive surface tokens, KPI tones, risk tones (low/mod/high), heatmap scale.
- Fix the SSR hydration mismatch in `AppSidebar` (nav item order/icons differ server vs client — comes from reading `useActiveUser` during SSR). Hydrate nav from a stable default and swap to role-filtered nav after mount, OR gate the role-dependent items with a `useIsHydrated` flag.

## 2. Lovable Cloud schema (user-action persistence)

Tables (all RLS-scoped to `auth.uid()`; `app_role` enum + `user_roles` + `has_role()` security-definer per the user-roles convention):

- `profiles` — display name, department, unit, role label, avatar.
- `user_roles` — `app_role` enum: staff, qa, ld, team_lead, group_head.
- `acknowledgments` — sop/announcement id, user_id, viewed_at, acknowledged_at, confirmation_text.
- `sop_versions` — sop_id, version, updated_by, approved_by, change_summary, archived, published_at.
- `onboarding_progress` — user_id, milestone_key, completed_at.
- `certificates` — user_id, type, title, issued_at, score, badge_key.
- `feedback` — context_type (coaching/sop/assessment), context_id, rating (helpful/neutral/needs_clarification), note.
- `failed_searches` — query, user_id, department, occurred_at.
- `incident_banners` — title, severity, affected_systems, active_from, active_to, created_by.
- `risk_snapshots` — user_id, score, level, computed_at (rebuilt by a server fn from missed assessments + overdue SOPs + QA failures).

Demo seeder server fn populates a baseline so dashboards aren't empty.

## 3. Operational Health Index

- `src/lib/health-index.ts` — pure functions computing per-department score from SOP completion, QA trend, assessment pass rate, compliance acknowledgment %, overdue training, engagement, learning participation. Weighted, capped 0–100.
- Components: `DepartmentHealthGrid`, `HealthHeatmap` (CSS grid, no chart lib), `HealthTrendChart` (lightweight inline SVG sparkline + Recharts where useful).
- Mount on Group Head + Team Lead + L&D dashboards.

## 4. Acknowledgment Tracking

- Acknowledge modal triggered from SOP viewer + announcement banners + compliance notices: read confirmation + "I understand" checkbox + signature line → writes to `acknowledgments`.
- `AcknowledgmentAnalytics` panel (Team Lead/L&D/Group Head): viewed vs acknowledged vs overdue, per item and per department.

## 5. SOP Versioning & Audit

- Extend `sops` mock with `version`, `updatedBy`, `approvedBy`, `revisionHistory[]`, `archivedVersions[]`, `changeSummary`.
- SOP viewer adds a "Version" tab: current metadata + revision timeline + rollback-view (read-only) of archived versions.

## 6. Proactive AI Learning Recommendations

- Server fn `recommendLearning` (Lovable AI Gateway, `google/gemini-3-flash-preview`) — input: user QA scores, failed quizzes, missed assessments, compliance gaps; output (structured via `Output.object`): `{ recommendations: [{ sopId, type, reason, confidence }] }`.
- `RecommendationsPanel` on Staff dashboard.

## 7. Incident Banners

- `IncidentBanner` (animated pinned strip, severity-colored, dismissable per user). Reads active `incident_banners`. Group Head/L&D can publish via a small "Publish Incident" dialog.

## 8. Staff Compliance Risk Scoring

- `src/lib/risk.ts` computes Low/Moderate/High from snapshots. Stored to `risk_snapshots` for trend.
- `RiskRoster` for Team Lead + QA: sortable staff list with risk pill, contributing factors, "Open coaching" action.

## 9. AI SOP Simplification

- Server fn `simplifySop` — strict prompt: preserve compliance accuracy, plain English, bullet structure, mandatory "Compliance disclaimer: refer to official SOP v{version}".
- Button "Explain This SOP Simply" on every SOP viewer; result rendered inline with confidence + source badge (see §19).

## 10. Guided Onboarding

- `/onboarding` route + onboarding dashboard widget. Roadmap (mandatory SOPs, welcome video, required assessments, mentor card), progress %, milestone completion writes to `onboarding_progress`.

## 11. Failed-Search Analytics

- Knowledge Hub search logs misses to `failed_searches`.
- L&D dashboard panel: top unfulfilled queries, frequency, department breakdown, "Create SOP" CTA.

## 12. AI-Assisted QA Evaluation

- In QA Coaching: "AI assist" panel calls `qaInsights` server fn → structured output `{ coachingInsights, complianceMisses, empathyConcerns, recommendedActions, summary }`. Pure recommendation — QA officer still scores manually.

## 13. Feedback Capture

- `<FeedbackChips>` (Helpful / Neutral / Needs Clarification) appended to coaching sessions, training pages, assessment results, SOP viewer. Writes to `feedback`.
- L&D analytics widget shows aggregate satisfaction.

## 14. Departmental Knowledge Intelligence

- Per-department rolled-up score (avg assessment, SOP completion %, participation). `KnowledgeIntelligenceBoard` with rankings + trends on Group Head + L&D dashboards.

## 15. AI Escalation Recommendation

- Server fn `recommendEscalation` (structured output): `{ path, priority, owner, slaHours, reasoning }`. Wired into a small "Suggest escalation" affordance in QA Coaching + complaint flows.

## 16. Certificates & Achievements

- On milestone (SOP completion, fraud completion, assessment distinction, compliance mastery, CX excellence), insert to `certificates`.
- `/certificates` page: badge grid + printable certificate view (UBA-branded). Leaderboard pulls latest issuances.

## 17. "Today's 60-Second SOP Tip"

- Server fn `sopTipOfTheDay` generates a rotating ≤60-word tip from a random eligible SOP for the user's department, cached daily per user. Dashboard widget at top-right.

## 18. Team Lead / QA Intervention View

- `InterventionBoard` aggregating struggling staff (high risk OR overdue learning OR low QA), with coaching priority badge + "Schedule coaching" action.

## 19. Executive Heatmaps

- Group Head route: heatmaps for most-searched SOPs, complaint concentration by department/unit, fraud concern areas, performance weaknesses, operational bottlenecks, engagement patterns. Cell-based CSS grid + Recharts where appropriate.

## 20. AI Response Trust Badges

- Shared `<AiTrustBadge>` rendering `Confidence: High|Medium|Low`, `Source: SOP v{n}`, `Verified Internal Procedure`. All AI server fns return these fields and components render them under every AI response (CoreSphere AI, recommendations, simplifier, escalation, QA assist, tip).

## 21. Future-Ready Offline Architecture (visual + scaffolding)

- Service-worker scaffold (registered but feature-flagged off). Cache layer interface (`src/lib/offline-cache.ts`) with adapters. Architecture diagram in `/admin` → "Architecture" tab showing cached SOP previews, offline learning summaries, low-bandwidth mode toggle (UI present, behavior stubbed).

## 22. Positioning & Polish

- Rename product surface to **"Enterprise Operations Intelligence & Knowledge Ecosystem"** across login, sidebar tagline, root meta, footer.
- Loading screens, login, onboarding, executive dashboard re-skinned with new tokens.
- Verify SSR hydration is clean after the role-dependent nav fix.

## Technical Notes (for the engineer)

- AI: `src/lib/ai-gateway.ts` exporting `createLovableAiGatewayProvider` per the gateway knowledge. All AI work in `*.functions.ts` server fns using `streamText`/`generateText` + `Output.object` for structured trust-badged responses. Wire `attachSupabaseAuth` in `src/start.ts` (verify; add if missing).
- Hybrid data: metrics components read from `src/lib/mock-data.ts` + computed selectors; user-action components read from Supabase via `requireSupabaseAuth`-protected server fns invoked through `useQuery`.
- Role gating: continue using `useActiveUser` for demo role switching; persisted reads still scope by `auth.uid()` so real auth keeps working.
- Logo: try `lovable_docs`/`websearch` for an official UBA SVG; if blocked, generate a high-fidelity UBA-red wordmark PNG and mark it placeholder in `UbaLogo`.
- Fix the current hydration mismatch (sidebar order) before shipping — confirmed by the runtime error.

## Out of scope this pass

- Real SSO / SAML (mocked login only).
- Mobile app shell beyond responsive web.
- Live websocket realtime collaboration.

Approve to start implementation.
