# Playwright Test Patterns

Common patterns for E2E testing with Playwright TypeScript.

## Navigation

| Pattern | Example |
|---------|---------|
| Go to URL | `await page.goto('/login')` or `await page.goto(baseURL + '/login')` |
| Go back | `await page.goBack()` |
| Reload | `await page.reload()` |
| Wait for navigation | `await page.waitForURL('**/dashboard')` |

```typescript
test('navigates to dashboard after login', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('textbox', { name: 'Email' }).fill('user@example.com');
  await page.getByLabel('Password').fill('secret');
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/.*dashboard/);
});
```

## Forms

| Pattern | Example |
|---------|---------|
| Fill text | `await page.getByLabel('Name').fill('John')` |
| Fill by role | `await page.getByRole('textbox', { name: 'Email' }).fill('a@b.com')` |
| Select dropdown | `await page.getByLabel('Country').selectOption('US')` |
| Check checkbox | `await page.getByRole('checkbox', { name: 'Subscribe' }).check()` |
| Radio | `await page.getByRole('radio', { name: 'Option A' }).check()` |
| Submit | `await page.getByRole('button', { name: 'Submit' }).click()` |

```typescript
test('submits registration form', async ({ page }) => {
  await page.goto('/register');
  await page.getByLabel('Email').fill('new@example.com');
  await page.getByLabel('Password').fill('SecurePass123');
  await page.getByRole('checkbox', { name: 'Terms' }).check();
  await page.getByRole('button', { name: 'Create account' }).click();
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

## Authentication

| Pattern | Example |
|---------|---------|
| Login before each test | Use global setup or beforeEach with storageState |
| Reuse auth state | Save storageState in setup; reuse via project config |
| API login | Call login API, save cookies to storageState file |

```typescript
// global-setup.ts
async function globalSetup() {
  const response = await request.post('/api/login', { data: { email, password } });
  const cookies = await response.headers['set-cookie'];
  await fs.writeFile('auth.json', JSON.stringify({ cookies }));
}

// playwright.config.ts
use: { storageState: 'auth.json' }
```

See `references/config.md` for auth state configuration.

## File Upload

| Pattern | Example |
|---------|---------|
| Single file | `await page.getByLabel('Upload').setInputFiles('fixtures/doc.pdf')` |
| Multiple files | `await page.getByLabel('Upload').setInputFiles(['a.pdf', 'b.pdf'])` |
| Buffer | `await page.getByLabel('Upload').setInputFiles({ name: 'test.txt', mimeType: 'text/plain', buffer: Buffer.from('content') })` |

```typescript
test('uploads file', async ({ page }) => {
  await page.goto('/upload');
  await page.getByLabel('Choose file').setInputFiles(path.join(__dirname, 'fixtures/sample.pdf'));
  await page.getByRole('button', { name: 'Upload' }).click();
  await expect(page.getByText('Upload complete')).toBeVisible();
});
```

## Drag and Drop

| Pattern | Example |
|---------|---------|
| locator.dragTo | `await page.locator('.item').dragTo(page.locator('.dropzone'))` |
| Manual (low-level) | `await page.dispatchEvent(source, 'dragstart'); await page.dispatchEvent(target, 'drop')` |

```typescript
test('drags item to list', async ({ page }) => {
  await page.goto('/kanban');
  await page.locator('[data-id="task-1"]').dragTo(page.locator('[data-column="done"]'));
  await expect(page.locator('[data-column="done"]')).toContainText('Task 1');
});
```

## Iframe Handling

| Pattern | Example |
|---------|---------|
| Get frame | `const frame = page.frameLocator('iframe[name="embed"]')` |
| Interact in frame | `await frame.getByRole('button').click()` |
| Nested frame | `const inner = frame.frameLocator('iframe')` |

```typescript
test('interacts with iframe content', async ({ page }) => {
  await page.goto('/embed');
  const frame = page.frameLocator('iframe#widget');
  await frame.getByRole('button', { name: 'Submit' }).click();
  await expect(frame.getByText('Success')).toBeVisible();
});
```

## Multi-Tab

| Pattern | Example |
|---------|---------|
| Wait for popup | `const [popup] = await Promise.all([page.waitForEvent('popup'), page.getByRole('link').click()])` |
| New tab | `const context = page.context(); const newPage = await context.newPage()` |
| Switch | Use `popup` or `newPage` for subsequent actions |

```typescript
test('opens link in new tab', async ({ page }) => {
  const [popup] = await Promise.all([
    page.waitForEvent('popup'),
    page.getByRole('link', { name: 'External' }).click()
  ]);
  await popup.waitForLoadState();
  await expect(popup).toHaveURL(/external\.com/);
});
```

## API Mocking with page.route

| Pattern | Example |
|---------|---------|
| Mock response | `await page.route('**/api/users', route => route.fulfill({ status: 200, body: JSON.stringify([]) }))` |
| Abort request | `await page.route('**/analytics', route => route.abort())` |
| Modify request | `await page.route('**/api/**', route => route.continue({ headers: { ...route.request().headers(), 'X-Custom': '1' } }))` |
| Unroute | `await page.unroute('**/api/users')` |

```typescript
test('shows empty state when API returns no data', async ({ page }) => {
  await page.route('**/api/items', route => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ items: [] })
  }));
  await page.goto('/items');
  await expect(page.getByText('No items found')).toBeVisible();
});
```

## Visual Comparison

| Pattern | Example |
|---------|---------|
| Screenshot | `await expect(page).toHaveScreenshot('home.png')` |
| Element screenshot | `await expect(page.locator('.widget')).toHaveScreenshot('widget.png')` |
| Update snapshots | Run with `--update-snapshots` |
| Mask | `await expect(page).toHaveScreenshot({ mask: [page.locator('.dynamic')] })` |

```typescript
test('homepage matches snapshot', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png');
});
```
