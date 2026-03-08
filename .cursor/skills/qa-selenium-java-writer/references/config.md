# Selenium Java Configuration

## Maven Dependencies

```xml
<dependencies>
    <dependency>
        <groupId>org.seleniumhq.selenium</groupId>
        <artifactId>selenium-java</artifactId>
        <version>4.25.0</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.10.2</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.assertj</groupId>
        <artifactId>assertj-core</artifactId>
        <version>3.25.3</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>io.qameta.allure</groupId>
        <artifactId>allure-junit5</artifactId>
        <version>2.29.0</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>io.github.bonigarcia</groupId>
        <artifactId>webdrivermanager</artifactId>
        <version>5.7.0</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Gradle Dependencies

```groovy
dependencies {
    testImplementation 'org.seleniumhq.selenium:selenium-java:4.25.0'
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.2'
    testImplementation 'org.assertj:assertj-core:3.25.3'
    testImplementation 'io.qameta.allure:allure-junit5:2.29.0'
    testImplementation 'io.github.bonigarcia:webdrivermanager:5.7.0'
}
```

## WebDriver Setup with WebDriverManager

```java
@BeforeEach
void setUp() {
    WebDriverManager.chromedriver().setup();
    ChromeOptions options = new ChromeOptions();
    if (Boolean.parseBoolean(System.getProperty("headless", "false"))) {
        options.addArguments("--headless=new", "--disable-gpu", "--window-size=1920,1080");
    }
    driver = new ChromeDriver(options);
    driver.manage().timeouts().implicitlyWait(Duration.ZERO); // Prefer explicit
    driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
}

@AfterEach
void tearDown() {
    if (driver != null) {
        driver.quit();
    }
}
```

## Base Test Class Pattern

```java
@ExtendWith(AllureJunit5.class)
public abstract class BaseSeleniumTest {
    protected WebDriver driver;

    @BeforeEach
    void initDriver() {
        driver = createDriver();
    }

    @AfterEach
    void closeDriver() {
        if (driver != null) driver.quit();
    }

    protected abstract WebDriver createDriver();
}
```

## Parallel Execution (maven-surefire-plugin)

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <version>3.2.5</version>
    <configuration>
        <properties>
            <configurationParameters>
                junit.jupiter.execution.parallel.enabled=true
                junit.jupiter.execution.parallel.mode.default=concurrent
                junit.jupiter.execution.parallel.config.strategy=fixed
                junit.jupiter.execution.parallel.config.fixed.parallelism=4
            </configurationParameters>
        </properties>
        <systemPropertyVariables>
            <headless>true</headless>
        </systemPropertyVariables>
    </configuration>
</plugin>
```

## Allure Configuration

```xml
<plugin>
    <groupId>io.qameta.allure</groupId>
    <artifactId>allure-maven</artifactId>
    <version>2.12.0</version>
</plugin>
```

```properties
# allure.properties (src/test/resources)
allure.results.directory=target/allure-results
allure.link.issue.pattern=https://jira.example.com/browse/{}
allure.link.tms.pattern=https://testlink.example.com/linkto.php?tprojectPrefix=QA&item=testcase&id={}
```

## Environment Variables

| Variable | Purpose |
| -------- | ------- |
| `BASE_URL` | Application base URL |
| `HEADLESS` | Run browser headless |
| `BROWSER` | chrome, firefox, edge |
| `IMPLICIT_WAIT` | Fallback implicit wait (prefer 0) |
