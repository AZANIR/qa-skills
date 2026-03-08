---
name: qa-linear-integration
description: Linear integration for creating issues, managing projects/cycles, and tracking QA workflows via GraphQL API or Linear MCP.
dependencies:
  recommended:
    - qa-bug-ticket-creator
    - qa-task-creator
---

# QA Linear Integration

## Purpose

Integrate QA workflow with Linear for issue tracking and project management. Create and update issues, manage projects and cycles, and sync with qa-bug-ticket-creator and qa-task-creator for end-to-end QA traceability.

## Features

| Feature | Description |
| ------- | ----------- |
| **Create/update issues** | Bug, Story, Task via GraphQL mutations |
| **Projects and cycles** | Assign issues to projects; add to cycles (sprints) |
| **Labels and priority** | Map severity/priority to Linear labels and priority |
| **Issue relations** | Blocks, relates to, duplicates |
| **Team assignment** | Assign issues to teams |
| **GraphQL API** | Full GraphQL for queries and mutations |

## Authentication

Store in `.env` (never hardcode):

```
LINEAR_API_KEY=lin_api_xxxxxxxxxxxx
```

- **Header:** `Authorization: Bearer {LINEAR_API_KEY}`
- Linear uses API keys; no Basic Auth. Create keys at Linear → Settings → API.

## Key API Patterns

| Operation | GraphQL |
| --------- | ------- |
| Create issue | `mutation { issueCreate(input: {...}) { issue { id identifier url } } }` |
| Update issue | `mutation { issueUpdate(id: "...", input: {...}) { issue { ... } } }` |
| Query issues | `query { issues(filter: {...}) { nodes { id identifier title state { name } } } }` |
| Projects | `query { projects { nodes { id name } } }` |
| Teams | `query { teams { nodes { id name key } } }` |
| Cycles | `query { cycles(filter: { teamId: { eq: "..." } }) { nodes { id name } } }` |

See `references/api-patterns.md` for full GraphQL examples.

## Integration with QA Skills

### qa-bug-ticket-creator

When creating a bug report for Linear:

1. **Input** — Bug report from test failure (title, expected/actual, steps, severity, component)
2. **Map** — Use `references/field-mapping.md` to map to Linear fields
3. **Create** — `issueCreate` with `teamId`, `title`, `description`, `priority`, `labels`
4. **Link** — Add "blocks" or "relates to" for related issues when applicable

### qa-task-creator

When creating tasks for Linear:

1. **Input** — Task from coverage gap, spec finding, or bug fix request
2. **Map** — Map task type to Linear issue type (Story, Task)
3. **Create** — `issueCreate` with project, cycle, labels
4. **Link** — Use `parentId` for sub-tasks; "blocks" for fix tasks referencing bugs

## Trigger Phrases

- "Create Linear issue for [bug/task description]"
- "Add bug to Linear from test failure"
- "Create Linear story for [feature]"
- "Sync QA tasks to Linear"
- "Linear issue from qa-bug-ticket-creator output"
- "Add to Linear cycle [name]"
- "Query Linear issues by [filter]"

## Workflow

1. **Auth** — Load `LINEAR_API_KEY` from `.env`
2. **Resolve IDs** — Query teams, projects, cycles to get IDs (or use user-provided)
3. **Map fields** — Apply `references/field-mapping.md` for QA → Linear
4. **Execute** — Run GraphQL mutation (issueCreate, issueUpdate)
5. **Output** — Return issue identifier (e.g., `BUG-123`), URL, and summary

## Scope

**Can do (autonomous):**
- Create and update Linear issues via GraphQL
- Map QA bug/task fields to Linear fields
- Query issues, projects, teams, cycles
- Add labels, priority, project, cycle
- Create issue relations (blocks, relates to)
- Work with qa-bug-ticket-creator and qa-task-creator outputs

**Cannot do (requires confirmation):**
- Create issues in workspaces without API access
- Assign to specific users without mapping
- Delete or archive issues
- Modify workspace settings

**Will not do (out of scope):**
- Modify production or test code
- Execute tests or deployments
- Manage Linear workspace billing or admin

## Quality Checklist

- [ ] `LINEAR_API_KEY` loaded from `.env`; never hardcoded
- [ ] Field mapping applied per `references/field-mapping.md`
- [ ] Issue includes title, description, and appropriate labels/priority
- [ ] Team ID (or project) specified for issue creation
- [ ] GraphQL errors handled; user-friendly message on failure
- [ ] Issue identifier and URL returned to user
- [ ] Relations (blocks, relates to) set when linking to bugs/tasks

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| 401 Unauthorized | Invalid or missing API key | Verify `LINEAR_API_KEY` in `.env`; regenerate if needed |
| Team not found | Wrong team ID or key | Query `teams { nodes { id key } }`; use correct ID |
| Invalid input | Required field missing | Check `references/field-mapping.md`; ensure `teamId` and `title` present |
| Cycle not found | Cycle doesn't exist or wrong team | Query cycles for team; use active cycle ID |
| GraphQL errors | Malformed mutation/query | Validate query syntax; check Linear API docs |
| Label not applied | Label doesn't exist in workspace | Create label in Linear or use existing label name |
| Relation fails | Invalid issue ID | Verify target issue exists; use correct `id` (UUID) |

## Reference Files

| Topic | File |
| ----- | ---- |
| GraphQL API patterns | `references/api-patterns.md` |
| QA → Linear field mapping | `references/field-mapping.md` |
