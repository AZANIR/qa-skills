# QA to Jira Field Mapping

*Mapping local QA fields (from qa-bug-ticket-creator, qa-task-creator) to Jira fields.*

---

## Bug Report → Jira Bug

| QA Bug Field | Jira Field | Jira API Path |
| ------------ | ---------- | ------------- |
| Title | Summary | `fields.summary` |
| Expected Result + Actual Result + Steps | Description | `fields.description` (Atlassian Document Format) |
| Severity | Priority | `fields.priority.name` |
| Component/Module | Labels | `fields.labels[]` |
| Component/Module | Components | `fields.components[].name` |
| Environment | Description (append) or custom | Custom field or description |
| Evidence | Attachments / Comment | Attach via `/attachments`; or embed in description |
| Priority (P1–P5) | Priority or custom | Map P1→Highest, P2→High, etc. |

---

## Task → Jira Story/Task

| QA Task Field | Jira Field | Jira API Path |
| ------------- | ---------- | ------------- |
| Title | Summary | `fields.summary` |
| Description + Acceptance criteria | Description | `fields.description` |
| Task type | Issue type | `fields.issuetype` (Story, Task) |
| Labels | Labels | `fields.labels[]` |
| Parent bug | Link or parent | `issueLink` or `fields.parent` |
| Component | Components | `fields.components[].name` |

---

## Severity → Priority

| QA Severity | Jira Priority |
| ----------- | ------------- |
| Blocker | Highest |
| Critical | High |
| Major | High / Medium |
| Minor | Medium / Low |
| Trivial | Low |

---

## Atlassian Document Format (ADF)

Description and comments use ADF:

```json
{
  "type": "doc",
  "version": 1,
  "content": [
    {
      "type": "heading",
      "attrs": { "level": 3 },
      "content": [{ "type": "text", "text": "Expected Result" }]
    },
    {
      "type": "paragraph",
      "content": [{ "type": "text", "text": "User should be able to log in." }]
    }
  ]
}
```

For simple text, use a single paragraph node.

---

## Custom Fields

Project-specific custom fields have IDs like `customfield_10001`. Use:

**GET** `/rest/api/3/field` — List all fields and IDs.

Map QA concepts (e.g., Fix Version, Sprint) to the correct custom field ID for the project.
