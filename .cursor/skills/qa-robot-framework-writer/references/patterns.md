# Robot Framework Patterns

## Keyword-Driven Testing

Tests are composed of high-level keywords that hide implementation details:

```robot
*** Test Cases ***
User Can Log In
    [Documentation]    Verify successful login
    Given User Is On Login Page
    When User Enters Credentials    ${VALID_USER}    ${VALID_PASS}
    And User Clicks Login Button
    Then User Should See Dashboard
    And User Should Be Logged In
```

Keywords are defined in *** Keywords *** or imported from resource files:

```robot
*** Keywords ***
User Is On Login Page
    Open Browser    ${LOGIN_URL}    ${BROWSER}
    Title Should Be    Login

User Enters Credentials
    [Arguments]    ${username}    ${password}
    Input Text    id=username    ${username}
    Input Password    id=password    ${password}
```

## BDD Syntax (Given/When/Then)

Use BDD-style keyword names for readability:

```robot
*** Test Cases ***
Checkout With Valid Card
    Given User Has Items In Cart
    When User Proceeds To Checkout
    And User Enters Payment    ${CARD_NUMBER}    ${EXPIRY}
    Then Order Should Be Confirmed
    And User Receives Confirmation Email
```

Keyword naming convention:
- **Given** — Setup, preconditions
- **When** — Action, user/system behavior
- **Then** — Assertion, expected outcome
- **And** — Additional step in same phase

## Data-Driven Tests

### FOR Loops

```robot
*** Test Cases ***
Validate Multiple Inputs
    FOR    ${input}    IN    valid    invalid    empty
        Log    Testing with: ${input}
        Validate Input    ${input}
    END
```

### Template Tests

Single keyword executed with different arguments:

```robot
*** Test Cases ***
Login With Valid Credentials
    [Template]    Login And Verify
    user1    pass1    Dashboard
    user2    pass2    Admin Panel
    admin    admin123    Settings

*** Keywords ***
Login And Verify
    [Arguments]    ${user}    ${pass}    ${expected_page}
    Input Text    id=username    ${user}
    Input Password    id=password    ${pass}
    Click Button    id=login
    Location Should Contain    ${expected_page}
```

### Data-Driven With [Template] and Multiple Rows

```robot
*** Test Cases ***
Search With Different Terms
    [Template]    Search And Verify Results
    robot framework    10
    selenium    5
    pytest    8
```

## Resource Files

Shared keywords and variables in separate files:

```robot
*** Settings ***
Resource    resources/common.robot
Resource    resources/login_keywords.robot
Library     SeleniumLibrary
```

**resources/common.robot:**
```robot
*** Settings ***
Library    SeleniumLibrary

*** Variables ***
${BROWSER}    chrome
${BASE_URL}    https://example.com

*** Keywords ***
Open Application
    Open Browser    ${BASE_URL}    ${BROWSER}
    Maximize Browser Window

Close Application
    Close All Browsers
```

## Variable Files

### Python Variable File

**variables/env.py:**
```python
BROWSER = "chrome"
BASE_URL = "https://example.com"
VALID_USER = "testuser"
VALID_PASS = "secret"
```

Usage: `robot -V variables/env.py tests/`

### YAML Variable File

**variables/config.yaml:**
```yaml
BROWSER: chrome
BASE_URL: https://example.com
VALID_USER: testuser
VALID_PASS: secret
```

Usage: `robot -V variables/config.yaml tests/`

## Control Flow

### IF / ELSE (RF 5.0+)

```robot
*** Keywords ***
Handle Optional Step
    [Arguments]    ${condition}
    IF    ${condition} == ${True}
        Click Button    submit
    ELSE
        Log    Skipping submit
    END
```

### TRY / EXCEPT (RF 5.0+)

```robot
*** Keywords ***
Safe Click
    [Arguments]    ${locator}
    TRY
        Click Element    ${locator}
    EXCEPT    Element not found
        Log    Element not found, skipping
    END
```

### Run Keyword If (Legacy)

```robot
Run Keyword If    '${ENV}' == 'prod'    Log    Production
...    ELSE IF    '${ENV}' == 'staging'    Log    Staging
...    ELSE    Log    Development
```

## Test Setup and Teardown

```robot
*** Settings ***
Suite Setup       Open Application
Suite Teardown    Close Application
Test Setup        Navigate To Home
Test Teardown     Capture Page Screenshot On Failure

*** Keywords ***
Capture Page Screenshot On Failure
    Run Keyword If Test Failed    Capture Page Screenshot
```

## Tags

```robot
*** Test Cases ***
Critical Login Test
    [Tags]    smoke    critical    login
    User Can Log In

Slow E2E Flow
    [Tags]    e2e    slow
    [Timeout]    2 minutes
    Complete Checkout Flow
```

Run by tag: `robot --include smoke tests/` or `robot --exclude slow tests/`
