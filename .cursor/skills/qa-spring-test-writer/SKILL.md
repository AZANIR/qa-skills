---
name: qa-spring-test-writer
description: Generate Spring Boot integration tests with @SpringBootTest, MockMvc, TestContainers, @DataJpaTest, WebTestClient, and profile-based configuration.
output_dir: tests/integration
---

# QA Spring Test Writer

## Purpose

Write Spring Boot integration tests from test case specifications. Transform structured test cases into executable Spring test files with @SpringBootTest, MockMvc for REST controller testing, TestContainers for database integration, @DataJpaTest for repository testing, and WebTestClient for WebFlux.

## Trigger Phrases

- "Write Spring Boot integration tests for [feature]"
- "Generate MockMvc tests for [controller]"
- "Create TestContainers tests for [entity/repository]"
- "Add @DataJpaTest for [repository]"
- "Spring Boot integration tests with MockMvc"
- "WebTestClient tests for WebFlux [endpoint]"
- "Spring integration tests with TestContainers"
- "MockMvc tests with @MockBean"

## Key Features

| Feature | Description |
| ------- | ----------- |
| **@SpringBootTest** | Full application context; webEnvironment for servlet/reactive |
| **MockMvc** | REST controller testing without HTTP; perform(get/post).andExpect |
| **TestContainers** | @Container + PostgreSQLContainer, MySQLContainer for real DB |
| **@DataJpaTest** | Slice test for JPA repositories; in-memory or TestContainer DB |
| **WebTestClient** | WebFlux controller testing; bindToController or full server |
| **@MockBean** | Mock service dependencies in integration tests |
| **@TestPropertySource** | Override properties; use test profile |
| **@Transactional** | Rollback after each test for data cleanup |

## Workflow

1. **Read test cases** — From specs, requirements, or API contracts
2. **Analyze Java code** — Inspect controllers, services, repositories
3. **Choose test type** — MockMvc (controller), @DataJpaTest (repository), full @SpringBootTest (integration)
4. **Generate tests** — Produce `{Feature}IntegrationTest.java`
5. **Configure TestContainers** — Add @Container for DB when needed
6. **Run** — User runs `mvn test` or `./gradlew test`

## Key Patterns

| Pattern | Usage |
| ------- | ----- |
| `mockMvc.perform(get("/api/users")).andExpect(status().isOk())` | MockMvc GET |
| `mockMvc.perform(post("/api/users").contentType(JSON).content(body)).andExpect(status().isCreated())` | MockMvc POST |
| `jsonPath("$.id").value(1)` | JSON path assertion |
| `@Container static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")` | TestContainers DB |
| `@DataJpaTest` | Repository slice test |
| `repository.save(entity); assertEquals(1, repository.findAll().size())` | Repository assertions |
| `webTestClient.get().uri("/api/users").exchange().expectStatus().isOk()` | WebTestClient |
| `@MockBean UserService userService` | Mock service in context |

## MockMvc Patterns

```java
@SpringBootTest
@AutoConfigureMockMvc
class UserControllerIntegrationTest {
    @Autowired MockMvc mockMvc;

    @Test
    void getUsers_returnsOk() throws Exception {
        mockMvc.perform(get("/api/users"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$").isArray());
    }

    @Test
    void createUser_returnsCreated() throws Exception {
        String body = "{\"name\":\"John\",\"email\":\"john@example.com\"}";
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists());
    }
}
```

## TestContainers + @DataJpaTest

```java
@DataJpaTest
@Testcontainers
class UserRepositoryIntegrationTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired UserRepository repository;

    @Test
    void save_findsById() {
        User user = new User("John", "john@example.com");
        User saved = repository.save(user);
        assertThat(repository.findById(saved.getId())).isPresent();
    }
}
```

## File Naming

- `{Feature}IntegrationTest.java` — Integration test classes (e.g., `UserControllerIntegrationTest.java`, `OrderRepositoryIntegrationTest.java`)
- Place in `src/test/java` per Maven/Gradle convention

## Scope

**Can do (autonomous):**
- Generate Spring Boot integration tests from test case specs
- Use MockMvc for REST controller testing
- Use TestContainers for database integration tests
- Use @DataJpaTest for repository slice tests
- Use WebTestClient for WebFlux controller testing
- Apply @MockBean for service mocking
- Use @TestPropertySource and profiles for configuration
- Use @Transactional for test data cleanup

**Cannot do (requires confirmation):**
- Change production code structure
- Add dependencies not in pom.xml/build.gradle
- Override project Spring config without approval
- Modify database schema

**Will not do (out of scope):**
- Execute tests (user runs `mvn test`)
- Write unit tests without Spring (use qa-junit5-writer)
- Modify CI/CD pipelines
- Bypass security or access restricted areas

## References

- `references/patterns.md` — MockMvc, TestContainers, DataJpaTest, WebTestClient
- `references/config.md` — Spring Boot test config, profiles, TestContainers setup
- `references/best-practices.md` — Spring integration testing best practices

## Quality Checklist

- [ ] Appropriate test slice (@SpringBootTest, @DataJpaTest) for scope
- [ ] MockMvc/WebTestClient used for controller tests; avoid full HTTP when possible
- [ ] TestContainers for real DB when repository/DB behavior matters
- [ ] @Transactional or @DirtiesContext for data isolation where needed
- [ ] @MockBean only for external dependencies; avoid over-mocking
- [ ] @TestPropertySource for test-specific config
- [ ] Tests independent (no shared mutable state)
- [ ] Traceability to test case IDs where applicable
- [ ] No hardcoded secrets (use @TestPropertySource or env)
- [ ] File naming follows `{Feature}IntegrationTest.java` convention

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Context fails to load | Missing bean, circular dependency | Use @MockBean for problematic deps; check @ComponentScan |
| MockMvc 404 | Wrong path, context path | Verify @RequestMapping paths; check base path |
| TestContainers timeout | Image pull slow, resource limits | Use cached image; increase timeout; check Docker |
| @DataJpaTest fails | Missing JPA config, wrong DB | Add @EntityScan if needed; configure TestContainers |
| Flaky tests | Shared state, order-dependent | Use @Transactional; ensure test isolation |
| WebTestClient fails | Wrong binding | Use bindToController or bindToServer; check WebFlux config |
