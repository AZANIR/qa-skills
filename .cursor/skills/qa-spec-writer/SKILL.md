---
name: qa-spec-writer
description: Transform requirements into detailed technical specifications with acceptance criteria, boundary conditions, and edge cases.
output_dir: docs/specs
dependencies:
  recommended:
    - qa-requirements-generator
---

# QA Spec Writer

## Purpose

Create detailed technical specifications from requirements documents. Transform high-level requirements into test-ready specifications with acceptance criteria, boundary conditions, edge cases, and business rules.

## Trigger Phrases

- "Write technical spec from requirements" / "Create spec from [requirements doc]"
- "Transform requirements into specifications"
- "Add acceptance criteria to [feature/spec]"
- "Define boundary conditions and edge cases"
- "Technical specification with Given/When/Then"
- "Spec with error handling and validation rules"
- "Decompose requirement into spec" / "State transitions for [feature]"

## Workflow

1. **Input:** Read requirements document (from qa-requirements-generator or manual)
2. **Analysis:** Decompose each requirement into specification elements
3. **Specification:** Write detailed technical spec with:
   - Functional behavior descriptions
   - Input/output specifications
   - Boundary conditions and edge cases
   - Error handling and validation rules
   - Business rules and constraints
   - State transitions
4. **Acceptance Criteria:** Formalize in Given/When/Then (Gherkin) format
5. **Output:** Technical specification document per ISO 29148

## Specification Structure

For each feature/module:

### Functional Specification
```
[SPEC-{module}-{number}]
Title: {Feature Name}
Requirement: [REQ-FN-xxx]

Description:
  Detailed technical behavior description

Input Specifications:
  | Field | Type | Required | Validation | Default |
  | ----- | ---- | -------- | ---------- | ------- |

Output Specifications:
  | Condition | Output | Status Code |
  | --------- | ------ | ----------- |

Boundary Conditions:
  - Min/max values
  - Empty/null inputs
  - Character limits

Edge Cases:
  - Concurrent access
  - Network timeout
  - Partial data

Error Handling:
  | Error Condition | Error Code | User Message | Recovery |
  | --------------- | ---------- | ------------ | -------- |

Business Rules:
  - BR-001: {rule description}

State Transitions:
  {state diagram reference}
```

### Acceptance Criteria Template
```gherkin
Feature: {Feature Name}

  Scenario: {Happy Path}
    Given {precondition}
    When {action}
    Then {expected outcome}

  Scenario: {Negative Case}
    Given {precondition}
    When {invalid action}
    Then {error handling}

  Scenario: {Boundary}
    Given {precondition}
    When {boundary input}
    Then {boundary behavior}
```

## Scope

**Can do (autonomous):**
- Generate specs from requirements documents
- Define acceptance criteria in Gherkin format
- Identify boundary conditions and edge cases
- Document error handling scenarios
- Call qa-diagram-generator for state/sequence diagrams

**Cannot do (requires confirmation):**
- Change requirement scope or priority
- Make architectural decisions
- Define new business rules not in requirements

**Will not do (out of scope):**
- Write test code
- Modify production code
- Deploy systems

## Embedding: Diagram Generator
When visualization is needed, reference qa-diagram-generator:
- State machines → `references/state-diagram.md`
- API flows → `references/sequence.md`
- Decision logic → `references/flowchart.md`

## Quality Checklist
- [ ] Every spec traces to a requirement ID
- [ ] All inputs have validation rules defined
- [ ] Boundary conditions identified for numeric/string fields
- [ ] Negative scenarios documented
- [ ] Error handling specified for each failure mode
- [ ] Acceptance criteria are in Given/When/Then format
- [ ] No implementation details leaked into specs

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Specs too vague | Requirements lack detail | Run qa-requirements-generator first |
| Missing edge cases | Only happy path analyzed | Use systematic techniques: EP, BVA, decision tables |
| Acceptance criteria not testable | Using subjective language | Replace with measurable criteria |
| Specs conflict with each other | Requirements have contradictions | Flag for stakeholder resolution |
