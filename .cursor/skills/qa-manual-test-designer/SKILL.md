---
name: qa-manual-test-designer
description: Design manual test cases and exploratory testing charters using specification-based techniques, risk-based prioritization, and persona-based testing approaches.
output_dir: test-cases/manual
---

# QA Manual Test Designer

## Purpose

Design manual test cases and exploratory testing charters for human testers. Combines specification-based test models, risk-based prioritization, and persona-based testing to produce structured test case sets, exploratory session charters, and session report templates.

## Trigger Phrases

- "Design manual test cases for [feature]"
- "Create exploratory testing charter" / "Exploratory charter for [area]"
- "Manual test design from [spec/requirements]"
- "Risk-based manual test prioritization"
- "Persona-based test scenarios" / "Test as [Novice/Power User/Admin]"
- "Session charter for [new feature/regression/security]"
- "Manual test case set with decision tables"
- "Exploratory session report template"

## Specification-Based Test Models

Use these models to derive structured manual test cases per ISO/IEC/IEEE 29119-4:

| Model | When to Use | Output |
| ----- | ----------- | ------ |
| **Decision tables** | Multiple conditions affecting outcome (validation, business rules) | One test case per rule column |
| **State transitions** | Workflows, lifecycle states, session management | Test cases for valid/invalid transitions |
| **Scenario models** | User journeys, use case flows | Main flow, alternate flows, exception flows |
| **Classification trees** | Complex input spaces (user type × action × data state) | Pairwise or coverage-based combinations |

See `references/test-design-techniques.md` (from qa-testcase-from-docs) for technique details.

## Exploratory Testing Session Charters

Exploratory charters guide time-boxed sessions without scripting every step. Each charter includes:

| Element | Description |
| ------- | ----------- |
| **Mission statement** | Clear, focused goal (e.g., "Explore checkout flow for guest users") |
| **Test areas** | Scope: what to explore, what to skip |
| **Time-box** | 25 / 45 / 90 min — choose based on scope and focus |
| **Notes template** | Structured placeholders for observations, bugs, ideas |
| **Debrief structure** | Post-session: what worked, what didn't, risks, follow-ups |

See `references/exploratory-charters.md` for templates by scenario (new feature, regression, security, usability).

## Risk-Based Test Prioritization for Manual Testing

Prioritize manual test cases by risk when time is limited:

| Factor | High Risk | Medium Risk | Low Risk |
| ------ | --------- | ----------- | -------- |
| **Business impact** | Revenue, compliance, safety | Core workflows | Nice-to-have |
| **Change frequency** | Recently changed, new code | Moderate changes | Stable |
| **Complexity** | Multi-step, integrations | Moderate logic | Simple |
| **User exposure** | High-traffic paths | Common paths | Rare paths |

**Output:** Prioritized test case list (P1/P2/P3) with rationale. Run P1 first when time-boxed.

## Persona-Based Testing

Test from different user perspectives to uncover diverse defects:

| Persona | Focus | Typical Behaviors |
| ------- | ----- | ----------------- |
| **Novice User** | First-time, confused | Clicks randomly, ignores hints, gets lost |
| **Power User** | Efficiency, edge cases | Keyboard shortcuts, bulk actions, advanced features |
| **Attacker** | Malicious input, bypass | SQL injection, XSS, auth bypass, privilege escalation |
| **Admin** | Configuration, permissions | Role setup, access control, audit logs |
| **Mobile User** | Touch, small screen | Thumb reach, orientation, slow network |

See `references/personas.md` for detailed behaviors, goals, and test scenarios per persona.

## Outputs

| Output Type | Format | Use Case |
| ----------- | ------ | -------- |
| **Manual test case set** | ID, Title, Steps, Expected Results, Priority | Structured execution |
| **Exploratory charter** | Mission, areas, time-box, notes template | Session planning |
| **Session report** | Findings, bugs, risks, follow-ups | Post-session debrief |

## Workflow

1. **Input:** Spec, requirements, or feature description
2. **Model selection:** Choose test models (decision table, state, scenario, classification tree)
3. **Derive test cases:** Generate manual test cases with steps and expected results
4. **Prioritize:** Apply risk-based prioritization (P1/P2/P3)
5. **Charters (optional):** Create exploratory charters for areas needing exploration
6. **Personas (optional):** Add persona-based scenarios for coverage diversity
7. **Output:** Manual test case set + charters + session report template

## Scope

**Can do (autonomous):**
- Design manual test cases from specs/requirements using decision tables, state transitions, scenario models, classification trees
- Create exploratory testing charters with mission, areas, time-box, notes template, debrief structure
- Apply risk-based prioritization to manual test cases
- Generate persona-based test scenarios (Novice, Power User, Attacker, Admin, Mobile User)
- Produce session report templates for exploratory debriefs
- Reference qa-diagram-generator for state/flow diagrams when needed

**Cannot do (requires confirmation):**
- Change scope or priority set by stakeholders
- Override organizational test policy or risk thresholds
- Assign testers or schedule sessions without approval

**Will not do (out of scope):**
- Write test automation code
- Execute tests or run exploratory sessions
- Modify production code or environments
- Approve releases or sign-offs

## Quality Checklist

- [ ] Manual test cases have clear steps and measurable expected results
- [ ] Preconditions and postconditions specified where relevant
- [ ] Risk-based prioritization applied with documented rationale
- [ ] Exploratory charters include mission, areas, time-box, notes template, debrief structure
- [ ] Persona-based scenarios cover at least 2–3 personas when diversity is needed
- [ ] Session report template includes findings, bugs, risks, follow-ups
- [ ] No duplicate test cases for same scenario
- [ ] Traceability to requirements/specs where applicable

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Vague test steps | Spec lacks detail | Run qa-spec-writer first; add Given/When/Then |
| Too many test cases | Exhaustive combination | Apply risk prioritization; focus on P1/P2 |
| Charters too broad | Mission not focused | Narrow mission to single area or flow |
| Persona scenarios generic | Persona not specific enough | Use `references/personas.md` for concrete behaviors |
| Session reports incomplete | Missing debrief structure | Include: what worked, what didn't, risks, follow-ups |
| Low coverage diversity | Only happy path | Add persona-based and negative scenarios |

## References

| Topic | File |
| ----- | ---- |
| Exploratory charter templates | `references/exploratory-charters.md` |
| Persona details & scenarios | `references/personas.md` |
| Test design techniques | `references/test-design-techniques.md` (qa-testcase-from-docs) |
