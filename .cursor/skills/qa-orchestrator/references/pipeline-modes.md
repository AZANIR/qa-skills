# Pipeline Mode Configurations

When to use each mode and how they map to handoff chains.

---

## full-cycle

**Flow:** docs → test cases → tests → execution → reports

**Skills invoked:** requirements-generator → spec-writer → diagram-generator → testcase-from-docs → playwright-ts-writer (or framework per project) → test-healer (if fail) → test-reviewer → test-reporter

**When to use:**
- New feature from scratch
- Full validation needed
- Greenfield project
- Release validation

**Input:** Requirements source (URL, code, description)
**Output:** Test report + all intermediate artifacts

---

## docs-only

**Flow:** requirements → spec → diagram

**Skills invoked:** requirements-generator → spec-writer → diagram-generator

**When to use:**
- Documentation phase
- Spec creation before development
- Onboarding documentation
- No tests needed yet

**Input:** Requirements source
**Output:** Spec document + diagrams

---

## testcases-only

**Flow:** docs/spec → test cases

**Skills invoked:** requirements-generator (optional) → spec-writer (optional) → testcase-from-docs

**When to use:**
- Test design phase
- Manual test case creation
- RTM population
- Test planning

**Input:** Spec or requirements
**Output:** Test cases (structured, ISO 29119-4)

---

## write-tests

**Flow:** test cases → tests

**Skills invoked:** testcase-from-docs or testcase-from-ui → [writer per framework]

**When to use:**
- Test cases already exist
- Automation phase
- Adding automation to manual cases
- Framework-specific test generation

**Input:** Test cases + project context
**Output:** Test files (Playwright, Jest, pytest, etc.)

**Writer selection:**
- TS + E2E → playwright-ts-writer
- TS + API → supertest-writer
- Python + E2E → playwright-py-writer
- Python + API → httpx-writer

---

## report

**Flow:** results → report

**Skills invoked:** test-reporter

**When to use:**
- Post-execution
- CI/CD results aggregation
- Status dashboards
- Completion reports

**Input:** Test results (JUnit XML, Allure, JSON)
**Output:** HTML/MD report, status summary

---

## Mode Selection Matrix

| User Intent | Mode | Chain |
| ----------- | ---- | ----- |
| "Full QA from requirements" | full-cycle | Chain 1 |
| "Just docs" | docs-only | (partial Chain 1) |
| "Design test cases" | testcases-only | (partial Chain 1 or 3) |
| "Automate existing cases" | write-tests | Chain 1/2/3 (from step 4/3) |
| "Report on results" | report | (final step) |
| "Explore app and test" | full-cycle | Chain 2 |
| "API contract testing" | full-cycle | Chain 3 |
| "Fix flaky tests" | write-tests | Chain 4 |

---

## Execution Order

Within each mode, skills run sequentially. Parallelization is not supported (handoffs are linear). For large projects, consider splitting by module/feature and running multiple pipelines.
