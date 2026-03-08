---
name: qa-risk-analyzer
description: Risk-based testing prioritization with impact analysis for code changes using the formula Risk = Complexity × ChangeFrequency × (1 - TestCoverage).
output_dir: reports/risk
dependencies:
  recommended:
    - qa-coverage-analyzer
---

# QA Risk Analyzer

## Purpose

Risk-based testing prioritization and impact analysis for code changes. Calculate risk scores per feature/module, rank testing effort, and produce actionable recommendations using the formula:

**Risk = Complexity × ChangeFrequency × (1 - TestCoverage)**

## Trigger Phrases

- "Risk analysis for [branch/PR/release]"
- "Prioritize tests by risk" / "Risk-based test prioritization"
- "Impact analysis for [git diff/changes]"
- "Risk heatmap" / "Risk matrix for testing"
- "Which tests to run first?" / "Test execution order by risk"
- "Risk index per feature" / "High-risk modules"

## Risk Formula

```
Risk = Complexity × ChangeFrequency × (1 - TestCoverage)
```

- **Complexity:** Cyclomatic complexity, coupling, or static analysis metrics
- **ChangeFrequency:** Commits/changes per file from git history
- **TestCoverage:** 0–1 from qa-coverage-analyzer (1 = fully covered)
- **Defect history** and **business criticality** adjust the final ranking

See `references/risk-factors.md` for calculation methods.

## Risk Factors

| Factor | Source | How to Obtain |
|--------|--------|---------------|
| **Code complexity** | Cyclomatic complexity, coupling | SonarQube, ESLint complexity, radon (Python) |
| **Change frequency** | Git history | `git log --follow` per file; commits per module |
| **Test coverage** | Coverage reports | qa-coverage-analyzer (Istanbul/JaCoCo/coverage.py) |
| **Defect history** | Past bugs per module | Memory MCP, Jira/issue tracker |
| **Business criticality** | Stakeholder input | Manual tagging or config; payment, auth, core flows |

## Impact Analysis

Analyze git diff to determine:

1. **Affected modules** — Files changed → map to features/modules
2. **Affected tests** — Tests that cover changed code (from coverage or naming)
3. **Downstream impact** — Dependencies, imports, API consumers
4. **Regression scope** — Suggested regression set based on impact

See `references/impact-analysis.md` for git diff patterns and mapping strategies.

## Output Deliverables

1. **Risk Matrix** — Features/modules ranked by risk with testing recommendations
2. **Prioritized Test Execution List** — Order tests by risk (high → low)
3. **Risk Heatmap** — Visual matrix (complexity × change frequency, colored by coverage)
4. **Impact Summary** — Per PR/branch: affected modules, suggested regression scope

### Risk Matrix Template

```markdown
# Risk Matrix — [Branch/Release]

## Summary
| Module/Feature | Risk Index | Complexity | Change Freq | Coverage | Recommendation |
|----------------|------------|------------|-------------|----------|-----------------|
| [Name] | X.XX | H/M/L | H/M/L | X% | [Action] |

## Prioritized Test Execution
1. [High risk] — [Module] — [Tests]
2. [Medium risk] — [Module] — [Tests]
3. [Low risk] — [Module] — [Tests]

## Heatmap
[Quadrant: Complexity × ChangeFrequency, color = coverage]
```

## Workflow

1. **Input:** Git diff/branch, coverage report, optional defect history (Memory MCP)
2. **Impact:** Parse git diff; map changed files to modules/features
3. **Factors:** Get complexity (static analysis), change frequency (git log), coverage (qa-coverage-analyzer)
4. **Risk score:** Apply formula; apply defect/criticality adjustments
5. **Rank:** Sort modules/features by risk
6. **Output:** Risk matrix, prioritized test list, heatmap (via qa-diagram-generator)
7. **Recommendations:** Suggest tests to run first, coverage gaps to address

## MCP Tools Used

- **Sequential Thinking MCP:** Decompose analysis, reconcile conflicting factors, prioritize recommendations
- **Memory MCP:** Historical defect data per module, past risk trends, baseline comparison

## Integration with Other Skills

| Need | Skill | Usage |
|------|-------|-------|
| Test coverage data | qa-coverage-analyzer | Code coverage per module |
| Risk quadrant chart | qa-diagram-generator | Heatmap, quadrant visualization |
| Test cases for modules | qa-testcase-from-docs, qa-testcase-from-ui | Map tests to modules |
| Risk matrix patterns | qa-test-strategy | `references/risk-matrix.md` |

## Scope

**Can do (autonomous):**
- Calculate risk scores using the formula
- Parse git diff and map to modules
- Obtain change frequency from git history
- Integrate coverage from qa-coverage-analyzer
- Produce risk matrix, prioritized test list, heatmap
- Call qa-diagram-generator for quadrant charts
- Use Sequential Thinking for analysis; Memory for defect history

**Cannot do (requires confirmation):**
- Override business criticality without stakeholder input
- Change risk formula or factor weights without agreement
- Exclude modules from analysis without justification

**Will not do (out of scope):**
- Execute tests or generate coverage (consume existing data)
- Modify source code or test automation
- Deploy or change production systems

## Quality Checklist

- [ ] Risk formula applied consistently (Complexity × ChangeFrequency × (1 - TestCoverage))
- [ ] All risk factors sourced (complexity, change freq, coverage)
- [ ] Git diff impact analysis maps files to modules
- [ ] Prioritized test list ordered by risk (high → low)
- [ ] Heatmap/quadrant chart generated via qa-diagram-generator
- [ ] Recommendations actionable (specific tests, coverage gaps)
- [ ] No hardcoded secrets; paths/config referenced

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Risk scores all similar | Factors not normalized | Normalize to 0–1 scale; use relative ranking |
| Missing coverage data | qa-coverage-analyzer not run | Run coverage first; use 0 if unavailable |
| Change frequency zero | New files, no git history | Use complexity + criticality only; flag as "new" |
| Module mapping fails | Unclear file→module mapping | Use directory structure, package.json, or config |
| Heatmap too dense | Too many modules | Group by feature; show top N by risk |
| Defect history empty | Memory MCP not populated | Proceed without; note "no defect history" |

## Reference Files

| Topic | Reference |
|-------|-----------|
| Risk factor calculation | `references/risk-factors.md` |
| Git diff impact analysis | `references/impact-analysis.md` |
