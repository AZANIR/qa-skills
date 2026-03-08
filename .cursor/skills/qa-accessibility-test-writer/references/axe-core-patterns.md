# axe-core Integration Patterns

Integration patterns for axe-core with Playwright, Cypress, and Jest. Use with qa-accessibility-test-writer when generating accessibility tests.

---

## Playwright + @axe-core/playwright

### Installation

```bash
npm install -D @axe-core/playwright
```

### Basic Usage

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('page has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();

  expect(results.violations).toEqual([]);
});
```

### With WCAG Tags

```typescript
test('meets WCAG 2.2 AA', async ({ page }) => {
  await page.goto('/dashboard');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

### Scoped to Selector

```typescript
test('main content is accessible', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .include('main')
    .exclude('.ad-banner')
    .analyze();

  expect(results.violations).toEqual([]);
});
```

### Disable Specific Rules

```typescript
test('page accessible excluding color-contrast', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .disableRules(['color-contrast'])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

### Shadow DOM

```typescript
test('component with shadow DOM', async ({ page }) => {
  await page.goto('/web-components');
  const results = await new AxeBuilder({ page })
    .include(['#app', ['#shadow-host', '#shadow-root']])
    .analyze();

  expect(results.violations).toEqual([]);
});
```

### Assert with toPassAxe (if available)

```typescript
import { expect } from '@playwright/test';
import { toPassAxe } from 'axe-playwright';

test.extend({ toPassAxe })('page passes axe', async ({ page, toPassAxe }) => {
  await page.goto('/');
  await expect(page).toPassAxe();
});
```

---

## Cypress + cypress-axe

### Installation

```bash
npm install -D cypress-axe axe-core
```

### Configuration (cypress/support/e2e.ts)

```typescript
import 'cypress-axe';
```

### Basic Usage

```typescript
describe('Accessibility', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('has no violations', () => {
    cy.checkA11y();
  });

  it('main content has no violations', () => {
    cy.checkA11y('main');
  });
});
```

### With WCAG Tags

```typescript
it('meets WCAG 2.2 AA', () => {
  cy.checkA11y(null, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa'],
    },
  });
});
```

### With Specific Rules

```typescript
it('checks critical rules only', () => {
  cy.checkA11y(null, {
    runOnly: {
      type: 'rule',
      values: ['color-contrast', 'label', 'button-name', 'image-alt'],
    },
  });
});
```

### Exclude Elements

```typescript
it('excludes third-party widget', () => {
  cy.checkA11y(null, {
    exclude: [['.third-party-widget']],
  });
});
```

### Custom Violation Callback

```typescript
it('logs violations', () => {
  cy.checkA11y(null, null, (violations) => {
    violations.forEach((v) => {
      cy.task('log', `${v.id}: ${v.help}`);
    });
  });
});
```

### Wait for Dynamic Content

```typescript
it('checks after content loads', () => {
  cy.get('[data-cy="dynamic-content"]').should('be.visible');
  cy.injectAxe();
  cy.checkA11y();
});
```

---

## Jest + jest-axe

### Installation

```bash
npm install -D jest-axe @testing-library/react @testing-library/dom
```

### Basic Usage (React Testing Library)

```typescript
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Button } from './Button';

expect.extend(toHaveNoViolations);

test('Button has no accessibility violations', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### With Options

```typescript
test('Button meets WCAG AA', async () => {
  const { container } = render(<Button>Click me</Button>);
  const results = await axe(container, {
    runOnly: {
      type: 'tag',
      values: ['wcag2a', 'wcag2aa'],
    },
  });
  expect(results).toHaveNoViolations();
});
```

### Scoped to Element

```typescript
test('form is accessible', async () => {
  const { container } = render(<SignupForm />);
  const form = container.querySelector('form');
  const results = await axe(form!);
  expect(results).toHaveNoViolations();
});
```

### Disable Rules

```typescript
test('component without color-contrast check', async () => {
  const { container } = render(<Chart />);
  const results = await axe(container, {
    rules: { 'color-contrast': { enabled: false } },
  });
  expect(results).toHaveNoViolations();
});
```

---

## Pa11y (CLI + Node API)

### CLI

```bash
npm install -g pa11y

pa11y https://example.com
pa11y https://example.com --standard WCAG2AA
pa11y https://example.com --include-notices --include-warnings
```

### Node API

```typescript
import pa11y from 'pa11y';

const results = await pa11y('https://example.com', {
  standard: 'WCAG2AA',
  includeWarnings: true,
  runners: ['axe'],
});

console.log(results.issues);
```

### With Puppeteer (for SPAs)

```typescript
import pa11y from 'pa11y';
import puppeteer from 'puppeteer';

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.goto('https://example.com', { waitUntil: 'networkidle0' });

const results = await pa11y(await page.content(), {
  standard: 'WCAG2AA',
  page,
});

await browser.close();
```

---

## Lighthouse (Chrome DevTools Protocol)

### Playwright Integration

```typescript
import { test } from '@playwright/test';
import { playAudit } from 'playwright-lighthouse';

test('Lighthouse accessibility score', async ({ page }) => {
  await page.goto('/');
  await playAudit({
    page,
    thresholds: {
      performance: 80,
      accessibility: 90,
      'best-practices': 80,
      seo: 80,
    },
    port: 9222,
  });
});
```

### Lighthouse CLI

```bash
npx lighthouse https://example.com --only-categories=accessibility --output=json
```

---

## Rule Tags Reference

| Tag | Description |
|-----|-------------|
| `wcag2a` | WCAG 2.2 Level A |
| `wcag2aa` | WCAG 2.2 Level AA |
| `wcag2aaa` | WCAG 2.2 Level AAA |
| `best-practice` | Best practice recommendations |
| `ACT` | W3C ACT rules |
| `section508` | Section 508 |

---

## References

- [axe-core GitHub](https://github.com/dequelabs/axe-core)
- [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
- [cypress-axe](https://github.com/component-driven/cypress-axe)
- [jest-axe](https://github.com/nickcolley/jest-axe)
- [Pa11y](https://pa11y.org/)
