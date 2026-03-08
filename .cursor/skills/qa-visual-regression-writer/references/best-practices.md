# Visual Testing Best Practices

Baseline management, CI integration, and dynamic content handling for visual regression testing.

## Baseline Management

### Initial Capture

1. **Ensure stable state** — Disable animations, wait for network idle
2. **Run with update flag** — `--update-snapshots` (Playwright), `backstop approve` (BackstopJS)
3. **Commit baselines** — Store reference images in version control (Playwright, BackstopJS)
4. **Percy** — First run creates baselines automatically

### Update Workflow

| Tool | Update Command | When to Use |
|------|----------------|-------------|
| Playwright | `npx playwright test --update-snapshots` | Intentional UI change |
| BackstopJS | `backstop approve` | Intentional UI change |
| Percy | Approve in dashboard | After reviewing diff |

### Review Process

1. **Run tests** — Detect visual changes
2. **Review diffs** — Playwright: `test-results/`, BackstopJS: `backstop_data/html_report/`
3. **Decide** — Intentional → approve; Bug → fix code
4. **Update** — Only approve when change is correct

### Baseline Hygiene

- **One baseline per viewport** — Don't mix viewports
- **Meaningful names** — `homepage-desktop.png` not `screenshot1.png`
- **Avoid bloating** — Capture only critical pages/elements
- **Branch strategy** — Baselines on main; feature branches compare against main

## CI Integration

### Playwright in CI

```yaml
# GitHub Actions
- name: Run visual tests
  run: npx playwright test visual/
  env:
    CI: true

- name: Update snapshots (on main, when approved)
  if: github.ref == 'refs/heads/main' && github.event_name == 'workflow_dispatch'
  run: npx playwright test visual/ --update-snapshots
```

### Percy in CI

```yaml
- name: Percy snapshots
  run: percy exec -- npx playwright test
  env:
    PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
    PERCY_BRANCH: ${{ github.ref_name }}
```

### BackstopJS in CI

```yaml
- name: Backstop test
  run: npx backstop test
- name: Upload report
  uses: actions/upload-artifact@v4
  with:
    name: backstop-report
    path: backstop_data/html_report
```

### Fail on Diff

- **Playwright:** Fails by default when diff exceeds threshold
- **Percy:** Fails when unapproved diffs exist (configurable)
- **BackstopJS:** Fails when `misMatchThreshold` exceeded

## Dynamic Content Handling

### Strategy Hierarchy

1. **Mask** — Hide dynamic regions (timestamps, avatars)
2. **Stub** — Replace with static data (API mocking)
3. **Wait** — Ensure content loaded before capture
4. **Ignore** — Increase threshold if unavoidable

### API Mocking for Consistency

```typescript
test('dashboard visual', async ({ page }) => {
  await page.route('**/api/user', (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({ name: 'Test User', avatar: '/static/avatar.png' }),
    })
  );
  await page.goto('/dashboard');
  await expect(page).toHaveScreenshot('dashboard.png');
});
```

### Deterministic Data

- Use fixed dates in test data
- Seed database with known state
- Mock external services (maps, analytics)

### Font and Rendering Consistency

- **Same OS in CI** — Use Linux in CI if baselines from Linux
- **System fonts** — Or bundle fonts to avoid OS differences
- **Threshold** — Use `maxDiffPixelRatio` for subpixel tolerance

## Test Organization

### Structure

```
visual/
  homepage.spec.ts
  login.spec.ts
  __snapshots__/
    homepage.spec.ts-snapshots/
      homepage-chromium.png
      homepage-mobile-chromium.png
```

### Naming Conventions

- **Page:** `{page-name}-{viewport}.png`
- **Element:** `{element}-{state}.png` (e.g., `modal-open.png`)
- **Scenario:** Descriptive; avoid numbers

### Scope

- **Critical paths** — Login, checkout, key flows
- **High-traffic pages** — Homepage, product pages
- **Layout-sensitive** — Responsive breakpoints
- **Avoid** — Low-value pages, rarely changed UI

## Performance

- **Parallelize** — Playwright and Percy support parallel runs
- **Limit viewports** — Test 2–3 key breakpoints, not every device
- **Lazy capture** — Only capture when test reaches checkpoint
- **Cache baselines** — CI cache `__snapshots__` / `backstop_data` when appropriate

## Security

- **No secrets in screenshots** — Mask tokens, passwords, PII
- **Percy token** — Store in CI secrets, never commit
- **Test URLs** — Use staging/test envs, not production with real data
