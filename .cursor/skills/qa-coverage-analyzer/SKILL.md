---
name: qa-coverage-analyzer
description: Analyze test coverage across three dimensions -- requirements/model coverage via RTM, technique coverage per ISO 29119-4, and code coverage via Istanbul/V8/JaCoCo -- with risk-based gap recommendations.
output_dir: reports/coverage
---

# QA Coverage Analyzer

## Purpose

Perform multi-dimensional test coverage analysis across requirements traceability, test design techniques, and code coverage. Identify gaps, prioritize by risk, and produce actionable recommendations for improving test effectiveness.

## Trigger Phrases

- "Analyze test coverage" / "Coverage analysis for [project/module]"
- "Requirements traceability matrix" / "RTM coverage"
- "Technique coverage" / "ISO 29119-4 coverage"
- "Code coverage report" / "Line/branch coverage analysis"
- "Coverage gaps" / "Uncovered requirements"
- "Coverage dashboard" / "Coverage heatmap"
- "Risk-based coverage recommendations"

## Three Coverage Dimensions

| Dimension | What It Measures | Key Artifacts |
|-----------|------------------|----------------|
| **1. Requirements/Model** | Which requirements have tests; RTM completeness | RTM (Req → Model → Test → Execution) |
| **2. Technique** | Which ISO 29119-4 techniques applied | EP, BVA, decision tables, state transitions |
| **3. Code** | Line, branch, condition, function coverage | Istanbul, V8, JaCoCo, coverage.py, SonarQube |

See `references/coverage-dimensions.md` for detailed measurement methods.

## Dimension 1: Requirements/Model Coverage

**Model:** Requirement → Test Model → Test Case → Execution

- **Track:** Which requirements have linked test models and test cases
- **Identify gaps:** Requirements with no tests, tests with no execution, orphan tests
- **Metrics:** % requirements covered, % executed, traceability completeness

**Inputs:** Requirements doc, RTM, test case inventory, execution results (Zephyr, TestRail, etc.)

## Dimension 2: Technique Coverage (ISO 29119-4)

**Techniques:** Equivalence Partitioning (EP), Boundary Value Analysis (BVA), Decision Tables, State Transition, Use Case, Classification Trees

- **Track:** Which techniques applied per requirement/module
- **Identify gaps:** Requirements tested with only one technique; modules with technique imbalance
- **Metrics:** Technique distribution, technique-per-requirement ratio

**Inputs:** Test case metadata (technique tags), requirements, test design docs

## Dimension 3: Code Coverage

**Metrics:** Line, branch, condition, function coverage

| Language/Stack | Tool | Output Format |
|----------------|------|---------------|
| JavaScript/TypeScript | Istanbul (c8, nyc), V8 | lcov, json-summary |
| Java | JaCoCo | xml, html |
| Python | coverage.py | xml, html, json |
| SonarQube | SonarQube | Unified dashboard |

See `references/tools.md` for setup and integration.

## Outputs

1. **Coverage Dashboard** — Summary of all three dimensions with percentages and trends
2. **Coverage Gaps List** — Uncovered requirements, low-technique areas, low-code-coverage modules
3. **Risk-Based Recommendations** — High-risk uncovered areas prioritized; suggested actions
4. **Heatmap by Module** — Visual (via qa-diagram-generator) showing coverage intensity per module

### Dashboard Template

```markdown
# Coverage Dashboard

## Summary
| Dimension | Coverage | Status |
|-----------|----------|--------|
| Requirements | X% | ✅/⚠️/❌ |
| Technique | X techniques avg | ✅/⚠️/❌ |
| Code | Line X%, Branch Y% | ✅/⚠️/❌ |

## Gaps
- [Req ID] Uncovered
- [Module] Low technique diversity
- [File/Module] Low code coverage

## Risk-Based Recommendations
1. [High] ...
2. [Medium] ...
3. [Low] ...
```

## Workflow

1. **Gather inputs:** RTM, test cases, execution results, code coverage reports
2. **Analyze each dimension:** Compute coverage per dimension (see `references/coverage-dimensions.md`)
3. **Identify gaps:** Uncovered requirements, technique-poor areas, low-code-coverage modules
4. **Prioritize by risk:** Use risk matrix (see qa-test-strategy `references/risk-matrix.md`); high-risk + low coverage = top priority
5. **Generate outputs:** Dashboard, gaps list, recommendations, heatmap
6. **Historical tracking:** Use Memory MCP to store trends for comparison over time

## MCP Tools Used

- **Sequential Thinking MCP:** For decomposition of complex coverage analysis; reconciling conflicting signals across dimensions; prioritizing gaps.
- **Memory MCP:** For historical coverage tracking; trend comparison (sprint-over-sprint, release-over-release).

## Integration with Other Skills

| Need | Skill | Usage |
|------|-------|-------|
| RTM, test cases from requirements | qa-testcase-from-docs | Source for requirements/model coverage |
| Test design techniques | qa-testcase-from-docs | `references/test-design-techniques.md` |
| Risk matrix | qa-test-strategy | `references/risk-matrix.md` |
| Heatmap, charts | qa-diagram-generator | Coverage heatmap, quadrant charts |
| NFR thresholds | qa-nfr-analyst | Coverage targets as NFRs |

## Scope

**Can do (autonomous):**
- Analyze coverage across all three dimensions from provided artifacts
- Produce coverage dashboard, gaps list, risk-based recommendations
- Call qa-diagram-generator for heatmaps and charts
- Use Sequential Thinking for complex analysis; Memory for historical tracking
- Reference coverage-dimensions, tools, best-practices

**Cannot do (requires confirmation):**
- Change coverage thresholds set by stakeholders
- Override organizational coverage policy
- Modify test code or production code

**Will not do (out of scope):**
- Execute tests or generate coverage reports (consume existing reports)
- Implement fixes for coverage gaps
- Deploy or modify production systems

## Quality Checklist

- [ ] All three dimensions analyzed (requirements, technique, code)
- [ ] Gaps list includes requirement IDs, modules, and file paths where applicable
- [ ] Recommendations prioritized by risk (high/medium/low)
- [ ] Dashboard includes percentages and status indicators
- [ ] Heatmap generated for module-level view when requested
- [ ] References to coverage-dimensions, tools, best-practices correct
- [ ] No hardcoded secrets

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Missing RTM | No traceability in place | Run qa-testcase-from-docs to build RTM; ask for requirement IDs |
| Technique tags absent | Test cases not tagged | Add technique metadata; use test-design-techniques reference |
| Code coverage format unknown | Tool output not recognized | Check tools.md for supported formats; request lcov/xml |
| All dimensions green but quality issues | Coverage ≠ quality | Emphasize technique diversity; recommend exploratory testing |
| Recommendations too generic | Insufficient risk context | Request risk matrix; use risk-matrix reference |
| Historical comparison fails | No prior data in Memory | Store current run in Memory for future comparison |

## Reference Files

| Topic | Reference |
|-------|-----------|
| Coverage dimensions | `references/coverage-dimensions.md` |
| Coverage tools | `references/tools.md` |
| Best practices | `references/best-practices.md` |
