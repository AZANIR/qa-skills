# Product Context: QA Agent Skills Ecosystem

## Why This Project Exists

### The Problem

Traditional QA workflows are:

- **Manual** — repetitive tasks, copy-paste, context switching
- **Reactive** — tests written after code, documentation lagging
- **Fragmented** — tools and processes scattered across teams
- **Slow onboarding** — 2–3 months for new QA engineers to become productive

### The Solution

Transform QA from **manual/reactive** to **autonomous/proactive**:

- AI agents execute QA tasks with minimal human intervention
- Skills generate documentation, design tests, and write code
- Proactive coverage analysis and risk assessment
- Consistent, standards-aligned outputs

## Value Propositions

| Benefit | Impact |
|---------|--------|
| Reduced onboarding | 2–3 months → ~1 month |
| Consistency | Standards-based, repeatable outputs |
| Composability | Skills combine into end-to-end workflows |
| Independence | Each skill works standalone or in chains |

## Design Principles

### Skill Independence

- Each skill is self-contained and usable alone
- No mandatory dependencies between skills
- Clear inputs and outputs for composition

### Orchestrable

- Skills can be chained in formal handoff flows
- Orchestration skills coordinate multi-skill workflows
- Support for both ad-hoc and predefined sequences

### Multi-Editor Support

- **Cursor** — primary target
- **VS Code** — via compatible skill format
- **Claude Code** — planned
- **Windsurf** — planned

## User Experience Goals

- **Discoverability** — clear skill names, descriptions, trigger phrases
- **Predictability** — consistent behavior and outputs
- **Transparency** — explicit decision autonomy (can/cannot/will not do)
- **Recoverability** — troubleshooting guidance in each skill
