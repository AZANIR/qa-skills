# Python API Testing Best Practices

## Async vs Sync

| Use Case | Recommendation |
| -------- | -------------- |
| **Most API tests** | Sync `httpx.Client` — simpler, sufficient for typical CRUD |
| **High concurrency** | Async `httpx.AsyncClient` — when testing many parallel requests |
| **Async app under test** | Async client — matches async handlers |
| **Mixed codebase** | Prefer sync unless async is required |

### When to Use Async

- Testing endpoints that benefit from concurrent requests
- Matching async application architecture
- Performance benchmarks with many simultaneous calls

### Sync Simplicity

```python
# Prefer sync for straightforward tests
def test_get_users(client, base_url):
    response = client.get(f"{base_url}/users")
    assert response.status_code == 200
```

## Session Reuse

| Scope | Pros | Cons |
| ----- | ---- | ---- |
| **Function** | Isolated; no shared state | New connection per test |
| **Module** | Fewer connections | Shared state across tests in module |
| **Session** | Fastest; single connection pool | Must avoid mutating shared state |

**Recommendation:** Use function-scoped client by default. Use session scope only when tests are read-only and do not mutate server state.

## Schema Validation

1. **Use Pydantic when** — OpenAPI contract exists; response shape is well-defined
2. **Use JSON Schema when** — Contract is in JSON Schema format; no Pydantic in project
3. **Use manual assertions when** — Only a few fields matter; full schema is overkill

### Contract-Driven

```python
# From qa-api-contract-curator OpenAPI spec
class UserResponse(BaseModel):
    id: int
    email: EmailStr
    name: str | None = None

def test_user_matches_contract(client, base_url, auth_headers):
    response = client.get(f"{base_url}/users/1", headers=auth_headers)
    UserResponse.model_validate(response.json())  # Fails if contract violated
```

## Test Isolation

1. **Independent tests** — Each test passes regardless of order
2. **No shared mutable state** — Avoid global variables; use fixtures
3. **Clean data** — Create/delete test data per test or use unique identifiers
4. **Idempotent when possible** — GET requests are safe; POST may create duplicates — use unique emails, UUIDs

### Unique Test Data

```python
import uuid

def test_create_user_unique(client, base_url, auth_headers):
    email = f"test-{uuid.uuid4().hex}@example.com"
    response = client.post(
        f"{base_url}/users",
        json={"email": email, "name": "Test"},
        headers=auth_headers
    )
    assert response.status_code == 201
```

## Error Scenarios

Cover at least:

| Scenario | Status | Assertion |
| -------- | ------ | --------- |
| Success | 200/201/204 | Per contract |
| Validation error | 400 | Error payload structure |
| Unauthorized | 401 | When missing/invalid auth |
| Forbidden | 403 | Insufficient permissions |
| Not found | 404 | Missing resource |
| Conflict | 409 | Duplicate, constraint violation |

## Avoid

1. **Hardcoded secrets** — Use `os.environ` or pytest fixtures
2. **Fragile assertions** — Prefer partial match for dynamic fields (id, createdAt)
3. **Sleep/timeout for flakiness** — Use retries or deterministic data instead
4. **Testing implementation** — Test behavior and contract, not internal routes
5. **Large fixtures** — Minimize payload size; use factories for scale
6. **External services in unit tests** — Mock third-party APIs; use real API only in integration tests

## File Organization

```
tests/
  conftest.py              # base_url, client, auth
  api/
    conftest.py            # auth_headers, token
    test_users_api.py
    test_products_api.py
  unit/                    # Mocked API calls
    test_services.py
```

## Parallel Execution

When using `pytest-xdist`:

- Use unique data (UUIDs, timestamps) to avoid collisions
- Or run API tests sequentially: `pytest -m api --forked` or single worker
- Consider separate DB/schema per worker for integration tests

## Dependencies

```toml
# pyproject.toml
[project.optional-dependencies]
test = [
    "httpx>=0.24.0",
    "pytest>=7.0",
    "pytest-asyncio>=0.21.0",
    "pydantic>=2.0",
]
```

## Contract-Driven Workflow

1. **Get OpenAPI** — From qa-api-contract-curator
2. **Generate Pydantic models** — From `components.schemas` (or use datamodel-code-generator)
3. **Generate tests** — One test per operation × status code
4. **Validate responses** — `Model.model_validate(response.json())`
