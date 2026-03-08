# JUnit 5 Patterns

## Parameterized Tests

### @CsvSource
Inline CSV data for simple cases:
```java
@ParameterizedTest
@CsvSource({"1, one", "2, two", "3, three"})
void mapNumberToWord(int num, String word) {
    assertThat(converter.toWord(num)).isEqualTo(word);
}

@ParameterizedTest
@CsvSource(value = {"null;null", "'';empty"}, delimiter = ';')
void handleEdgeCases(String input, String expected) {
    assertThat(processor.process(input)).isEqualTo(expected);
}
```

### @MethodSource
Method or factory provides data:
```java
static Stream<Arguments> provideValidEmails() {
    return Stream.of(
        Arguments.of("user@example.com", true),
        Arguments.of("admin@company.org", true)
    );
}

@ParameterizedTest
@MethodSource("provideValidEmails")
void validateEmail(String email, boolean expected) {
    assertThat(validator.isValid(email)).isEqualTo(expected);
}
```

### @EnumSource
Iterate over enum values:
```java
@ParameterizedTest
@EnumSource(Status.class)
void eachStatusHasCode(Status status) {
    assertThat(status.getCode()).isNotNull();
}

@ParameterizedTest
@EnumSource(value = Status.class, names = {"ACTIVE", "PENDING"})
void activeStatuses(Status status) {
    assertThat(status.isProcessable()).isTrue();
}
```

### @ValueSource
Single-value primitives and strings:
```java
@ParameterizedTest
@ValueSource(ints = {1, 2, 3, 5, 8})
void fibonacciNumbers(int n) {
    assertThat(fib(n)).isPositive();
}

@ParameterizedTest
@NullAndEmptySource
@ValueSource(strings = {"  ", "\t"})
void blankStrings(String input) {
    assertThat(StringUtils.isBlank(input)).isTrue();
}
```

## Nested Classes

Logical grouping with independent lifecycle:
```java
@DisplayName("OrderService")
class OrderServiceTest {
    @InjectMocks OrderService orderService;
    @Mock OrderRepository repository;

    @Nested
    @DisplayName("createOrder")
    class CreateOrder {
        @Test
        void shouldCreateValidOrder() { ... }
        @Test
        void shouldRejectInvalidItems() { ... }
    }

    @Nested
    @DisplayName("cancelOrder")
    class CancelOrder {
        @BeforeEach
        void setupExistingOrder() {
            when(repository.findById(1L)).thenReturn(Optional.of(existingOrder));
        }
        @Test
        void shouldCancelWhenAllowed() { ... }
    }
}
```

## Extensions

### MockitoExtension
```java
@ExtendWith(MockitoExtension.class)
class ServiceTest {
    @Mock Dependency dependency;
    @InjectMocks ServiceUnderTest service;
}
```

### Custom Extension
```java
@ExtendWith(DatabaseExtension.class)
class RepositoryTest {
    // Extension provides @Container, cleanup
}
```

## Lifecycle

### @TestInstance(PER_CLASS)
Share instance state across tests (e.g., expensive setup):
```java
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class ExpensiveSetupTest {
    private HeavyResource resource;
    @BeforeAll
    void init() {
        resource = new HeavyResource(); // Once for all tests
    }
}
```

### @BeforeEach / @AfterEach
Per-test setup and teardown:
```java
@BeforeEach
void setUp() {
    driver = new ChromeDriver();
}
@AfterEach
void tearDown() {
    if (driver != null) driver.quit();
}
```

## Tags and Filtering

```java
@Tag("slow")
@Test
void longRunningTest() { ... }

@Tag("integration")
@Tag("database")
@Test
void databaseIntegrationTest() { ... }
```

Run with: `mvn test -Dgroups=integration` or `-DexcludedGroups=slow`
