# Spec Audit Checklist by Dimension

## Overview

Use these checklists when auditing each comparison dimension. Tick items as verified; flag any mismatches as findings.

---

## 1. Requirements ↔ UI/Behavior

### Prerequisites

- Requirements document with IDs and acceptance criteria
- Live UI URL (or Playwright MCP target)
- Optional: Screenshots, Figma links

### Checklist

| # | Check | How to Verify | Finding Type |
|---|-------|---------------|--------------|
| 1 | All required flows exist in UI | Navigate each flow; verify steps | Missing flow |
| 2 | UI elements match spec (labels, placeholders) | Compare text, ARIA, structure | Spec drift |
| 3 | Validation rules match spec | Trigger invalid input; compare messages | Spec drift |
| 4 | Required fields enforced | Omit required fields; verify blocking | Spec drift |
| 5 | Error states documented and implemented | Trigger errors; compare to spec | Undocumented / Drift |
| 6 | Navigation/structure matches spec | Compare menu, breadcrumbs, routes | Spec drift |
| 7 | No extra flows not in spec | Explore UI; flag unknown flows | Undocumented feature |
| 8 | Accessibility (if in spec) | axe-core, keyboard nav per WCAG | Spec drift |

### Output

- List of requirements with UI mismatches
- Severity: Critical (blocking), High (wrong behavior), Medium (cosmetic), Low (minor)

---

## 2. Requirements ↔ API Contract

### Prerequisites

- Requirements with API expectations
- OpenAPI spec or equivalent
- Optional: Actual endpoint responses (from network traffic)

### Checklist

| # | Check | How to Verify | Finding Type |
|---|-------|---------------|--------------|
| 1 | All required endpoints exist | Compare req IDs to OpenAPI paths | Missing endpoint |
| 2 | Request/response schema matches spec | Compare JSON schema to requirements | Spec drift |
| 3 | Status codes match spec | Document expected 200/400/404/etc. | Spec drift |
| 4 | Authentication/authorization per spec | Verify auth headers, scopes | Spec drift |
| 5 | No undocumented endpoints | List all OpenAPI paths; flag untraced | Undocumented feature |
| 6 | Versioning matches (if applicable) | Check /v1/, /v2/ vs spec | Spec drift |
| 7 | Error response format per spec | Trigger errors; compare structure | Spec drift |
| 8 | Deprecated endpoints flagged | Check OpenAPI deprecation vs spec | Outdated doc |

### Output

- Endpoints with mismatches
- Undocumented endpoints
- Schema drift details

---

## 3. Requirements ↔ Test Results

### Prerequisites

- Requirements with IDs
- RTM (Requirement → Test Case)
- Test execution results (pass/fail, coverage)

### Checklist

| # | Check | How to Verify | Finding Type |
|---|-------|---------------|--------------|
| 1 | Every requirement has ≥1 test | RTM lookup | Untested requirement |
| 2 | Every test traces to ≥1 requirement | RTM reverse lookup | Orphan test |
| 3 | Failed tests map to requirements | Cross-ref results to RTM | Coverage gap |
| 4 | Test coverage matches risk | High-risk reqs have adequate coverage | Gap |
| 5 | Execution status current | Last run date; stale tests | Outdated |
| 6 | Automation status accurate | Manual vs automated flag | Outdated doc |
| 7 | Test design technique diversity | Per qa-coverage-analyzer | Technique gap |

### Output

- Untested requirements
- Orphan tests
- Stale or low-value tests

---

## 4. Documentation ↔ Implementation

### Prerequisites

- README, wikis, internal docs
- Codebase, UI, API (as implementation source)

### Checklist

| # | Check | How to Verify | Finding Type |
|---|-------|---------------|--------------|
| 1 | Setup/install steps work | Follow README; verify success | Outdated doc |
| 2 | API examples run | Execute doc examples; compare output | Outdated doc |
| 3 | Config options match code | Compare doc to actual config/env | Outdated doc |
| 4 | Architecture diagram matches code | Compare to structure, imports | Outdated doc |
| 5 | Changelog/release notes current | Compare to git history | Outdated doc |
| 6 | Deprecation notices accurate | Check code for deprecated flags | Outdated doc |
| 7 | No significant features missing from docs | Code review vs doc scope | Undocumented feature |
| 8 | Screenshots/UI examples current | Compare to live UI | Outdated doc |

### Output

- Doc sections to update
- Undocumented implementation details
- Broken examples or steps

---

## 5. Regression Set Optimization (Bonus)

### Prerequisites

- Test execution history (pass/fail over time)
- Test-to-requirement mapping
- Risk data (from qa-risk-analyzer)

### Checklist

| # | Check | How to Verify | Recommendation |
|---|-------|---------------|----------------|
| 1 | "Worn out" tests | Always pass, never fail, many runs | Rotate out or reduce frequency |
| 2 | High-value tests | Cover critical reqs, catch regressions | Prioritize; run first |
| 3 | Low-value, stable tests | Low risk, always pass | Deprioritize |
| 4 | Flaky tests | Intermittent failures | Fix or quarantine |
| 5 | Missing coverage for changed code | Per qa-risk-analyzer impact | Add tests |

### Output

- Tests to rotate
- Tests to prioritize
- Tests to deprioritize or remove
