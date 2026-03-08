# Jest Assertion Reference

Organized by category. Use the most specific matcher for clear intent.

## Equality

| Matcher | Description | Example |
| ------- | ----------- | ------- |
| `toBe` | Strict equality (===) | `expect(1).toBe(1)` |
| `toEqual` | Deep equality | `expect({ a: 1 }).toEqual({ a: 1 })` |
| `toStrictEqual` | Deep + type check | `expect({ a: 1 }).toStrictEqual({ a: 1 })` |
| `toMatchObject` | Partial object match | `expect(obj).toMatchObject({ a: 1 })` |
| `toBeNull` | Exactly null | `expect(x).toBeNull()` |
| `toBeUndefined` | Exactly undefined | `expect(x).toBeUndefined()` |
| `toBeDefined` | Not undefined | `expect(x).toBeDefined()` |

## Truthiness

| Matcher | Description | Example |
| ------- | ----------- | ------- |
| `toBeTruthy` | Truthy value | `expect(1).toBeTruthy()` |
| `toBeFalsy` | Falsy value | `expect(0).toBeFalsy()` |
| `toBeTrue` | Exactly true | `expect(flag).toBe(true)` |
| `toBeFalse` | Exactly false | `expect(flag).toBe(false)` |

## Numbers

| Matcher | Description | Example |
| ------- | ----------- | ------- |
| `toBeGreaterThan` | > | `expect(5).toBeGreaterThan(3)` |
| `toBeGreaterThanOrEqual` | >= | `expect(5).toBeGreaterThanOrEqual(5)` |
| `toBeLessThan` | < | `expect(2).toBeLessThan(5)` |
| `toBeLessThanOrEqual` | <= | `expect(2).toBeLessThanOrEqual(2)` |
| `toBeCloseTo` | Float approx | `expect(0.1 + 0.2).toBeCloseTo(0.3)` |

## Strings

| Matcher | Description | Example |
| ------- | ----------- | ------- |
| `toMatch` | Regex or substring | `expect('hello').toMatch(/hel/)` |
| `toContain` | Substring | `expect('hello').toContain('ell')` |
| `toHaveLength` | Length | `expect('hi').toHaveLength(2)` |

## Arrays

| Matcher | Description | Example |
| ------- | ----------- | ------- |
| `toContain` | Item in array | `expect([1,2]).toContain(2)` |
| `toContainEqual` | Deep item match | `expect([{a:1}]).toContainEqual({a:1})` |
| `toHaveLength` | Array length | `expect([1,2]).toHaveLength(2)` |
| `toEqual` | Full array match | `expect(arr).toEqual([1,2,3])` |

## Objects

| Matcher | Description | Example |
| ------- | ----------- | ------- |
| `toMatchObject` | Partial match | `expect(obj).toMatchObject({ key: 1 })` |
| `toHaveProperty` | Has key | `expect(obj).toHaveProperty('key')` |
| `toHaveProperty('key', value)` | Key + value | `expect(obj).toHaveProperty('key', 1)` |
| `toEqual` | Deep equality | `expect(obj).toEqual(expected)` |

## Functions

| Matcher | Description | Example |
| ------- | ----------- | ------- |
| `toThrow` | Throws | `expect(() => fn()).toThrow()` |
| `toThrow('msg')` | Throws with message | `expect(() => fn()).toThrow('msg')` |
| `toThrow(/regex/)` | Throws matching regex | `expect(() => fn()).toThrow(/error/)` |
| `toThrow(ErrorType)` | Throws instance | `expect(() => fn()).toThrow(ValidationError)` |

## Mocks / Spies

| Matcher | Description | Example |
| ------- | ----------- | ------- |
| `toHaveBeenCalled` | Called at least once | `expect(mock).toHaveBeenCalled()` |
| `toHaveBeenCalledTimes(n)` | Called n times | `expect(mock).toHaveBeenCalledTimes(2)` |
| `toHaveBeenCalledWith(...args)` | Called with args | `expect(mock).toHaveBeenCalledWith(1, 2)` |
| `toHaveBeenLastCalledWith(...args)` | Last call args | `expect(mock).toHaveBeenLastCalledWith(1)` |
| `toHaveBeenNthCalledWith(n, ...args)` | Nth call args | `expect(mock).toHaveBeenNthCalledWith(2, 1, 2)` |
| `toHaveReturnedWith(value)` | Returned value | `expect(mock).toHaveReturnedWith(42)` |
| `not.toHaveBeenCalled` | Never called | `expect(mock).not.toHaveBeenCalled()` |

## Promises

| Matcher | Description | Example |
| ------- | ----------- | ------- |
| `resolves` | Awaits and asserts | `await expect(promise).resolves.toBe(1)` |
| `rejects` | Awaits rejection | `await expect(promise).rejects.toThrow()` |
| `resolves.toEqual` | Resolved value | `await expect(promise).resolves.toEqual(obj)` |
| `rejects.toThrow` | Rejected error | `await expect(promise).rejects.toThrow('err')` |

## Errors

| Matcher | Description | Example |
| ------- | ----------- | ------- |
| `toThrow` | Throws any | `expect(() => fn()).toThrow()` |
| `toThrow(Error)` | Throws Error type | `expect(() => fn()).toThrow(TypeError)` |
| `toThrow('message')` | Message match | `expect(() => fn()).toThrow('invalid')` |
| `toThrow(/pattern/)` | Message regex | `expect(() => fn()).toThrow(/invalid/)` |

## Negation

Use `.not` before any matcher:

```typescript
expect(1).not.toBe(2);
expect(mock).not.toHaveBeenCalled();
```

## Custom Matchers

```typescript
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    return {
      pass,
      message: () =>
        pass
          ? `expected ${received} not to be within ${floor} - ${ceiling}`
          : `expected ${received} to be within ${floor} - ${ceiling}`,
    };
  },
});
```
