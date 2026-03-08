# WebdriverIO Configuration

## wdio.conf.ts

```typescript
import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
  runner: 'local',
  path: '/',
  port: 4723,

  specs: ['./test/specs/**/*.ts'],
  exclude: [],

  maxInstances: 5,
  capabilities: [
    {
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: ['--headless', '--disable-gpu', '--no-sandbox'],
      },
    },
  ],

  logLevel: 'info',
  bail: 0,
  baseUrl: 'https://example.com',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: 'mocha',
  mochaOpts: {
    ui: 'bdd',
    timeout: 60000,
  },

  reporters: [
    'spec',
    ['allure', { outputDir: 'allure-results' }],
  ],

  services: ['chromedriver'],

  before: async function () {
    // Global setup
  },
  after: async function () {
    // Global teardown
  },
  beforeTest: async function (test) {
    // Per-test setup
  },
  afterTest: async function (test, context, result) {
    // Per-test teardown
  },
};
```

---

## Capabilities

### Multi-Browser

```typescript
capabilities: [
  { browserName: 'chrome' },
  { browserName: 'firefox' },
  { browserName: 'safari' },
  { browserName: 'MicrosoftEdge' },
],
```

### Chrome Options

```typescript
capabilities: [{
  browserName: 'chrome',
  'goog:chromeOptions': {
    args: ['--headless', '--disable-gpu', '--window-size=1920,1080'],
    prefs: { 'intl.accept_languages': 'en-US' },
  },
}],
```

### Firefox Options

```typescript
capabilities: [{
  browserName: 'firefox',
  'moz:firefoxOptions': {
    args: ['-headless'],
    prefs: { 'dom.ipc.processCount': 8 },
  },
}],
```

### Mobile Web (Appium)

```typescript
capabilities: [{
  platformName: 'Android',
  'appium:deviceName': 'emulator-5554',
  'appium:automationName': 'UiAutomator2',
  browserName: 'Chrome',
}],
```

---

## Services

### chromedriver

```typescript
services: ['chromedriver'],
```

### Appium Service

```typescript
services: [
  ['appium', {
    args: { address: 'localhost', port: 4723 },
    logPath: './logs/',
  }],
],
```

### Selenium Standalone

```typescript
services: ['selenium-standalone'],
```

---

## Framework Options

### Mocha

```typescript
framework: 'mocha',
mochaOpts: {
  ui: 'bdd',
  timeout: 60000,
},
```

### Jasmine

```typescript
framework: 'jasmine',
jasmineOpts: {
  defaultTimeoutInterval: 60000,
  expectationResultHandler: (passed, assertion) => {},
},
```

### Cucumber

```typescript
framework: 'cucumber',
cucumberOpts: {
  require: ['./test/step-definitions/**/*.ts'],
  timeout: 60000,
},
```

---

## Reporters

| Reporter | Purpose |
|----------|---------|
| `spec` | Console output with pass/fail |
| `dot` | Minimal dots for progress |
| `allure` | Allure report (requires @wdio/allure-reporter) |
| `junit` | JUnit XML for CI |
| `json` | JSON output |
| `html` | HTML report (requires @wdio/html-reporter) |

```typescript
reporters: [
  'spec',
  ['allure', { outputDir: 'allure-results', disableWebdriverStepsReporting: true }],
  ['junit', { outputDir: './reports/junit' }],
],
```

---

## Key Options

| Option | Description | Default |
|--------|-------------|---------|
| `baseUrl` | Base URL for relative `browser.url()` | — |
| `waitforTimeout` | Default wait timeout (ms) | 10000 |
| `connectionRetryTimeout` | Selenium connection timeout | 120000 |
| `connectionRetryCount` | Connection retries | 3 |
| `maxInstances` | Max parallel instances | 5 |
| `bail` | Stop on first failure (0 = never) | 0 |
| `logLevel` | trace, debug, info, warn, error | info |

---

## TypeScript Support

```typescript
// tsconfig.json
{
  "compilerOptions": {
    "types": ["node", "@wdio/globals/types", "@wdio/mocha-framework"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true
  },
  "include": ["test/**/*.ts", "wdio.conf.ts"]
}
```

---

## Environment-Specific Config

```typescript
const env = process.env.TEST_ENV || 'local';
const configs = {
  local: { baseUrl: 'http://localhost:3000' },
  staging: { baseUrl: 'https://staging.example.com' },
  prod: { baseUrl: 'https://example.com' },
};

export const config: Options.Testrunner = {
  ...baseConfig,
  ...configs[env],
};
```
