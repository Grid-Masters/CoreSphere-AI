# CoreSphere AI — Controlling Implementation Baseline

CONTROLLING DOCUMENT. This file supersedes all earlier planning material, including the Phases A–F roadmap, which is now historical and non-controlling. Batch 0 verification findings are retained, non-controlling, at `.lovable/audits/batch-0-preflight.md`.

## 1. Locked project identity
1. Official name: CoreSphere AI.
2. Purpose: internal Customer Fulfilment Centre enterprise knowledge, learning, QA coaching and operations-intelligence platform.
3. The project is private and unpublished. It is not approved for production banking use.
4. Authenticated UAT, information-security review, operational-risk review and formal stakeholder approval are mandatory before any production decision.
5. Any eventual production environment must remain internal and non-indexable, with demo access disabled and environment-separated.

## 2. Locked information architecture
1. No standalone Product Intelligence sidebar item.
2. Products & Services is one of eight Knowledge Hub domains.
3. The eight domains: CFC Foundations; Complaints; Enquiries; Requests; Products & Services; Logging & Escalation Guides; Forms & Resources; BO Engagement & Directories.
4. No top-level Service Excellence Centre.
5. Learning Pulse is a governed publication stream, not an independent uncontrolled source of truth.
6. Meeting minutes, Weekly Digests, Did You Know publications and briefing points are source evidence. They must not become direct AI truth unless an approved canonical knowledge record is created from them.

## 3. Locked role and position hierarchy
Customer Experience Executive (CEE); Team Lead; Unit Head; QA Officer; QA Team Lead; QA Unit Head; L&D Officer; L&D Team Lead; L&D Unit Head; Head of CFC Operations; Group Head; Platform Administrator; Temporary or Delegated Approver.

The canonical five-tier operational reporting order is:

`Group Head → Head of CFC Operations → Unit Head family → Team Lead family → Officer family`.

Position-family expansion is mandatory:

| Tier | Standard operations | Quality Assurance | Learning and Development |
| --- | --- | --- | --- |
| 1 | Group Head | Group Head | Group Head |
| 2 | Head of CFC Operations | Head of CFC Operations | Head of CFC Operations |
| 3 | Unit Head | QA Unit Head | L&D Unit Head |
| 4 | Team Lead | QA Team Lead | L&D Team Lead |
| 5 | CEE | QA Officer | L&D Officer |

QA Officer, QA Team Lead and QA Unit Head must not be collapsed into a single `qa` role. L&D levels must not be collapsed. The QA Unit Head and L&D Unit Head report to the Head of CFC Operations, which reports to the Group Head. Platform Administrator holds technical authority only, sits outside the operational reporting chain and cannot approve operational knowledge by virtue of technical access. Temporary or Delegated Approver is capability-only and cannot be a standing primary position.

## 4. Locked organisational structure
Configurable hierarchy, not a flat hardcoded department list.

```text
Customer Fulfilment Group
├─ Office of the Group Head
├─ CFC Operations
│  ├─ Quality Assurance Team (Q.A)
│  └─ Learning and Development Team (L & D)
├─ Dispute Resolution & Service Recovery Portfolio
├─ Alternative Channel Sales Portfolio
├─ Inbound
├─ Service Recovery
├─ Video Validation
├─ BPI
├─ Social Media
├─ Multimedia
│  ├─ Email
│  └─ Live Chat
├─ Resolution
├─ Operations Support
├─ Virtual Banking Dispute Team
├─ Fraud Help Desk
│  ├─ FHD Operations / Fraud Help Desk
│  ├─ Incident Containment
│  └─ Block Card
└─ Alternative Channels
```

Supported unit types: GROUP, EXECUTIVE_PORTFOLIO, DEPARTMENT, LINE_OF_BUSINESS, UNIT, TEAM, DESK. Parent-child assignment, scope and effective dates must all be configurable.

## 5. Locked knowledge governance
1. Original source files belong in an immutable Source Vault.
2. Uploading or registering a source does not publish it.
3. Staff-facing operational guidance comes only from approved Canonical Knowledge Registry records.
4. Published knowledge retains authoritative source links, version, effective date, owner and audience scope.
5. Approved versions are immutable; later changes create new versions with supersession links.
6. Unresolved conflicts are quarantined and excluded from AI, assessments, Mission Control generation and simulations.
7. Latest document date alone does not establish authority.
8. Knowledge Conflict Queue visibility is limited to L&D personnel, Head of CFC Operations and Group Head.
9. QA Unit Head and process owners may receive restricted clarification requests without gaining queue access.
10. Only approved current customer-facing forms may be downloaded. Internal SOPs, policies, manuals, directories, minutes, digests, QA materials and training videos remain controlled view-only or stream-only.

## 6. Locked Mission Control model
1. A persisted personalised learning-assignment engine for CEEs and eligible operational staff — not a deterministic daily card.
2. Assignment sources: CoreSphere AI under L&D-approved rules; L&D; the CEE's currently assigned QA Officer; Team Lead for their own team; Unit Head for their own department.
3. Mission items may include approved SOPs, policies, product guides, process updates, service standards, theory, video, logging exercises, scenarios and acknowledgements.
4. AI may assign based on QA development areas, failed assessment topics, repeated logging mistakes, incomplete mandatory learning, newly approved knowledge and role-relevant gaps.
5. Duplicate assignments for the same employee, knowledge version and overlapping period merge into one visible mission while retaining every source and reason.
6. Points, readiness, levels and streaks derive from real persisted events — never email hashes or the calendar alone.
7. Confidential QA findings must not appear on leaderboards or public recognition views.

## 7. Locked assessment model
1. Weekly AI Knowledge Check is personalised from assessment-eligible Mission Control items assigned to that CEE in the applicable weekly cycle.
2. Monthly L&D Assessment remains L&D-owned; AI may create a draft only.
3. Monthly workflow: L&D Officer → L&D Team Lead → L&D Unit Head.
4. AI cannot independently publish the monthly assessment.
5. Every question retains the exact approved knowledge version and supporting source section.
6. General assessment attempts: attempt 1 initial, attempt 2 retake, maximum 2 total.
7. No automatic third attempt; reopening requires an authorised exception.
8. General assessment-result visibility: CEE own result; Team Lead own team; Unit Head own department; authorised L&D assigned/enterprise scope; Head of CFC Operations enterprise operational oversight; Group Head enterprise oversight; QA Officer / QA Team Lead / QA Unit Head their own personal result only, never results of CEEs they audit; Platform Administrator own personal result only.
9. QA may see completion status of a QA-assigned corrective mission, but never the CEE's Weekly AI Knowledge Check or Monthly L&D Assessment score or responses.

## 8. Locked CoreSphere AI behaviour
1. Operational answers must be grounded only in approved, active, effective, scoped, non-expired, non-superseded, non-conflicted, AI-eligible canonical knowledge.
2. Every answer cites the knowledge record and version used.
3. When verified evidence is unavailable, respond safely rather than inventing guidance.
4. Never fabricate procedures, timelines, limits, escalation routes or compliance rules.
5. Preserve existing HR governance restrictions: no promotion, pay, disciplinary, transfer or succession recommendations; no employment ranking.

## 9. Locked QA model
1. QA Officer, QA Team Lead and QA Unit Head are distinct.
2. QA Officer accesses and coaches only staff assigned for the active QA period.
3. QA Team Lead manages QA Officer assignments and reviews QA work.
4. QA Unit Head oversees QA governance, scorecard standards and cross-team trends.
5. QA scorecards remain monthly only.
6. QA development actions may create approved Mission Control assignments.
7. QA roles gain no general assessment-result access.

## 10. Locked implementation dependency order
1. Identity and organisational capability model
2. Authentication, server-side route protection and RLS
3. AI safety and demonstration-data containment
4. Source Vault
5. Canonical Knowledge Registry
6. Knowledge conflict and supersession governance
7. Governed Knowledge Hub and enterprise search
8. Grounded CoreSphere AI
9. Mission Control
10. Weekly and monthly assessment engine
11. Interactive Logging Lab and Scenario Simulator
12. QA Coaching and Performance workflows
13. Migration of the reviewed 291-file corpus
14. Authenticated UAT, and only then a publication decision

## 11. Locked delivery rules
1. One controlled batch at a time.
2. Preserve useful visual components; do not rebuild from scratch.
3. Do not implement later batches early.
4. Before each batch, establish a checkpoint and record affected schema.
5. After each batch, run build/type checks, report files and database objects changed, then stop.
6. Never publish automatically.
7. No broad "improve anything else" requests.
8. No mock or static record may be treated as production authority.
9. Stop at a failed acceptance gate.

## 12. Deferred housekeeping (not authorised in Batch 1)
Recorded for the batch that owns the relevant surface:
- Rename "CoreSphere Pulse AI" in `src/lib/org-structure.ts` — Batch for the identity/organisation model.
- Remove Phase C/D/F comments in `src/lib/alerts.ts`, `src/lib/recognition.ts`, `src/components/CoreSphereAI.tsx` — with their owning feature batches.
- Remove the legacy "Product Intelligence" comment in `src/lib/product-knowledge.ts` — with the Knowledge Hub batch.
- Align `robots.txt`, `llms.txt`, sitemap and canonical metadata with non-indexable internal production — with the UAT/publication-readiness batch.

## 13. Batch 1 scope (this batch)
Documentation and planning alignment only. No application code, no database change, no publication, no visibility change.

---

# Batch 3 — Authentication, Route Boundary, Session and RLS Hardening

Read-only audit complete. Base checkpoint `b0f1d1fa1c328ccd1869abc5a05c427cdc991e88`. Project stays private and unpublished.

## A. Verified current risks (each confirmed by reading code or querying the database)

1. **Route protection is entirely client-side.** `AppShell` calls `useAuthGate()`, which runs inside `useEffect`, reads `supabase.auth.getSession()` and redirects with `navigate()`. No route uses `beforeLoad`, and there is no `_authenticated` layout in `src/routes/`.
2. **MFA state is a client flag.** `src/lib/auth-gate.ts` treats `sessionStorage["coresphere:mfa"] === "1"` as verified; `/mfa` sets it. Anyone can set it in devtools and skip MFA. The authoritative `user_sessions.mfa_verified` column exists but is never re-read as a gate.
3. **Hard-token MFA is not real verification.** `verifyHardToken` validates only `/^\d{6}$/` plus the existence of an active `hard_tokens` row. Any 6-digit string succeeds — fake MFA success.
4. **Session id is client-supplied.** `verifyHardToken`, `touchSession`, `endSession` accept `session_id` from `sessionStorage`. Scoping by `user_id` blocks cross-user abuse, but a user can mark any of their own sessions verified, and no expiry or revocation is ever checked.
5. **Demo sign-in is not environment-gated.** `demoSignIn` only checks the persona allow-list, then signs in with the server `DEMO_PASSWORD`. It would work identically in production, and `login.tsx` lets demo sessions **bypass MFA** (`requireMfa = external && !isDemo`).
6. **Deceptive login controls.** "Remember this device" is an unwired checkbox; "Forgot password?" is `<a href="#">`.
7. **RoleGuard is UI-only** (correctly documented as such), so for `/administration` the real boundary is RLS alone — see item 9.
8. **Legacy `has_role`/`app_role` is still the authorization source for most policies.** Confirmed `has_role(...,'sysadmin')` grants ALL on `capabilities`, `positions`, `organisation_units`, `position_capabilities`, `position_assignments`, `user_capability_grants`, `delegations`, `hard_tokens`, `trusted_networks`, and SELECT on all `audit_events` and all `user_sessions` — making Platform Administrator a database super-user, contrary to the "technical only" lock.
9. **`profiles` SELECT too broad.** `Leaders view all profiles` grants every `ld`, `team_lead`, `group_head` **and `qa`** enterprise-wide read of all profiles, with no org-unit scoping.
10. **Reference tables readable with `USING (true)`**: `positions`, `organisation_units`, `position_capabilities`, `capabilities`, `departments`, and notably **`trusted_networks`** — the bank's internal CIDR allow-list is exposed to every signed-in user.
11. **`audit_events` INSERT allows `user_id IS NULL`** from any authenticated client, permitting unattributed audit rows. `logAuditEvent` also resolves users by listing up to 200 auth users by email.
12. **Public indexing is enabled.** `robots.txt` is `Allow: /` with a live `Sitemap:`; `llms.txt` advertises the platform; `sitemap[.]xml.tsx` publishes route URLs; routes carry absolute canonical/OG URLs to `ubacoresphere-pulse.lovable.app`.
13. **No service-role exposure found** — `client.server.ts` is imported only inside handlers (`await import`). Invariant holds.
14. **No `user_metadata` / email-pattern authorization found.** `src/lib/identity.ts` resolves strictly from `profiles` + `position_assignments` + capabilities. Preserve.

## B. Batch 3 scope (exactly this)

1. Server-side protected-route boundary. 2. Fail-closed MFA. 3. Authoritative session lifecycle. 4. Environment-enforced demo access. 5. Remove deceptive login controls. 6. Least-privilege RLS correction. 7. Internal/non-indexable protections.
No feature changes, no new domain tables, no AI containment, Source Vault, Registry, Mission Control, assessment or QA work.

## C. Proposed approach, migrations and functions

### C1. Route boundary (no wholesale auth migration)
Move protected routes under `src/routes/_authenticated/` using the managed `ssr: false` gate, paired with **server-side authorization on every data path**. Rationale: Supabase keeps the session in `localStorage`, so an SSR cookie gate needs an httpOnly cookie bridge plus custom middleware — a second source of session truth and a hard-refresh redirect-loop risk, not justified here. The real boundary is the data: every read/write already runs as the signed-in user under RLS via `requireSupabaseAuth`. Privileged screens (`/administration`, `/admin`, `/analytics`) additionally get a server function that returns data only when the caller holds the required capability, so `RoleGuard` becomes cosmetic rather than the control. Verified by: unauthenticated fetch of a protected route returns no protected data; server functions 401 without a bearer; a signed-in non-admin is rejected server-side.

### C2. MFA, fail-closed
`verifyHardToken` cannot verify an OTP and no external token service will be fabricated. It becomes fail-closed: no path returns success from format matching. A new `getSessionAssurance` server function returns `{ authenticated, mfa_required, mfa_verified, session_valid }` from `user_sessions` plus live network classification; the gate consumes only that, replacing the `coresphere:mfa` flag. `/mfa` becomes an honest "additional verification required — contact IT Support or sign in from the UBA network" state. Internal trusted-network sign-in remains fully usable.

### C3. Session lifecycle
The server derives the active session itself (latest non-ended session for `context.userId`) instead of trusting a client `session_id` for state changes. Idle timeout (proposed 30 minutes on `last_activity_at`) and absolute cap (proposed 12 hours) enforced in `getSessionAssurance`; expiry ends the session and signs the user out. Sign-out does the ordered teardown: cancel queries, clear cache, `endSession`, `signOut()`, `navigate({ to: '/login', replace: true })`, plus an audit event. Ended/revoked sessions are rejected at the next assurance check.

### C4. Demo access
`demoSignIn` returns `{ ok: false }` unless an explicit server env flag (e.g. `DEMO_ACCESS_ENABLED === 'true'`) is set; absence means disabled. UI hiding is secondary. Demo sessions no longer bypass MFA.

### C5. Proposed migrations (additive, rollback-safe, RLS preserved everywhere)
Migration 1 — least privilege on identity/security tables:
- `trusted_networks`: drop the authenticated-readable policy; SELECT requires `platform.security.manage`. Server classification is unaffected (it uses the server-side client).
- `profiles`: replace `Leaders view all profiles` with own-profile, identity-manager (existing capability policy) and leader-scoped-to-own-org-subtree access via a new `SECURITY DEFINER` helper `public.can_view_profile(_viewer uuid, _profile_user uuid)`. The blanket `qa` enterprise read is removed.
- `audit_events`: INSERT `WITH CHECK (user_id = auth.uid())` (no NULL); SELECT via `platform.audit.read` instead of `has_role('sysadmin')`.
- `user_sessions`: replace the `sysadmin` SELECT with the security capability; own-row access unchanged.
- `hard_tokens`: replace `sysadmin` ALL with `platform.security.manage`; own-row SELECT kept.
- `capabilities`, `positions`, `position_capabilities`, `organisation_units`, `position_assignments`, `user_capability_grants`, `delegations`: replace `sysadmin` ALL with `platform.identity.manage`, keeping Platform Administrator technical-only and never granting operational approval authority.
- Reference SELECT on `positions`, `capabilities`, `position_capabilities`, `organisation_units` stays authenticated-readable (no personal data; the app needs it).

Migration 2 — `public.session_is_valid(_session_id uuid)` `SECURITY DEFINER`, false when ended, revoked, idle-expired or absolutely expired.

No new domain tables; no changes to `auth`, `storage`, `realtime`, `vault`. Locked assessment/QA visibility rules untouched.

### C6. Indexing protections
`robots.txt` → `Disallow: /`, no `Sitemap:`. `llms.txt` → single restricted-system line or removed. Delete `src/routes/sitemap[.]xml.tsx`. Add `noindex, nofollow` in `__root.tsx` and drop stale absolute canonical/OG URLs from route `head()` blocks, keeping titles and descriptions.

## D. Files likely to change
`src/lib/auth-gate.ts`; new `src/routes/_authenticated/route.tsx` plus relocation of protected routes; `src/components/layout/AppShell.tsx`; `src/components/auth/RoleGuard.tsx`; `src/routes/login.tsx`; `src/routes/mfa.tsx`; `src/routes/__root.tsx`; `src/lib/platform-foundation.functions.ts`; `src/lib/demo-auth.functions.ts`; `src/lib/demo-profiles.ts`; `src/components/layout/TopBar.tsx`; `src/routes/administration.tsx`, `admin.tsx`, `analytics.tsx`; `public/robots.txt`; `public/llms.txt`; delete `src/routes/sitemap[.]xml.tsx`; two migrations.
`src/lib/identity.ts` and `IdentityProvider.tsx` are consumed, not redesigned.

## E. Security invariants
1. No service-role key or `client.server` import reachable from browser code. 2. No authorization from `user_metadata`, email patterns, names or fixtures. 3. No MFA path succeeds without real verification. 4. RLS enabled everywhere; no `USING (true)` on personal, security or audit data. 5. Platform Administrator technical-only. 6. All 13 positions remain distinct. 7. Demo access impossible without an explicit server env flag. 8. Project stays private and unpublished.

## F. Acceptance tests
1. Unauthenticated navigation to `/`, `/administration`, `/admin`, `/analytics`, `/qa-coaching` redirects to `/login` with no protected data in HTML or network responses.
2. Server functions without a bearer return 401.
3. Idle-expired and ended/revoked sessions are rejected and force sign-out.
4. No-profile, inactive-profile and no-assignment users reach "Access not provisioned" with no data.
5. External-network sign-in cannot enter the app; no 6-digit string grants access.
6. Internal trusted-network sign-in completes normally.
7. With the demo flag unset, `demoSignIn` returns not-ok and Demo Access UI is absent.
8. A non-admin calling the administration data function is rejected server-side.
9. RLS negative tests: non-privileged users cannot read others' profiles, sessions, audit events, `trusted_networks` or hard tokens.
10. A foreign `session_id` cannot alter another session's MFA state (fixation/replay).
11. Sign-out clears cache, ends the session row, and Back does not restore protected content.
12. Repository search confirms no service-role reference and no `user_metadata` authorization in client-reachable code.
13. TypeScript build passes; browser console clean on login, MFA, dashboard, administration.
14. `robots.txt` disallows all; no sitemap route; `noindex, nofollow` present; project still unpublished.

## G. Rollback / checkpoints
Checkpoint 3.0 = `b0f1d1fa`. Four independently revertable steps: (3.1) route boundary + session assurance; (3.2) MFA fail-closed + demo env gate + login control cleanup; (3.3) RLS migrations; (3.4) indexing protections. Each migration is an additive policy replacement carrying the prior policy definition in a comment. Stop at the first failed acceptance gate and revert only that step.

## H. Explicitly deferred
Real bank hard-token/OTP integration; password reset and self-service credential flows; httpOnly cookie session bridge and full SSR auth; full retirement of legacy `app_role`/`has_role` on non-identity tables (`suggestions`, `feedback`, `certificates`, `acknowledgments`, `approved_quotes`, `teams`); AI containment, Source Vault, Canonical Registry, conflict governance, Knowledge Hub rebuild, Mission Control, assessments, QA workflows, corpus migration, UAT and publication.

---

# Batch 3 — CLOSED

RLS repair applied: scoped profile visibility via `org_unit_and_descendants`,
append-only `audit_events` (server-authored only), server-owned session state
with `is_demo`, narrowed policies on `trusted_networks`, `certificates`,
`risk_snapshots`, `approved_quotes`, and capability-based administration gates.

# Package A — Foundation Closure (COMPLETE)

Base checkpoint: `40927ef1aec5414c868e660ea2d5689e98669c6b`. Project remains
PRIVATE and UNPUBLISHED.

- **A1 Safe UAT demo access.** `demoAccessStatus` / `demoSignIn` enable demo
  sign-in only for the exact private preview/UAT hosts or an explicit
  `DEMO_ACCESS_ENABLED=true` server flag. No wildcard host, no published host;
  unknown/unreadable host fails closed. Demo sessions stay `is_demo = true`
  and audited; the shared password never reaches the client bundle.
- **A2 Delegated authority cleanup.** `delegations_capability_only` enforces
  capability-only, time-bound delegation; a trigger blocks
  `DELEGATED_APPROVER` from being used as a primary position assignment.
- **A3 High-risk legacy authority cleanup.** No `sysadmin`-role RLS
  expressions remain in `public`; operational tables are capability-gated.
- **A4 Foundation performance / type safety.** Indexes on active sessions and
  audit lookups; `typecheck` script present and passing.
- **A5 AI safety containment.** `askCoreSphereAI` and `assessScenario` fail
  safe with the locked refusal string; no fabricated SOPs, scores, SLAs or
  escalation routes. Writing Assistant transforms supplied text only.
- **A6 Fixture / data-truth containment.** Prototype surfaces (Alert Centre,
  FAQ Centre, Knowledge Hub, QA Coaching Hub, Performance Intelligence) carry
  a `FixtureNotice` marker; arbitrary personnel fallbacks removed from QA and
  Team Lead dashboards in favour of truthful empty states.
- **A7 Internal metadata cleanup.** All JSON-LD/structured data removed from
  the internal app; `robots.txt` disallows all and every route sends
  `noindex, nofollow`.
- **A8 Controlling document sync.** This section.

## Current delivery state

- **Package A:** complete and recorded.
- **Package B:** Knowledge Governance schema/storage foundation is present at checkpoint `260ee71325930be9745e6424ad234fb23c509d13`; end-to-end workflow and acceptance closure are not yet recorded.
- **Package C:** core database/capability foundation is present at checkpoint `5bf0accb842207c6319bf31f9c8679cc2c8c2953`; server workflows, user interfaces and acceptance closure remain incomplete.
- **Packages D–F:** not started.
- No later package may begin until the hierarchy correction is merged, the migration is applied in the controlled environment, and unfinished Package B/C acceptance gates are reconciled.

Next gate: validate this repository/hierarchy alignment, then close the outstanding Package B and Package C acceptance work. No production publication is authorised.
