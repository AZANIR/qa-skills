---
name: qa-spec-auditor
description: Living documentation auditor that compares requirements vs UI/behavior vs API contract vs test results to detect spec drift, outdated docs, and undocumented features.
output_dir: reports/audit
dependencies:
  recommended:
    - qa-requirements-generator
    - qa-spec-writer
---

# QA Spec Auditor

## Purpose

Compare "how it should be" vs "how it is" after each release or sprint. Detect spec drift, outdated documentation, undocumented features, and regression set optimization opportunities. Produce actionable drift reports with task suggestions for qa-task-creator.

## Trigger Phrases

- "Spec audit" / "Documentation audit for [release/sprint]"
- "Spec drift" / "Detect drift between docs and implementation"
- "Outdated documentation" / "Docs vs implementation comparison"
- "Undocumented features" / "Find features not in specs"
- "Requirements vs UI" / "Requirements vs API contract"
- "Living documentation audit" / "Spec compliance check"
- "Regression set optimization" / "Worn out tests" / "Test rotation"

## Comparison Dimensions

| Dimension | Source A | Source B | Detects |
|-----------|----------|----------|---------|
| **Requirements ↔ UI/behavior** | Requirements, specs | Live UI (Playwright MCP) | UI doesn't match spec; missing flows |
| **Requirements ↔ API contract** | Requirements, specs | OpenAPI, actual endpoints | API drift; undocumented endpoints |
| **Requirements ↔ Test results** | Requirements | Test cases, RTM, execution | Untested requirements; orphan tests |
| **Documentation ↔ Implementation** | Docs, README, wikis | Code, UI, API | Outdated docs; undocumented behavior |

See `references/audit-checklist.md` for checklists per dimension.

## Detection Categories

| Category | Description | Output Action |
|----------|-------------|---------------|
| **Outdated documentation** | Docs describe old behavior | Update docs |
| **Undocumented features** | Implementation has features not in specs | Add to specs or create tests |
| **Spec drift** | Behavior changed but docs not updated | Update docs or fix implementation |
| **Regression set optimization** | "Worn out" tests (always pass, low value); suggest rotation | Suggest test rotation; prioritize high-value tests |

See `references/drift-patterns.md` for common patterns and remediation.

## Output Deliverables

1. **Drift Report** — Per dimension: findings, severity, affected artifacts
2. **Action Items** — Update docs / fix implementation / create tests
3. **Task Suggestions** — Structured for qa-task-creator (doc updates, test creation, spec fixes)
4. **Regression Set Recommendations** — Tests to rotate, prioritize, or deprioritize

### Drift Report Template

```markdown
# Spec Audit — [Release/Sprint]

## Summary
| Dimension | Findings | Critical | Action Items |
|-----------|----------|----------|--------------|
| Req ↔ UI | N | X | [Count] |
| Req ↔ API | N | X | [Count] |
| Req ↔ Tests | N | X | [Count] |
| Docs ↔ Impl | N | X | [Count] |

## Findings by Dimension
### Requirements ↔ UI
- [Finding] — [Severity] — [Action]
### Requirements ↔ API
- [Finding] — [Severity] — [Action]
### Requirements ↔ Tests
- [Finding] — [Severity] — [Action]
### Documentation ↔ Implementation
- [Finding] — [Severity] — [Action]

## Task Suggestions (for qa-task-creator)
1. [Task type] — [Description] — [Owner]
2. ...

## Regression Set Recommendations
- Rotate: [Tests that are "worn out"]
- Prioritize: [High-value tests]
- Deprioritize: [Low-value, stable tests]
```

## Workflow

1. **Input:** Requirements, specs, OpenAPI/API docs, test cases/RTM, optional UI URL
2. **Requirements ↔ UI:** Use Playwright MCP to explore UI; compare flows, elements, validation to spec
3. **Requirements ↔ API:** Compare OpenAPI/spec to requirements; detect undocumented endpoints, schema drift
4. **Requirements ↔ Tests:** Validate RTM; find untested requirements, orphan tests
5. **Documentation ↔ Implementation:** Compare docs to code/UI/API; flag outdated sections
6. **Regression optimization:** Analyze test history; identify always-pass, low-value tests; suggest rotation
7. **Output:** Drift report, action items, task suggestions for qa-task-creator

## MCP Tools Used

- **Playwright MCP (cursor-ide-browser):** UI exploration, compare live behavior to spec
- **GitHub MCP:** Change tracking, PR/commit history for docs and code

## Integration with Other Skills

| Need | Skill | Usage |
|------|-------|-------|
| Task creation | qa-task-creator | Convert action items to structured tasks |
| Requirements source | qa-requirements-generator | Normalized requirements for comparison |
| API contract | qa-api-contract-curator | OpenAPI for API dimension |
| Test cases/RTM | qa-testcase-from-docs, qa-coverage-analyzer | Test mapping, coverage |
| Spec writing | qa-spec-writer | Update specs when drift found |

## Scope

**Can do (autonomous):**
- Compare requirements vs UI (via Playwright MCP)
- Compare requirements vs API contract (OpenAPI)
- Compare requirements vs test results (RTM, coverage)
- Compare documentation vs implementation
- Detect outdated docs, undocumented features, spec drift
- Produce drift report with action items
- Suggest tasks for qa-task-creator
- Recommend regression set optimization (test rotation)
- Use GitHub MCP for change tracking

**Cannot do (requires confirmation):**
- Modify documentation or code directly
- Change requirements without stakeholder approval
- Override organizational doc/spec policies

**Will not do (out of scope):**
- Execute tests (consume results only)
- Write or modify test automation
- Deploy or change production systems

## Quality Checklist

- [ ] All four comparison dimensions addressed
- [ ] Drift report includes severity per finding
- [ ] Action items are specific (update X, fix Y, create test Z)
- [ ] Task suggestions formatted for qa-task-creator
- [ ] Regression recommendations include rationale
- [ ] No hardcoded secrets; URLs/config referenced

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| UI comparison fails | Playwright MCP not available; auth required | Use API/docs comparison only; note "UI audit skipped" |
| API contract missing | No OpenAPI; endpoints undocumented | Use qa-api-contract-curator first; manual endpoint list |
| RTM incomplete | Requirements lack IDs; tests not traced | Use qa-requirements-generator; qa-testcase-from-docs for traceability |
| Too many findings | Broad scope; noisy comparison | Focus on critical modules; prioritize by business impact |
| Regression data missing | No test history | Use execution logs; flag "insufficient data" |
| GitHub MCP errors | Token, permissions | Verify GitHub token; check repo access |

## Reference Files

| Topic | Reference |
|-------|-----------|
| Audit checklist per dimension | `references/audit-checklist.md` |
| Drift patterns and remediation | `references/drift-patterns.md` |
