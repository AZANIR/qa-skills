# Structured Workflow Patterns for QA GitHub Issues

*Workflow patterns: bug lifecycle, coverage gap → task → PR, flaky test → investigation → fix.*

---

## 1. Bug Lifecycle Workflow

```
[Report] → [Triage] → [Fix] → [Verify] → [Close]
```

### States and Labels

| Stage | Status Label | Actions |
| ----- | ------------ | ------- |
| **Report** | `status/needs-triage` | Create issue with `type/bug`; assign severity, component |
| **Triage** | — | Confirm reproducibility; add `priority/*`; assign |
| **Fix** | `status/in-progress` | Dev creates PR; link with "Fixes #N" |
| **Verify** | `status/ready-for-test` | PR merged; QA runs verification tests |
| **Close** | `status/verified` | QA confirms; close issue |

### Transitions

1. **Report → Triage**: Assignee reviews; adds `priority/critical` or `priority/high` if valid
2. **Triage → Fix**: Assign to dev; set `status/in-progress`
3. **Fix → Verify**: PR merged; auto or manual set `status/ready-for-test`
4. **Verify → Close**: QA passes verification; set `status/verified`; close

### Automation Hints

- **GitHub Actions**: On PR merge with "Fixes #N", add `status/ready-for-test` to linked issue
- **GitHub MCP**: When creating bug from test failure, auto-assign `type/bug`, `status/needs-triage`, `component/*`

---

## 2. Coverage Gap → Task → PR Workflow

```
[Coverage Analyzer] → [Coverage Gap Issue] → [Fix Task] → [PR] → [Verify]
```

### Flow

1. **qa-coverage-analyzer** produces gap report (file:line, module, risk)
2. **qa-github-issues-enhanced** creates `type/test-coverage-gap` issue with:
   - Location (file:line)
   - Coverage type (code/requirement/technique)
   - Rationale (risk, complexity)
   - Suggested tests
3. **qa-task-creator** (or this skill) creates linked **fix task**:
   - Title: "Add tests for [module/function]"
   - Links to coverage gap issue
   - Labels: `type/task`, `component/unit` or `component/e2e`
4. Dev implements tests; opens PR referencing both issues
5. PR merged; coverage gap and task closed

### Issue Linking

- Coverage gap issue: `#123`
- Fix task: "Adds tests per #123" or "Closes #123"
- PR: "Fixes #124" (fix task) — optionally "Addresses #123" (coverage gap)

### Bulk Creation

When coverage analyzer outputs many gaps:

1. Group by component and priority
2. Create one issue per gap (or batch similar gaps into single issue)
3. Use bulk-create API; assign same milestone
4. Optionally create fix tasks in batch via qa-task-creator

---

## 3. Flaky Test → Investigation → Fix Workflow

```
[Flaky Report] → [Investigation] → [Root Cause] → [Fix] → [Verify]
```

### Flow

1. **qa-flaky-detector** or manual report creates `type/flaky-test` issue
2. **Investigation**: Assign to dev/QA; add `status/in-progress`
   - Run test in loop; capture failure pattern
   - Classify: race-condition, shared-state, time-dependency, external-dependency
3. **Root cause**: Update issue with findings; create fix task if needed
4. **Fix**: Dev fixes test or code; PR with "Fixes #N"
5. **Verify**: Run test 50+ times in CI; confirm stability; close

### Labels by Pattern

| Flaky Pattern | Suggested Labels | Fix Approach |
| ------------- | ---------------- | ------------ |
| race-condition | `type/flaky-test`, `component/e2e` | Add explicit waits; fix async ordering |
| shared-state | `type/flaky-test`, `component/unit` | Isolate state; use fresh fixtures |
| time-dependency | `type/flaky-test` | Mock time; use deterministic delays |
| external-dependency | `type/flaky-test`, `component/integration` | Mock external service; retry with backoff |

### Sub-issues

For complex flaky tests, create sub-tasks:

- #201: Investigate flaky login test
  - #202: Add explicit wait for redirect (child)
  - #203: Verify stability in CI (child)

---

## 4. Spec Drift → Update Workflow

```
[Spec Auditor] → [Spec Drift Issue] → [Update Task] → [PR] → [Verify]
```

### Flow

1. **qa-spec-auditor** finds mismatch (requirements vs implementation vs tests)
2. Create `type/documentation` or `spec-drift` issue:
   - What is drifted (requirement, spec, API contract)
   - Current vs expected state
   - Affected tests
3. Create update task: update spec, or fix implementation, or update tests
4. PR; verify spec-auditor passes

---

## 5. Bulk Operations Pattern

### Input Sources

| Source | Output |
| ------ | ------ |
| qa-coverage-analyzer | Batch of coverage gap issues |
| qa-spec-auditor | Batch of spec drift issues |
| qa-flaky-detector | Batch of flaky test issues |
| qa-changelog-analyzer | Batch of "recommended tests to run" tasks |

### Bulk Create Rules

1. **Deduplicate**: Search existing issues before creating; skip if similar exists
2. **Batch size**: Create in batches of 10–20 to avoid rate limits
3. **Milestone**: Assign same milestone to batch when provided
4. **Labels**: Apply consistent labels per batch type
5. **Throttle**: Add small delay between API calls if needed

---

## 6. Search and Deduplication

### Before Creating Any Issue

1. **Search** via GitHub MCP:
   - By title keywords (normalize: lowercase, remove punctuation)
   - By component + type
   - By error message snippet (for bugs)
   - By file:line (for coverage gaps)
2. **Compare**:
   - Same root cause? → Comment on existing; do not create
   - Related but distinct? → Create with "Related to #N"
   - Truly new? → Create
3. **Report**: If duplicate found, inform user and link to existing issue

### Search Query Examples

```
# Bugs: similar title + component
is:open label:type/bug "login" label:component/auth

# Coverage: same file
is:open label:type/test-coverage-gap "AuthService.ts"

# Flaky: same test path
is:open label:type/flaky-test "login.spec.ts"
```

---

## Integration Summary

| Skill | Consumes | Produces |
| ----- | -------- | -------- |
| qa-github-issues-enhanced | Coverage gaps, spec drift, flaky reports, bug descriptions | Labeled issues, milestones, linked tasks |
| qa-bug-ticket-creator | Test failures | Bug issues (uses this skill's labels/templates) |
| qa-task-creator | Bug issues, coverage gaps | Fix/verification tasks |
| qa-coverage-analyzer | Code, coverage reports | Coverage gap list |
| qa-spec-auditor | Requirements, implementation, tests | Spec drift list |
| qa-flaky-detector | CI history, test results | Flaky test list |
