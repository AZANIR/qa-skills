# Playwright Configuration Guide

Configuration for `playwright.config.ts` and related setup.

## Basic Structure

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
```

## Projects Matrix

| Option | Description | Example |
|--------|-------------|---------|
| Multiple browsers | Run same tests on Chromium, Firefox, WebKit | `projects: [{ use: devices['Desktop Chrome'] }, ...]` |
| Mobile emulation | iPhone, Pixel | `devices['iPhone 13']` |
| Custom project | Named project with overrides | `{ name: 'auth', use: { storageState: 'auth.json' } }` |
| Dependencies | Run project B after A | `{ name: 'setup', testMatch: /global-setup/ }, { name: 'e2e', dependencies: ['setup'] }` |

```typescript
projects: [
  { name: 'setup', testMatch: /.*\.setup\.ts/ },
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
    dependencies: ['setup'],
  },
  {
    name: 'mobile',
    use: { ...devices['iPhone 13'] },
    dependencies: ['setup'],
  },
],
```

## Reporter Options

| Reporter | Output | Use Case |
|----------|--------|----------|
| `list` | Console | Default, readable |
| `html` | HTML report | `npx playwright show-report` |
| `json` | JSON file | CI integration |
| `junit` | JUnit XML | Jenkins, Azure DevOps |
| `github` | GitHub Actions annotations | CI |
| Multiple | Array | `reporter: [['html'], ['junit', { outputFile: 'results.xml' }]]` |

## Retry Strategies

| Option | Description | Example |
|--------|-------------|---------|
| `retries` | Number of retries on failure | `retries: 2` |
| `retries` in CI | Often 2 in CI, 0 locally | `retries: process.env.CI ? 2 : 0` |
| Per-test | `test.describe.configure({ retries: 1 })` | For flaky tests only |

## Test Directory

| Option | Description | Example |
|--------|-------------|---------|
| `testDir` | Root for tests | `testDir: './e2e'` |
| `testMatch` | Glob pattern | `testMatch: '**/*.spec.ts'` |
| `testIgnore` | Exclude | `testIgnore: '**/node_modules/**'` |

## Global Setup/Teardown

| File | Purpose |
|------|---------|
| `global-setup.ts` | Run once before all tests (auth, DB seed) |
| `global-teardown.ts` | Run once after all tests (cleanup) |

```typescript
// playwright.config.ts
export default defineConfig({
  globalSetup: require.resolve('./global-setup'),
  globalTeardown: require.resolve('./global-teardown'),
});
```

```typescript
// global-setup.ts
async function globalSetup() {
  // Login and save auth state
  const request = await request.newContext();
  await request.post('/api/login', { data: { email, password } });
  await request.storageState({ path: 'auth.json' });
}
```

## Authentication State

| Option | Description | Example |
|--------|-------------|---------|
| `storageState` | Reuse cookies/localStorage | `use: { storageState: 'auth.json' }` |
| Per-project | Auth only for some projects | `projects: [{ name: 'authenticated', use: { storageState: 'auth.json' } }]` |
| In test | `context.addCookies()` for dynamic auth | For test-specific auth |

## Use Options

| Option | Description | Values |
|--------|-------------|--------|
| `baseURL` | Prepend to relative URLs | `'http://localhost:3000'` |
| `trace` | When to capture trace | `'on-first-retry'`, `'on'`, `'off'` |
| `screenshot` | When to capture | `'on'`, `'off'`, `'only-on-failure'` |
| `video` | When to record | `'on'`, `'off'`, `'retain-on-failure'`, `'on-first-retry'` |
| `actionTimeout` | Default action timeout | `15000` |
| `navigationTimeout` | Page load timeout | `30000` |
| `expect` | Assertion timeout | `{ timeout: 5000 }` |

## Component Testing Config

For `@playwright/experimental-ct-react` (and ct-vue, ct-svelte):

```typescript
// playwright-ct.config.ts
import { defineConfig } from '@playwright/experimental-ct-react';

export default defineConfig({
  testDir: './components',
  use: {
    ctViteConfig: {
      // Vite config for component tests
    },
  },
});
```
