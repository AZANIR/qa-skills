# Mermaid Pie and Quadrant Charts

## Overview
- **Pie chart:** `pie` block with `title` and `"label" : value` pairs.
- **Quadrant chart:** `quadrantChart` with `title`, `x-axis`, `y-axis`, and `quadrant` definitions.

## Pie Chart Syntax
```mermaid
pie title Test Result Distribution
    "Pass" : 85
    "Fail" : 10
    "Blocked" : 3
    "Skip" : 2
```

## Quadrant Chart Syntax
```mermaid
quadrantChart
    title Risk Matrix
    x-axis Low Impact --> High Impact
    y-axis Low Probability --> High Probability
    quadrant-1 Monitor
    quadrant-2 Mitigate
    quadrant-3 Accept
    quadrant-4 Transfer
    "Feature A": [0.8, 0.6]
    "Feature B": [0.3, 0.9]
```

## QA Examples

### Test Results
```mermaid
pie title Sprint 24 Results
    "Pass" : 142
    "Fail" : 18
    "Blocked" : 5
    "Skip" : 3
```

### Risk Matrix
```mermaid
quadrantChart
    title Test Risk Assessment
    x-axis Low Impact --> High Impact
    y-axis Low Likelihood --> High Likelihood
    quadrant-1 Low priority
    quadrant-2 High priority
    quadrant-3 Monitor
    quadrant-4 Critical
    "Auth flow": [0.9, 0.8]
    "Reports": [0.4, 0.3]
```

## When to Use
- Test result distribution, coverage breakdown
- Risk prioritization, defect severity mapping
- Stakeholder reporting visuals
