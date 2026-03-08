---
name: qa-selenium-java-writer
description: Generate Selenium Java E2E tests with JUnit 5, Page Object Model, explicit waits, AssertJ assertions, and Allure reporting integration.
output_dir: tests/e2e
---

# QA Selenium Java Writer

## Purpose

Write Selenium Java E2E tests from test case specifications. Transform structured test cases (from qa-testcase-from-docs, qa-manual-test-designer, qa-browser-data-collector, or specs) into executable Selenium Java test files with JUnit 5, Page Object Model, explicit waits, AssertJ assertions, and Allure reporting.

## Trigger Phrases

- "Write Selenium Java tests for [feature/flow]"
- "Generate Selenium E2E tests in Java"
- "Create Selenium Java tests with POM"
- "Add Selenium Java tests for [URL/page]"
- "Selenium Java with JUnit 5 and Allure"
- "Selenium Java Page Object Model tests"
- "Headless Selenium Java tests for [feature]"
- "Selenium Java tests with WebDriverWait"
- "Heal my failing Selenium Java tests"

## Key Features

| Feature | Description |
| ------- | ----------- |
| **Java 21+** | Modern Java with records, pattern matching, virtual threads support |
| **Selenium WebDriver** | Chrome, Firefox, Edge via WebDriver API |
| **JUnit 5** | @Test, @BeforeEach/@AfterEach, @DisplayName, @Tag |
| **Page Object Model** | POM with PageFactory; base page + page-specific classes |
| **Explicit waits** | WebDriverWait + ExpectedConditions; avoid implicit waits |
| **AssertJ** | Fluent assertions: assertThat(element).isDisplayed().isEnabled() |
| **Allure** | @Step, @Description, @Severity, @Epic, @Feature for reporting |
| **Headless mode** | Chrome/Firefox headless for CI |
| **Parallel execution** | maven-surefire-plugin parallel configuration |

## Workflow

1. **Read test cases** — From specs, requirements, manual test designs, or browser-collected data
2. **Analyze app** — Inspect pages, forms, flows; identify locators and interactions
3. **Generate test classes with POM** — Produce `{Feature}Test.java` with Page Objects in `pages/`
4. **Configure WebDriver** — Set up driver lifecycle, headless options, timeouts
5. **Add Allure annotations** — @Step for steps, @Description, @Severity for reporting
6. **Run** — User runs `mvn test` or `./gradlew test` to execute tests

## Context7 MCP

Use **Context7 MCP** for Selenium Java documentation when:
- WebDriver API or ExpectedConditions syntax is uncertain
- PageFactory, Actions, or Select handling needs verification
- Browser-specific options (Chrome, Firefox headless) require up-to-date reference

## Key Patterns

| Pattern | Usage |
| ------- | ----- |
| `@Test` | JUnit 5 test method |
| `@BeforeEach` / `@AfterEach` | Driver setup and teardown |
| `WebDriverWait(driver, Duration.ofSeconds(10))` | Explicit wait |
| `ExpectedConditions.visibilityOfElementLocated(By.id("id"))` | Wait for element |
| `PageFactory.initElements(driver, PageClass.class)` | POM initialization |
| `assertThat(element).isDisplayed().isEnabled()` | AssertJ assertions |
| `@Step("User clicks submit")` | Allure step |
| `@Description("Verify login flow")` | Allure description |
| `@Severity(SeverityLevel.CRITICAL)` | Allure severity |

## Wait Strategies

Prefer explicit waits; avoid implicit waits for reliability:

```java
WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("submit-btn")));
element.click();
```

Common expected conditions: `visibilityOfElementLocated`, `elementToBeClickable`, `presenceOfElementLocated`, `textToBePresentInElement`, `urlContains`.

## File Naming

- `{Feature}Test.java` — Test classes (e.g., `LoginTest.java`, `CheckoutTest.java`)
- `pages/{Feature}Page.java` — Page objects (e.g., `pages/LoginPage.java`, `pages/CheckoutPage.java`)
- Place in `src/test/java` per Maven/Gradle convention

## Scope

**Can do (autonomous):**
- Generate Selenium Java E2E tests from test case specs
- Apply Page Object Model with PageFactory
- Use explicit waits (WebDriverWait + ExpectedConditions)
- Configure WebDriver (Chrome, Firefox, Edge, headless)
- Use AssertJ for fluent assertions
- Add Allure annotations for reporting
- Configure maven-surefire-plugin for parallel execution
- Use Context7 MCP for Selenium Java docs
- Delegate to qa-test-healer when tests fail (Heal Mode)

**Cannot do (requires confirmation):**
- Change production code structure
- Add dependencies not in pom.xml/build.gradle
- Override project Selenium/JUnit config without approval
- Navigate to URLs not provided

**Will not do (out of scope):**
- Execute tests (user runs `mvn test`)
- Write Playwright/Cypress tests (use qa-playwright-ts-writer, qa-cypress-writer)
- Modify CI/CD pipelines
- Bypass security or access restricted areas

## References

- `references/patterns.md` — POM, waits, selectors, actions, Select, alerts, frames
- `references/config.md` — Maven/Gradle config, WebDriver setup, parallel execution
- `references/best-practices.md` — Java Selenium best practices

## Quality Checklist

- [ ] Explicit waits used; avoid implicit waits where possible
- [ ] No Thread.sleep; prefer WebDriverWait + ExpectedConditions
- [ ] POM pattern applied with PageFactory
- [ ] Stable locators (ID, data attributes, CSS; XPath as fallback)
- [ ] Tests independent (no shared state, order-independent)
- [ ] Proper teardown (driver.quit in @AfterEach)
- [ ] AssertJ used for assertions
- [ ] Allure annotations (@Step, @Description, @Severity) where applicable
- [ ] Traceability to test case IDs where applicable
- [ ] No hardcoded secrets (use env vars)
- [ ] File naming follows `{Feature}Test.java` convention

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Element not found | Selector too specific, timing | Use explicit wait; prefer ID/CSS over fragile XPath |
| StaleElementReferenceException | DOM changed after find | Re-find element before interaction; use explicit wait |
| Timeout | Element not ready, slow page | Increase WebDriverWait timeout; check for overlays/modals |
| Flaky tests | Implicit wait, race conditions | Replace implicit with explicit waits; ensure test isolation |
| Driver not found | WebDriver binary missing | Use WebDriverManager; ensure browser installed |
| Headless fails | Browser options incorrect | Verify Chrome/Firefox headless options for your Selenium version |
| PageFactory null | Not initialized | Call PageFactory.initElements in constructor or @BeforeEach |
| Allure not showing | Surefire config missing | Add allure-maven-plugin and surefire properties |
