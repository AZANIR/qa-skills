---
name: qa-clickup-integration
description: ClickUp integration for creating tasks, managing lists/spaces, and tracking QA workflows via REST API.
dependencies:
  recommended:
    - qa-bug-ticket-creator
    - qa-task-creator
---

# QA ClickUp Integration

## Purpose

Integrate QA workflow with ClickUp for task management. Create and manage tasks, lists, folders, and spaces; attach QA metadata via custom fields; and sync bug reports and work tasks from qa-bug-ticket-creator and qa-task-creator into ClickUp.

## Primary Target

**ClickUp** via REST API. Base URL: `https://api.clickup.com/api/v2`.

## Features

### Task Management

| Feature | Description |
| ------- | ----------- |
| **Create tasks** | POST to list; set name, description, assignees, status, priority |
| **Update tasks** | PUT to modify existing tasks |
| **Get task** | GET task by ID for status checks |
| **Subtasks** | Create subtasks for test steps or breakdown |
| **Checklists** | Add checklist items for acceptance criteria |
| **Attachments** | Attach screenshots, logs, HAR files |

### Hierarchy

| Level | API | Use |
| ----- | --- | --- |
| **Space** | GET /api/v2/team/{team_id}/space | QA workspace or project |
| **Folder** | GET /api/v2/space/{space_id}/folder | Feature or module grouping |
| **List** | GET /api/v2/folder/{folder_id}/list | Sprint, release, or backlog |
| **Task** | POST /api/v2/list/{list_id}/task | Individual work item |

### QA Metadata

| Custom Field | Purpose |
| ------------ | ------- |
| **Severity** | Blocker / Critical / Major / Minor / Trivial |
| **Test Type** | Unit / Integration / E2E / Performance / Security |
| **Coverage** | Requirement or module coverage reference |
| **Environment** | OS, browser, app version |
| **Component** | Affected area (auth, checkout, API) |

### Relationships

- **Blocking** — Task A blocks Task B
- **Waiting on** — Task A waits on Task B
- **Linked** — Related tasks for traceability

### Tags and Priorities

- **Tags** — `bug`, `test-coverage`, `flaky`, `docs`, component tags
- **Priority** — Urgent (1), High (2), Normal (3), Low (4)

## Authentication

| Variable | Description |
| -------- | ----------- |
| `CLICKUP_API_TOKEN` | Personal API token (starts with `pk_`) from .env |

**Header:** `Authorization: <token>`

Generate tokens at: ClickUp Settings → Apps → API Token.

## Key API Endpoints

| Method | Endpoint | Use |
| ------ | -------- | --- |
| POST | `/api/v2/list/{list_id}/task` | Create task |
| GET | `/api/v2/task/{task_id}` | Get task details |
| PUT | `/api/v2/task/{task_id}` | Update task |
| GET | `/api/v2/team/{team_id}/space` | List spaces |
| GET | `/api/v2/space/{space_id}/folder` | List folders |
| GET | `/api/v2/folder/{folder_id}/list` | List lists |
| POST | `/api/v2/task/{task_id}/attachment` | Add attachment |

See `references/api-patterns.md` for request/response examples.

## Integration with QA Skills

| Skill | Integration |
| ----- | ----------- |
| **qa-bug-ticket-creator** | Create ClickUp tasks from bug reports; map severity, component, evidence |
| **qa-task-creator** | Create ClickUp tasks from coverage gaps, spec findings, fix tasks |
| **qa-test-reporter** | Attach test reports as task attachments; link failures to tasks |

### Handoff Flow

1. **Bug report** → qa-bug-ticket-creator structures report → qa-clickup-integration creates task in target list
2. **Fix task** → qa-task-creator generates task → qa-clickup-integration creates task, links to bug task
3. **Coverage gap** → qa-coverage-analyzer output → qa-task-creator → qa-clickup-integration

## Trigger Phrases

- "Create ClickUp task from [bug report / test failure]"
- "Add task to ClickUp list [name]"
- "Sync bug to ClickUp with severity and evidence"
- "Create ClickUp task from coverage gap"
- "Link fix task to bug in ClickUp"
- "Attach screenshot to ClickUp task [id]"
- "Get ClickUp task status for [id]"

## Workflow

1. **Input** — Bug report, task description, coverage gap, or user request
2. **Resolve target** — Team ID, Space, Folder, List (from user or config)
3. **Map fields** — Map QA fields to ClickUp task fields per `references/field-mapping.md`
4. **Create/update** — POST or PUT via REST API
5. **Attach** — Add screenshots, logs when provided
6. **Link** — Set blocking/waiting-on when paired with bug or fix task

## Scope

**Can do (autonomous):**
- Create and update tasks in specified lists
- Map severity, priority, component, test type to ClickUp fields
- Add subtasks, checklists, attachments
- Set task relationships (blocking, waiting on)
- Resolve space/folder/list from user input or config
- Integrate with qa-bug-ticket-creator and qa-task-creator output

**Cannot do (requires confirmation):**
- Create spaces, folders, or lists (assume they exist)
- Override user-specified list or assignee
- Set custom fields without workspace configuration

**Will not do (out of scope):**
- Modify production or test code
- Delete tasks or archives (user responsibility)
- Create ClickUp workspaces or teams

## Quality Checklist

- [ ] Task includes name, description, and appropriate priority
- [ ] QA metadata (severity, test type, component) mapped per field-mapping
- [ ] Attachments added when evidence provided
- [ ] No hardcoded secrets; token from .env
- [ ] List ID resolved before create; task ID validated before update
- [ ] Relationships set when linking bug to fix task
- [ ] Error handling for 401, 404, 429 (rate limit)

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| 401 Unauthorized | Token missing or invalid | Check `CLICKUP_API_TOKEN` in .env; regenerate if expired |
| 404 Not Found | Invalid list_id or task_id | Verify IDs; use GET to list spaces/folders/lists |
| 429 Rate limit | Too many requests | Implement backoff; batch operations |
| Custom field not applied | Field ID wrong or not configured | Check workspace custom fields; use correct field ID |
| Attachment fails | File size or format | ClickUp limits; use supported formats (png, jpg, txt, etc.) |
| Wrong list | List ID from wrong folder | Resolve full hierarchy: team → space → folder → list |

## Reference Files

| Topic | File |
| ----- | ---- |
| API patterns: tasks, lists, spaces, custom fields | `references/api-patterns.md` |
| Mapping QA fields to ClickUp task fields | `references/field-mapping.md` |
