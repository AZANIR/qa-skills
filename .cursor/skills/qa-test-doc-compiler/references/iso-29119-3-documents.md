# ISO/IEC/IEEE 29119-3 Document Types Reference

*Per ISO/IEC/IEEE 29119-3:2021 — Software and systems engineering — Software testing — Part 3: Test documentation*

## Document Hierarchy

```
Test Policy
    └── Organizational Test Practices
            └── Project Test Plan
                    ├── Level Test Plans (unit/integration/system/acceptance)
                    ├── Type Test Plans (functional/performance/security)
                    └── Test Specifications
                            ├── Test Model Specification
                            ├── Test Case Specification
                            └── Test Procedure Specification
```

---

## Governance Documents

### Test Policy

**Purpose:** High-level organizational commitment to testing. Defines testing objectives, principles, and governance.

| Section | Mandatory | Recommended | Description |
|---------|-----------|-------------|-------------|
| Purpose | ✓ | | Why the policy exists |
| Scope | ✓ | | Organizational scope |
| Testing objectives | ✓ | | High-level goals |
| Testing principles | | ✓ | Guiding principles |
| Roles and responsibilities | | ✓ | Who governs testing |
| References | | ✓ | Related standards, policies |

---

### Organizational Test Practices

**Purpose:** Describes how the organization implements testing. Operationalizes the Test Policy.

| Section | Mandatory | Recommended | Description |
|---------|-----------|-------------|-------------|
| Purpose | ✓ | | Purpose of the practices |
| Scope | ✓ | | Applicability |
| Test process description | ✓ | | How testing is performed |
| Test documentation practices | ✓ | | Which documents are used |
| Test environment management | | ✓ | Environment setup and control |
| Test data management | | ✓ | Data creation, masking, retention |
| Tools and automation | | ✓ | Tool strategy |
| References | | ✓ | Test Policy, standards |

---

## Planning Documents

### Project Test Plan

**Purpose:** Describes the testing approach for a specific project. May be decomposed into Level and Type Test Plans.

| Section | Mandatory | Recommended | Description |
|---------|-----------|-------------|-------------|
| Introduction | ✓ | | Purpose, scope, definitions |
| Test items | ✓ | | Features to test, features not to test |
| Test approach | ✓ | | Strategy per level/type |
| Pass/fail criteria | ✓ | | Measurable criteria |
| Entry criteria | ✓ | | Conditions to start testing |
| Exit criteria | ✓ | | Conditions to complete testing |
| Suspension/resumption | ✓ | | When to halt/resume |
| Deliverables | ✓ | | Expected artifacts |
| Test environment | ✓ | | Environment requirements |
| Schedule | ✓ | | Timeline, milestones |
| Staffing | ✓ | | Roles, responsibilities |
| Risks and contingencies | | ✓ | Risks and mitigations |
| Approvals | | ✓ | Sign-off table |

---

### Level Test Plans

**Purpose:** Plans for a specific test level (unit, integration, system, acceptance).

| Level | Description |
|-------|-------------|
| **Unit** | Component-level testing |
| **Integration** | Interface and interaction testing |
| **System** | End-to-end system testing |
| **Acceptance** | User/business acceptance |

**Sections:** Same structure as Project Test Plan, scoped to the level. May reference parent Project Test Plan for shared elements.

---

### Type Test Plans

**Purpose:** Plans for a specific test type (functional, performance, security, etc.).

| Type | Description |
|------|-------------|
| **Functional** | Functional behavior verification |
| **Performance** | Load, stress, scalability |
| **Security** | Security vulnerabilities, OWASP |
| **Usability** | UX, accessibility (WCAG) |
| **Compatibility** | Browsers, devices, OS |

**Sections:** Same structure as Project Test Plan, scoped to the type. May reference NFR criteria from qa-nfr-analyst.

---

## Specification Documents

### Test Model Specification

**Purpose:** Describes test models used to derive test cases. Replaces "test conditions" in ISO 29119-3:2021. Models include state diagrams, decision tables, equivalence classes, boundary values.

| Section | Mandatory | Recommended | Description |
|---------|-----------|-------------|-------------|
| Identifier | ✓ | | Unique ID (e.g., TMS-001) |
| Purpose | ✓ | | Purpose of the model |
| Scope | ✓ | | What the model covers |
| Model description | ✓ | | Model content (diagram, table, etc.) |
| Traceability | ✓ | | Links to requirements |
| References | | ✓ | Source requirements, specs |

---

### Test Case Specification

**Purpose:** Defines individual test cases derived from test models.

| Section | Mandatory | Recommended | Description |
|---------|-----------|-------------|-------------|
| Identifier | ✓ | | Unique ID (e.g., TC-001) |
| Purpose | ✓ | | Purpose of the test case |
| Preconditions | ✓ | | Prerequisites |
| Input specifications | ✓ | | Test inputs |
| Expected results | ✓ | | Expected outcomes |
| Postconditions | | ✓ | State after execution |
| Traceability | ✓ | | Links to test model, requirements |
| Priority | | ✓ | Priority level |

---

### Test Procedure Specification

**Purpose:** Step-by-step instructions for executing test cases.

| Section | Mandatory | Recommended | Description |
|---------|-----------|-------------|-------------|
| Identifier | ✓ | | Unique ID (e.g., TPS-001) |
| Purpose | ✓ | | Purpose of the procedure |
| Test cases covered | ✓ | | TC-001, TC-002, ... |
| Prerequisites | ✓ | | Setup requirements |
| Procedure steps | ✓ | | Numbered steps |
| Expected results per step | | ✓ | Per-step expectations |
| Traceability | ✓ | | Links to test cases |

---

## Execution Documents

### Test Execution Log

**Purpose:** Records the execution of test procedures. Captures date, tester, result, actual vs expected.

| Section | Mandatory | Recommended | Description |
|---------|-----------|-------------|-------------|
| Identifier | ✓ | | Log ID |
| Test procedure | ✓ | | TPS reference |
| Execution date/time | ✓ | | When executed |
| Tester | ✓ | | Who executed |
| Result | ✓ | | Pass/Fail/Blocked/Skipped |
| Actual results | ✓ | | What was observed |
| Environment/build | | ✓ | SUT version, build ID |
| Evidence | | ✓ | Screenshots, logs |

---

### Test Incident Report (Bug Report / Defect Report)

**Purpose:** Records deviations between expected and actual results. Synonymous with bug report, defect report.

| Section | Mandatory | Recommended | Description |
|---------|-----------|-------------|-------------|
| Identifier | ✓ | | Unique ID (e.g., TIR-001) |
| Summary | ✓ | | Brief description |
| Test case/procedure | ✓ | | Which test failed |
| Expected result | ✓ | | What was expected |
| Actual result | ✓ | | What occurred |
| Steps to reproduce | ✓ | | How to reproduce |
| Severity/priority | | ✓ | Impact and urgency |
| Status | | ✓ | Open, fixed, deferred |
| Environment | | ✓ | Build, OS, browser |
| Evidence | | ✓ | Attachments |

---

## Reporting Documents

### Test Status Report

**Purpose:** Periodic progress report during test execution.

| Section | Mandatory | Recommended | Description |
|---------|-----------|-------------|-------------|
| Identifier | ✓ | | Report ID |
| Reporting period | ✓ | | Date range |
| Summary | ✓ | | Executive summary |
| Test execution summary | ✓ | | Pass/fail/blocked counts |
| Incidents | ✓ | | Open/closed incident summary |
| Risks and issues | | ✓ | Blockers, risks |
| Next period plan | | ✓ | Planned activities |
| Metrics | | ✓ | Coverage, progress % |

---

### Test Completion Report

**Purpose:** Final report when testing is complete. Summarizes outcomes and recommendations.

| Section | Mandatory | Recommended | Description |
|---------|-----------|-------------|-------------|
| Identifier | ✓ | | Report ID |
| Summary | ✓ | | Executive summary |
| Test execution summary | ✓ | | Final pass/fail/blocked counts |
| Exit criteria met | ✓ | | Whether criteria were satisfied |
| Incidents summary | ✓ | | Open, closed, deferred |
| Recommendations | ✓ | | Release readiness, follow-up |
| Lessons learned | | ✓ | Process improvements |
| Metrics | | ✓ | Coverage, defect density |

---

## Readiness Documents

### Test Data Requirements

**Purpose:** Specifies data needed for testing.

| Section | Mandatory | Recommended | Description |
|---------|-----------|-------------|-------------|
| Identifier | ✓ | | Document ID |
| Purpose | ✓ | | Purpose of the data |
| Data requirements | ✓ | | Types, volumes, characteristics |
| Data sources | | ✓ | Where data comes from |
| Privacy/security | | ✓ | Masking, anonymization |
| Traceability | | ✓ | Links to test cases |

---

### Test Environment Requirements

**Purpose:** Specifies environment needed for testing.

| Section | Mandatory | Recommended | Description |
|---------|-----------|-------------|-------------|
| Identifier | ✓ | | Document ID |
| Purpose | ✓ | | Purpose of the environment |
| Hardware | ✓ | | Servers, devices |
| Software | ✓ | | OS, middleware, tools |
| Network | | ✓ | Connectivity requirements |
| Access/credentials | | ✓ | Access requirements (no secrets) |
| Traceability | | ✓ | Links to test plans |

---

### Test Data Readiness Report

**Purpose:** Confirms test data is ready for use.

| Section | Mandatory | Recommended | Description |
|---------|-----------|-------------|-------------|
| Identifier | ✓ | | Report ID |
| Status | ✓ | | Ready/Not ready |
| Data sets | ✓ | | What was prepared |
| Gaps | | ✓ | Missing or incomplete data |
| Traceability | | ✓ | Links to Test Data Requirements |

---

### Test Environment Readiness Report

**Purpose:** Confirms test environment is ready for use.

| Section | Mandatory | Recommended | Description |
|---------|-----------|-------------|-------------|
| Identifier | ✓ | | Report ID |
| Status | ✓ | | Ready/Not ready |
| Components | ✓ | | What was set up |
| Gaps | | ✓ | Missing or incomplete components |
| Traceability | | ✓ | Links to Test Environment Requirements |

---

## Information Element Necessity

ISO 29119-3 classifies each information element as:
- **Mandatory** — Must be present
- **Recommended** — Should be present unless tailored out
- **Possible** — Optional, include when useful

Tailoring is permitted; document which elements are omitted and why.
