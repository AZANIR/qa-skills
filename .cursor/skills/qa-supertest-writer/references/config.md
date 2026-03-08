# Supertest Configuration

## Test Server Configuration

### Express

```ts
import request from 'supertest'
import { app } from '../src/app'

// app is the Express instance; no listen() needed
describe('API', () => {
  it('works', () => request(app).get('/health').expect(200))
})
```

### Koa

```ts
import request from 'supertest'
import { app } from '../src/app'

// Koa: use app.callback()
describe('API', () => {
  it('works', () => request(app.callback()).get('/health').expect(200))
})
```

### HTTP Server (if app is wrapped)

```ts
import http from 'http'
import { app } from '../src/app'

const server = http.createServer(app)

describe('API', () => {
  it('works', () => request(server).get('/health').expect(200))
})
```

## Test Runner Setup

### Vitest

```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['**/*.api.test.ts'],
    testTimeout: 10000,
  },
})
```

### Jest

```ts
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.api.test.ts'],
  testTimeout: 10000,
}
```

## Database Seeding

### beforeAll (once per suite)

```ts
import { seedTestData } from '../test/fixtures/seed'

beforeAll(async () => {
  await seedTestData()
})
```

### beforeEach (per test)

```ts
beforeEach(async () => {
  await db.users.truncate()
  await db.users.insert(testUsers)
})
```

### Factory-based

```ts
beforeEach(async () => {
  await userFactory.create({ email: 'test@example.com' })
})
```

## Cleanup

### afterEach

```ts
afterEach(async () => {
  await db.users.deleteMany({ email: { $regex: /@test\.example\.com$/ } })
})
```

### afterAll

```ts
afterAll(async () => {
  await db.disconnect()
})
```

## Environment Variables

```ts
// tests/setup.ts or vitest.config.ts
process.env.NODE_ENV = 'test'
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL ?? 'postgres://localhost:5432/test_db'
```

## Base URL (when testing remote)

```ts
// For remote API (not typical with Supertest)
import request from 'supertest'

const baseUrl = process.env.API_BASE_URL ?? 'http://localhost:3000'

describe('Remote API', () => {
  it('works', () => request(baseUrl).get('/health').expect(200))
})
```

## Timeouts

```ts
// vitest.config.ts
test: {
  testTimeout: 15000,  // 15s for slow DB/API tests
}
```

## Shared Auth Fixture

```ts
// tests/helpers/auth.ts
export async function getAuthToken(): Promise<string> {
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'test@example.com', password: 'test' })
  return res.body.token
}
```

```ts
// In test file
let token: string

beforeAll(async () => {
  token = await getAuthToken()
})
```
