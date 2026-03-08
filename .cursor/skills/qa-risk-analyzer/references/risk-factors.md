# Risk Factor Calculation Methods

## Overview

Risk factors feed into the formula: **Risk = Complexity × ChangeFrequency × (1 - TestCoverage)**. Each factor should be normalized to a 0–1 scale for consistent scoring.

---

## 1. Code Complexity

### Cyclomatic Complexity

| Tool | Language | Command / Config |
|------|----------|------------------|
| **ESLint** | JS/TS | `complexity` rule; `cyclomatic-complexity` |
| **radon** | Python | `radon cc -a -s path` |
| **SonarQube** | Multi | Complexity metric per file |
| **Checkstyle** | Java | `CyclomaticComplexity` |

### Normalization (0–1)

```
normalized = min(1, raw_complexity / threshold)
```

- Typical threshold: 10 (McCabe); high = 15+
- Scale: 0 = trivial, 1 = very complex

### Alternative: Coupling

- **Afferent coupling (Ca):** Incoming dependencies
- **Efferent coupling (Ce):** Outgoing dependencies
- **Instability:** Ce / (Ca + Ce) — higher = more change-prone

---

## 2. Change Frequency

### Git History

```bash
# Commits per file (last N commits)
git log --follow --format=format: --name-only -n 100 | sort | uniq -c | sort -rn

# Per directory/module
git log --follow --format=format: --name-only -n 100 -- path/to/module
```

### Normalization (0–1)

```
normalized = min(1, commit_count / max_commits_in_repo)
```

- `max_commits_in_repo` = highest commit count among analyzed files
- Higher = more frequently changed = higher risk

### Time Windows

- **Sprint:** Last 2 weeks
- **Release:** Last 4–8 weeks
- **All time:** Full history (use for baseline)

---

## 3. Test Coverage

### Source

- **qa-coverage-analyzer** output (Istanbul, JaCoCo, coverage.py)
- Line coverage or branch coverage per file/module
- Already 0–1 (e.g., 0.85 = 85%)

### In Formula

- `(1 - TestCoverage)` — low coverage increases risk
- Coverage = 1 → factor = 0 (no coverage risk)
- Coverage = 0 → factor = 1 (full coverage risk)

---

## 4. Defect History (Adjustment)

### Source

- **Memory MCP:** Past bugs per module/component
- Jira/issue tracker: Bugs linked to files/modules
- Manual tagging in config

### Application

- **Multiplier:** e.g., `1 + (defect_count / 10)` — more defects = higher risk
- **Additive:** Add fixed points for "defect-prone" modules
- Use as ranking adjustment, not primary factor

---

## 5. Business Criticality

### Levels

| Level | Examples | Weight |
|-------|----------|--------|
| **Critical** | Payment, auth, core flows | 1.5–2.0 |
| **High** | Checkout, user profile | 1.2–1.5 |
| **Medium** | Search, filters | 1.0 |
| **Low** | Help, static content | 0.7–0.9 |

### Application

- Multiply final risk score by criticality weight
- Requires stakeholder input or config file

---

## Combined Risk Score

```
base_risk = Complexity × ChangeFrequency × (1 - TestCoverage)
adjusted_risk = base_risk × DefectMultiplier × CriticalityWeight
```

Rank modules/features by `adjusted_risk` descending.
