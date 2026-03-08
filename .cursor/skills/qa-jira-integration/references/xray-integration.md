# Xray / Zephyr Test Management Integration

*Patterns for syncing test cases and execution with Jira via Xray or Zephyr.*

---

## Xray (Xray for Jira)

### Test Case as Jira Issue

- **Issue type:** `Test` (or project-specific)
- **Link types:** Test → Requirement (traceability)
- **Custom fields:** Steps, Preconditions, Expected Result

### REST API Endpoints (Xray)

| Operation | Endpoint |
| --------- | -------- |
| Create test | `POST /rest/raven/2.0/api/test` |
| Link test to requirement | `POST /rest/raven/2.0/api/test/{key}/requirement` |
| Create test execution | `POST /rest/raven/2.0/api/testexec/{execKey}/test` |
| Import test results (Xray format) | `POST /rest/raven/2.0/api/import/execution` |

### Import Execution (Cucumber, JUnit, etc.)

Xray accepts JUnit XML, Cucumber JSON, and other formats. POST to import endpoint with execution results; Xray creates/updates Test Execution and links to tests.

---

## Zephyr (Zephyr Scale / Squad)

### Test Case as Jira Issue

- **Issue type:** `Test` (Zephyr Scale)
- **Traceability:** Test ↔ Requirement via Zephyr links

### REST API (Zephyr Scale)

| Operation | Endpoint |
| --------- | -------- |
| Create test | Zephyr Scale REST API (varies by version) |
| Add to test cycle | Cycle and folder APIs |
| Record execution | Execution API |

Check Zephyr documentation for exact endpoints; they differ between Zephyr for Jira (classic) and Zephyr Scale.

---

## Common Patterns

### 1. Link Test to Requirement

After creating a Test issue in Jira:
- **Xray:** Use Xray REST to link test key to requirement key
- **Zephyr:** Use Zephyr API for traceability

### 2. Import Automated Results

1. Run tests (Playwright, pytest, Jest, etc.)
2. Export results as JUnit XML or Cucumber JSON
3. POST to Xray/Zephyr import endpoint
4. Map test case IDs (e.g., `PROJ-T123`) to automated test names via mapping or naming convention

### 3. Naming Convention

Use consistent naming: `PROJ-T001`, `PROJ-T002` or map `describe/it` or `test_` names to test keys via a mapping file.

---

## Environment Variables

| Variable | Description |
| -------- | ----------- |
| `JIRA_BASE_URL` | Same as main Jira |
| `JIRA_API_TOKEN` | Same as main Jira |
| `XRAY_CLIENT_ID` / `XRAY_CLIENT_SECRET` | For Xray Cloud API (if using OAuth) |

---

## Scope

- Create Test issues and link to requirements
- Import execution results from CI
- Query test coverage per requirement
- Sync with qa-test-reporter output (JUnit XML)
