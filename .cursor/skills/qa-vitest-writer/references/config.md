# Vitest Configuration

## Basic vitest.config.ts

```ts
import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
  },
})
```

## Vite Config Integration

When using Vite for the app, add a `test` block to `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
```

## Environment

| Value | Use Case |
| ----- | -------- |
| `node` | Node.js APIs, backend, CLI |
| `jsdom` | DOM APIs, React, Vue (browser-like) |
| `happy-dom` | Lighter DOM alternative |
| `edge-runtime` | Edge workers |
| Custom | Path to custom env file |

## Coverage

### v8 (recommended)

```ts
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts'],
    },
  },
})
```

Install: `npm i -D @vitest/coverage-v8`

### Istanbul

```ts
coverage: {
  provider: 'istanbul',
  reporter: ['text', 'lcov', 'html'],
}
```

Install: `npm i -D @vitest/coverage-istanbul`

## Workspace (Monorepo)

```ts
// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/core',
  'packages/utils',
  'apps/web',
])
```

Each workspace project can define its own `vitest.config.ts` or `vite.config.ts`.

## Setup Files

Run code before all tests:

```ts
test: {
  setupFiles: ['./tests/setup.ts'],
  globalSetup: './tests/globalSetup.ts',
}
```

- `setupFiles`: Runs in each test environment (e.g., per worker)
- `globalSetup`: Runs once before all tests

## Plugins

Common plugins:

- `vite-tsconfig-paths` — Resolve `@/` and tsconfig paths
- `@vitest/coverage-v8` — Coverage
- `@vitest/ui` — Browser UI for test runs

## Common Options

| Option | Description |
| ------ | ----------- |
| `globals` | Expose `describe`, `it`, `expect`, `vi` globally |
| `unstubEnvs` | Reset `vi.stubEnv` between tests |
| `unstubGlobals` | Reset `vi.stubGlobal` between tests |
| `pool` | `threads` (default) or `forks` |
| `poolMatchGlobs` | Limit which files run in which pool |
| `testTimeout` | Default timeout per test (ms) |
| `hookTimeout` | Timeout for before/after hooks (ms) |
