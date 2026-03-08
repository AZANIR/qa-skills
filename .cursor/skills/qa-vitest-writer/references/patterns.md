# Vitest Test Patterns

## ESM Mocking

### vi.mock() Hoisting

`vi.mock()` is **hoisted** to the top of the file and runs before all imports. Variables used in the factory must be defined via `vi.hoisted()`:

```ts
import { vi } from 'vitest'

const mockFn = vi.hoisted(() => vi.fn())

vi.mock('./my-module', () => ({
  myFunction: mockFn,
}))
```

### vi.spyOn vs vi.mock

| Use Case | Prefer | Reason |
| -------- | ------ | ------ |
| Replace entire module | `vi.mock()` | Full substitution |
| Spy on single export | `vi.spyOn(exports, 'name')` | Type-safe, flexible |
| Partial mock (keep some exports) | `vi.mock` with `importOriginal` | Merge original + overrides |
| Browser mode | `vi.mock` (vi.spyOn has limitations) | See Vitest browser docs |

### Partial Module Mock

```ts
vi.mock('./some-path.js', async (importOriginal) => {
  const mod = await importOriginal<typeof import('./some-path.js')>()
  return {
    ...mod,
    mockedExport: vi.fn(),
  }
})
```

## In-Source Testing

### Layout Options

| Layout | Path | Use Case |
| ------ | ---- | -------- |
| Colocated | `src/utils/__tests__/format.test.ts` | Unit tests next to source |
| Suffix | `src/utils/format.test.ts` | Same directory, suffix |
| Separate | `tests/unit/utils/format.test.ts` | Centralized test dir |

### Config for In-Source

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
  },
})
```

## Concurrent Tests

Run tests in parallel within a file:

```ts
it.concurrent('test 1', async () => { /* ... */ })
it.concurrent('test 2', async () => { /* ... */ })

// Or with test.each
it.concurrent.each([
  [1, 2, 3],
  [4, 5, 9],
])('adds %i + %i = %i', async (a, b, expected) => {
  expect(a + b).toBe(expected)
})
```

**Caveats:** Avoid shared mutable state; each concurrent test should be independent.

## Workspace Testing (Monorepos)

Use `vitest.workspace.ts` to define multiple projects:

```ts
// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/*',
  'apps/*',
])
```

Each workspace entry can have its own `vitest.config.ts` or `vite.config.ts` with a `test` block.

## Parameterized Tests (test.each)

```ts
test.each([
  { a: 1, b: 2, expected: 3 },
  { a: 0, b: 0, expected: 0 },
])('adds $a + $b = $expected', ({ a, b, expected }) => {
  expect(a + b).toBe(expected)
})

// Array of arrays
test.each([
  [1, 2, 3],
  [4, 5, 9],
])('adds %i + %i = %i', (a, b, expected) => {
  expect(a + b).toBe(expected)
})
```

## Snapshot Testing

```ts
expect(obj).toMatchSnapshot()
expect(html).toMatchInlineSnapshot(`<div>...</div>`)
```

Use inline snapshots for small, stable outputs; file snapshots for larger structures.

## Setup and Teardown

```ts
beforeAll(() => { /* once per describe */ })
afterAll(() => { /* once per describe */ })
beforeEach(() => { /* before each it */ })
afterEach(() => { /* after each it */ })
```

Reset mocks in `beforeEach` to avoid cross-test pollution:

```ts
beforeEach(() => {
  vi.clearAllMocks()
  // or vi.restoreAllMocks() to restore original implementations
})
```
