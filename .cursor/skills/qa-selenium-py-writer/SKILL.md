---
name: qa-selenium-py-writer
description: Generate Selenium E2E tests for Python with WebDriver, explicit/implicit waits, Page Object Model, and headless browser support.
output_dir: tests/e2e
---

# QA Selenium Python Writer

## Purpose

Write Selenium Python E2E tests from test case specifications. Transform structured test cases (from qa-testcase-from-docs, qa-manual-test-designer, qa-browser-data-collector, or specs) into executable Selenium test files with WebDriver, explicit waits, Page Object Model, and headless browser support.

## Trigger Phrases

- "Write Selenium tests for [feature/flow]"
- "Generate Selenium E2E tests from test cases"
- "Create Selenium Python tests with POM"
- "Add Selenium tests for [URL/page]"
- "Selenium tests with WebDriver for [browser]"
- "Selenium Python Page Object Model tests"
- "Headless Selenium tests for [feature]"
- "Selenium tests with explicit waits"
- "Heal my failing Selenium tests"

## Key Features

| Feature | Description |
| ------- | ----------- |
| **WebDriver** | Chrome, Firefox, Edge, Safari via Selenium WebDriver |
| **Explicit waits** | WebDriverWait + expected_conditions; avoid implicit waits |
| **Implicit waits** | Fallback only; prefer explicit waits |
| **Page Object Model** | POM with @property for locators; base page + page-specific classes |
| **Headless mode** | Chrome/Firefox headless for CI and faster runs |
| **ActionChains** | Complex interactions: drag-drop, hover, key combos |
| **Select** | Dropdown handling via Select class |
| **pytest integration** | Fixtures for driver setup/teardown, conftest.py |

## Workflow

1. **Read test cases** — From specs, requirements, manual test designs, or browser-collected data
2. **Analyze app** — Inspect pages, forms, flows; identify locators and interactions
3. **Generate tests with POM** — Produce `test_{feature}.py` with Page Objects
4. **Configure WebDriver** — Set up driver fixtures, headless options, timeouts
5. **Run** — User runs `pytest` to execute tests

## Context7 MCP

Use **Context7 MCP** for Selenium Python documentation when:
- WebDriver API or expected_conditions syntax is uncertain
- ActionChains, Select, or alert handling needs verification
- Browser-specific options (Chrome, Firefox headless) require up-to-date reference

## Key Patterns

| Pattern | Usage |
| ------- | ----- |
| `driver.get(url)` | Navigate to URL |
| `driver.find_element(By.ID, "id")` | Find by ID |
| `driver.find_element(By.CSS_SELECTOR, "selector")` | Find by CSS |
| `driver.find_element(By.XPATH, "xpath")` | Find by XPath |
| `driver.find_element(By.NAME, "name")` | Find by name |
| `driver.find_element(By.CLASS_NAME, "class")` | Find by class |
| `WebDriverWait(driver, timeout).until(EC.visibility_of_element_located(...))` | Explicit wait |
| POM with `@property` | Encapsulate locators in page classes |
| `ActionChains(driver)` | Drag, hover, key combos |
| `Select(element)` | Dropdown select by value/text/index |

## Wait Strategies

Prefer explicit waits; avoid implicit waits for reliability:

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

wait = WebDriverWait(driver, 10)
element = wait.until(EC.visibility_of_element_located((By.ID, "submit-btn")))
element.click()
```

Common expected conditions: `visibility_of_element_located`, `element_to_be_clickable`, `presence_of_element_located`, `text_to_be_present_in_element`, `url_contains`.

## pytest Integration

- **Fixtures** — `driver` fixture for setup/teardown; scope function or class
- **conftest.py** — Shared driver factory, base URL, browser options
- **File naming** — `test_{feature}.py` (e.g., `test_login.py`, `test_checkout.py`)

See `references/config.md` for pytest + Selenium setup.

## File Naming

- `test_{feature}.py` — Preferred (e.g., `test_login.py`, `test_search.py`)
- Page objects: `pages/{page_name}_page.py` or `page_objects/{name}.py`
- Place in `tests/` per project convention

## Scope

**Can do (autonomous):**
- Generate Selenium Python E2E tests from test case specs
- Apply Page Object Model with @property locators
- Use explicit waits (WebDriverWait + expected_conditions)
- Configure WebDriver (Chrome, Firefox, Edge, headless)
- Use ActionChains for complex interactions; Select for dropdowns
- Integrate with pytest via fixtures and conftest.py
- Use Context7 MCP for Selenium Python docs
- Delegate to qa-test-healer when tests fail (Heal Mode)

**Cannot do (requires confirmation):**
- Change production code structure
- Add dependencies not in requirements.txt
- Override project Selenium/pytest config without approval
- Navigate to URLs not provided

**Will not do (out of scope):**
- Execute tests (user runs `pytest`)
- Write Playwright/Cypress tests (use qa-playwright-ts-writer, qa-cypress-writer)
- Modify CI/CD pipelines
- Bypass security or access restricted areas

## References

- `references/patterns.md` — Locators, waits, POM, ActionChains, Select, file upload, alerts, frames, windows
- `references/config.md` — WebDriver manager, pytest integration, headless config
- `references/best-practices.md` — Explicit waits, POM, stable locators, driver management

## Quality Checklist

- [ ] Explicit waits used; avoid implicit waits where possible
- [ ] No hardcoded sleeps; prefer WebDriverWait + expected_conditions
- [ ] POM pattern applied for page-specific logic
- [ ] Stable locators (ID, data attributes, CSS; XPath as fallback)
- [ ] Tests independent (no shared state, order-independent)
- [ ] Proper teardown (driver.quit in fixture)
- [ ] Traceability to test case IDs where applicable
- [ ] No hardcoded secrets (use env vars)
- [ ] File naming follows `test_{feature}.py` convention

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Element not found | Selector too specific, timing | Use explicit wait; prefer ID/CSS over fragile XPath |
| StaleElementReferenceException | DOM changed after find | Re-find element before interaction; use explicit wait |
| Timeout | Element not ready, slow page | Increase WebDriverWait timeout; check for overlays/modals |
| Flaky tests | Implicit wait, race conditions | Replace implicit with explicit waits; ensure test isolation |
| Driver not found | WebDriver binary missing | Use webdriver-manager; ensure browser installed |
| Headless fails | Browser options incorrect | Verify Chrome/Firefox headless options for your Selenium version |
| Select fails | Not a select element | Use Select only on `<select>` elements; check element type |
