# WebdriverIO Patterns

## Selectors

### $() and $$() Element Queries

```typescript
// Single element — returns Element
const submitBtn = await $('button[type="submit"]');
await submitBtn.click();

// Multiple elements — returns ElementArray
const items = await $$('.list-item');
expect(items).toHaveLength(5);
await items[0].click();
```

### Selector Strategies

| Strategy | Syntax | Use Case |
|----------|--------|----------|
| CSS | `$('button.primary')` | Simple, stable selectors |
| XPath | `$('//button[text()="Submit"]')` | Text-based, complex hierarchy |
| ID | `$('#login-form')` | Unique IDs |
| Data attribute | `$('[data-testid="submit-btn"]')` | Test-specific, stable |
| Link text | `$('=Sign In')` | Exact link text |
| Partial link | `$('*=Sign')` | Partial link text |

### Chained Selectors

```typescript
// Parent → child
const form = await $('form.login');
const emailInput = await form.$('input[name="email"]');
await emailInput.setValue('user@example.com');

// Shadow DOM
const host = await $('my-component');
const inner = await host.$('>>> .inner-element');
```

---

## Waits

### Built-in Wait Strategies

```typescript
// waitForDisplayed — element visible
await $('#results').waitForDisplayed({ timeout: 5000 });

// waitForExist — element in DOM
await $('#loading').waitForExist({ reverse: true });

// waitForClickable — element enabled and clickable
await $('button').waitForClickable();

// waitForEnabled
await $('#submit').waitForEnabled();
```

### Custom Waits

```typescript
// browser.waitUntil — custom condition
await browser.waitUntil(
  async () => (await $('#status').getText()) === 'Ready',
  { timeout: 10000, interval: 500 }
);
```

### Avoid Fixed Delays

```typescript
// Bad — brittle
await browser.pause(3000);

// Good — explicit condition
await $('#content').waitForDisplayed();
```

---

## Page Object Pattern

### Base Page

```typescript
// pages/BasePage.ts
export default class BasePage {
  async open(path: string) {
    await browser.url(path);
  }

  async getTitle() {
    return browser.getTitle();
  }

  async waitForPageLoad() {
    await browser.waitUntil(
      async () => (await browser.execute(() => document.readyState)) === 'complete',
      { timeout: 10000 }
    );
  }
}
```

### Page-Specific Object

```typescript
// pages/LoginPage.ts
import BasePage from './BasePage';

export default class LoginPage extends BasePage {
  get emailInput() {
    return $('input[name="email"]');
  }

  get passwordInput() {
    return $('input[name="password"]');
  }

  get submitButton() {
    return $('button[type="submit"]');
  }

  async login(email: string, password: string) {
    await this.emailInput.setValue(email);
    await this.passwordInput.setValue(password);
    await this.submitButton.click();
  }

  async open() {
    await super.open('/login');
  }
}
```

### Using Page Objects in Tests

```typescript
import LoginPage from '../pages/LoginPage';

describe('Login', () => {
  const loginPage = new LoginPage();

  it('logs in successfully', async () => {
    await loginPage.open();
    await loginPage.login('user@example.com', 'secret');
    await expect(browser).toHaveUrlContaining('/dashboard');
  });
});
```

---

## Custom Commands

### Adding Custom Commands

```typescript
// wdio.conf.ts or in a support file
browser.addCommand('loginWith', async function (email: string, password: string) {
  await this.url('/login');
  await $('input[name="email"]').setValue(email);
  await $('input[name="password"]').setValue(password);
  await $('button[type="submit"]').click();
});

// Usage in test
await browser.loginWith('user@example.com', 'secret');
```

### Element Add Commands

```typescript
browser.addCommand('getTextContent', async function () {
  return this.getAttribute('textContent');
}, true); // true = chainable

// Usage
const text = await $('.header').getTextContent();
```

---

## File Upload

```typescript
// Input type="file" — set path directly
const fileInput = await $('input[type="file"]');
await fileInput.setValue('/absolute/path/to/file.pdf');

// Or use browser.uploadFile (requires @wdio/upload package)
import path from 'path';
const filePath = await browser.uploadFile(path.join(__dirname, 'fixtures', 'document.pdf'));
await $('input[type="file"]').setValue(filePath);
```

---

## Multiremote (Parallel Browsers)

Run the same test across multiple browsers simultaneously:

```typescript
// wdio.conf.ts
export const config = {
  capabilities: {
    browserA: {
      capabilities: {
        browserName: 'chrome',
      },
    },
    browserB: {
      capabilities: {
        browserName: 'firefox',
      },
    },
  },
};
```

```typescript
// In test
describe('multiremote', () => {
  it('runs in both browsers', async () => {
    await browser.browserA.url('https://example.com');
    await browser.browserB.url('https://example.com');
    const titleA = await browser.browserA.getTitle();
    const titleB = await browser.browserB.getTitle();
    expect(titleA).toEqual(titleB);
  });
});
```

---

## Common Interactions

### Navigation

```typescript
await browser.url('https://example.com');
await browser.url('/login'); // relative to baseUrl
await browser.back();
await browser.forward();
await browser.refresh();
```

### Form Actions

```typescript
await $('input').setValue('text');
await $('input').addValue(' appended');
await $('input').clearValue();
await $('select').selectByVisibleText('Option 1');
await $('select').selectByAttribute('value', 'opt1');
await $('input[type="checkbox"]').click();
```

### Assertions

```typescript
await expect($('h1')).toHaveText('Welcome');
await expect($('#results')).toBeDisplayed();
await expect(browser).toHaveUrlContaining('/dashboard');
await expect($('.count')).toHaveElementClass('active');
```
