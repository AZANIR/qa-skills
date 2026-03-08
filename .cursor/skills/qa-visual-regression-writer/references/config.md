# Visual Regression Configuration

Configuration for Playwright screenshots, Percy, and BackstopJS.

## Playwright Screenshot Configuration

### playwright.config.ts

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './visual',
  snapshotDir: './visual/snapshots',
  snapshotPathTemplate: '{testDir}/{testFileDir}/__snapshots__/{arg}-{projectName}{ext}',
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: 100,
      maxDiffPixelRatio: 0.01,
    },
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
});
```

### Snapshot Path Template

| Variable | Description |
|----------|-------------|
| `{testDir}` | Test directory |
| `{testFileDir}` | Directory of test file |
| `{arg}` | Screenshot name |
| `{projectName}` | Project (browser/viewport) |
| `{ext}` | `.png` |

### Update Snapshots

```bash
npx playwright test --update-snapshots
npx playwright test visual/ --update-snapshots
```

### Per-Test Override

```typescript
test('strict comparison', async ({ page }) => {
  await expect(page).toHaveScreenshot('strict.png', {
    maxDiffPixels: 0,
    maxDiffPixelRatio: 0,
  });
});
```

## Percy Configuration

### Installation

```bash
npm install @percy/cli @percy/playwright --save-dev
```

### percy.config.js

```javascript
module.exports = {
  version: 2,
  static: {
    path: 'dist',
  },
  discovery: {
    allowed-hostnames: ['localhost', '127.0.0.1'],
    disallowed-hostnames: [],
    network-idle-timeout: 750,
  },
  snapshot: {
    widths: [1280, 375],
    minHeight: 1024,
    percyCSS: '',
    enableJavaScript: true,
  },
};
```

### Playwright Integration

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  reporter: [['list'], ['html']],
});
```

```bash
percy exec -- npx playwright test
```

### Snapshot in Test

```typescript
import { test, expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test('homepage', async ({ page }) => {
  await page.goto('/');
  await percySnapshot(page, 'Homepage');
});
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `PERCY_TOKEN` | Project token (required for upload) |
| `PERCY_BRANCH` | Branch name |
| `PERCY_PARTIAL_BUILD` | For parallelized runs |

## BackstopJS Configuration

### Installation

```bash
npm install backstopjs --save-dev
npx backstop init
```

### backstop.json

```json
{
  "id": "visual_regression",
  "viewports": [
    { "label": "desktop", "width": 1920, "height": 1080 },
    { "label": "tablet", "width": 768, "height": 1024 },
    { "label": "mobile", "width": 375, "height": 667 }
  ],
  "scenarios": [
    {
      "label": "Homepage",
      "url": "http://localhost:3000/",
      "referenceUrl": "",
      "readyEvent": "",
      "readySelector": "",
      "delay": 500,
      "hideSelectors": [".timestamp", ".ad-banner"],
      "removeSelectors": [],
      "selectorExpansion": true,
      "expect": 0,
      "misMatchThreshold": 0.1
    },
    {
      "label": "Login",
      "url": "http://localhost:3000/login",
      "delay": 500,
      "misMatchThreshold": 0.1
    }
  ],
  "paths": {
    "bitmaps_reference": "backstop_data/bitmaps_reference",
    "bitmaps_test": "backstop_data/bitmaps_test",
    "engine_scripts": "backstop_data/engine_scripts",
    "html_report": "backstop_data/html_report",
    "ci_report": "backstop_data/ci_report"
  },
  "report": ["browser", "CI"],
  "engine": "playwright",
  "engineOptions": {
    "args": ["--no-sandbox"]
  }
}
```

### Scenario Options

| Option | Description |
|-------|-------------|
| `label` | Scenario name |
| `url` | Page URL |
| `delay` | Wait (ms) before capture |
| `hideSelectors` | Hide but keep layout |
| `removeSelectors` | Remove from DOM |
| `misMatchThreshold` | Tolerance (0–1) |
| `selector` | Capture specific element only |

### Commands

```bash
backstop test      # Run comparison
backstop approve   # Update reference images
backstop reference # Alias for approve
backstop openReport # Open HTML report
```

### Docker

```bash
docker run --rm -v $(pwd):/src backstopjs/backstopjs test
docker run --rm -v $(pwd):/src backstopjs/backstopjs approve
```

## Tool Comparison

| Feature | Playwright | Percy | BackstopJS |
|---------|------------|-------|------------|
| Setup | Built-in | npm + token | npm or Docker |
| Baselines | Local | Cloud | Local |
| Review UI | Diff artifacts | Web dashboard | HTML report |
| Viewports | Projects | Config | backstop.json |
| Masking | mask option | percyCSS | hideSelectors |
| CI | Native | percy exec | backstop test |
| Cost | Free | Paid (free tier) | Free |
