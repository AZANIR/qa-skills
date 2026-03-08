# Pytest Best Practices

## Fixture Scope

| Scope | When to Use |
| ----- | ----------- |
| `function` | Default; mutable data, per-test isolation |
| `class` | Shared setup for a group of related tests |
| `module` | Expensive setup (DB, server) used by many tests |
| `session` | Global resources (config, connections) for entire run |

**Avoid:** Session/module scope for mutable state that tests modify. Prefer function scope for isolation.

## Naming Conventions

- **Test files:** `test_{module}.py` (e.g., `test_calculator.py`)
- **Test functions:** `test_{behavior}` (e.g., `test_add_returns_sum`)
- **Test classes:** `Test{Feature}` (e.g., `TestCalculator`)
- **Fixtures:** Descriptive names (e.g., `sample_user`, `db_connection`)

## Test Organization

1. **One assert focus per test** — Easier to pinpoint failures
2. **Arrange-Act-Assert** — Setup, execute, verify
3. **Descriptive names** — `test_returns_404_when_user_not_found` not `test_api`
4. **Group related tests** — Use classes or modules

## Test Isolation

- Each test should be independent; order should not matter
- Use `function`-scoped fixtures for mutable data
- Reset mocks in fixtures or `autouse` teardown
- Avoid global state; prefer dependency injection via fixtures

## Parametrize vs Multiple Tests

Use `@pytest.mark.parametrize` when:
- Same logic, different inputs/outputs
- Boundary values, edge cases
- Table-driven scenarios

Use separate tests when:
- Different setup or behavior
- Different assertions or error paths

## Mocking Best Practices

1. **Patch where used** — `patch("mymodule.api.call")` not `patch("api.call")`
2. **Prefer pytest-mock** — Cleaner lifecycle; auto-restore
3. **Mock at boundaries** — External APIs, DB, file I/O
4. **Avoid over-mocking** — Test real behavior when practical

## Coverage

- Use `pytest-cov` for coverage reports
- Aim for meaningful coverage; 100% is not always practical
- Focus on critical paths, error handling, edge cases
- Run `pytest --cov --cov-report=html` for detailed reports

## Async Tests

- Use `pytest-asyncio` with `asyncio_mode = "auto"`
- Mark async tests: `@pytest.mark.asyncio`
- Avoid mixing sync and async in same test file without care

## Conftest Hierarchy

```
project/
  conftest.py           # Project-wide fixtures
  tests/
    conftest.py         # Test package fixtures
    unit/
      conftest.py       # Unit-test-specific
    integration/
      conftest.py       # Integration-specific (DB, API)
```

Place fixtures at the lowest level that needs them.

## Performance

- Use `-n auto` (pytest-xdist) for parallel runs
- Mark slow tests: `@pytest.mark.slow`; exclude with `-m "not slow"`
- Use module/session fixtures for expensive setup when safe
- Mock external calls to avoid network/DB latency

## Anti-Patterns to Avoid

| Anti-Pattern | Better Approach |
| ------------ | --------------- |
| Shared mutable state across tests | Function-scoped fixtures |
| Asserting implementation details | Assert outcomes and behavior |
| One giant test with many asserts | Split into focused tests |
| Hardcoded test data in production paths | Use fixtures, env vars |
| Skipping tests without reason | Fix or xfail with ticket reference |
| Patch at definition site | Patch at use site |
