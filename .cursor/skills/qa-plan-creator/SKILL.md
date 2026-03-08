---
name: qa-plan-creator
description: Universal QA plan generator supporting 10 plan types including test plans, sprint plans, regression plans, release plans, UAT plans, performance plans, migration plans, onboarding plans, and custom plans.
output_dir: docs/plans
dependencies:
  recommended:
    - qa-diagram-generator
---

# QA Plan Creator

## Purpose

Generate any type of QA planning document. Supports 10 plan types with consistent structure, Gantt timelines, and integration with other QA skills for accelerated onboarding and execution.

## Trigger Phrases

- "Create a test plan" / "Generate test plan for [project]"
- "Sprint test plan" / "Sprint plan for [sprint N]"
- "Regression plan" / "Regression testing plan"
- "Release test plan" / "Release readiness plan"
- "UAT plan" / "User acceptance testing plan"
- "Performance test plan" / "Load test plan"
- "Migration test plan" / "Data migration test plan"
- "QA onboarding plan" / "Onboard new QA engineer"
- "QA introduction plan" / "Project overview for QA"
- "Custom plan from [description]"

## Plan Types

| Plan Type | Description |
| --------- | ----------- |
| **Test Plan** | Master test plan covering full project scope per ISO 29119-3 |
| **Sprint Test Plan** | Sprint-scoped test plan for Agile iterations |
| **Regression Plan** | Regression testing scope, scope selection, and execution strategy |
| **Release Test Plan** | Release readiness criteria, sign-off gates, deployment validation |
| **UAT Plan** | User acceptance testing with business scenarios and acceptance criteria |
| **Performance Test Plan** | Load profiles, SLAs, thresholds, environments, tools |
| **Migration Test Plan** | Data validation, rollback strategy, compatibility matrix |
| **QA Onboarding Plan** | Week/month plan for new QA engineer joining project |
| **QA Introduction Plan** | Project overview: tools, frameworks, phases, timelines, team |
| **Custom Plan** | Free-form plan from user description |

## Output Structure

Every plan type includes these sections:
- **Scope** — In-scope and out-of-scope items
- **Objectives** — Clear, measurable goals
- **Strategy** — Approach, techniques, tools
- **Schedule** — Phases, milestones, timeline (auto-includes Gantt via qa-diagram-generator)
- **Resources** — Roles, responsibilities, staffing
- **Risks** — Identified risks and mitigations
- **Deliverables** — Artifacts to produce
- **Approval Criteria** — Entry/exit criteria, sign-off gates

## QA Onboarding Plan Example (Skills Integration)

Accelerated onboarding using QA skills ecosystem:

| Phase | Activities | Skills Used |
| ----- | ---------- | ----------- |
| **Day 1-2** | Environment setup, tools access | `qa-environment-checker` |
| **Day 3-5** | Documentation generation, codebase familiarity | `qa-requirements-generator` (from-code, from-url) |
| **Week 2** | Test case generation, first reviews | `qa-testcase-from-docs`, `qa-testcase-from-ui` |
| **Week 3** | First automation, CI/CD setup | Phase 3 skills (Playwright, API, etc.) |
| **Week 4** | Independent testing, coverage analysis | Coverage tools, bug reporting |

Without skills: same steps typically take 2-3 months. With skills: ~1 month.

## Embedding: Diagram Generator

Auto-include Gantt timelines for all plans. Reference qa-diagram-generator:
- **Timelines** → `references/gantt.md` (Mermaid `gantt` syntax)
- **Phase flow** → `references/flowchart.md`
- **Resource allocation** → `references/mindmap.md`

## Workflow

1. **Input:** Plan type + context (project name, scope, dates, constraints)
2. **Template selection:** Load appropriate reference from `references/`
3. **Content generation:** Fill sections per plan type
4. **Gantt:** Generate timeline diagram via qa-diagram-generator
5. **Output:** Complete plan document with embedded diagram

## Scope

**Can do (autonomous):**
- Generate any of the 10 plan types from user input
- Populate all standard sections (Scope, Objectives, Strategy, Schedule, Resources, Risks, Deliverables, Approval criteria)
- Call qa-diagram-generator for Gantt charts and phase diagrams
- Reference other QA skills in onboarding/introduction plans
- Adapt templates to project context

**Cannot do (requires confirmation):**
- Change project scope or release dates set by stakeholders
- Assign resources without approval
- Override organizational test policy

**Will not do (out of scope):**
- Execute tests or automation
- Modify production code or environments
- Approve plans (approval is stakeholder responsibility)

## Quality Checklist

- [ ] Plan type matches user request
- [ ] All 8 output sections present and populated
- [ ] Scope clearly defines in/out boundaries
- [ ] Objectives are measurable (SMART)
- [ ] Schedule includes phases and milestones
- [ ] Gantt diagram generated for timeline visualization
- [ ] Risks have mitigations
- [ ] Approval criteria are testable
- [ ] References to other skills correct (onboarding/introduction plans)

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Plan too generic | Insufficient context provided | Ask for project name, scope, dates, team size |
| Missing Gantt | qa-diagram-generator not invoked | Explicitly call for Gantt with phase dates |
| Wrong plan type | Ambiguous user request | Clarify: "test plan" vs "sprint plan" vs "release plan" |
| Onboarding too long | Not using skills integration | Add skills references to accelerate phases |
| Approval criteria vague | Subjective language | Replace with measurable exit conditions |
| Duplicate sections | Template overlap | Use plan-type-specific reference template |

## Reference Templates

| Plan Type | Reference File |
| --------- | -------------- |
| Test Plan | `references/test-plan.md` |
| Sprint Plan | `references/sprint-plan.md` |
| Regression Plan | `references/regression-plan.md` |
| Release Plan | `references/release-plan.md` |
| UAT Plan | `references/uat-plan.md` |
| Performance Plan | `references/performance-plan.md` |
| Migration Plan | `references/migration-plan.md` |
| Onboarding Plan | `references/onboarding-plan.md` |
| Introduction Plan | `references/introduction-plan.md` |
