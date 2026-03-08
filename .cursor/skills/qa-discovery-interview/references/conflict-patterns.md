# QA Discovery Interview — Conflict Patterns & Resolution

Common conflicts discovered during interviews and strategies to resolve them.

## Conflict Type 1: Scope vs Timeline

**Pattern:** "We need full test coverage for all features, and the release is in 2 weeks."

**Detection signals:**
- Large feature list + short timeline
- "Test everything" + limited team
- No prioritization between features

**Resolution strategy:**
1. Present the scope-timeline-quality triangle
2. Ask: "If we can only thoroughly test 3 areas, which ones matter most?"
3. Propose: smoke testing for low-risk areas, full testing for critical paths
4. Document agreed priorities in the brief with explicit rationale

## Conflict Type 2: Everything is Critical

**Pattern:** "All features are P0, everything must be tested."

**Detection signals:**
- Every priority answer is "High" or "Critical"
- No differentiation between core and peripheral features
- Stakeholder avoids making trade-off decisions

**Resolution strategy:**
1. Force-rank: "If the entire system is down except ONE feature, which one must work?"
2. Use impact matrix: "What's the revenue/user impact if Feature X is broken vs Feature Y?"
3. Categorize into: must-not-fail (P0), should-work (P1), nice-to-have (P2)
4. If stakeholder still won't prioritize: document risk and recommend risk-based approach

## Conflict Type 3: Automation Expectations vs Reality

**Pattern:** "We want 100% automated testing" but team has no automation experience and no CI/CD.

**Detection signals:**
- High automation expectations + junior team
- No existing test infrastructure
- Unrealistic timeline for automation setup

**Resolution strategy:**
1. Acknowledge the goal: "100% automation is a great target. Let's plan a realistic path."
2. Propose phased approach: manual first → automate critical paths → expand coverage
3. Estimate setup time: framework, CI/CD, first tests (typically 2-4 weeks minimum)
4. Recommend starting framework based on team skills (see Category G)

## Conflict Type 4: Missing Infrastructure

**Pattern:** "Test on staging" but staging doesn't exist or isn't maintained.

**Detection signals:**
- References to environments that don't exist
- Test data assumptions without data sources
- External service dependencies without mocks/sandboxes

**Resolution strategy:**
1. Document what exists vs what's assumed
2. Create prerequisites list: environment setup, test data, service access
3. Recommend qa-environment-checker as first step
4. Include infrastructure tasks in the QA brief timeline

## Conflict Type 5: Stakeholder Misalignment

**Pattern:** Dev team says "unit tests are enough" while PM expects "full E2E coverage."

**Detection signals:**
- Different team members give contradictory answers
- Testing philosophy conflicts (shift-left vs traditional QA)
- Unclear ownership of quality

**Resolution strategy:**
1. Document both perspectives without judgment
2. Present testing pyramid: unit → integration → E2E (each has its place)
3. Recommend: "Let's define what 'tested' means for this project" (exit criteria)
4. Propose balanced approach that addresses both concerns

## Conflict Type 6: Security/Compliance Uncertainty

**Pattern:** "We probably don't need GDPR compliance" for a product handling EU user data.

**Detection signals:**
- Dismissive answers about compliance
- Handling user data without mentioning privacy
- Payment processing without PCI awareness

**Resolution strategy:**
1. Don't challenge directly — ask clarifying questions
2. "Does the application store personal data from EU users?" (→ GDPR applies)
3. "Does it process credit card numbers directly?" (→ PCI-DSS applies)
4. If compliance likely applies: note it as a risk in the brief, recommend specialist review

## General Resolution Principles

1. **Don't resolve conflicts yourself** — present them clearly, let stakeholders decide
2. **Document both sides** — the brief should capture the conflict and the resolution
3. **Quantify when possible** — "3 weeks vs 1 week" is clearer than "more time needed"
4. **Propose options** — give 2-3 approaches with trade-offs, let stakeholder choose
5. **Escalate when necessary** — some conflicts require management decisions beyond QA scope
