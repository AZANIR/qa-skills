---
name: qa-github-issues-enhanced
description: Enhanced GitHub Issues workflows with auto-labels, issue templates, milestone management, and structured QA workflows via GitHub MCP.
dependencies:
  recommended:
    - qa-bug-ticket-creator
---

# QA GitHub Issues Enhanced

## Purpose

Provide enhanced GitHub Issues workflows for QA automation. Extends qa-bug-ticket-creator and qa-task-creator with auto-labeling, issue templates, milestone management, search/deduplication, bulk operations, and structured QA lifecycle workflows—all via GitHub MCP.

## Primary Target

**GitHub** via GitHub MCP. All operations (create, search, label, milestone, bulk) use GitHub MCP APIs.

## Features

### Auto-Labeling

Automatically assign labels based on:

| Signal | Labels Applied |
| ------ | -------------- |
| Bug report | `type/bug`, `priority/*`, `component/*` |
| Test coverage gap | `test-coverage-gap`, `component/*`, `status/needs-triage` |
| Flaky test | `flaky-test`, `component/*`, `status/needs-triage` |
| Documentation update | `docs-update`, `component/*` |
| Enhancement request | `type/enhancement`, `component/*` |

See `references/label-taxonomy.md` for full taxonomy and color codes.

### Issue Templates

Predefined templates for consistent structure:

| Template | Use Case |
| -------- | -------- |
| Bug report | Defects from test failures or manual findings |
| Test coverage gap | Gaps from qa-coverage-analyzer or spec-auditor |
| Flaky test | Intermittent failures from qa-flaky-detector |
| Documentation update | Spec drift, outdated docs from qa-spec-auditor |
| Enhancement request | Feature requests, improvements |

See `references/issue-templates.md` for YAML definitions.

### Milestone Management

- **Create** milestones per sprint/release (e.g., `Sprint 24`, `v2.1.0`)
- **Assign** issues to milestones when creating or updating
- **Query** issues by milestone for status reports

### Structured Workflows

| Workflow | Pattern |
| -------- | ------- |
| Bug lifecycle | bug-report → linked-PR → verification-test |
| Coverage gap | gap → task → PR → coverage-verified |
| Flaky test | flaky → investigation → fix → re-run |

See `references/workflow-patterns.md` for detailed patterns.

### Search and Deduplication

Before creating new issues:

1. **Search** by title keywords, component, error message, labels
2. **Compare** similarity (same failure, component, root cause)
3. **Link or create** — Link to duplicate or create new when no match

### Bulk Operations

Batch-create issues from:

- **qa-coverage-analyzer** — One issue per coverage gap
- **qa-spec-auditor** — One issue per spec drift finding
- **qa-flaky-detector** — One issue per flaky test
- **qa-changelog-analyzer** — One issue per recommended test

## Label Taxonomy

| Prefix | Purpose | Examples |
| ------ | ------- | -------- |
| `type/` | Issue type | `bug`, `enhancement`, `task` |
| `priority/` | Urgency | `critical`, `high`, `medium`, `low` |
| `component/` | Affected area | `frontend`, `backend`, `api`, `auth` |
| `status/` | Workflow state | `needs-triage`, `in-progress`, `ready-for-test`, `verified` |
| (no prefix) | Special QA | `test-coverage-gap`, `flaky-test`, `docs-update` |

Full taxonomy in `references/label-taxonomy.md`.

## Integrations

| Integration | Use |
| ----------- | --- |
| **GitHub MCP** | All create, search, label, milestone, bulk operations |
| **qa-bug-ticket-creator** | Consume bug reports; apply enhanced labels/templates |
| **qa-task-creator** | Create linked tasks; apply workflow labels |
| **qa-coverage-analyzer** | Bulk-create coverage gap issues |
| **qa-spec-auditor** | Bulk-create spec drift issues |
| **qa-flaky-detector** | Bulk-create flaky test issues |

## Trigger Phrases

- "Create GitHub issues with auto-labels for [bugs / coverage gaps / flaky tests]"
- "Apply issue template for [bug / coverage gap / flaky test / docs / enhancement]"
- "Create milestone for Sprint 24 / v2.1.0"
- "Assign issues to milestone [name]"
- "Search for similar issues before creating"
- "Bulk-create issues from coverage analyzer output"
- "Bulk-create issues from spec-auditor findings"
- "Set up structured workflow for bug #123"

## Workflow

1. **Input** — Bug report, coverage gap, flaky test, spec finding, or bulk CSV/JSON
2. **Template** — Select issue template (bug, coverage-gap, flaky, docs, enhancement)
3. **Labels** — Auto-assign per taxonomy (type, priority, component, status)
4. **Deduplication** — Search for similar open issues; link or create
5. **Milestone** — Assign to sprint/release when provided
6. **Create** — Create GitHub Issue via GitHub MCP
7. **Optional** — Create linked task, PR reference, or verification issue

## Scope

**Can do (autonomous):**
- Create issues with auto-labels per taxonomy
- Apply issue templates (bug, coverage-gap, flaky, docs, enhancement)
- Create and assign milestones
- Search for similar issues before creating
- Bulk-create issues from coverage/spec/flaky output
- Link issues (bug → task, task → PR)
- Update labels and milestone on existing issues

**Cannot do (requires confirmation):**
- Create issues in repos without write access
- Override user-specified labels or priority
- Assign assignees without configured mapping
- Create milestones without user approval

**Will not do (out of scope):**
- Modify production or test code
- Close or merge issues (stakeholder responsibility)
- Create issues in Jira/Linear/Azure DevOps (use references for adapters)

## Quality Checklist

- [ ] Labels follow taxonomy (type/, priority/, component/, status/)
- [ ] Issue template applied when creating
- [ ] Deduplication search performed before creating
- [ ] Milestone assigned when user provides sprint/release
- [ ] Bulk operations include source reference (file, analyzer output)
- [ ] No hardcoded secrets; repo/org from user input or env
- [ ] Linked issues reference each other correctly

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| GitHub MCP create fails | Token missing, no repo access | Check `GITHUB_PERSONAL_ACCESS_TOKEN`; verify repo permissions |
| Labels not applied | Label doesn't exist in repo | Create labels via GitHub MCP or repo settings; see label-taxonomy |
| Duplicate not detected | Search query too narrow | Broaden keywords; search by component + error snippet |
| Milestone not found | Milestone not created | Create milestone first; verify exact name |
| Bulk create partial fail | Rate limit or invalid data | Check GitHub API rate limits; validate input format |
| Wrong template applied | Misclassification of input | Ask user to confirm template; use explicit template param |

## Reference Files

| Topic | File |
| ----- | ---- |
| Label taxonomy with colors | `references/label-taxonomy.md` |
| Issue template YAML | `references/issue-templates.md` |
| Workflow patterns | `references/workflow-patterns.md` |
