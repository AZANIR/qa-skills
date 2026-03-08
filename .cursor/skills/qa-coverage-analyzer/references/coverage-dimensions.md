# Coverage Dimensions Reference

Detailed reference for each coverage dimension with measurement methods per ISO/IEC/IEEE 29119 and industry practice.

---

## 1. Requirements/Model Coverage (RTM)

### Definition

Tracks which requirements have associated test models and test cases, and whether those tests have been executed. Ensures every requirement is verifiable.

### RTM Structure

```
Requirement ID → Test Model → Test Case(s) → Execution Status
```

| Req ID | Test Model | Test Case(s) | Execution |
|--------|------------|--------------|-----------|
| REQ-001 | EP: email validation | TC-001, TC-002 | Pass |
| REQ-002 | State: login flow | TC-003..006 | Pass |
| REQ-003 | — | — | **Uncovered** |

### Measurement Method

1. **List all requirements** with unique IDs (from qa-requirements-generator or spec)
2. **Map each requirement** to test model(s) and test case(s)
3. **Compute coverage:** `Covered requirements / Total requirements × 100%`
4. **Identify gaps:** Requirements with no test case or no execution

### Gap Types

| Gap Type | Description | Priority |
|----------|-------------|----------|
| No test case | Requirement has no linked test | High |
| No execution | Test exists but not run | Medium |
| Stale link | Test case outdated or removed | Medium |

### Tools

- Spreadsheets, RTM templates
- Test management (Zephyr, TestRail, qTest) with traceability
- qa-testcase-from-docs for RTM generation

---

## 2. Technique Coverage (ISO 29119-4)

### Definition

Ensures multiple test design techniques are applied across the system. Single-technique testing (e.g., only equivalence partitioning) may miss defects that other techniques would catch.

### ISO 29119-4 Techniques

| Technique | Abbreviation | When to Use |
|-----------|--------------|-------------|
| Equivalence Partitioning | EP | Input domains, validation |
| Boundary Value Analysis | BVA | Numeric ranges, limits |
| Decision Table | DT | Business rules, conditions |
| State Transition | ST | Workflows, lifecycles |
| Use Case | UC | User flows, scenarios |
| Classification Tree | CT | Combinatorial, configs |

### Measurement Method

1. **Tag each test case** with technique(s) used (EP, BVA, DT, ST, UC, CT)
2. **Per requirement or module:** Count distinct techniques applied
3. **Compute coverage:** `Requirements with ≥2 techniques / Total × 100%` (or project-defined threshold)
4. **Identify gaps:** Modules with only one technique or none

### Technique Matrix Example

| Module | EP | BVA | DT | ST | UC | Techniques Used |
|--------|----|----|----|----|----|-----------------|
| auth | ✓ | ✓ | ✓ | — | ✓ | 4 |
| checkout | ✓ | — | — | — | — | 1 (gap) |
| search | ✓ | ✓ | ✓ | — | ✓ | 4 |

### Gap Types

| Gap Type | Description | Priority |
|----------|-------------|----------|
| No technique | Test not tagged | Medium |
| Single technique | Only EP or only BVA | Medium |
| Missing for domain | BVA missing for numeric fields | High |

### Reference

- qa-testcase-from-docs `references/test-design-techniques.md`

---

## 3. Code Coverage

### Definition

Measures which lines, branches, conditions, and functions of the source code are executed by tests. Complements requirements and technique coverage by revealing untested implementation.

### Coverage Types

| Type | Description | Typical Target |
|------|-------------|----------------|
| **Line** | % of executable lines run | 70–80% |
| **Branch** | % of decision branches (if/else) taken | 60–80% |
| **Condition** | % of compound conditions (a && b) fully exercised | 50–70% |
| **Function** | % of functions called | 80–90% |

### Measurement Method

1. **Instrument code** and run tests (see `references/tools.md`)
2. **Parse coverage report** (Istanbul, JaCoCo, coverage.py, SonarQube)
3. **Aggregate by module/package** for heatmap
4. **Identify gaps:** Files or modules below threshold; 0% coverage areas

### Tool Mapping by Language

| Language | Primary Tool | Report Format |
|----------|--------------|---------------|
| JavaScript/TypeScript | Istanbul (c8, nyc), V8 | JSON, LCOV, HTML |
| Java | JaCoCo | XML, HTML, CSV |
| Python | coverage.py | XML, HTML, JSON |
| .NET | Coverlet, OpenCover | XML, Cobertura |
| Multi-language | SonarQube | Sonar format |

### Gap Types

| Gap Type | Description | Priority |
|----------|-------------|----------|
| 0% coverage | Entire file/module untested | High (if critical) |
| Below threshold | Line coverage &lt; project target | Medium |
| Branch gap | Condition not fully exercised | Medium |

---

## Cross-Dimension Analysis

Combine dimensions for richer insights:

| Scenario | Interpretation |
|----------|----------------|
| High req, low code | Requirements covered but implementation gaps; possible dead code or missing automation |
| High code, low req | Code well-tested but not traced to requirements; traceability gap |
| High req+code, low technique | May lack variety; consider EP, BVA, DT, ST for same areas |
| All low | Systemic gap; prioritize by risk |

---

## Risk-Based Prioritization

Apply risk (from qa-test-strategy `references/risk-matrix.md`) to prioritize gaps:

- **High-risk + uncovered** → First priority
- **High-risk + low technique** → Add technique variety
- **Low-risk + uncovered** → Defer or accept
