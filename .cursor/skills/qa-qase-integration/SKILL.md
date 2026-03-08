---
name: qa-qase-integration
description: Qase.io TMS integration for syncing test cases, pushing test run results, and pulling test case updates between local QA workflow and Qase.io projects via REST API.
dependencies:
  recommended:
    - qa-testcase-from-docs
    - qa-test-reporter
---

# QA Qase Integration

## Purpose

Integrate the QA Skills ecosystem with Qase.io Test Management System. Sync test cases from Phase 2 outputs to Qase.io projects, push test execution results from CI/CD (JUnit XML → Qase runs), and pull test case updates back into local markdown/JSON for bidirectional traceability.

## Features

| Feature | Description |
| ------- | ----------- |
| **Sync test cases** | Push Phase 2 test case outputs (from qa-testcase-from-docs, qa-testcase-from-ui) to Qase.io projects |
| **Push test results** | Map JUnit XML (and similar) to Qase test runs; create runs and post results |
| **Pull updates** | Fetch test case changes from Qase.io into local markdown/JSON |
| **Manage suites** | Create/update test suites and organize cases |
| **Manage runs** | Create test runs, post results, track execution status |
| **Manage defects** | Create defects from failed results; link to test cases |

## API Configuration

| Setting | Value |
| ------- | ----- |
| **Base URL** | `https://api.qase.io/v1` |
| **Authentication** | `Token: {QASE_API_TOKEN}` header |
| **Token source** | `.env` file — never hardcode |
| **Rate limits** | 1,000 req/min per user; 3,000 req/min per IP |

See `references/api-reference.md` for full endpoint details.

## Key Endpoints

| Resource | Method | Path |
| -------- | ------ | ---- |
| Projects | GET, POST | `/project` |
| Test Suites | GET, POST | `/suite/{code}` |
| Test Cases | GET, POST, PATCH | `/case/{code}` |
| Test Runs | GET, POST | `/run/{code}` |
| Test Results | POST | `/result/{code}/{run_id}` |
| Defects | GET, POST | `/defect/{code}` |

`{code}` = project code (2–10 chars).

## Workflow

```
Generate test cases (Phase 2) → Sync to Qase.io → Run tests → Push results → Track defects
```

1. **Generate** — Use qa-testcase-from-docs, qa-testcase-from-ui, or qa-manual-test-designer to produce test cases.
2. **Sync** — Map local format to Qase.io fields; create/update suites and cases.
3. **Run** — Execute tests in CI/CD (Jest, pytest, Playwright, etc.).
4. **Push** — Parse JUnit XML (or qase-api reporter output); create run; post results.
5. **Track** — Create defects from failures; link to cases and runs.

See `references/field-mapping.md` for local → Qase field mapping.

## Field Mapping Summary

| Local Field | Qase.io Field |
| ----------- | ------------- |
| title | title |
| description | description |
| preconditions | preconditions |
| steps (Action \| Expected) | steps[].action, steps[].expected_result |
| priority | priority (enum) |
| severity | severity (enum) |
| type | type (enum) |
| automation status | automation (enum) |

Full mapping and enums in `references/field-mapping.md`.

## Integrations

| Skill | Use |
| ----- | --- |
| **qa-testcase-from-docs** | Source of test cases to sync |
| **qa-testcase-from-ui** | Source of test cases to sync |
| **qa-manual-test-designer** | Source of manual test cases |
| **qa-test-reporter** | JUnit XML parsing, report aggregation |
| **qa-bug-ticket-creator** | Defect creation patterns; optionally link Qase defects to GitHub |
| **qa-orchestrator** | Pipeline coordination (docs → cases → sync → run → report) |

## Trigger Phrases

- "Sync test cases to Qase.io"
- "Push JUnit results to Qase"
- "Create Qase run from test output"
- "Pull test cases from Qase.io"
- "Map local test cases to Qase format"
- "Create defect in Qase from failed test"

## Scope

**Can do (autonomous):**
- Sync test cases from local markdown/JSON to Qase.io
- Create/update test suites and test cases
- Create test runs and post results from JUnit XML
- Map local format to Qase fields per `references/field-mapping.md`
- Create defects from failed results
- Pull test case updates into local format

**Cannot do (requires confirmation):**
- Modify Qase.io project settings (roles, custom fields, integrations)
- Bulk delete test cases or suites
- Change project code or workspace

**Will not do (out of scope):**
- Delete Qase.io projects
- Modify billing or subscription
- Access Qase.io UI or perform manual actions

## Quality Checklist

Before syncing or pushing:

- [ ] `QASE_API_TOKEN` present in `.env`; never in code
- [ ] Project code valid (2–10 chars, matches target project)
- [ ] Local test case format matches mapping in `references/field-mapping.md`
- [ ] JUnit XML (or equivalent) parseable; test names mappable to Qase cases
- [ ] Rate limits considered for bulk operations (batch if needed)
- [ ] Idempotency: check for existing case/run before create where appropriate

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| 401 Unauthorized | Missing or invalid token | Verify `QASE_API_TOKEN` in `.env`; check token at app.qase.io/user/api/token |
| 403 Forbidden | Insufficient permissions | Verify role has required access; see Qase RBAC docs |
| 404 Not Found | Invalid project code or ID | Confirm project code (2–10 chars); verify run/case/suite IDs exist |
| 422 Unprocessable | Invalid field values | Check `references/field-mapping.md` for valid enums; validate request body |
| 429 Too Many Requests | Rate limit exceeded | Implement backoff; batch requests; respect Retry-After header |
| Case not found when pushing results | Case ID mismatch | Map JUnit test name to Qase case_id; use case title matching or external IDs |
| Duplicate cases on sync | No deduplication | Match by title+suite or custom ID; update existing instead of create |

## References

| Topic | File |
| ----- | ---- |
| API endpoints, request/response examples | `references/api-reference.md` |
| Local ↔ Qase field mapping, enums | `references/field-mapping.md` |
| CI/CD integration (GitHub Actions, qase-api) | `references/ci-integration.md` |
