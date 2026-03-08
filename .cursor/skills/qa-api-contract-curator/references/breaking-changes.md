# API Breaking Changes Catalog

Catalog of API changes that break backward compatibility. Use when comparing API versions and generating breaking change reports.

## Severity Levels

| Severity | Description |
| -------- | ----------- |
| **Breaking** | Clients will fail without code changes |
| **Potentially Breaking** | May break depending on client implementation |
| **Additive** | Safe; no client changes required |

---

## 1. Endpoint Changes

### 1.1 Removed Endpoint

**Change:** Path or HTTP method no longer exists.

**Example:**
- Before: `GET /api/v1/users/{id}`
- After: Endpoint removed

**Impact:** Clients calling this endpoint will receive 404.

**Mitigation:**
- Deprecate first; keep endpoint for at least one major version
- Document migration path (e.g., use `GET /api/v2/users/{id}`)
- Return 410 Gone with migration hint

---

### 1.2 Renamed Path

**Change:** Path changed without preserving old path.

**Example:**
- Before: `GET /api/users`
- After: `GET /api/v2/customers`

**Impact:** Breaking — old path returns 404.

**Mitigation:**
- Keep old path as alias, redirect (301/308) to new path
- Or deprecate old path with clear timeline

---

### 1.3 Changed HTTP Method

**Change:** Same path now uses different method (e.g., POST → PUT).

**Example:**
- Before: `POST /api/orders` (create)
- After: `PUT /api/orders` (create or replace)

**Impact:** Breaking — clients using POST will fail.

**Mitigation:**
- Support both during transition
- Document method change in release notes

---

## 2. Request Schema Changes

### 2.1 New Required Field

**Change:** Request body schema gains a new required field.

**Example:**
- Before: `{ "email": "..." }`
- After: `{ "email": "...", "tenantId": "..." }` (tenantId required)

**Impact:** Breaking — clients not sending `tenantId` will receive 400.

**Mitigation:**
- Add field as optional first; make required in next major version
- Provide default value if business logic allows

---

### 2.2 Removed Optional Field

**Change:** Optional field removed from request schema.

**Example:**
- Before: `{ "email": "...", "legacyId": "..." }`
- After: `{ "email": "..." }` (legacyId removed)

**Impact:** Potentially breaking — clients sending `legacyId` may get 400 if server rejects unknown fields.

**Mitigation:**
- Ignore unknown fields (allow `additionalProperties`)
- Or deprecate field first, remove later

---

### 2.3 Type Change

**Change:** Field type changed (e.g., string → number, string → array).

**Example:**
- Before: `"tags": "a,b,c"` (string)
- After: `"tags": ["a", "b", "c"]` (array)

**Impact:** Breaking — clients sending string will fail validation.

**Mitigation:**
- Accept both formats during transition
- Document migration in changelog

---

### 2.4 Enum Restriction

**Change:** Field that was free-form is now an enum; or enum values removed.

**Example:**
- Before: `"status": "any string"`
- After: `"status": "pending" | "active" | "closed"`

**Impact:** Breaking — clients sending other values get 400.

**Mitigation:**
- Add new enum values gradually; avoid removing values
- If removing: deprecate first, return clear error with migration hint

---

## 3. Response Schema Changes

### 3.1 Removed Response Field

**Change:** Field removed from response body.

**Example:**
- Before: `{ "id": "...", "legacyCode": "..." }`
- After: `{ "id": "..." }`

**Impact:** Breaking — clients depending on `legacyCode` will fail.

**Mitigation:**
- Deprecate field (keep in response but document removal timeline)
- Or add replacement field first, then remove old one

---

### 3.2 New Required Field in Response

**Change:** Response schema gains a new required field.

**Example:**
- Before: `{ "id": "...", "name": "..." }`
- After: `{ "id": "...", "name": "...", "tenantId": "..." }` (tenantId required)

**Impact:** Breaking — old clients may not handle new field; strict parsers could fail.

**Mitigation:**
- Add as optional first
- Ensure clients tolerate unknown fields

---

### 3.3 Type Change in Response

**Change:** Response field type changed.

**Example:**
- Before: `"count": 42` (number)
- After: `"count": "42"` (string)

**Impact:** Breaking — clients expecting number will fail.

**Mitigation:**
- Avoid type changes; use new field name if necessary

---

### 3.4 Renamed Field

**Change:** Field name changed in response.

**Example:**
- Before: `"user_id"`
- After: `"userId"`

**Impact:** Breaking — clients using old name will fail.

**Mitigation:**
- Return both names during transition
- Document in deprecation notice

---

## 4. Parameter Changes

### 4.1 Removed Query/Header Parameter

**Change:** Parameter no longer accepted.

**Example:**
- Before: `GET /users?legacyFilter=...`
- After: Parameter ignored or 400

**Impact:** Breaking if server rejects; additive if ignored.

**Mitigation:**
- Ignore unknown parameters
- Or deprecate with timeline

---

### 4.2 New Required Parameter

**Change:** Path, query, or header parameter now required.

**Example:**
- Before: `GET /users` (optional `tenantId`)
- After: `GET /users` (required `X-Tenant-ID` header)

**Impact:** Breaking — clients not sending it get 400.

**Mitigation:**
- Introduce as optional; make required in major version

---

### 4.3 Parameter Type or Enum Change

**Change:** Parameter type or allowed values changed.

**Example:**
- Before: `?page=1` (integer)
- After: `?page=1` (string "1" required)

**Impact:** Breaking — depends on client validation.

**Mitigation:**
- Accept both formats during transition

---

## 5. Authentication & Authorization

### 5.1 New Authentication Required

**Change:** Endpoint was public; now requires auth.

**Example:**
- Before: `GET /public/data` (no auth)
- After: `GET /public/data` (Bearer token required)

**Impact:** Breaking — unauthenticated clients get 401.

**Mitigation:**
- Introduce new authenticated path; deprecate public path
- Or announce timeline for requiring auth

---

### 5.2 Changed Auth Scheme

**Change:** API key → OAuth2, or different header name.

**Example:**
- Before: `X-API-Key: xxx`
- After: `Authorization: Bearer xxx`

**Impact:** Breaking — clients using old scheme get 401.

**Mitigation:**
- Support both during transition
- Document migration steps

---

### 5.3 Scope/Permission Change

**Change:** Same endpoint now requires different scope or role.

**Example:**
- Before: `read` scope
- After: `read:users` scope required

**Impact:** Breaking — clients with old scope get 403.

**Mitigation:**
- Expand scope gradually; avoid restricting without notice

---

## 6. Status Code Changes

### 6.1 Success Code Change

**Change:** 200 → 201, or 201 → 200 for same operation.

**Example:**
- Before: `POST /users` → 200 OK
- After: `POST /users` → 201 Created

**Impact:** Potentially breaking — clients checking for 200 may fail.

**Mitigation:**
- Prefer 201 for creation; document change
- Clients should accept 2xx range when possible

---

### 6.2 Error Code Change

**Change:** 400 → 422, 404 → 410, etc.

**Example:**
- Before: Invalid input → 400
- After: Invalid input → 422 Unprocessable Entity

**Impact:** Potentially breaking — clients handling 400 specifically may miss new code.

**Mitigation:**
- Document all error responses in OpenAPI
- Clients should handle error body, not just status code

---

### 6.3 Removed Status Code

**Change:** Response that was documented no longer returned.

**Example:**
- Before: 202 Accepted for async processing
- After: 200 OK (now synchronous)

**Impact:** Breaking — clients expecting 202 may misinterpret 200.

**Mitigation:**
- Document behavior change clearly
- Consider keeping 202 with same semantics if possible

---

## 7. Additive (Non-Breaking) Changes

| Change | Example |
| ------ | ------- |
| New optional request field | `"metadata": {}` added, optional |
| New optional response field | `"etag": "..."` added to response |
| New endpoint | `GET /api/v2/reports` added |
| New optional parameter | `?includeArchived=true` added |
| New enum value | `"status": "archived"` added to enum |
| New optional header | `X-Request-ID` supported |

---

## Versioning Strategy Recommendations

1. **Semantic versioning:** Major.Minor.Patch — breaking = major bump
2. **URL versioning:** `/v1/`, `/v2/` — keep v1 until deprecated
3. **Deprecation window:** Minimum 6–12 months for breaking changes
4. **Changelog:** Document every change with migration notes
5. **Sunset headers:** `Sunset: Sat, 01 Jan 2026 00:00:00 GMT` for deprecated endpoints
