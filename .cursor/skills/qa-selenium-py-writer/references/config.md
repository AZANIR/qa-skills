# Selenium Python Configuration

Setup and configuration for Selenium WebDriver with Python.

## Dependencies

```bash
pip install selenium
pip install webdriver-manager  # Optional: auto-manage driver binaries
pip install pytest  # For test runner
```

## WebDriver Manager (Recommended)

Automatically downloads and manages ChromeDriver, GeckoDriver, etc.:

```python
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)
```

```python
# Firefox
from webdriver_manager.firefox import GeckoDriverManager
service = Service(GeckoDriverManager().install())
driver = webdriver.Firefox(service=service)
```

```python
# Edge
from webdriver_manager.microsoft import EdgeChromiumDriverManager
service = Service(EdgeChromiumDriverManager().install())
driver = webdriver.Edge(service=service)
```

## Browser Options

### Chrome

```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument("--disable-gpu")
options.add_argument("--window-size=1920,1080")

driver = webdriver.Chrome(options=options)
```

### Firefox

```python
from selenium import webdriver
from selenium.webdriver.firefox.options import Options

options = Options()
options.add_argument("--headless")

driver = webdriver.Firefox(options=options)
```

### Edge

```python
from selenium import webdriver
from selenium.webdriver.edge.options import Options

options = Options()
options.add_argument("--headless")

driver = webdriver.Edge(options=options)
```

## Pytest Integration

### conftest.py (Driver Fixture)

```python
# tests/conftest.py
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service


@pytest.fixture(scope="function")
def driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    yield driver
    driver.quit()


@pytest.fixture(scope="function")
def driver_visible():
    """Non-headless for local debugging."""
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    yield driver
    driver.quit()
```

### Test Module

```python
# tests/test_login.py
import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


def test_login_success(driver):
    driver.get("https://example.com/login")
    driver.find_element(By.ID, "username").send_keys("user")
    driver.find_element(By.ID, "password").send_keys("pass")
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()

    WebDriverWait(driver, 10).until(EC.url_contains("dashboard"))
    assert "dashboard" in driver.current_url
```

## Headless Configuration

| Browser | Headless Flag |
| ------- | ------------- |
| Chrome | `--headless=new` or `--headless` |
| Firefox | `--headless` |
| Edge | `--headless` |

```python
def get_headless_chrome():
    options = Options()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")
    return webdriver.Chrome(options=options)
```

## Environment-Based Config

```python
import os

def create_driver():
    browser = os.getenv("SELENIUM_BROWSER", "chrome")
    headless = os.getenv("SELENIUM_HEADLESS", "true").lower() == "true"

    if browser == "chrome":
        options = Options()
        if headless:
            options.add_argument("--headless=new")
        return webdriver.Chrome(options=options)
    elif browser == "firefox":
        options = webdriver.FirefoxOptions()
        if headless:
            options.add_argument("--headless")
        return webdriver.Firefox(options=options)
    else:
        raise ValueError(f"Unsupported browser: {browser}")
```

## Base URL Fixture

```python
# conftest.py
@pytest.fixture(scope="session")
def base_url():
    return os.getenv("BASE_URL", "https://example.com")


@pytest.fixture
def login_page(driver, base_url):
    from pages.login import LoginPage
    return LoginPage(driver, base_url)
```

## Timeouts

```python
# Page load timeout
driver.set_page_load_timeout(30)

# Script timeout (async scripts)
driver.set_script_timeout(10)

# Implicit wait (use sparingly)
driver.implicitly_wait(5)
```

## pyproject.toml / pytest.ini

```toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-v --tb=short"
markers = [
    "e2e: end-to-end Selenium tests",
    "slow: slow-running tests",
]
```

```bash
# Run only E2E tests
pytest -m e2e

# Run with visible browser
SELENIUM_HEADLESS=false pytest tests/
```
