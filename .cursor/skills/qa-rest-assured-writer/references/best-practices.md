# REST Assured Best Practices

## Structure

- **One test class per resource** — `UserApiTest.java`, `OrderApiTest.java`
- **BDD style** — given/when/then for readability
- **Base class** — Shared RequestSpecification, base URI, auth
- **Test data** — Use builders or fixtures; avoid hardcoded values in assertions where possible

## Assertions

- **Always assert status code** — Every request should validate response status
- **Schema validation** — Use JsonSchemaValidator when OpenAPI/schema exists
- **Specific assertions** — Prefer `body("id", notNullValue())` over generic checks
- **AssertJ for extracted data** — `assertThat(response.path("id")).isNotNull()`

## Authentication

- **Never hardcode credentials** — Use env vars, test config, or secrets manager
- **Token refresh** — For OAuth2, implement token refresh in @BeforeAll or filter
- **Preemptive when needed** — Use preemptive basic auth if server doesn't send 401 challenge

## Test Data

- **Builders** — Use builder pattern for request POJOs
- **Fixtures** — Centralize test data in fixture classes or JSON files
- **Cleanup** — Delete created resources in @AfterEach if tests create data
- **Idempotency** — Prefer idempotent operations when possible

## Performance

- **Reuse specs** — RequestSpecification/ResponseSpecification reduce duplication
- **Connection pooling** — REST Assured uses Apache HttpClient; reuse config
- **Timeout** — Set reasonable timeouts to fail fast on slow APIs

## Maintainability

- **Constants** — Extract endpoints, header names to constants
- **Page Object–like** — Consider API client wrapper for complex APIs
- **Traceability** — Link tests to requirements via @Description or test case ID

## Common Pitfalls

| Pitfall | Fix |
| ------- | --- |
| Forgetting content-type | Set in RequestSpecification or per request |
| Brittle JSON path | Use schema validation; document path structure |
| Shared state | Each test independent; cleanup in @AfterEach |
| No timeout | Set connection/read timeout in config |
| Logging sensitive data | Filter auth headers in log config |
