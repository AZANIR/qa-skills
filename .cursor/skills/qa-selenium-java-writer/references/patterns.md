# Selenium Java Patterns

## Page Object Model (POM)

### Base Page

```java
public abstract class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;

    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        PageFactory.initElements(driver, this);
    }
}
```

### Page with PageFactory

```java
public class LoginPage extends BasePage {
    @FindBy(id = "username")
    private WebElement usernameInput;

    @FindBy(id = "password")
    private WebElement passwordInput;

    @FindBy(css = "button[type='submit']")
    private WebElement submitButton;

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public void login(String user, String pass) {
        usernameInput.sendKeys(user);
        passwordInput.sendKeys(pass);
        submitButton.click();
    }
}
```

### Lazy Locators (FindBy with custom locator)

```java
@FindBy(css = "div.user[data-id='%s']")
private String userItemTemplate;

public WebElement getUserItem(String id) {
    return driver.findElement(By.cssSelector(String.format(userItemTemplate, id)));
}
```

## Explicit Waits

### WebDriverWait + ExpectedConditions

```java
// Visibility
WebElement el = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("result")));

// Clickable
WebElement btn = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector(".submit")));

// Presence (in DOM, may not be visible)
WebElement el = wait.until(ExpectedConditions.presenceOfElementLocated(By.id("dynamic")));

// Text present
wait.until(ExpectedConditions.textToBePresentInElementLocated(By.id("status"), "Success"));

// URL contains
wait.until(ExpectedConditions.urlContains("/dashboard"));

// Custom condition
wait.until(d -> ((JavascriptExecutor) d).executeScript("return document.readyState").equals("complete"));
```

### Timeout Configuration

```java
WebDriverWait shortWait = new WebDriverWait(driver, Duration.ofSeconds(5));
WebDriverWait longWait = new WebDriverWait(driver, Duration.ofSeconds(30));
```

## Selectors (By strategies)

| Strategy | Example |
| -------- | ------- |
| By.id | `By.id("submit-btn")` |
| By.cssSelector | `By.cssSelector("button.primary")` |
| By.xpath | `By.xpath("//button[text()='Submit']")` |
| By.name | `By.name("email")` |
| By.className | `By.className("btn-primary")` |
| By.linkText | `By.linkText("Sign in")` |
| By.partialLinkText | `By.partialLinkText("Sign")` |
| By.tagName | `By.tagName("input")` |

Prefer: ID > data attributes > CSS > XPath.

## Actions

### Basic Interactions

```java
element.click();
element.sendKeys("text");
element.clear();
element.getText();
element.getAttribute("href");
element.isDisplayed();
element.isEnabled();
element.isSelected();
```

### Actions API (complex interactions)

```java
Actions actions = new Actions(driver);
actions.moveToElement(element).click().perform();
actions.dragAndDrop(source, target).perform();
actions.keyDown(Keys.CONTROL).sendKeys("a").keyUp(Keys.CONTROL).perform();
actions.sendKeys(element, Keys.ENTER).perform();
```

### Select (dropdowns)

```java
Select select = new Select(driver.findElement(By.id("country")));
select.selectByValue("US");
select.selectByVisibleText("United States");
select.selectByIndex(0);
```

## Alerts

```java
Alert alert = wait.until(ExpectedConditions.alertIsPresent());
String text = alert.getText();
alert.accept();  // OK
alert.dismiss(); // Cancel
alert.sendKeys("input");  // For prompt
```

## Frames and Windows

```java
// Switch to frame
driver.switchTo().frame("frameName");
driver.switchTo().frame(0);
driver.switchTo().frame(frameElement);
driver.switchTo().defaultContent();

// New window/tab
String mainHandle = driver.getWindowHandle();
for (String handle : driver.getWindowHandles()) {
    if (!handle.equals(mainHandle)) {
        driver.switchTo().window(handle);
        break;
    }
}
```

## File Upload

```java
WebElement fileInput = driver.findElement(By.cssSelector("input[type='file']"));
fileInput.sendKeys(Paths.get("/path/to/file.txt").toAbsolutePath().toString());
```
