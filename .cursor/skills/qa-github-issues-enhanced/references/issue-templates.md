# Issue Templates for QA GitHub Issues

*YAML-based issue templates for Bug report, Test coverage gap, Flaky test, Documentation update, and Enhancement request.*

---

## Template Location

Place templates in `.github/ISSUE_TEMPLATE/` as `.yml` or `.yaml` files. GitHub will present them in the "New issue" dropdown.

---

## 1. Bug Report

**File**: `.github/ISSUE_TEMPLATE/bug_report.yml`

```yaml
name: Bug Report
description: Report a defect or incorrect behavior
title: "[Bug]: "
labels: ["type/bug", "status/needs-triage"]
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        ## Bug Report
        Provide a clear description of the defect.

  - type: input
    id: summary
    attributes:
      label: Summary
      description: One-line summary of the bug
      placeholder: "e.g., Login fails when password contains special characters"
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
      description: Numbered steps to reproduce
      placeholder: |
        1. Go to login page
        2. Enter email and password with special chars
        3. Click Login
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected Result
      description: What should happen per spec
      placeholder: User should be logged in successfully
    validations:
      required: true

  - type: textarea
    id: actual
    attributes:
      label: Actual Result
      description: What actually happens
      placeholder: Error message "Invalid credentials" appears
    validations:
      required: true

  - type: input
    id: environment
    attributes:
      label: Environment
      description: OS, browser, app version
      placeholder: "Windows 11, Chrome 120, app v2.1.0"
    validations:
      required: false

  - type: dropdown
    id: severity
    attributes:
      label: Severity
      description: Impact of the defect
      options:
        - Blocker
        - Critical
        - Major
        - Minor
        - Trivial
    validations:
      required: true

  - type: dropdown
    id: component
    attributes:
      label: Component
      description: Affected area
      options:
        - frontend
        - backend
        - api
        - auth
        - database
        - mobile
        - other
    validations:
      required: true

  - type: textarea
    id: evidence
    attributes:
      label: Evidence (optional)
      description: Screenshots, logs, stack traces
      render: shell
    validations:
      required: false
```

---

## 2. Test Coverage Gap

**File**: `.github/ISSUE_TEMPLATE/test_coverage_gap.yml`

```yaml
name: Test Coverage Gap
description: Report missing or insufficient test coverage
title: "[Coverage]: "
labels: ["type/test-coverage-gap", "status/needs-triage"]
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        ## Test Coverage Gap
        Identify uncovered or under-tested code.

  - type: input
    id: summary
    attributes:
      label: Summary
      description: What is not covered
      placeholder: "e.g., AuthService.login() has 0% coverage"
    validations:
      required: true

  - type: input
    id: location
    attributes:
      label: Location
      description: File and line or module
      placeholder: "src/auth/AuthService.ts:42-58"
    validations:
      required: true

  - type: dropdown
    id: coverage_type
    attributes:
      label: Coverage Type
      description: Dimension of coverage
      options:
        - code
        - requirement
        - technique
    validations:
      required: true

  - type: textarea
    id: rationale
    attributes:
      label: Rationale
      description: Why this gap matters (risk, complexity)
      placeholder: "High-risk payment flow; no integration tests"
    validations:
      required: true

  - type: dropdown
    id: component
    attributes:
      label: Component
      options:
        - frontend
        - backend
        - api
        - auth
        - database
        - e2e
        - unit
        - other
    validations:
      required: true

  - type: textarea
    id: suggested_tests
    attributes:
      label: Suggested Tests (optional)
      description: Test scenarios or techniques to add
      render: shell
    validations:
      required: false
```

---

## 3. Flaky Test

**File**: `.github/ISSUE_TEMPLATE/flaky_test.yml`

```yaml
name: Flaky Test
description: Report an intermittent or unreliable test
title: "[Flaky]: "
labels: ["type/flaky-test", "status/needs-triage"]
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        ## Flaky Test Report
        Document a test that fails intermittently.

  - type: input
    id: test_name
    attributes:
      label: Test Name / Path
      description: Full test identifier
      placeholder: "tests/e2e/login.spec.ts:42 - should login with valid credentials"
    validations:
      required: true

  - type: dropdown
    id: flaky_pattern
    attributes:
      label: Suspected Pattern
      description: Common flaky test patterns
      options:
        - race-condition
        - shared-state
        - time-dependency
        - external-dependency
        - unknown
    validations:
      required: true

  - type: input
    id: failure_rate
    attributes:
      label: Failure Rate (optional)
      description: Approximate % of runs that fail
      placeholder: "~30%"
    validations:
      required: false

  - type: textarea
    id: error_message
    attributes:
      label: Error Message
      description: Typical failure output
      render: shell
    validations:
      required: true

  - type: textarea
    id: context
    attributes:
      label: Additional Context
      description: CI logs, environment, recent changes
    validations:
      required: false
```

---

## 4. Documentation Update

**File**: `.github/ISSUE_TEMPLATE/documentation_update.yml`

```yaml
name: Documentation Update
description: Request or report documentation changes
title: "[Docs]: "
labels: ["type/documentation", "status/needs-triage"]
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        ## Documentation Update
        Specify what documentation needs to be added or updated.

  - type: input
    id: summary
    attributes:
      label: Summary
      description: What docs need updating
      placeholder: "e.g., API spec section 4.2 is outdated"
    validations:
      required: true

  - type: dropdown
    id: doc_type
    attributes:
      label: Document Type
      options:
        - requirements
        - specification
        - api-contract
        - test-plan
        - readme
        - runbook
        - other
    validations:
      required: true

  - type: textarea
    id: description
    attributes:
      label: Description
      description: What is wrong or missing
      placeholder: "Describe the gap or inaccuracy"
    validations:
      required: true

  - type: input
    id: source
    attributes:
      label: Source (optional)
      description: Link to spec, Figma, or requirement
      placeholder: "URL or file path"
    validations:
      required: false
```

---

## 5. Enhancement Request

**File**: `.github/ISSUE_TEMPLATE/enhancement_request.yml`

```yaml
name: Enhancement Request
description: Propose a new feature or improvement
title: "[Enhancement]: "
labels: ["type/enhancement", "status/needs-triage"]
assignees: []

body:
  - type: markdown
    attributes:
      value: |
        ## Enhancement Request
        Describe the proposed improvement.

  - type: input
    id: summary
    attributes:
      label: Summary
      description: One-line description
      placeholder: "e.g., Add retry logic for flaky API calls"
    validations:
      required: true

  - type: textarea
    id: problem
    attributes:
      label: Problem / Motivation
      description: What problem does this solve?
    validations:
      required: true

  - type: textarea
    id: solution
    attributes:
      label: Proposed Solution
      description: How should it work?
    validations:
      required: true

  - type: dropdown
    id: component
    attributes:
      label: Component
      options:
        - frontend
        - backend
        - api
        - auth
        - tests
        - docs
        - other
    validations:
      required: true

  - type: textarea
    id: alternatives
    attributes:
      label: Alternatives Considered (optional)
    validations:
      required: false
```

---

## Config File (Optional)

**File**: `.github/ISSUE_TEMPLATE/config.yml`

Use to customize the issue template chooser:

```yaml
blank_issues_enabled: true
contact_links:
  - name: QA Skills Documentation
    url: https://github.com/your-org/qa-skills
    about: Learn about QA automation skills
```

---

## Usage with GitHub MCP

When creating issues via GitHub MCP, populate the body to match the template structure. Use the template's field IDs as keys when constructing the issue body programmatically.
