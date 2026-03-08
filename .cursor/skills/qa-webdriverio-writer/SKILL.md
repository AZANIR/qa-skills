---
name: qa-webdriverio-writer
description: Generate WebdriverIO E2E and mobile web tests for TypeScript using W3C WebDriver protocol with multi-browser support, Appium integration, and Page Object pattern.
output_dir: tests/e2e
---

# QA WebdriverIO Writer

## Purpose

Write WebdriverIO E2E and mobile web tests from test case specifications. Transform structured test cases into executable TypeScript test files using the W3C WebDriver protocol, multi-browser support, Appium for mobile web, and the Page Object pattern.

## Trigger Phrases

- "Write WebdriverIO tests for [feature/flow]"
- "Generate WebdriverIO E2E tests from test cases"
- "Create WebdriverIO tests with Page Objects"
- "Add WebdriverIO mobile web tests"
- "WebdriverIO tests for [URL/flow]"
- "Multi-browser WebdriverIO tests"
- "Appium + WebdriverIO tests for mobile web"
- "WDIO tests with custom commands"

## Workflow

1. **Read test cases** — From qa-testcase-from-docs, qa-manual-test-designer, qa-browser-data-collector
2. **Analyze target** — Page structure, selectors, mobile vs desktop
3. **Generate test files** — Create `*.spec.ts` in `test/specs/` or project convention
4. **Add Page Objects** — Encapsulate selectors and actions in `pageobjects/`
5. **Configure wdio.conf.ts** — Capabilities, services, reporters

## Key Features

- **W3C WebDriver protocol** — Standard browser automation
- **Multi-browser** — Chrome, Firefox, Safari, Edge via capabilities
- **Appium integration** — Mobile web testing (iOS Safari, Android Chrome)
- **Page Object pattern** — Encapsulate page logic, reusable selectors
- **Built-in wait strategies** — `waitForDisplayed`, `waitForClickable`, `waitForExist`
- **WDIO test runner** — Parallel execution, retries, reporters

## Test Types

| Type | Scope | Approach |
|------|-------|----------|
| **E2E** | Full user flows, page navigation | browser.url, $(), $$(), click, setValue, getText |
| **Mobile Web** | Mobile browser testing | Appium service, mobile capabilities, viewport |

## E2E Testing

- **Navigation:** `browser.url()`, `browser.back()`, `browser.refresh()`
- **Selectors:** `$('selector')` single element, `$$('selector')` element array
- **Actions:** `.click()`, `.setValue()`, `.addValue()`, `.clearValue()`, `.selectByVisibleText()`
- **Getters:** `.getText()`, `.getAttribute()`, `.getValue()`, `.isDisplayed()`
- **Waits:** `.waitForDisplayed()`, `.waitForClickable()`, `.waitForExist()`, `browser.waitUntil()`

See `references/patterns.md` for selectors, waits, Page Objects, custom commands, file upload, multiremote.

## Page Object Pattern

- **Base page:** Shared selectors, navigation helpers, common actions
- **Page-specific:** Extend base; encapsulate page-specific locators and methods
- **WDIO Page Object** — Use `get` getters for lazy element resolution

See `references/best-practices.md` for Page Object structure.

## Key Patterns

- **Structure:** `describe` / `it`, `before` / `after`, `beforeEach` / `afterEach`
- **Selectors:** CSS, XPath, accessibility (aria), data attributes
- **Assertions:** `expect()` (Chai/Expect), `browser.assert` (if using expect-webdriverio)
- **Custom commands:** `browser.addCommand()` for reusable actions
- **Multiremote:** Run same test across multiple browsers in parallel

## Services

| Service | Purpose |
|---------|---------|
| `@wdio/local-runner` | Local test execution |
| `@wdio/mocha-framework` | Mocha describe/it (or Jasmine, Cucumber) |
| `wdio-chromedriver-service` | ChromeDriver for Chrome |
| `@wdio/appium-service` | Appium for mobile web |
| `@wdio/selenium-standalone-service` | Selenium Grid / standalone |

## Configuration

- **wdio.conf.ts** — Capabilities, services, framework, reporters, specs
- **Multi-capability** — Run same tests on multiple browsers
- **Environment-specific** — baseUrl, timeouts via config

See `references/config.md` for full configuration guide.

## Context7 MCP

Uses Context7 MCP to fetch WebdriverIO documentation when needed. Query for WebdriverIO API, selectors, or configuration when patterns are unclear.

## Scope

**Can do (autonomous):**
- Generate WebdriverIO E2E and mobile web tests from test cases
- Apply Page Object pattern with getters and methods
- Add custom commands via `browser.addCommand()`
- Configure wdio.conf.ts (capabilities, services, reporters)
- Use multiremote for parallel browser testing
- Use Context7 MCP for WebdriverIO docs

**Cannot do (requires confirmation):**
- Change production code structure
- Add dependencies not in package.json
- Override project WDIO config without approval
- Modify Appium server configuration

**Will not do (out of scope):**
- Execute tests (user runs `npx wdio run wdio.conf.ts`)
- Write Jest/Vitest unit tests (use qa-jest-writer)
- Modify CI/CD pipelines
- Native mobile app testing (Appium native, not mobile web)

## References

- `references/patterns.md` — Selectors, waits, Page Objects, custom commands, file upload, multiremote
- `references/config.md` — wdio.conf.ts, capabilities, services, reporters
- `references/best-practices.md` — Stable selectors, wait strategies, Page Objects, parallel execution

## Quality Checklist

- [ ] Explicit waits used; avoid `browser.pause()` in committed code
- [ ] Page Object pattern applied for page-specific logic
- [ ] Stable selectors (data-testid, aria, semantic over brittle CSS)
- [ ] Tests independent (no shared state, order-independent)
- [ ] Proper teardown (afterEach, cleanup)
- [ ] Traceability to test case IDs where applicable
- [ ] No hardcoded secrets (use env vars)
- [ ] Capabilities match target browsers

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Element not found | Selector too specific, timing | Use data-testid; add waitForDisplayed before action |
| Stale element | DOM changed after query | Re-query element; use getters in Page Objects |
| Timeout on wait | Element never meets condition | Verify selector; check overlays, iframes |
| Multiremote fails | Capability mismatch | Ensure all browsers support same commands |
| Appium not starting | Service/config issue | Check @wdio/appium-service; verify Appium installed |
| ChromeDriver version mismatch | Chrome updated | Update wdio-chromedriver-service or chromedriver |
| Flaky tests | Race conditions | Use waitForDisplayed/waitForClickable; avoid fixed delays |
