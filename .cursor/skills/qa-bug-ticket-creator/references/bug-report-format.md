# Bug Report Format Reference

*Detailed format for structured bug reports per ISO 29119-3 incident report structure.*

---

## Template Structure

### 1. Title

- **Format:** `[Component] Brief description of the failure`
- **Example:** `[Auth] Login fails when password contains special characters`
- **Rules:** Concise, actionable, no jargon; include component when known

### 2. Expected Result

- What **should** happen per specification, requirements, or design
- Reference requirement/spec ID when available
- **Example:** "User should be able to log in with a password containing `!@#$%^&*()` per REQ-AUTH-001"

### 3. Actual Result

- What **actually** happens
- Include error messages, HTTP status codes, UI state
- **Example:** "Login returns 500 Internal Server Error; UI shows 'Something went wrong'"

### 4. Steps to Reproduce

- Numbered, minimal steps
- Include test data (e.g., username, input values) when relevant
- **Example:**
  1. Navigate to /login
  2. Enter username `test@example.com`
  3. Enter password `P@ssw0rd!`
  4. Click "Sign In"

### 5. Environment

| Field | Example |
| ----- | ------- |
| OS | Windows 11, macOS 14, Ubuntu 22.04 |
| Browser/App | Chrome 120, Firefox 121, Safari 17 |
| App Version | 2.3.1 |
| Test Framework | Playwright 1.40, pytest 7.4 |

### 6. Evidence

- **Screenshots** — UI state, error dialogs
- **Logs** — Application logs, test runner output
- **Stack traces** — Full trace for exceptions
- **HAR / Network** — When API or network-related

Use code blocks for logs and stack traces:

```text
AssertionError: Expected status 200, got 500
  at LoginPage.submit (login.spec.ts:42)
  at test (login.spec.ts:38)
```

### 7. Severity

See `references/severity-guide.md` for classification.

### 8. Priority

P1 (Critical) through P5 (Low) or equivalent.

### 9. Component/Module

- Affected area: `auth`, `checkout`, `api`, `frontend`, `backend`, etc.
- Used for labels, routing, and duplicate search

---

## Example: Full Bug Report (Markdown)

```markdown
## [Auth] Login fails when password contains special characters

### Expected Result
User should be able to log in with a password containing special characters `!@#$%^&*()` per REQ-AUTH-001.

### Actual Result
Login returns HTTP 500; UI displays "Something went wrong". No error details shown to user.

### Steps to Reproduce
1. Navigate to https://app.example.com/login
2. Enter username: `test@example.com`
3. Enter password: `P@ssw0rd!`
4. Click "Sign In"

### Environment
- OS: Windows 11
- Browser: Chrome 120
- App Version: 2.3.1
- Test: Playwright 1.40

### Evidence
```
POST /api/auth/login → 500 Internal Server Error
Response: {"error":"Internal server error"}

Stack trace:
  at AuthService.login (auth.service.ts:45)
  at LoginController.handle (login.controller.ts:22)
```

### Severity
**Major** — Core functionality affected; workaround exists (avoid special chars)

### Priority
P2

### Component
auth
```

---

## Mapping from Test Failure Formats

### JUnit XML

| JUnit Field | Bug Report Field |
| ----------- | ---------------- |
| `testcase.name` | Title (sanitized) |
| `testcase.classname` | Component (derived) |
| `failure.message` | Actual result |
| `failure` (text) | Evidence (stack trace) |
| `testsuite.name` | Component / Module |

### Playwright JSON

| Playwright Field | Bug Report Field |
| ---------------- | ---------------- |
| `test.title` | Title |
| `test.file` | Component (from path) |
| `result.error.message` | Actual result |
| `result.error.stack` | Evidence |
| `attachments` | Evidence (screenshots, traces) |

### pytest

| pytest Field | Bug Report Field |
| ------------ | ---------------- |
| `nodeid` | Title, Component |
| `longrepr` | Actual result, Evidence |
| `call` (traceback) | Evidence |
