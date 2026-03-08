# ISO 29119-4 Test Design Techniques

Test design techniques per ISO/IEC/IEEE 29119-4. Use these to build test models and derive test cases with measurable coverage.

---

## Equivalence Partitioning (EP)

**Description:** Partition input domain into equivalence classes where members are expected to behave identically. Select one representative from each partition to reduce test count while maintaining coverage.

**When to use:** Input fields with ranges, sets of valid/invalid values, enumerated types, validation rules.

**Example:** Password field (8–128 chars)
- Partition 1: Valid (8–128 chars) → pick 12 chars
- Partition 2: Too short (< 8) → pick 5 chars
- Partition 3: Too long (> 128) → pick 130 chars
- Partition 4: Empty → empty string
- Partition 5: Null (if applicable) → null

**Coverage:** At least one test per partition.

---

## Boundary Value Analysis (BVA)

**Description:** Test at and around boundaries of input domains. Defects often occur at min, max, and off-by-one values.

**When to use:** Numeric ranges, string lengths, array sizes, pagination limits, date ranges.

**Example:** Age field (18–120)
- Min boundary: 18 (valid)
- Min - 1: 17 (invalid)
- Max boundary: 120 (valid)
- Max + 1: 121 (invalid)
- Typical: 25 (valid)

**Coverage:** Min, min-1, max, max+1, and optionally typical value per boundary.

---

## Decision Tables

**Description:** Tabular representation of business rules. Rows = rule combinations, columns = conditions and actions. Each row yields a test case.

**When to use:** Multiple conditions affecting outcome, business rules, discount/eligibility logic, access control.

**Example:** Login (2FA enabled/disabled, valid/invalid password)

| 2FA Enabled | Password Valid | Expected |
| ----------- | -------------- | -------- |
| No | Yes | Login success |
| No | No | Error: invalid password |
| Yes | Yes | Prompt for 2FA code |
| Yes | No | Error: invalid password |

**Coverage:** One test per rule (row). Consider all combinations or use techniques to reduce (e.g., pairwise) if combinatorial explosion.

---

## State Transition Testing

**Description:** Model system as states and transitions. Test paths through the state machine: all states, all transitions, or specific paths (e.g., happy path, error paths).

**When to use:** Workflows, lifecycles, multi-step processes, order status, user sessions, wizards.

**Example:** Order lifecycle: Draft → Submitted → Paid → Shipped → Delivered

- States: Draft, Submitted, Paid, Shipped, Delivered, Cancelled
- Transitions: submit, pay, ship, deliver, cancel
- Test paths: Draft→Submitted→Paid→Shipped→Delivered; Draft→Cancelled; invalid transitions (e.g., Paid→Draft)

**Coverage:** All states, all transitions, or transition pairs (0-switch, 1-switch coverage).

---

## Use Case Testing

**Description:** Derive test scenarios from use cases. Cover main success scenario, extensions (alternate flows), and exception flows.

**When to use:** User-facing features, documented use cases, user stories with Given/When/Then.

**Example:** Use case "Place Order"
- Main: Add items → Enter shipping → Pay → Order confirmed
- Extension 2a: Apply discount code
- Extension 3a: Save for later
- Exception 2b: Invalid payment → retry or cancel

**Coverage:** Main scenario + each extension + each exception.

---

## Classification Trees

**Description:** Hierarchical decomposition of test object into classifications and classes. Combine classes across classifications to form test cases.

**When to use:** Complex objects with multiple attributes, configuration testing, combinatorial selection.

**Example:** Search filters: Category (Electronics, Clothing, Books), Price (Low, Mid, High), Sort (Relevance, Price, Date)

- Classes: 3 × 3 × 3 = 27 combinations
- Use pairwise or risk-based selection to reduce

**Coverage:** All classes exercised; combination coverage as defined (full, pairwise, etc.).

---

## Technique Selection Guide

| Situation | Preferred Technique(s) |
| --------- | ---------------------- |
| Input validation | EP, BVA |
| Business rules | Decision tables |
| Workflows, lifecycles | State transition |
| User flows | Use case testing |
| Complex combinations | Classification trees, decision tables |
| API parameters | EP, BVA |
| Form fields | EP, BVA, decision tables (for conditional validation) |

---

## Combining Techniques

Often combine techniques for full coverage:
- **EP + BVA:** Partition first, then add boundary tests
- **State + Use case:** Model workflow as state machine, derive scenarios from use case
- **Decision table + EP:** Rules define partitions, EP refines input selection
