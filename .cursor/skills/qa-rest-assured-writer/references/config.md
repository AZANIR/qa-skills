# REST Assured Configuration

## Maven Dependencies

```xml
<dependencies>
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>rest-assured</artifactId>
        <version>5.4.0</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>io.rest-assured</groupId>
        <artifactId>json-schema-validator</artifactId>
        <version>5.4.0</version>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter</artifactId>
        <version>5.10.0</version>
        <scope>test</scope>
    </dependency>
</dependencies>
```

## Base URI Configuration

### Static configuration
```java
@BeforeAll
static void setupRestAssured() {
    RestAssured.baseURI = "https://api.example.com";
    RestAssured.basePath = "/v1";
    RestAssured.port = 443;
}
```

### From environment
```java
@BeforeAll
static void setupRestAssured() {
    RestAssured.baseURI = System.getenv().getOrDefault("API_BASE_URI", "http://localhost:8080");
}
```

### Per-test override
```java
given()
    .baseUri("https://staging.api.example.com")
.when()
    .get("/users")
.then()
    .statusCode(200);
```

## Logging

### Request/Response logging
```java
RestAssured.enableLoggingOfRequestAndResponseIfValidationFails(LogDetail.ALL);

// Or per request
given()
    .log().all()
.when()
    .get("/users")
.then()
    .log().body();
```

### Log levels
- `LogDetail.ALL` — Full request and response
- `LogDetail.HEADERS` — Headers only
- `LogDetail.BODY` — Body only
- `LogDetail.PARAMS` — Query/path params

## Timeouts

```java
RestAssured.config = RestAssuredConfig.config()
    .httpClient(HttpClientConfig.httpClientConfig()
        .setParam(CoreConnectionPNames.CONNECTION_TIMEOUT, 5000)
        .setParam(CoreConnectionPNames.SO_TIMEOUT, 10000));
```

## SSL / TLS

### Relaxed HTTPS (self-signed certs, dev only)
```java
RestAssured.useRelaxedHTTPSValidation();
```

### Custom trust store
```java
RestAssured.config = RestAssuredConfig.config()
    .sslConfig(SSLConfig.sslConfig()
        .trustStore(pathToTrustStore, password));
```

## Content Type

```java
RestAssured.defaultContentType = ContentType.JSON;
```

## Request Specification (Reusable)

```java
public class ApiTestBase {
    protected static RequestSpecification requestSpec;

    @BeforeAll
    static void setup() {
        requestSpec = new RequestSpecBuilder()
            .setBaseUri(System.getenv().getOrDefault("API_URI", "http://localhost:8080"))
            .setContentType(ContentType.JSON)
            .addFilter(new RequestLoggingFilter())
            .addFilter(new ResponseLoggingFilter())
            .build();
    }
}
```
