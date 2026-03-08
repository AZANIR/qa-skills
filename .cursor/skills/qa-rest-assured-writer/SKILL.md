---
name: qa-rest-assured-writer
description: Generate REST Assured API tests for Java with BDD-style syntax, JSON/XML schema validation, authentication handling, and Allure reporting.
output_dir: tests/api
dependencies:
  recommended:
    - qa-api-contract-curator
---

# QA REST Assured Writer

## Purpose

Write REST Assured API tests from test cases and API contracts. Transform structured test cases (from qa-testcase-from-docs, qa-api-contract-curator, OpenAPI specs) into executable REST Assured test files with BDD-style syntax, JSON/XML schema validation, authentication handling, and Allure reporting.

## Trigger Phrases

- "Write REST Assured tests for [API/endpoint]"
- "Generate REST Assured API tests from OpenAPI"
- "Create REST Assured tests with schema validation"
- "Add REST Assured tests for [resource]"
- "REST Assured BDD-style API tests"
- "REST Assured tests with Bearer auth"
- "REST Assured JSON schema validation"
- "API tests with given/when/then"
- "Heal my failing REST Assured tests"

## Key Features

| Feature | Description |
| ------- | ----------- |
| **BDD-style** | given().when().then() fluent API for readable tests |
| **JSON schema** | JsonSchemaValidator for response schema validation |
| **XML schema** | XML schema validation support |
| **Authentication** | Basic, Bearer, OAuth2, custom headers |
| **Request/Response spec** | RequestSpecification, ResponseSpecification for reuse |
| **Serialization** | Jackson/Gson for POJO serialization/deserialization |
| **Extraction** | extract().response(), path(), jsonPath() for assertions |
| **Allure** | @Step, @Description, @Severity for reporting |

## Workflow

1. **Read test cases / API contract** — From specs, OpenAPI, or manual test designs
2. **Analyze API** — Endpoints, request/response schemas, auth requirements
3. **Generate test classes** — Produce `{Resource}ApiTest.java` with BDD structure
4. **Configure base URI and specs** — RequestSpecification for common setup
5. **Add validation** — Status codes, body assertions, schema validation
6. **Run** — User runs `mvn test` to execute tests

## Key Patterns

| Pattern | Usage |
| ------- | ----- |
| `given().header().body().when().post().then().statusCode(201)` | Basic request/response |
| `given().auth().oauth2(token)` | Bearer token auth |
| `given().auth().basic(user, pass)` | Basic auth |
| `then().body(JsonSchemaValidator.matchesJsonSchema(schema))` | JSON schema validation |
| `RequestSpecification` | Reusable request config (base URI, headers) |
| `ResponseSpecification` | Reusable response assertions |
| `extract().response()` | Extract response for further assertions |
| `extract().path("$.id")` | Extract value from JSON path |

## BDD Structure

```java
@Test
@DisplayName("Create user returns 201")
void createUser_returns201() {
    given()
        .contentType(ContentType.JSON)
        .body(userRequest)
    .when()
        .post("/users")
    .then()
        .statusCode(201)
        .body("id", notNullValue())
        .body("email", equalTo("user@example.com"));
}
```

## File Naming

- `{Resource}ApiTest.java` — Test classes (e.g., `UserApiTest.java`, `OrderApiTest.java`)
- Place in `src/test/java` per Maven convention

## Scope

**Can do (autonomous):**
- Generate REST Assured API tests from test case specs or OpenAPI
- Apply BDD-style given/when/then structure
- Add JSON/XML schema validation
- Configure authentication (Basic, Bearer, OAuth2)
- Use RequestSpecification/ResponseSpecification for reuse
- Add Allure annotations for reporting
- Use Context7 MCP for REST Assured docs
- Delegate to qa-test-healer when tests fail (Heal Mode)

**Cannot do (requires confirmation):**
- Change production code structure
- Add dependencies not in pom.xml
- Override project REST Assured config without approval
- Call APIs not provided or approved

**Will not do (out of scope):**
- Execute tests (user runs `mvn test`)
- Write Selenium/Playwright tests (use qa-selenium-java-writer, qa-playwright-ts-writer)
- Modify CI/CD pipelines
- Bypass security or access restricted APIs

## References

- `references/patterns.md` — CRUD, auth, validation, filters, serialization
- `references/config.md` — Maven config, base URI, logging
- `references/best-practices.md` — API testing best practices with REST Assured

## Quality Checklist

- [ ] BDD-style given/when/then used
- [ ] Status code assertions on every request
- [ ] Schema validation where contract exists
- [ ] No hardcoded credentials (use env vars or test config)
- [ ] RequestSpecification for shared setup
- [ ] Tests independent (no shared state)
- [ ] Allure annotations where applicable
- [ ] Traceability to test case IDs where applicable
- [ ] File naming follows `{Resource}ApiTest.java` convention

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Connection refused | Wrong base URI, service not running | Verify baseUri; ensure API is up |
| 401/403 | Missing or invalid auth | Add auth to given(); check token expiry |
| Schema validation fails | Schema mismatch, wrong path | Verify schema file; check JSON path |
| Body assertion fails | Wrong JSON path, type mismatch | Use jsonPath() to debug; ensure correct type |
| Timeout | Slow API, network | Increase timeout in config |
| Serialization error | POJO mismatch | Verify POJO fields match JSON; check annotations |
