# Flaky Test Patterns — Code Examples and Fixes

## Overview

Flaky tests pass and fail intermittently. This reference documents four root-cause patterns with code examples and recommended fixes.

---

## 1. Race Conditions

### Description

Tests fail when async operations complete in unpredictable order or when the UI/API is not ready before assertions.

### Signatures in Code

- `click()` without `waitFor` before assertion
- `fetch()` / `axios` without `await`
- `setTimeout` with fixed delay (fragile)
- Parallel `Promise.all` with order-dependent assertions
- No `waitForSelector` / `waitForLoadState` before DOM checks

### Example (Playwright — Flaky)

```typescript
test('should show dashboard after login', async ({ page }) => {
  await page.fill('#email', 'user@test.com');
  await page.fill('#password', 'secret');
  await page.click('button[type="submit"]');
  // Race: redirect may not have completed
  expect(await page.textContent('h1')).toBe('Dashboard'); // Fails sometimes
});
```

### Fix

```typescript
test('should show dashboard after login', async ({ page }) => {
  await page.fill('#email', 'user@test.com');
  await page.fill('#password', 'secret');
  await page.click('button[type="submit"]');
  await page.waitForSelector('h1:has-text("Dashboard")', { timeout: 5000 });
  expect(await page.textContent('h1')).toBe('Dashboard');
});
```

### Example (Jest — Flaky)

```typescript
it('fetches user', async () => {
  fetchUser().then(data => expect(data.name).toBe('Alice')); // No await
});
```

### Fix

```typescript
it('fetches user', async () => {
  const data = await fetchUser();
  expect(data.name).toBe('Alice');
});
```

---

## 2. Shared State

### Description

Tests affect each other via global state, singletons, database, or file system. Order of execution changes outcomes.

### Signatures in Code

- Global variables, module-level caches
- Singleton instances
- Database records not cleaned between tests
- File system writes (temp files, config)
- Browser `localStorage` / `sessionStorage` not cleared

### Example (Flaky)

```typescript
let currentUser; // Shared across tests

beforeEach(() => {
  currentUser = null; // Missing in some suites
});

it('sets user', () => {
  currentUser = { id: 1, name: 'Alice' };
  expect(getUserName()).toBe('Alice');
});

it('gets user', () => {
  expect(getUserName()).toBeNull(); // Fails if previous test ran first
});
```

### Fix

```typescript
beforeEach(() => {
  currentUser = null;
  // Or: reset module, use dependency injection
});
```

### Example (DB — Flaky)

```python
def test_create_order():
    order = create_order(user_id=1, total=100)
    assert order.id is not None

def test_list_orders():
    orders = list_orders(user_id=1)
    assert len(orders) == 0  # Fails if test_create_order ran first
```

### Fix

```python
@pytest.fixture(autouse=True)
def clean_orders(db):
    yield
    db.execute("DELETE FROM orders WHERE user_id = 1")
```

---

## 3. Time-Dependency

### Description

Tests depend on current date/time, timezone, or system clock. Failures occur at certain times or in different environments.

### Signatures in Code

- `new Date()`, `Date.now()`
- `new Date().toISOString()`
- Timezone-dependent logic
- `setTimeout` with real delays
- Daylight saving transitions

### Example (Flaky)

```typescript
it('formats expiry date', () => {
  const card = { expiry: '12/25' };
  expect(formatExpiry(card)).toContain('2025'); // Assumes current year
});
```

### Fix

```typescript
beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date('2024-06-15'));
});
afterEach(() => jest.useRealTimers());
```

### Example (Python — Flaky)

```python
def test_is_expired():
    obj = create_obj(expires_at=datetime.now() - timedelta(days=1))
    assert obj.is_expired()  # Fails near midnight
```

### Fix

```python
from freezegun import freeze_time

@freeze_time('2024-06-15 12:00:00')
def test_is_expired():
    obj = create_obj(expires_at=datetime(2024, 6, 14))
    assert obj.is_expired()
```

---

## 4. External Dependencies

### Description

Tests call real networks, APIs, file system, or third-party services. Variability in response time, availability, or data causes flakiness.

### Signatures in Code

- `fetch()`, `axios`, `http.get` without mocking
- File system reads/writes (`fs`, `path`)
- Environment variables that change by environment
- Third-party SDKs (Stripe, SendGrid, etc.)

### Example (Flaky)

```typescript
it('fetches weather', async () => {
  const res = await fetch('https://api.weather.com/current');
  const data = await res.json();
  expect(data.temp).toBeGreaterThan(-50); // Network may fail or timeout
});
```

### Fix

```typescript
it('fetches weather', async () => {
  const res = await fetch('/api/weather'); // Mocked in test env
  const data = await res.json();
  expect(data.temp).toBe(22); // Deterministic mock response
});
// Or: use MSW, nock, or jest.mock
```

### Example (File System — Flaky)

```python
def test_read_config():
    with open('/tmp/app-config.json') as f:  # May not exist or differ
        config = json.load(f)
    assert config['env'] == 'test'
```

### Fix

```python
def test_read_config(tmp_path):
    config_file = tmp_path / 'config.json'
    config_file.write_text('{"env": "test"}')
    config = read_config(config_file)
    assert config['env'] == 'test'
```

---

## Quick Reference

| Pattern | Detection | Fix Strategy |
|---------|-----------|--------------|
| Race condition | Async without await, no explicit wait | Add `await`, `waitForSelector`, `waitFor` |
| Shared state | Globals, DB, files | `beforeEach` cleanup, isolate, transactional rollback |
| Time-dependency | `Date`, `setTimeout` | `useFakeTimers`, `freezegun`, fixed dates |
| External deps | HTTP, files, env | Mock, stub, fixtures, `tmp_path` |
