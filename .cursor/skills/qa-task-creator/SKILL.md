---
name: qa-task-creator
description: Generate work tasks from QA analysis, coverage gaps, and bug reports. Works standalone for any task creation or paired with qa-bug-ticket-creator for linked fix tasks.
dependencies:
  recommended:
    - qa-bug-ticket-creator
---

# QA Task Creator

## Purpose

Generate structured work tasks from QA analysis outputs, coverage gaps, spec-auditor findings, risk-analyzer results, and bug reports. Supports two usage patterns: **standalone** (create tasks directly from user request) and **paired** with qa-bug-ticket-creator (auto-create linked fix/enhancement tasks from bugs).

## Dual-Use Pattern

| Mode | Trigger | Output |
| ---- | ------- | ------ |
| **Standalone** | User requests task creation from description, coverage gap, or spec finding | GitHub Issue (or Jira/Linear format) with full task details |
| **Paired** | Bug ticket created by qa-bug-ticket-creator | Linked fix task referencing the bug; optionally enhancement tasks for related improvements |

When paired: bug ticket → fix task; fix task links back to bug via GitHub issue reference (e.g., "Fixes #123").

## Input Sources

| Source | Task Type | Example |
| ------ | --------- | ------- |
| **Coverage gaps** | Development / QA | "Add unit tests for AuthService.login() — 0% coverage" |
| **Spec-auditor findings** | Development / Documentation | "Implement validation per spec section 4.2" |
| **Risk-analyzer output** | Development / QA | "Add integration tests for payment flow — high risk" |
| **Bug reports** | Development (fix) | "Fix null pointer in checkout when cart is empty" |
| **User request** | Any | "Create task to refactor user API" |

## Task Types

| Type | Description | Typical Assignee |
| ---- | ----------- | ---------------- |
| **Development** | Implement, fix, refactor, optimize | Dev |
| **QA** | Write tests, increase coverage, update test data | QA |
| **Documentation** | Update specs, add diagrams, API docs | Dev/QA |
| **Enhancement** | Performance, validation, UI polish | Dev |

See `references/task-types.md` for templates and examples.

## Output Format

Tasks follow GitHub Issue / Jira / Linear story format:

- **Title** — Clear, actionable (verb + object)
- **Description** — Context, acceptance criteria, links to source
- **Labels** — `task`, `development`, `qa`, `documentation`, `enhancement`, component tags
- **Links** — Parent bug, requirement, coverage gap, or spec section
- **Acceptance criteria** — Testable conditions for done

## Auto-Linking

Tasks automatically link to their source:

| Source | Link Format |
| ------ | ----------- |
| Bug | "Fixes #123" or "Related to #123" in body; GitHub auto-links |
| Requirement | Link to requirement doc or ticket |
| Coverage gap | File:line reference, module name |
| Spec section | Section reference (e.g., "Spec §4.2") |

See `references/linking-patterns.md` for patterns.

## Integrations

| Integration | Use |
| ----------- | --- |
| **GitHub MCP** | Create issues, search for duplicates, link to bugs |
| **qa-bug-ticket-creator** | Consume bug ticket output; create linked fix task |
| **qa-coverage-analyzer** | Consume coverage gap output |
| **qa-spec-writer / qa-requirements-generator** | Consume spec/requirement references |

## Trigger Phrases

- "Create a task to [description]"
- "Generate fix task for bug #123"
- "Create tasks from coverage gaps in [path]"
- "Task from spec-auditor findings"
- "Linked fix task for [bug summary]"
- "Work items from risk analysis"
- "Development task for [feature/fix]"

## Workflow

1. **Input** — User request, bug ticket, coverage gap, spec finding, or risk output
2. **Task type** — Classify as Development / QA / Documentation / Enhancement
3. **Content** — Title, description, acceptance criteria, labels
4. **Links** — Add references to parent bug, requirement, or source
5. **Duplicate check** — Search existing issues for similar tasks (optional)
6. **Create** — Create GitHub Issue via GitHub MCP; output link

## Scope

**Can do (autonomous):**
- Create tasks from user description, bug tickets, coverage gaps, spec findings
- Classify task type and assign appropriate labels
- Link tasks to parent bugs, requirements, coverage gaps
- Create GitHub Issues via GitHub MCP
- Search for duplicate tasks before creating
- Work paired with qa-bug-ticket-creator for linked fix tasks

**Cannot do (requires confirmation):**
- Assign to specific users without approval
- Set milestones or due dates without user input
- Create tasks in Jira/Linear (reference format only; adapters future)

**Will not do (out of scope):**
- Execute development or testing work
- Modify code or configurations
- Approve or prioritize tasks (stakeholder responsibility)

## Quality Checklist

- [ ] Task title is actionable (verb + object)
- [ ] Description includes context and acceptance criteria
- [ ] Links to parent bug/requirement/coverage gap when applicable
- [ ] Labels match task type and component
- [ ] Acceptance criteria are testable
- [ ] No hardcoded secrets; repo/org from user or env
- [ ] Duplicate check performed when creating from coverage/spec

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Task too vague | Insufficient context from source | Add explicit acceptance criteria; request clarification |
| Missing link to bug | Bug ticket not passed or not found | Verify bug exists; include bug number in description |
| Wrong task type | Misclassification of input | Use `references/task-types.md`; ask user to confirm |
| Duplicate created | Search query too narrow | Broaden search terms; check similar open issues |
| GitHub MCP fails | Token missing, repo access | Verify GitHub MCP config; use markdown output as fallback |
| Paired mode not linking | qa-bug-ticket-creator output not consumed | Ensure bug ticket number is passed; use "Fixes #N" in body |

## Reference Files

| Topic | File |
| ----- | ---- |
| Task type templates and examples | `references/task-types.md` |
| Linking patterns (bugs, requirements, coverage) | `references/linking-patterns.md` |
