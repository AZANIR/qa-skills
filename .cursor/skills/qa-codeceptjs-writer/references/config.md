# CodeceptJS Configuration Guide

Configuration for `codecept.conf.ts` (or `.js`) and related setup.

## Basic Structure

```typescript
// codecept.conf.ts
import { Config } from 'codeceptjs';

const config: Config = {
  tests: './tests/**/*_test.ts',
  output: './output',
  helpers: {
    Playwright: {
      url: 'http://localhost:3000',
      show: false,
      browser: 'chromium',
    },
  },
  include: {
    I: './steps_file.ts',
    loginPage: './pages/LoginPage.ts',
  },
  mocha: {},
  bootstrap: null,
  timeout: null,
  teardown: null,
  hooks: [],
  gherkin: {
    features: './features/**/*.feature',
    steps: ['./step_definitions/steps.ts'],
  },
  plugins: {
    screenshotOnFail: {
      enabled: true,
    },
  },
  stepTimeout: 0,
  stepTimeoutOverride: [
    {
      pattern: 'wait.*',
      timeout: 0,
    },
  ],
  name: 'my-app',
};

export = config;
```

## Helpers

### Playwright Helper

```typescript
helpers: {
  Playwright: {
    url: 'http://localhost:3000',
    show: false,
    browser: 'chromium', // or 'firefox', 'webkit'
    restart: 'context',  // 'context' | 'session' | 'browser'
    waitForNavigation: 'load',
    waitForAction: 100,
    timeout: 10000,
    video: false,
    trace: false,
    keepVideoForPassedTests: false,
    recordHar: false,
    storageState: 'auth.json', // Reuse auth state
  },
},
```

| Option | Description | Values |
|--------|-------------|--------|
| `url` | Base URL | `'http://localhost:3000'` |
| `browser` | Browser to use | `'chromium'`, `'firefox'`, `'webkit'` |
| `restart` | Restart strategy | `'context'`, `'session'`, `'browser'` |
| `video` | Record failed tests | `true` / `false` |
| `trace` | Enable trace recording | `true` / `false` |
| `storageState` | Auth state file | Path to JSON file |

### WebDriver Helper

```typescript
helpers: {
  WebDriver: {
    url: 'http://localhost:3000',
    browser: 'chrome',
    host: 'localhost',
    port: 4444,
    restart: true,
    smartWait: 5000,
    waitForTimeout: 10000,
    desiredCapabilities: {},
  },
},
```

### Puppeteer Helper

```typescript
helpers: {
  Puppeteer: {
    url: 'http://localhost:3000',
    show: false,
    restart: true,
    waitForNavigation: 'networkidle0',
    waitForAction: 100,
    chrome: {
      args: ['--no-sandbox'],
    },
  },
},
```

## Include (Page Objects and Steps)

```typescript
include: {
  I: './steps_file.ts',
  loginPage: './pages/LoginPage.ts',
  dashboardPage: './pages/DashboardPage.ts',
},
```

- `I` — Custom steps file extending `I` object
- Other keys — Page Objects or custom objects injected via `inject()`

## Gherkin Configuration

```typescript
gherkin: {
  features: './features/**/*.feature',
  steps: [
    './step_definitions/steps.ts',
    './step_definitions/checkout_steps.ts',
  ],
  avoidDuplicateSteps: true,
},
```

## Plugins

### Built-in Plugins

```typescript
plugins: {
  screenshotOnFail: {
    enabled: true,
    uniqueScreenshotNames: true,
  },
  retryFailedStep: {
    enabled: true,
    retries: 3,
  },
  tryTo: {
    enabled: true,
  },
  retryTo: {
    enabled: true,
    retries: 3,
  },
  stepByStepReport: {
    enabled: true,
    output: './output',
  },
  autoLogin: {
    enabled: true,
    inject: 'login',
    users: {
      admin: {
        login: (I) => {
          I.amOnPage('/login');
          I.fillField('Username', 'admin');
          I.fillField('Password', 'admin123');
          I.click('Sign In');
        },
        check: (I) => {
          I.see('Dashboard');
        },
      },
    },
  },
},
```

### autoLogin Plugin

Eliminates repeated login steps in scenarios:

```typescript
// Enable in plugins
autoLogin: {
  enabled: true,
  inject: 'login',
  users: {
    admin: {
      login: (I) => {
        I.amOnPage('/login');
        I.fillField('Username', 'admin');
        I.fillField('Password', 'admin123');
        I.click('Sign In');
      },
      check: (I) => {
        I.see('Dashboard');
      },
    },
  },
},

// In test
Scenario('admin flow', ({ I, login }) => {
  login('admin');
  I.amOnPage('/settings');
  I.see('Settings');
});
```

## Output and Reports

| Option | Description |
|--------|-------------|
| `output` | Directory for screenshots, videos, traces |
| `stepByStepReport` | Human-readable step output |
| `mocha.reporter` | Mocha reporter (e.g., `'spec'`) |

## Test Discovery

| Option | Description | Example |
|--------|-------------|---------|
| `tests` | Glob for test files | `'./tests/**/*_test.ts'` |
| `gherkin.features` | Glob for feature files | `'./features/**/*.feature'` |

## Bootstrap and Teardown

```typescript
bootstrap: './bootstrap.ts',
teardown: './teardown.ts',
```

## CLI Options

| Command | Description |
|---------|-------------|
| `npx codeceptjs run` | Run all tests |
| `npx codeceptjs run --steps` | Show step-by-step output |
| `npx codeceptjs run --debug` | Debug mode |
| `npx codeceptjs run --features` | Run only feature files |
| `npx codeceptjs run --tests` | Run only JS/TS tests |
| `npx codeceptjs run --grep "login"` | Run tests matching pattern |
| `npx codeceptjs gherkin:init` | Initialize Gherkin |
| `npx codeceptjs gherkin:snippets` | Generate step definition stubs |
| `npx codeceptjs gherkin:steps` | List defined steps |
