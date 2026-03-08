---
name: qa-shortcut-integration
description: Shortcut (formerly Clubhouse) integration for creating stories, managing epics/iterations, and tracking QA workflows via REST API.
dependencies:
  recommended:
    - qa-bug-ticket-creator
    - qa-task-creator
---

# QA Shortcut Integration

## Purpose

Integrate QA workflow with Shortcut for project management. Create and update stories from bug reports, test coverage gaps, and QA tasks. Sync QA metadata (severity, test type, labels) with Shortcut epics, iterations, and workflow states.

## Primary Target

**Shortcut** (formerly Clubhouse) via REST API v3. Base URL: `https://api.app.shortcut.com/api/v3`.

## Features

### Create/Update Stories

- **Create** stories in projects with full metadata
- **Update** existing stories (status, labels, description, external links)
- **Search** stories by query, epic, iteration, or label

### Epics and Iterations

- **Epics** — Group stories by feature/release; link stories to epics
- **Iterations** — Assign stories to sprints; query by iteration
- **Workflow states** — Map QA status to Shortcut workflow states

### Labels and Story Types

- **Story types** — Bug, feature, chore (map from QA task type)
- **Labels** — Component, severity, test type, coverage area
- **Custom fields** — Use Shortcut custom fields for QA metadata when configured

### Story Relationships

- **Blocking / blocked by** — Link stories for dependencies
- **External links** — Link to test cases, requirements, coverage reports
- **Comments** — Add reproduction steps, evidence, verification notes

## Authentication

| Variable | Description |
| -------- | ----------- |
| `SHORTCUT_API_TOKEN` | API token from Shortcut Settings → Account → API Tokens |

Store in `.env`; never hardcode. Header: `Shortcut-Token: <token>`.

## Key API Endpoints

| Method | Endpoint | Use |
| ------ | -------- | --- |
| POST | `/api/v3/stories` | Create story |
| GET | `/api/v3/stories/{story_id}` | Get story |
| PUT | `/api/v3/stories/{story_id}` | Update story |
| GET | `/api/v3/search/stories` | Search stories (query, epic, iteration) |
| GET | `/api/v3/epics` | List epics |
| GET | `/api/v3/iterations` | List iterations |
| GET | `/api/v3/workflows` | List workflow states |

See `references/api-patterns.md` for request/response patterns.

## Integration with QA Skills

| Skill | Integration |
| ----- | ----------- |
| **qa-bug-ticket-creator** | Create Shortcut story from bug report; map severity/priority to labels |
| **qa-task-creator** | Create Shortcut story from QA task; link to epic/iteration |
| **qa-coverage-analyzer** | Create stories for coverage gaps; label by component |
| **qa-flaky-detector** | Create stories for flaky tests; story type = bug |

When qa-bug-ticket-creator or qa-task-creator outputs a structured ticket, this skill translates it to Shortcut story format and creates/updates via API.

## Trigger Phrases

- "Create Shortcut story from [bug report / test failure]"
- "Add QA task to Shortcut"
- "Create story in Shortcut for coverage gap"
- "Update Shortcut story #123 with verification result"
- "Search Shortcut for stories in epic [name]"
- "Link story to test case / requirement"
- "Bulk-create Shortcut stories from [coverage / spec / flaky] output"

## Workflow

1. **Input** — Bug report, QA task, coverage gap, or user request
2. **Map** — Translate to Shortcut story format per `references/field-mapping.md`
3. **Resolve** — Get project_id, epic_id, iteration_id from workspace (or user input)
4. **Create/Update** — POST or PUT via REST API
5. **Link** — Add external links to test cases, requirements, evidence
6. **Output** — Return story URL and ID

## Scope

**Can do (autonomous):**
- Create stories from bug reports and QA tasks
- Update story status, labels, description
- Search stories by query, epic, iteration
- Map QA metadata to Shortcut labels and story types
- Add external links to test cases and requirements
- Work with qa-bug-ticket-creator and qa-task-creator outputs

**Cannot do (requires confirmation):**
- Create stories without project_id (user must provide or configure)
- Assign to members without mapping
- Create epics/iterations without workspace admin

**Will not do (out of scope):**
- Modify production or test code
- Close or archive stories (stakeholder responsibility)
- Integrate with Jira/Linear/GitHub (use respective skills)

## Quality Checklist

- [ ] Story includes title, description, and appropriate story type
- [ ] Labels map to QA metadata (severity, component, test type)
- [ ] External links added for test cases/requirements when applicable
- [ ] No hardcoded secrets; token from `SHORTCUT_API_TOKEN`
- [ ] Field mapping follows `references/field-mapping.md`
- [ ] API patterns from `references/api-patterns.md` used correctly

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| 401 Unauthorized | Missing or invalid token | Check `SHORTCUT_API_TOKEN`; regenerate at Shortcut Settings |
| 404 Not Found | Invalid story_id or project_id | Verify IDs; use search to resolve by name |
| 422 Validation Error | Invalid field value | Check field-mapping; ensure enum values match Shortcut |
| Rate limit (429) | >200 req/min | Throttle requests; batch where possible |
| Epic/iteration not found | ID from wrong workspace | List epics/iterations; use correct IDs |
| Labels not applied | Label doesn't exist | Create labels in Shortcut; use exact names |

## Reference Files

| Topic | File |
| ----- | ---- |
| API patterns (stories, epics, iterations) | `references/api-patterns.md` |
| QA field → Shortcut field mapping | `references/field-mapping.md` |
