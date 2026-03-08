# Playwright Assertion Reference

Playwright uses `expect` from `@playwright/test` with auto-retry and rich error messages.

## Visibility & State

| Assertion | Description | Example |
|-----------|-------------|---------|
| `toBeVisible()` | Element is visible | `expect(page.getByRole('heading')).toBeVisible()` |
| `toBeHidden()` | Element is hidden | `expect(page.getByText('Loading')).toBeHidden()` |
| `toBeAttached()` | Element is in DOM | `expect(locator).toBeAttached()` |
| `toBeDetached()` | Element is not in DOM | `expect(locator).toBeDetached()` |

## Text

| Assertion | Description | Example |
|-----------|-------------|---------|
| `toHaveText(text)` | Exact text match | `expect(locator).toHaveText('Submit')` |
| `toHaveText(regex)` | Regex match | `expect(locator).toHaveText(/Welcome, .+/)` |
| `toContainText(text)` | Contains text | `expect(locator).toContainText('Error')` |
| `toHaveValue(value)` | Input value | `expect(input).toHaveValue('typed')` |

## URL & Navigation

| Assertion | Description | Example |
|-----------|-------------|---------|
| `toHaveURL(url)` | Page URL | `expect(page).toHaveURL('/dashboard')` |
| `toHaveURL(regex)` | URL regex | `expect(page).toHaveURL(/.*\/user\/\d+/)` |
| `toHaveTitle(title)` | Page title | `expect(page).toHaveTitle('Dashboard')` |

## Count & List

| Assertion | Description | Example |
|-----------|-------------|---------|
| `toHaveCount(n)` | Number of matches | `expect(page.getByRole('listitem')).toHaveCount(5)` |
| `toHaveLength(n)` | Array length (for locator.all()) | `expect(await locator.all()).toHaveLength(3)` |

## Attributes & Properties

| Assertion | Description | Example |
|-----------|-------------|---------|
| `toHaveAttribute(name, value?)` | Attribute exists/value | `expect(link).toHaveAttribute('href', '/about')` |
| `toHaveClass(class)` | Has CSS class | `expect(btn).toHaveClass('active')` |
| `toHaveCSS(name, value)` | CSS property | `expect(el).toHaveCSS('display', 'none')` |

## Form Elements

| Assertion | Description | Example |
|-----------|-------------|---------|
| `toBeChecked()` | Checkbox/radio checked | `expect(checkbox).toBeChecked()` |
| `toBeEnabled()` | Element enabled | `expect(button).toBeEnabled()` |
| `toBeDisabled()` | Element disabled | `expect(button).toBeDisabled()` |
| `toBeEditable()` | Input is editable | `expect(input).toBeEditable()` |
| `toBeEmpty()` | No text/children | `expect(div).toBeEmpty()` |

## Soft Assertions

| Pattern | Description | Example |
|---------|-------------|---------|
| `expect.soft()` | Continue on failure | `await expect.soft(locator).toBeVisible()` |
| Collect failures | Run all, report at end | Use multiple `expect.soft` in sequence |

```typescript
test('validates form fields', async ({ page }) => {
  await expect.soft(page.getByLabel('Email')).toBeVisible();
  await expect.soft(page.getByLabel('Password')).toBeVisible();
  await expect.soft(page.getByRole('button')).toBeEnabled();
});
```

## Timeout

| Pattern | Description | Example |
|---------|-------------|---------|
| `{ timeout: ms }` | Override default | `expect(locator).toBeVisible({ timeout: 10000 })` |
| Config default | playwright.config.ts | `expect: { timeout: 5000 }` |

## Negation

| Pattern | Example |
|---------|---------|
| `not` | `expect(locator).not.toBeVisible()` |
| `expect(locator).not.toHaveText('Error')` |

## Screenshot Assertions

| Assertion | Description | Example |
|-----------|-------------|---------|
| `toHaveScreenshot(name?)` | Visual regression | `await expect(page).toHaveScreenshot('home.png')` |
| Options | mask, maxDiffPixels | `await expect(page).toHaveScreenshot({ mask: [locator] })` |

## Common Patterns

```typescript
// Wait for element and assert
await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

// Assert list length
await expect(page.getByRole('listitem')).toHaveCount(3);

// Assert input value
await expect(page.getByLabel('Search')).toHaveValue('query');

// Assert URL after action
await expect(page).toHaveURL(/\/users\/\d+/);

// Assert disabled state
await expect(page.getByRole('button', { name: 'Submit' })).toBeDisabled();
```
