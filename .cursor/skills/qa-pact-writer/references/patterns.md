# Pact Patterns

## Consumer Tests

### JavaScript/TypeScript (PactV4)

```typescript
import { PactV4 } from '@pact-foundation/pact';

const pact = new PactV4({
  consumer: 'OrderService',
  provider: 'UserService',
  dir: 'pacts',
});

describe('User API', () => {
  it('gets user by id', async () => {
    await pact
      .addInteraction()
      .given('user with id 123 exists')
      .uponReceiving('a request for user 123')
      .withRequest('GET', '/users/123')
      .willRespondWith(200, (builder) => {
        builder.jsonBody({
          id: builder.like(123),
          name: builder.like('Alice'),
          email: builder.term({ matcher: '.*@.*', generate: 'alice@example.com' }),
        });
      })
      .executeTest(async (mockServer) => {
        const res = await fetch(`${mockServer.url}/users/123`);
        expect(res.status).toBe(200);
        const body = await res.json();
        expect(body.name).toBe('Alice');
      });
  });
});
```

### Python (pact-python)

```python
import pytest
from pact import Consumer, Provider

pact = Consumer('OrderService').has_pact_with(Provider('UserService'))
pact.start_service()
pact.given('user with id 123 exists').upon_receiving('a request for user 123').with_request(
    method='GET', path='/users/123'
).will_respond_with(200, body={'id': Like(123), 'name': Like('Alice'), 'email': Term(r'.*@.*', 'alice@example.com')})

@pytest.fixture
def user_client():
    return UserClient(base_url=pact.uri)

def test_get_user(user_client):
    pact.given('user with id 123 exists').upon_receiving('a request for user 123').with_request(
        method='GET', path='/users/123'
    ).will_respond_with(200, body={'id': Like(123), 'name': Like('Alice')})
    pact.verify()
    result = user_client.get_user(123)
    assert result['name'] == 'Alice'

# Teardown: pact.stop_service()
```

## Provider Verification

### JavaScript

```typescript
import { Verifier } from '@pact-foundation/pact';

await new Verifier({
  provider: 'UserService',
  providerBaseUrl: process.env.PROVIDER_URL || 'http://localhost:3000',
  pactUrls: ['pacts/orderservice-userservice.json'],
  stateHandlers: {
    'user with id 123 exists': async () => {
      await seedUser({ id: 123, name: 'Alice', email: 'alice@example.com' });
    },
  },
}).verifyProvider();
```

### Python

```python
from pact import Verifier

verifier = Verifier(
    provider='UserService',
    provider_base_url='http://localhost:3000',
)
verifier.verify_pacts(
    'pacts/orderservice-userservice.json',
    state_handler={
        'user with id 123 exists': lambda: seed_user(id=123, name='Alice', email='alice@example.com'),
    },
)
```

### Functional State Handlers (Python v2.3+)

```python
def state_handler(state: str, params: dict | None = None) -> dict | None:
    if state == 'user with id 123 exists':
        seed_user(id=123, name='Alice', email='alice@example.com')
        return None
    if state == 'user has orders':
        user_id = params.get('userId') if params else None
        seed_orders(user_id=user_id)
        return None
    return None

verifier.verify_pacts('pacts/...', state_handler=state_handler)
```

## Matchers

| Matcher | Purpose | JS Example | Python Example |
| ------- | ------- | ---------- | -------------- |
| **like** | Any value of same type | `builder.like(123)` | `Like(123)` |
| **eachLike** | Array of objects matching template | `builder.eachLike({ id: 1 })` | `EachLike({'id': 1})` |
| **term** | Regex match with example | `builder.term({ matcher: '\\d+', generate: '42' })` | `Term(r'\d+', '42')` |
| **regex** | Alias for term | Same as term | Same as term |
| **integer** | Integer type | `builder.integer(1)` | `Integer(1)` |
| **decimal** | Decimal type | `builder.decimal(1.5)` | `Decimal(1.5)` |
| **boolean** | Boolean type | `builder.boolean(true)` | `Boolean(True)` |
| **uuid** | UUID format | `builder.uuid()` | `Uuid()` |
| **datetime** | ISO datetime | `builder.datetime()` | `Datetime()` |

### Matcher Best Practices

- Use `like` for IDs, timestamps, and other dynamic values
- Use `eachLike` for arrays; specify min count if needed: `eachLike(obj, min=1)`
- Use `term` when format matters (email, phone, slug)
- Avoid over-specifying; match only what the consumer needs

## Provider States

### Naming Convention

- Use descriptive, scenario-based names: `user with id X exists`, `order is pending`
- Match exactly between consumer `given()` and provider state handler key
- Prefer parameterized states when possible: `user with id {userId} exists`

### State Handler Responsibilities

1. **Setup** — Create data, set DB state, mock external services
2. **Isolation** — Each interaction runs in isolation; no shared state between interactions
3. **Teardown** — Clean up after verification (optional; provider may reset per interaction)

### Common Patterns

| State | Setup |
| ----- | ----- |
| `user exists` | Insert user into test DB |
| `user has no orders` | Ensure orders table empty for user |
| `order is pending` | Insert order with status PENDING |
| `auth token valid` | Seed valid token or mock auth service |
