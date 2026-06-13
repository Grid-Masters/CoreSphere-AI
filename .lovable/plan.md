# CoreSphere Pulse AI — Phase 2.5 Enhancement Plan

This applies enhancements **on top of** the existing app. Nothing is rebuilt or removed. The work is grouped into 6 buildable phases. Each phase is self-contained and verifiable. I recommend building in this order because later phases depend on the org-structure and data foundations laid early.

## Phase A — Official Customer Fulfilment Structure (FOUNDATION)
Single source of truth that every other phase reads from.
- Rework `src/lib/directory.ts` into a formal department hierarchy:
  - Departments: Inbound, Fraud Help Desk (FHD), Multimedia, Social Media, Video Validation, Quality Assurance (QA), Learning & Development (L&D)
  - Sub-units: FHD → {FHD Operations, Containment, Block Card}; Multimedia → {Email, Live Chat}
- Add a new `src/lib/org-structure.ts` exporting the canonical department + sub-unit tree, plus a `countries` list (Nigeria default; Ghana, Kenya, Uganda, Cameroon, Tanzania, Zambia) for the country-aware framework.
- Update all consumers (dashboards, analytics, leaderboards, readiness, recognition) to use the hierarchy. Containment/Block Card and Email/Live Chat render as sub-units, never standalone departments.
- Add Video Validation as a first-class department everywhere.

## Phase B — CoreSphere AI Evolution + Intelligence Orb + Daily Briefing
- Redesign `CoreSphereAI.tsx` into a premium "Personal Operations Coach" panel: dynamic conversation cards, mission alerts, SOP recommendations, assessment coaching.
- Replace floating button with **CoreSphere Intelligence Orb**: CSS/SVG glass orb, UBA accents, soft glow, floating motion, state-driven pulses (Normal/New Mission=blue, QA Feedback=amber, Assessment=glow, Critical=red). Modes: Floating / Docked / Minimized (persisted).
- **AI Daily Briefing**: "Good morning [Name]" + fresh motivational quote each login, plus Today's Briefing (SOP updates, learning mission, product updates, fraud alerts, compliance notices, available Pulse Points).

## Phase C — Knowledge & Product Intelligence
- **Product Intelligence Hub** (`/products`): Accounts, Cards, Loans, Leo, Mobile Banking, Internet Banking, SME, Corporate — each with Overview, Features, Benefits, FAQs, Escalation Paths, Talking Points. Country-aware (Nigeria default).
- **Operational Alert Center** (`/alerts`): NIBSS, card delays, fraud trends, app incidents, downtime — role-visible.
- **FAQ Governance + Gap Detector**: AI suggests/drafts only; Team Leads publish for their dept; L&D governs enterprise. Gap detector reads failed searches and recommends FAQs to Team Lead + L&D.
- **Knowledge Decay Detection** + **Incident Learning Center**.

## Phase D — Recognition: Hall of Excellence
- Rename/upgrade Hall of Fame into **CoreSphere Hall of Excellence**.
- **3D Recognition Wall** (3 champions: Learning Excellence, Operational Readiness, Continuous Improvement) with portrait frame, 3D-bust styling, dept, title, Pulse Points, Readiness. Admin photo upload (Lovable Cloud storage).
- **Monthly Recognition Ceremony** archives, **Departmental Recognition** (incl. sub-unit champions: Containment, Block Card, Email, Live Chat, Video Validation/KYC), **CoreSphere Spotlight** AI stories.
- **CoreSphere Reputation System** (Pulse Points, recognition-only).

## Phase E — Executive Intelligence
- **Executive Command Center** (Group Head): Operational Health, Readiness Trends, Department Rankings, Voice of Customer, Compliance, Knowledge Risks, AI Insights. Strategic only — no promotion/salary/succession.
- **Voice of Customer Dashboard** (complaint categories, escalations, pain points, trends).
- **Operational Wins Board** + **Pulse Health Index** executive KPI.

## Phase F — Engagement & Scalability
- **Digital Suggestion Box** (staff submit; AI auto-categorizes; management trend reports) — backed by a Lovable Cloud table.
- **Country Expansion Framework** wired through products/policies/SOPs (Nigeria active, others scaffolded).
- **Login Experience** polish tying into the Daily Briefing.

## Technical notes
- New persisted data (suggestion box, recognition photos, monthly archives) uses Lovable Cloud tables + storage with RLS.
- AI features use existing authenticated server functions (`requireSupabaseAuth`) via the AI gateway — no mock AI.
- Governance guardrails (no promotion/pay/discipline/succession) already enforced in `ai-governance.ts`; extend to FAQ publishing rules.

## Suggested starting point
I recommend starting with **Phase A** since it is the structural foundation everything else reads from, then **Phase B** (the headline AI/Orb/Briefing experience).
