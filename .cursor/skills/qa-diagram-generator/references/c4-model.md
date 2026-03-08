# Mermaid C4 Model Syntax

## Overview
C4 diagrams show system architecture at Context, Container, and Component levels. Mermaid supports C4 via `C4Context`, `C4Container`, `C4Component` blocks.

## Syntax
```mermaid
C4Context
    title System Context
    Person(user, "User")
    System(system, "System")
    Rel(user, system, "Uses")
```

## QA Examples

### System Context
```mermaid
C4Context
    title E-commerce System Context
    Person(customer, "Customer")
    System(ecom, "E-commerce Platform")
    System(payment, "Payment Gateway")
    Rel(customer, ecom, "Browses, Orders")
    Rel(ecom, payment, "Processes payment")
```

### Container Diagram
```mermaid
C4Container
    title API Test Target Architecture
    Person(tester, "QA Engineer")
    Container(api, "REST API", "Node.js")
    Container(db, "Database", "PostgreSQL")
    Rel(tester, api, "Tests")
    Rel(api, db, "Reads/Writes")
```

### Component View
```mermaid
C4Component
    title API Service Components
    Container_Boundary(api, "API Service") {
        Component(auth, "Auth", "JWT validation")
        Component(handler, "Handlers", "Request routing")
        Component(repo, "Repository", "Data access")
    }
```

## When to Use
- Test scope definition (what to test)
- Integration test planning
- Understanding system boundaries for E2E coverage
