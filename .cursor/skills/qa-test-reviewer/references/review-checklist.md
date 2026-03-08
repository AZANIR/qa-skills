# Test Review Checklist

Use this checklist systematically when reviewing test files.

---

## 1. Test Structure

- [ ] **describe/it nesting** — Logical grouping; max 3–4 levels deep
- [ ] **Setup/teardown** — beforeEach/afterEach or fixtures in correct scope
- [ ] **Test isolation** — Each test independent; no shared mutable state
- [ ] **Arrange-Act-Assert** — Clear three-phase structure
- [ ] **One logical assertion per test** — Single behavior under test

### Framework-Specific

| Framework | Structure |
|-----------|-----------|
| Jest/Vitest | describe → it; beforeEach/afterEach |
| pytest | class or module; fixtures with scope |
| Playwright | test() with test.describe; fixtures |
| Cypress | describe → it; beforeEach |

---

## 2. Assertion Quality

- [ ] **Specific assertions** — `expect(x).toBe(y)` not `expect(!!x).toBe(true)` when possible
- [ ] **Meaningful failure messages** — Custom message when assertion is unclear
- [ ] **No assertion-free tests** — Every test asserts something
- [ ] **Correct matchers** — toEqual vs toBe; toContain vs toHaveLength

---

## 3. Coverage Alignment

- [ ] **Requirement traceability** — Test IDs or comments link to requirements
- [ ] **Behavior-focused** — Tests verify behavior, not implementation
- [ ] **Edge cases** — Boundaries, empty inputs, error paths covered
- [ ] **No redundant tests** — Same behavior not tested multiple times

---

## 4. Anti-Patterns

- [ ] **No magic numbers** — Constants for timeouts, counts, IDs
- [ ] **No copy-paste duplication** — Parametrize or fixtures
- [ ] **No sleep waits** — Explicit waits (waitForSelector, waitForResponse)
- [ ] **No hardcoded URLs/selectors** — Config or constants
- [ ] **No shared mutable state** — Each test gets fresh data
- [ ] **No implementation coupling** — Test public API, not internals
- [ ] **No test logic** — No if/for/switch inside tests
- [ ] **No ignored tests without reason** — skip/xfail/todo with explanation

---

## 5. Naming Conventions

- [ ] **Descriptive names** — "should display error when email is invalid"
- [ ] **Consistent style** — should/expect or given-when-then
- [ ] **No implementation details** — "clicks submit button" vs "calls onSubmit handler"

---

## 6. DRY vs DAMP

- [ ] **Shared setup** — Common fixtures for repeated setup
- [ ] **Readable over abstract** — DAMP when clarity matters
- [ ] **No over-abstraction** — Test helpers that obscure intent

---

## 7. Mocking

- [ ] **Mock only external deps** — APIs, DB, file system
- [ ] **Verify behavior, not calls** — Prefer outcome over call count when possible
- [ ] **Correct teardown** — Mocks restored after test
- [ ] **No over-mocking** — Test real code paths where feasible

---

## Severity Mapping

| Finding | Typical Severity |
|---------|------------------|
| Assertion-free test | Critical |
| Shared mutable state | Critical |
| sleep() in test | High |
| Magic numbers everywhere | Medium |
| Copy-paste duplication | Medium |
| Hardcoded URL | Medium |
| skip without reason | Low |
| Naming style inconsistency | Low |
