# Supertest Assertion Reference

Supertest provides chained `.expect()` methods for HTTP assertions. Combine with Vitest/Jest `expect()` for body validation.

## Status Codes

```ts
request(app).get('/users').expect(200)
request(app).post('/users').send({}).expect(201)
request(app).get('/users/999').expect(404)
request(app).get('/users').expect(401)  // Unauthorized
request(app).post('/users').send({}).expect(400)  // Bad Request
request(app).get('/error').expect(500)  // Server Error
```

| Code | Typical Use |
| ---- | ----------- |
| 200 | OK — GET, PUT, PATCH success |
| 201 | Created — POST success |
| 204 | No Content — DELETE success |
| 400 | Bad Request — validation error |
| 401 | Unauthorized — missing/invalid auth |
| 403 | Forbidden — insufficient permissions |
| 404 | Not Found — resource missing |
| 409 | Conflict — duplicate, constraint violation |
| 422 | Unprocessable Entity — semantic validation |
| 500 | Internal Server Error |

## Content-Type

```ts
request(app)
  .get('/users')
  .expect('Content-Type', /json/)
  .expect(200)

// Exact match
request(app)
  .get('/users')
  .expect('Content-Type', 'application/json; charset=utf-8')
```

## Body Assertions

### String Match

```ts
request(app)
  .get('/health')
  .expect(200)
  .expect('OK')
```

### Regex Match

```ts
request(app)
  .get('/users/1')
  .expect((res) => {
    expect(res.body.email).toMatch(/^[\w.-]+@[\w.-]+\.\w+$/)
  })
```

### Custom Callback

```ts
request(app)
  .get('/users')
  .expect(200)
  .expect((res) => {
    expect(res.body).toHaveProperty('users')
    expect(res.body.users.length).toBeGreaterThan(0)
    expect(res.body.users[0]).toHaveProperty('id')
  })
```

### With Vitest/Jest expect()

```ts
const res = await request(app).get('/users').expect(200)

expect(res.body).toHaveProperty('users')
expect(res.body.users).toEqual(expect.arrayContaining([
  expect.objectContaining({ id: 1, email: expect.any(String) }),
]))
expect(res.body.users[0]).toMatchObject({ id: 1, name: 'Alice' })
```

## Header Assertions

```ts
request(app)
  .get('/users')
  .expect('Content-Type', /json/)
  .expect('X-Request-ID', (val) => expect(val).toBeDefined())
  .expect(200)

// Or capture and assert
const res = await request(app).get('/users').expect(200)
expect(res.headers['content-type']).toMatch(/json/)
expect(res.headers['x-request-id']).toBeDefined()
```

## Schema Validation

### Zod

```ts
import { z } from 'zod'

const UserSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  name: z.string(),
})

request(app)
  .get('/users/1')
  .expect(200)
  .expect((res) => {
    const parsed = UserSchema.parse(res.body)
    expect(parsed.id).toBe(1)
  })
```

### Joi

```ts
import Joi from 'joi'

const userSchema = Joi.object({
  id: Joi.number().required(),
  email: Joi.string().email().required(),
  name: Joi.string().required(),
})

request(app)
  .get('/users/1')
  .expect(200)
  .expect((res) => {
    Joi.assert(res.body, userSchema)
  })
```

### JSON Schema (ajv)

```ts
import Ajv from 'ajv'

const ajv = new Ajv()
const validate = ajv.compile(userJsonSchema)

request(app)
  .get('/users/1')
  .expect(200)
  .expect((res) => {
    const valid = validate(res.body)
    expect(valid).toBe(true)
    if (!valid) expect(validate.errors).toBeDefined()
  })
```

## Chained Assertions

```ts
await request(app)
  .post('/users')
  .set('Content-Type', 'application/json')
  .send({ email: 'a@b.com', name: 'Alice' })
  .expect(201)
  .expect('Content-Type', /json/)
  .expect((res) => {
    expect(res.body).toHaveProperty('id')
    expect(res.body.email).toBe('a@b.com')
  })
```

## Async vs Sync

Use `await` when you need the response for further assertions:

```ts
const res = await request(app).get('/users').expect(200)
const firstUser = res.body.users[0]
expect(firstUser).toHaveProperty('email')
```

Return the chain when Supertest assertions are sufficient:

```ts
it('returns 200', () => request(app).get('/users').expect(200))
```
