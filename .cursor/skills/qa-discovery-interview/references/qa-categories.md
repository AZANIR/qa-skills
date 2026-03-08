# QA Discovery Interview — Category Deep Dive Questions

## Category A: Problem & Product

**Focus:** What is being tested, business context, impact of defects.

| # | Question | Purpose |
|---|----------|---------|
| A1 | What is the core problem this product/feature solves for users? | Understand business value and testing priority |
| A2 | What happens if this feature ships with defects? What's the business impact? | Calibrate severity thresholds |
| A3 | Who are the end users? How many? What's their technical proficiency? | Define user personas for test design |
| A4 | Are there competing products? What differentiates this one? | Identify areas where quality is a competitive advantage |

**Signals for deeper exploration:**
- "Millions of users" → performance and scalability are critical
- "Financial transactions" → security, data integrity, compliance
- "Healthcare/legal" → regulatory compliance, audit trails

## Category B: Testing Scope & Objectives

**Focus:** What types of testing are needed, what's in/out of scope.

| # | Question | Purpose |
|---|----------|---------|
| B1 | Which testing types are critical: functional, performance, security, accessibility? | Prioritize testing types |
| B2 | What is explicitly OUT of scope for testing? | Prevent scope creep |
| B3 | What is the definition of "done" for QA on this project? | Set clear exit criteria |
| B4 | Are there existing quality metrics or KPIs we need to meet? | Quantify quality targets |

**Signals for deeper exploration:**
- No clear exit criteria → probe for pass/fail thresholds
- "Everything is important" → force-rank with severity/impact matrix

## Category C: User Flows & Critical Paths

**Focus:** Core scenarios, happy paths, unhappy paths, edge cases.

| # | Question | Purpose |
|---|----------|---------|
| C1 | Walk me through: a user completes the primary action. What happens step by step? | Map the happy path |
| C2 | What are the top 3 most critical user journeys? | Prioritize test coverage |
| C3 | What are the known edge cases or unusual user behaviors? | Identify boundary/negative test scenarios |
| C4 | Are there different user roles? How do their flows differ? | Role-based test scenarios |

**Signals for deeper exploration:**
- Complex multi-step flows → state diagram needed
- Multiple user roles → permission matrix testing
- "Users do unexpected things" → exploratory testing emphasis

## Category D: Technical Landscape

**Focus:** Technology stack, architecture, constraints, integrations.

| # | Question | Purpose |
|---|----------|---------|
| D1 | What technologies, frameworks, and languages are used? (frontend, backend, DB) | Select appropriate test writers |
| D2 | What external APIs, services, or third-party integrations exist? | Contract testing, mock requirements |
| D3 | Is this a monolith, microservices, serverless, or hybrid architecture? | Architecture-appropriate test strategy |
| D4 | What are the known technical constraints or limitations? | Adjust test approach for constraints |

**Signals for deeper exploration:**
- Microservices → contract testing (Pact), service-level testing
- External APIs → mock/stub strategy, API contract validation
- Legacy systems → integration risk, compatibility testing

## Category E: Existing QA Processes

**Focus:** Current CI/CD, test automation, tools, coverage.

| # | Question | Purpose |
|---|----------|---------|
| E1 | What testing exists today? Automated? Manual? Both? | Baseline current state |
| E2 | What CI/CD pipeline is in place? What tests run automatically? | Integration points for new tests |
| E3 | What test management tools are used? (Jira, TestRail, Qase, spreadsheets) | Tool integration requirements |
| E4 | What's the current test coverage? Are there known gaps? | Coverage gap analysis starting point |

**Signals for deeper exploration:**
- No automation → need onboarding plan, framework selection
- Flaky tests mentioned → qa-flaky-detector engagement
- No CI/CD → environment setup is prerequisite

## Category F: Risk Areas & Priorities

**Focus:** What can break, what matters most, defect history.

| # | Question | Purpose |
|---|----------|---------|
| F1 | Which areas have the highest defect history or most production incidents? | Risk-based test prioritization |
| F2 | What was the last major bug that reached production? What caused it? | Pattern analysis for prevention |
| F3 | If you could only test 3 things, what would they be? | Force-rank priorities |
| F4 | Are there upcoming changes that increase risk? (migrations, refactors, new integrations) | Proactive risk management |

**Signals for deeper exploration:**
- Frequent production bugs → regression testing emphasis
- Major migration planned → migration test plan needed
- "Payment bugs" → security + functional testing priority

## Category G: Team, Tools & Infrastructure

**Focus:** Who tests, with what tools, in which environments.

| # | Question | Purpose |
|---|----------|---------|
| G1 | What is the team's automation expertise? (junior, mid, senior; languages known) | Framework complexity calibration |
| G2 | What test environments exist? (dev, staging, QA, UAT, production) | Environment setup and readiness |
| G3 | What browsers, devices, and OS versions must be supported? | Browser/device matrix |
| G4 | What budget and timeline constraints exist for QA? | Resource planning and prioritization |

**Signals for deeper exploration:**
- Junior team → simpler frameworks (CodeceptJS, Robot Framework)
- No staging environment → environment-checker priority
- Mobile required → mobile test writer engagement

## Category H: Compliance & Standards

**Focus:** WCAG, OWASP, ISO, GDPR, industry-specific regulations.

| # | Question | Purpose |
|---|----------|---------|
| H1 | Are there regulatory or compliance requirements? (GDPR, HIPAA, PCI-DSS, SOC2) | Compliance test requirements |
| H2 | What accessibility standard is required? (WCAG 2.2 Level A/AA/AAA) | Accessibility testing scope |
| H3 | Are there security requirements or certifications needed? (OWASP, penetration testing) | Security testing scope |
| H4 | Are there industry-specific standards? (ISO 27001, FDA, FedRAMP) | Specialized compliance testing |

**Signals for deeper exploration:**
- GDPR → data privacy testing, consent flows, deletion verification
- WCAG AA → accessibility-test-writer engagement, full checklist
- PCI-DSS → payment security, encryption validation
- No compliance mentioned → confirm explicitly ("Are you sure no regulations apply?")

## Adaptive Questioning Strategy

### Question Ordering
1. Start with the category most relevant to the initial orientation answers
2. If business-critical → A, F, C first
3. If technical migration → D, E, G first
4. If compliance-driven → H, B, F first

### Depth Calibration
- **Shallow (1-2 questions):** Category is clear from context or explicitly out of scope
- **Normal (2-3 questions):** Standard exploration
- **Deep (3-4 questions + follow-ups):** High risk, uncertainty, or conflicts detected

### Batching
- Ask 2-3 questions at a time (not one by one — too slow; not all at once — overwhelming)
- Group related questions within a category
- After each batch, summarize understanding before proceeding
