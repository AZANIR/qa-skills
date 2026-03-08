---
name: qa-test-reporter
description: Aggregate test results from all frameworks, parse JUnit XML/JSON/Allure reports, generate HTML/markdown dashboards with trends, and produce ISO 29119-3 compliant test status and completion reports.
output_dir: reports/test-runs
---

# QA Test Reporter

## Purpose

Aggregate, analyze, and report test results across all testing types and frameworks. Parse outputs from Jest, Vitest, Playwright, pytest, Cypress, k6, JMeter, and other tools; produce unified dashboards, trend analysis, and ISO 29119-3 compliant reports with go/no-go recommendations.

## Input Formats

| Format | Source | Key Fields |
| ------ | ------ | ---------- |
| **JUnit XML** | Jest, pytest, Maven, Gradle, most CI runners | `testsuites`, `testsuite`, `testcase`, `failure`, `skipped`, `time` |
| **JSON reports** | Custom runners, Vitest, Playwright JSON reporter | Varies; see `references/report-formats.md` |
| **Allure results** | Allure adapter (any framework) | `result.json`, `container.json`, attachments |
| **CI/CD output** | GitHub Actions, GitLab CI, Jenkins | Job logs, artifact paths, workflow status |
| **Coverage reports** | Istanbul, c8, pytest-cov, JaCoCo | Line/branch/function coverage JSON |

See `references/report-formats.md` for schemas and parsing rules.

## Output Formats

| Output | Description |
| ------ | ----------- |
| **HTML report** | Interactive dashboard with pass/fail/skip charts, drill-down by category/priority/type |
| **Markdown summary** | Concise summary for PR comments, Slack, or documentation |
| **ISO 29119-3 Test Status Report** | Periodic progress report during execution |
| **ISO 29119-3 Test Completion Report** | Final report with exit criteria and recommendations |
| **Executive summary** | Go/no-go recommendation with risk areas and open defects |

## Report Sections

Every report includes (where data is available):

1. **Summary metrics** — Total pass/fail/skip, duration, pass rate %
2. **Test results by category** — By suite, module, priority, or test type
3. **Failure analysis** — Top failures by frequency, flaky test detection
4. **Coverage summary** — Line/branch/function coverage if provided
5. **Risk areas** — Low coverage, high failure density, blocked tests
6. **Open defects** — Linked incidents, severity distribution
7. **Go/no-go recommendation** — Clear recommendation with rationale

## Trend Analysis

Track pass/fail rates over time using **Memory MCP** for history persistence:

- Store run metadata: date, build ID, pass rate, fail count, duration
- Compare current run vs. previous runs (e.g., last 7 days, last 10 builds)
- Surface regressions: pass rate drop, new flaky tests, duration increase
- Use stored trends in executive summary and status reports

## Integrations

| Integration | Use |
| ----------- | --- |
| **GitHub MCP** | Fetch Actions workflow runs, job logs, artifact URLs for test results |
| **Memory MCP** | Persist and retrieve trend data for historical comparison |
| **qa-diagram-generator** | Generate trend charts (line, bar) for HTML dashboards |

## Trigger Phrases

- "Aggregate test results from [paths/artifacts]"
- "Generate test report from JUnit XML / Allure / JSON"
- "Create HTML test dashboard"
- "ISO 29119-3 test status report" / "test completion report"
- "Go/no-go recommendation for release"
- "Test trend analysis" / "pass rate over time"
- "Parse GitHub Actions test results"

## Workflow

1. **Collect** — Parse one or more report files (JUnit XML, JSON, Allure) or fetch from GitHub Actions
2. **Normalize** — Map to common model: test name, suite, result, duration, failure message
3. **Analyze** — Compute metrics, detect flaky tests, identify top failures
4. **Trend** — Query Memory MCP for history; compare with current run
5. **Generate** — Produce requested outputs (HTML, Markdown, ISO reports, executive summary)

## Scope

**Can do (autonomous):**
- Parse JUnit XML, JSON, Allure results from provided paths or URLs
- Aggregate results from multiple frameworks into unified view
- Generate HTML dashboard, Markdown summary, ISO 29119-3 reports
- Produce go/no-go recommendation from metrics and risk areas
- Use Memory MCP to store/retrieve trend data
- Use GitHub MCP to fetch Actions results when configured
- Call qa-diagram-generator for trend charts

**Cannot do (requires confirmation):**
- Fetch from private repos or artifacts without access
- Override stakeholder-defined go/no-go criteria
- Modify test execution or CI configuration

**Will not do (out of scope):**
- Execute tests or automation
- Modify production code or environments
- Approve release (approval is stakeholder responsibility)

## Quality Checklist

- [ ] All input formats correctly parsed per `references/report-formats.md`
- [ ] Summary metrics accurate (pass/fail/skip counts match source)
- [ ] ISO 29119-3 reports include mandatory sections per `references/iso-29119-reports.md`
- [ ] Go/no-go recommendation supported by metrics and risk analysis
- [ ] Trend data stored/retrieved correctly via Memory MCP
- [ ] No hardcoded secrets; artifact URLs from env or user input
- [ ] HTML dashboard accessible (semantic structure, readable charts)

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Parse errors on JUnit XML | Non-standard or malformed XML | Validate against schema in `references/report-formats.md`; handle missing attributes |
| Missing trend data | Memory MCP not configured or empty | Verify MCP config; run without trends or prompt for manual history |
| GitHub Actions fetch fails | Token missing, private repo | Check GitHub MCP auth; use local artifact paths instead |
| Flaky detection inaccurate | Insufficient run history | Require minimum runs (e.g., 5+) before flagging flaky |
| ISO report incomplete | Mandatory sections missing | Map available data to template; flag gaps for user input |
| Go/no-go unclear | Conflicting metrics | Document rationale; present risk areas for stakeholder decision |

## Reference Files

| Topic | File |
| ----- | ---- |
| Report format schemas (JUnit, Allure, coverage) | `references/report-formats.md` |
| ISO 29119-3 status & completion report templates | `references/iso-29119-reports.md` |
| Reporting best practices | `references/best-practices.md` |
