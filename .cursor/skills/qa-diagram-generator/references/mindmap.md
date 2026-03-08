# Mermaid Mind Map Syntax — QA Use Cases

## Syntax Overview

Mind maps use `mindmap`. Root: `root((Topic))`. Children: indented with `()` for nodes. Use `:` for multiple children. Supports `[]` and `(())` for styling.

```mermaid
mindmap
  root((Topic))
    Branch A
    Branch B
      Sub 1
      Sub 2
```

## Example 1: Test Coverage Mapping

```mermaid
mindmap
  root((Test Coverage))
    Unit
      Services
      Utils
      Models
    Integration
      API
      DB
    E2E
      Critical Paths
      Happy Paths
    Accessibility
      WCAG
      Screen Reader
```

## Example 2: Feature Decomposition

```mermaid
mindmap
  root((Checkout Feature))
    Cart
      Add item
      Remove item
      Update qty
    Payment
      Card
      PayPal
      Wallet
    Shipping
      Address
      Options
      Tracking
```

## Example 3: Risk Areas

```mermaid
mindmap
  root((Test Risks))
    High
      Payment flows
      Auth
    Medium
      Search
      Filters
    Low
      Static pages
      Help
```

## When to Use

- **Test coverage mapping:** Areas to cover, hierarchy
- **Feature decomposition:** Modules, sub-features
- **Risk/priority mapping:** High/medium/low areas
