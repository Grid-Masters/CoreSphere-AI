# CoreSphere AI

CoreSphere AI is a private, pre-production knowledge, learning, QA coaching and operations-intelligence platform for the Customer Fulfilment Centre.

> **Approval status:** The platform is not approved for production banking use. It must remain private and unpublished until authenticated UAT, information-security review, operational-risk review and formal stakeholder approval are complete.

## Repository status

- Lovable project: `22d92d5c-d31f-427f-9f00-5c9e88499e04`
- Default branch: `main`
- Hosting state: private and unpublished
- Controlling implementation baseline: [`.lovable/plan.md`](.lovable/plan.md)

## Organisational hierarchy

The organisation model is database-backed and configurable. The canonical reporting order is:

`Group Head → Head of CFC Operations → Unit Head family → Team Lead family → Officer family`

| Tier | Standard operations | Quality Assurance | Learning and Development |
| --- | --- | --- | --- |
| 1 | Group Head | Group Head | Group Head |
| 2 | Head of CFC Operations | Head of CFC Operations | Head of CFC Operations |
| 3 | Unit Head | QA Unit Head | L&D Unit Head |
| 4 | Team Lead | QA Team Lead | L&D Team Lead |
| 5 | CEE | QA Officer | L&D Officer |

The two enabling departments are named exactly:

- Quality Assurance Team (Q.A)
- Learning and Development Team (L & D)

Both sit under CFC Operations. The QA and L&D Unit Heads report to the Head of CFC Operations, which reports to the Group Head.

## Delivery state

- Package A: completed and recorded.
- Package B: schema/storage foundation present; end-to-end workflow and acceptance closure remain incomplete.
- Package C: database/capability foundation present; server workflows, user interfaces and acceptance closure remain incomplete.
- Packages D–F: not started.

Later packages must not begin until the unfinished Package B/C acceptance gates have been reconciled.

## Development rules

1. Work through branches and reviewed pull requests.
2. Never publish automatically.
3. Never treat fixtures, demo identities or static content as production authority.
4. Keep Platform Administrator technical-only.
5. Preserve distinct QA and L&D position levels.
6. Put schema changes in additive migrations and regenerate Supabase types.
7. Do not commit `.env` files or secrets.
8. Stop at a failed build, typecheck, migration or acceptance gate.

## Local checks

```bash
bun install
bun run typecheck
bun run lint
bun run build
```

Database migrations must be reviewed and applied only through the controlled Lovable/Supabase environment. A successful Git commit does not prove that a migration has been applied.
