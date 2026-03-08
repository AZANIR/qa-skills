# Playwright Python Best Practices

Guidelines for maintainable, stable Playwright tests in Python.

## Page Object Model (POM)

### Structure

```
pages/
  __init__.py
  base_page.py      # Shared navigation, common helpers
  login_page.py     # Login-specific locators and methods
  dashboard_page.py # Dashboard-specific
components/
  __init__.py
  header.py         # Reusable header component
  modal.py          # Reusable modal
```

### Base Page

```python
# pages/base_page.py
from playwright.sync_api import Page

class BasePage:
    def __init__(self, page: Page, base_url: str):
        self.page = page
        self.base_url = base_url

    def goto(self, path: str):
        self.page.goto(f"{self.base_url}{path}")

    def get_by_test_id(self, test_id: str):
        return self.page.get_by_test_id(test_id)
```

### Page-Specific Class

```python
# pages/login_page.py
from playwright.sync_api import Page
from .base_page import BasePage

class LoginPage(BasePage):
    def __init__(self, page: Page, base_url: str):
        super().__init__(page, base_url)

    def login(self, email: str, password: str):
        self.page.get_by_label("Email").fill(email)
        self.page.get_by_label("Password").fill(password)
        self.page.get_by_role("button", name="Sign in").click()

    @property
    def error_message(self):
        return self.page.get_by_role("alert")
```

### Usage in Tests

```python
# tests/e2e/test_login.py
def test_login_flow(page: Page, base_url: str):
    login_page = LoginPage(page, base_url)
    login_page.goto("/login")
    login_page.login("user@example.com", "secret")
    expect(login_page.error_message).not_to_be_visible()
```

## Locator Priority

1. **get_by_role** — Accessibility-based; most resilient
2. **get_by_test_id** — `data-testid`; explicit, stable
3. **get_by_text** — Visible text; use for unique labels
4. **get_by_label** — Form labels; good for inputs
5. **locator** / CSS — Last resort; brittle for dynamic content

### Examples

```python
# Prefer
page.get_by_role("button", name="Submit")
page.get_by_test_id("submit-btn")
page.get_by_label("Email address")
page.get_by_text("Welcome back")

# Avoid when possible
page.locator(".btn-primary")
page.locator("#submit")
page.locator("div > span:nth-child(2)")
```

## Async Patterns

When using async mode (`playwright_pytest_asyncio = True`):

- Use `async def` for test functions
- Use `await` for all Playwright calls
- Do not mix sync and async in the same file
- Use `@pytest.mark.asyncio` if not using `asyncio_mode = "auto"`

```python
@pytest.mark.asyncio
async def test_async_login(page: Page):
    await page.goto("/login")
    await page.get_by_label("Email").fill("user@example.com")
    await page.get_by_role("button", name="Sign in").click()
    await expect(page).to_have_url(re.compile(r".*dashboard"))
```

## Test Isolation

- Each test gets a fresh `page` and `context` (function scope)
- No shared cookies, localStorage, or session between tests
- Use `storage_state` for auth when needed (via project or fixture)
- Clean up test data in `teardown` if tests create DB records

## Avoiding Flakiness

| Practice | Description |
|----------|-------------|
| **Auto-wait** | Playwright auto-waits; avoid `page.wait_for_timeout()` |
| **Assert before act** | Use `expect` to wait for readiness before clicking |
| **Stable selectors** | Prefer role/testid over CSS |
| **Isolation** | Each test gets fresh context |
| **Deterministic data** | Use fixtures, mocks; avoid time-dependent data |
| **No fixed delays** | Use `expect` with timeout or `wait_for_*` instead |

### Anti-Patterns

```python
# BAD: Fixed delay
page.wait_for_timeout(3000)

# GOOD: Wait for element
expect(page.get_by_role("heading")).to_be_visible()

# BAD: Brittle CSS
page.locator("div.container > div:nth-child(2) button").click()

# GOOD: Role or testid
page.get_by_role("button", name="Save").click()
```

## File Naming

| Convention | Example |
|------------|---------|
| Test files | `test_{feature}.py` (e.g., `test_login.py`, `test_dashboard.py`) |
| Page objects | `{page_name}_page.py` (e.g., `login_page.py`) |
| Fixtures | `conftest.py` (pytest discovers automatically) |

## Debugging

| Tool | Use |
|------|-----|
| `--headed` | Run with visible browser |
| `--slowmo 1000` | Slow down actions (ms) |
| `page.pause()` | Breakpoint; opens Playwright Inspector |
| `PWDEBUG=1 pytest` | Run in debug mode |
| `--screenshot=on-failure` | Capture screenshot on failure (via plugin options) |

## Fixtures for Common Setup

```python
# conftest.py
@pytest.fixture
def login_page(page: Page, base_url: str):
    from pages.login_page import LoginPage
    return LoginPage(page, base_url)

@pytest.fixture
def logged_in_user(page: Page, base_url: str):
    """Navigate to app and log in; return page."""
    page.goto(f"{base_url}/login")
    page.get_by_label("Email").fill("test@example.com")
    page.get_by_label("Password").fill("secret")
    page.get_by_role("button", name="Sign in").click()
    page.wait_for_url(re.compile(r".*dashboard"))
    return page
```

## Traceability

Link tests to test case IDs when applicable:

```python
@pytest.mark.tc_id("TC-001")
def test_login_with_valid_credentials(page: Page):
    ...
```

Use markers or docstrings for traceability to requirements/specs.
