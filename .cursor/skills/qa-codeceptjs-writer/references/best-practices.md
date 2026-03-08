# CodeceptJS Best Practices

Guidelines for maintainable, readable CodeceptJS scenarios.

## Readable Scenarios

### Use Human-Readable Steps

Prefer semantic, visible keywords over raw selectors:

```typescript
// GOOD: Readable, intent-focused
Scenario('user logs in', ({ I }) => {
  I.amOnPage('/login');
  I.fillField('Username', 'john');
  I.fillField('Password', 'secret');
  I.click('Sign In');
  I.see('Welcome');
});

// AVOID: Overly technical
Scenario('user logs in', ({ I }) => {
  I.amOnPage('/login');
  I.fillField('#username', 'john');
  I.fillField('input[type="password"]', 'secret');
  I.click('.btn-primary');
  I.seeElement('.welcome-msg');
});
```

### Leverage Locator Resolution

CodeceptJS resolves locators by label, link text, button text, then CSS/XPath. Use that:

```typescript
// Prefer label/button text when unique
I.fillField('Email address', 'user@example.com');
I.click('Submit');

// Use data-test or data-qa with customLocator plugin for stability
I.click({ custom: 'submit-btn' });
```

## Step Granularity

### One Logical Action Per Step

```typescript
// GOOD: Clear, debuggable steps
Scenario('checkout flow', ({ I }) => {
  I.amOnPage('/cart');
  I.click('Proceed to checkout');
  I.fillField('Card number', '4111111111111111');
  I.fillField('Expiry', '12/25');
  I.click('Pay');
  I.see('Order confirmed');
});

// AVOID: One giant step
Scenario('checkout flow', ({ I }) => {
  I.amOnPage('/cart');
  I.click('Proceed to checkout');
  I.fillField('Card number', '4111111111111111');
  I.fillField('Expiry', '12/25');
  I.click('Pay');
  I.see('Order confirmed');
  // All in one — hard to debug which step failed
});
```

### Use Page Objects for Complex Flows

```typescript
// Extract repeated flows to Page Objects
const { I, checkoutPage } = inject();

Scenario('checkout', () => {
  checkoutPage.addItem('Product A');
  checkoutPage.proceedToPayment();
  checkoutPage.payWithCard('4111111111111111', '12/25');
  I.see('Order confirmed');
});
```

## Helper Selection

| Helper | When to Use |
|--------|-------------|
| **Playwright** | Modern apps, multi-browser, trace/video, auto-wait |
| **WebDriver** | Selenium grid, cloud providers, legacy browsers |
| **Puppeteer** | Chrome-only, lightweight, fast |

Choose based on project constraints (browser support, CI, existing stack).

## BDD Best Practices

### Keep Feature Files Business-Focused

```gherkin
# GOOD: Business language
Feature: Checkout
  As a customer I want to checkout my cart

  Scenario: apply discount
    Given I have products totaling $50 in my cart
    When I apply coupon "SAVE10"
    Then my total should be $45
```

```gherkin
# AVOID: Technical implementation details
Feature: Checkout
  Scenario: apply discount
    Given I am on /cart
    And I click .coupon-input
    And I type SAVE10
```

### Use Background for Common Setup

```gherkin
Feature: Dashboard

  Background:
    Given I am logged in as administrator

  Scenario: view reports
    When I open reports page
    Then I should see sales report
```

### Use Scenario Outline for Data Variations

```gherkin
  Scenario Outline: login with role
    Given I am on login page
    When I login as "<user>" with "<password>"
    Then I should see "<welcome>" message
    Examples:
      | user   | password | welcome   |
      | admin  | admin123 | Admin     |
      | user   | user123  | User      |
```

## Data-Driven vs Gherkin

| Approach | Use When |
|----------|----------|
| **Data().Scenario** | Same flow, different data; technical tests |
| **Scenario Outline** | BDD; business examples; readable to stakeholders |

## Stability and Flakiness

| Practice | Description |
|----------|-------------|
| **Stable selectors** | Prefer label, `data-test`, `data-qa` over CSS |
| **Avoid I.wait(ms)** | Use `I.waitForVisible`, `I.waitForElement` when needed |
| **Isolation** | Each scenario independent; use `restart: 'context'` |
| **No shared state** | Don't rely on order; use Background/login for setup |

## Custom Helpers for Reuse

Extract cross-cutting logic:

```typescript
// helpers/DbHelper.ts
async haveUser(email: string) {
  // Create user in DB
  return { id, email };
}

// In test
const { I, DbHelper } = inject();
Scenario('test', async () => {
  const user = await DbHelper.haveUser('test@example.com');
  I.amOnPage(`/user/${user.id}`);
});
```

## Debugging

| Tool | Use |
|------|-----|
| `pause()` | Interactive console; inspect state, run I.* commands |
| `--steps` | Step-by-step output in console |
| `--debug` | Debug mode with detailed output |
| `screenshotOnFail` | Auto-screenshot on failure |

## File Organization

```
tests/
  login_test.ts
  checkout_test.ts
features/
  login.feature
  checkout.feature
step_definitions/
  steps.ts
  checkout_steps.ts
pages/
  LoginPage.ts
  CheckoutPage.ts
helpers/
  MyHelper.ts
output/           # Screenshots, videos, traces
```
