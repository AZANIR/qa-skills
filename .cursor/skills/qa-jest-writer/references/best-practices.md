# Jest Best Practices and Anti-Patterns

## AAA Pattern

Structure each test as **Arrange, Act, Assert**:

```typescript
it('calculates total with tax', () => {
  // Arrange
  const items = [{ price: 10 }, { price: 20 }];
  const taxRate = 0.1;

  // Act
  const total = calculateTotal(items, taxRate);

  // Assert
  expect(total).toBe(33);
});
```

## Test Isolation

- Each test must run independently
- No shared mutable state between tests
- Use `beforeEach` for fresh setup
- Reset mocks with `jest.clearAllMocks()` or `jest.resetAllMocks()` when needed

```typescript
beforeEach(() => {
  jest.clearAllMocks();
});
```

## Descriptive Test Names

| Avoid | Prefer |
| ----- | ------ |
| `it('works')` | `it('returns user when id is valid')` |
| `it('test 1')` | `it('throws when input is null')` |
| `it('handles error')` | `it('returns 400 when email is invalid')` |

Use: **"should [expected behavior] when [condition]"**

## Test Behavior, Not Implementation

- Assert outcomes, not internal steps
- Avoid testing private methods directly
- Prefer testing through public API

```typescript
// Avoid: testing implementation
expect(component.state.count).toBe(1);

// Prefer: testing behavior
expect(screen.getByText('Count: 1')).toBeInTheDocument();
```

## Mock Cleanup

- Restore spies: `spy.mockRestore()` in `afterEach`
- Clear mocks when reusing: `mockFn.mockClear()`
- Reset modules when needed: `jest.resetModules()`

```typescript
afterEach(() => {
  jest.restoreAllMocks();
});
```

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Fix |
| ------------ | ------- | --- |
| Multiple assertions for unrelated behaviors | Hard to pinpoint failure | One behavior per test |
| Testing implementation details | Brittle, breaks on refactor | Test observable behavior |
| Shared mutable state | Flaky, order-dependent | Fresh setup per test |
| `expect(x).toBeTruthy()` for objects | Vague, hides bugs | Use `toEqual`, `toMatchObject` |
| Hardcoded secrets | Security risk | Use env, fixtures, faker |
| Real I/O (DB, HTTP) in unit tests | Slow, flaky | Mock dependencies |
| Empty catch blocks | Swallows errors | Let tests fail or assert on error |
| Giant test files | Hard to maintain | Split by module/feature |
| `any` in test types | Weak typing | Use proper types |

## One Assertion Per Test (Guideline)

Prefer one logical assertion per test. Multiple related assertions for the same outcome are fine:

```typescript
it('returns valid user object', () => {
  const user = getUser(1);
  expect(user).toHaveProperty('id', 1);
  expect(user).toHaveProperty('name');
  expect(user.email).toMatch(/^[\w.+-]+@[\w.-]+\.\w+$/);
});
```

## Fixtures Over Hardcoded Data

```typescript
// fixtures/users.ts
export const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
};
```

```typescript
import { mockUser } from '../fixtures/users';
jest.mocked(api.fetchUser).mockResolvedValue(mockUser);
```

## Async: Prefer async/await

```typescript
// Prefer
it('fetches data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// Avoid when possible
it('fetches data', (done) => {
  fetchData().then((data) => {
    expect(data).toBeDefined();
    done();
  });
});
```

## Snapshot Discipline

- Use for stable, structured output
- Keep snapshots small and focused
- Review diffs before `jest -u`
- Prefer explicit assertions when behavior is more important than structure
