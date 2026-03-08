# Selenium Python Patterns

Common patterns for E2E testing with Selenium WebDriver in Python.

## Locators

| Strategy | Example | When to Use |
| -------- | ------- | ----------- |
| By.ID | `driver.find_element(By.ID, "username")` | Unique ID attribute |
| By.CSS_SELECTOR | `driver.find_element(By.CSS_SELECTOR, "button.submit")` | Complex selectors |
| By.XPATH | `driver.find_element(By.XPATH, "//button[text()='Submit']")` | Text, hierarchy, axes |
| By.NAME | `driver.find_element(By.NAME, "email")` | Form inputs by name |
| By.CLASS_NAME | `driver.find_element(By.CLASS_NAME, "btn-primary")` | Single class |
| By.LINK_TEXT | `driver.find_element(By.LINK_TEXT, "Sign in")` | Exact link text |
| By.PARTIAL_LINK_TEXT | `driver.find_element(By.PARTIAL_LINK_TEXT, "Sign")` | Partial link text |
| By.TAG_NAME | `driver.find_element(By.TAG_NAME, "input")` | Tag type |

```python
from selenium.webdriver.common.by import By

element = driver.find_element(By.ID, "submit-btn")
elements = driver.find_elements(By.CSS_SELECTOR, ".list-item")
```

## Waits

### Explicit Wait (Preferred)

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Wait for element to be visible
element = WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located((By.ID, "username"))
)

# Wait for element to be clickable
button = WebDriverWait(driver, 10).until(
    EC.element_to_be_clickable((By.CSS_SELECTOR, "button.submit"))
)

# Wait for URL change
WebDriverWait(driver, 10).until(EC.url_contains("dashboard"))

# Wait for element to be present in DOM
element = WebDriverWait(driver, 10).until(
    EC.presence_of_element_located((By.ID, "results"))
)
```

### Common Expected Conditions

| Condition | Use Case |
| --------- | -------- |
| `visibility_of_element_located` | Element visible and has dimensions |
| `element_to_be_clickable` | Element visible and enabled |
| `presence_of_element_located` | Element in DOM (may be hidden) |
| `text_to_be_present_in_element` | Specific text in element |
| `url_contains` | URL contains substring |
| `title_is` | Page title exact match |
| `alert_is_present` | Alert dialog present |

### Implicit Wait (Use Sparingly)

```python
# Sets default wait for find_element; applies to all subsequent calls
driver.implicitly_wait(10)  # Seconds
```

**Note:** Prefer explicit waits. Implicit waits can cause unexpected delays and mask timing issues.

## Page Object Model (POM)

```python
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class LoginPage:
    def __init__(self, driver, base_url):
        self.driver = driver
        self.base_url = base_url

    @property
    def username_input(self):
        return WebDriverWait(self.driver, 10).until(
            EC.visibility_of_element_located((By.ID, "username"))
        )

    @property
    def password_input(self):
        return self.driver.find_element(By.ID, "password")

    @property
    def submit_button(self):
        return self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")

    def open(self):
        self.driver.get(f"{self.base_url}/login")

    def login(self, username: str, password: str):
        self.open()
        self.username_input.send_keys(username)
        self.password_input.send_keys(password)
        self.submit_button.click()
```

## ActionChains (Complex Interactions)

```python
from selenium.webdriver.common.action_chains import ActionChains

# Hover
actions = ActionChains(driver)
actions.move_to_element(menu_element).perform()

# Click and hold, drag and drop
actions = ActionChains(driver)
actions.click_and_hold(source).move_to_element(target).release().perform()

# Double click
actions = ActionChains(driver)
actions.double_click(element).perform()

# Right click (context menu)
actions = ActionChains(driver)
actions.context_click(element).perform()

# Send keys with modifier
actions = ActionChains(driver)
actions.key_down(Keys.CONTROL).send_keys("a").key_up(Keys.CONTROL).perform()

# Chain multiple actions
actions = ActionChains(driver)
actions.move_to_element(menu).click(hidden_submenu).perform()
```

## Select (Dropdowns)

```python
from selenium.webdriver.support.ui import Select

select = Select(driver.find_element(By.ID, "country"))

# By value
select.select_by_value("us")

# By visible text
select.select_by_visible_text("United States")

# By index (0-based)
select.select_by_index(0)

# Get options
options = select.options
first_selected = select.first_selected_option.text

# Deselect (multi-select only)
select.deselect_all()
select.deselect_by_visible_text("Option A")
```

## File Upload

```python
# Input type="file" - send path directly
file_input = driver.find_element(By.CSS_SELECTOR, "input[type='file']")
file_input.send_keys("/absolute/path/to/file.pdf")

# Multiple files (if supported)
file_input.send_keys("/path/file1.pdf\n/path/file2.pdf")
```

## Alerts

```python
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Wait for alert and accept
WebDriverWait(driver, 10).until(EC.alert_is_present())
alert = driver.switch_to.alert
alert.accept()  # OK
# alert.dismiss()  # Cancel
# text = alert.text  # Get message
# alert.send_keys("input")  # For prompt()
```

## Frames

```python
# Switch to frame by index, name, or element
driver.switch_to.frame(0)  # First frame
driver.switch_to.frame("frame-name")
driver.switch_to.frame(frame_element)

# Switch back to main content
driver.switch_to.default_content()

# Switch to parent frame (nested frames)
driver.switch_to.parent_frame()
```

## Windows / Tabs

```python
# Get current window handle
current = driver.current_window_handle

# Get all window handles
handles = driver.window_handles

# Switch to new tab/window
driver.switch_to.window(handles[-1])

# Close current and switch back
driver.close()
driver.switch_to.window(handles[0])
```

## Basic Interactions

```python
# Navigation
driver.get("https://example.com")
driver.back()
driver.forward()
driver.refresh()

# Element interactions
element.click()
element.send_keys("text")
element.clear()
element.submit()  # Form submit

# Get attributes and text
text = element.text
value = element.get_attribute("value")
href = element.get_attribute("href")
is_displayed = element.is_displayed()
is_enabled = element.is_enabled()
```

## Keys

```python
from selenium.webdriver.common.keys import Keys

element.send_keys(Keys.ENTER)
element.send_keys(Keys.TAB)
element.send_keys(Keys.ESCAPE)
element.send_keys(Keys.ARROW_DOWN)
element.send_keys(Keys.CONTROL + "a")  # Select all
```
