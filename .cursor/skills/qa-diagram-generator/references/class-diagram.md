# Mermaid Class Diagram Syntax — QA Use Cases

## Syntax Overview

Class diagrams use `classDiagram`. Classes: `class ClassName { +field +method() }`. Relationships: `-->` (association), `--|>` (inheritance), `*--` (composition), `o--` (aggregation). Visibility: `+` public, `-` private, `#` protected.

```mermaid
classDiagram
    class TestCase {
        +string id
        +string title
        +run() Result
    }
    TestCase --> Assertion : uses
```

## Example 1: Test Architecture

```mermaid
classDiagram
    class TestRunner {
        +run(suite) Results
        +stop()
    }
    class TestSuite {
        +List~TestCase~ tests
        +add(TestCase)
    }
    class TestCase {
        +string id
        +run() Result
    }
    TestRunner --> TestSuite : executes
    TestSuite *-- TestCase : contains
```

## Example 2: Page Object Model

```mermaid
classDiagram
    class BasePage {
        #WebDriver driver
        +visit(url)
        +find(locator)
    }
    class LoginPage {
        +usernameInput
        +passwordInput
        +loginButton
        +login(user, pass)
    }
    class DashboardPage {
        +welcomeMessage
        +logout()
    }
    BasePage <|-- LoginPage
    BasePage <|-- DashboardPage
```

## Example 3: Test Data Model

```mermaid
classDiagram
    class TestResult {
        +string status
        +number duration
        +string error
    }
    class TestCase {
        +string id
        +run() TestResult
    }
    class Report {
        +List~TestResult~ results
        +generate() HTML
    }
    TestCase --> TestResult : produces
    Report *-- TestResult : aggregates
```

## When to Use

- **Test architecture:** Runner, suite, case hierarchy
- **Page Object Model:** Base page, page classes
- **Test data models:** Result, report, fixture structures
