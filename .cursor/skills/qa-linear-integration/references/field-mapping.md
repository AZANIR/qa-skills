# QA → Linear Field Mapping

*Mapping local QA fields (from qa-bug-ticket-creator, qa-task-creator) to Linear issue fields.*

---

## Bug Report → Linear Issue

| QA Bug Field | Linear Field | Notes |
| ------------ | ------------ | ----- |
| Title | `title` | Direct mapping; keep concise |
| Expected Result | `description` | In **Expected** section |
| Actual Result | `description` | In **Actual** section |
| Steps to Reproduce | `description` | In **Steps** section |
| Environment | `description` | In **Environment** section |
| Evidence | `description` | In **Evidence** section (code blocks) |
| Severity | `priority` + `labelIds` | See severity mapping below |
| Priority (P1–P5) | `priority` | See priority mapping below |
| Component/Module | `labelIds` | Map to Linear labels (e.g., `auth`, `frontend`) |

### Severity → Linear Priority

| QA Severity | Linear Priority |
| ----------- | --------------- |
| Blocker | 1 (Urgent) |
| Critical | 1 (Urgent) |
| Major | 2 (High) |
| Minor | 3 (Medium) |
| Trivial | 4 (Low) |

### Priority (P1–P5) → Linear Priority

| P1 | 1 (Urgent) |
| P2 | 2 (High) |
| P3 | 3 (Medium) |
| P4 | 4 (Low) |
| P5 | 4 (Low) |

---

## Task → Linear Issue

| QA Task Field | Linear Field | Notes |
| -------------- | ------------ | ----- |
| Title | `title` | Direct mapping |
| Description | `description` | Full context |
| Acceptance criteria | `description` | In **Acceptance Criteria** section |
| Task type | `labelIds` | `development`, `qa`, `documentation`, `enhancement` |
| Component | `labelIds` | Same as bug component labels |
| Links (bug, requirement) | `description` + relations | "Fixes BUG-123" in body; use `issueRelationCreate` for blocks |
| Parent bug | `parentId` or relation | Sub-task: `parentId`; fix task: "blocks" relation |

### Task Type → Linear Labels

| QA Task Type | Suggested Label |
| ------------ | --------------- |
| Development | `development` |
| QA | `qa` |
| Documentation | `documentation` |
| Enhancement | `enhancement` |

---

## Description Format (Markdown)

Use consistent structure for both bugs and tasks:

```markdown
## Expected
[Expected result]

## Actual
[Actual result]

## Steps to Reproduce
1. Step one
2. Step two

## Environment
- OS: ...
- Browser: ...

## Evidence
```
[Logs, stack trace]
```

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
```

For tasks, omit Expected/Actual/Steps when not applicable; include Acceptance Criteria.

---

## Labels

Create or reuse labels in Linear for:

- **Component:** `auth`, `checkout`, `api`, `frontend`, `backend`
- **Type:** `bug`, `task`, `story`, `enhancement`
- **Source:** `qa`, `test-failure`, `coverage-gap`, `spec-audit`

Query existing labels:

```graphql
query { issueLabels { nodes { id name } } }
```

Use `labelIds` (array of UUIDs) in issueCreate.

---

## Team and Project

- **teamId** — Required for issue creation. Resolve from team key (e.g., `ENG`) via teams query.
- **projectId** — Optional; assign to project.
- **cycleId** — Optional; add to active cycle (sprint).

When user specifies "add to project X" or "add to cycle Y", query projects/cycles and use matching IDs.
