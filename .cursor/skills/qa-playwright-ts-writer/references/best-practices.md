# Playwright Best Practices

Guidelines for maintainable, stable Playwright tests.

## Page Object Model (POM)

### Structure

```
pages/
  BasePage.ts      # Shared navigation, common helpers
  LoginPage.ts     # Login-specific locators and methods
  DashboardPage.ts # Dashboard-specific
components/
  Header.ts       # Reusable header component
  Modal.ts        # Reusable modal
```

### Base Page

```typescript
// pages/BasePage.ts
import { Page } from '@playwright/test';

export class BasePage {
  constructor(protected page: Page, protected baseURL: string) {}

  async goto(path: string) {
    await this.page.goto(`${this.baseURL}${path}`);
  }

  getByTestId(id: string) {
    return this.page.getByTestId(id);
  }
}
```

### Page-Specific Class

```typescript
// pages/LoginPage.ts
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page, baseURL: string) {
    super(page, baseURL);
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email').fill(email);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }

  get errorMessage() {
    return this.page.getByRole('alert');
  }
}
```

### Usage in Tests

```typescript
test('login flow', async ({ page }) => {
  const loginPage = new LoginPage(page, baseURL);
  await loginPage.goto('/login');
  await loginPage.login('user@example.com', 'secret');
  await expect(loginPage.errorMessage).not.toBeVisible();
});
```

## Locator Strategies

### Priority Order

1. **getByRole** — Best for accessibility; resilient to DOM changes
2. **getByTestId** — Explicit, stable; requires adding data-testid
3. **getByText** — For unique visible text
4. **getByLabel** — For form inputs with labels
5. **CSS selector** — Last resort; brittle

### Examples

```typescript
// Prefer
page.getByRole('button', { name: 'Submit' })
page.getByTestId('submit-btn')
page.getByLabel('Email address')
page.getByText('Welcome back')

// Avoid when possible
page.locator('.btn-primary')
page.locator('#submit')
page.locator('div > span:nth-child(2)')
```

## Avoiding Flakiness

| Practice | Description |
|----------|-------------|
| **Auto-wait** | Playwright auto-waits; avoid `page.waitForTimeout` |
| **Assert before act** | Use `expect` to wait for readiness before clicking |
| **Stable selectors** | Prefer role/testid over CSS |
| **Isolation** | Each test gets fresh context; no shared state |
| **Deterministic data** | Use fixtures, mocks; avoid time-dependent data |
| **No fixed delays** | Use `expect` with timeout or `waitFor` instead of `setTimeout` |

### Anti-Patterns

```typescript
// BAD: Fixed delay
await page.waitForTimeout(3000);

// GOOD: Wait for element
await expect(page.getByRole('heading')).toBeVisible();

// BAD: Brittle CSS
await page.locator('div.container > div:nth-child(2) button').click();

// GOOD: Role or testid
await page.getByRole('button', { name: 'Save' }).click();
```

## Test Isolation

- Each test runs in a new browser context (default)
- No shared cookies, localStorage, or session
- Use `storageState` for auth when needed; create fresh per test or reuse via project
- Clean up test data in `afterEach` if tests create DB records

## Parallel Execution

- `fullyParallel: true` — Run tests in parallel (default for many projects)
- `workers` — Number of parallel workers; reduce in CI if flaky
- Avoid shared resources (files, DB rows) that can conflict

## Debugging

| Tool | Use |
|------|-----|
| `--debug` | Pause and step through |
| `--headed` | Run with visible browser |
| `page.pause()` | Breakpoint in code |
| Trace viewer | `npx playwright show-trace trace.zip` |
| Screenshot on failure | `screenshot: 'only-on-failure'` |
| Video on failure | `video: 'retain-on-failure'` |

## Fixtures and test.extend

```typescript
import { test as base } from '@playwright/test';

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    // Login logic
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('secret');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL(/dashboard/);
    await use(page);
  },
});

test('authenticated flow', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/settings');
  // ...
});
```

## test.step for Grouping

```typescript
test('checkout flow', async ({ page }) => {
  await test.step('add item to cart', async () => {
    await page.goto('/products/1');
    await page.getByRole('button', { name: 'Add to cart' }).click();
  });
  await test.step('proceed to checkout', async () => {
    await page.getByRole('link', { name: 'Cart' }).click();
    await page.getByRole('button', { name: 'Checkout' }).click();
  });
  await test.step('complete payment', async () => {
    await page.getByLabel('Card number').fill('4111111111111111');
    await page.getByRole('button', { name: 'Pay' }).click();
  });
});
```

Steps appear in traces and reports for easier debugging.
