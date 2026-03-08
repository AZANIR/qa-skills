# Robot Framework Libraries Reference

## SeleniumLibrary

Browser automation via Selenium WebDriver. Install: `pip install robotframework-seleniumlibrary`

### Setup/Teardown

| Keyword | Description |
| ------- | ----------- |
| `Open Browser` | Open browser; args: url, browser (chrome, firefox, etc.) |
| `Close Browser` | Close current browser |
| `Close All Browsers` | Close all open browsers |

### Navigation

| Keyword | Description |
| ------- | ----------- |
| `Go To` | Navigate to URL |
| `Go Back` | Browser back |
| `Reload Page` | Reload current page |
| `Get Location` | Get current URL |
| `Get Title` | Get page title |

### Element Interaction

| Keyword | Description |
| ------- | ----------- |
| `Click Element` | Click element by locator |
| `Click Button` | Click button |
| `Input Text` | Type text into input |
| `Input Password` | Type password (masked in logs) |
| `Clear Element Text` | Clear input field |
| `Select From List By Value` | Select dropdown option by value |
| `Select Checkbox` / `Unselect Checkbox` | Toggle checkbox |
| `Choose File` | Upload file |

### Waits

| Keyword | Description |
| ------- | ----------- |
| `Wait Until Element Is Visible` | Wait for element |
| `Wait Until Page Contains` | Wait for text |
| `Wait Until Location Contains` | Wait for URL |
| `Set Selenium Implicit Wait` | Set default wait timeout |

### Assertions

| Keyword | Description |
| ------- | ----------- |
| `Element Should Be Visible` | Assert element visible |
| `Page Should Contain` | Assert text on page |
| `Title Should Be` | Assert page title |
| `Location Should Be` | Assert URL |
| `Element Should Be Enabled` | Assert element enabled |

### Locators

- `id=element_id`
- `css=div.class`
- `xpath=//button[@type='submit']`
- `name=fieldname`
- `link=Click here`

---

## BrowserLibrary

Playwright-based browser automation. Install: `pip install robotframework-browser`

### Setup/Teardown

| Keyword | Description |
| ------- | ----------- |
| `New Browser` | Create browser; args: browser (chromium, firefox, webkit), headless |
| `New Page` | Open new page/tab |
| `Close Browser` | Close browser |
| `Close Context` | Close browser context |

### Navigation

| Keyword | Description |
| ------- | ----------- |
| `Go To` | Navigate to URL |
| `Get Url` | Get current URL |
| `Get Title` | Get page title |

### Element Interaction

| Keyword | Description |
| ------- | ----------- |
| `Click` | Click element (selector) |
| `Fill Text` | Fill text input |
| `Type Text` | Type with optional delay |
| `Check` / `Uncheck` | Toggle checkbox |
| `Select Options By` | Select dropdown |
| `Upload File By Selector` | Upload file |

### Assertions

| Keyword | Description |
| ------- | ----------- |
| `Get Text` | Get element text |
| `Get Property` | Get element property |
| `Get Attribute` | Get element attribute |
| `Wait For Elements State` | Wait for element state (visible, hidden, etc.) |

### Selectors

- `text=Exact text`
- `css=button.primary`
- `id=element-id`
- `role=button[name="Submit"]`

---

## RequestsLibrary

API testing. Install: `pip install robotframework-requests`

### Session Management

| Keyword | Description |
| ------- | ----------- |
| `Create Session` | Create named session; args: alias, base_url, optional auth, headers |
| `Delete All Sessions` | Close all sessions |

### HTTP Methods

| Keyword | Description |
| ------- | ----------- |
| `GET` | GET request; returns response |
| `POST` | POST request |
| `PUT` | PUT request |
| `PATCH` | PATCH request |
| `DELETE` | DELETE request |
| `HEAD` | HEAD request |

### Assertions

| Keyword | Description |
| ------- | ----------- |
| `Status Should Be` | Assert status code (e.g., 200, 201) |
| `Response Should Be Successful` | 2xx status |
| `Response Should Be Client Error` | 4xx status |
| `Response Should Be Server Error` | 5xx status |

### Response Access

| Keyword | Description |
| ------- | ----------- |
| `Integer` | Parse response as int |
| `Json` | Parse response as JSON |
| `Content` | Raw response content |
| `Headers` | Response headers |

### Example

```robot
*** Settings ***
Library    RequestsLibrary

*** Test Cases ***
Get User
    Create Session    api    https://api.example.com
    ${resp}=    GET    api    /users/1
    Status Should Be    200    ${resp}
    Dictionary Should Contain Key    ${resp.json()}    id
```

---

## BuiltIn

Always available. Core keywords for logic, assertions, control flow.

### Logging

| Keyword | Description |
| ------- | ----------- |
| `Log` | Log message |
| `Log To Console` | Print to console |
| `Log Many` | Log multiple variables |

### Assertions

| Keyword | Description |
| ------- | ----------- |
| `Should Be Equal` | Assert equality |
| `Should Not Be Equal` | Assert inequality |
| `Should Be True` | Assert expression true |
| `Should Contain` | Assert string/list contains |
| `Should Match Regexp` | Assert regex match |
| `Fail` | Force test failure |

### Control Flow

| Keyword | Description |
| ------- | ----------- |
| `Run Keyword If` | Conditional keyword execution |
| `Run Keyword And Return` | Execute and return value |
| `Run Keyword And Ignore Error` | Execute, return status and output |
| `Wait Until Keyword Succeeds` | Retry keyword until success |
| `FOR` / `END` | Loop |
| `IF` / `ELSE` / `END` | Conditional (RF 5.0+) |
| `TRY` / `EXCEPT` / `END` | Exception handling (RF 5.0+) |

### Variables

| Keyword | Description |
| ------- | ----------- |
| `Set Variable` | Create variable |
| `Set Suite Variable` | Suite-level variable |
| `Set Test Variable` | Test-level variable |
| `Get Variable Value` | Get variable with default |
| `Evaluate` | Evaluate Python expression |

---

## Collections

List and dictionary operations. Import: `Library Collections`

### List Keywords

| Keyword | Description |
| ------- | ----------- |
| `Append To List` | Add item to list |
| `Get From List` | Get item by index |
| `Length` | Get list length |
| `List Should Contain Value` | Assert list contains |
| `Remove From List` | Remove by index |
| `Sort List` | Sort list |

### Dictionary Keywords

| Keyword | Description |
| ------- | ----------- |
| `Get From Dictionary` | Get value by key |
| `Set To Dictionary` | Set key-value |
| `Dictionary Should Contain Key` | Assert key exists |
| `Dictionary Should Contain Value` | Assert value exists |
| `Log Dictionary` | Log dict contents |

---

## String

String manipulation. Import: `Library String`

| Keyword | Description |
| ------- | ----------- |
| `Get Length` | String length |
| `Split String` | Split by separator |
| `Replace String` | Replace substring |
| `Get Substring` | Extract substring |
| `Convert To Lowercase` | Lowercase |
| `Convert To Uppercase` | Uppercase |
| `Strip String` | Trim whitespace |
| `Should Match Regexp` | Regex match |

---

## DateTime

Date and time. Import: `Library DateTime`

| Keyword | Description |
| ------- | ----------- |
| `Get Current Date` | Current date/time |
| `Add Time To Date` | Add duration to date |
| `Subtract Date From Date` | Date difference |
| `Convert Date` | Format date (e.g., `%Y-%m-%d`) |
