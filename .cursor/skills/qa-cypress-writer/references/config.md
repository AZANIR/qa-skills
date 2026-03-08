# Cypress Configuration

## cypress.config.ts

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://app.example.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{ts,tsx}',
  },
});
```

---

## Key Options

| Option | Description | Example |
|--------|-------------|---------|
| `baseUrl` | Base URL for `cy.visit()` | `'https://staging.example.com'` |
| `viewportWidth` / `viewportHeight` | Default viewport size | `1280`, `720` |
| `video` | Record video of runs | `true` / `false` |
| `screenshotOnRunFailure` | Capture screenshot on failure | `true` |
| `retries` | Retry failed tests (runMode for CI, openMode for UI) | `{ runMode: 2, openMode: 0 }` |
| `defaultCommandTimeout` | Timeout for commands (ms) | `4000` |
| `pageLoadTimeout` | Timeout for page load (ms) | `60000` |
| `requestTimeout` | Timeout for `cy.request()` (ms) | `5000` |

---

## Environment Variables

### In cypress.config.ts

```typescript
export default defineConfig({
  env: {
    apiUrl: 'https://api.example.com',
    testUser: 'qa@example.com',
  },
});
```

### Usage in Tests

```typescript
cy.log(Cypress.env('apiUrl'));
cy.request(Cypress.env('apiUrl') + '/health');
```

### Override via CLI

```bash
cypress run --env apiUrl=https://staging-api.example.com
```

---

## Plugins (setupNodeEvents)

```typescript
setupNodeEvents(on, config) {
  on('task', {
    log(message) {
      console.log(message);
      return null;
    },
  });
  return config;
}
```

---

## Support Files

| File | Purpose |
|------|---------|
| `cypress/support/e2e.ts` | Runs before every E2E spec (imports, global config) |
| `cypress/support/commands.ts` | Custom commands |
| `cypress/support/component.ts` | Runs before component specs |

### e2e.ts Example

```typescript
import './commands';

beforeEach(() => {
  cy.intercept('GET', '/api/config', { fixture: 'config.json' });
});
```

---

## Component Testing Dev Server

| Framework | Config |
|-----------|--------|
| React + Vite | `framework: 'react', bundler: 'vite'` |
| Vue + Vite | `framework: 'vue', bundler: 'vite'` |
| Angular | `framework: 'angular', bundler: '@angular-devkit/build-angular'` |
| Svelte | `framework: 'svelte', bundler: 'vite'` |
