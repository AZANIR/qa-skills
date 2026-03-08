---
name: qa-jira-integration
description: Jira integration for creating issues, managing epics/sprints, syncing with Xray/Zephyr test management, and tracking QA workflows via REST API or Atlassian MCP.
dependencies:
  recommended:
    - qa-bug-ticket-creator
    - qa-task-creator
---

# QA Jira Integration

## Purpose

Integrate QA workflow with Jira for issue tracking and project management. Create and update issues, manage epics and sprints, link issues to requirements and test cases, and sync with Xray/Zephyr for test management. Use Jira REST API or Atlassian MCP when available.

## Features

| Feature | Description |
| ------- | ----------- |
| **Create/update issues** | Bug, Story, Task, Sub-task with full field mapping |
| **Manage epics and sprints** | Create epics, add issues to sprints, manage backlog |
| **Link issues** | Link to requirements, test cases, parent issues |
| **Xray/Zephyr integration** | Sync test cases, test executions, traceability |
| **JQL queries** | Search and report on issues by project, status, assignee |
| **Transition management** | Move issues through workflow states (To Do → In Progress → Done) |

## Authentication

| Variable | Description |
| -------- | ----------- |
| `JIRA_BASE_URL` | Jira instance URL (e.g., `https://your-domain.atlassian.net`) |
| `JIRA_API_TOKEN` | API token from [Atlassian account settings](https://id.atlassian.com/manage-profile/security/api-tokens) |
| `JIRA_EMAIL` | Email for the Atlassian account (used with API token) |

**Basic Auth:** `Authorization: Basic base64(email:api_token)`

See `references/api-patterns.md` for request examples.

## Key API Patterns

| Operation | Method | Endpoint |
| --------- | ------ | -------- |
| Create issue | POST | `/rest/api/3/issue` |
| Search (JQL) | GET | `/rest/api/3/search?jql=...` |
| Get issue | GET | `/rest/api/3/issue/{key}` |
| Update issue | PUT | `/rest/api/3/issue/{key}` |
| Transition | POST | `/rest/api/3/issue/{key}/transitions` |
| Link issues | POST | `/rest/api/3/issueLink` |
| Add comment | POST | `/rest/api/3/issue/{key}/comment` |
| Add attachment | POST | `/rest/api/3/issue/{key}/attachments` |

## Integration with qa-bug-ticket-creator

When qa-bug-ticket-creator produces a bug report:

1. **Map fields** — Use `references/field-mapping.md` to map bug report fields to Jira issue fields
2. **Create Jira Bug** — POST to `/rest/api/3/issue` with `issuetype: { name: "Bug" }`
3. **Link to test** — If test case key exists, create issue link (e.g., "tests" or "blocks")
4. **Optional** — Invoke qa-task-creator for linked fix task; create as Jira Task/Sub-task under same project

## Integration with qa-task-creator

When qa-task-creator produces a task:

1. **Map fields** — Map task type to Jira issuetype (Story, Task, Sub-task)
2. **Create Jira issue** — POST with appropriate project key and issuetype
3. **Link to parent** — If task references a bug, use `parent` for Sub-task or issue link for Task
4. **Sprint assignment** — Add to sprint via `fields.customfield_XXXX` (sprint field ID varies by instance)

## Trigger Phrases

- "Create Jira issue from [bug report / task]"
- "File bug in Jira for [test failure]"
- "Add issue to sprint [name]"
- "Search Jira for [JQL]"
- "Transition [PROJ-123] to In Progress"
- "Link [PROJ-123] to test case [PROJ-456]"
- "Sync test results to Xray"

## Workflow

1. **Auth** — Load `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN` from `.env`
2. **Map** — Use `references/field-mapping.md` for QA → Jira field mapping
3. **Create/Update** — Call REST API or Atlassian MCP
4. **Link** — Create issue links, add to epic/sprint as needed
5. **Report** — Use JQL for dashboards and status reports

## Scope

**Can do (autonomous):**
- Create Bug, Story, Task, Sub-task via REST API
- Search issues with JQL
- Transition issues through workflow
- Link issues (parent-child, blocks, relates to)
- Add comments and attachments
- Map QA bug/task output to Jira fields per `references/field-mapping.md`
- Integrate with qa-bug-ticket-creator and qa-task-creator for issue creation

**Cannot do (requires confirmation):**
- Create issues in projects without configured access
- Override user-specified assignee or sprint
- Delete or bulk-modify issues

**Will not do (out of scope):**
- Modify Jira project configuration or workflows
- Create custom fields (admin-only)
- Execute tests or modify application code

## Quality Checklist

- [ ] Auth uses env vars; no hardcoded credentials
- [ ] Field mapping follows `references/field-mapping.md`
- [ ] Issue types and project keys validated before create
- [ ] JQL queries are safe (no injection; use parameterization where supported)
- [ ] Links to qa-bug-ticket-creator / qa-task-creator output preserved
- [ ] Xray/Zephyr operations follow `references/xray-integration.md` when used

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| 401 Unauthorized | Invalid token or email | Regenerate API token; verify JIRA_EMAIL matches token owner |
| 404 on create | Wrong project key or endpoint | Verify JIRA_BASE_URL; check project key exists |
| 400 Bad Request | Invalid field value | Check `references/field-mapping.md`; verify custom field IDs |
| Transition fails | Invalid transition ID | GET `/rest/api/3/issue/{key}/transitions` to list valid transitions |
| Xray sync fails | Xray not installed or wrong project | Verify Xray app; use Xray-specific endpoints per `references/xray-integration.md` |
| Field not found | Custom field ID wrong | Use GET `/rest/api/3/field` to list field IDs |

## Reference Files

| Topic | File |
| ----- | ---- |
| Jira REST API patterns | `references/api-patterns.md` |
| QA → Jira field mapping | `references/field-mapping.md` |
| Xray/Zephyr integration | `references/xray-integration.md` |
