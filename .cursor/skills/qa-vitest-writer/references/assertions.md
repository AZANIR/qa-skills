# Vitest / Chai Assertion Reference

Vitest uses the same assertion API as Jest (which is built on Chai). All assertions are available via `expect()`.

## Equality

| Assertion | Description |
| --------- | ----------- |
| `expect(x).toBe(y)` | Strict equality (`Object.is`) |
| `expect(x).toEqual(y)` | Deep equality for objects/arrays |
| `expect(x).toStrictEqual(y)` | Deep equality + type checks (undefined, etc.) |
| `expect(x).not.toBe(y)` | Negation |

## Truthiness

| Assertion | Description |
| --------- | ----------- |
| `expect(x).toBeTruthy()` | Truthy value |
| `expect(x).toBeFalsy()` | Falsy value |
| `expect(x).toBeDefined()` | Not `undefined` |
| `expect(x).toBeUndefined()` | `undefined` |
| `expect(x).toBeNull()` | `null` |

## Numbers

| Assertion | Description |
| --------- | ----------- |
| `expect(n).toBeGreaterThan(m)` | `n > m` |
| `expect(n).toBeGreaterThanOrEqual(m)` | `n >= m` |
| `expect(n).toBeLessThan(m)` | `n < m` |
| `expect(n).toBeLessThanOrEqual(m)` | `n <= m` |
| `expect(n).toBeCloseTo(m, numDigits)` | Float comparison with precision |
| `expect(n).toBeNaN()` | `NaN` |

## Strings

| Assertion | Description |
| --------- | ----------- |
| `expect(s).toMatch(/regex/)` | Matches regex |
| `expect(s).toContain(substr)` | Includes substring |
| `expect(s).toHaveLength(n)` | Length equals n |

## Arrays and Iterables

| Assertion | Description |
| --------- | ----------- |
| `expect(arr).toContain(item)` | Array contains item |
| `expect(arr).toContainEqual(item)` | Array contains object matching shape |
| `expect(arr).toHaveLength(n)` | Array length |
| `expect(arr).toEqual(expect.arrayContaining([...]))` | Array contains subset |

## Objects

| Assertion | Description |
| --------- | ----------- |
| `expect(obj).toHaveProperty(key)` | Has property |
| `expect(obj).toHaveProperty(key, value)` | Property equals value |
| `expect(obj).toMatchObject(partial)` | Contains subset of properties |
| `expect(obj).toHaveLength(n)` | For array-like (length property) |

## Functions and Mocks

| Assertion | Description |
| --------- | ----------- |
| `expect(fn).toHaveBeenCalled()` | Called at least once |
| `expect(fn).toHaveBeenCalledTimes(n)` | Called exactly n times |
| `expect(fn).toHaveBeenCalledWith(arg1, arg2)` | Called with specific args |
| `expect(fn).toHaveBeenLastCalledWith(arg1, arg2)` | Last call args |
| `expect(fn).toHaveBeenNthCalledWith(n, arg1, arg2)` | Nth call args |
| `expect(fn).toHaveReturned()` | Returned (did not throw) |
| `expect(fn).toHaveReturnedWith(value)` | Returned specific value |
| `expect(fn).toThrow()` | Threw an error |
| `expect(fn).toThrow(error)` | Threw specific error type/message |

## Async

| Assertion | Description |
| --------- | ----------- |
| `await expect(promise).resolves.toBe(value)` | Resolved value |
| `await expect(promise).rejects.toThrow()` | Rejected with error |

## Snapshots

| Assertion | Description |
| --------- | ----------- |
| `expect(obj).toMatchSnapshot()` | File snapshot |
| `expect(obj).toMatchInlineSnapshot(\`...\`)` | Inline snapshot |

## Type Assertions (TypeScript)

Use `expect.any(constructor)` for flexible matching:

```ts
expect(fn).toHaveBeenCalledWith(expect.any(String), expect.any(Number))
expect(obj).toEqual({ id: expect.any(Number), name: expect.any(String) })
```

## Negation

Prefix any assertion with `.not`:

```ts
expect(x).not.toBeNull()
expect(arr).not.toContain(undefined)
```
