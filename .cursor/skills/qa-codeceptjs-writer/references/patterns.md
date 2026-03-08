# CodeceptJS Test Patterns

Common patterns for scenario-driven E2E testing with CodeceptJS.

## Scenario Syntax

### Feature and Scenario Blocks

```typescript
Feature('Login');

Scenario('user can log in with valid credentials', ({ I }) => {
  I.amOnPage('/login');
  I.fillField('Username', 'john');
  I.fillField('Password', 'secret');
  I.click('Sign In');
  I.see('Welcome');
});
```

### Common I Actions

| Action | Example |
|--------|---------|
| Navigate | `I.amOnPage('/')` or `I.amOnPage('https://example.com')` |
| Click | `I.click('Submit')` or `I.click('.btn-primary')` |
| Fill field | `I.fillField('Username', 'john')` or `I.fillField('#email', 'a@b.com')` |
| See text | `I.see('Welcome')` or `I.see('Dashboard', 'h1')` |
| See element | `I.seeElement('.user-menu')` |
| Grab text | `const text = await I.grabTextFrom('.title')` |
| Select option | `I.selectOption('Country', 'US')` |
| Check checkbox | `I.checkOption('Subscribe')` |
| Wait | `I.wait(2)` or `I.waitForVisible('.loaded')` |

### Locator Strategies

CodeceptJS resolves locators in order: ID, CSS, XPath, name attribute, label text, link/button text.

```typescript
// By text (link/button)
I.click('Login');
I.click('Submit');

// By label (for fillField)
I.fillField('Email', 'user@example.com');

// By CSS
I.click('.submit-btn');
I.seeElement('#header');

// By XPath
I.click('//button[contains(., "Save")]');

// Strict locators (explicit type)
I.seeElement({ css: 'div.user' });
I.click({ xpath: '//button[@type="submit"]' });
```

## within() for Scoped Locators

Scope actions to a specific container:

```typescript
Scenario('interact within modal', ({ I }) => {
  I.amOnPage('/');
  I.click('Open modal');
  within('.modal', () => {
    I.fillField('Name', 'Test');
    I.click('Save');
  });
  I.see('Saved');
});
```

## BDD with Gherkin

### Feature File (.feature)

```gherkin
Feature: Checkout
  In order to buy products
  As a customer
  I need to be able to checkout the selected products

  Scenario: order several products
    Given I have product with $600 price in my cart
    And I have product with $1000 price in my cart
    When I go to checkout process
    Then I should see that total number of products is 2
    And my order amount is $1600
```

### Step Definitions

```typescript
// step_definitions/checkout_steps.ts
const { I, productPage } = inject();

Given(/I have product with \$(\d+) price in my cart/, async (price) => {
  I.amOnPage('/products');
  await productPage.addProduct({ price: parseInt(price) });
  I.click('Add to cart');
});

When('I go to checkout process', () => {
  I.click('Checkout');
});

Then('I should see that total number of products is {int}', (num) => {
  I.see(num.toString(), '.cart-count');
});

Then('my order amount is {int}', (sum) => {
  I.see(`$${sum}`, '.order-total');
});
```

### Background and Scenario Outline

```gherkin
Feature: Dashboard

  Background:
    Given I am logged in as administrator
    And I open dashboard page

  Scenario Outline: view report for role
    When I select role "<role>"
    Then I should see "<report>" report
    Examples:
      | role   | report    |
      | admin  | Full      |
      | user   | Limited   |
```

## Page Objects

### Define Page Object

```typescript
// pages/LoginPage.ts
export default class LoginPage {
  constructor(private I: CodeceptJS.I) {}

  async login(email: string, password: string) {
    this.I.fillField('Email', email);
    this.I.fillField('Password', password);
    this.I.click('Sign In');
  }

  async open() {
    this.I.amOnPage('/login');
  }

  get errorMessage() {
    return '.alert-error';
  }
}
```

### Use in Tests (inject)

```typescript
// login_test.ts
const { I, loginPage } = inject();

Scenario('login flow', () => {
  loginPage.open();
  loginPage.login('user@example.com', 'secret');
  I.see('Dashboard');
});
```

### Use in Step Definitions

```typescript
const { I, loginPage } = inject();

Given('I am logged in', () => {
  loginPage.open();
  loginPage.login('admin@example.com', 'admin123');
});
```

## Data-Driven Testing

### Data().Scenario

```typescript
const accounts = new DataTable(['login', 'password']);
accounts.add(['davert', '123456']);
accounts.add(['admin', 'admin123']);

Data(accounts).Scenario('Test Login', ({ I, current }) => {
  I.amOnPage('/login');
  I.fillField('Username', current.login);
  I.fillField('Password', current.password);
  I.click('Sign In');
  I.see('Welcome ' + current.login);
});
```

### Data from Array or Generator

```typescript
Data(['chrome', 'firefox']).Scenario('cross-browser', ({ I, current }) => {
  I.amOnPage('/');
  I.see('Home');
});
```

## Custom Helpers

### Define Custom Helper

```typescript
// helpers/MyHelper.ts
import { Helper } from 'codeceptjs';

class MyHelper extends Helper {
  async loginAs(user: string) {
    const { I } = this.helpers;
    await I.amOnPage('/login');
    await I.fillField('Username', user);
    await I.fillField('Password', 'secret');
    await I.click('Sign In');
  }
}

export = MyHelper;
```

### Use Custom Helper

```typescript
// In codecept.conf.ts
helpers: {
  Playwright: { ... },
  MyHelper: {}
}

// In test
const { I, MyHelper } = inject();
Scenario('test', async () => {
  await MyHelper.loginAs('admin');
  I.see('Dashboard');
});
```

## pause() for Debugging

```typescript
Scenario('debug flow', ({ I }) => {
  I.amOnPage('/');
  I.fillField('Search', 'test');
  pause(); // Enters interactive console; inspect state, run I.* commands
});
```

## Forms and Validation

```typescript
Scenario('submit registration form', ({ I }) => {
  I.amOnPage('/register');
  I.fillField('Email', 'new@example.com');
  I.fillField('Password', 'SecurePass123');
  I.checkOption('Terms');
  I.selectOption('Country', 'United States');
  I.click('Create account');
  I.see('Welcome');
});
```

## Async and Promises

```typescript
Scenario('grab and assert', async ({ I }) => {
  I.amOnPage('/dashboard');
  const count = await I.grabTextFrom('.item-count');
  const num = parseInt(count, 10);
  if (num > 0) {
    I.seeElement('.items-list');
  }
});
```
