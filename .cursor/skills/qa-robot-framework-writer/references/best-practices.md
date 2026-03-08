# Robot Framework Best Practices

## Keyword Naming

### Use Descriptive, Action-Oriented Names

| Good | Avoid |
| ---- | ----- |
| `User Clicks Login Button` | `Click1` |
| `Verify Order Total Matches Cart` | `Check` |
| `Navigate To Checkout Page` | `Go` |
| `Enter Valid Credentials` | `Do Login` |

### BDD-Style (Given/When/Then)

- **Given** — Preconditions, setup
- **When** — Actions, user/system behavior
- **Then** — Assertions, expected outcomes
- **And** — Additional steps in same phase

```robot
*** Keywords ***
Given User Is On Login Page
    Open Browser    ${LOGIN_URL}    ${BROWSER}
    Title Should Be    Login

When User Enters Valid Credentials
    Input Text    id=username    ${VALID_USER}
    Input Password    id=password    ${VALID_PASS}
    Click Button    id=login

Then User Should See Dashboard
    Wait Until Location Contains    /dashboard
    Page Should Contain    Welcome
```

### One Logical Action Per Keyword

Keep keywords focused. Avoid "god keywords" that do too much:

```robot
# Good: Single responsibility
Enter Username    ${user}
Enter Password    ${pass}
Click Login Button

# Avoid: One keyword doing everything
Login With User And Password And Submit    ${user}    ${pass}
```

---

## Resource Organization

### Structure by Domain

```
resources/
├── common.robot          # Shared setup, teardown, generic keywords
├── login_keywords.robot  # Login-specific keywords
├── checkout_keywords.robot
├── api_keywords.robot
└── variables.robot       # Shared variables (or use variable files)
```

### Layered Imports

- **common.robot** — Base libraries, variables, generic keywords
- **Feature resources** — Import common; add feature-specific keywords
- **Test files** — Import only needed resources

```robot
*** Settings ***
# In login.robot
Resource    resources/common.robot
Resource    resources/login_keywords.robot
```

### Avoid Circular Imports

Resource A imports B, B imports A → Error. Keep dependency graph acyclic.

---

## Variable Scope

| Scope | When to Use | How |
| ----- | ----------- | --- |
| **Local** | Within keyword | `[Arguments]` or `Set Variable` |
| **Test** | Single test | `Set Test Variable` |
| **Suite** | All tests in suite | `Set Suite Variable` |
| **Global** | Entire run | Variable file, `-v`, or `Set Global Variable` |

### Prefer Explicit Passing Over Global State

```robot
# Prefer: Pass as argument
Login And Verify    ${user}    ${pass}

# Avoid: Rely on global state
Set Suite Variable    ${CURRENT_USER}    ${user}
Login And Verify
```

### Sensitive Data

- Never hardcode passwords, API keys
- Use variable files loaded per environment
- Use `-v` or env vars in CI: `-v API_KEY:${API_KEY}`

---

## Test Independence

### Each Test Should Be Runnable Alone

- No shared mutable state between tests
- Each test sets up its own preconditions
- Use Suite/Test Setup and Teardown for common setup/cleanup

### Clean Up in Teardown

```robot
*** Settings ***
Test Teardown    Cleanup Test Data

*** Keywords ***
Cleanup Test Data
    Run Keyword If Test Failed    Capture Page Screenshot
    Delete Test User    ${TEST_USER}
    Close Browser
```

### Avoid Test Order Dependencies

- Tests should pass in any order
- Use `--randomize all` occasionally to detect order dependencies

---

## Locator Strategy

### Prefer Stable Locators

| Priority | Type | Example | Notes |
| -------- | ---- | ------- | ----- |
| 1 | id | `id=submit-btn` | Stable if IDs are consistent |
| 2 | data-testid | `css=[data-testid=submit]` | Explicit for testing |
| 3 | name | `name=email` | Good for forms |
| 4 | role/label | `role=button[name=Submit]` | Accessible |
| 5 | css/xpath | `css=.btn-primary` | Last resort; can break with UI changes |

### Centralize Locators

```robot
*** Variables ***
${LOGIN_BUTTON}    id=login-btn
${USERNAME_INPUT}  id=username
${PASSWORD_INPUT}  id=password

*** Keywords ***
User Clicks Login Button
    Click Element    ${LOGIN_BUTTON}
```

---

## Data-Driven Tests

### Use [Template] for Same Flow, Different Data

```robot
*** Test Cases ***
Login With Multiple Users
    [Template]    Login And Verify Success
    user1    pass1
    user2    pass2
    admin    admin123
```

### Use FOR for Iteration

```robot
FOR    ${item}    IN    @{ITEMS}
    Add Item To Cart    ${item}
    Verify Cart Contains    ${item}
END
```

---

## Error Handling and Resilience

### Use TRY/EXCEPT for Expected Failures

```robot
TRY
    Click Element    ${OPTIONAL_BUTTON}
EXCEPT    Element not found
    Log    Optional button not present, continuing
END
```

### Use Wait Until for Flaky Elements

```robot
Wait Until Element Is Visible    ${DYNAMIC_ELEMENT}    timeout=10s
Click Element    ${DYNAMIC_ELEMENT}
```

### Capture Screenshot on Failure

```robot
Test Teardown    Run Keyword If Test Failed    Capture Page Screenshot
```

---

## Documentation

### Add [Documentation] to Keywords and Tests

```robot
*** Test Cases ***
User Can Complete Checkout
    [Documentation]    Verify full checkout flow with valid payment.
    ...                Covers: cart review, shipping, payment, confirmation.
    [Tags]    smoke    checkout
    Given User Has Items In Cart
    When User Completes Checkout With Card    ${TEST_CARD}
    Then Order Confirmation Is Displayed
```

### Use Tags for Filtering

- `smoke` — Critical path
- `regression` — Full regression
- `e2e` — End-to-end
- `api` — API tests
- `slow` — Long-running (exclude in quick runs)

---

## Performance

- Use **BrowserLibrary** (Playwright) for faster execution than Selenium when possible
- Run API tests separately from UI tests (faster feedback)
- Use `--exclude slow` for quick smoke runs
- Consider `pabot` for parallel execution on large suites
