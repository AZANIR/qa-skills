# Exploratory Testing Charter Templates

Charter templates for different exploratory testing scenarios. Each charter includes mission, test areas, time-box options, notes template, and debrief structure.

---

## New Feature Charter

**Scenario:** First exploration of a newly implemented feature before formal test case execution.

### Mission Statement
Explore [feature name] to understand behavior, identify obvious defects, and map edge cases for follow-up test design.

### Test Areas
- **In scope:** [Feature name], [related flows], [configuration options]
- **Out of scope:** [Unrelated modules], [performance], [automation]

### Time-Box
- **25 min:** Quick smoke of main flows
- **45 min:** Main flows + 2–3 alternate paths
- **90 min:** Full exploration including edge cases and error handling

### Notes Template
| Observation | Severity | Reproducible? | Notes |
| ----------- | -------- | ------------- | ----- |
| | | | |
| | | | |

**Bugs found:** [List IDs or brief descriptions]  
**Ideas for test cases:** [Scenarios to formalize]  
**Questions:** [Clarifications needed from dev/product]

### Debrief Structure
- **What worked:** Flows that behaved as expected
- **What didn't:** Defects, confusing UX, missing validation
- **Risks:** Areas not explored, assumptions, dependencies
- **Follow-ups:** Test cases to add, bugs to file, areas for deeper exploration

---

## Regression Charter

**Scenario:** Broad regression exploration after a release or significant change.

### Mission Statement
Explore [module/area] to verify core functionality after [change/release]. Focus on high-traffic paths and recently modified areas.

### Test Areas
- **In scope:** [Core flows], [changed modules], [integration points]
- **Out of scope:** [Stable, low-risk areas], [new feature deep-dives]

### Time-Box
- **25 min:** Smoke of critical paths only
- **45 min:** Critical + important paths
- **90 min:** Full regression sweep with risk-based depth

### Notes Template
| Area Explored | Status | Issues |
| ------------- | ------ | ------ |
| | Pass / Fail / Blocked | |
| | | |

**Regression failures:** [List]  
**New issues vs. known:** [Differentiate]  
**Areas skipped (time):** [For follow-up]

### Debrief Structure
- **Pass/Fail summary:** Per area explored
- **Blockers:** What prevented testing
- **Comparison to baseline:** Better/worse/same vs. previous version
- **Follow-ups:** Formal test cases for failures, retest plan

---

## Security Review Charter

**Scenario:** Exploratory security-focused session (complements automated security scans).

### Mission Statement
Explore [feature/module] from a security perspective. Look for injection, auth bypass, data exposure, and privilege escalation risks.

### Test Areas
- **In scope:** [Auth flows], [input fields], [file upload], [API endpoints], [role-based access]
- **Out of scope:** [Infrastructure], [third-party components]

### Time-Box
- **25 min:** Quick auth and input validation checks
- **45 min:** Auth + input + basic access control
- **90 min:** Full security review including session handling, CSRF, data exposure

### Notes Template
| Vulnerability Type | Location | Severity | Steps to Reproduce |
| ------------------ | -------- | -------- | ------------------ |
| | | Critical / High / Medium / Low | |
| | | | |

**Attack vectors tried:** [List]  
**Recommendations:** [Mitigations, follow-up scans]

### Debrief Structure
- **Findings by severity:** Critical/High/Medium/Low
- **False positives:** Checked and ruled out
- **Areas not covered:** Time or tool limitations
- **Follow-ups:** OWASP ZAP scan, penetration test, dev review

---

## Usability Review Charter

**Scenario:** Exploratory usability and accessibility review.

### Mission Statement
Explore [feature/module] from a usability perspective. Assess clarity, discoverability, error handling, and accessibility for different user types.

### Test Areas
- **In scope:** [User flows], [error messages], [help text], [keyboard nav], [screen reader compatibility]
- **Out of scope:** [Visual design polish], [performance]

### Time-Box
- **25 min:** First-time user flow, main friction points
- **45 min:** First-time + power user flows, error handling
- **90 min:** Full usability review including accessibility checks

### Notes Template
| Issue | Location | Type (Clarity / Discoverability / Error / A11y) | Severity |
| ----- | -------- | ---------------------------------------------- | -------- |
| | | | |
| | | | |

**Positive observations:** [What works well]  
**User confusion points:** [Where users might get stuck]  
**A11y findings:** [Keyboard, screen reader, contrast]

### Debrief Structure
- **Usability score (1–5):** Per flow or overall
- **Top 3 issues:** Highest impact
- **Accessibility gaps:** WCAG compliance notes
- **Follow-ups:** UX review, a11y audit, design changes
