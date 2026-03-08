# Handoff Chain Definitions

Input/output contracts for each step in the formalized handoff chains.

---

## Chain 1 — Full E2E

End-to-end flow from requirements to test report.

| Step | Skill | Input | Output |
| ---- | ----- | ----- | ------ |
| 1 | qa-requirements-generator | URL, Figma, code path, or description | Structured requirements (ISO 29148) |
| 2 | qa-spec-writer | Requirements document | Technical spec with acceptance criteria |
| 3 | qa-diagram-generator | Spec sections, flows | Mermaid diagrams (flowchart, sequence, etc.) |
| 4 | qa-testcase-from-docs | Spec + requirements | Test cases (ISO 29119-4) |
| 5 | qa-playwright-ts-writer | Test cases + project context | Playwright E2E tests (TS) |
| 6 | qa-test-healer | Failed test run + test files | Healed selectors/assertions |
| 7 | qa-test-reviewer | Test files | Review feedback, improvements |
| 8 | qa-test-reporter | Test results (JUnit/Allure) | HTML/MD report, status |

**Conditional:** Step 6 (test-healer) runs only when step 5 execution fails.

---

## Chain 2 — UI-first

Exploration-driven flow from live app to gap tasks.

| Step | Skill | Input | Output |
| ---- | ----- | ----- | ------ |
| 1 | qa-browser-data-collector | App URL, flows to explore | Page structure, forms, APIs, flows |
| 2 | qa-testcase-from-ui | Collected data, screenshots | Test cases from UI analysis |
| 3 | qa-playwright-ts-writer | Test cases + collected selectors | Playwright E2E tests |
| 4 | qa-test-healer | Failed tests | Healed tests |
| 5 | qa-coverage-analyzer | Tests + codebase | Coverage gaps, recommendations |
| 6 | qa-task-creator | Coverage gaps | Tasks for missing coverage |

---

## Chain 3 — API-first

Contract-driven API testing flow.

| Step | Skill | Input | Output |
| ---- | ----- | ----- | ------ |
| 1 | qa-api-contract-curator | Endpoints, Swagger/OpenAPI, traffic | OpenAPI spec |
| 2 | qa-testcase-from-docs | OpenAPI spec | API test cases |
| 3a | qa-supertest-writer | Test cases (TS project) | Supertest API tests |
| 3b | qa-httpx-writer | Test cases (Python project) | httpx/pytest API tests |
| 4 | qa-pact-writer | Consumer/provider contracts | Pact contract tests |
| 5 | qa-test-reporter | API test results | Report |

**Branch:** 3a for TypeScript; 3b for Python. Selection based on project context.

---

## Chain 4 — Stabilization

Flaky test and regression stabilization flow.

| Step | Skill | Input | Output |
| ---- | ----- | ----- | ------ |
| 1 | qa-flaky-detector | Test run history, results | Flaky test list |
| 2 | qa-test-healer | Flaky tests | Healed tests |
| 3 | qa-test-reviewer | Healed tests | Review feedback |
| 4 | qa-changelog-analyzer | Git history, changelog | Regression scope |
| 5 | (output) | Regression scope | Scope for regression plan |

---

## Contract Details

### requirements-generator → spec-writer
- **Input:** Markdown/structured requirements with IDs
- **Output:** Spec with sections, acceptance criteria, boundary conditions

### spec-writer → diagram-generator
- **Input:** Spec sections (flows, sequences, states)
- **Output:** Mermaid diagram code (flowchart, sequence, state)

### testcase-from-docs → playwright-ts-writer
- **Input:** Test cases with steps, expected results, IDs
- **Output:** `.spec.ts` files with describe/it blocks

### playwright-ts-writer → test-healer
- **Input:** Test file path, failure output (selector/assertion errors)
- **Output:** Updated test file with fixed selectors/assertions

### api-contract-curator → testcase-from-docs
- **Input:** OpenAPI 3.x spec (YAML/JSON)
- **Output:** API test cases (endpoints, methods, assertions)

### coverage-analyzer → task-creator
- **Input:** Coverage gaps (file:line, module, coverage %)
- **Output:** Tasks with "Add tests for X — Y% coverage"

---

## Handoff Format Conventions

- **IDs:** Preserve requirement/spec/test IDs across handoffs for traceability
- **Paths:** Use workspace-relative paths for files
- **Artifacts:** Store in `memory-bank/` or project output dirs per skill
- **Resume:** Memory MCP stores last step + artifact paths for chain resume
