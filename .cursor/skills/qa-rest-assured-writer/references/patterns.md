# REST Assured Patterns

## CRUD Operations

### GET (single resource)
```java
given()
    .pathParam("id", 1)
.when()
    .get("/users/{id}")
.then()
    .statusCode(200)
    .body("id", equalTo(1))
    .body("name", notNullValue());
```

### GET (list)
```java
given()
    .queryParam("page", 1)
    .queryParam("size", 10)
.when()
    .get("/users")
.then()
    .statusCode(200)
    .body("content", hasSize(lessThanOrEqualTo(10)))
    .body("content[0].id", notNullValue());
```

### POST (create)
```java
given()
    .contentType(ContentType.JSON)
    .body(new UserRequest("john@example.com", "John"))
.when()
    .post("/users")
.then()
    .statusCode(201)
    .header("Location", containsString("/users/"))
    .body("id", notNullValue());
```

### PUT (update)
```java
given()
    .contentType(ContentType.JSON)
    .pathParam("id", 1)
    .body(updatedUser)
.when()
    .put("/users/{id}")
.then()
    .statusCode(200)
    .body("name", equalTo(updatedUser.getName()));
```

### DELETE
```java
given()
    .pathParam("id", 1)
.when()
    .delete("/users/{id}")
.then()
    .statusCode(204);
```

## Authentication

### Basic Auth
```java
given()
    .auth().basic("user", "password")
.when()
    .get("/protected")
.then()
    .statusCode(200);
```

### Bearer Token
```java
given()
    .auth().oauth2(accessToken)
.when()
    .get("/api/resource")
.then()
    .statusCode(200);
```

### Custom Header
```java
given()
    .header("Authorization", "Bearer " + token)
    .header("X-API-Key", apiKey)
.when()
    .get("/api/resource")
.then()
    .statusCode(200);
```

### Preemptive Basic
```java
given()
    .auth().preemptive().basic("user", "password")
.when()
    .get("/protected")
.then()
    .statusCode(200);
```

## JSON Schema Validation

```java
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

given()
    .when()
    .get("/users/1")
.then()
    .body(matchesJsonSchemaInClasspath("schemas/user-response.json"));
```

## Request/Response Specifications

### RequestSpecification
```java
RequestSpecification requestSpec = new RequestSpecBuilder()
    .setBaseUri("https://api.example.com")
    .setContentType(ContentType.JSON)
    .addHeader("Accept", "application/json")
    .addFilter(new RequestLoggingFilter())
    .build();

given()
    .spec(requestSpec)
    .body(payload)
.when()
    .post("/users")
.then()
    .statusCode(201);
```

### ResponseSpecification
```java
ResponseSpecification responseSpec = new ResponseSpecBuilder()
    .expectStatusCode(200)
    .expectContentType(ContentType.JSON)
    .expectResponseTime(lessThan(2000L), TimeUnit.MILLISECONDS)
    .build();

given().when().get("/users").then().spec(responseSpec);
```

## Filters

- **RequestLoggingFilter** — Log request details
- **ResponseLoggingFilter** — Log response details
- **ErrorLoggingFilter** — Log on failure
- **OAuth2Filter** — OAuth2 token handling

## Extraction

```java
Response response = given()
    .when()
    .post("/users")
    .then()
    .statusCode(201)
    .extract().response();

int id = response.path("id");
String location = response.header("Location");

// Or with JsonPath
String email = given().when().get("/users/1")
    .then().extract().path("email");
```

## Serialization / Deserialization

```java
// POJO to JSON (serialization)
UserRequest user = new UserRequest("john@example.com", "John");
given().body(user).when().post("/users");

// JSON to POJO (deserialization)
UserResponse user = given()
    .when()
    .get("/users/1")
    .as(UserResponse.class);

assertThat(user.getId()).isEqualTo(1);
assertThat(user.getEmail()).isEqualTo("john@example.com");
```
