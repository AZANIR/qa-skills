# Task Type Templates and Examples

*Reference for classifying and structuring work tasks.*

---

## Development Tasks

### Implement (new feature)

**Template:**
- **Title:** Implement [feature] in [component]
- **Description:** Add [feature] per [spec/requirement reference]. [Context].
- **Acceptance criteria:** [List of testable conditions]
- **Labels:** `task`, `development`, `feature`

**Example:**
```
Title: Implement email validation in UserRegistrationForm
Description: Add client-side and server-side email validation per spec §3.2.
Acceptance criteria:
- Valid emails (RFC 5322) pass validation
- Invalid formats show inline error message
- Server returns 400 with error code for invalid email
Labels: task, development, feature, frontend
```

### Fix (bug)

**Template:**
- **Title:** Fix [symptom] in [component]
- **Description:** [Bug summary]. Fixes #[bug-number].
- **Acceptance criteria:** [Conditions that verify fix]
- **Labels:** `task`, `development`, `bug`

**Example:**
```
Title: Fix null pointer when cart is empty in checkout
Description: Checkout crashes when user proceeds with empty cart. Fixes #456.
Acceptance criteria:
- Empty cart shows "Add items to cart" message
- Checkout button disabled when cart empty
- No null pointer exceptions in checkout flow
Labels: task, development, bug, checkout
```

### Refactor

**Template:**
- **Title:** Refactor [component] to [goal]
- **Description:** [Current state] → [desired state]. [Rationale].
- **Acceptance criteria:** [Behavior preserved; improvements verified]
- **Labels:** `task`, `development`, `refactor`

### Optimize

**Template:**
- **Title:** Optimize [operation] in [component]
- **Description:** [Current performance] → [target]. [Approach].
- **Acceptance criteria:** [Measurable performance criteria]
- **Labels:** `task`, `development`, `performance`

---

## QA Tasks

### Write tests

**Template:**
- **Title:** Add [test type] for [component/feature]
- **Description:** [Coverage gap or risk]. [Scope].
- **Acceptance criteria:** [Coverage target, scenarios covered]
- **Labels:** `task`, `qa`, `testing`

**Example:**
```
Title: Add unit tests for AuthService.login()
Description: AuthService.login() has 0% coverage. High-risk authentication path.
Acceptance criteria:
- Happy path: valid credentials return token
- Invalid credentials return 401
- Locked account returns 423
- Coverage ≥ 90% for AuthService
Labels: task, qa, testing, auth
```

### Increase coverage

**Template:**
- **Title:** Increase test coverage for [module] to [target]%
- **Description:** Current: [X]%. Target: [Y]%. Gaps: [list].
- **Acceptance criteria:** [Coverage threshold; critical paths covered]
- **Labels:** `task`, `qa`, `coverage`

### Update test data

**Template:**
- **Title:** Update test data for [scenario]
- **Description:** [What changed; why data needs update].
- **Acceptance criteria:** [Data valid; tests pass]
- **Labels:** `task`, `qa`, `test-data`

---

## Documentation Tasks

### Update specs

**Template:**
- **Title:** Update [spec/doc] for [change]
- **Description:** [What changed in implementation]. [Sections to update].
- **Acceptance criteria:** [Spec reflects current behavior; examples updated]
- **Labels:** `task`, `documentation`, `spec`

### Add diagrams

**Template:**
- **Title:** Add [diagram type] for [topic]
- **Description:** [Purpose]. [Scope]. Use qa-diagram-generator patterns.
- **Acceptance criteria:** [Diagram accurate; embedded in doc]
- **Labels:** `task`, `documentation`, `diagram`

### API docs

**Template:**
- **Title:** Document [API/endpoint] in OpenAPI
- **Description:** [Endpoint]. [Request/response]. [Examples].
- **Acceptance criteria:** [OpenAPI valid; examples runnable]
- **Labels:** `task`, `documentation`, `api`

---

## Enhancement Tasks

### Performance

**Template:**
- **Title:** Improve [metric] for [component]
- **Description:** [Current] → [target]. [Approach].
- **Acceptance criteria:** [Benchmark before/after]
- **Labels:** `task`, `enhancement`, `performance`

### Validation

**Template:**
- **Title:** Add validation for [input/flow]
- **Description:** [Gap]. [Validation rules].
- **Acceptance criteria:** [Invalid inputs rejected; errors clear]
- **Labels:** `task`, `enhancement`, `validation`

### UI polish

**Template:**
- **Title:** Polish [UI element] for [improvement]
- **Description:** [Current UX issue]. [Desired state].
- **Acceptance criteria:** [Visual/UX criteria]
- **Labels:** `task`, `enhancement`, `ui`

---

## Task Type Selection Matrix

| Input Source | Primary Type | Secondary |
| ------------ | ------------ | --------- |
| Bug report | Development (fix) | QA (regression test) |
| Coverage gap | QA (write tests) | Development (if implementation missing) |
| Spec finding | Development / Documentation | QA |
| Risk analysis | QA / Development | Documentation |
| User request | Varies | — |
