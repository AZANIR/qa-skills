# Jest Test Patterns

## Unit Test Structure

```typescript
describe('ModuleName', () => {
  describe('functionName', () => {
    beforeEach(() => {
      // Reset state, create fresh instances
    });

    it('should do X when Y', () => {
      // Arrange
      const input = { ... };
      // Act
      const result = functionName(input);
      // Assert
      expect(result).toEqual(expected);
    });
  });
});
```

- **describe** — Groups by module, then by function or scenario
- **it** / **test** — One behavior per test
- **beforeEach** — Fresh setup; avoid shared mutable state

## Mocking Strategies

### Manual Mocks

Place in `__mocks__/` next to the module:

```
src/
  services/
    api.ts
    __mocks__/
      api.ts
```

```typescript
// __mocks__/api.ts
export const fetchUser = jest.fn();
export const fetchPosts = jest.fn();
```

### Auto Mocks

```typescript
jest.mock('./api');
// All exports become jest.fn()
```

### Factory Functions

For configurable mocks:

```typescript
jest.mock('./api', () => ({
  fetchUser: jest.fn(),
  fetchPosts: jest.fn(),
}));
```

### jest.spyOn

Spy on existing methods without replacing the module:

```typescript
const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
// ... test
spy.mockRestore();
```

### Mock Return Values

```typescript
jest.mocked(api.fetchUser).mockResolvedValue({ id: 1, name: 'Alice' });
jest.mocked(api.fetchUser).mockRejectedValue(new Error('Network error'));
```

## Async Patterns

### async/await

```typescript
it('fetches user', async () => {
  const user = await fetchUser(1);
  expect(user.name).toBe('Alice');
});
```

### resolves / rejects

```typescript
await expect(fetchUser(1)).resolves.toMatchObject({ id: 1 });
await expect(fetchUser(-1)).rejects.toThrow('Invalid id');
```

### done Callback (legacy)

```typescript
it('calls callback', (done) => {
  someAsyncFn((err, result) => {
    expect(err).toBeNull();
    expect(result).toBeDefined();
    done();
  });
});
```

## Snapshot Patterns

### Basic Snapshot

```typescript
it('renders correctly', () => {
  const { container } = render(<MyComponent />);
  expect(container).toMatchSnapshot();
});
```

### Inline Snapshot

```typescript
expect(result).toMatchInlineSnapshot(`
  Object {
    "status": "ok",
    "count": 1,
  }
`);
```

### Snapshot Best Practices

- Use for stable, serializable output (UI, JSON)
- Avoid large snapshots; prefer focused assertions when possible
- Review snapshot diffs before updating

## Error Testing

```typescript
it('throws when input is invalid', () => {
  expect(() => validateInput(null)).toThrow('Input is required');
  expect(() => validateInput(null)).toThrow(/required/);
});

it('rejects with error', async () => {
  await expect(asyncFn()).rejects.toThrow('Expected error');
});
```

## Parameterized Tests (test.each)

```typescript
test.each([
  [1, 1, 2],
  [2, 3, 5],
  [-1, 1, 0],
])('adds %i + %i = %i', (a, b, expected) => {
  expect(add(a, b)).toBe(expected);
});

test.each`
  input    | expected
  ${'a'}   | ${'A'}
  ${'ab'}  | ${'AB'}
`('uppercases $input to $expected', ({ input, expected }) => {
  expect(input.toUpperCase()).toBe(expected);
});
```
