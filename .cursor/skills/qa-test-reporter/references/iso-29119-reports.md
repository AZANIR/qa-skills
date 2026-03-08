# ISO 29119-3 Test Status and Completion Report Templates

*Per ISO/IEC/IEEE 29119-3:2021 — Software and systems engineering — Software testing — Part 3: Test documentation*

---

## Test Status Report

**Purpose:** Periodic progress report during test execution. Use for sprint reviews, standups, or milestone checkpoints.

### Template

```markdown
# Test Status Report

**Identifier:** TSR-{YYYYMMDD}-{sequence}
**Reporting Period:** {start date} to {end date}
**Report Date:** {date}
**Project/Release:** {name}

---

## 1. Summary

{Brief executive summary: overall progress, key achievements, blockers.}

---

## 2. Test Execution Summary

| Metric | Planned | Executed | Passed | Failed | Blocked | Skipped | Pass Rate |
| ------ | ------- | -------- | ------ | ------ | ------- | ------- | --------- |
| Total  | {n}     | {n}      | {n}    | {n}    | {n}     | {n}     | {pct}%    |

*Breakdown by level/type if applicable:*

| Category     | Passed | Failed | Skipped | Pass Rate |
| ------------ | ------ | ------ | ------- | --------- |
| Unit         | {n}    | {n}    | {n}     | {pct}%    |
| Integration  | {n}    | {n}    | {n}     | {pct}%    |
| E2E / System | {n}    | {n}    | {n}     | {pct}%    |

---

## 3. Incidents

| Status | Count | Notes |
| ------ | ----- | ----- |
| Open   | {n}   | {High/Critical: n} |
| Closed | {n}   | —     |
| Deferred | {n} | —     |

*Top open incidents (ID, summary, severity):*

- TIR-001: {summary} — {severity}
- TIR-002: {summary} — {severity}

---

## 4. Risks and Issues

- {Risk/blocker 1}
- {Risk/blocker 2}

---

## 5. Next Period Plan

- {Planned activity 1}
- {Planned activity 2}

---

## 6. Metrics (Optional)

- **Coverage:** {line}% lines, {branch}% branches
- **Progress:** {pct}% of planned tests executed
- **Trend:** Pass rate vs. previous period: {up/down/stable}
```

### Mandatory Sections (ISO 29119-3)

| Section | Mandatory | Description |
| ------- | --------- | ----------- |
| Identifier | ✓ | Unique report ID |
| Reporting period | ✓ | Date range covered |
| Summary | ✓ | Executive summary |
| Test execution summary | ✓ | Pass/fail/blocked counts |
| Incidents | ✓ | Open/closed incident summary |
| Risks and issues | | Blockers, risks |
| Next period plan | | Planned activities |
| Metrics | | Coverage, progress % |

---

## Test Completion Report

**Purpose:** Final report when testing is complete. Summarizes outcomes, exit criteria, and release readiness.

### Template

```markdown
# Test Completion Report

**Identifier:** TCR-{YYYYMMDD}-{sequence}
**Report Date:** {date}
**Project/Release:** {name}
**Testing Period:** {start date} to {end date}

---

## 1. Summary

{Executive summary: testing complete, overall outcome, go/no-go recommendation.}

---

## 2. Test Execution Summary

| Metric | Total | Passed | Failed | Blocked | Skipped | Pass Rate |
| ------ | ----- | ------ | ------ | ------- | ------- | --------- |
| Count  | {n}   | {n}    | {n}    | {n}     | {n}     | {pct}%    |

**Duration:** {total hours} hours

*By category:*

| Category     | Passed | Failed | Skipped | Pass Rate |
| ------------ | ------ | ------ | ------- | --------- |
| Unit         | {n}    | {n}    | {n}     | {pct}%    |
| Integration  | {n}    | {n}    | {n}     | {pct}%    |
| E2E / System | {n}    | {n}    | {n}     | {pct}%    |

---

## 3. Exit Criteria

| Criterion | Target | Actual | Met? |
| --------- | ------ | ------ | ---- |
| Pass rate ≥ X% | {target}% | {actual}% | Yes/No |
| No Critical/High open | 0 | {n} | Yes/No |
| Coverage ≥ Y% | {target}% | {actual}% | Yes/No |
| {Custom criterion} | — | — | Yes/No |

**Overall:** {All criteria met / Criteria not met}

---

## 4. Incidents Summary

| Status | Count |
| ------ | ----- |
| Open   | {n}   |
| Closed | {n}   |
| Deferred | {n} |

*Open defects by severity:*

- Critical: {n}
- High: {n}
- Medium: {n}
- Low: {n}

---

## 5. Recommendations

**Release Readiness:** {Go / No-Go / Conditional}

**Rationale:**
- {Point 1}
- {Point 2}

**Follow-up:**
- {Action 1}
- {Action 2}

---

## 6. Lessons Learned (Optional)

- {Improvement 1}
- {Improvement 2}

---

## 7. Metrics (Optional)

- **Coverage:** {line}% lines, {branch}% branches
- **Defect density:** {defects per KLOC or per test}
- **Flaky tests:** {count} identified
```

### Mandatory Sections (ISO 29119-3)

| Section | Mandatory | Description |
| ------- | --------- | ----------- |
| Identifier | ✓ | Unique report ID |
| Summary | ✓ | Executive summary |
| Test execution summary | ✓ | Final pass/fail/blocked counts |
| Exit criteria met | ✓ | Whether criteria were satisfied |
| Incidents summary | ✓ | Open, closed, deferred |
| Recommendations | ✓ | Release readiness, follow-up |
| Lessons learned | | Process improvements |
| Metrics | | Coverage, defect density |

---

## Go/No-Go Recommendation Format

Use in both Status and Completion reports, and in executive summaries:

```markdown
## Go/No-Go Recommendation

**Recommendation:** {Go | No-Go | Conditional}

**Summary:**
- Pass rate: {pct}%
- Open Critical/High: {n}
- Exit criteria: {met / not met}
- Risk areas: {list}

**Rationale:** {2-3 sentence justification}
```

### Decision Matrix (Example)

| Condition | Go | Conditional | No-Go |
| --------- | --- | ----------- | ----- |
| Pass rate | ≥ 95% | 90–95% | < 90% |
| Critical open | 0 | 0 | > 0 |
| High open | 0 | 1–2 (documented) | > 2 |
| Exit criteria | All met | Most met, minor gaps | Not met |

*Tailor thresholds per project.*
