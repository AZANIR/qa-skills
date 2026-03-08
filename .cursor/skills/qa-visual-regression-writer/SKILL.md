---
name: qa-visual-regression-writer
description: Generate visual regression tests using Playwright screenshots, Percy, and BackstopJS for screenshot comparison, layout drift detection, and baseline management.
output_dir: tests/visual
---

# QA Visual Regression Writer

## Purpose

Write visual regression tests to detect unintended UI changes. Transform test cases and visual checkpoints into executable visual tests using Playwright built-in screenshots, Percy (cloud-based), or BackstopJS (Docker-based).

## Trigger Phrases

- "Write visual regression tests for [page/component]"
- "Generate screenshot comparison tests"
- "Create visual tests with Playwright toHaveScreenshot"
- "Add Percy visual tests for [flow]"
- "BackstopJS visual regression for [viewports]"
- "Visual tests for layout drift detection"
- "Screenshot baseline tests for [feature]"
- "Mask dynamic content in visual tests"
- "Visual regression with viewport variations"

## Tools

| Tool | Approach | Best For |
|------|----------|----------|
| **Playwright** | Built-in `toHaveScreenshot()` | Local baselines, CI, no extra services |
| **Percy** | Cloud-based, BrowserStack integration | Cross-browser, team review, CI integration |
| **BackstopJS** | Docker, configurable viewports | Multi-viewport, config-driven scenarios |

## Workflow

1. **Read test cases** — From qa-testcase-from-docs, qa-testcase-from-ui, or manual specs
2. **Define visual checkpoints** — Identify pages/elements to capture
3. **Set baselines** — Initial capture; store reference images
4. **Generate visual tests** — Produce test scripts with assertions
5. **Configure thresholds** — maxDiffPixels, maxDiffPixelRatio, or tool-specific settings

## Key Patterns

- **Full page screenshots** — `expect(page).toHaveScreenshot()`
- **Element screenshots** — `expect(locator).toHaveScreenshot()`
- **Viewport variations** — Desktop, tablet, mobile (1280x720, 768x1024, 375x667)
- **Dynamic content masking** — Mask timestamps, avatars, ads, animations
- **Animation disabling** — `page.addStyleTag` or `prefers-reduced-motion` for stable captures
- **Threshold configuration** — Tune sensitivity to avoid false positives

See `references/patterns.md` for screenshot strategies, masking, viewports, thresholds.

## Baseline Management

| Phase | Action |
|-------|--------|
| **Initial capture** | Run tests with `--update-snapshots` (Playwright) or `backstop approve` |
| **Update workflow** | Review diffs → approve intentional changes → commit baselines |
| **Review process** | Percy: dashboard review; BackstopJS: HTML report; Playwright: diff artifacts |

See `references/best-practices.md` for baseline management and CI integration.

## Playwright Integration

```typescript
// Full page
await expect(page).toHaveScreenshot('homepage.png');

// Element
await expect(page.getByTestId('header')).toHaveScreenshot('header.png');

// With options
await expect(page).toHaveScreenshot('dashboard.png', {
  mask: [page.locator('.timestamp'), page.locator('.avatar')],
  maxDiffPixels: 100,
  maxDiffPixelRatio: 0.01,
  fullPage: true,
});
```

- **expect(page).toHaveScreenshot(name)** — Full page or viewport
- **expect(locator).toHaveScreenshot(name)** — Element-only
- **maxDiffPixels / maxDiffPixelRatio** — Tolerance for minor rendering differences
- **mask** — Hide dynamic regions from comparison

See `references/config.md` for Playwright screenshot config.

## Percy Integration

```typescript
import percySnapshot from '@percy/playwright';

await percySnapshot(page, 'Homepage');
await percySnapshot(page, 'Dashboard', { widths: [1280, 768, 375] });
```

- **percySnapshot(page, name)** — Capture and upload to Percy
- **Percy CLI** — `npx percy exec -- npx playwright test`
- **BrowserStack Percy** — Cloud review, cross-browser, parallel execution

See `references/config.md` for Percy setup.

## BackstopJS Integration

```javascript
// backstop.json
{
  "scenarios": [
    {
      "label": "Homepage",
      "url": "http://localhost:3000",
      "viewports": [{ "width": 1280, "height": 720 }]
    }
  ]
}
```

- **backstop.json** — Scenarios, viewports, selectors, delay
- **backstop test** — Run comparisons
- **backstop approve** — Update baselines

See `references/config.md` for BackstopJS configuration.

## Output

- **Visual test scripts** — TypeScript/JavaScript with screenshot assertions
- **Baseline images** — Stored in `test-results/`, `backstop_data/`, or Percy cloud
- **Comparison reports** — HTML diff reports, Percy dashboard, Playwright artifacts

## Scope

**Can do (autonomous):**
- Generate visual regression tests from test case specs
- Use Playwright toHaveScreenshot, Percy, or BackstopJS
- Apply masking for dynamic content (timestamps, avatars, ads)
- Configure viewport variations (desktop/tablet/mobile)
- Set thresholds (maxDiffPixels, maxDiffPixelRatio)
- Disable animations for stable captures
- Create backstop.json scenarios

**Cannot do (requires confirmation):**
- Add Percy/BackstopJS dependencies without approval
- Configure Percy project token (user must provide)
- Override existing baseline images without approval

**Will not do (out of scope):**
- Execute tests (user runs `npx playwright test`, `backstop test`)
- Modify production UI code
- Set up Percy/BrowserStack accounts

## References

- `references/patterns.md` — Screenshot strategies, masking, viewports, thresholds
- `references/config.md` — Playwright, Percy, BackstopJS configuration
- `references/best-practices.md` — Baseline management, CI integration, dynamic content

## Quality Checklist

- [ ] Dynamic content masked (timestamps, avatars, ads)
- [ ] Animations disabled or reduced for stable captures
- [ ] Viewport variations defined where needed
- [ ] Thresholds configured to avoid false positives
- [ ] Baselines stored in version control (Playwright/BackstopJS)
- [ ] Traceability to test case IDs where applicable
- [ ] No hardcoded secrets (Percy token via env)

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Flaky visual diffs | Animations, timestamps, fonts | Mask dynamic regions; disable animations |
| Too many false positives | Threshold too strict | Increase maxDiffPixels or maxDiffPixelRatio |
| Baseline mismatch | Different OS/fonts/DPI | Run baselines in CI; use consistent environment |
| Percy upload fails | Missing token, network | Set PERCY_TOKEN; check Percy dashboard |
| BackstopJS no match | Wrong reference path | Run `backstop approve` to create baselines |
| Element screenshot empty | Element not visible | Ensure element in viewport; add wait |
