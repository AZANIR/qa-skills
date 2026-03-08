# Mermaid ER Diagram Syntax — QA Use Cases

## Syntax Overview

ER diagrams use `erDiagram`. Entities: `ENTITY { type attribute PK }`. Relationships: `ENTITY1 ||--o{ ENTITY2 : "relationship"`. Cardinality: `||--||` one-to-one, `||--o{` one-to-many, `}o--o{` many-to-many.

```mermaid
erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ITEM : contains
    USER {
        string id PK
        string name
    }
```

## Example 1: Test Data Model

```mermaid
erDiagram
    TEST_SUITE ||--o{ TEST_CASE : contains
    TEST_CASE ||--o{ TEST_RUN : produces
    TEST_RUN {
        string id PK
        string status
        datetime executed_at
    }
    TEST_CASE {
        string id PK
        string title
        string steps
    }
```

## Example 2: Bug–Test Traceability

```mermaid
erDiagram
    REQUIREMENT ||--o{ TEST_CASE : validates
    TEST_CASE ||--o{ BUG : reveals
    BUG ||--o| REQUIREMENT : relates_to
    REQUIREMENT {
        string id PK
        string title
    }
    BUG {
        string id PK
        string status
    }
```

## Example 3: Test Environment Model

```mermaid
erDiagram
    ENVIRONMENT ||--o{ TEST_RUN : hosts
    TEST_RUN }o--|| TEST_SUITE : belongs_to
    ENVIRONMENT {
        string id PK
        string name
        string url
    }
```

## When to Use

- **Test data models:** Suite, case, run relationships
- **Traceability:** Requirement ↔ Test Case ↔ Bug
- **Environment/config:** Environment, run, suite links
