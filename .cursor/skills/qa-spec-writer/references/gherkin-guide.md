# Gherkin Syntax Guide

Gherkin is a Business Readable, Domain Specific Language for behavior descriptions. It uses keywords to structure scenarios in Given/When/Then format.

---

## Core Keywords

| Keyword | Purpose |
| ------- | ------- |
| `Feature` | High-level description of a capability |
| `Scenario` | Concrete example of behavior |
| `Scenario Outline` | Template for data-driven scenarios |
| `Given` | Precondition / initial context |
| `When` | Action / event |
| `Then` | Expected outcome / observable result |
| `And` | Continuation of previous step (Given/When/Then) |
| `But` | Contrast to previous step |
| `Background` | Steps run before every scenario in the feature |
| `Examples` | Data table for Scenario Outline |

---

## Happy Path Scenarios

Describe the primary success flow with clear preconditions and outcomes.

```gherkin
Feature: User Registration

  Scenario: New user successfully registers
    Given the user is on the registration page
    And no account exists for "user@example.com"
    When the user enters valid registration details
    And the user submits the form
    Then the account is created
    And a confirmation email is sent
    And the user is redirected to the dashboard
```

**Guidelines:**
- One primary action in `When`
- Outcomes should be observable and verifiable
- Avoid implementation details (e.g., "clicks the Submit button" vs "submits the form")

---

## Negative Scenarios

Describe invalid inputs, unauthorized access, or error conditions.

```gherkin
Feature: User Login

  Scenario: Login fails with invalid password
    Given a user account exists with email "user@example.com"
    When the user enters email "user@example.com" and wrong password
    And the user submits the login form
    Then the user remains on the login page
    And "Invalid email or password" is displayed
    And the failed attempt is logged

  Scenario: Login fails when account is locked
    Given the user account is locked due to 5 failed attempts
    When the user attempts to login with correct credentials
    Then "Account locked. Try again in 15 minutes" is displayed
    And the user cannot log in
```

**Guidelines:**
- Specify the exact error message or behavior
- Include security considerations (e.g., generic messages to avoid enumeration)
- Document recovery path if applicable

---

## Boundary Scenarios

Test limits: min, max, empty, null, and transition points.

```gherkin
Feature: Product Search

  Scenario: Search with empty query returns all products
    Given the catalog has 100 products
    When the user searches with an empty query
    Then all 100 products are returned
    And results are paginated with 20 per page

  Scenario: Search with maximum length query
    Given the search supports up to 200 characters
    When the user searches with a 200-character query
    Then the search executes successfully
    And results matching the query are returned

  Scenario: Pagination at last page
    Given there are 45 products (3 pages of 20)
    When the user navigates to page 3
    Then 5 products are displayed
    And "Page 3 of 3" is shown
    And the "Next" button is disabled
```

**Guidelines:**
- Use exact boundary values (0, 1, max, max+1)
- Specify behavior for empty and null explicitly
- Include off-by-one cases (e.g., last page)

---

## Data-Driven Scenarios (Scenario Outline)

Use `Scenario Outline` with `Examples` to run the same scenario with different data.

```gherkin
Feature: Password Validation

  Scenario Outline: Password fails validation rules
    Given the user is on the registration form
    When the user enters password "<password>"
    And the user submits the form
    Then "Password must <rule>" is displayed
    And the form is not submitted

    Examples:
      | password   | rule                          |
      | short      | be at least 8 characters      |
      | noNumbers1 | contain at least one number   |
      | NOUPPERCASE| contain at least one uppercase|
      | nolower1   | contain at least one lowercase|
```

**Guidelines:**
- Use `<placeholder>` in steps, define in Examples table
- One scenario outline per logical variation
- Keep Examples readable; split into multiple outlines if needed

---

## Background

Use `Background` for steps shared by all scenarios in the feature.

```gherkin
Feature: Shopping Cart

  Background:
    Given the user is logged in
    And the user has an empty cart

  Scenario: Add item to cart
    When the user adds "Widget A" to the cart
    Then the cart contains 1 item
    And "Widget A" is in the cart

  Scenario: Remove item from cart
    Given the cart contains "Widget A"
    When the user removes "Widget A" from the cart
    Then the cart is empty
```

**Guidelines:**
- Keep Background short (2–4 steps)
- Use for setup, not for scenario-specific context
- If Background grows large, consider a separate feature or hooks

---

## Step Best Practices

### Do
- Use third person: "the user", "the system"
- Make steps declarative: "the cart contains 2 items" vs "the user added 2 items"
- One concept per step
- Use domain language, not UI language
- Make outcomes verifiable: "is displayed", "returns 200", "is saved"

### Don't
- Don't use "should" or "would" — use definitive "is", "returns", "displays"
- Don't chain multiple actions in one step
- Don't reference implementation (clicks, API calls) unless the feature is about that
- Don't use subjective criteria: "user-friendly" → "displays within 2 seconds"

---

## Anti-Patterns

| Anti-Pattern | Problem | Fix |
| ----------- | ------- | --- |
| Imperative steps | "Click Submit, then click Confirm" | "Submits the form", "Confirms the action" |
| Vague outcomes | "Then it works" | "Then the order status is 'confirmed'" |
| Implementation details | "Then the database has a new row" | "Then the order appears in order history" |
| Too many steps | 15+ steps per scenario | Split into smaller scenarios |
| Duplicate scenarios | Same scenario, different feature | Use tags or Background |
| Test data in steps | "user with id 12345" | "a user", use tables for specific data |

---

## Tags (Optional)

Use tags for filtering and organization:

```gherkin
@smoke @critical
Scenario: User can login

@regression @slow
Scenario: Bulk import 10000 records

@wip
Scenario: New checkout flow (in progress)
```

---

## Full Example

```gherkin
Feature: Order Placement
  As a customer
  I want to place an order
  So that I can purchase products

  Background:
    Given the user is logged in
    And the user has items in the cart

  Scenario: Successful order placement
    Given the user has a valid shipping address
    And the user has a valid payment method
    When the user completes checkout
    Then the order is created with status "pending"
    And a confirmation email is sent
    And the cart is emptied

  Scenario: Order fails with invalid payment
    Given the user has an expired payment method
    When the user attempts checkout
    Then "Payment failed" is displayed
    And the order is not created
    And the cart retains the items

  Scenario Outline: Order respects quantity limits
    Given the product "<product>" has max quantity <max>
    When the user sets quantity to <quantity>
    Then <result>

    Examples:
      | product | max | quantity | result                    |
      | Widget  | 10  | 5        | quantity is accepted      |
      | Widget  | 10  | 10       | quantity is accepted      |
      | Widget  | 10  | 11       | "Max 10 per order" shown  |
```
