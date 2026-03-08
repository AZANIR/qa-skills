---
name: qa-test-healer
description: Self-healing test system that runs failing tests, debugs with MCP tools, auto-fixes broken selectors/assertions/waits, and marks unfixable tests as test.fixme() with explanation.
---

# QA Test Healer

## Purpose

Automatically fix broken tests after code changes. Inspired by fugazi/test-automation-skills-agents, this skill runs failing tests in headed/debug mode, analyzes failures, applies targeted fixes, and either restores passing tests or marks unfixable cases as `test.fixme()` with a clear explanation.

## Trigger Phrases

- "Heal my failing tests"
- "Fix broken Playwright/Cypress tests"
- "Auto-fix test failures"
- "Tests are failing after my changes"
- "Debug and fix selector/assertion failures"
- "Run failing test and fix it"

## Healing Workflow

1. **Receive failing test(s)** — User provides failing test path(s), error output, or CI failure logs
2. **Run test in headed mode / with debug output** — Execute the test with visible browser and verbose logging to capture failure context
3. **Analyze failure** — Determine root cause: selector broken? assertion changed? timeout? missing element? network change?
4. **Apply fix strategy** — Use the appropriate strategy from `references/fix-strategies.md`
5. **Re-run to verify fix** — Execute the test again; confirm it passes
6. **If unfixable** — Mark as `test.fixme('explanation')` with a clear reason for manual review

## Fix Strategies

| Failure Type | Strategy | Action |
|--------------|----------|--------|
| **Broken selectors** | Find new locator | Use accessibility snapshot (Playwright MCP) to inspect DOM; update POM/test with stable locator (getByRole, getByTestId preferred) |
| **Changed assertions** | Compare expected vs actual | If intentional product change, update expected values; otherwise flag for review |
| **Timeout issues** | Add explicit waits | Increase timeout thresholds, add `expect` with timeout, or use `waitFor` for async content |
| **Missing elements** | Check feature status | Determine if feature was removed/redesigned; flag for manual review or mark fixme |
| **Network changes** | Update mocks/routes | Update intercepted routes, mocks, or add retry logic for flaky endpoints |

See `references/fix-strategies.md` for detailed before/after examples.

## Diagnosis Patterns

Use `references/diagnosis-patterns.md` for:

- **Error message parsing** — Extract selector, assertion, timeout from stack traces and failure output
- **DOM comparison** — Use browser snapshot to compare expected vs actual structure
- **Network analysis** — Inspect requests/responses when API or mock changes cause failures

## MCP Integration

- **Playwright MCP (cursor-ide-browser)** — Run tests, navigate to failure state, take accessibility snapshots, inspect DOM, verify fixes
- **Lock/unlock workflow** — Lock browser before interactions; unlock when done

## Scope

**Can do (autonomous):**
- Fix broken selectors by finding new locators via DOM inspection
- Update assertions when expected values have legitimately changed
- Add or adjust waits and timeouts for flaky/timeout failures
- Update network mocks, routes, or retry logic
- Mark unfixable tests as `test.fixme()` with explanation
- Run tests in headed mode to reproduce and verify fixes

**Cannot do (requires confirmation):**
- Rewrite test logic or change test intent
- Add new test cases or modify test structure significantly
- Change production code

**Will not do (out of scope):**
- Modify production/application code
- Execute tests in CI without user request
- Approve or merge code changes

## References

| Topic | File |
|-------|------|
| Detailed fix strategies with before/after examples | `references/fix-strategies.md` |
| Error parsing, DOM comparison, network analysis | `references/diagnosis-patterns.md` |

## Quality Checklist

- [ ] Root cause correctly identified before applying fix
- [ ] Fix strategy matches failure type per `references/fix-strategies.md`
- [ ] Test passes after fix (re-run verified)
- [ ] Unfixable tests marked with `test.fixme('clear explanation')`
- [ ] No production code modified
- [ ] POM updated if selector changed in shared locator
- [ ] Traceability preserved (test case IDs, comments)

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Can't reproduce failure locally | Environment difference, flaky test | Run with `--retries=0`; check CI env vars; use same baseURL |
| Snapshot shows different structure | Dynamic content, A/B test | Wait for stable state; use more resilient locators |
| Fix works once then fails | Race condition, shared state | Add proper wait; ensure test isolation |
| Multiple failures in one file | Cascading failure, setup issue | Fix setup/fixture first; run tests individually |
| test.fixme() not recognized | Framework difference | Use `test.skip()` or equivalent for Cypress/pytest |
| MCP browser not available | Playwright MCP not configured | Use terminal to run tests; analyze error output only |
