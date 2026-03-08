# Linking Patterns for Tasks

*How to link tasks to bugs, requirements, coverage gaps, and spec sections.*

---

## GitHub Issue Linking

### Fixes (auto-close)

Use in issue body or PR description:
```
Fixes #123
```
or
```
Closes #123
```
GitHub will auto-close issue #123 when the PR is merged.

### Related (no auto-close)

```
Related to #123
```
or
```
See also #456
```

### In title (avoid)

Do not put issue numbers in task titles; use the body for links.

---

## Bug → Fix Task

**Pattern:** Bug ticket created first; fix task references it.

1. **qa-bug-ticket-creator** creates bug #123
2. **qa-task-creator** creates fix task with body:
   ```
   Fixes #123
   
   [Task description and acceptance criteria]
   ```
3. When fix PR is merged, GitHub auto-closes #123

**When to use "Fixes" vs "Related to":**
- **Fixes** — Task directly resolves the bug
- **Related to** — Task is related (e.g., adds test for bug; doesn't fix root cause)

---

## Requirement → Task

**Pattern:** Task implements or validates a requirement.

**Link format:**
```
Implements: REQ-001 (User must be able to reset password)
```
or
```
Requirement: [link to requirement doc] §2.3
```

**Traceability:** Keep requirement ID in task body for traceability matrix.

---

## Coverage Gap → Task

**Pattern:** Coverage analyzer identifies gap; task adds tests.

**Link format:**
```
Coverage gap: src/auth/AuthService.ts:45-78 (0% coverage)
```
or
```
Module: AuthService.login() — 0% coverage per coverage report [date]
```

**File:line** helps developer locate the code to test.

---

## Spec Section → Task

**Pattern:** Spec-auditor or manual review finds discrepancy; task updates implementation or spec.

**Link format:**
```
Spec reference: §4.2 Validation Rules
```
or
```
Spec: docs/spec.md §4.2 — Implement validation per spec
```

---

## Chained Links (Bug → Fix → Test)

When creating a fix task, consider also creating a QA task for regression coverage:

1. **Bug #123** — "Checkout crashes with empty cart"
2. **Fix task #124** — "Fix null pointer in checkout" — Fixes #123
3. **QA task #125** — "Add regression test for empty cart checkout" — Related to #123

Link QA task to bug so it's traceable; fix task handles the code change.

---

## Jira / Linear (Future Adapters)

When adapters are added:

| System | Link format |
| ------ | ----------- |
| **Jira** | `PROJ-123` in description; Jira auto-links |
| **Linear** | `BUG-456` or `[Linear Issue](url)` |
| **Azure DevOps** | `AB#123` for work item reference |

For now, output markdown with explicit links; user can paste into Jira/Linear.
