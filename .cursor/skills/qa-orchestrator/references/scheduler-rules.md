# Scheduler Trigger Rules and Automation Patterns

Rules for when to trigger pipelines and what actions to take.

---

## After Merge

**Trigger:** PR merged to main/master (or configured branch)

**Actions:**
1. Run smoke/regression suite
2. Generate test report
3. If failures: invoke qa-bug-ticket-creator for each failure

**Skills invoked:** [test execution] → test-reporter → bug-ticket-creator (conditional)

**Automation pattern:**
- CI hook (GitHub Actions, etc.) runs tests post-merge
- Orchestrator consumes results, generates report
- On failure: create bug tickets with reproduction steps

---

## Before Release

**Trigger:** Release candidate tagged or release branch cut

**Actions:**
1. Run full regression
2. Generate completion report
3. Run risk-analyzer for release scope
4. Output: release readiness summary

**Skills invoked:** [test execution] → test-reporter → risk-analyzer

**Output:** Completion report + risk summary for sign-off

---

## After Requirement Change

**Trigger:** Requirements/spec document updated

**Actions:**
1. Impact analysis (affected test cases, specs)
2. Update RTM (Requirements Traceability Matrix)
3. Flag tests/specs needing update

**Skills invoked:** spec-auditor (or requirements diff) → coverage-analyzer (RTM) → task-creator (for update tasks)

**Output:** Impact report + tasks for spec/test updates

---

## Scheduler Integration

| Trigger | CI Event | Orchestrator Response |
| ------- | -------- | --------------------- |
| After merge | `push` to main | Smoke/regression → report → bug if fail |
| Before release | `release` tag / workflow | Full regression → completion report + risk |
| Requirement change | Manual / file watch | Impact analysis → RTM update |

---

## Configuration

Scheduler rules can be configured via:
- `.cursor/rules/` — project-specific overrides
- Memory MCP — persisted trigger state
- Environment — branch names, report paths

---

## Automation Patterns

### Pattern 1: Fail-fast
On first failure in smoke, stop and create bug. Do not continue full suite.

### Pattern 2: Full report then bugs
Complete full run, generate report, then create bugs for all failures.

### Pattern 3: Risk-gated
Before release: if risk-analyzer flags high risk, require additional tests before sign-off.
