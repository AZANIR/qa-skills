---
name: qa-testcase-from-docs
description: Generate structured test cases from requirements and specification documents using test model-based approach per ISO 29119-4.
output_dir: test-cases/from-docs
dependencies:
  recommended:
    - qa-requirements-generator
    - qa-spec-writer
---

# QA Test Case from Docs

## Purpose

Generate structured test cases from Phase 1 documentation (requirements, specifications) using a test model-based approach per ISO/IEC/IEEE 29119-4. Transform requirements and specs into traceable, measurable test cases with coverage criteria.

## Trigger Phrases

- "Generate test cases from requirements" / "Create test cases from [spec/requirements doc]"
- "Derive test cases from specifications"
- "Build test model from [feature/module]"
- "Test cases with traceability to requirements"
- "Export test cases to Zephyr/TestRail/CSV"
- "Coverage matrix for [requirement set]"
- "Equivalence classes and boundary tests for [field/feature]"
- "State transition test cases for [workflow]"
- "Decision table tests for [business rules]"

## Test Model-Based Approach (ISO 29119-4)

1. **Normalize requirements** — Unify IDs, remove ambiguity, add missing acceptance criteria. Ensure each requirement is testable and uniquely identified.

2. **Build test models** — Create formal models from requirements:
   - **State models** — For workflows, lifecycles, multi-step processes
   - **Decision tables** — For business rules, conditional logic, combinations
   - **Equivalence classes** — For input domains (valid/invalid partitions)
   - **Boundary values** — For numeric ranges, string lengths, limits

3. **Derive test cases** — Generate test cases from models with measurable coverage:
   - State coverage: all states, all transitions, transition pairs
   - Decision coverage: all conditions, all branches
   - Equivalence: at least one per partition
   - Boundary: min, max, min-1, max+1, typical

4. **Formalize tests** — Add traceability links (Requirement ID → Test Model → Test Case), assign types, priorities, and automation status.

## Test Case Output Format

| Field | Description |
| ----- | ------------ |
| **ID** | Unique identifier (e.g., TC-{module}-{number}) |
| **Title** | Short, descriptive name |
| **Module** | Feature/component under test |
| **Priority** | Critical / High / Medium / Low |
| **Type** | positive / negative / boundary / edge |
| **Preconditions** | State, data, environment before execution |
| **Steps** | Table: Step# \| Action \| Expected Result |
| **Postconditions** | Expected state after execution |
| **Test Data** | Input values, datasets, fixtures |
| **Traceability** | Requirement ID(s) covered |

### Steps Table Format

| Step# | Action | Expected Result |
| ----- | ------ | --------------- |
| 1 | {user/system action} | {observable outcome} |
| 2 | ... | ... |

## RTM Output (Requirements Traceability Matrix)

```
Requirement ID → Test Model → Test Case(s) → Automation Status
```

| Req ID | Test Model | Test Case(s) | Automation |
| ------ | ---------- | ------------ | ---------- |
| REQ-FN-001 | EP: valid/invalid email | TC-LOGIN-001, TC-LOGIN-002 | Planned |
| REQ-FN-001 | BVA: min/max length | TC-LOGIN-003, TC-LOGIN-004 | Manual |
| REQ-FN-002 | State: login flow | TC-LOGIN-005..008 | Automated |

## Auto-Categorization

| Type | When to Use | Example |
| ---- | ----------- | ------- |
| **positive** | Valid inputs, happy path | Valid email + password → login success |
| **negative** | Invalid inputs, error handling | Wrong password → error message |
| **boundary** | At limits (min, max, exactly) | Password length = 8 (min) |
| **edge** | Unusual but valid, concurrency, race | Empty optional field, simultaneous requests |

## Output Formats

- **Markdown tables** — Human-readable, version-control friendly
- **JSON** — Structured, tool-agnostic, scriptable
- **CSV** — Import into spreadsheets, bulk tools
- **Zephyr-ready** — Structure compatible with Zephyr Scale/ Squad
- **TestRail-ready** — Structure compatible with TestRail API/import

## Workflow

1. **Input:** Requirements document (from qa-requirements-generator) and/or specifications (from qa-spec-writer)
2. **Normalize:** Unify IDs, resolve ambiguity, ensure acceptance criteria exist
3. **Model:** Select and build test models per `references/test-design-techniques.md`
4. **Derive:** Generate test cases with coverage criteria
5. **Categorize:** Assign type (positive/negative/boundary/edge), priority
6. **Format:** Output in requested format (Markdown, JSON, CSV, Zephyr, TestRail)
7. **RTM:** Produce traceability matrix

## Scope

**Can do (autonomous):**
- Generate test cases from requirements and specifications
- Build test models (state, decision table, equivalence, boundary)
- Derive test cases with traceability
- Auto-categorize by type (positive/negative/boundary/edge)
- Export to Markdown, JSON, CSV, Zephyr, TestRail formats
- Produce RTM with requirement → model → test case links
- Call qa-diagram-generator for state/flow diagrams

**Cannot do (requires confirmation):**
- Change requirement scope or priority
- Add requirements not in source documents
- Override stakeholder-defined test priorities

**Will not do (out of scope):**
- Write test automation code
- Execute tests
- Modify production code or environments

## Embedding: Diagram Generator

When visualization is needed, reference qa-diagram-generator:
- State models → `references/state-diagram.md`
- Decision logic → `references/flowchart.md`
- Test flow → `references/flowchart.md`

## References

- `references/test-design-techniques.md` — ISO 29119-4 techniques: EP, BVA, decision tables, state transition, use case, classification trees
- `references/test-case-format.md` — Detailed format reference with examples per test type

## Quality Checklist

- [ ] Every test case traces to at least one requirement ID
- [ ] Steps are atomic and measurable (no subjective language)
- [ ] Expected results are observable and verifiable
- [ ] Coverage criteria stated (e.g., "all equivalence partitions")
- [ ] Types correctly assigned (positive/negative/boundary/edge)
- [ ] No duplicate test cases for same requirement + condition
- [ ] RTM complete: all requirements have at least one test case
- [ ] Preconditions and postconditions defined where relevant

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Vague test steps | Specs lack detail | Run qa-spec-writer first, add acceptance criteria |
| Missing negative cases | Only happy path modeled | Apply equivalence partitioning, add invalid partitions |
| Low coverage | Few test models | Add decision tables, state models, BVA |
| Duplicate test cases | Overlapping models | Deduplicate by (requirement, condition, expected result) |
| Unclear traceability | Requirement IDs missing | Normalize requirements, assign IDs before modeling |
| Export fails | Format mismatch | Check Zephyr/TestRail schema, adjust field mapping |
