---
name: qa-flaky-detector
description: Analyze CI history and test execution data to identify flaky tests using 4-pattern classification -- race conditions, shared state, time-dependency, external dependencies -- with suggested fixes.
output_dir: reports/flaky
dependencies:
  recommended:
    - qa-test-healer
---

# QA Flaky Detector

## Purpose

Identify and classify flaky tests from CI history and test execution data. Flaky tests pass and fail intermittently for the same code, wasting CI time and masking real failures. This skill detects flakiness, classifies root causes into four patterns, and suggests targeted fixes.

## Trigger Phrases

- "Find flaky tests" / "Identify flaky tests"
- "Analyze CI history for flakiness" / "Flaky test report"
- "Why does this test fail sometimes?" / "Intermittent test failures"
- "Classify flaky test [name]" / "Flaky test patterns"
- "Suggested fixes for flaky tests" / "Fix flaky [test name]"

## 4-Pattern Classification

| Pattern | Description | Typical Causes | Suggested Fixes |
|---------|-------------|----------------|-----------------|
| **1. Race conditions** | Async timing, DOM not ready, API response order | Missing awaits, no explicit waits, parallel execution | Add explicit waits, `await` chains, `waitForSelector` |
| **2. Shared state** | Test order dependency, global state mutation, DB leftover | Global vars, singletons, uncleared DB/cache | Isolate tests, `beforeEach` cleanup, transactional rollback |
| **3. Time-dependency** | Timezone, date/time mocking, daylight saving | `new Date()`, `Date.now()`, hardcoded dates | Mock time (Jest `useFakeTimers`, `freezegun`), use fixed dates |
| **4. External dependencies** | Network calls, third-party APIs, file system | Live HTTP, external services, temp files | Mock/stub APIs, use fixtures, deterministic file paths |

See `references/flaky-patterns.md` for detailed patterns with code examples and fixes.

## Detection Methods

### 1. CI History Analysis

- Same test, different results across runs (pass/fail flip)
- Compare JUnit XML, Allure, or CI job logs over N runs
- Threshold: pass rate < 100% over 10+ runs → flag as flaky

### 2. Statistical Analysis

- Pass rate per test: `passes / (passes + failures)` over recent runs
- Confidence: more runs → higher confidence in flakiness
- Minimum runs: recommend 10+ for reliable detection

### 3. Pattern Matching (Code-Based)

- Scan test code for known flaky signatures:
  - No `await` on async operations
  - `setTimeout`/`setInterval` without cleanup
  - `new Date()` or `Date.now()` without mocking
  - Direct HTTP calls, file I/O
  - Shared globals, singletons
  - Missing `beforeEach`/`afterEach` cleanup

See `references/ci-analysis.md` for CI history analysis methods.

## Workflow

1. **Input** — CI artifacts (JUnit XML, Allure, GitHub Actions logs), test execution history, or test file paths
2. **Collect** — Parse results from N runs; build pass/fail matrix per test
3. **Detect** — Identify tests with pass rate < 100%
4. **Classify** — Map each flaky test to one or more of the 4 patterns (code scan + heuristics)
5. **Suggest** — Generate fix recommendations per pattern
6. **Output** — Flaky test report, prioritized fix list

## Output Deliverables

### Flaky Test Report

```markdown
# Flaky Test Report — [Project/Branch]

## Summary
| Test | Failure Rate | Runs | Classification | Priority |
|------|--------------|------|----------------|----------|
| auth.login.spec.ts:42 | 23% | 26 | Race condition | High |
| checkout.flow.spec.ts:15 | 12% | 18 | Shared state | High |
| utils.date.spec.ts:8 | 8% | 12 | Time-dependency | Medium |

## Detailed Findings

### auth.login.spec.ts:42 — "should redirect after login"
- **Failure rate:** 6/26 (23%)
- **Classification:** Race condition
- **Likely cause:** DOM not ready before assertion
- **Suggested fix:** Add `await page.waitForSelector('#dashboard')` before assertion
```

### Prioritized Fix List

1. **High** — High failure rate, critical path, or easy fix
2. **Medium** — Moderate rate, non-critical
3. **Low** — Low rate, edge cases

## Integration with Other Skills

| Need | Skill | Usage |
|------|-------|-------|
| Parse JUnit/Allure | qa-test-reporter | Aggregate results from multiple runs |
| Fix broken selectors | qa-test-healer | Apply suggested waits/selectors |
| Create fix tasks | qa-task-creator | Generate tasks for flaky test fixes |
| Test strategy | qa-test-strategy | Document flaky mitigation in strategy |

## Scope

**Can do (autonomous):**
- Parse CI/test results (JUnit XML, Allure, common formats)
- Compute pass rate per test over N runs
- Classify flaky tests into 4 patterns
- Scan test code for flaky signatures
- Produce flaky report and prioritized fix list
- Suggest fixes per pattern (from reference patterns)

**Cannot do (requires confirmation):**
- Modify test code directly (suggest only; qa-test-healer can apply)
- Access private CI systems without credentials
- Override classification without evidence

**Will not do (out of scope):**
- Execute tests or run CI
- Deploy or change production
- Guarantee fix effectiveness (suggestions are heuristic-based)

## Quality Checklist

- [ ] Pass rate calculated over sufficient runs (≥10 recommended)
- [ ] Each flaky test classified into at least one pattern
- [ ] Suggested fixes match pattern and reference examples
- [ ] Report includes test name, file:line, failure rate, classification
- [ ] Prioritized fix list ordered by impact
- [ ] No hardcoded credentials; CI access from user/env

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| No flaky tests found | Too few runs, or tests truly stable | Increase run count; verify CI artifacts parsed |
| All tests flagged | Threshold too strict | Raise pass-rate threshold; exclude known-broken tests |
| Wrong classification | Heuristics insufficient | Review code manually; add custom pattern to references |
| Missing CI data | Format not supported | Check qa-test-reporter; add parser for format |
| Fix doesn't work | Root cause different | Re-classify; try alternative pattern fixes |
| Pass rate 0% | Test always fails | Exclude from flaky report; treat as broken |

## Reference Files

| Topic | Reference |
|-------|-----------|
| Flaky patterns with code examples and fixes | `references/flaky-patterns.md` |
| CI history analysis methods | `references/ci-analysis.md` |
