# Playwright Python Configuration

Setup for pytest-playwright and Playwright Python.

## Installation

```bash
pip install pytest-playwright
playwright install
```

Optional: install only specific browsers:

```bash
playwright install chromium
playwright install chromium firefox webkit
```

## pytest-playwright Plugin

The plugin provides fixtures automatically when installed. No explicit registration needed.

| Fixture | Description |
|---------|-------------|
| `playwright` | Playwright instance (session scope) |
| `browser_type` | Browser type launcher |
| `browser` | Browser instance |
| `context` | Browser context |
| `page` | Page (tab) |

## conftest.py

Use `conftest.py` for shared fixtures and Playwright configuration.

```python
# conftest.py
import pytest
from playwright.sync_api import Page

@pytest.fixture(scope="session")
def base_url():
    return "http://localhost:3000"

@pytest.fixture
def authenticated_page(page: Page, base_url: str):
    """Page with pre-authenticated session."""
    page.goto(f"{base_url}/login")
    page.get_by_label("Email").fill("test@example.com")
    page.get_by_label("Password").fill("secret")
    page.get_by_role("button", name="Sign in").click()
    page.wait_for_url(re.compile(r".*dashboard"))
    return page
```

## pytest.ini / pyproject.toml

### Basic pytest.ini

```ini
[pytest]
testpaths = tests
addopts = -v --tb=short
markers =
    e2e: end-to-end browser tests
    slow: slow tests
```

### pyproject.toml (Preferred)

```toml
[tool.pytest.ini_options]
testpaths = ["tests", "e2e"]
addopts = "-v --tb=short"
markers = [
    "e2e: end-to-end browser tests",
    "slow: marks tests as slow",
]
```

### Async Mode (Optional)

To use async Playwright API with pytest-playwright:

```ini
# pytest.ini
[pytest]
playwright_pytest_asyncio = True
```

Or in pyproject.toml:

```toml
[tool.pytest.ini_options]
playwright_pytest_asyncio = true
```

Note: Sync and async fixtures cannot be mixed in the same test file.

## Browser Configuration

### Run Specific Browsers

```bash
pytest --browser chromium
pytest --browser firefox
pytest --browser webkit
pytest --browser chromium --browser firefox
```

### Headed Mode (Visible Browser)

```bash
pytest --headed
```

### Slow Motion

```bash
pytest --slowmo 1000
```

### Video / Screenshot

Configure via `browser_context_args` fixture:

```python
# conftest.py
@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {
        **browser_context_args,
        "record_video_dir": "videos/",
        "record_video_size": {"width": 1280, "height": 720},
    }
```

## Base URL

```python
# conftest.py
@pytest.fixture(scope="session")
def base_url():
    import os
    return os.environ.get("BASE_URL", "http://localhost:3000")

# In tests
def test_homepage(page: Page, base_url: str):
    page.goto(base_url)
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `BASE_URL` | Application under test |
| `HEADED` | Set to `1` for visible browser |
| `SLOWMO` | Milliseconds delay between actions |
| `BROWSER` | `chromium`, `firefox`, or `webkit` |

## Project Structure

```
project/
├── conftest.py           # Shared fixtures
├── pytest.ini            # or pyproject.toml
├── tests/
│   ├── e2e/
│   │   ├── test_login.py
│   │   ├── test_dashboard.py
│   │   └── conftest.py   # E2E-specific fixtures
│   └── ...
├── pages/                # Page Object Model
│   ├── base_page.py
│   ├── login_page.py
│   └── dashboard_page.py
└── fixtures/             # Test data, upload files
    └── sample.pdf
```

## Playwright Config (Optional)

For advanced configuration, create `playwright.config.py`:

```python
# playwright.config.py
from playwright.sync_api import sync_playwright

def get_browser_context_args():
    return {
        "viewport": {"width": 1280, "height": 720},
        "ignore_https_errors": True,
    }
```

pytest-playwright uses its own defaults; override via `browser_context_args` fixture in conftest.py.
