# Report Format Reference

*Reference for parsing test results from common frameworks and CI systems.*

---

## JUnit XML

Widely supported by Jest, pytest, Maven, Gradle, PHPUnit, and most CI runners.

### Schema Overview

```xml
<testsuites>
  <testsuite name="Suite Name" tests="10" failures="1" skipped="2" errors="0" time="5.23">
    <testcase name="test_name" classname="module.Class" time="0.5">
      <!-- Pass: no child elements -->
    </testcase>
    <testcase name="failing_test" classname="module.Class" time="0.1">
      <failure message="AssertionError">Stack trace...</failure>
    </testcase>
    <testcase name="skipped_test" classname="module.Class">
      <skipped message="Not implemented"/>
    </testcase>
    <testcase name="error_test" classname="module.Class">
      <error message="RuntimeError">Error details...</error>
    </testcase>
  </testsuite>
</testsuites>
```

### Key Attributes

| Element | Attribute | Description |
| ------- | --------- | ----------- |
| `testsuites` | — | Root; may have `name`, `tests`, `failures`, `errors`, `time` |
| `testsuite` | `name` | Suite/module name |
| `testsuite` | `tests` | Total test count |
| `testsuite` | `failures` | Failed count |
| `testsuite` | `skipped` | Skipped count |
| `testsuite` | `errors` | Error count (uncaught exceptions) |
| `testsuite` | `time` | Total duration (seconds) |
| `testcase` | `name` | Test name |
| `testcase` | `classname` | Class/module (often `file.Class` or `path`) |
| `testcase` | `time` | Duration (seconds) |
| `failure` / `error` | `message` | Short error message |
| `failure` / `error` | (text) | Full stack trace |
| `skipped` | `message` | Skip reason |

### Framework Variations

| Framework | Notes |
| --------- | ----- |
| **Jest** | `testsuites` → `testsuite` per file; `classname` = file path |
| **pytest** | `classname` = `ClassName` or module; `file` attribute sometimes present |
| **Vitest** | JUnit-compatible; similar to Jest |
| **Playwright** | JUnit reporter outputs per project/shard |
| **Maven/Gradle** | Standard JUnit 4/5 schema |

### Parsing Rules

1. Treat `failure` and `error` as **failed**.
2. `skipped` = **skipped**; absence of failure/error/skipped = **passed**.
3. Use `classname` + `name` for unique ID; `classname` often maps to suite/module.
4. Aggregate `testsuite`-level counts if `testcase` children are present; prefer sum of children for accuracy.

---

## JSON Reports

Format varies by framework. Common patterns:

### Vitest JSON

```json
{
  "result": {
    "startTime": 1234567890,
    "totalDuration": 5000,
    "numTotalTestSuites": 5,
    "numTotalTests": 50,
    "numPassedTests": 45,
    "numFailedTests": 3,
    "numSkippedTests": 2,
    "testResults": [
      {
        "name": "suite.spec.ts",
        "assertionResults": [
          {
            "ancestorTitles": ["Suite"],
            "title": "test name",
            "status": "passed",
            "duration": 100
          }
        ]
      }
    ]
  }
}
```

### Playwright JSON

```json
{
  "config": { "projects": [...] },
  "suites": [
    {
      "title": "Suite",
      "specs": [
        {
          "title": "test name",
          "tests": [
            {
              "results": [
                {
                  "status": "passed",
                  "duration": 100
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Generic Aggregated JSON (Suggested)

When generating or normalizing:

```json
{
  "summary": {
    "total": 50,
    "passed": 45,
    "failed": 3,
    "skipped": 2,
    "duration": 5000
  },
  "suites": [
    {
      "name": "Suite",
      "tests": [
        {
          "name": "test name",
          "result": "passed",
          "duration": 100,
          "failureMessage": null
        }
      ]
    }
  ]
}
```

---

## Allure Results

Allure uses a directory of JSON files.

### result.json (per test)

```json
{
  "uuid": "abc-123",
  "name": "Test name",
  "fullName": "Suite.Test name",
  "status": "passed",
  "stage": "finished",
  "start": 1234567890000,
  "stop": 1234567890100,
  "labels": [
    { "name": "suite", "value": "Suite" },
    { "name": "priority", "value": "critical" }
  ],
  "steps": [...],
  "attachments": [...]
}
```

**Status values:** `passed`, `failed`, `broken`, `skipped`, `unknown`

### container.json (per suite/container)

```json
{
  "uuid": "container-uuid",
  "children": ["test-uuid-1", "test-uuid-2"],
  "befores": [...],
  "afters": [...]
}
```

### Parsing Rules

1. Read all `*-result.json` and `*-container.json` in the results directory.
2. Build hierarchy from `container.json` → `children` → `result.json`.
3. Map `status`: `passed`→pass, `failed`/`broken`→fail, `skipped`→skip.
4. Use `labels` for suite, priority, epic, feature when present.

---

## Coverage JSON

### Istanbul / c8 (Node.js)

```json
{
  "total": {
    "lines": { "total": 100, "covered": 80, "pct": 80 },
    "statements": { "total": 120, "covered": 95, "pct": 79.17 },
    "functions": { "total": 20, "covered": 18, "pct": 90 },
    "branches": { "total": 40, "covered": 30, "pct": 75 }
  }
}
```

### pytest-cov JSON

```json
{
  "totals": {
    "num_statements": 100,
    "covered_lines": 80,
    "percent_covered": 80.0,
    "missing_lines": 20
  }
}
```

### JaCoCo XML (common in Java)

```xml
<report>
  <counter type="LINE" missed="20" covered="80"/>
  <counter type="BRANCH" missed="10" covered="30"/>
</report>
```

### Parsing Rules

1. Normalize to: `lines`, `branches`, `functions` (or `statements`) with `covered` and `total` or `pct`.
2. If only one metric (e.g., `lines`), use that for coverage summary.
3. Flag files or packages below threshold (e.g., &lt; 70%) as risk areas.

---

## CI/CD Output

### GitHub Actions

- **Workflow runs:** `GET /repos/{owner}/{repo}/actions/runs`
- **Job logs:** `GET /repos/{owner}/{repo}/actions/jobs/{job_id}/logs`
- **Artifacts:** `GET /repos/{owner}/{repo}/actions/runs/{run_id}/artifacts`

Artifacts often contain JUnit XML or JSON. Download artifact ZIP, extract, then parse.

### GitLab CI

- JUnit report artifact path configurable (e.g., `junit: report.xml`)
- Coverage from `coverage` keyword or regex in job log

### Jenkins

- JUnit plugin publishes from `**/target/surefire-reports/*.xml` or similar
- Coverage from JaCoCo, Cobertura plugins

---

## Normalized Internal Model

Use a common structure for aggregation:

| Field | Type | Source |
| ----- | ---- | ------ |
| `id` | string | `classname` + `name` or `fullName` |
| `name` | string | Test name |
| `suite` | string | Suite/module/class |
| `result` | enum | `passed`, `failed`, `skipped`, `blocked` |
| `duration` | number | ms or seconds (normalize to ms) |
| `failureMessage` | string? | From `failure`/`error` message |
| `stackTrace` | string? | Full trace if available |
| `labels` | object? | `priority`, `type`, `epic`, etc. |
