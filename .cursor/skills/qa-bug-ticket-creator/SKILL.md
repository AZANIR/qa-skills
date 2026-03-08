---
name: qa-bug-ticket-creator
description: Generate structured bug reports from test failures with expected/actual results, reproduction steps, evidence, severity/priority, and auto-create GitHub Issues via GitHub MCP with duplicate detection.
output_dir: docs/bug-tickets
dependencies:
  recommended:
    - qa-task-creator
    - qa-github-issues-enhanced
---

# QA Bug Ticket Creator

## Purpose

Create structured bug reports from test failures, manual findings, or defect descriptions. Transform raw failure data into ISO 29119-3 compliant incident reports and auto-create GitHub Issues via GitHub MCP with duplicate detection and smart assignment.

## Primary Target

**GitHub Issues** via GitHub MCP. Extensible to Jira, Linear, Azure DevOps via adapters (see `references/` for future patterns).

## Bug Report Template

Every bug report includes:

| Field | Description |
| ----- | ----------- |
| **Title** | Concise, actionable summary (e.g., "Login fails when password contains special chars") |
| **Expected Result** | What should happen per spec/requirements |
| **Actual Result** | What actually happens |
| **Steps to Reproduce** | Numbered, minimal steps |
| **Environment** | OS, browser, app version, test framework |
| **Evidence** | Screenshots, logs, stack traces, HAR files |
| **Severity** | Blocker / Critical / Major / Minor / Trivial |
| **Priority** | P1–P5 or equivalent |
| **Component/Module** | Affected area (e.g., auth, checkout, API) |

See `references/bug-report-format.md` for detailed format and examples.

## Auto-Assignment

When creating GitHub Issues, auto-assign based on component:

- **Labels** — Map component to labels (e.g., `auth`, `frontend`, `api`)
- **Milestones** — Map to sprint/release milestone when provided
- **Assignees** — Map component to team member when mapping is configured

## Duplicate Detection

Before creating a new issue:

1. **Search** existing open issues via GitHub MCP (search by title keywords, component, error message)
2. **Compare** — If similar issue exists (same failure, same component, same root cause), link to it instead of creating duplicate
3. **Create** — Only create new issue when no suitable duplicate found

## ISO 29119-3 Compliance

Structure aligns with ISO/IEC/IEEE 29119-3 incident report:

- Incident identifier
- Summary and description
- Expected vs actual results
- Steps to reproduce
- Severity and priority
- Status and lifecycle
- Related test cases / requirements

## Pairing with qa-task-creator

When a bug is created, optionally auto-create a linked **fix task** via qa-task-creator:

- Bug → Fix task (development)
- Bug → Verification task (QA re-test)

See `references/linking-patterns.md` in qa-task-creator for patterns.

## Trigger Phrases

- "Create bug report from [test failure / JUnit output / error log]"
- "File a GitHub issue for this failure"
- "Generate bug ticket from Playwright/pytest/Jest failure"
- "Incident report for [defect description]"
- "Check for duplicate before creating bug"
- "Bug report with severity and priority"

## Workflow

1. **Input** — Test failure (JUnit, Playwright, pytest output), manual description, or error log
2. **Parse** — Extract test name, failure message, stack trace, environment
3. **Structure** — Map to bug report template; assign severity/priority per `references/severity-guide.md`
4. **Duplicate check** — Search GitHub Issues for similar open issues
5. **Create or link** — Create new issue or comment on duplicate with additional context
6. **Optional** — Invoke qa-task-creator for linked fix task

## Integrations

| Integration | Use |
| ----------- | --- |
| **GitHub MCP** | Create issues, search for duplicates, add labels/milestones/assignees |
| **qa-task-creator** | Create linked fix/verification tasks |
| **qa-test-reporter** | Consume failure data from aggregated reports |

## Scope

**Can do (autonomous):**
- Parse test failures from JUnit XML, Playwright JSON, pytest output, or free-text description
- Generate structured bug reports per template
- Search GitHub for duplicate issues before creating
- Create GitHub Issues with full body, labels, milestones
- Assign severity/priority per `references/severity-guide.md`
- Invoke qa-task-creator for linked fix tasks when requested

**Cannot do (requires confirmation):**
- Create issues in repos without write access
- Override user-specified severity/priority
- Assign assignees without configured mapping

**Will not do (out of scope):**
- Modify production code or test code
- Close or resolve issues (user/stakeholder responsibility)
- Create issues in Jira/Linear/Azure DevOps (future adapter; use references)

## Quality Checklist

- [ ] Bug report includes all template fields (title, expected/actual, steps, environment, evidence)
- [ ] Severity and priority assigned per `references/severity-guide.md`
- [ ] Duplicate search performed before creating new issue
- [ ] GitHub Issue body formatted for readability (headers, code blocks, lists)
- [ ] Labels and component correctly mapped
- [ ] No hardcoded secrets; repo/org from user input or env
- [ ] ISO 29119-3 incident structure present where applicable

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| GitHub MCP create fails | Token missing, no repo access | Check `GITHUB_PERSONAL_ACCESS_TOKEN`; verify repo permissions |
| Duplicate not detected | Search query too narrow | Broaden keywords; search by component + error snippet |
| Severity wrong | Default mapping doesn't fit project | Use project-specific severity guide; ask user to confirm |
| Missing stack trace | Parser doesn't support format | Add parser for framework; request raw output from user |
| Issue body truncated | GitHub body length limit | Split evidence into comments or attach as file |
| Wrong labels applied | Component mapping missing | Add component→label mapping; ask user for mapping |

## Reference Files

| Topic | File |
| ----- | ---- |
| Bug report format with examples | `references/bug-report-format.md` |
| Severity and priority classification | `references/severity-guide.md` |
