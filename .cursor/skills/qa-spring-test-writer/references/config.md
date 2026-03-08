# Spring Boot Test Configuration

## Maven Dependencies

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>testcontainers</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>postgresql</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Gradle Dependencies

```groovy
testImplementation 'org.springframework.boot:spring-boot-starter-test'
testImplementation 'org.testcontainers:testcontainers'
testImplementation 'org.testcontainers:postgresql'
testImplementation 'org.testcontainers:junit-jupiter'
```

## @SpringBootTest Options

| Option | Values | Use Case |
| ------ | ------ | -------- |
| webEnvironment | NONE, MOCK, RANDOM_PORT, DEFINED_PORT | MOCK for no server; RANDOM_PORT for full integration |
| classes | Application class | Limit context to specific classes |
| properties | Key-value pairs | Override properties |

```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class FullIntegrationTest { }

@SpringBootTest(webEnvironment = WebEnvironment.MOCK)
@AutoConfigureMockMvc
class MockMvcTest { }
```

## Test Profiles

### application-test.yml
```yaml
spring:
  datasource:
    url: jdbc:h2:mem:testdb
    driver-class-name: org.h2.Driver
  jpa:
    hibernate:
      ddl-auto: create-drop
```

### Activate in Test
```java
@SpringBootTest
@ActiveProfiles("test")
class ProfileIntegrationTest { }
```

## TestContainers Setup

### JUnit 5 Integration
```java
@Testcontainers
class MyTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");
}
```

### Shared Container (Singleton)
```java
@Testcontainers
class MyTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
        .withReuse(true);  // Reuse across test classes (requires testcontainers.reuse.enable=true)
}
```

### Dynamic Properties
```java
@DynamicPropertySource
static void configureProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", postgres::getJdbcUrl);
    registry.add("spring.datasource.username", postgres::getUsername);
    registry.add("spring.datasource.password", postgres::getPassword);
}
```

## MockMvc Configuration

### Auto-configure (default with @SpringBootTest webEnvironment=MOCK)
```java
@SpringBootTest
@AutoConfigureMockMvc
class ControllerTest {
    @Autowired MockMvc mockMvc;
}
```

### Custom Configuration
```java
@Autowired
void setMockMvc(MockMvcBuilder builder) {
    mockMvc = builder
        .apply(SecurityMockMvcConfigurers.springSecurity())
        .build();
}
```

## WebTestClient Configuration

### With RANDOM_PORT
```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class WebFluxTest {
    @Autowired WebTestClient webTestClient;
}
```

### With MockMvc (Servlet)
```java
@SpringBootTest
@AutoConfigureMockMvc
class WebTestClientTest {
    @Autowired MockMvc mockMvc;
    WebTestClient webTestClient;

    @BeforeEach
    void setUp() {
        webTestClient = WebTestClient.bindTo(
            MockMvcWebClientBuilder.mockMvcSetup(mockMvc).build()
        ).build();
    }
}
```

## Surefire Configuration (Maven)

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-surefire-plugin</artifactId>
    <configuration>
        <includes>
            <include>**/*Test.java</include>
            <include>**/*IntegrationTest.java</include>
        </includes>
        <excludes>
            <exclude>**/Abstract*.java</exclude>
        </excludes>
    </configuration>
</plugin>
```

## Testcontainers Properties

### ~/.testcontainers.properties (optional)
```
docker.client.strategy=org.testcontainers.dockerclient.UnixSocketClientProviderStrategy
testcontainers.reuse.enable=true
```
