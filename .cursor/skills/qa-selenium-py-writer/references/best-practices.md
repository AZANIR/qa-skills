# Selenium Python Best Practices

Guidelines for maintainable, reliable Selenium E2E tests.

## Explicit Waits (Never Implicit)

**Always use explicit waits** for element availability. Implicit waits apply globally and can cause unpredictable behavior when combined with explicit waits.

```python
# Good
element = WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located((By.ID, "submit"))
)
element.click()

# Bad
driver.implicitly_wait(10)  # Avoid; masks timing issues
driver.find_element(By.ID, "submit").click()
```

**Exception:** A single short implicit wait (e.g., 2–5 seconds) at driver init can reduce boilerplate for stable pages, but explicit waits are still preferred for critical interactions.

## Page Object Model (POM)

Encapsulate page structure and actions in dedicated classes:

```python
# pages/base.py
class BasePage:
    def __init__(self, driver, base_url):
        self.driver = driver
        self.base_url = base_url

    def open(self, path=""):
        self.driver.get(f"{self.base_url}{path}")

    def find(self, by, value):
        return WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((by, value))
        )


# pages/login.py
class LoginPage(BasePage):
    @property
    def username(self):
        return self.find(By.ID, "username")

    @property
    def password(self):
        return self.find(By.ID, "password")

    def login(self, user, pwd):
        self.username.send_keys(user)
        self.password.send_keys(pwd)
        self.find(By.CSS_SELECTOR, "button[type='submit']").click()
```

Benefits: reuse, easier maintenance, clearer tests.

## Stable Locators

Prefer locators that are less likely to break when the UI changes:

| Priority | Locator | Stability |
| -------- | ------- | --------- |
| 1 | By.ID | High (if IDs are stable) |
| 2 | By.NAME | High for form fields |
| 3 | data-testid | High (add to markup for tests) |
| 4 | By.CSS_SELECTOR (semantic) | Medium |
| 5 | By.XPATH (text) | Low (breaks with i18n) |
| 6 | By.CLASS_NAME | Low (styling changes) |

```python
# Prefer
driver.find_element(By.ID, "login-form")
driver.find_element(By.CSS_SELECTOR, "[data-testid='submit-btn']")

# Avoid when possible
driver.find_element(By.XPATH, "//div[@class='btn-primary']/span")
driver.find_element(By.CLASS_NAME, "btn-primary")  # Styling may change
```

## Driver Management

- **One driver per test** — Use function-scoped fixtures to avoid shared state.
- **Always quit** — Use `yield` in fixtures to ensure `driver.quit()` runs.
- **Avoid global driver** — Prefer dependency injection via fixtures.

```python
@pytest.fixture(scope="function")
def driver():
    driver = webdriver.Chrome(options=options)
    try:
        yield driver
    finally:
        driver.quit()
```

## Test Isolation

- Each test should be independent.
- Do not rely on test execution order.
- Reset application state when needed (e.g., logout, clear data).
- Use fresh driver instances per test.

## Avoid Sleep

Replace `time.sleep()` with explicit waits:

```python
# Bad
time.sleep(5)
element.click()

# Good
WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.ID, "submit"))
).click()
```

## ActionChains for Complex Interactions

Use ActionChains for hover, drag-and-drop, and modifier keys:

```python
from selenium.webdriver.common.action_chains import ActionChains

actions = ActionChains(driver)
actions.move_to_element(menu).click(submenu).perform()
```

## Select for Dropdowns

Use the `Select` class instead of raw clicks for `<select>` elements:

```python
from selenium.webdriver.support.ui import Select

select = Select(driver.find_element(By.ID, "country"))
select.select_by_visible_text("United States")
```

## Screenshots on Failure

```python
# conftest.py
@pytest.hookimpl(tryfirst=True, hookwrapper=True)
def pytest_runtest_makereport(item, call):
    outcome = yield
    report = outcome.get_result()
    if report.when == "call" and report.failed:
        driver = item.funcargs.get("driver", None)
        if driver:
            driver.save_screenshot(f"failure_{item.name}.png")
```

## Anti-Patterns to Avoid

| Anti-Pattern | Better Approach |
| ------------ | --------------- |
| Implicit wait as primary strategy | Explicit WebDriverWait + EC |
| `time.sleep()` for synchronization | WebDriverWait with expected conditions |
| Raw XPATH with long chains | ID, data-testid, or shorter CSS |
| Shared mutable driver across tests | Function-scoped fixture |
| Hardcoded credentials | Env vars, fixtures, or test config |
| Asserting implementation details | Assert user-visible outcomes |
| One giant test | Split into focused scenarios |

## CI/CD Considerations

- Use headless mode: `--headless=new` (Chrome).
- Add `--no-sandbox` and `--disable-dev-shm-usage` for Docker/CI.
- Use webdriver-manager or pre-installed drivers.
- Consider retries for flaky tests: `pytest --reruns 2`.
