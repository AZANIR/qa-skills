# Supertest Patterns

## CRUD Endpoints

### GET (List)

```ts
describe('GET /users', () => {
  it('returns 200 with user list', async () => {
    const res = await request(app)
      .get('/users')
      .expect(200)
      .expect('Content-Type', /json/)

    expect(res.body).toHaveProperty('users')
    expect(Array.isArray(res.body.users)).toBe(true)
  })

  it('returns 401 when unauthenticated', () =>
    request(app).get('/users').expect(401))
})
```

### GET (Single)

```ts
describe('GET /users/:id', () => {
  it('returns 200 with user', async () => {
    const res = await request(app)
      .get('/users/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)

    expect(res.body).toMatchObject({ id: 1, email: expect.any(String) })
  })

  it('returns 404 when not found', () =>
    request(app)
      .get('/users/99999')
      .set('Authorization', `Bearer ${token}`)
      .expect(404))
})
```

### POST (Create)

```ts
describe('POST /users', () => {
  it('returns 201 with created user', async () => {
    const res = await request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({ email: 'test@example.com', name: 'Test User' })
      .expect(201)

    expect(res.body).toHaveProperty('id')
    expect(res.body.email).toBe('test@example.com')
  })

  it('returns 400 on validation error', () =>
    request(app)
      .post('/users')
      .set('Content-Type', 'application/json')
      .send({ email: 'invalid' })
      .expect(400))
})
```

### PUT/PATCH (Update)

```ts
describe('PUT /users/:id', () => {
  it('returns 200 with updated user', async () => {
    const res = await request(app)
      .put('/users/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated Name' })
      .expect(200)

    expect(res.body.name).toBe('Updated Name')
  })
})
```

### DELETE

```ts
describe('DELETE /users/:id', () => {
  it('returns 204 on success', () =>
    request(app)
      .delete('/users/1')
      .set('Authorization', `Bearer ${token}`)
      .expect(204))

  it('returns 404 when not found', () =>
    request(app)
      .delete('/users/99999')
      .set('Authorization', `Bearer ${token}`)
      .expect(404))
})
```

## Authentication

### Bearer Token

```ts
let token: string

beforeAll(async () => {
  const res = await request(app)
    .post('/auth/login')
    .send({ email: 'test@example.com', password: 'secret' })
  token = res.body.token
})

it('accesses protected route', () =>
  request(app)
    .get('/users')
    .set('Authorization', `Bearer ${token}`)
    .expect(200))
```

### API Key

```ts
request(app)
  .get('/api/data')
  .set('X-API-Key', process.env.TEST_API_KEY)
  .expect(200)
```

### Cookies (Session)

```ts
const agent = request.agent(app)

beforeAll(async () => {
  await agent
    .post('/auth/login')
    .send({ email: 'test@example.com', password: 'secret' })
    .expect(200)
})

it('uses session cookie', () => agent.get('/users').expect(200))
```

### Basic Auth

```ts
request(app)
  .get('/admin')
  .auth('user', 'password')
  .expect(200)
```

## File Upload

```ts
import path from 'path'

describe('POST /upload', () => {
  it('uploads file and returns 201', async () => {
    const res = await request(app)
      .post('/upload')
      .attach('file', path.join(__dirname, 'fixtures/sample.pdf'))
      .expect(201)

    expect(res.body).toHaveProperty('url')
  })

  it('returns 400 when no file', () =>
    request(app).post('/upload').expect(400))
})
```

## Error Responses

```ts
it('returns 400 with validation errors', async () => {
  const res = await request(app)
    .post('/users')
    .send({})
    .expect(400)

  expect(res.body).toHaveProperty('errors')
  expect(Array.isArray(res.body.errors)).toBe(true)
})

it('returns 500 structure on server error', async () => {
  const res = await request(app)
    .get('/trigger-error')
    .expect(500)

  expect(res.body).toMatchObject({
    error: expect.any(String),
    message: expect.any(String),
  })
})
```

## Pagination

```ts
describe('GET /users with pagination', () => {
  it('returns paginated results', async () => {
    const res = await request(app)
      .get('/users?page=1&limit=10')
      .expect(200)

    expect(res.body).toMatchObject({
      users: expect.any(Array),
      total: expect.any(Number),
      page: 1,
      limit: 10,
    })
    expect(res.body.users.length).toBeLessThanOrEqual(10)
  })

  it('returns 400 for invalid page', () =>
    request(app).get('/users?page=-1').expect(400))
})
```

## Query Parameters

```ts
request(app)
  .get('/search')
  .query({ q: 'test', limit: 5 })
  .expect(200)
```

## Custom Headers

```ts
request(app)
  .get('/api/data')
  .set('X-Request-ID', 'test-123')
  .set('Accept', 'application/json')
  .expect(200)
```
