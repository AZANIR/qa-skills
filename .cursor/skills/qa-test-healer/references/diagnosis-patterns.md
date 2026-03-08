# Diagnosis Patterns for Test Failures

Patterns for diagnosing test failures: error message parsing, DOM comparison, and network analysis.

## 1. Error Message Parsing

### Playwright Error Structure

Playwright failures typically include:
- **Error type** — `TimeoutError`, `Error`, `AssertionError`
- **Locator** — The selector that failed
- **Action** — click, fill, toBeVisible, etc.
- **Expected vs actual** — For assertions

### Extraction Patterns

| Pattern | Regex/Approach | Use |
|---------|----------------|-----|
| Selector in error | `locator\('([^']+)'\)` or `getByRole\('([^']+)'` | Identify which locator failed |
| Timeout value | `Timeout (\d+)ms` | Check if timeout is too short |
| Expected text | `Expected: (.*)` | Compare with actual |
| Actual text | `Received: (.*)` | Compare with expected |
| Stack trace file:line | `at.*\(([^:]+):(\d+):\d+\)` | Locate exact line in test file |

### Example Parse

```
Error: expect(locator).toHaveText(expected)
Expected: "Welcome"
Received: "Welcome back!"
```

**Extracted:** Assertion `toHaveText`; expected `"Welcome"`; actual `"Welcome back!"` → Likely intentional product change.

### Cypress Error Structure

- `cy.get(...).should(...)` — Selector and assertion in chain
- `Timed out retrying` — Timeout/visibility issue
- `Expected X to equal Y` — Assertion mismatch

### pytest/Playwright Python

- `TimeoutError` with locator repr
- `AssertionError: assert X == Y`

---

## 2. DOM Comparison

### Using Accessibility Snapshot

1. **Navigate to failure state** — Run test in headed mode; stop at failure or use `page.pause()`
2. **Take snapshot** — `browser_snapshot` (Playwright MCP) returns accessibility tree
3. **Compare expected vs actual** — Look for:
   - Missing elements (role/name not in tree)
   - Renamed elements (text changed)
   - Structure change (nested differently)
   - New overlays (modal, loading) blocking interaction

### Snapshot Analysis Checklist

- [ ] Is the target element present? (search by role, name, or ref)
- [ ] Is it visible/enabled? (check `aria-hidden`, `disabled`)
- [ ] Is it obscured? (modal, overlay, another element on top)
- [ ] Has the hierarchy changed? (element moved under different parent)
- [ ] Are there multiple matches? (strict mode violation)

### Interpreting Snapshot Output

```
button "Submit" [ref=abc123]
  - enabled, visible
```

If test expects `button "Save"` but snapshot shows `button "Submit"` → Update locator or mark as product change.

### Scoped Snapshots

Use `selector` parameter to snapshot a subtree (e.g., a form or modal) when the full page is large.

---

## 3. Network Analysis

### When to Use

- Test fails after API call
- Mock not applied
- Request timeout or 404
- Response body/status changed

### Inspection Steps

1. **List requests** — `browser_network_requests` (Playwright MCP) or test trace
2. **Filter by URL** — Find the request that failed or returned unexpected data
3. **Check method/URL** — Did endpoint path change? (e.g., `/api/users` → `/api/v2/users`)
4. **Check response** — Status code, body shape
5. **Check timing** — Request took too long?

### Common Network Failure Causes

| Cause | Symptom | Fix |
|-------|---------|-----|
| Endpoint renamed | 404 | Update `page.route` URL pattern |
| Response shape changed | Assertion on body fails | Update mock response or assertion |
| Request not sent | No matching request | Ensure route registered before `goto` |
| Slow API | Timeout | Increase timeout or add retry |
| CORS/auth | Request blocked | Update route handler or headers |

### Route Registration Order

```typescript
// Correct: route before navigation
await page.route('**/api/data', handler);
await page.goto('/page');
```

```typescript
// Wrong: navigation may complete before route is set
await page.goto('/page');
await page.route('**/api/data', handler);
```

---

## 4. Combining Diagnosis Methods

For complex failures, combine:

1. **Parse error** → Get selector, assertion, expected/actual
2. **Snapshot DOM** → Verify element exists and state
3. **Check network** → If failure involves API, verify requests

### Decision Flow

```
Parse error
  → Selector timeout? → Snapshot: is element present? → Yes: increase timeout / add wait
  → Selector timeout? → Snapshot: element missing? → Fixme or update flow
  → Assertion mismatch? → Compare expected vs actual → Update or fixme
  → Network error? → Inspect requests → Update route/mock
```
