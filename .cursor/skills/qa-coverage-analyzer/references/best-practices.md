# Coverage Analysis Best Practices

Meaningful thresholds, risk-based prioritization, and avoiding common pitfalls when analyzing test coverage.

---

## Meaningful Thresholds

### Avoid Arbitrary Targets

| Bad | Better |
|-----|--------|
| "We need 100% coverage" | Set targets by risk: critical paths 90%, utilities 60% |
| Same threshold for all modules | Different thresholds per module type (core vs. glue) |
| Line-only focus | Include branch/condition where logic is complex |

### Suggested Ranges (Adjust per Project)

| Dimension | Conservative | Typical | Aggressive |
|-----------|--------------|---------|------------|
| Requirements | 95% | 90% | 85% |
| Technique (≥2 per req) | 80% | 70% | 60% |
| Code (line) | 85% | 75% | 65% |
| Code (branch) | 75% | 65% | 55% |

### Per-Module Thresholds

- **Critical (auth, payment, core business):** 85%+ line, 75%+ branch
- **Important (API, integrations):** 75%+ line, 65%+ branch
- **Supporting (utils, helpers):** 60%+ line
- **Generated/boilerplate:** Exclude from coverage or set low target

---

## Risk-Based Prioritization

### Apply Risk to Gaps

1. **Identify risk** per requirement/module (use qa-test-strategy `references/risk-matrix.md`)
2. **Score gaps:** Uncovered high-risk = highest priority
3. **Order recommendations:** High → Medium → Low

### Priority Matrix

| Risk | Coverage Gap | Action |
|------|--------------|--------|
| High | Uncovered | Immediate: add tests |
| High | Low technique | Add EP, BVA, DT, or ST |
| High | Low code | Increase automation |
| Medium | Uncovered | Plan for next sprint |
| Medium | Low technique | Schedule technique review |
| Low | Any | Backlog or accept |

### Focus Areas First

1. Authentication and authorization
2. Payment and financial logic
3. Data validation and sanitization
4. Critical user journeys
5. Integration points with external systems

---

## Technique Coverage Best Practices

### Avoid Single-Technique Bias

- **EP only:** May miss boundaries and invalid combinations
- **BVA only:** May miss equivalence classes
- **Happy path only:** Miss negative and edge cases

### Technique Selection by Domain

| Domain | Recommended Techniques |
|--------|------------------------|
| Input validation | EP, BVA |
| Business rules | Decision table |
| Workflows | State transition, use case |
| APIs | EP, BVA, decision table (for status codes) |
| UI flows | Use case, state transition |

### Tagging Discipline

- Tag every test case with at least one technique
- Use consistent abbreviations (EP, BVA, DT, ST, UC, CT)
- Review quarterly: are techniques balanced?

---

## Code Coverage Pitfalls

### Don't Chase 100%

- Diminishing returns above ~85% line coverage
- Some code is defensive, error paths, or hard to trigger
- Focus on high-risk and frequently changed code

### Exclude Appropriately

- Generated code (e.g., OpenAPI clients)
- Configuration files
- Test files themselves
- Third-party code

### Branch vs. Line

- Branch coverage reveals untested decision paths
- Prioritize branch coverage for complex conditionals (`if (a && b || c)`)

---

## Dashboard and Reporting

### Keep Dashboards Actionable

- Show gaps, not just percentages
- Link to specific requirements, test cases, files
- Include trend (improving vs. declining)

### Heatmap Best Practices

- Use color scale: red (low) → yellow → green (high)
- Group by module or feature
- Highlight modules below threshold

### Frequency

- **Code coverage:** Every CI run
- **Requirements/technique:** Per sprint or release
- **Full three-dimension analysis:** Per major release or quarterly

---

## Integration with QA Workflow

| Phase | Coverage Activity |
|-------|-------------------|
| Requirements | Define traceability; assign IDs |
| Test design | Apply techniques; tag test cases |
| Implementation | Run coverage in CI; set gates |
| Release | Full three-dimension analysis; gap report |
| Retrospective | Review trends; adjust thresholds |
