# Playwright Python Patterns

Common patterns for E2E testing with Playwright Python (sync and async API).

## Sync vs Async API

| API | Import | Use Case |
|-----|--------|----------|
| **Sync** | `from playwright.sync_api import Page, expect` | Default; simpler, pytest-playwright fixtures |
| **Async** | `from playwright.async_api import Page, expect` | Async test suites; `playwright_pytest_asyncio = True` in pytest.ini |

```python
# Sync (default)
def test_login(page: Page):
    page.goto("/login")
    page.get_by_label("Email").fill("user@example.com")
    page.get_by_label("Password").fill("secret")
    page.get_by_role("button", name="Sign in").click()
    expect(page).to_have_url(re.compile(r".*dashboard"))

# Async (requires playwright_pytest_asyncio)
@pytest.mark.asyncio
async def test_login_async(page: Page):
    await page.goto("/login")
    await page.get_by_label("Email").fill("user@example.com")
    await page.get_by_role("button", name="Sign in").click()
```

## Pytest Fixtures (pytest-playwright)

| Fixture | Scope | Description |
|---------|-------|-------------|
| `playwright` | Session | Playwright instance |
| `browser_type` | Session | Chromium, Firefox, or WebKit launcher |
| `browser` | Function | Browser instance |
| `context` | Function | Browser context (isolated) |
| `page` | Function | Page (tab) for tests |
| `browser_context_args` | Function | Override context options |
| `browser_name` | Session | `chromium`, `firefox`, or `webkit` |

```python
def test_with_page(page: Page):
    page.goto("https://example.com")
    assert page.title() == "Example Domain"

def test_with_context(context: BrowserContext, page: Page):
    # context and page are fresh per test
    page.goto("/")
```

## Navigation

| Pattern | Sync | Async |
|---------|------|-------|
| Go to URL | `page.goto("/login")` | `await page.goto("/login")` |
| Go back | `page.go_back()` | `await page.go_back()` |
| Reload | `page.reload()` | `await page.reload()` |
| Wait for URL | `page.wait_for_url("**/dashboard")` | `await page.wait_for_url("**/dashboard")` |

```python
def test_navigates_after_login(page: Page):
    page.goto("/login")
    page.get_by_label("Email").fill("user@example.com")
    page.get_by_label("Password").fill("secret")
    page.get_by_role("button", name="Sign in").click()
    page.wait_for_url(re.compile(r".*dashboard"))
    expect(page).to_have_url(re.compile(r".*dashboard"))
```

## Forms

| Pattern | Example |
|---------|---------|
| Fill text | `page.get_by_label("Name").fill("John")` |
| Fill by role | `page.get_by_role("textbox", name="Email").fill("a@b.com")` |
| Select dropdown | `page.get_by_label("Country").select_option("US")` |
| Check checkbox | `page.get_by_role("checkbox", name="Subscribe").check()` |
| Radio | `page.get_by_role("radio", name="Option A").check()` |
| Submit | `page.get_by_role("button", name="Submit").click()` |

```python
def test_registration_form(page: Page):
    page.goto("/register")
    page.get_by_label("Email").fill("new@example.com")
    page.get_by_label("Password").fill("SecurePass123")
    page.get_by_role("checkbox", name="Terms").check()
    page.get_by_role("button", name="Create account").click()
    expect(page.get_by_text("Welcome")).to_be_visible()
```

## Assertions (expect)

| Assertion | Example |
|-----------|---------|
| Visible | `expect(locator).to_be_visible()` |
| Text | `expect(locator).to_have_text("Hello")` |
| URL | `expect(page).to_have_url(re.compile(r".*dashboard"))` |
| Count | `expect(locator).to_have_count(3)` |
| Enabled | `expect(locator).to_be_enabled()` |
| Checked | `expect(locator).to_be_checked()` |

```python
from playwright.sync_api import expect

def test_homepage(page: Page):
    page.goto("/")
    expect(page.get_by_role("heading", name="Welcome")).to_be_visible()
    expect(page.locator(".item")).to_have_count(5)
```

## Network Mocking (page.route)

| Pattern | Example |
|---------|---------|
| Mock response | `page.route("**/api/users", lambda route: route.fulfill(status=200, body="[]"))` |
| Abort request | `page.route("**/analytics", lambda route: route.abort())` |
| Continue | `page.route("**/api/**", lambda route: route.continue_())` |
| Unroute | `page.unroute("**/api/users")` |

```python
def test_empty_state(page: Page):
    def handle_route(route):
        route.fulfill(
            status=200,
            content_type="application/json",
            body='{"items": []}'
        )
    page.route("**/api/items", handle_route)
    page.goto("/items")
    expect(page.get_by_text("No items found")).to_be_visible()
```

## File Upload

| Pattern | Example |
|---------|---------|
| Single file | `page.get_by_label("Upload").set_input_files("fixtures/doc.pdf")` |
| Multiple files | `page.get_by_label("Upload").set_input_files(["a.pdf", "b.pdf"])` |
| Buffer | `page.get_by_label("Upload").set_input_files(FilePayload(name="test.txt", mime_type="text/plain", buffer=b"content"))` |

```python
from pathlib import Path

def test_upload(page: Page):
    page.goto("/upload")
    page.get_by_label("Choose file").set_input_files(Path(__file__).parent / "fixtures" / "sample.pdf")
    page.get_by_role("button", name="Upload").click()
    expect(page.get_by_text("Upload complete")).to_be_visible()
```

## Iframe Handling

| Pattern | Example |
|---------|---------|
| Frame locator | `frame = page.frame_locator('iframe[name="embed"]')` |
| Interact in frame | `frame.get_by_role("button").click()` |

```python
def test_iframe_content(page: Page):
    page.goto("/embed")
    frame = page.frame_locator("iframe#widget")
    frame.get_by_role("button", name="Submit").click()
    expect(frame.get_by_text("Success")).to_be_visible()
```

## Multi-Tab / Popup

| Pattern | Example |
|---------|---------|
| Wait for popup | `with page.expect_popup() as popup_info: page.get_by_role("link").click()` then `popup = popup_info.value` |
| New page | `new_page = context.new_page()` |

```python
def test_opens_external_link(page: Page, context: BrowserContext):
    with page.expect_popup() as popup_info:
        page.get_by_role("link", name="External").click()
    popup = popup_info.value
    popup.wait_for_load_state()
    expect(popup).to_have_url(re.compile(r"external\.com"))
```

## Page Object Model (POM)

```python
# pages/base_page.py
from playwright.sync_api import Page

class BasePage:
    def __init__(self, page: Page, base_url: str):
        self.page = page
        self.base_url = base_url

    def goto(self, path: str):
        self.page.goto(f"{self.base_url}{path}")

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
