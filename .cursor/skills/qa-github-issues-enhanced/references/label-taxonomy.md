# Label Taxonomy for QA GitHub Issues

*Complete label taxonomy with naming conventions and color codes for GitHub Issues.*

---

## Naming Conventions

- **Prefix format**: `category/value` (e.g., `type/bug`, `priority/high`)
- **Flat labels**: Use for simple tags without hierarchy (e.g., `needs-triage`, `verified`)
- **Lowercase**: All labels use lowercase with hyphens
- **Consistent**: Same prefix for same category across all labels

---

## Type Labels (`type/`)

| Label | Color | Description |
| ----- | ----- | ----------- |
| `type/bug` | `#d73a4a` (red) | Defect or incorrect behavior |
| `type/enhancement` | `#a2eeef` (cyan) | New feature or improvement |
| `type/task` | `#7f8c8d` (gray) | Work item, chore, or maintenance |
| `type/documentation` | `#0075ca` (blue) | Docs, specs, or README updates |
| `type/test-coverage-gap` | `#fbca04` (yellow) | Missing or insufficient test coverage |
| `type/flaky-test` | `#f9d0c4` (light red) | Intermittent or unreliable test |
| `type/security` | `#ee0701` (dark red) | Security vulnerability or hardening |

---

## Priority Labels (`priority/`)

| Label | Color | Description |
| ----- | ----- | ----------- |
| `priority/critical` | `#b60205` (dark red) | Fix immediately; blocks release |
| `priority/high` | `#d93f0b` (orange-red) | Fix in current sprint |
| `priority/medium` | `#fbca04` (yellow) | Fix in next sprint |
| `priority/low` | `#0e8a16` (green) | Backlog; fix when possible |

---

## Component Labels (`component/`)

| Label | Color | Description |
| ----- | ----- | ----------- |
| `component/frontend` | `#1d76db` (blue) | UI, React, Vue, Angular |
| `component/backend` | `#5319e7` (purple) | Server, services, business logic |
| `component/api` | `#0052cc` (blue) | REST, GraphQL, gRPC endpoints |
| `component/auth` | `#c5def5` (light blue) | Login, auth, permissions |
| `component/database` | `#bfdadc` (light gray) | DB, migrations, queries |
| `component/integration` | `#c2e0c6` (light green) | Third-party, external services |
| `component/mobile` | `#bfd4f2` (light blue) | iOS, Android, mobile web |
| `component/e2e` | `#d4c5f9` (lavender) | End-to-end tests |
| `component/unit` | `#fef2c0` (light yellow) | Unit tests |
| `component/performance` | `#f9d0c4` (light red) | Load, stress, performance tests |

---

## Status Labels (`status/`)

| Label | Color | Description |
| ----- | ----- | ----------- |
| `status/needs-triage` | `#d93f0b` (orange) | New; awaiting review |
| `status/in-progress` | `#0052cc` (blue) | Being worked on |
| `status/ready-for-test` | `#0e8a16` (green) | PR merged; QA verification pending |
| `status/verified` | `#0e8a16` (green) | QA confirmed fix |
| `status/blocked` | `#b60205` (red) | Waiting on dependency |
| `status/wontfix` | `#ffffff` (white) | Declined; out of scope |

---

## QA-Specific Labels

| Label | Color | Description |
| ----- | ----- | ----------- |
| `docs-update` | `#0075ca` (blue) | Documentation change |
| `spec-drift` | `#fbca04` (yellow) | Spec-auditor finding; spec vs implementation |
| `regression-risk` | `#f9d0c4` (light red) | Changelog-analyzer flagged |
| `needs-repro` | `#d93f0b` (orange) | Cannot reproduce; needs more info |
| `duplicate` | `#cfd3d7` (gray) | Duplicate of another issue |

---

## Color Reference (Hex Codes)

| Color Name | Hex | Use |
| ---------- | --- | --- |
| Red (critical) | `#d73a4a` | Bugs, critical priority |
| Dark red | `#b60205` | Blockers, critical |
| Orange | `#d93f0b` | High priority, needs attention |
| Yellow | `#fbca04` | Medium priority, warnings |
| Green | `#0e8a16` | Done, verified, low priority |
| Blue | `#0052cc` | In progress, API, info |
| Cyan | `#a2eeef` | Enhancements |
| Purple | `#5319e7` | Backend, special |
| Gray | `#7f8c8d` | Tasks, neutral |
| Light gray | `#cfd3d7` | Duplicates, deprecated |

---

## GitHub Label Creation

To create labels via GitHub MCP or API:

```json
{
  "name": "type/bug",
  "color": "d73a4a",
  "description": "Defect or incorrect behavior"
}
```

**Note**: GitHub expects 6-character hex without `#`. Use lowercase.

---

## Recommended Label Sets by Repo Type

| Repo Type | Essential Labels |
| --------- | ----------------- |
| **QA-focused** | `type/bug`, `type/test-coverage-gap`, `type/flaky-test`, `type/documentation`, `priority/*`, `component/*`, `status/*` |
| **Full-stack** | All `type/`, `priority/`, `component/`, `status/` |
| **Minimal** | `type/bug`, `type/enhancement`, `priority/high`, `priority/medium`, `status/needs-triage`, `status/in-progress` |

---

## Customization

- Add project-specific components (e.g., `component/checkout`, `component/search`)
- Add team labels (e.g., `team/qa`, `team/platform`)
- Add sprint/release labels if not using milestones (e.g., `sprint/24-01`)
