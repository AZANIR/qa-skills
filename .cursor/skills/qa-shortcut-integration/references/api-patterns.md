# Shortcut API Patterns

## Base URL and Headers

```
Base URL: https://api.app.shortcut.com/api/v3
Headers:
  Shortcut-Token: <SHORTCUT_API_TOKEN>
  Content-Type: application/json
```

## Stories

### Create Story

```
POST /api/v3/stories
```

**Request body:**
```json
{
  "name": "Login fails when password contains special chars",
  "description": "**Expected:** User can log in with special chars in password.\n**Actual:** 500 error.\n**Steps:** 1. Enter password with @#$ 2. Click Login",
  "story_type": "bug",
  "project_id": 123,
  "labels": [{"name": "auth"}, {"name": "severity-critical"}],
  "workflow_state_id": 50000001,
  "external_links": [
    {"url": "https://example.com/test-case/TC-001", "title": "Test Case TC-001"}
  ]
}
```

**Story types:** `bug`, `feature`, `chore`

### Get Story

```
GET /api/v3/stories/{story_id}
```

### Update Story

```
PUT /api/v3/stories/{story_id}
```

**Partial update example:**
```json
{
  "workflow_state_id": 50000002,
  "labels": [{"name": "verified"}],
  "description": "Original description + verification notes"
}
```

### Search Stories

```
GET /api/v3/search/stories?query=login&project_id=123
```

Query supports text search, filters by project, epic, iteration, label.

## Epics

### List Epics

```
GET /api/v3/epics
```

Returns epics with `id`, `name`, `state`. Use to resolve epic by name for story creation.

### Link Story to Epic

Include `epic_id` in create/update story request.

## Iterations

### List Iterations

```
GET /api/v3/iterations
```

Returns iterations (sprints) with `id`, `name`, `status`. Use to assign stories to current sprint.

### Assign Story to Iteration

Include `iteration_id` in create/update story request.

## Workflows

### List Workflow States

```
GET /api/v3/workflows
```

Returns workflow states per project. Map QA status (e.g., "Open", "In Progress", "Done") to `workflow_state_id`.

## Labels

Labels are created in Shortcut UI or via API. Use exact names when adding to stories:

```json
"labels": [{"name": "auth"}, {"name": "severity-critical"}, {"name": "test-type-e2e"}]
```

## External Links

Add links to test cases, requirements, evidence:

```json
"external_links": [
  {"url": "https://example.com/test/TC-001", "title": "Test Case TC-001"},
  {"url": "https://example.com/req/REQ-42", "title": "Requirement REQ-42"}
]
```

## Rate Limits

- 200 requests per minute
- Throttle bulk operations; use batch endpoints when available
