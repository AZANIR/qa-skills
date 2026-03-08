# QA Field → Shortcut Field Mapping

## Bug Report (from qa-bug-ticket-creator)

| QA Field | Shortcut Field | Notes |
| -------- | -------------- | ----- |
| Title | `name` | Direct mapping |
| Description (expected/actual/steps) | `description` | Markdown; use headers for structure |
| Severity | `labels` | e.g., `severity-critical`, `severity-major` |
| Priority | `labels` | e.g., `priority-p1`, `priority-p2` |
| Component/Module | `labels` | e.g., `auth`, `frontend`, `api` |
| Environment | `description` | Append to description or comment |
| Evidence (screenshots, logs) | `external_links` | Link to artifact URLs |
| — | `story_type` | Always `bug` for bug reports |

## QA Task (from qa-task-creator)

| QA Field | Shortcut Field | Notes |
| -------- | -------------- | ----- |
| Title | `name` | Direct mapping |
| Description + acceptance criteria | `description` | Markdown |
| Task type (Dev/QA/Docs/Enhancement) | `story_type` | Dev→feature, QA→chore, Docs→chore, Enhancement→feature |
| Component | `labels` | Component label |
| Links to bug/requirement | `external_links` | Add URL + title |
| — | `story_type` | `feature` or `chore` per task type |

## Coverage Gap (from qa-coverage-analyzer)

| QA Field | Shortcut Field | Notes |
| -------- | -------------- | ----- |
| Gap description (e.g., "Add tests for AuthService") | `name` | Concise |
| Module/file, coverage % | `description` | Context |
| Component | `labels` | e.g., `test-coverage-gap`, `auth` |
| — | `story_type` | `chore` |

## Flaky Test (from qa-flaky-detector)

| QA Field | Shortcut Field | Notes |
| -------- | -------------- | ----- |
| Test name + "flaky" | `name` | e.g., "Login E2E test flaky" |
| Pattern, frequency | `description` | Flaky pattern details |
| Component | `labels` | e.g., `flaky-test`, `auth` |
| — | `story_type` | `bug` |

## Workflow State Mapping

| QA Status | Shortcut workflow_state | Typical name |
| --------- | ----------------------- | ------------ |
| New/Open | Initial state | "To Do", "Backlog" |
| In Progress | Mid-state | "In Progress", "Development" |
| Ready for Test | Pre-done | "Ready for QA", "Review" |
| Verified/Done | Done state | "Done", "Verified" |

Resolve `workflow_state_id` from `GET /api/v3/workflows`; names vary by workspace.

## Label Conventions

| Category | Examples |
| -------- | -------- |
| Severity | `severity-critical`, `severity-major`, `severity-minor` |
| Priority | `priority-p1`, `priority-p2`, `priority-p3` |
| Component | `auth`, `frontend`, `api`, `checkout` |
| Test type | `test-type-unit`, `test-type-e2e`, `test-type-api` |
| QA-specific | `test-coverage-gap`, `flaky-test`, `docs-update` |

Create these labels in Shortcut if they don't exist.
