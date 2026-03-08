# Test Anti-Patterns Catalog

Before/after examples for common test code smells. Use this catalog when reviewing tests.

---

## 1. Magic Numbers in Tests

**Smell:** Unexplained literals (timeouts, IDs, counts) make tests brittle and hard to understand.

### Before

```typescript
it('loads user data', async () => {
  await page.waitForSelector('.user-card', { timeout: 5000 });
  expect(await page.$$('.user-item')).toHaveLength(10);
});
```

```python
def test_pagination():
    response = client.get('/users?page=1&per_page=25')
    assert len(response.json()['items']) == 25
```

### After

```typescript
const USER_LOAD_TIMEOUT_MS = 5000;
const EXPECTED_DEFAULT_PAGE_SIZE = 10;

it('loads user data', async () => {
  await page.waitForSelector('.user-card', { timeout: USER_LOAD_TIMEOUT_MS });
  expect(await page.$$('.user-item')).toHaveLength(EXPECTED_DEFAULT_PAGE_SIZE);
});
```

```python
DEFAULT_PAGE_SIZE = 25

def test_pagination():
    response = client.get(f'/users?page=1&per_page={DEFAULT_PAGE_SIZE}')
    assert len(response.json()['items']) == DEFAULT_PAGE_SIZE
```

---

## 2. Copy-Paste Test Duplication

**Smell:** Nearly identical tests; should use parametrize or shared fixtures.

### Before

```typescript
it('validates email format for gmail', () => {
  expect(validateEmail('user@gmail.com')).toBe(true);
});
it('validates email format for outlook', () => {
  expect(validateEmail('user@outlook.com')).toBe(true);
});
it('validates email format for yahoo', () => {
  expect(validateEmail('user@yahoo.com')).toBe(true);
});
```

```python
def test_email_gmail():
    assert validate_email('user@gmail.com') is True

def test_email_outlook():
    assert validate_email('user@outlook.com') is True

def test_email_yahoo():
    assert validate_email('user@yahoo.com') is True
```

### After

```typescript
const validEmails = ['user@gmail.com', 'user@outlook.com', 'user@yahoo.com'];
validEmails.forEach((email) => {
  it(`validates email format: ${email}`, () => {
    expect(validateEmail(email)).toBe(true);
  });
});
// Or use test.each in Jest/Vitest
```

```python
@pytest.mark.parametrize('email', ['user@gmail.com', 'user@outlook.com', 'user@yahoo.com'])
def test_valid_email_formats(email):
    assert validate_email(email) is True
```

---

## 3. Assertion-Free Tests

**Smell:** Tests that run code but never assert; they pass even when behavior is wrong.

### Before

```typescript
it('saves user to database', async () => {
  await userService.create({ name: 'Alice', email: 'alice@test.com' });
});
```

```python
def test_create_user():
    user_service.create(name='Alice', email='alice@test.com')
```

### After

```typescript
it('saves user to database', async () => {
  const user = await userService.create({ name: 'Alice', email: 'alice@test.com' });
  expect(user.id).toBeDefined();
  expect(user.name).toBe('Alice');
  const saved = await db.users.findById(user.id);
  expect(saved).toEqual(user);
});
```

```python
def test_create_user():
    user = user_service.create(name='Alice', email='alice@test.com')
    assert user.id is not None
    assert user.name == 'Alice'
    saved = db.users.find_by_id(user.id)
    assert saved == user
```

---

## 4. Over-Mocking

**Smell:** Mocking everything; tests verify mocks, not real behavior.

### Before

```typescript
it('fetches user', async () => {
  const mockFetch = jest.fn().mockResolvedValue({ id: 1, name: 'Alice' });
  (global as any).fetch = mockFetch;
  const user = await userService.getUser(1);
  expect(mockFetch).toHaveBeenCalledWith('/api/users/1');
  expect(user.name).toBe('Alice'); // from mock, not real logic
});
```

### After

```typescript
it('fetches user from API', async () => {
  const mockResponse = { id: 1, name: 'Alice' };
  server.use(http.get('/api/users/:id', () => HttpResponse.json(mockResponse)));
  const user = await userService.getUser(1);
  expect(user.name).toBe('Alice');
  expect(user.id).toBe(1);
});
// Or: test integration with real API in integration suite; mock only external deps
```

---

## 5. Test Logic (if/for in Tests)

**Smell:** Conditional logic inside tests; tests should be deterministic and simple.

### Before

```typescript
it('handles multiple users', () => {
  const users = getUsers();
  for (const u of users) {
    if (u.role === 'admin') {
      expect(u.permissions).toContain('delete');
    } else {
      expect(u.permissions).not.toContain('delete');
    }
  }
});
```

### After

```typescript
it('admin users have delete permission', () => {
  const admin = getUsers().find(u => u.role === 'admin');
  expect(admin?.permissions).toContain('delete');
});
it('non-admin users lack delete permission', () => {
  const regular = getUsers().find(u => u.role !== 'admin');
  expect(regular?.permissions).not.toContain('delete');
});
```

---

## 6. Ignored Tests Without Explanation

**Smell:** skip/xfail/todo with no reason; tests get forgotten.

### Before

```typescript
it.skip('flaky test', () => { /* ... */ });
it.todo('something');
```

```python
@pytest.mark.skip
def test_something():
    pass
```

### After

```typescript
it.skip('flaky: API returns 500 intermittently; ticket QA-123', () => { /* ... */ });
it.todo('add test for bulk delete when API is ready');
```

```python
@pytest.mark.skip(reason='Flaky: API returns 500 intermittently; ticket QA-123')
def test_something():
    pass
```

---

## 7. Hardcoded URLs/Selectors

**Smell:** Brittle strings; should use constants or config.

### Before

```typescript
await page.goto('https://staging.example.com/login');
await page.click('#root > div > form > button[type="submit"]');
```

```python
driver.get('https://staging.example.com/login')
driver.find_element(By.CSS_SELECTOR, '#root > div > form > button[type="submit"]').click()
```

### After

```typescript
const BASE_URL = process.env.TEST_BASE_URL || 'https://staging.example.com';
const SELECTORS = {
  loginSubmit: 'button[type="submit"]',
  // or use data-testid: '[data-testid="login-submit"]'
};
await page.goto(`${BASE_URL}/login`);
await page.click(SELECTORS.loginSubmit);
```

```python
BASE_URL = os.environ.get('TEST_BASE_URL', 'https://staging.example.com')
LOGIN_SUBMIT = '[data-testid="login-submit"]'

driver.get(f'{BASE_URL}/login')
driver.find_element(By.CSS_SELECTOR, LOGIN_SUBMIT).click()
```
