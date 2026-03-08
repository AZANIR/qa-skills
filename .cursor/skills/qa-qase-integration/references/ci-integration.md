# CI/CD Integration with Qase.io

## Overview

Push test execution results from CI/CD pipelines to Qase.io. Two main approaches:

1. **qase-api reporter** — Native reporter that sends results directly to Qase during test execution
2. **JUnit XML → Qase** — Parse JUnit XML artifacts and push via REST API (e.g., in a separate job)

## Option 1: qase-api Reporter

### Supported Frameworks

- **Jest** — `@qase/jest`
- **Playwright** — `@qase/playwright`
- **Cypress** — `@qase/cypress`
- **Pytest** — `qase-pytest`
- **Mocha** — `@qase/mocha`
- **PHPUnit** — `qase-phpunit`

### Configuration

Set environment variables:

```bash
QASE_API_TOKEN=your_api_token
QASE_PROJECT_CODE=MP
QASE_RUN_ID=123   # Optional: append to existing run
QASE_RUN_NAME="CI Run $(date +%Y-%m-%d)"
```

### Jest Example

```javascript
// jest.config.js
module.exports = {
  reporters: [
    'default',
    ['@qase/jest', {
      apiToken: process.env.QASE_API_TOKEN,
      projectCode: process.env.QASE_PROJECT_CODE,
      runId: process.env.QASE_RUN_ID,
      runName: process.env.QASE_RUN_NAME,
      logging: true
    }]
  ]
};
```

### Playwright Example

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['html'],
    ['@qase/playwright', {
      apiToken: process.env.QASE_API_TOKEN,
      projectCode: process.env.QASE_PROJECT_CODE,
      runId: process.env.QASE_RUN_ID,
      runName: process.env.QASE_RUN_NAME
    }]
  ]
});
```

### Pytest Example

```python
# pytest.ini or pyproject.toml
[pytest]
addopts = -v --qase --qase-api-token=${QASE_API_TOKEN} --qase-project=${QASE_PROJECT_CODE} --qase-run-id=${QASE_RUN_ID}
```

Or in `conftest.py`:

```python
def pytest_configure(config):
    config.addinivalue_line("addopts", "--qase")
    config.addinivalue_line("addopts", f"--qase-api-token={os.environ.get('QASE_API_TOKEN')}")
    config.addinivalue_line("addopts", f"--qase-project={os.environ.get('QASE_PROJECT_CODE')}")
```

### Case ID Mapping

Reporters map test names to Qase cases. Options:

- **Case ID in test name** — e.g., `C1` or `C123` prefix
- **Decorator/annotation** — `@qase.id(123)` or `@qase.id("C123")`
- **Title matching** — Match by test title (less reliable)

---

## Option 2: GitHub Actions + JUnit XML

Push JUnit XML results to Qase.io in a separate step.

### Workflow Example

```yaml
name: Tests + Qase Sync

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test -- --ci --reporters=default --reporters=jest-junit
        env:
          JEST_JUNIT_OUTPUT_DIR: ./test-results

      - name: Upload JUnit results
        uses: actions/upload-artifact@v4
        with:
          name: junit-results
          path: test-results/

  qase-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Download JUnit results
        uses: actions/download-artifact@v4
        with:
          name: junit-results

      - name: Push to Qase.io
        uses: qase-io/qase-report-action@v1
        with:
          api-token: ${{ secrets.QASE_API_TOKEN }}
          project-code: ${{ vars.QASE_PROJECT_CODE }}
          results-path: ./
          run-name: "CI Run ${{ github.run_number }}"
          run-complete: true
```

### Alternative: Custom Script

If no ready-made action fits, use a script that:

1. Parses JUnit XML
2. Creates a run via `POST /run/{code}`
3. Maps each `<testcase>` to a Qase case (by title or external ID)
4. Posts results via `POST /result/{code}/{run_id}` or bulk endpoint

```bash
# Example: using qase-api CLI or custom Node/Python script
npx qase-api push-results \
  --token $QASE_API_TOKEN \
  --project $QASE_PROJECT_CODE \
  --results ./test-results/junit.xml \
  --run-name "CI Run"
```

---

## Environment Variables

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `QASE_API_TOKEN` | Yes | API token from app.qase.io/user/api/token |
| `QASE_PROJECT_CODE` | Yes | Project code (2–10 chars) |
| `QASE_RUN_ID` | No | Append to existing run |
| `QASE_RUN_NAME` | No | Name for new run |
| `QASE_ENVIRONMENT_ID` | No | Environment for the run |

---

## Best Practices

1. **Secrets** — Store `QASE_API_TOKEN` in GitHub Secrets (or equivalent); never in code
2. **Run naming** — Include build ID, branch, or date for traceability
3. **Case mapping** — Use consistent test naming or `@qase.id()` for reliable mapping
4. **Bulk results** — Use `POST /result/{code}/{id}/bulk` for large result sets
5. **Run completion** — Call run complete endpoint when all results are posted
6. **Retries** — Handle 429; implement exponential backoff for rate limits
