# WCAG 2.2 Test Scenarios per Success Criteria

Test scenarios and code examples for WCAG 2.2 success criteria. Use with qa-accessibility-test-writer when generating accessibility tests.

---

## Principle 1: Perceivable

### 1.1.1 Non-text Content (Level A)

**Checkpoint:** All images have alt text; decorative images use `alt=""` or `aria-hidden`.

```typescript
// Playwright + @axe-core/playwright
import AxeBuilder from '@axe-core/playwright';

test('images have appropriate alt text', async ({ page }) => {
  await page.goto('/gallery');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a'])
    .analyze();
  const imageViolations = results.violations.filter(
    v => v.id === 'image-alt' || v.ruleId === 'image-alt'
  );
  expect(imageViolations).toHaveLength(0);
});
```

### 1.3.1 Info and Relationships (Level A)

**Checkpoint:** Structure conveyed via markup (headings, lists, tables, form labels).

```typescript
// Cypress + cypress-axe
it('has semantic structure', () => {
  cy.visit('/article');
  cy.injectAxe();
  cy.checkA11y(null, { runOnly: { type: 'rule', values: ['landmark-one-main', 'page-has-heading-one'] } });
});
```

### 1.4.3 Contrast (Minimum) (Level AA)

**Checkpoint:** Text contrast ratio ≥ 4.5:1 (normal), 3:1 (large).

```typescript
// axe-core checks color-contrast automatically
test('meets color contrast requirements', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2aa'])
    .analyze();
  const contrastViolations = results.violations.filter(
    v => v.id === 'color-contrast'
  );
  expect(contrastViolations).toHaveLength(0);
});
```

### 1.4.4 Resize Text (Level A)

**Checkpoint:** Text can be resized to 200% without loss of content/function.

```typescript
// Playwright: simulate zoom
test('text resizable to 200%', async ({ page }) => {
  await page.goto('/');
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.evaluate(() => document.body.style.zoom = '200%');
  const main = page.locator('main');
  await expect(main).toBeVisible();
  const box = await main.boundingBox();
  expect(box?.height).toBeGreaterThan(0);
});
```

### 1.4.10 Reflow (Level AA)

**Checkpoint:** Content reflows at 320px width without horizontal scroll.

```typescript
test('no horizontal scroll at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto('/');
  const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
  const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1);
});
```

### 1.4.13 Content on Hover or Focus (Level AA)

**Checkpoint:** Dismissible, hoverable, persistent on pointer hover/focus.

```typescript
test('hover/focus content is dismissible', async ({ page }) => {
  await page.goto('/tooltips');
  const trigger = page.locator('[aria-haspopup="true"]').first();
  await trigger.focus();
  await expect(page.locator('[role="tooltip"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[role="tooltip"]')).toBeHidden();
});
```

---

## Principle 2: Operable

### 2.1.1 Keyboard (Level A)

**Checkpoint:** All functionality available via keyboard.

```typescript
test('modal can be closed with Escape', async ({ page }) => {
  await page.goto('/modal-demo');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter'); // open modal
  await expect(page.locator('[role="dialog"]')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.locator('[role="dialog"]')).toBeHidden();
});
```

### 2.1.2 No Keyboard Trap (Level A)

**Checkpoint:** Focus can be moved away from any component.

```typescript
test('no keyboard trap in modal', async ({ page }) => {
  await page.goto('/modal-demo');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  const focusable = page.locator('[role="dialog"] button, [role="dialog"] [href]');
  const count = await focusable.count();
  for (let i = 0; i < count + 2; i++) {
    await page.keyboard.press('Tab');
  }
  const focusEl = await page.evaluate(() => document.activeElement?.tagName);
  expect(focusEl).toBeDefined();
});
```

### 2.4.1 Bypass Blocks (Level A)

**Checkpoint:** Skip link or landmark to bypass repeated content.

```typescript
test('has skip link', async ({ page }) => {
  await page.goto('/');
  const skipLink = page.locator('a[href="#main"], a[href="#content"], [href^="#"]').first();
  await expect(skipLink).toBeVisible();
  await skipLink.click();
  const target = await page.locator('#main, #content, [id]').first();
  await expect(target).toBeFocused();
});
```

### 2.4.3 Focus Order (Level A)

**Checkpoint:** Tab order is logical and meaningful.

```typescript
test('focus order is logical', async ({ page }) => {
  await page.goto('/form');
  const order: string[] = [];
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    const id = await page.evaluate(() => (document.activeElement as HTMLElement)?.id || '');
    if (id) order.push(id);
  }
  expect(order.indexOf('submit')).toBeGreaterThan(order.indexOf('email'));
});
```

### 2.4.7 Focus Visible (Level AA)

**Checkpoint:** Keyboard focus indicator visible.

```typescript
test('focus indicator visible', async ({ page }) => {
  await page.goto('/');
  const link = page.locator('a').first();
  await link.focus();
  const outline = await link.evaluate(el => {
    const s = getComputedStyle(el);
    return s.outlineWidth !== '0px' || s.boxShadow !== 'none' || s.outlineStyle !== 'none';
  });
  expect(outline).toBeTruthy();
});
```

### 2.5.3 Label in Name (Level A)

**Checkpoint:** Accessible name includes visible label text.

```typescript
test('button accessible name matches visible text', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('button').first();
  const visibleText = await btn.textContent();
  const ariaLabel = await btn.getAttribute('aria-label');
  const name = ariaLabel || visibleText?.trim();
  expect(name?.length).toBeGreaterThan(0);
});
```

---

## Principle 3: Understandable

### 3.1.1 Language of Page (Level A)

**Checkpoint:** Page has `lang` attribute.

```typescript
test('page has lang attribute', async ({ page }) => {
  await page.goto('/');
  const lang = await page.locator('html').getAttribute('lang');
  expect(lang).toMatch(/^[a-z]{2}(-[A-Z]{2})?$/);
});
```

### 3.3.1 Error Identification (Level A)

**Checkpoint:** Input errors identified and described in text.

```typescript
test('form errors are announced', async ({ page }) => {
  await page.goto('/signup');
  await page.locator('input[type="email"]').fill('invalid');
  await page.locator('button[type="submit"]').click();
  const error = page.locator('[role="alert"], .error, [aria-invalid="true"]');
  await expect(error).toBeVisible();
  await expect(error).toContainText(/invalid|error|required/i);
});
```

### 3.3.2 Labels or Instructions (Level A)

**Checkpoint:** Labels/instructions provided for user input.

```typescript
// Cypress + cypress-axe: axe-core checks label, label-title-only, etc.
it('form inputs have labels', () => {
  cy.visit('/contact');
  cy.injectAxe();
  cy.checkA11y('form', { runOnly: { type: 'rule', values: ['label', 'input-button-name'] } });
});
```

---

## Principle 4: Robust

### 4.1.1 Parsing (Level A)

**Checkpoint:** Markup validates; no duplicate IDs.

```typescript
test('no duplicate IDs', async ({ page }) => {
  await page.goto('/');
  const ids = await page.evaluate(() => {
    const elements = document.querySelectorAll('[id]');
    const idList = Array.from(elements).map(el => el.id);
    return idList;
  });
  const unique = new Set(ids);
  expect(unique.size).toBe(ids.length);
});
```

### 4.1.2 Name, Role, Value (Level A)

**Checkpoint:** UI components have accessible name, role, value.

```typescript
// axe-core checks aria-valid-attr, aria-required-attr, etc.
test('components have name, role, value', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a'])
    .analyze();
  const ariaViolations = results.violations.filter(
    v => v.id?.includes('aria') || v.id === 'button-name'
  );
  expect(ariaViolations).toHaveLength(0);
});
```

### 4.1.3 Status Messages (Level AA)

**Checkpoint:** Status messages identified via role or live region.

```typescript
test('status messages use live region', async ({ page }) => {
  await page.goto('/cart');
  await page.locator('button:has-text("Add to cart")').click();
  const liveRegion = page.locator('[aria-live="polite"], [aria-live="assertive"], [role="status"], [role="alert"]');
  await expect(liveRegion).toBeVisible();
});
```

---

## Full Page Audit Example

```typescript
// Playwright + @axe-core/playwright
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage meets WCAG 2.2 AA', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  expect(results.violations).toEqual([]);
  if (results.violations.length > 0) {
    console.log(JSON.stringify(results.violations, null, 2));
  }
});
```

---

## References

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [axe-core Rule Descriptions](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
