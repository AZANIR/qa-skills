# Specification Patterns

Common specification patterns for recurring feature types. Use these as templates when writing specs.

---

## Forms

### Input Specification Pattern
| Field | Type | Required | Validation | Default |
| ----- | ---- | -------- | ---------- | ------- |
| email | string | Yes | RFC 5322, max 254 chars | — |
| password | string | Yes | Min 8, max 128, complexity rules | — |
| phone | string | No | E.164 format if provided | null |

### Boundary Conditions
- Empty required fields → validation error before submit
- Max length exceeded → truncation or error (specify which)
- Special characters in text fields → escape/sanitize rules
- Unicode/emoji support → define allowed character set

### Error Handling
| Condition | Behavior |
| --------- | -------- |
| Client-side validation fails | Inline message, prevent submit |
| Server-side validation fails | 400, field-level error map |
| Duplicate submission | Idempotency key or disable button |
| Session expired during submit | 401, redirect to login |

### Acceptance Criteria Pattern
```gherkin
Scenario: Valid form submission
  Given the user has filled all required fields correctly
  When the user submits the form
  Then the form data is saved
  And a success message is displayed
  And the user is redirected to the confirmation page

Scenario: Required field validation
  Given the user is on the registration form
  When the user leaves "email" empty and submits
  Then "Email is required" is displayed
  And the form is not submitted
```

---

## APIs

### Request/Response Specification
| Method | Path | Auth | Request Body | Response |
| ------ | ---- | ---- | ------------ | -------- |
| POST | /api/v1/orders | Bearer | OrderCreateDto | 201 + Order |
| GET | /api/v1/orders/{id} | Bearer | — | 200 + Order or 404 |

### Input Specifications
- Path params: type, format (UUID, slug), validation
- Query params: type, allowed values, pagination (page, limit, max)
- Headers: Content-Type, Authorization, idempotency-key
- Body: schema reference, required vs optional

### Boundary Conditions
- Pagination: page=0, page=-1, limit=0, limit=10000
- Empty collections vs null
- Optional fields: omit vs null vs empty string
- Content-Length limits

### Error Handling
| Status | Condition | Response Body |
| ------ | --------- | ------------- |
| 400 | Validation error | `{ "errors": [{ "field": "...", "message": "..." }] }` |
| 401 | Missing/invalid token | `{ "error": "unauthorized" }` |
| 404 | Resource not found | `{ "error": "not_found", "id": "..." }` |
| 409 | Conflict (e.g., duplicate) | `{ "error": "conflict", "details": "..." }` |
| 429 | Rate limit exceeded | Retry-After header, error body |

### Acceptance Criteria Pattern
```gherkin
Scenario: Successful API call
  Given a valid authentication token
  And the resource exists
  When the client sends a GET request to "/api/v1/orders/123"
  Then the response status is 200
  And the response body contains the order JSON

Scenario: Unauthorized access
  Given no authentication token
  When the client sends a GET request to "/api/v1/orders/123"
  Then the response status is 401
  And the response body contains an error message
```

---

## Search & Filter

### Input Specification
| Parameter | Type | Required | Validation | Default |
| --------- | ---- | -------- | ---------- | ------- |
| q | string | No | Max 200 chars, sanitize | "" |
| category | enum | No | From allowed list | all |
| sort | enum | No | field:asc\|desc | relevance |
| page | integer | No | Min 1, max 100 | 1 |
| limit | integer | No | Min 1, max 50 | 20 |

### Boundary Conditions
- Empty search query → return all or require non-empty (specify)
- Invalid filter value → ignore or 400
- No results → empty array, not null
- Sort by non-indexed field → define performance expectations

### Edge Cases
- SQL injection / NoSQL injection in search terms
- Very long search strings
- Special regex characters in query
- Unicode search (collation rules)
- Concurrent index updates during search

### Acceptance Criteria Pattern
```gherkin
Scenario: Search with results
  Given the index contains matching items
  When the user searches for "laptop"
  Then results matching "laptop" are returned
  And results are ordered by relevance
  And pagination metadata is included

Scenario: Search with no results
  Given the index has no matching items
  When the user searches for "xyznonexistent"
  Then an empty array is returned
  And total count is 0
```

---

## Authentication

### Flow Specification
1. Login: credentials → token + refresh token
2. Token refresh: refresh token → new access token
3. Logout: invalidate tokens (server-side)
4. Password reset: request → email link → new password

### Input Specifications
| Field | Validation |
| ----- | ---------- |
| username/email | Required, format |
| password | Required, min length |
| refresh_token | JWT format, not expired |
| new_password | Complexity rules, not same as current |

### Boundary Conditions
- Lockout after N failed attempts
- Token expiry (access vs refresh)
- Concurrent sessions (allow or deny)
- Password history (prevent reuse of last N)

### Error Handling
| Condition | Response |
| --------- | -------- |
| Invalid credentials | 401, generic message (no user enumeration) |
| Account locked | 423, lockout duration |
| Token expired | 401, use refresh token |
| Refresh token expired | 401, re-login required |

### Acceptance Criteria Pattern
```gherkin
Scenario: Successful login
  Given valid credentials exist
  When the user submits valid credentials
  Then an access token is returned
  And a refresh token is returned
  And tokens are stored securely

Scenario: Account lockout
  Given the user has 4 failed login attempts
  When the user attempts to login again with wrong password
  Then the account is locked for 15 minutes
  And "Account temporarily locked" is displayed
```

---

## File Operations

### Input Specification
| Parameter | Type | Validation |
| --------- | ---- | ---------- |
| file | binary | Max size, allowed MIME types |
| filename | string | Max length, allowed chars, extension |
| overwrite | boolean | Default false |

### Boundary Conditions
- File size: 0 bytes, exactly max, over max
- Filename: empty, path traversal (../), reserved names
- Concurrent upload of same filename
- Disk full during write
- Partial upload (chunked) interruption

### Error Handling
| Condition | Behavior |
| --------- | -------- |
| File too large | 413, clear message with max size |
| Invalid file type | 400, list allowed types |
| Filename invalid | 400, sanitization rules |
| Storage unavailable | 503, retry guidance |
| Virus detected | 400, quarantine (if applicable) |

### Acceptance Criteria Pattern
```gherkin
Scenario: Successful file upload
  Given the user has selected a valid file under 10MB
  When the user uploads the file
  Then the file is stored with a unique ID
  And the file metadata is returned
  And the file is accessible at the returned URL

Scenario: File size exceeded
  Given the user has selected a file larger than 10MB
  When the user attempts to upload
  Then an error "File must be under 10MB" is displayed
  And the file is not stored
```

---

## Notifications

### Channel Specification
| Channel | Input | Delivery | Retry |
| ------- | ----- | -------- | ----- |
| Email | to, subject, body, attachments | Async | 3 attempts, exponential backoff |
| SMS | to, message (160 chars) | Async | 2 attempts |
| Push | device_token, payload | Async | 1 attempt |
| In-app | user_id, message, link | Sync | N/A |

### Boundary Conditions
- Empty recipient list
- Invalid email/phone format
- Message length limits (SMS 160, push payload size)
- Rate limiting per user/channel
- Unsubscribe / opt-out handling

### Edge Cases
- Duplicate notifications (idempotency)
- User opts out mid-send
- Provider (email/SMS) returns temporary failure
- Notification preferences (do not disturb, channel off)

### Error Handling
| Condition | Behavior |
| --------- | -------- |
| Invalid recipient | Skip, log, continue with others |
| Provider down | Queue, retry later |
| User unsubscribed | Do not send, update preference |
| Rate limit hit | Queue for next window |

### Acceptance Criteria Pattern
```gherkin
Scenario: Email notification sent
  Given the user has enabled email notifications
  And an event triggers a notification
  When the notification is processed
  Then an email is queued for delivery
  And the email contains the correct content
  And the notification is marked as sent

Scenario: User opted out
  Given the user has disabled email notifications
  When an event triggers an email notification
  Then no email is sent
  And the notification is marked as skipped
```
