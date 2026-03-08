---
name: qa-playwright-ts-writer
description: Generate Playwright E2E, component, and unit tests for TypeScript with auto-wait, multi-browser support, POM pattern, and live browser record mode via Playwright MCP.
output_dir: tests/e2e
---

# QA Playwright TypeScript Writer

## Purpose

Write Playwright tests (E2E, component, unit) from test case specifications. Transform structured test cases into executable Playwright test files with auto-waiting, multi-browser support, Page Object Model, and optional live browser record mode.

## Trigger Phrases

- "Write Playwright tests for [feature/flow]"
- "Generate E2E tests from test cases"
- "Create Playwright tests with record mode"
- "Add Playwright component tests for [component]"
- "Playwright tests for [URL/flow]"
- "Record browser interactions and generate test code"
- "POM-based Playwright tests for [page]"
- "Multi-browser Playwright tests"
- "Heal my failing Playwright tests"

## Three Modes

| Mode | When to Use | Behavior |
|------|-------------|----------|
| **Record Mode** | User wants live browser capture | Use Playwright MCP (e.g., cursor-ide-browser) → navigate, interact, capture interactions → generate test code from recorded steps |
| **Generate Mode** | Default; from test case specs | Read test cases (from qa-testcase-from-docs, qa-testcase-from-ui, qa-manual-test-designer) → generate Playwright code |
| **Heal Mode** | Tests fail after changes | Delegate to **qa-test-healer** to auto-fix broken selectors, assertions, waits; mark unfixable as `test.fixme()` |

## Test Types

| Type | Scope | Approach |
|------|-------|----------|
| **E2E** | Full user flows, page navigation | page.goto, locators, assertions, network interception, multi-browser |
| **Component** | Isolated component testing | @playwright/experimental-ct-react, ct-vue, ct-svelte; mount, interact, assert |
| **Unit** | Pure functions, utilities | Use test runner for logic; Playwright optional for DOM utilities |

## E2E Testing

- **Navigation:** page.goto, page.goBack, page.reload
- **Interactions:** click, fill, selectOption, check, hover, press
- **Assertions:** expect(locator).toBeVisible, toHaveText, toHaveURL, etc.
- **Network:** page.route for API mocking, request/response interception
- **Multi-browser:** Chromium, Firefox, WebKit via projects in config
- **Auto-wait:** Playwright auto-waits for elements; avoid page.waitForTimeout

See `references/patterns.md` for navigation, forms, auth, file upload, drag-drop, iframes, multi-tab, API mocking, visual comparison.

## Component Testing

- **React:** `@playwright/experimental-ct-react` — mount components, pass props, assert
- **Vue:** `@playwright/experimental-ct-vue` — mount, slots, provide/inject
- **Svelte:** `@playwright/experimental-ct-svelte` — mount, component API

Component tests run in isolated browser context; use `test` from `@playwright/experimental-ct-*`.

## Page Object Model (POM)

- **Base page:** Shared selectors, navigation helpers, common actions
- **Page-specific:** Extend base; encapsulate page-specific locators and methods
- **Component objects:** Reusable components (header, modal, form) as classes

See `references/best-practices.md` for POM structure.

## Key Patterns

- **Structure:** test.describe / test / test.step for grouping
- **Locators:** getByRole > getByTestId > getByText > getByLabel > CSS selector
- **Assertions:** expect(locator).toBeVisible, toHaveText, toHaveURL, toHaveCount, etc.
- **Network:** page.route(url, handler) for mocking; page.unroute to clear
- **Fixtures:** test.extend for custom fixtures (auth, API client)
- **Steps:** test.step('description', async () => { ... }) for trace grouping

See `references/assertions.md` for full assertion reference.

## Locator Priority

1. **getByRole** — Accessibility-based; most resilient
2. **getByTestId** — data-testid; explicit, stable
3. **getByText** — Visible text; use for unique labels
4. **getByLabel** — Form labels; good for inputs
5. **CSS selector** — Last resort; brittle for dynamic content

## Configuration

- **playwright.config.ts** — projects (browsers), retries, workers, reporter, baseURL
- **Global setup/teardown** — Auth state, DB seeding
- **Test directory** — e2e/, tests/, or colocated

See `references/config.md` for full config guide.

## MCP Integration

- **Context7 MCP** — Fetch Playwright documentation when needed
- **Playwright MCP** (cursor-ide-browser, @playwright/mcp) — Record mode: navigate, snapshot, click, type; capture interactions → generate test code

## Scope

**Can do (autonomous):**
- Generate Playwright E2E, component, unit tests from test case specs
- Use Record Mode with Playwright MCP to capture and generate tests
- Apply POM pattern, stable locators, auto-wait
- Configure playwright.config.ts (projects, retries, reporter)
- Use page.route for API mocking
- Delegate to qa-test-healer when tests fail (Heal Mode)
- Use Context7 MCP for Playwright docs

**Cannot do (requires confirmation):**
- Change production code structure
- Add dependencies not in package.json
- Override project Playwright config without approval
- Navigate to URLs not provided (Record Mode)

**Will not do (out of scope):**
- Execute tests (user runs `npx playwright test`)
- Write Jest/Vitest unit tests (use qa-jest-writer)
- Modify CI/CD pipelines
- Bypass security or access restricted areas

## References

- `references/patterns.md` — Navigation, forms, auth, file upload, drag-drop, iframes, multi-tab, API mocking, visual
- `references/assertions.md` — Playwright assertion reference
- `references/config.md` — playwright.config.ts, projects, reporter, setup
- `references/best-practices.md` — POM, locators, flakiness, isolation, debugging

## Quality Checklist

- [ ] Auto-wait used; no page.waitForTimeout (use expect with timeout or waitFor)
- [ ] No hardcoded waits; prefer expect auto-retry
- [ ] POM pattern applied for page-specific logic
- [ ] Stable locators (getByRole, getByTestId preferred)
- [ ] Tests independent (no shared state, order-independent)
- [ ] Proper teardown (fixtures, afterEach if needed)
- [ ] Traceability to test case IDs where applicable
- [ ] No hardcoded secrets (use env vars)

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Element not found | Selector too specific, dynamic content | Use getByRole/getByTestId; add data-testid if needed |
| Timeout | Element not ready, slow network | Increase expect timeout; use waitFor; check for overlays |
| Flaky tests | Race conditions, shared state | Ensure test isolation; use auto-wait; avoid fixed delays |
| Record mode empty | MCP not capturing steps | Verify Playwright MCP active; lock browser before actions |
| Multi-tab fails | Wrong context | Use page.context().pages() or new context for new tab |
| API mock not applied | Route registered after request | Call page.route before page.goto |
| Component test fails | Missing mount setup | Check ct config; ensure component imported correctly |
