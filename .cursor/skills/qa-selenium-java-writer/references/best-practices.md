# Selenium Java Best Practices

## Explicit Waits Over Implicit

- Set `implicitlyWait(Duration.ZERO)` and use `WebDriverWait` + `ExpectedConditions` for all waits
- Avoid `Thread.sleep()` — use explicit waits for reliability
- Choose the right condition: `visibilityOf` for UI, `presenceOf` for DOM-only checks

## Page Object Model

- One page class per page/screen; extend `BasePage` for shared logic
- Use `PageFactory.initElements()` in constructor
- Encapsulate locators with `@FindBy`; expose actions as methods
- Do not expose `WebElement` directly when an action method is clearer

## Locator Strategy

1. **ID** — Fast, stable when present
2. **data-testid** — Explicit test hooks: `By.cssSelector("[data-testid='submit']")`
3. **CSS** — Readable, fast; avoid deep hierarchies
4. **XPath** — Use when CSS cannot express; prefer relative paths

Avoid: brittle text-based XPath, index-based selectors, dynamic class names.

## AssertJ Assertions

```java
assertThat(element).isDisplayed().isEnabled();
assertThat(element.getText()).contains("Expected");
assertThat(driver.getCurrentUrl()).contains("/dashboard");
assertThat(elements).hasSize(3);
```

Prefer AssertJ over JUnit `assertEquals` for readability and failure messages.

## Allure Annotations

- `@Step("User logs in with {username}")` — Wrap actions for step reporting
- `@Description("Verify checkout flow with valid cart")` — Test description
- `@Severity(SeverityLevel.CRITICAL)` — For prioritization
- `@Epic`, `@Feature`, `@Story` — For hierarchical reporting

## Test Independence

- Each test should run in isolation
- Use `@BeforeEach` for fresh driver; `@AfterEach` for cleanup
- No shared mutable state between tests
- Use `@Order` only when truly required; prefer independent tests

## Headless for CI

- Enable headless via `--headless=new` (Chrome) or `-headless` (Firefox)
- Set `window-size` to avoid layout issues
- Use `WebDriverManager` for driver binaries in CI

## Security

- Never hardcode credentials; use env vars or secrets
- Use `System.getenv("BASE_URL")` or config files for URLs
