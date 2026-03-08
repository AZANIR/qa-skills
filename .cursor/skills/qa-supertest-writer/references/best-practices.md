# API Testing Best Practices

## Test Isolation

1. **Independent tests** — Each test should pass or fail regardless of order. Use `beforeEach` to reset state.
2. **No shared mutable state** — Avoid global variables that tests modify; use fixtures or factories.
3. **Clean database** — Truncate or delete test data between tests, or use transactions that rollback.

## Database State

| Approach | Pros | Cons |
| -------- | ---- | ---- |
| **Truncate + seed** | Clean slate each run | Slower; may conflict with parallel tests |
| **Transactions** | Fast; automatic rollback | Requires transaction support in app |
| **Isolated DB per worker** | No cross-test pollution | More setup; resource usage |
| **Factory + unique data** | Flexible; no truncate | Must avoid collisions (unique emails, etc.) |

### Transaction Rollback Example

```ts
beforeEach(async () => {
  await db.transaction.begin()
})

afterEach(async () => {
  await db.transaction.rollback()
})
```

## Auth Fixtures

1. **Use test-only accounts** — Never use production credentials.
2. **Create tokens in beforeAll** — Reuse when tests don't mutate auth state.
3. **Fresh token per test** — When testing logout, token expiry, or auth changes.
4. **Store in env** — `TEST_USER_EMAIL`, `TEST_USER_PASSWORD` in `.env.test`.

```ts
beforeAll(async () => {
  token = await getAuthToken(
    process.env.TEST_USER_EMAIL!,
    process.env.TEST_USER_PASSWORD!
  )
})
```

## Response Validation

1. **Assert status first** — `.expect(200)` before body checks.
2. **Prefer partial match** — Use `toMatchObject` for dynamic fields (id, createdAt).
3. **Schema validation** — Use Zod/Joi for contract compliance when OpenAPI is available.
4. **Avoid over-asserting** — Test what matters; don't lock in implementation details.

## Error Scenarios

Cover at least:

- **Success** — 200/201/204 as per contract
- **Validation error** — 400 with error payload
- **Unauthorized** — 401 when missing/invalid auth
- **Forbidden** — 403 when insufficient permissions
- **Not found** — 404 for missing resources
- **Conflict** — 409 for duplicates (where applicable)

## File Naming and Structure

```
tests/
  api/
    users.api.test.ts
    auth.api.test.ts
    products.api.test.ts
  fixtures/
    seed.ts
    users.ts
  helpers/
    auth.ts
```

## Avoid

1. **Hardcoded secrets** — Use env vars or test fixtures.
2. **Testing implementation** — Test behavior and contract, not internal routes.
3. **Flaky tests** — No sleep/timeout; use deterministic data.
4. **Large payloads** — Minimize fixture size; use factories for scale.
5. **External services** — Mock HTTP calls to third-party APIs.

## Parallel Execution

When running tests in parallel:

- Use separate DB/schema per worker, or
- Use unique data (UUIDs, timestamps) to avoid collisions, or
- Run API tests sequentially (`--pool=forks` or `--run` with single worker)

## Contract-Driven Tests

When using OpenAPI from qa-api-contract-curator:

1. Generate tests from paths and operations.
2. Map status codes from `responses` to `.expect()`.
3. Use `requestBody` schema for `.send()` payloads.
4. Use `responses.*.content.*.schema` for body validation (Zod/JSON Schema).
