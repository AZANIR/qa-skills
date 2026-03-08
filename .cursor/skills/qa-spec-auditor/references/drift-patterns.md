# Common Spec Drift Patterns and Remediation

## Overview

Spec drift occurs when documentation, requirements, or specs diverge from actual implementation. This reference catalogs common patterns and recommended remediation.

---

## Pattern 1: Behavior Changed, Docs Not Updated

### Description

Implementation was modified (bug fix, enhancement, refactor) but requirements, specs, or user docs were not updated.

### Detection

- Git history: code changed, doc files unchanged
- Compare current behavior to doc description
- User reports: "The docs say X but it does Y"

### Remediation

| Owner | Action |
|-------|--------|
| **Tech writer / QA** | Update requirements, spec, or user docs to match implementation |
| **Product** | Confirm if behavior change was intentional; if not, file bug |
| **Dev** | Add "update docs" to DoD for behavior-changing PRs |

### Prevention

- Include doc updates in PR checklist
- Link requirements to implementation in traceability
- Periodic spec audits (this skill)

---

## Pattern 2: Undocumented Feature

### Description

A feature exists in the product (UI, API, behavior) but has no corresponding requirement, spec, or documentation.

### Detection

- UI exploration: flows or elements not in requirements
- API: endpoints not in OpenAPI or requirements
- Code: features without doc references

### Remediation

| Owner | Action |
|-------|--------|
| **Product / BA** | Add requirement; assess if intentional or technical debt |
| **QA** | Create test cases; add to RTM |
| **Tech writer** | Document in user docs, API docs |
| **qa-task-creator** | Create tasks: "Add requirement for [feature]", "Document [endpoint]" |

### Prevention

- Feature flags with doc requirement
- API-first design: OpenAPI before implementation
- Exploratory testing to catch gaps

---

## Pattern 3: Outdated Documentation

### Description

Documentation describes old behavior, deprecated options, or incorrect steps. Implementation has moved on.

### Detection

- Setup steps fail
- API examples return different structure
- Screenshots don't match UI
- Changelog missing recent releases

### Remediation

| Owner | Action |
|-------|--------|
| **Tech writer** | Update affected sections; verify against current implementation |
| **Dev** | Update code comments, README, inline docs |
| **QA** | Re-verify doc examples; report inaccuracies |

### Prevention

- Doc review in release process
- Automated checks: run doc examples in CI
- Single source of truth (e.g., OpenAPI for API docs)

---

## Pattern 4: Requirements ↔ Test Gap

### Description

- **Untested requirement:** Requirement has no test
- **Orphan test:** Test has no requirement traceability
- **Stale test:** Test passes but doesn't validate current behavior

### Detection

- RTM gaps (qa-coverage-analyzer)
- Test name/description doesn't match any requirement
- Test steps outdated after behavior change

### Remediation

| Gap Type | Action |
|----------|--------|
| **Untested requirement** | Create test (qa-testcase-from-docs); add to RTM |
| **Orphan test** | Map to requirement or deprecate if redundant |
| **Stale test** | Update test steps; re-validate against current behavior |

### Prevention

- RTM maintained in same workflow as requirements
- Test review when requirements change
- Traceability in test case format

---

## Pattern 5: API Contract Drift

### Description

- OpenAPI/spec doesn't match actual API responses
- New parameters, fields, or endpoints not in spec
- Deprecated fields still in spec but removed from API

### Detection

- Contract testing (Pact, OpenAPI validator)
- Manual comparison: actual response vs schema
- Consumer integration failures

### Remediation

| Owner | Action |
|-------|--------|
| **API owner** | Update OpenAPI to match implementation |
| **qa-api-contract-curator** | Formalize contract from traffic or code |
| **Consumer teams** | Update clients if breaking change |

### Prevention

- OpenAPI generated from code (or vice versa)
- Contract tests in CI
- Versioning and deprecation policy

---

## Pattern 6: "Worn Out" Regression Tests

### Description

Tests that always pass, run frequently, but rarely catch bugs. They consume time without adding value. Often cover stable, low-risk areas.

### Detection

- Execution history: 100% pass over many runs
- Low risk score (qa-risk-analyzer)
- Redundant with other tests

### Remediation

| Action | When |
|--------|------|
| **Rotate out** | Run less frequently (e.g., weekly vs every PR) |
| **Consolidate** | Merge with similar tests |
| **Deprioritize** | Run after high-risk tests |
| **Remove** | If truly redundant and low value |

### Prevention

- Risk-based test prioritization
- Periodic test value assessment
- Replace static tests with parameterized or generated tests for coverage

---

## Severity Guidelines

| Severity | Criteria | Example |
|----------|----------|---------|
| **Critical** | Blocking; wrong behavior; security | Auth flow doesn't match spec; API returns wrong data |
| **High** | Major discrepancy; user impact | Required validation missing; doc steps fail |
| **Medium** | Noticeable drift; moderate impact | Extra field in API; outdated screenshot |
| **Low** | Minor; cosmetic | Typo in doc; deprecated option still listed |

---

## Task Suggestion Format for qa-task-creator

When producing task suggestions, use this structure:

```markdown
## Task: [Title]
- **Type:** doc_update | spec_fix | test_creation | implementation_fix
- **Dimension:** req_ui | req_api | req_tests | docs_impl
- **Finding:** [Brief description]
- **Action:** [Specific action]
- **Artifacts:** [Files, IDs, URLs]
- **Priority:** critical | high | medium | low
```
