# Visual Regression Patterns

Screenshot strategies, masking, viewports, and threshold configuration for visual regression testing.

## Screenshot Strategies

### Full Page vs Element

| Strategy | Use Case | Example |
|----------|----------|---------|
| **Full page** | Layout, scroll behavior, long pages | `expect(page).toHaveScreenshot({ fullPage: true })` |
| **Viewport** | Above-the-fold, fixed viewport | `expect(page).toHaveScreenshot()` (default) |
| **Element** | Component, modal, header | `expect(locator).toHaveScreenshot()` |
| **Multiple elements** | Key sections | Capture each with unique names |

```typescript
// Full page
await expect(page).toHaveScreenshot('homepage-full.png', { fullPage: true });

// Viewport only
await expect(page).toHaveScreenshot('homepage-viewport.png');

// Element
await expect(page.getByRole('banner')).toHaveScreenshot('header.png');
await expect(page.getByTestId('product-card')).toHaveScreenshot('product-card.png');
```

### When to Use Each

- **Full page:** Marketing pages, documentation, long forms
- **Viewport:** Hero sections, dashboards, fixed layouts
- **Element:** Reusable components, modals, cards, headers

## Dynamic Content Masking

### Playwright Mask

```typescript
await expect(page).toHaveScreenshot('dashboard.png', {
  mask: [
    page.getByTestId('user-avatar'),
    page.getByTestId('timestamp'),
    page.locator('.ad-banner'),
  ],
  maskColor: '#000000', // Optional: color for masked regions
});
```

### Common Elements to Mask

| Element | Reason |
|---------|--------|
| Timestamps | Always changing |
| User avatars | User-specific |
| Ads | Third-party, variable |
| Charts/graphs | May use random data |
| "X minutes ago" | Relative time |
| Session IDs, tokens | Security, uniqueness |

### Percy Masking

```typescript
await percySnapshot(page, 'Dashboard', {
  percyCSS: `
    [data-testid="timestamp"] { visibility: hidden; }
    .ad-banner { display: none; }
  `,
});
```

### BackstopJS Selectors to Hide

```json
{
  "scenarios": [{
    "url": "https://example.com/dashboard",
    "hideSelectors": [".timestamp", ".ad-banner", "[data-testid='avatar']"]
  }]
}
```

## Viewport Variations

### Playwright Projects

```typescript
// playwright.config.ts
projects: [
  { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1920, height: 1080 } } },
  { name: 'tablet', use: { ...devices['iPad Pro'] } },
  { name: 'mobile', use: { ...devices['iPhone 13'] } },
],
```

### Snapshot Naming with Viewport

```typescript
test('homepage visual', async ({ page }, testInfo) => {
  await page.goto('/');
  const project = testInfo.project.name;
  await expect(page).toHaveScreenshot(`homepage-${project}.png`);
});
```

### BackstopJS Viewports

```json
{
  "viewports": [
    { "label": "desktop", "width": 1920, "height": 1080 },
    { "label": "tablet", "width": 768, "height": 1024 },
    { "label": "mobile", "width": 375, "height": 667 }
  ]
}
```

### Recommended Breakpoints

| Label | Width | Height | Use |
|-------|-------|--------|-----|
| Desktop | 1920 | 1080 | Primary desktop |
| Tablet | 768 | 1024 | iPad portrait |
| Mobile | 375 | 667 | iPhone SE / small phone |
| Mobile large | 414 | 896 | iPhone 11+ |

## Threshold Configuration

### Playwright

```typescript
await expect(page).toHaveScreenshot('page.png', {
  maxDiffPixels: 100,        // Absolute pixel count
  maxDiffPixelRatio: 0.01,   // 1% of pixels
});
```

| Option | Description | When to Use |
|--------|-------------|-------------|
| `maxDiffPixels` | Max differing pixels | Font/subpixel differences |
| `maxDiffPixelRatio` | Max ratio (0–1) | Proportional tolerance |

### BackstopJS

```json
{
  "scenarios": [{
    "misMatchThreshold": 0.1
  }]
}
```

- `0` = strict (no tolerance)
- `0.1` = 0.1% tolerance
- `1` = 100% (accept all)

### Percy

Percy uses built-in diff engine; configure via dashboard or `percy.config.js` for ignore regions.

## Animation Disabling

### CSS Override (Playwright)

```typescript
await page.addStyleTag({
  content: `
    *, *::before, *::after {
      animation-duration: 0s !important;
      animation-delay: 0s !important;
      transition-duration: 0s !important;
    }
  `,
});
await expect(page).toHaveScreenshot('static.png');
```

### prefers-reduced-motion

```typescript
await page.emulateMedia({ reducedMotion: 'reduce' });
await expect(page).toHaveScreenshot('reduced-motion.png');
```

### Wait for Stability

```typescript
await page.waitForLoadState('networkidle');
await page.waitForTimeout(500); // Allow animations to settle
await expect(page).toHaveScreenshot('stable.png');
```

## Element Screenshot Patterns

### Scroll Into View

```typescript
await page.getByTestId('footer').scrollIntoViewIfNeeded();
await expect(page.getByTestId('footer')).toHaveScreenshot('footer.png');
```

### Modal / Overlay

```typescript
await page.getByRole('button', { name: 'Open modal' }).click();
await expect(page.getByRole('dialog')).toHaveScreenshot('modal.png');
```

### Hover State

```typescript
await page.getByTestId('card').hover();
await expect(page.getByTestId('card')).toHaveScreenshot('card-hover.png');
```
