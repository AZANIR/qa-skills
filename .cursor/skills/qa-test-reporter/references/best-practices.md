# Test Reporting Best Practices

*Guidance for meaningful metrics, trend analysis, and stakeholder communication.*

---

## Meaningful Metrics

### Primary Metrics

| Metric | Use | Avoid |
| ------ | --- | ----- |
| **Pass rate** | % passed / total executed | Excluding skipped inflates rate; document skip reasons |
| **Failure count** | Absolute and trend | Ignoring flaky tests masks real regressions |
| **Duration** | Trend over time; SLA compliance | Single-run duration without context |
| **Coverage** | Risk areas; uncovered code | Coverage as sole quality gate |

### Secondary Metrics

- **Flaky rate** — Tests that pass/fail inconsistently; prioritize stabilization
- **Failure density** — Failures per module/suite; identify hotspots
- **Blocked count** — Tests blocked by environment or defects
- **Defect escape rate** — Production defects / total defects found (post-release)

### Anti-Patterns

1. **Vanity metrics** — High pass rate with many skipped tests
2. **Single-number focus** — Pass rate alone without failure analysis
3. **Ignoring trends** — One bad run vs. sustained regression
4. **Coverage as proxy for quality** — 100% coverage with weak assertions

---

## Trend Analysis

### What to Track

| Data Point | Purpose |
| ---------- | ------- |
| Pass rate over last N runs | Detect regression |
| Failure count trend | New vs. recurring failures |
| Duration trend | Performance degradation |
| Flaky test list | Prioritize stabilization |
| Coverage trend | Coverage growth or regression |

### Storage (Memory MCP)

Store per run:

```json
{
  "runId": "build-123",
  "timestamp": "2025-03-07T10:00:00Z",
  "total": 100,
  "passed": 92,
  "failed": 5,
  "skipped": 3,
  "duration": 120000,
  "passRate": 92
}
```

Query for:

- Last 7 days
- Last 10 builds
- Same branch/commit family

### Reporting Trends

- **Improving** — Pass rate up, failures down
- **Stable** — No significant change
- **Regressing** — Pass rate down, failures up; flag for investigation
- **New baseline** — First run or major scope change; avoid over-interpretation

---

## Stakeholder Communication

### Audience Tiers

| Audience | Focus | Detail Level |
| -------- | ----- | ------------- |
| **Executive** | Go/no-go, risk, timeline | 1-page summary |
| **Project manager** | Progress, blockers, next steps | Status report |
| **Developers** | Failures, flaky tests, top issues | Failure analysis, links to failures |
| **QA** | Full metrics, trends, coverage | Full dashboard |

### Report Cadence

- **Daily/Sprint** — Status report (progress, blockers)
- **Release** — Completion report (go/no-go, recommendations)
- **Ad-hoc** — HTML dashboard, Markdown summary for PRs

### Clarity Principles

1. **Lead with the answer** — Go/no-go and key metrics first
2. **Use plain language** — Avoid jargon for non-technical readers
3. **Provide context** — "Pass rate 92%, up from 88% last week"
4. **Actionable** — "5 flaky tests in checkout flow — stabilize before release"
5. **Traceability** — Link failures to test IDs, defects, requirements

---

## Failure Analysis

### Top Failures

Rank failures by:

1. **Frequency** — Same test failing across runs
2. **Impact** — Critical path, high-priority area
3. **Recency** — New failures vs. long-standing

### Flaky Detection

- Same test: pass and fail across runs without code change
- Require minimum runs (e.g., 5+) before flagging
- Report: "Flaky (3/10 runs failed)"

### Failure Grouping

Group by:

- **Module/suite** — Identify weak areas
- **Error type** — Timeout, assertion, environment
- **Root cause** — When known, tag for reporting

---

## Risk Areas

Flag when:

- **Low coverage** — Module/suite below threshold (e.g., < 70%)
- **High failure density** — Many failures in one area
- **Blocked tests** — Cannot execute; blocks exit criteria
- **Open Critical/High** — Unresolved defects in scope
- **Duration spike** — Significant slowdown vs. baseline

Present in report: "Risk areas: Checkout module (65% coverage, 3 open High defects)"

---

## ISO 29119-3 Alignment

- Use **Test Status Report** for periodic updates; **Test Completion Report** for release
- Include all mandatory sections per `references/iso-29119-reports.md`
- Tailor for Agile: shorter cycles, lighter documentation, focus on working software
- Traceability: link tests to requirements, defects to test cases

---

## Tool Integration

| Tool | Best Practice |
| ---- | ------------- |
| **CI/CD** | Publish reports as artifacts; parse in post-job step |
| **GitHub Actions** | Use `actions/upload-artifact` for JUnit/JSON; fetch via GitHub MCP |
| **Allure** | Rich metadata; use labels for suite, priority, epic |
| **Coverage** | Merge with test results; include in same report |
| **Memory MCP** | Store trends; query before generating report |
