# Mermaid User Journey Syntax

## Overview
User journeys map user actions and experiences over time. Use `journey` block with `title` and `section` for phases. Tasks use `Task name: score: participant`.

## Syntax
```mermaid
journey
    title User Journey
    section Phase 1
      Action 1: 5: User
      Action 2: 3: System
    section Phase 2
      Action 3: 5: User
```

## QA Examples

### Login Flow UX
```mermaid
journey
    title Login User Journey
    section Enter
      Open login page: 5: User
      Enter credentials: 4: User
    section Validate
      Submit form: 5: User
      Validate & redirect: 3: System
    section Success
      Land on dashboard: 5: User
```

### Checkout Flow
```mermaid
journey
    title Checkout Experience
    section Cart
      Add items: 5: Customer
      Review cart: 4: Customer
    section Payment
      Enter payment: 3: Customer
      Confirm order: 5: Customer
    section Confirmation
      Receive confirmation: 5: Customer
```

## When to Use
- UAT scenario design
- UX testing flows
- Identifying pain points (low scores) for test focus
