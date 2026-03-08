# ClickUp API Patterns

## Base URL and Auth

```
Base: https://api.clickup.com/api/v2
Header: Authorization: <CLICKUP_API_TOKEN>
Content-Type: application/json
```

## Hierarchy Resolution

1. **Team** — `GET /api/v2/team` returns teams; use `team_id` for spaces
2. **Space** — `GET /api/v2/team/{team_id}/space` returns spaces
3. **Folder** — `GET /api/v2/space/{space_id}/folder` returns folders (archived: false)
4. **List** — `GET /api/v2/folder/{folder_id}/list` returns lists

## Create Task

**POST** `/api/v2/list/{list_id}/task`

```json
{
  "name": "Login fails when password contains special chars",
  "description": "**Expected:** User can log in with special chars in password.\n**Actual:** 500 error.\n**Steps:** 1. Go to /login 2. Enter user@test.com + pass!@# 3. Submit",
  "assignees": [12345],
  "tags": ["bug", "auth"],
  "status": "to do",
  "priority": 2,
  "due_date": 1709856000000,
  "custom_task_ids": false,
  "notify_all": false
}
```

**Response:** Task object with `id`, `url`, `status`, etc.

## Get Task

**GET** `/api/v2/task/{task_id}`

Returns full task including custom fields, subtasks, checklists.

## Update Task

**PUT** `/api/v2/task/{task_id}`

Same body shape as create; only include fields to update.

## Custom Fields

Custom fields are workspace-specific. Use `GET /api/v2/list/{list_id}/field` to list available fields.

Example custom field in task:
```json
{
  "custom_fields": [
    {
      "id": "abc123",
      "value": "Critical"
    }
  ]
}
```

## Subtasks

Create subtask: **POST** `/api/v2/list/{list_id}/task` with `parent` set to parent task ID.

Or add via task update with subtasks array.

## Checklists

**POST** `/api/v2/task/{task_id}/checklist`

```json
{
  "name": "Acceptance Criteria",
  "items": [
    { "name": "User can log in with special chars" },
    { "name": "Error message is user-friendly" }
  ]
}
```

## Attachments

**POST** `/api/v2/task/{task_id}/attachment`

`Content-Type: multipart/form-data` with file.

Supported: png, jpg, gif, pdf, txt, log, har, etc.

## Task Relationships

- **Linked tasks** — Use `linking` in task body or separate linking API
- **Blocking** — Set via custom workflow or dependency field if configured

## Rate Limits

- Typical: 100 requests per minute per token
- 429 response: retry with exponential backoff
