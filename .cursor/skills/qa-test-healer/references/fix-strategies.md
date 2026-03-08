# Fix Strategies for Test Healing

Detailed strategies for each failure type with before/after examples.

## 1. Broken Selectors

### Symptoms
- `TimeoutError: locator resolved to X elements` or `strict mode violation`
- `Error: No element found for selector`
- `Locator.click: Target closed`

### Strategy
1. Run test in headed mode; pause at failure point
2. Take accessibility snapshot via Playwright MCP (`browser_snapshot`)
3. Identify the target element in the snapshot (role, name, testid)
4. Choose stable locator: `getByRole` > `getByTestId` > `getByLabel` > `getByText` > CSS
5. Update POM or test file with new locator

### Before
```typescript
await page.click('button.submit-btn');
```

### After
```typescript
await page.getByRole('button', { name: 'Submit' }).click();
```

### POM Update
If the selector lives in a Page Object, update the locator there so all tests using it benefit.

```typescript
// Before (LoginPage.ts)
get submitButton() { return this.page.locator('button.submit-btn'); }

// After
get submitButton() { return this.page.getByRole('button', { name: 'Submit' }); }
```

---

## 2. Changed Assertions

### Symptoms
- `expect(locator).toHaveText(expected)` — actual text differs
- `expect(locator).toHaveValue(expected)` — value mismatch
- Snapshot/visual diff mismatch

### Strategy
1. Compare expected vs actual from error output
2. Determine if change is intentional (product update) or a bug
3. If intentional: update expected value in test
4. If unintentional: mark as fixme with "Product regression: expected X, got Y"

### Before
```typescript
await expect(page.getByRole('heading')).toHaveText('Welcome, User');
```

### After (intentional product change)
```typescript
await expect(page.getByRole('heading')).toHaveText('Welcome back!');
```

### After (unintentional — mark fixme)
```typescript
test.fixme('Product regression: heading shows "Error" instead of "Welcome, User"');
```

---

## 3. Timeout Issues

### Symptoms
- `Timeout 5000ms exceeded`
- `Waiting for locator`
- Element appears but after a long delay

### Strategy
1. Identify what is slow: network, animation, lazy load?
2. Add explicit wait for the condition (prefer `expect` with timeout over `waitForTimeout`)
3. Increase timeout only when necessary (e.g., known slow API)

### Before
```typescript
await page.goto('/dashboard');
await page.getByText('Data loaded').click(); // Fails: element appears after 3s
```

### After
```typescript
await page.goto('/dashboard');
await expect(page.getByText('Data loaded')).toBeVisible({ timeout: 10000 });
await page.getByText('Data loaded').click();
```

### For slow API
```typescript
await expect(page.getByRole('status', { name: 'Loaded' })).toBeVisible({ timeout: 15000 });
```

---

## 4. Missing Elements

### Symptoms
- `Locator not found`
- Element was removed from DOM
- Feature redesigned

### Strategy
1. Take snapshot; confirm element is absent
2. Check if feature was removed or moved (e.g., new modal, different page)
3. If moved: update navigation/flow and locator
4. If removed: mark test as fixme with "Feature removed: [description]"
5. If uncertain: mark fixme with "Manual review: element not found"

### Before
```typescript
await page.getByRole('button', { name: 'Old CTA' }).click();
```

### After (feature removed)
```typescript
test.fixme('Feature removed: "Old CTA" button no longer exists in UI');
```

### After (element moved)
```typescript
await page.getByRole('link', { name: 'Settings' }).click();
await page.getByRole('button', { name: 'New CTA' }).click();
```

---

## 5. Network Changes

### Symptoms
- API returns different status/body
- Mock route no longer matches
- Request timeout or 404

### Strategy
1. Inspect network requests via `browser_network_requests` or test logs
2. Update `page.route` URL pattern if endpoint changed
3. Update mock response body/status if API contract changed
4. Add retry logic for flaky endpoints (use sparingly)

### Before
```typescript
await page.route('**/api/users', route => route.fulfill({ status: 200, body: '[]' }));
```

### After (endpoint changed)
```typescript
await page.route('**/api/v2/users', route => route.fulfill({ status: 200, body: '[]' }));
```

### After (response shape changed)
```typescript
await page.route('**/api/users', route => route.fulfill({
  status: 200,
  body: JSON.stringify({ data: [] }),
}));
```

---

## Locator Priority (Stability)

When replacing selectors, prefer in this order:

1. **getByRole** — Most resilient to DOM structure changes
2. **getByTestId** — Explicit, requires `data-testid` in app
3. **getByLabel** — Good for form fields
4. **getByText** — Use for unique visible text
5. **CSS/XPath** — Last resort; brittle
