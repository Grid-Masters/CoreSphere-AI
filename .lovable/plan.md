# CoreSphere Pulse AI — Phase 2 Enhancement Plan

This extends the existing platform. No existing modules are rebuilt — they are enhanced and joined by new ones. Everything runs on the current mock-data + directory architecture (no schema changes unless you later want real persistence), keeping work in frontend/presentation + light client "intelligence" libraries. The existing structured AI server function (`coresphere-ai.functions.ts`) stays and is extended.

## Guardrails baked into every AI feature
A shared governance constant defines what CoreSphere AI MAY and MUST NOT do (no promotions, salary, discipline, transfers, succession, or ranking for management decisions). This is injected into the AI system prompt and shown in the AI "About" panel, so the assistant is positioned strictly as an Operations Development Assistant / Personal Operations Coach.

## Build order (each phase is shippable on its own)

### Phase A — CoreSphere AI redesign (Personal Operations Coach)
- Rewrite `CoreSphereAI.tsx` into a premium conversational panel: AI avatar (generated brand mark, not a generic sparkle), dynamic time-based greeting using the user's name, animated response cards, quick prompts, suggested/context-aware actions by department, and an "About / Governance" disclosure.
- Keep the floating button on every page (already mounted in AppShell). Extend the system prompt with the governance guardrails and coaching tone.
- Add an **AI Writing Assistant** mode inside the panel: tone rewrite (Professional / Executive / Empathetic / Concise), grammar/spell fix, Memo Generator, Customer Response Generator, SOP/Policy Summarizer, EN↔FR translation. Backed by one new server function.

### Phase B — Mission Control + Readiness + Levels (staff dashboard)
- `src/lib/gamification.ts`: deterministic per-user engine computing Readiness Score (weighted: 20% SOP, 15% video, 20% assessment, 25% QA, 10% compliance, 10% consistency), Knowledge Level (1 Explorer → 7 Legend), streak, Pulse Points, daily mission selection (rule-based on department/SOP history/QA/compliance/recent SOPs — not random).
- `MissionControl.tsx`: greeting + rotating quote, daily mission card (type, assigned SOP/video/quiz, est. time 3–10 min, earnable badge), streak, level, pulse points.
- `ReadinessScore.tsx`: dial/score with "Operationally Ready / Needs Improvement" label and a "development only" disclaimer. Add both to the staff dashboard.

### Phase C — Badge ecosystem + Hall of Fame + Leaderboards
- `src/lib/badges.ts`: full badge catalog (Attendance, Knowledge, AI, Assessments, QA, Learning, Compliance, Department, Recognition incl. CoreSphere Legend) with earned/locked state per user.
- `/achievements` route: badge wall + level progress + Pulse Points.
- `/hall-of-fame` route: monthly recognition categories.
- Department leaderboards component (monthly rankings by learning completion, readiness, assessment, engagement) visible to Team Lead / L&D / Group Head.
- Shift-based badges: Team Lead can "upload" weekly/monthly shifts (Morning/Afternoon/Night) via a simple form; badges awarded only to scheduled users (mock store).

### Phase D — Knowledge governance + AI intelligence engines
- **Banking Scenario Simulator** (`/scenarios` or in Learning Center): AI generates a scenario (Failed Transfer, Fraud Complaint, Card Blocking, etc.), staff answers, AI returns correct response + SOP ref + escalation + SLA (reuses structured AI fn).
- **FAQ governance**: `/faq` center with role-based permissions — AI suggests/drafts/detects gaps but cannot publish; Team Leads manage dept FAQs; L&D manages enterprise FAQs; Group Head views/requests. Uses existing `failed_searches` data for the **FAQ Gap Detector** ("137 searches detected for…→ recommend FAQ").
- **AI Knowledge Gap Engine**: `src/lib/knowledge-gaps.ts` surfaces weak SOP adoption, low assessment scores, missing content → insight cards for Team Lead / L&D / Group Head.
- **Executive Intelligence**: extend Group Head dashboard with Learning Health Index, Department Readiness, SOP Adoption, Assessment Performance, Compliance Status, Knowledge Risk Areas, Engagement, AI Insights — trends only, no HR/promotion output.

## Technical notes
- New libs are pure, deterministic (seeded by user email) so values are stable across renders/SSR.
- New routes follow flat file-based routing under `src/routes/`; nav entries added to `AppSidebar`.
- Two new server functions via `createServerFn` (writing assistant, scenario generator) reusing the Lovable AI gateway pattern already in `coresphere-ai.functions.ts`, with graceful fallbacks.
- Reuse existing UI primitives (`PanelCard`, `StatCard`, `ProgressBar`, badges, sheets) and design tokens — no raw color classes.
- One generated AI avatar asset for the assistant identity.

## Suggested delivery
I recommend shipping Phase A + B first (the most visible "operations coach" transformation), then C, then D in follow-up turns to keep each change reviewable. I can start on Phase A + B immediately on approval.
