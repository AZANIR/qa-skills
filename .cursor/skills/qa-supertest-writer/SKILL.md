---
name: qa-supertest-writer
description: Generate Supertest API and integration tests for TypeScript/Node.js with Express/Koa integration, chained assertions, and authentication handling.
output_dir: tests/api
dependencies:
  recommended:
    - qa-api-contract-curator
---

# QA Supertest Writer

## Purpose

Write API and integration tests using Supertest from test case specifications and API contracts. Transform structured test cases (from qa-testcase-from-docs, qa-manual-test-designer) and OpenAPI contracts (from qa-api-contract-curator) into executable Supertest code with chained assertions, authentication support, and response validation.

## Trigger Phrases

- "Write Supertest tests for [API/endpoint]"
- "Generate API tests from OpenAPI contract"
- "Create Supertest integration tests for Express"
- "Add API tests for [endpoint] with auth"
- "Supertest tests from test cases"
- "API contract to Supertest tests"
- "Test file upload with Supertest"
- "Supertest tests for Koa server"

## Key Features

| Feature | Description |
| ------- | ----------- |
| **Express/Koa integration** | `request(app)` — no server startup; tests run against app instance |
| **Chained HTTP assertions** | `.expect(statusCode)`, `.expect(contentType)`, `.expect(body)` — fluent API |
| **Request/response validation** | Headers, status, body shape; JSON Schema or Zod/Joi for schema validation |
| **Authentication support** | Bearer tokens, cookies, API keys via `.set()` |
| **File upload testing** | `.attach()` for multipart/form-data |

## Workflow

1. **Read test cases + API contract** — From qa-testcase-from-docs, qa-manual-test-designer, or qa-api-contract-curator (OpenAPI)
2. **Generate API test files** — Produce `{endpoint}.api.test.ts` with `describe` per endpoint, `it` per scenario
3. **Add auth setup** — Bearer token, cookies, or API key fixtures in `beforeEach`/`beforeAll`
4. **Validate responses** — Status codes, headers, body matching; optional schema validation (Zod, Joi, JSON Schema)

## Context7 MCP

Use **Context7 MCP** for current Supertest documentation when:
- API signatures or chaining behavior are uncertain
- New Supertest features need verification
- Express vs Koa setup differences require clarification

## Key Patterns

| Pattern | Usage |
| ------- | ----- |
| `request(app)` | Wrap Express/Koa app; no `listen()` needed |
| `.get(path)` / `.post(path)` / `.put(path)` / `.delete(path)` | HTTP method + path |
| `.set(header, value)` | Set request headers (Authorization, Content-Type, etc.) |
| `.send(body)` | Request body (JSON, form) |
| `.expect(statusCode)` | Assert response status |
| `.expect(contentType, /json/)` | Assert Content-Type header |
| `.expect(body)` | Assert response body (string, regex, function) |
| Chained assertions | `.get('/users').expect(200).expect('Content-Type', /json/)` |
| Bearer token | `.set('Authorization', 'Bearer ' + token)` |
| Cookies | `.set('Cookie', cookieString)` or use agent for session |
| File upload | `.attach(field, filePath)` |

See `references/patterns.md` for CRUD, auth, file upload, error responses, pagination.

## Test Structure

- **describe** per endpoint (e.g., `describe('GET /users')`)
- **it** per scenario: success, validation error, unauthorized, not found, conflict
- **beforeAll/beforeEach** for auth tokens, DB seeding, cleanup
- **afterEach/afterAll** for cleanup (e.g., truncate test data)

## Integration with Express/Koa

```ts
import request from 'supertest'
import { app } from '../src/app'

describe('API', () => {
  it('GET /health returns 200', () =>
    request(app).get('/health').expect(200))
})
```

No `app.listen()` — Supertest handles the request internally.

## Schema Validation

- **JSON Schema** — Use `ajv` or similar to validate response against schema
- **Zod** — `zodSchema.parse(response.body)` in custom `.expect()` callback
- **Joi** — `Joi.assert(response.body, schema)` in callback

## File Naming

- `{endpoint}.api.test.ts` — e.g., `users.api.test.ts`, `auth.api.test.ts`
- `{resource}.api.test.ts` — e.g., `products.api.test.ts`

## Scope

**Can do (autonomous):**
- Generate Supertest API tests from test cases and OpenAPI contracts
- Add auth setup (Bearer, cookies, API key)
- Use chained assertions, `.set()`, `.send()`, `.attach()`
- Configure test server, DB seeding, cleanup
- Validate responses with status, headers, body; add schema validation (Zod/Joi)
- Call qa-api-contract-curator for contract when needed
- Use Context7 MCP for Supertest docs

**Cannot do (requires confirmation):**
- Change production API implementation
- Add dependencies not in package.json
- Override project test config without approval

**Will not do (out of scope):**
- Execute tests (user runs `npm test` or `vitest`)
- Write E2E browser tests (use qa-playwright-ts-writer)
- Modify CI/CD pipelines

## References

- `references/patterns.md` — CRUD, auth, file upload, error responses, pagination
- `references/assertions.md` — Status codes, headers, body matching, schema validation
- `references/config.md` — Test server config, DB seeding, cleanup
- `references/best-practices.md` — Test isolation, DB state, auth fixtures, response validation

## Quality Checklist

- [ ] Tests match test case steps and expected results
- [ ] Each endpoint has success and error scenarios (validation, 401, 404)
- [ ] Auth setup is correct (Bearer, cookies) and isolated per test
- [ ] No hardcoded secrets; use env vars or test fixtures
- [ ] Response assertions are specific (status, body shape, headers)
- [ ] File naming follows `{endpoint}.api.test.ts`
- [ ] DB state is reset or isolated between tests
- [ ] Schema validation used where contract specifies response shape

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| `request(app)` returns 404 | App not mounted or route missing | Verify app exports; check route registration order |
| Tests pass individually, fail together | Shared DB state or auth leakage | Reset DB in `beforeEach`; use fresh tokens per test |
| `.expect(body)` fails on dynamic fields | Body has timestamps, IDs, etc. | Use partial match, regex, or custom callback |
| Auth not working | Token expired or wrong header | Check `Authorization` format; ensure token in scope |
| File upload fails | Wrong field name or path | Match `field` to form field; use absolute path |
| Koa app not working | Different API than Express | Use `request(app.callback())` for Koa |
| CORS errors in tests | CORS middleware blocking | Supertest bypasses network; check middleware order |
