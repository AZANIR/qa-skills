# Qase.io REST API Reference

Base URL: `https://api.qase.io/v1`

Authentication: `Token: {QASE_API_TOKEN}` (header)

## Projects

### GET /project

List all projects.

**Query params:** `limit` (1–100, default 10), `offset` (default 0)

**Response 200:**
```json
{
  "status": true,
  "result": {
    "total": 5,
    "filtered": 5,
    "count": 5,
    "entities": [
      {
        "title": "My Project",
        "code": "MP",
        "counts": {
          "cases": 42,
          "suites": 3,
          "milestones": 2,
          "runs": { "total": 10, "active": 1 },
          "defects": { "total": 5, "open": 2 }
        }
      }
    ]
  }
}
```

### POST /project

Create a new project.

**Request body:**
```json
{
  "title": "My Project",
  "code": "MP",
  "description": "Optional description"
}
```

**Response 200:**
```json
{
  "status": true,
  "result": {
    "id": 1,
    "code": "MP"
  }
}
```

---

## Test Suites

### GET /suite/{code}

List test suites. `{code}` = project code.

**Query params:** `limit`, `offset`, `search`

**Response 200:**
```json
{
  "status": true,
  "result": {
    "total": 3,
    "entities": [
      {
        "id": 1,
        "title": "Login",
        "description": "Login flow tests",
        "parent_id": null
      }
    ]
  }
}
```

### POST /suite/{code}

Create a test suite.

**Request body:**
```json
{
  "title": "Login",
  "description": "Login flow tests",
  "parent_id": null
}
```

**Response 200:**
```json
{
  "status": true,
  "result": {
    "id": 1
  }
}
```

---

## Test Cases

### GET /case/{code}

List test cases. `{code}` = project code.

**Query params:** `limit`, `offset`, `suite_id`, `search`, `milestone_id`, `severity`, `priority`, `type`, `automation`

**Response 200:**
```json
{
  "status": true,
  "result": {
    "total": 42,
    "entities": [
      {
        "id": 1,
        "title": "Valid login",
        "description": "User can login with valid credentials",
        "preconditions": "User is on login page",
        "postconditions": null,
        "severity": 2,
        "priority": 2,
        "type": 1,
        "automation": 1,
        "suite_id": 1,
        "steps": [
          {
            "action": "Enter valid email and password",
            "expected_result": "User is logged in"
          }
        ]
      }
    ]
  }
}
```

### POST /case/{code}

Create a test case.

**Request body:**
```json
{
  "title": "Valid login",
  "description": "User can login with valid credentials",
  "preconditions": "User is on login page",
  "postconditions": null,
  "severity": 2,
  "priority": 2,
  "type": 1,
  "automation": 1,
  "suite_id": 1,
  "steps": [
    {
      "action": "Enter valid email and password",
      "expected_result": "User is logged in"
    }
  ],
  "tags": ["login", "smoke"]
}
```

**Response 200:**
```json
{
  "status": true,
  "result": {
    "id": 1
  }
}
```

### PATCH /case/{code}/{id}

Update a test case. `{id}` = case ID.

---

## Test Runs

### GET /run/{code}

List test runs. `{code}` = project code.

**Query params:** `limit`, `offset`, `status`, `milestone_id`, `environment_id`

**Response 200:**
```json
{
  "status": true,
  "result": {
    "total": 10,
    "entities": [
      {
        "id": 1,
        "title": "Regression Run 2024-01-15",
        "status": "active",
        "is_autotest": true
      }
    ]
  }
}
```

### POST /run/{code}

Create a test run.

**Request body:**
```json
{
  "title": "Regression Run 2024-01-15",
  "description": "Full regression",
  "include_all_cases": false,
  "cases": [1, 2, 3],
  "is_autotest": true,
  "environment_id": 1,
  "milestone_id": 1,
  "tags": ["regression", "ci"]
}
```

**Response 200:**
```json
{
  "status": true,
  "result": {
    "id": 1
  }
}
```

---

## Test Results

### POST /result/{code}/{id}

Create a test result. `{code}` = project code, `{id}` = run ID.

**Request body:**
```json
{
  "case_id": 1,
  "status": "passed",
  "time_ms": 1500,
  "comment": "Optional comment",
  "stacktrace": "Optional stack trace for failures",
  "defect": false,
  "attachments": []
}
```

**Status values:** `passed`, `failed`, `blocked`, `skipped`, `invalid` (+ custom)

**Alternative (create case on-the-fly):**
```json
{
  "case": {
    "title": "New test case title",
    "suite_title": "Suite Name",
    "description": "Description",
    "preconditions": "Preconditions",
    "severity": "major",
    "priority": "high"
  },
  "status": "failed",
  "comment": "Assertion failed",
  "stacktrace": "Error: expected..."
}
```

**Response 200:**
```json
{
  "status": true,
  "result": {
    "case_id": 1,
    "hash": "abc123"
  }
}
```

### POST /result/{code}/{id}/bulk

Bulk create results. Same structure with array of result objects.

---

## Defects

### GET /defect/{code}

List defects. `{code}` = project code.

**Query params:** `limit`, `offset`, `status`, `milestone_id`

### POST /defect/{code}

Create a defect.

**Request body:**
```json
{
  "title": "Login fails with special characters",
  "actual_result": "Error 500",
  "severity": 2,
  "priority": 2,
  "description": "When password contains @#$...",
  "steps": ["Step 1", "Step 2"],
  "attachments": []
}
```

**Response 200:**
```json
{
  "status": true,
  "result": {
    "id": 1
  }
}
```

---

## Error Codes

| Code | Meaning |
| ---- | ------- |
| 400 | Bad Request |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 422 | Unprocessable Entity (validation errors) |
| 429 | Too Many Requests (rate limit; check Retry-After) |
