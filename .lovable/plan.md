# CoreSphere AI — Controlling Implementation Baseline

CONTROLLING DOCUMENT. This file supersedes all earlier planning material, including the Phases A–F roadmap, which is now historical and non-controlling. Batch 0 verification findings are retained, non-controlling, at `.lovable/audits/batch-0-preflight.md`.

## 1. Locked project identity
1. Official name: CoreSphere AI.
2. Purpose: internal Customer Fulfilment Centre enterprise knowledge, learning, QA coaching and operations-intelligence platform.
3. The project remains unpublished until authenticated UAT is formally approved.
4. Production is internal and non-indexable. Demo behaviour must ultimately be separated by environment.

## 2. Locked information architecture
1. No standalone Product Intelligence sidebar item.
2. Products & Services is one of eight Knowledge Hub domains.
3. The eight domains: CFC Foundations; Complaints; Enquiries; Requests; Products & Services; Logging & Escalation Guides; Forms & Resources; BO Engagement & Directories.
4. No top-level Service Excellence Centre.
5. Learning Pulse is a governed publication stream, not an independent uncontrolled source of truth.
6. Meeting minutes, Weekly Digests, Did You Know publications and briefing points are source evidence. They must not become direct AI truth unless an approved canonical knowledge record is created from them.

## 3. Locked role and position hierarchy
Customer Experience Executive (CEE); Team Lead; Unit Head; QA Officer; QA Team Lead; QA Unit Head; L&D Officer; L&D Team Lead; L&D Unit Head; Head of CFC Operations; Group Head; Platform Administrator; Temporary or Delegated Approver.

QA Officer, QA Team Lead and QA Unit Head must not be collapsed into a single `qa` role. L&D levels must not be collapsed. Platform Administrator holds technical authority only and cannot approve operational knowledge by virtue of technical access.

## 4. Locked organisational structure
Configurable hierarchy, not a flat hardcoded department list.

```text
Customer Fulfilment Group
├─ Office of the Group Head
├─ CFC Operations
├─ Dispute Resolution & Service Recovery Portfolio
├─ Alternative Channel Sales Portfolio
├─ Inbound
├─ Service Recovery
├─ Quality Assurance
├─ Learning & Development
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
