# System Patterns: QA Agent Skills Ecosystem

## Architecture Overview

The ecosystem uses consistent patterns across skills for maintainability, discoverability, and composability.

## Progressive Loading (3 Levels)

Skills avoid information overload by loading content progressively:

| Level | Location | Content |
|-------|----------|---------|
| 1 | `SKILL.md` | Core instructions, triggers, autonomy levels (< 500 lines) |
| 2 | `references/{topic}.md` | Detailed techniques, examples |
| 3 | External | Standards docs, framework docs |

**Rule:** SKILL.md stays concise; deep dives live in references.

## Embeddable Service Pattern

**Example:** Diagram generator

- Diagram-generator skill is **embeddable** — other skills reference its patterns
- Skills can invoke diagram generation as a sub-task
- Promotes reuse without tight coupling

## Dual-Use Pattern

**Example:** Task creator

- **Standalone:** Task creator works independently for ad-hoc test planning
- **Paired:** Task creator + bug-ticket-creator form a handoff chain
- Same skill, different orchestration contexts

## Record / Generate / Heal Modes (Playwright Writers)

Playwright-focused test-writing skills support three modes:

| Mode | Purpose |
|------|---------|
| **Record** | Live browser capture → generate test code |
| **Generate** | Spec-driven generation from requirements/specs |
| **Heal** | Auto-fix broken selectors and assertions |

Test healer skill complements writers by repairing flaky or broken tests.

## Formalized Handoff Chains

Orchestration skills use explicit handoff contracts:

- **Output format** — structured, parseable (e.g., JSON, markdown tables)
- **Input expectations** — what downstream skills require
- **Validation** — quality checklist before handoff

Enables reliable multi-skill workflows (e.g., design → write → report).

## Decision Autonomy Levels

Every skill declares what it can, cannot, and will not do:

| Level | Meaning |
|-------|---------|
| **Can do** | Performs without confirmation |
| **Cannot do** | Outside scope; suggests alternatives |
| **Will not do** | Policy/explicit refusal (e.g., security-sensitive actions) |

Reduces ambiguity and improves agent behavior predictability.

## Key Pattern Summary

```
Progressive Loading → SKILL.md + references
Embeddable Services → Diagram generator, shared utilities
Dual-Use → Standalone + paired (task-creator)
Playwright Modes → Record | Generate | Heal
Handoff Chains → Formalized outputs for orchestration
Autonomy Levels → Can / Cannot / Will not
```
