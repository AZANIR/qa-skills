# Spring Integration Testing Best Practices

## Test Slice Selection

| Slice | Use When | Avoid When |
| ----- | -------- | ---------- |
| @SpringBootTest | Full integration, multiple layers | Unit testing; slow feedback |
| @WebMvcTest | Controller-only, mock services | Need real DB, security context |
| @DataJpaTest | Repository behavior, queries | Need full app, controllers |
| @JsonTest | JSON serialization | General integration |
| @RestClientTest | RestTemplate/WebClient | Full HTTP integration |

## MockMvc Best Practices

1. **Prefer MockMvc over real HTTP** — Faster, no network; use RestTemplate/WebClient only when needed
2. **Use ObjectMapper for JSON** — Avoid hand-crafted JSON strings
3. **Assert status and body** — Always verify status and key response fields
4. **Use @WithMockUser** — Test security without full auth flow
5. **Extract common setup** — @BeforeEach for shared request builders

## TestContainers Best Practices

1. **Use specific image tags** — `postgres:15` not `postgres:latest` for reproducibility
2. **Reuse containers** — Enable reuse for faster runs when safe
3. **@DynamicPropertySource** — Prefer over application-test.yml for TestContainers URLs
4. **One DB per test class** — Avoid shared mutable state; use @Container static
5. **Consider Testcontainers Cloud** — For CI with limited Docker resources

## Data Isolation

1. **@Transactional** — Rollback after each test; no manual cleanup
2. **@DirtiesContext** — Use sparingly when context must be refreshed
3. **@Sql** — Load test data from scripts when needed
4. **Avoid @Transactional with @DataJpaTest** — Default rollback; explicit only when testing commit behavior

## Performance

1. **Minimize @SpringBootTest** — Use slices (@WebMvcTest, @DataJpaTest) when possible
2. **Lazy context** — Use @MockBean to avoid loading heavy beans
3. **Parallel execution** — Surefire forkCount; ensure tests are isolated
4. **Cache context** — Same configuration = cached context across test classes

## Security Testing

1. **@WithMockUser** — Simulate authenticated user
2. **@WithAnonymousUser** — Test unauthenticated access
3. **@WithUserDetails** — Load user from UserDetailsService
4. **Custom SecurityContext** — For complex scenarios

## Common Pitfalls

| Pitfall | Fix |
| ------- | --- |
| Context loads too much | Use @WebMvcTest or @DataJpaTest; @MockBean external deps |
| Flaky tests | Ensure @Transactional or proper cleanup; no static mutable state |
| Slow tests | Use slices; reuse TestContainers; avoid full @SpringBootTest |
| TestContainers fails in CI | Check Docker availability; use ryuk disabled only for debugging |
