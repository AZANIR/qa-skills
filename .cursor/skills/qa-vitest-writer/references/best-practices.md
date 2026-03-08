# Vitest Best Practices

## Test Structure

1. **One assertion focus per test** — Prefer narrow tests; use multiple `it` blocks instead of one test with many assertions when behaviors differ.
2. **Descriptive names** — Test names should read like specs: `it('returns 404 when user not found', ...)`.
3. **Arrange-Act-Assert** — Structure tests: setup → call code under test → assert.

## Mocking

1. **Prefer vi.spyOn when possible** — More type-safe and flexible than full module replacement.
2. **Use vi.hoisted for ESM** — When `vi.mock` factory needs variables, define them with `vi.hoisted()`.
3. **Reset mocks between tests** — Use `beforeEach(() => vi.clearAllMocks())` to avoid cross-test pollution.
4. **Mock at the boundary** — Mock external services (HTTP, DB), not internal implementation details.

## Isolation

1. **No shared mutable state** — Each test should be independent; use `beforeEach` for fresh state.
2. **Concurrent tests** — Use `it.concurrent` only when tests have no shared state.
3. **Clean up** — Restore spies, clear timers, reset env in `afterEach` when needed.

## Assertions

1. **Prefer specific assertions** — Use `toBe(5)` over `toBeTruthy()` when the value matters.
2. **Use toStrictEqual for objects** — Catches `undefined` vs missing key differences.
3. **Avoid snapshot overuse** — Use for stable, structured output; avoid for frequently changing UI.

## Performance

1. **Exclude unnecessary files** — Ensure `node_modules`, `dist`, and non-test paths are excluded.
2. **Use workspace for monorepos** — Split projects to parallelize and scope config.
3. **Mock heavy dependencies** — Don't load real DBs, external APIs, or large libs in unit tests.

## Migration from Jest

### API Mapping

| Jest | Vitest |
| ---- | ------ |
| `jest.mock()` | `vi.mock()` |
| `jest.fn()` | `vi.fn()` |
| `jest.spyOn()` | `vi.spyOn()` |
| `jest.useFakeTimers()` | `vi.useFakeTimers()` |
| `jest.runAllTimers()` | `vi.runAllTimers()` |
| `jest.setSystemTime()` | `vi.setSystemTime()` |
| `jest.resetModules()` | `vi.resetModules()` |

### Key Differences

1. **ESM by default** — Vitest is ESM-native; use `import`/`export`. For `vi.mock` factory variables, use `vi.hoisted()`.
2. **Config** — Vitest uses `vitest.config.ts` or `vite.config.ts` with a `test` block, not `jest.config.js`.
3. **Globals** — Enable `globals: true` for `describe`, `it`, `expect`, `vi` without imports.
4. **Coverage** — Use `@vitest/coverage-v8` or `@vitest/coverage-istanbul`; configure under `test.coverage`.

### Migration Steps

1. Install Vitest: `npm i -D vitest`
2. Add `vitest.config.ts` (or `test` block to `vite.config.ts`)
3. Replace `jest` with `vi` in test files
4. Update `package.json` scripts: `"test": "vitest"`
5. Fix ESM issues: add `vi.hoisted()` where `vi.mock` needs variables
6. Run tests and fix any environment or config differences
