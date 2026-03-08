---
name: qa-jest-writer
description: Generate Jest unit and integration tests for TypeScript/JavaScript projects with jest.mock, snapshots, code coverage, and describe/it patterns.
output_dir: tests/unit
---

# QA Jest Writer

## Purpose

Write Jest unit and integration tests from test case specifications (Phase 2 output). Transform structured test cases into executable TypeScript/JavaScript tests using Jest's describe/it patterns, mocking, snapshots, and coverage tooling.

## Trigger Phrases

- "Write Jest tests for [module/function]"
- "Generate Jest unit tests from test cases"
- "Create Jest integration tests for [service]"
- "Add Jest tests with mocks for [dependency]"
- "Jest snapshot tests for [component]"
- "Jest test coverage for [file]"
- "Parameterized Jest tests for [function]"
- "Jest async tests for [API handler]"

## Test Types

| Type | Scope | Focus |
| ---- | ----- | ----- |
| **Unit** | Isolated function/class testing | Single unit, mocked dependencies |
| **Integration** | Module interaction, service layer | Real or partial integration, fewer mocks |

## Workflow

1. **Read test cases** — From Phase 2 (qa-testcase-from-docs, qa-testcase-from-ui, qa-manual-test-designer)
2. **Analyze target code** — Identify module under test, dependencies, exports
3. **Generate test files** — Create `{module}.test.ts` or `{module}.spec.ts`
4. **Add mocks/fixtures** — jest.mock, jest.spyOn, factory functions, test data
5. **Verify coverage** — Ensure assertions match test case steps, run coverage report

## Context7 MCP

Uses **Context7 MCP** to fetch current Jest documentation when needed. Query for Jest API, matchers, or configuration to ensure generated tests align with latest Jest behavior.

## Key Patterns

| Pattern | Use Case |
| ------- | -------- |
| `describe` / `it` / `test` | Group and define test cases |
| `beforeEach` / `afterEach` | Setup and teardown per test |
| `jest.mock()` | Mock entire modules (hoisted) |
| `jest.spyOn()` | Spy on object methods |
| Snapshot testing | UI components, serializable output |
| `test.each` | Parameterized / table-driven tests |
| `async`/`await`, `done` | Async testing |
| Custom matchers | Domain-specific assertions |

## Assertion Patterns

| Assertion | Use |
| --------- | --- |
| `toBe` | Strict equality (===) |
| `toEqual` | Deep equality |
| `toMatchObject` | Partial object match |
| `toThrow` | Error thrown |
| `toHaveBeenCalledWith` | Mock call arguments |
| `resolves` / `rejects` | Promise outcomes |

See `references/assertions.md` for full reference.

## Configuration

- **jest.config.ts** — TypeScript config with `moduleNameMapper`, `transform`, `coverage`
- **tsconfig paths** — Map aliases (e.g., `@/` → `src/`)
- **setupFiles** — Global setup (e.g., env vars, polyfills)

See `references/config.md` for configuration guide.

## File Naming

- `{module}.test.ts` — Preferred (aligns with Jest default)
- `{module}.spec.ts` — Alternative (common in Angular/Vue)

Place tests next to source (`__tests__/` or colocated) or in `tests/` per project convention.

## Scope

**Can do (autonomous):**
- Generate Jest unit and integration tests from test case specs
- Add jest.mock, jest.spyOn, manual mocks
- Create snapshot tests for components/output
- Write parameterized tests (test.each)
- Handle async tests (async/await, resolves/rejects)
- Configure jest.config.ts patterns (moduleNameMapper, coverage)
- Use Context7 MCP for current Jest docs

**Cannot do (requires confirmation):**
- Change production code to make it testable
- Add tests for modules not in test case scope
- Override project Jest configuration without approval

**Will not do (out of scope):**
- E2E tests (use Playwright/Cypress skills)
- Run tests or interpret coverage reports
- Modify CI/CD pipelines

## References

- `references/patterns.md` — Unit structure, mocking strategies, async, snapshots, error testing
- `references/assertions.md` — Complete Jest assertion reference by category
- `references/config.md` — jest.config, tsconfig paths, coverage, setupFiles
- `references/best-practices.md` — Anti-patterns, AAA, isolation, descriptive names

## Quality Checklist

- [ ] No hardcoded sensitive data (use fixtures/env)
- [ ] Proper mocking (dependencies isolated, no real I/O)
- [ ] Assertions specific (no vague toBeTruthy for complex objects)
- [ ] Tests independent (order-independent, no shared mutable state)
- [ ] Descriptive test names (behavior/outcome, not implementation)
- [ ] Each test case step has corresponding assertion(s)
- [ ] Async tests use async/await or proper done/resolves

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Module not found | Path/alias mismatch | Check `moduleNameMapper` in jest.config, tsconfig paths |
| Mock not working | Hoisting / import order | Use `jest.mock()` at top of file, before imports |
| Timeout | Async not resolved | Increase `jest.setTimeout()`, ensure promises resolve |
| Snapshot drift | Intentional change | Run `jest -u` to update; verify change is correct |
| Coverage gaps | Missing branches | Add tests for error paths, edge cases |
| Spy not called | Wrong target or timing | Verify spy on correct object, call after setup |
