---
name: qa-junit5-writer
description: Generate JUnit 5 unit and integration tests for Java with parameterized tests, nested classes, extensions, Mockito mocking, and AssertJ assertions.
output_dir: tests/unit
---

# QA JUnit 5 Writer

## Purpose

Write JUnit 5 unit and integration tests from test case specifications. Transform structured test cases into executable JUnit 5 test classes with parameterized tests, nested classes for organization, extensions, Mockito mocking, and AssertJ assertions.

## Trigger Phrases

- "Write JUnit 5 tests for [class/feature]"
- "Generate unit tests with JUnit 5"
- "Create parameterized tests for [method]"
- "Add JUnit 5 tests with Mockito"
- "JUnit 5 tests with AssertJ assertions"
- "Nested test classes for [feature]"
- "JUnit 5 @ParameterizedTest for [scenarios]"
- "Mockito mocks in JUnit 5 tests"
- "Heal my failing JUnit 5 tests"

## Key Features

| Feature | Description |
| ------- | ----------- |
| **@Test** | Standard test methods |
| **@ParameterizedTest** | Data-driven tests with @CsvSource, @MethodSource, @EnumSource |
| **@Nested** | Logical grouping; inner classes with @BeforeEach per level |
| **@ExtendWith** | Extensions (MockitoExtension, custom) |
| **Mockito** | @Mock, @InjectMocks, when().thenReturn(), verify() |
| **AssertJ** | Fluent assertions: assertThat().isEqualTo(), containsExactly() |
| **@TestInstance** | PER_CLASS for shared setup; PER_METHOD default |
| **@Tag** | Categorization for selective execution |
| **@DisplayName** | Human-readable test names |

## Workflow

1. **Read test cases** — From specs, requirements, or manual test designs
2. **Analyze Java code** — Inspect classes, methods, dependencies
3. **Generate test classes** — Produce `{Class}Test.java` with appropriate structure
4. **Add mocks/fixtures** — Use Mockito for dependencies; fixtures for test data
5. **Run** — User runs `mvn test` or `./gradlew test`

## Key Patterns

| Pattern | Usage |
| ------- | ----- |
| `@Test` | JUnit 5 test method |
| `@ParameterizedTest` | Data-driven test |
| `@CsvSource({"a,1", "b,2"})` | Inline CSV data |
| `@MethodSource("provideData")` | Method-provided data |
| `@Nested` | Group related tests |
| `@ExtendWith(MockitoExtension.class)` | Enable Mockito |
| `@Mock` | Mock dependency |
| `@InjectMocks` | Inject mocks into SUT |
| `when(mock.method()).thenReturn(value)` | Stub mock |
| `verify(mock, times(1)).method()` | Verify interaction |
| `assertThat(actual).isEqualTo(expected)` | AssertJ assertion |

## Parameterized Tests

```java
@ParameterizedTest
@CsvSource({"admin, true", "user, false"})
void shouldCheckAccess(String role, boolean expected) {
    assertThat(service.hasAccess(role)).isEqualTo(expected);
}

@ParameterizedTest
@MethodSource("provideInvalidInputs")
void shouldRejectInvalidInput(String input) {
    assertThatThrownBy(() -> validator.validate(input))
        .isInstanceOf(ValidationException.class);
}
```

## Nested Classes

Use @Nested for logical grouping; each nested class gets its own @BeforeEach:

```java
@DisplayName("UserService")
class UserServiceTest {
    @Nested
    @DisplayName("when user exists")
    class WhenUserExists {
        @Test
        void shouldReturnUser() { ... }
    }
    @Nested
    @DisplayName("when user not found")
    class WhenUserNotFound {
        @Test
        void shouldThrowException() { ... }
    }
}
```

## File Naming

- `{Class}Test.java` — Test classes (e.g., `UserServiceTest.java`, `OrderValidatorTest.java`)
- Place in `src/test/java` mirroring production package structure

## Scope

**Can do (autonomous):**
- Generate JUnit 5 unit and integration tests from test case specs
- Use @ParameterizedTest for data-driven scenarios
- Apply @Nested for logical grouping
- Use Mockito for mocking dependencies
- Use AssertJ for fluent assertions
- Add @Tag, @DisplayName for organization
- Configure @TestInstance when shared setup needed
- Use Context7 MCP for JUnit 5/Mockito docs
- Delegate to qa-test-healer when tests fail (Heal Mode)

**Cannot do (requires confirmation):**
- Change production code structure
- Add dependencies not in pom.xml/build.gradle
- Override project JUnit/Mockito config without approval

**Will not do (out of scope):**
- Execute tests (user runs `mvn test`)
- Write Spring integration tests (use qa-spring-test-writer)
- Modify CI/CD pipelines

## References

- `references/patterns.md` — Parameterized, nested, extensions, lifecycle
- `references/assertions.md` — AssertJ assertion reference
- `references/config.md` — Maven/Gradle JUnit 5 config, Surefire plugin

## Quality Checklist

- [ ] @DisplayName used for readability
- [ ] @ParameterizedTest for multiple inputs; avoid duplicate test methods
- [ ] @Nested for logical grouping where beneficial
- [ ] Mockito used for external dependencies; avoid over-mocking
- [ ] AssertJ used for assertions
- [ ] Tests independent (no shared mutable state)
- [ ] One assertion focus per test where practical
- [ ] Traceability to test case IDs where applicable
- [ ] File naming follows `{Class}Test.java` convention

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Mock not injected | Wrong extension or order | Use @ExtendWith(MockitoExtension.class); @InjectMocks before @Mock |
| ParameterizedTest fails | Invalid CSV/method source | Check @CsvSource format; ensure @MethodSource returns Stream |
| Nested @BeforeEach runs twice | Misunderstanding lifecycle | Each @Nested level has own lifecycle; @BeforeEach runs per test in that level |
| AssertJ import error | Wrong static import | Use `import static org.assertj.core.api.Assertions.assertThat` |
| Test order dependent | Shared state | Ensure test isolation; use @TestInstance(PER_METHOD) or fresh fixtures |
| Surefire skips tests | JUnit 4 engine conflict | Exclude junit-vintage; use junit-platform-surefire-provider |
