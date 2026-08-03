> NON-CONTROLLING AUDIT DOCUMENT — Batch 0 pre-implementation verification, read-only findings only.
> The controlling baseline is `.lovable/plan.md`. Nothing in this file authorises implementation work.

# Batch 0 — Pre-Implementation Verification Report (read-only)

Inspection only. No code, database, settings, visibility or publication changes were made. The project remains unpublished.

## 1. Checkpoint and build status
- Latest checkpoint: `f087a26 Work in progress` (preceded by `46f4ce1 Expanded profile & shell build`).
- Stack: TanStack Start v1 + Vite 7 + Tailwind v4, Lovable Cloud (Supabase) enabled.
- App compiles and the dev server serves; last recorded typecheck in this workspace was clean. No published deployment exists.

## 2. Routes and navigation
28 route files under `src/routes/`: `index`, `login`, `mfa`, `profile`, `my-activity`, `notifications`, `settings`, `help`, `alerts`, `memos`, `townhall`, `leadership`, `analytics`, `admin`, `administration`, `assessments`, `achievements`, `hall-of-fame`, `scenarios`, `faq`, `suggestions`, `qa-coaching`, `performance-intelligence`, `knowledge-hub.index`, `knowledge-hub.$sopId`, `knowledge-hub.product.$categoryId`, `knowledge-hub.product.$categoryId.$productId`, `sitemap[.]xml`, plus `__root`.
- Navigation is role-filtered in `src/components/layout/AppSidebar.tsx`; no standalone Product Intelligence entry remains.
- Shell: `AppShell` + `TopBar` + `AppSidebar`; welcome banner, pulse ticker and AI orb mount inside the shell.

## 3. Roles, active user and dashboard selection
- `src/lib/directory.ts` defines only six roles: `staff | qa | ld | team_lead | group_head | sysadmin`, mirrored by the DB enum `app_role` (`staff, qa, ld, team_lead, group_head, sysadmin`).
- Active user: `src/lib/active-user.ts` resolves the Supabase session email against the static `directory` array; unmatched emails silently fall back to `directory[0]` (Adaeze Okafor, CEE).
- Dashboard selection: `src/routes/index.tsx` switches on `user.role` across five dashboards; `sysadmin` is redirected to `/administration`.

## 4. Database objects
Tables: `acknowledgments, approved_quotes, audit_events, certificates, departments, failed_searches, feedback, hard_tokens, incident_banners, onboarding_progress, profiles, recognition_archives, recognition_photos, risk_snapshots, sop_versions, sub_departments, suggestions, team_members, teams, trusted_networks, user_roles, user_sessions`. All have RLS enabled with policies; `audit_events` is append-only via triggers.
Functions: `has_role` (security definer, intentional), `enforce_single_active_team`, `block_audit_mutation`, `update_updated_at_column`. 9 migrations applied. Storage: private `recognition` bucket.
Gap: there are **no tables for SOPs, product knowledge, assessments, attempts, missions, QA reviews or AI knowledge grounding** — all of that is static frontend data.

## 5. Static / mock / deterministic data
- `src/lib/mock-data.ts` — SOPs, assessments (`attempts` hardcoded), townhall, products/news.
- `src/lib/product-knowledge.ts`, `products.ts`, `directory.ts`, `org-structure.ts`, `demo-profiles.ts`, `scenarios.ts`, `faq.ts`, `news.ts`, `shifts.ts`, `workflows.ts`, `search-corpus.ts`, `recognition.ts`, `leaderboards.ts`, `voice-of-customer.ts`, `pulse-health.ts`, `knowledge-gaps.ts`, `at-risk.ts`, `compliance-health.ts`, `briefing.ts`, `quotes.ts`, `alerts.ts`, `activity-feed.ts`.
- Hash/date-derived deterministic values: `gamification.ts`, `badges.ts`, `activity-feed.ts`, `compliance-health.ts`, `product-knowledge.ts`, `demo-profiles.ts`, `components/feed/EnterpriseActivityFeed.tsx`, `components/governance/AckTracker.tsx` (scores, streaks, readiness, badges and feed entries derived from email hashes and the current date).
- Progress and acknowledgements persist to `localStorage` (`progress-store.ts`, `ack-store.ts`, `workspace-prefs.ts`).

## 6. CoreSphere AI grounding
- Three server functions: `coresphere-ai.functions.ts`, `coresphere-writer.functions.ts`, `coresphere-scenario.functions.ts` — all call the Lovable AI Gateway (`google/gemini-3-flash-preview`) with a governance system prompt.
- **No retrieval layer exists.** No SOP text, product content, meeting record or approved-knowledge corpus is passed to the model, and no citation is returned. Answers are model-generated, not grounded.
- Fallback: hardcoded static answers when `LOVABLE_API_KEY` is missing or the gateway errors — presented to the user as cached SOP guidance.
- Daily Briefing (`briefing.ts`) is fully deterministic local content, not AI output.

## 7. Authentication, MFA and route protection
- Supabase email/password auth; `src/lib/demo-auth.functions.ts` signs demo personas server-side with the `DEMO_PASSWORD` secret.
- `src/lib/auth-gate.ts` is a **client-side `useEffect` gate** — redirects to `/login` without a session and to `/mfa` unless `sessionStorage["coresphere:mfa"] === "1"`.
- MFA is a hard-token serial check against `hard_tokens` via `platform-foundation.functions.ts`; demo personas bypass MFA. The MFA flag lives in `sessionStorage` and is client-trusted.
- No `_authenticated` route-tree gate; `RoleGuard` protects `/administration`, `/admin`, `/analytics` at render time only.

## 8. Assessment attempts and result visibility
- Attempt data is static in `mock-data.ts`; `assessments.tsx` displays `Attempts: {n}/2` and text about locking after two failures, but **no attempt enforcement, no persistence and no retake flow exist**.
- Results are only shown to the logged-in staff persona; there is no cross-employee assessment result view anywhere (so the QA restriction is not currently violated — but also not enforced by any rule).

## 9. Mission Control and gamification
- `components/mission/MissionControl.tsx` renders locally derived daily missions; there is **no assignment source field** (no CoreSphere AI / L&D / QA Officer / Team Lead / Unit Head attribution) and no assignment persistence.
- Gamification (`gamification.ts`, `badges.ts`, `leaderboards.ts`, `ReadinessScore`) is deterministic from email hash + date; Knowledge Levels Explorer→Legend and weighted readiness are computed client-side only.

## 10. QA Coaching and QA role logic
- `/qa-coaching` is a static coaching board keyed off `directory` entries and mock scores.
- The directory carries `assignedQAOfficer` per staff member, but no logic scopes QA visibility by that assignment. Role `qa` is labelled "QA Team Lead" globally — QA Officer and QA Unit Head do not exist.

## 11. Knowledge Hub categories and product placement
- Categories are derived dynamically from SOP records: Cards Operations, Containment, Customer Service, Multimedia, Reputation, Compliance, Operations.
- Product Knowledge is an asset type inside the hub with tiles routing to `/knowledge-hub/product/$categoryId(/$productId)`; the standalone module is gone.
- The eight locked domains (CFC Foundations; Complaints; Enquiries; Requests; Products & Services; Logging & Escalation Guides; Forms & Resources; BO Engagement & Directories) are **not implemented**.

## 12. Obsolete references
- `src/lib/org-structure.ts:2` — "CoreSphere Pulse AI".
- `src/lib/alerts.ts:2` — "Phase C"; `src/lib/recognition.ts:2` — "Phase D"; `src/components/CoreSphereAI.tsx:135` — "Phase F".
- `src/lib/product-knowledge.ts:6` — legacy "Product Intelligence" migration comment.
- Historical plan archives under `.lovable/plan/` still describe the Phases C–F roadmap.

## 13. Public-deployment assumptions
- `public/robots.txt` sets `User-agent: * / Allow: /` and points at `https://ubacoresphere-pulse.lovable.app/sitemap.xml`.
- `src/routes/sitemap[.]xml.tsx` emits absolute URLs on that host; every major route carries canonical + `og:url` on the same host; `__root.tsx` ships Organization + WebSite JSON-LD, and SOP/memo/leadership routes ship HowTo/Article JSON-LD.
- `public/llms.txt` publicly describes the platform. These all assume a public, indexable deployment that does not currently exist.

## 14. Conflicts with locked decisions
| Locked decision | Status |
| --- | --- |
| Name "CoreSphere AI" | Conflict — "CoreSphere Pulse AI" in `org-structure.ts`; titles use "UBA CoreSphere" |
| No standalone Product Intelligence menu | Compliant |
| Eight Knowledge Hub domains | Conflict — seven ad-hoc SOP-derived categories instead |
| Full position hierarchy (13 positions) | Conflict — only 6 roles; missing Unit Head, QA Officer, QA Unit Head, L&D Team Lead, L&D Unit Head, Head of CFC Operations, Delegated Approver |
| FHD = FHD Operations / Incident Containment / Block Card | Partial — unit is named "Containment", not "Incident Containment" |
| Assessments: 1 attempt + 1 retake (max 2) | Conflict — displayed only, never enforced or persisted |
| QA roles cannot view others' general assessment results | Not enforced by rule (no such view exists today) |
| Mission assignment sources | Conflict — no assignment source model at all |
| Raw meeting records are evidence, not AI truth | Conflict — no meeting-record entity and no evidence/truth separation in the AI layer |

---

## A. Files requiring correction
1. `src/lib/directory.ts` — expand `Role`/`roleLabels` to the 13-position hierarchy.
2. `src/lib/org-structure.ts` — rename to CoreSphere AI; rename "Containment" → "Incident Containment"; add unit/position mapping.
3. `src/routes/index.tsx` + `src/components/dashboards/RoleDashboards.tsx` — dashboard selection for new positions.
4. `src/components/layout/AppSidebar.tsx` + `src/components/auth/RoleGuard.tsx` — navigation and guards for new roles.
5. `src/routes/knowledge-hub.index.tsx`, `src/lib/mock-data.ts`, `src/lib/product-knowledge.ts`, `src/lib/search-corpus.ts` — the eight locked domains.
6. `src/routes/assessments.tsx` (+ new attempt service) — enforce max two attempts and result visibility rules.
7. `src/components/mission/MissionControl.tsx` — assignment-source model.
8. `src/routes/qa-coaching.tsx` — assigned-QA scoping and QA position split.
9. `src/lib/coresphere-ai.functions.ts`, `coresphere-scenario.functions.ts`, `coresphere-writer.functions.ts` — grounding/retrieval + citations; make the fallback explicitly non-authoritative.
10. `src/lib/auth-gate.ts` — replace client `useEffect` gating with a route-tree gate; move MFA state off `sessionStorage`.
11. `public/robots.txt`, `public/llms.txt`, `src/routes/sitemap[.]xml.tsx`, `src/routes/__root.tsx` and per-route canonicals/JSON-LD — align with unpublished/non-indexed status.
12. Comment cleanup: `alerts.ts`, `recognition.ts`, `CoreSphereAI.tsx`, `product-knowledge.ts`.

## B. Database objects requiring correction
1. `app_role` enum — extend to the full position hierarchy (additive migration; existing values retained).
2. New tables required: knowledge domains/articles, product knowledge, assessments + assessment_attempts (with a 2-attempt constraint), missions + mission_assignments (with source), QA reviews / QA officer assignment, meeting_records (evidence-only) and an AI knowledge/citation index — with GRANTs and RLS.
3. `departments` / `sub_departments` rows — seed to the official structure including "Incident Containment".
4. RLS additions to block QA positions from other employees' general assessment results.
5. Keep `has_role` SECURITY DEFINER as-is (required RBAC pattern; linter warning is expected).

## C. Blocking risks
1. **No persistence layer for core domain data** — SOPs, products, assessments, missions and QA are static, so every locked rule is presentational only. This is the single largest blocker.
2. **Client-side-only auth/MFA gate** — protected content can render before redirect and the MFA flag is browser-controlled.
3. **Ungrounded AI** — answers are model-invented and static fallbacks are presented as SOP guidance; unsafe for banking operations without retrieval and citations.
4. **Silent identity fallback** — an unknown signed-in email resolves to the first CEE in the directory, granting an unintended persona.
5. **Role enum expansion** touches dashboards, sidebar, guards and RLS simultaneously — must be sequenced as one coordinated migration + refactor.
6. **Public-indexing assumptions baked in** while the project must stay unpublished.

## D. Confirmation
Nothing was changed. No files were edited, no migration was run, no settings or visibility were touched, and the project remains unpublished. This document is a read-only verification report.
