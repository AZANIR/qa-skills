---
name: qa-test-reviewer
description: Code review for test files analyzing structure, assertions, coverage, anti-patterns, and providing a code-smell catalog with before/after improvement examples.
output_dir: reports/reviews
---

# QA Test Reviewer

## Purpose

Perform code review on test files to assess quality, identify anti-patterns, and recommend improvements. Analyzes test structure, assertion quality, coverage alignment, naming conventions, and mocking correctness. Produces a structured review report with severity ratings and suggested fixes.

## Trigger Phrases

- "Review my test code" / "Code review for tests"
- "Analyze test quality" / "Test code quality review"
- "Find test anti-patterns" / "Test code smells"
- "Review [test file] for best practices"
- "Improve test assertions" / "Fix test structure"
- "Test coverage alignment check"
- "DRY vs DAMP in tests"

## Review Criteria

| Criterion | What to Check |
|-----------|---------------|
| **Test structure** | describe/it nesting, setup/teardown placement, logical grouping |
| **Assertion quality** | Specific vs vague assertions; one logical assertion per test |
| **Coverage alignment** | Test ↔ requirement traceability; tests map to intended behavior |
| **Anti-patterns** | Hardcoded data, shared state, sleep waits, implementation coupling |
| **Naming conventions** | Descriptive test names; consistent style (should/expect format) |
| **DRY vs DAMP** | Shared setup where appropriate; readable tests over excessive abstraction |
| **Mocking correctness** | Mocks verify behavior; no over-mocking; correct setup/teardown |

See `references/anti-patterns.md` for the full catalog with before/after examples.

## Code Smell Catalog

| Smell | Description | See |
|-------|-------------|-----|
| **Magic numbers in tests** | Unexplained literals (timeouts, IDs, counts) | `references/anti-patterns.md` |
| **Copy-paste test duplication** | Nearly identical tests; should use parametrize/fixtures | `references/anti-patterns.md` |
| **Assertion-free tests** | Tests that run code but never assert | `references/anti-patterns.md` |
| **Over-mocking** | Mocking everything; tests verify mocks, not behavior | `references/anti-patterns.md` |
| **Test logic (if/for in tests)** | Conditional logic inside tests; tests should be deterministic | `references/anti-patterns.md` |
| **Ignored tests without explanation** | skip/xfail/todo with no reason | `references/anti-patterns.md` |
| **Hardcoded URLs/selectors** | Brittle strings; should use constants or config | `references/anti-patterns.md` |

Each smell includes before/after examples in `references/anti-patterns.md`.

## Output Format

### Review Report Template

```markdown
# Test Review Report: [file/module name]

## Summary
- **Files reviewed:** [count]
- **Issues found:** [count] (Critical: X, High: Y, Medium: Z, Low: W)
- **Overall assessment:** Pass / Needs improvement / Fail

## Issues

### [Severity] [Issue title]
**Location:** [file:line]
**Smell:** [from catalog]
**Description:** [what's wrong]
**Suggested fix:**
[before/after code or instructions]

## Recommendations
1. [Priority action]
2. [Secondary action]

## References
- Anti-patterns: references/anti-patterns.md
- Checklist: references/review-checklist.md
```

### Severity Levels

| Level | When to use |
|-------|-------------|
| **Critical** | Tests are broken, misleading, or will cause false confidence |
| **High** | Significant maintainability or reliability issues |
| **Medium** | Best-practice violations; improves quality |
| **Low** | Style or minor improvements |

## Workflow

1. **Receive test files** — User provides path(s) or content
2. **Apply review checklist** — Use `references/review-checklist.md` systematically
3. **Identify smells** — Map findings to `references/anti-patterns.md` catalog
4. **Assign severity** — Critical/High/Medium/Low per impact
5. **Suggest fixes** — Provide before/after examples where applicable
6. **Produce report** — Structured output per template above

## Scope

**Can do (autonomous):**
- Review test files for structure, assertions, anti-patterns
- Produce review report with severity and suggested fixes
- Reference anti-patterns catalog and review checklist
- Suggest refactors with before/after examples

**Cannot do (requires confirmation):**
- Apply fixes directly to test code (review only; user applies)
- Change test framework or migrate tests
- Override organizational coding standards

**Will not do (out of scope):**
- Modify production/application code
- Execute tests or generate coverage (consume existing reports)
- Implement fixes; this skill reviews and recommends only

## References

| Topic | File |
|-------|------|
| Anti-patterns catalog with before/after examples | `references/anti-patterns.md` |
| Comprehensive test review checklist | `references/review-checklist.md` |

## Quality Checklist

- [ ] All review criteria from checklist applied
- [ ] Issues mapped to code smell catalog where applicable
- [ ] Severity assigned per impact (Critical/High/Medium/Low)
- [ ] Suggested fixes include before/after when helpful
- [ ] Report follows template format
- [ ] No hardcoded secrets in examples
- [ ] Traceability preserved (test case IDs, requirement links)

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Report too verbose | Every minor issue listed | Focus on High/Critical; group Low by category |
| Before/after unclear | Example too abstract | Use concrete code from reviewed file |
| Checklist incomplete | Missing framework-specific checks | See review-checklist.md for Jest/pytest/Playwright sections |
| Severity inconsistent | Subjective judgment | Use severity table; Critical = broken/misleading |
| User wants fixes applied | Skill is review-only | Clarify scope; offer to generate patch as separate step |
