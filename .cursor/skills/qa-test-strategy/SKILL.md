---
name: qa-test-strategy
description: Generate comprehensive test strategy documents covering scope, approach, testing types, environments, risk assessment, entry/exit criteria, and resource planning.
output_dir: docs/plans
dependencies:
  recommended:
    - qa-diagram-generator
    - qa-risk-analyzer
---

# QA Test Strategy

## Purpose

Create comprehensive test strategy and test plan documents that define the overall approach to testing for a project or release. Aligns with ISO/IEC/IEEE 29119-3 and provides a strategic blueprint for all testing activities.

## Trigger Phrases

- "Create a test strategy for..."
- "Generate test strategy document"
- "Define testing approach for project"
- "Test plan with risk assessment"
- "Comprehensive QA strategy"

## Output Sections

Every test strategy document includes:

| Section | Content |
| ------- | ------- |
| **Test Scope & Objectives** | In-scope/out-of-scope, measurable goals, success criteria |
| **Testing Types Breakdown & Rationale** | Unit, integration, E2E, performance, security, accessibility, etc. — with rationale for each |
| **Environment Requirements** | Dev, staging, prod parity, data, tooling |
| **Risk Assessment Matrix** | Technical, business, process risks with probability/impact and mitigations |
| **Entry/Exit Criteria** | Conditions to start and complete testing at each level |
| **Resource & Timeline Estimation** | Roles, effort, schedule, dependencies |
| **Defect Management Process** | Triage, severity, workflow, escalation |
| **Definition of Done/Ready** | DoD for stories; DoR for sprint readiness |
| **Test Data Strategy** | Sources, masking, refresh, synthetic data |
| **CI/CD Integration Strategy** | Pipeline gates, automation triggers, reporting |

## Testing Pyramid Guidance

Apply the testing pyramid principle for balanced coverage:

| Layer | Ratio (typical) | Focus |
| ----- | ----------------- | ----- |
| **Unit** | 70% | Fast, isolated, high volume |
| **Integration** | 20% | Component interactions, APIs |
| **E2E** | 10% | Critical user journeys, smoke |

Reference `references/testing-types.md` for detailed type descriptions and when to apply each.

## Risk-Based Test Prioritization

1. **Identify risks** — Technical, business, process (see `references/risk-matrix.md`)
2. **Score** — Probability × Impact = Risk score
3. **Prioritize** — High-risk areas get more coverage and earlier testing
4. **Mitigate** — Allocate exploratory, security, performance tests to high-risk zones

## Integration with Other Skills

| Need | Skill | Usage |
| ---- | ----- | ----- |
| Gantt charts, timelines | qa-diagram-generator | `references/gantt.md` for schedule visualization |
| Mind maps, flowcharts | qa-diagram-generator | `references/mindmap.md`, `references/flowchart.md` for scope/process |
| Detailed sub-plans | qa-plan-creator | Test plan, sprint plan, regression plan, performance plan |
| NFR analysis | qa-nfr-analyst | Performance, security, usability requirements |

## Workflow

1. **Input:** Project context (scope, tech stack, timeline, constraints)
2. **Scope:** Define in/out boundaries and objectives
3. **Types:** Select testing types from `references/testing-types.md` with rationale
4. **Pyramid:** Apply unit > integration > E2E ratios
5. **Risk:** Populate risk matrix from `references/risk-matrix.md`
6. **Criteria:** Apply entry/exit from `references/entry-exit-criteria.md`
7. **Visuals:** Call qa-diagram-generator for Gantt, mind maps, flowcharts
8. **Sub-plans:** Call qa-plan-creator for detailed test/sprint/regression plans
9. **Output:** Complete test strategy document

## Scope

**Can do (autonomous):**
- Generate full test strategy documents from project context
- Populate all 10 output sections
- Apply testing pyramid ratios and risk-based prioritization
- Call qa-diagram-generator for Gantt, mind maps, flowcharts
- Call qa-plan-creator for detailed sub-plans
- Reference testing-types, risk-matrix, entry-exit-criteria

**Cannot do (requires confirmation):**
- Change project scope or release dates set by stakeholders
- Override organizational test policy or standards
- Assign resources without approval

**Will not do (out of scope):**
- Execute tests or automation
- Modify production code or environments
- Approve strategy (approval is stakeholder responsibility)

## Quality Checklist

- [ ] All 10 output sections present and populated
- [ ] Test scope clearly defines in/out boundaries
- [ ] Testing types include rationale (why each type)
- [ ] Pyramid ratios applied (unit > integration > E2E)
- [ ] Risk matrix populated with mitigations
- [ ] Entry/exit criteria are testable and level-specific
- [ ] Resource/timeline estimates are realistic
- [ ] Diagrams generated for schedule/scope (Gantt, mind map)
- [ ] References to qa-diagram-generator and qa-plan-creator correct
- [ ] No hardcoded secrets

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Strategy too generic | Insufficient context | Ask for scope, tech stack, timeline, team size |
| Missing diagrams | qa-diagram-generator not invoked | Explicitly call for Gantt, mind map, flowchart |
| Wrong testing types | Project type unclear | Clarify web/mobile/API/embedded; use testing-types reference |
| Risk matrix empty | No risk input | Prompt for known risks; use risk-matrix template |
| Entry/exit vague | Subjective language | Use entry-exit-criteria reference; make criteria measurable |
| Pyramid inverted | E2E-heavy approach | Recommend rebalancing; explain pyramid rationale |
| Duplicate content | Overlap with qa-plan-creator | Strategy = high-level; plan = detailed; delegate sub-plans |

## Reference Files

| Topic | Reference |
| ----- | --------- |
| Testing types | `references/testing-types.md` |
| Risk assessment | `references/risk-matrix.md` |
| Entry/exit criteria | `references/entry-exit-criteria.md` |
