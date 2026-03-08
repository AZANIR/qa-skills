# Mermaid Gantt Chart Syntax

## Overview
Gantt charts show tasks over time. Use `gantt` block with `title`, `dateFormat`, and task definitions. Tasks use `section`, `task name :crit, id, start, end`.

## Syntax
```mermaid
gantt
    title Example
    dateFormat YYYY-MM-DD
    section Phase 1
    Task A :a1, 2024-01-01, 7d
    Task B :a2, after a1, 5d
    section Phase 2
    Task C :crit, 2024-01-15, 3d
```

## QA Examples

### Test Schedule
```mermaid
gantt
    title Sprint 24 Test Schedule
    dateFormat YYYY-MM-DD
    section Unit Tests
    Unit test execution :ut, 2024-03-01, 3d
    section Integration
    API integration tests :api, after ut, 2d
    section E2E
    E2E regression :crit, e2e, after api, 4d
```

### Release Test Plan
```mermaid
gantt
    title Release 2.0 Test Phases
    dateFormat YYYY-MM-DD
    section Smoke
    Smoke tests :s1, 2024-03-10, 1d
    section Regression
    Full regression :crit, r1, after s1, 5d
    section UAT
    UAT window :u1, after r1, 3d
```

## When to Use
- Test schedules, sprint planning, release timelines
- Phase dependencies and critical path
- Resource allocation over time
