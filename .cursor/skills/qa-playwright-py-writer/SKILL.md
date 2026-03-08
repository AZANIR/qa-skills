---
name: qa-playwright-py-writer
description: Generate Playwright E2E tests for Python with async/sync API, pytest-playwright integration, POM pattern, and live browser record mode via Playwright MCP.
output_dir: tests/e2e
---

# QA Playwright Python Writer

## Purpose

Write Playwright E2E tests for Python from test case specifications. Transform structured test cases into executable Playwright Python test files with pytest-playwright, Page Object Model, auto-waiting, multi-browser support, and optional live browser record mode.

## Trigger Phrases

- "Write Playwright Python tests for [feature/flow]"
- "Generate Playwright E2E tests in Python"
- "Create pytest-playwright tests"
- "Add Playwright tests with record mode (Python)"
- "Playwright Python tests for [URL/flow]"
- "POM-based Playwright tests in Python"
- "pytest-playwright tests for [page]"
- "Heal my failing Playwright Python tests"

## Three Modes

| Mode | When to Use | Behavior |
|------|-------------|----------|
| **Record Mode** | User wants live browser capture | Use Playwright MCP (e.g., cursor-ide-browser) → navigate, interact, capture interactions → generate Python test code from recorded steps |
| **Generate Mode** | Default; from test case specs | Read test cases (from qa-testcase-from-docs, qa-testcase-from-ui, qa-manual-test-designer) → generate Playwright Python code |
| **Heal Mode** | Tests fail after changes | Delegate to **qa-test-healer** to auto-fix broken selectors, assertions, waits; mark unfixable as `pytest.mark.skip` |

## Key Features

| Feature | Description |
|---------|-------------|
| **Sync/Async API** | Default sync API; async via `playwright_pytest_asyncio = True` in pytest config |
| **pytest-playwright** | Fixtures: `page`, `browser`, `context`, `playwright`; integrates with pytest |
| **POM pattern** | Base page classes, page-specific classes, component objects |
| **Auto-wait** | Playwright auto-waits for elements; avoid `page.wait_for_timeout` |
| **Multi-browser** | Chromium, Firefox, WebKit via pytest-playwright browser options |
| **Network interception** | `page.route` for API mocking, request/response handling |

## Workflow

1. **Read test cases** — From specs, requirements, or manual test designs
2. **Analyze app** — Inspect pages, flows, selectors (or use Record Mode)
3. **Generate tests** — Produce `test_{feature}.py` with POM where appropriate
4. **Configure** — Add/update `conftest.py`, `pytest.ini` or `pyproject.toml`
5. **Run** — User runs `pytest` to execute tests

## E2E Testing

- **Navigation:** `page.goto()`, `page.go_back()`, `page.reload()`
- **Interactions:** `click()`, `fill()`, `select_option()`, `check()`, `hover()`, `press()`
- **Assertions:** `expect(locator).to_be_visible()`, `to_have_text()`, `to_have_url()`, etc.
- **Network:** `page.route()` for API mocking, request/response interception
- **Auto-wait:** Playwright auto-waits; avoid `page.wait_for_timeout()`

See `references/patterns.md` for navigation, forms, auth, file upload, drag-drop, iframes, multi-tab, API mocking, visual comparison.

## Page Object Model (POM)

- **Base page:** Shared selectors, navigation helpers, common actions
- **Page-specific:** Extend base; encapsulate page-specific locators and methods
- **Component objects:** Reusable components (header, modal, form) as classes

See `references/best-practices.md` for POM structure.

## Key Patterns

- **Structure:** `def test_*()` functions; `pytest.mark` for grouping; `conftest.py` for fixtures
- **Locators:** `get_by_role` > `get_by_test_id` > `get_by_text` > `get_by_label` > CSS selector
- **Assertions:** `expect(locator).to_be_visible()`, `to_have_text()`, `to_have_url()`, `to_have_count()`, etc.
- **Network:** `page.route(url, handler)` for mocking; `page.unroute()` to clear
- **Fixtures:** `page`, `browser`, `context`, `playwright` from pytest-playwright; custom fixtures in conftest.py

See `references/patterns.md` for full pattern reference.

## Locator Priority

1. **get_by_role** — Accessibility-based; most resilient
2. **get_by_test_id** — `data-testid`; explicit, stable
3. **get_by_text** — Visible text; use for unique labels
4. **get_by_label** — Form labels; good for inputs
5. **CSS selector** — Last resort; brittle for dynamic content

## File Naming

- **Tests:** `test_{feature}.py` (e.g., `test_login.py`, `test_checkout.py`)
- **Fixtures:** `conftest.py` in test directory or package root
- **Page objects:** `pages/` or `page_objects/` directory

## Configuration

- **pytest.ini** / **pyproject.toml** — pytest options, markers, playwright settings
- **conftest.py** — Shared fixtures, base URL, browser options
- **pytest-playwright** — Provides `page`, `browser`, `context` fixtures

See `references/config.md` for full config guide.

## MCP Integration

- **Context7 MCP** — Fetch Playwright Python documentation when needed
- **Playwright MCP** (cursor-ide-browser, @playwright/mcp) — Record mode: navigate, snapshot, click, type; capture interactions → generate Python test code

## Scope

**Can do (autonomous):**
- Generate Playwright E2E tests in Python from test case specs
- Use Record Mode with Playwright MCP to capture and generate tests
- Apply POM pattern, stable locators, auto-wait
- Configure conftest.py, pytest.ini, pyproject.toml for pytest-playwright
- Use `page.route()` for API mocking
- Delegate to qa-test-healer when tests fail (Heal Mode)
- Use Context7 MCP for Playwright Python docs

**Cannot do (requires confirmation):**
- Change production code structure
- Add dependencies not in requirements.txt / pyproject.toml
- Override project pytest/playwright config without approval
- Navigate to URLs not provided (Record Mode)

**Will not do (out of scope):**
- Execute tests (user runs `pytest`)
- Write pytest unit tests without Playwright (use qa-pytest-writer)
- Modify CI/CD pipelines
- Bypass security or access restricted areas

## References

- `references/patterns.md` — Sync vs async, pytest fixtures, POM, network mocking
- `references/config.md` — pytest-playwright, conftest.py, pytest.ini, browser config
- `references/best-practices.md` — POM, locators, async patterns, test isolation

## Quality Checklist

- [ ] Auto-wait used; no `page.wait_for_timeout` (use `expect` with timeout or `wait_for`)
- [ ] No hardcoded waits; prefer `expect` auto-retry
- [ ] POM pattern applied for page-specific logic
- [ ] Stable locators (get_by_role, get_by_test_id preferred)
- [ ] Tests independent (no shared state, order-independent)
- [ ] Proper teardown (fixtures, conftest if needed)
- [ ] Traceability to test case IDs where applicable
- [ ] No hardcoded secrets (use env vars)

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Element not found | Selector too specific, dynamic content | Use get_by_role/get_by_test_id; add data-testid if needed |
| Timeout | Element not ready, slow network | Increase expect timeout; use wait_for; check for overlays |
| Flaky tests | Race conditions, shared state | Ensure test isolation; use auto-wait; avoid fixed delays |
| Record mode empty | MCP not capturing steps | Verify Playwright MCP active; lock browser before actions |
| Sync/async conflict | Mixing sync and async fixtures | Use one mode per file; set playwright_pytest_asyncio consistently |
| API mock not applied | Route registered after request | Call page.route before page.goto |
| Fixture not found | conftest.py not in path | Ensure conftest.py in test directory or parent |
