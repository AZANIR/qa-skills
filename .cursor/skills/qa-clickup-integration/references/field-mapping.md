# QA Field to ClickUp Mapping

## Standard Task Fields

| QA Field | ClickUp Field | Notes |
| -------- | ------------- | ----- |
| Title | `name` | Direct mapping |
| Description | `description` | Markdown supported |
| Severity | `priority` or custom | 1=Urgent, 2=High, 3=Normal, 4=Low |
| Priority (P1–P5) | `priority` | P1→1, P2→2, P3→3, P4/P5→4 |
| Component | `tags` | Add as tag, e.g. `auth`, `checkout` |
| Assignee | `assignees` | Array of member IDs |
| Due date | `due_date` | Unix ms |
| Status | `status` | Must match list status names |

## QA-Specific → ClickUp Custom Fields

Configure these custom fields in your ClickUp workspace, then map by field ID:

| QA Field | Custom Field Type | Example Value |
| -------- | ----------------- | ------------- |
| Severity (ISO) | Dropdown | Blocker, Critical, Major, Minor, Trivial |
| Test Type | Dropdown | Unit, Integration, E2E, Performance, Security |
| Coverage | Text/URL | Requirement ID or module path |
| Environment | Text | "Chrome 120, Windows 11, v2.1.0" |
| Expected Result | Long text | From bug report template |
| Actual Result | Long text | From bug report template |
| Steps to Reproduce | Long text | Numbered steps |
| Evidence | Attachment | Screenshots, logs via attachment API |

## Bug Report Template Mapping

| Bug Report Field | ClickUp Target |
| ---------------- | -------------- |
| Title | `name` |
| Expected Result | `description` or custom field |
| Actual Result | `description` or custom field |
| Steps to Reproduce | `description` or checklist |
| Environment | Custom field or `description` |
| Evidence | Attachments |
| Severity | `priority` + custom field |
| Priority | `priority` |
| Component/Module | `tags` |

## Task Creator Output Mapping

| Task Field | ClickUp Target |
| ---------- | -------------- |
| Title | `name` |
| Description | `description` |
| Acceptance criteria | Checklist |
| Labels (task, qa, component) | `tags` |
| Links (Fixes #N) | `description` (inline) or custom URL field |
| Task type | `tags` (e.g. `development`, `qa`, `documentation`) |

## Tag Conventions

| QA Source | Suggested Tags |
| --------- | --------------- |
| Bug | `bug`, `{component}` |
| Coverage gap | `test-coverage`, `{component}` |
| Flaky test | `flaky`, `{component}` |
| Fix task | `fix`, `development` |
| QA task | `qa`, `testing` |
| Documentation | `docs`, `documentation` |

## Resolving Field IDs

1. Use ClickUp API: `GET /api/v2/list/{list_id}/field`
2. Or: Workspace Settings → Custom Fields → copy field ID from URL or API
3. Store mapping in config or pass via user input for workspace-specific setups
