# Spring Test Patterns

## MockMvc Patterns

### Basic GET
```java
mockMvc.perform(get("/api/users"))
    .andExpect(status().isOk())
    .andExpect(content().contentType(MediaType.APPLICATION_JSON))
    .andExpect(jsonPath("$").isArray());
```

### POST with JSON Body
```java
String body = objectMapper.writeValueAsString(new UserRequest("John", "john@example.com"));
mockMvc.perform(post("/api/users")
        .contentType(MediaType.APPLICATION_JSON)
        .content(body))
    .andExpect(status().isCreated())
    .andExpect(jsonPath("$.id").exists())
    .andExpect(jsonPath("$.name").value("John"));
```

### PUT / PATCH / DELETE
```java
mockMvc.perform(put("/api/users/1").contentType(JSON).content(body))
    .andExpect(status().isOk());

mockMvc.perform(delete("/api/users/1"))
    .andExpect(status().isNoContent());
```

### Headers and Authentication
```java
mockMvc.perform(get("/api/users")
        .header("Authorization", "Bearer " + token)
        .header("X-Request-ID", "req-123"))
    .andExpect(status().isOk());
```

### With Security (MockMvc + Spring Security)
```java
@WithMockUser(roles = "ADMIN")
@Test
void getUsers_asAdmin_returnsOk() throws Exception {
    mockMvc.perform(get("/api/users")).andExpect(status().isOk());
}

@WithMockUser(username = "user", roles = "USER")
@Test
void getUsers_asUser_returnsForbidden() throws Exception {
    mockMvc.perform(get("/api/admin/users")).andExpect(status().isForbidden());
}
```

### JsonPath Assertions
```java
.andExpect(jsonPath("$.id").value(1))
.andExpect(jsonPath("$.name").value("John"))
.andExpect(jsonPath("$.items[0].name").value("Item1"))
.andExpect(jsonPath("$.items", hasSize(2)))
.andExpect(jsonPath("$.active").value(true))
```

## TestContainers Patterns

### PostgreSQL
```java
@Container
static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15")
    .withDatabaseName("testdb")
    .withUsername("test")
    .withPassword("test");

@DynamicPropertySource
static void configureProperties(DynamicPropertyRegistry registry) {
    registry.add("spring.datasource.url", postgres::getJdbcUrl);
    registry.add("spring.datasource.username", postgres::getUsername);
    registry.add("spring.datasource.password", postgres::getPassword);
}
```

### MySQL
```java
@Container
static MySQLContainer<?> mysql = new MySQLContainer<>("mysql:8")
    .withDatabaseName("testdb")
    .withUsername("test")
    .withPassword("test");
```

### Redis
```java
@Container
static GenericContainer<?> redis = new GenericContainer<>("redis:7-alpine")
    .withExposedPorts(6379);

@DynamicPropertySource
static void configureRedis(DynamicPropertyRegistry registry) {
    registry.add("spring.data.redis.host", redis::getHost);
    registry.add("spring.data.redis.port", () -> redis.getMappedPort(6379).toString());
}
```

## @DataJpaTest Patterns

### Repository CRUD
```java
@DataJpaTest
class UserRepositoryTest {
    @Autowired UserRepository repository;

    @Test
    void saveAndFind() {
        User user = new User("John", "john@example.com");
        User saved = repository.save(user);
        assertThat(repository.findById(saved.getId())).isPresent();
        assertThat(repository.findAll()).hasSize(1);
    }

    @Test
    void findByEmail() {
        repository.save(new User("John", "john@example.com"));
        assertThat(repository.findByEmail("john@example.com")).isPresent();
    }
}
```

### With TestContainers
```java
@DataJpaTest
@Testcontainers
class UserRepositoryTest {
    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15");

    @DynamicPropertySource
    static void configure(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }
    // ...
}
```

## WebTestClient Patterns

### Bind to Controller (no full context)
```java
@ExtendWith(MockitoExtension.class)
class UserControllerTest {
    @Mock UserService userService;
    WebTestClient webTestClient;

    @BeforeEach
    void setUp() {
        webTestClient = WebTestClient.bindToController(new UserController(userService)).build();
    }

    @Test
    void getUsers_returnsOk() {
        when(userService.findAll()).thenReturn(List.of(new User(1L, "John")));
        webTestClient.get().uri("/api/users")
            .exchange()
            .expectStatus().isOk()
            .expectBodyList(User.class).hasSize(1);
    }
}
```

### Full Application (integration)
```java
@SpringBootTest(webEnvironment = WebEnvironment.RANDOM_PORT)
class UserControllerIntegrationTest {
    @Autowired WebTestClient webTestClient;

    @Test
    void getUsers_returnsOk() {
        webTestClient.get().uri("/api/users")
            .exchange()
            .expectStatus().isOk()
            .expectBody()
            .jsonPath("$").isArray();
    }
}
```

## @MockBean Patterns

### Mock Service in Integration Test
```java
@SpringBootTest
@AutoConfigureMockMvc
class OrderControllerIntegrationTest {
    @Autowired MockMvc mockMvc;
    @MockBean PaymentService paymentService;

    @Test
    void createOrder_mocksPayment() throws Exception {
        when(paymentService.process(any())).thenReturn(new PaymentResult("ok", "tx-123"));
        mockMvc.perform(post("/api/orders").contentType(JSON).content(orderJson))
            .andExpect(status().isCreated());
        verify(paymentService).process(any());
    }
}
```

## @Transactional and Data Cleanup

```java
@SpringBootTest
@Transactional  // Rollback after each test
class OrderServiceIntegrationTest {
    @Autowired OrderRepository orderRepository;

    @Test
    void createOrder_persists() {
        orderRepository.save(new Order(...));
        assertThat(orderRepository.count()).isEqualTo(1);
        // Rolled back automatically after test
    }
}
```

## @TestPropertySource

```java
@SpringBootTest
@TestPropertySource(properties = {
    "app.feature.enabled=true",
    "spring.jpa.hibernate.ddl-auto=create-drop"
})
class FeatureIntegrationTest { }
```
