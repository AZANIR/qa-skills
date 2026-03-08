# Field Mapping: Local QA Skills ↔ Qase.io

## Test Case Fields

| Local (QA Skills) | Qase.io Field | Notes |
| ----------------- | ------------- | ----- |
| ID | — | Local identifier; use for traceability; Qase assigns its own `id` |
| Title | `title` | Required; max 255 chars |
| Description | `description` | Free text |
| Module / Component | `suite_id` or `suite_title` | Map to Qase suite |
| Preconditions | `preconditions` | Free text |
| Steps (Action \| Expected) | `steps[].action`, `steps[].expected_result` | See steps format below |
| Postconditions | `postconditions` | Free text |
| Test Data | `steps[].data` or in description | Optional |
| Traceability (Req ID) | `tags` or custom field | e.g., tag `req:REQ-FN-001` |
| Priority | `priority` | See Priority enum |
| Severity | `severity` | See Severity enum |
| Type | `type` | See Type enum |
| Automation status | `automation` | See Automation enum |

## Steps Format

**Local (QA Skills):**
```
| Step# | Action | Expected Result |
| 1 | Enter valid email | Email accepted |
| 2 | Enter valid password | Password accepted |
| 3 | Click Login | User is logged in |
```

**Qase.io:**
```json
{
  "steps": [
    {
      "action": "Enter valid email",
      "expected_result": "Email accepted"
    },
    {
      "action": "Enter valid password",
      "expected_result": "Password accepted"
    },
    {
      "action": "Click Login",
      "expected_result": "User is logged in"
    }
  ]
}
```

## Priority Enum

| Local | Qase.io (integer) | Qase.io (slug) |
| ----- | ----------------- | -------------- |
| Critical / P1 | 1 | `critical` |
| High / P2 | 2 | `high` |
| Medium / P3 | 3 | `medium` |
| Low / P4 | 4 | `low` |
| Not set | 5 | `not_set` |

## Severity Enum

| Local | Qase.io (integer) | Qase.io (slug) |
| ----- | ----------------- | -------------- |
| Blocker | 1 | `blocker` |
| Critical | 2 | `critical` |
| Major | 3 | `major` |
| Minor | 4 | `minor` |
| Trivial | 5 | `trivial` |
| Not set | 6 | `not_set` |

## Type Enum

| Local | Qase.io (integer) |
| ----- | ----------------- |
| functional | 1 |
| smoke | 2 |
| regression | 3 |
| security | 4 |
| usability | 5 |
| performance | 6 |
| other | 7 |

## Automation Enum

| Local | Qase.io (integer) |
| ----- | ----------------- |
| Manual / Not automated | 0 |
| Automated | 1 |
| To be automated | 2 |

## Test Result Status

| JUnit / Source | Qase.io `status` |
| -------------- | ---------------- |
| passed / success | `passed` |
| failed / failure | `failed` |
| skipped | `skipped` |
| error / blocked | `blocked` |
| (invalid) | `invalid` |

## Local Test Case JSON Example

```json
{
  "id": "TC-LOGIN-001",
  "title": "Valid login",
  "module": "Auth",
  "priority": "High",
  "severity": "Major",
  "type": "functional",
  "automation": "Planned",
  "preconditions": "User is on login page",
  "steps": [
    { "action": "Enter valid email", "expected": "Email accepted" },
    { "action": "Enter valid password", "expected": "Password accepted" },
    { "action": "Click Login", "expected": "User is logged in" }
  ],
  "traceability": ["REQ-FN-001"]
}
```

## Mapped Qase.io Payload

```json
{
  "title": "Valid login",
  "description": "",
  "preconditions": "User is on login page",
  "suite_id": 1,
  "priority": 2,
  "severity": 3,
  "type": 1,
  "automation": 2,
  "tags": ["req:REQ-FN-001", "Auth"],
  "steps": [
    { "action": "Enter valid email", "expected_result": "Email accepted" },
    { "action": "Enter valid password", "expected_result": "Password accepted" },
    { "action": "Click Login", "expected_result": "User is logged in" }
  ]
}
```

## Custom Fields

Qase.io supports custom fields. Map local fields to `custom_field` object:

```json
{
  "custom_field": {
    "1": "REQ-FN-001",
    "2": "2024-Q1"
  }
}
```

Field IDs come from Qase project settings. Configure mapping per project.
