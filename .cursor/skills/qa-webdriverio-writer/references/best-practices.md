# WebdriverIO Best Practices

## Stable Selectors

### Prefer Data Attributes

```typescript
// Good — test-specific, stable
await $('[data-testid="submit-btn"]').click();
await $('[data-testid="email-input"]').setValue('user@example.com');

// Avoid — brittle
await $('.btn-primary').click();
await $('#email').setValue('user@example.com');
await $('div > form > div:nth-child(2) > input').setValue('user@example.com');
```

Add `data-testid` to production markup or recommend adding to the app. Avoid relying on CSS classes, IDs, or DOM structure that may change with refactors.

### Selector Priority

1. **data-testid** — Explicit, stable, test-specific
2. **Semantic attributes** — name, aria-label, role
3. **Stable IDs** — IDs that won't change
4. **CSS** — Simple, meaningful classes
5. **XPath** — Last resort; use for text when necessary

---

## Wait Strategies

### Use Explicit Waits

```typescript
// Good — wait for condition
await $('#results').waitForDisplayed({ timeout: 5000 });
await $('#loading').waitForExist({ reverse: true });
await $('button').waitForClickable();

// Bad — arbitrary delay
await browser.pause(3000);
```

### waitUntil for Custom Conditions

```typescript
await browser.waitUntil(
  async () => (await $('#status').getText()) === 'Complete',
  { timeout: 10000, interval: 500, timeoutMsg: 'Status never became Complete' }
);
```

### Assertions Include Implicit Waits

WebdriverIO assertions retry until timeout:

```typescript
await expect($('#results')).toBeDisplayed();
await expect($('h1')).toHaveText('Welcome');
```

---

## Page Object Pattern

### Structure

```
test/
  specs/
    login.spec.ts
  pages/
    BasePage.ts
    LoginPage.ts
    DashboardPage.ts
```

### Encapsulation

- **One page object per page/screen** — Encapsulate selectors and actions
- **Base page for shared logic** — Navigation, common helpers
- **Getters for elements** — Lazy evaluation; elements resolved when used
- **Methods for actions** — Reusable flows (login, fillForm, etc.)

### Avoid Logic in Tests

```typescript
// Bad — implementation details in test
it('logs in', async () => {
  await $('input[name="email"]').setValue('user@test.com');
  await $('input[name="password"]').setValue('secret');
  await $('button').click();
});

// Good — page object encapsulates
it('logs in', async () => {
  await loginPage.login('user@test.com', 'secret');
});
```

---

## Parallel Execution

### maxInstances

```typescript
// wdio.conf.ts
maxInstances: 5, // Run up to 5 specs in parallel
```

### Test Independence

- Each test must run in isolation
- No shared mutable state between tests
- Use `beforeEach` for setup; avoid order-dependent tests
- Prefer API or fixture data over UI-created state

### Sharding for CI

```bash
wdio run wdio.conf.ts --shard=1/4
wdio run wdio.conf.ts --shard=2/4
wdio run wdio.conf.ts --shard=3/4
wdio run wdio.conf.ts --shard=4/4
```

---

## Error Handling and Debugging

### Screenshots on Failure

```typescript
afterTest: async function (test, context, result) {
  if (result.error) {
    await browser.takeScreenshot();
  }
},
```

### Logs

```typescript
browser.debug(); // Pause and open REPL
browser.pause(5000); // Pause (avoid in production tests)
```

### Traceability

Include test case IDs in describe/it names:

```typescript
describe('Login [TC-001]', () => {
  it('displays error on invalid credentials [TC-001-01]', async () => {
    // ...
  });
});
```

---

## Security and Secrets

- Never hardcode credentials — use `process.env` or config
- Store API keys in `.env` (gitignored)
- Use `browser.addCommand` for login flows that need credentials from env

---

## Mobile Web (Appium)

- Use `browser.isMobile` to branch mobile vs desktop logic when needed
- Prefer touch actions for mobile: `element.touchAction('tap')` or `element.click()`
- Set viewport/capabilities for target device sizes
- Use Appium inspector to discover selectors on real devices/emulators
