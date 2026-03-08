# Mermaid Flowchart Syntax — QA Use Cases

## Syntax Overview

Flowcharts use `flowchart` or `graph` keyword. Direction: `TB` (top-bottom), `LR` (left-right), `RL`, `BT`. Nodes: `[rect]`, `(rounded)`, `{diamond}`, `[(database)]`, `[[subroutine]]`. Edges: `-->`, `---`, `-.->`, `==>`.

```mermaid
flowchart LR
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[End]
```

## Example 1: Test Process Flow

```mermaid
flowchart TB
    subgraph Input
        R[Requirements]
        S[Specs]
    end
    R --> TC[Test Case Design]
    S --> TC
    TC --> EX[Execute Tests]
    EX --> RPT{Pass?}
    RPT -->|Yes| DONE[Done]
    RPT -->|No| BUG[Log Bug]
    BUG --> FIX[Dev Fix]
    FIX --> EX
```

## Example 2: Regression Decision Tree

```mermaid
flowchart LR
    CHG[Code Change] --> AFFECT{Affected Area?}
    AFFECT -->|Core| FULL[Full Regression]
    AFFECT -->|Module X| MOD[Module X Suite]
    AFFECT -->|Config Only| SMOKE[Smoke Only]
```

## Example 3: Test Execution Flow

```mermaid
flowchart TB
    START[CI Trigger] --> UNIT[Unit Tests]
    UNIT --> INT[Integration Tests]
    INT --> E2E[E2E Tests]
    E2E --> REPORT[Report]
    REPORT --> GATE{All Pass?}
    GATE -->|Yes| DEPLOY[Deploy]
    GATE -->|No| BLOCK[Block Pipeline]
```

## Related: Git Graph, Block Diagram, BPMN

**Git Graph** — Branch strategy, release flow:
```mermaid
gitGraph
  commit
  branch develop
  checkout develop
  commit
  checkout main
  merge develop
```

**Block Diagram** (`block-beta`) — System components:
```mermaid
block-beta
  columns 2
  block:core["API + DB"]
  block:qa["Tests"]
```

**BPMN** — Approval workflows:
```mermaid
bpmn
  task(Submit)
  task(Review)
  task(Approve)
  Submit --> Review --> Approve
```

## When to Use

- **Test process flows:** End-to-end QA workflow
- **Decision trees:** Regression scope, test selection logic
- **Pipeline flows:** CI/CD test stages, gates
- **Git Graph:** Release flow, branch strategy
- **Block Diagram:** System component layout
- **BPMN:** Approval workflows, business process testing
