# CI History Analysis for Flaky Detection

## Overview

Flaky tests are identified by analyzing test execution history across multiple CI runs. Same test, different results (pass/fail flip) indicates flakiness.

---

## 1. Data Sources

### JUnit XML

- **Location:** `test-results/*.xml`, `junit.xml`, `report.xml`
- **Parse:** `testsuites` → `testsuite` → `testcase`; attribute `name`, status (pass/fail)
- **Aggregate:** Collect XML from N runs (e.g., last 20 builds)

### Allure

- **Location:** `allure-results/`, `allure-report/`
- **Parse:** `*-result.json` or `*-container.json`; extract test name, status, history
- **History:** Allure can store history across runs for trend analysis

### GitHub Actions

- **Artifacts:** Test results uploaded as artifacts
- **Logs:** Parse job logs for test output (e.g., Jest, pytest summary)
- **API:** `GET /repos/{owner}/{repo}/actions/runs` to list runs; fetch artifacts

### Other CI Systems

- **GitLab CI:** JUnit reports, `junit: report.xml`
- **Jenkins:** JUnit plugin, `**/junit/*.xml`
- **CircleCI:** Store test results, `store_test_results`
- **Azure Pipelines:** Publish test results task

---

## 2. Pass Rate Calculation

### Formula

```
pass_rate = passes / (passes + failures)
```

- **Flaky threshold:** `pass_rate < 1.0` and `pass_rate > 0` (i.e., at least one pass and one fail)
- **Always failing:** `pass_rate = 0` → exclude from flaky report (treat as broken)
- **Always passing:** `pass_rate = 1.0` → stable, not flaky

### Minimum Runs

- **Recommended:** 10+ runs for reliable detection
- **Low runs:** High variance; flag as "uncertain" or "needs more data"

### Example

| Test | Run 1 | Run 2 | Run 3 | ... | Run 10 | Pass Rate |
|------|-------|-------|-------|-----|--------|------------|
| login.spec.ts:42 | P | F | P | ... | P | 7/10 = 70% |

---

## 3. Aggregation Workflow

1. **Collect** — Fetch test results from last N CI runs (e.g., 20)
2. **Normalize** — Map test names to canonical form (file:line or full name)
3. **Build matrix** — Rows = tests, columns = runs, cells = pass/fail
4. **Compute** — Pass rate per test
5. **Filter** — Keep tests with `0 < pass_rate < 1`
6. **Sort** — By failure rate (high first) or by critical path

---

## 4. Test Name Normalization

Different frameworks report names differently:

| Framework | Example | Normalized |
|-----------|---------|------------|
| Jest | `auth › login › should redirect` | `auth/login.spec.ts` or full name |
| pytest | `tests/test_auth.py::test_login` | `tests/test_auth.py::test_login` |
| Playwright | `auth/login.spec.ts:42` | `auth/login.spec.ts:42` |
| Mocha | `Login should redirect` | Match by file + describe + it |

Use consistent normalization to merge results across runs.

---

## 5. CI-Specific Parsing

### GitHub Actions

```yaml
# In workflow, ensure test results are published
- uses: actions/upload-artifact@v4
  with:
    name: test-results
    path: test-results/
```

Parse artifact `test-results/*.xml` from each run.

### GitLab CI

```yaml
junit: report.xml
```

Download `report.xml` from job artifacts via API.

### Local Script

```bash
# Collect last N runs (conceptual)
for run in $(gh run list --limit 20 --json databaseId -q '.[].databaseId'); do
  gh run download $run -n test-results -D results/run-$run
done
```

---

## 6. Output for qa-flaky-detector

Feed aggregated data into the skill:

```json
{
  "runs": 20,
  "tests": [
    {
      "name": "auth/login.spec.ts:42",
      "passes": 14,
      "failures": 6,
      "pass_rate": 0.7
    }
  ]
}
```

The skill then classifies each flaky test and suggests fixes.
