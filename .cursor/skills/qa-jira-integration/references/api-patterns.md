# Jira REST API Patterns

*Request/response patterns for common Jira REST API v3 operations.*

---

## Base URL

```
{JIRA_BASE_URL}/rest/api/3
```

Headers:
```
Authorization: Basic {base64(email:api_token)}
Content-Type: application/json
Accept: application/json
```

---

## Create Issue

**POST** `/rest/api/3/issue`

```json
{
  "fields": {
    "project": { "key": "PROJ" },
    "summary": "Login fails when password contains special chars",
    "description": {
      "type": "doc",
      "version": 1,
      "content": [{
        "type": "paragraph",
        "content": [{ "type": "text", "text": "Expected: ... Actual: ..." }]
      }]
    },
    "issuetype": { "name": "Bug" },
    "priority": { "name": "High" },
    "labels": ["auth", "frontend"],
    "components": [{ "name": "Authentication" }]
  }
}
```

Response: `201 Created` with `{"key": "PROJ-123", "id": "12345"}`

---

## Search (JQL)

**GET** `/rest/api/3/search?jql={jql}&maxResults=50&startAt=0`

Example JQL:
- `project = PROJ AND issuetype = Bug AND status != Done`
- `sprint in openSprints() AND assignee = currentUser()`
- `key = PROJ-123`

Response: `{"issues": [...], "total": N}`

---

## Transition

**GET** `/rest/api/3/issue/{key}/transitions` — List available transitions

**POST** `/rest/api/3/issue/{key}/transitions`

```json
{
  "transition": { "id": "31" }
}
```

Transition IDs vary by workflow; fetch via GET first.

---

## Add Comment

**POST** `/rest/api/3/issue/{key}/comment`

```json
{
  "body": {
    "type": "doc",
    "version": 1,
    "content": [{
      "type": "paragraph",
      "content": [{ "type": "text", "text": "Comment text" }]
    }]
  }
}
```

---

## Link Issues

**POST** `/rest/api/3/issueLink`

```json
{
  "type": { "name": "Blocks" },
  "inwardIssue": { "key": "PROJ-123" },
  "outwardIssue": { "key": "PROJ-124" }
}
```

Link types: `Blocks`, `Cloners`, `Duplicate`, `Relates`, etc.

---

## Attach File

**POST** `/rest/api/3/issue/{key}/attachments`

`Content-Type: multipart/form-data` with file part.

---

## Sub-task (Parent)

Add `"parent": { "key": "PROJ-100" }` to create sub-task under parent.

---

## Epic Link

For classic projects: `"customfield_10014": "PROJ-50"` (field ID varies)

For next-gen: Use `parent` or project-specific epic link field.

---

## Add to Sprint

**POST** `/rest/api/3/sprint/{sprintId}/issue`

Body: `{"issues": ["PROJ-123", "PROJ-124"]}`

Or set `customfield_10020` (Sprint field ID varies) on issue create/update.
