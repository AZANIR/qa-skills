---
name: qa-discovery-interview
description: QA-adapted discovery interview that transforms vague context into structured QA briefs through iterative questioning. Works standalone or as an embedded service auto-triggered by other skills when input is insufficient.
output_dir: docs/briefs
---

# QA Discovery Interview

## Purpose

QA-adapted discovery interview that transforms vague project context into a structured QA brief through iterative, category-driven questioning. Works in two modes:
- **Standalone:** User directly starts an interview for a new project or feature
- **Embedded:** Other skills auto-delegate here when their input is insufficient (<3 sentences or missing critical context)

## Trigger Phrases

- "Start QA discovery interview"
- "Interview me about the project"
- "I need to set up QA for a new project"
- "Help me define testing scope"
- "QA brief for [project/feature]"
- "What should we test?"
- "New project QA setup"

## Dual-Use Pattern

| Mode | Trigger | Output |
|------|---------|--------|
| **Standalone** | User: "Start a QA discovery interview for our payment system" | Full QA Discovery Brief |
| **Embedded** | qa-requirements-generator receives <3 sentences of input | Notify user → offer interview → feed brief back to calling skill |

### Embedding Pattern for Other Skills

When another skill detects insufficient input:

1. Notify user: "Not enough context for quality output."
2. Offer: "I can run a QA discovery interview, or you can provide more details manually."
3. If interview chosen → run interview → feed QA Brief output back into the calling skill.

Skills that auto-trigger this interview:
- `qa-requirements-generator` (from-description mode with <3 sentences)
- `qa-spec-writer` (ambiguous requirements or incomplete acceptance criteria)
- `qa-plan-creator` (no requirements, no codebase, no prior docs)
- `qa-test-strategy` (first run on a project with no existing docs)
- `qa-orchestrator` (full-cycle pipeline with no existing QA documentation)

## Interview Phases

| Phase | Name | Description |
|-------|------|-------------|
| 1 | **Initial QA Orientation** | 2-3 broad questions: what are we testing, who are stakeholders, new or existing project |
| 2 | **Category Deep Dive** | 8 QA categories, 2-4 questions each (see `references/qa-categories.md`) |
| 3 | **Research Loops** | When uncertainty detected — research codebase/docs, return with informed questions |
| 4 | **Conflict Resolution** | Resolve priority conflicts, scope creep, unrealistic expectations |
| 5 | **Completeness Check** | QA-specific checklist before generating output (see `references/completeness-checklist.md`) |
| 6 | **QA Brief Generation** | Structured document that feeds Phase 1 skills |

## Workflow

### Phase 1: Initial QA Orientation (2-3 questions)

Start with broad orientation to establish context:

1. "What product/feature are we testing? Give me a brief overview."
2. "Is this a new project, an existing one, or a migration? What's the current state?"
3. "Who are the key stakeholders, and what are their quality expectations?"

Based on answers, determine which of the 8 categories need deepest exploration.

### Phase 2: Category Deep Dive

Work through 8 QA categories adaptively. Skip or abbreviate categories where context is already clear. Spend more time on gaps and risk areas.

See `references/qa-categories.md` for full question sets per category.

**Category summary:**

| Cat | Name | Focus |
|-----|------|-------|
| A | Problem & Product | Business context, impact of defects |
| B | Testing Scope & Objectives | Testing types needed, in/out scope |
| C | User Flows & Critical Paths | Core scenarios, happy/unhappy paths |
| D | Technical Landscape | Stack, architecture, constraints, APIs |
| E | Existing QA Processes | Current CI/CD, automation, tools |
| F | Risk Areas & Priorities | Defect-prone areas, business criticality |
| G | Team, Tools & Infrastructure | Team expertise, environments, tools |
| H | Compliance & Standards | WCAG, OWASP, ISO, GDPR, industry |

**Adaptive behavior:**
- Ask 2-4 questions per category (not all at once — batch by relevance)
- After each answer, decide: go deeper, move to next category, or trigger research loop
- When answer reveals uncertainty: pause, research (read code, docs, URLs), return with informed follow-up

### Phase 3: Research Loops

When the interviewee mentions something that requires verification:

1. Read codebase (project structure, API routes, test files, configs)
2. Navigate URLs via Playwright MCP (if a live app exists)
3. Read documentation files in the project
4. Return with specific, informed follow-up questions

### Phase 4: Conflict Resolution

Identify and resolve conflicts in stated requirements:

- Scope vs timeline conflicts ("we want full coverage in 2 days")
- Priority misalignment (everything is "critical")
- Unrealistic automation expectations
- Missing infrastructure for stated testing types

See `references/conflict-patterns.md` for common patterns and resolution strategies.

### Phase 5: Completeness Check

Before generating the brief, verify all critical areas are covered. See `references/completeness-checklist.md`.

### Phase 6: QA Brief Generation

Generate the structured QA Discovery Brief using `templates/qa-brief-template.md`.

## Output

**QA Discovery Brief** (markdown) — the primary handoff document. Contains:
- Project/product overview
- Testing scope and objectives
- Critical user flows and scenarios
- Technical constraints and environment
- Risk assessment and priorities
- Compliance requirements
- Recommended testing types and approach
- Team and infrastructure summary

This brief feeds directly into: `qa-requirements-generator`, `qa-spec-writer`, `qa-plan-creator`, `qa-test-strategy`.

## MCP Tools Used

- **Sequential Thinking MCP:** Structured reasoning during deep dive and conflict resolution
- **Playwright MCP:** Research loops — navigate live app to verify answers
- **Filesystem MCP:** Research loops — read codebase, docs, configs
- **Memory MCP:** Persist interview state for multi-session interviews

## Scope

**Can do (autonomous):**
- Conduct full discovery interview through all 6 phases
- Adapt question depth based on answers
- Research codebase and live app during interview
- Generate structured QA Discovery Brief
- Serve as embedded service for other skills

**Cannot do (requires confirmation):**
- Make scope decisions on behalf of stakeholders
- Set final priorities without stakeholder input
- Skip categories the user explicitly wants to discuss

**Will not do (out of scope):**
- Write test code or create test cases (hand off to downstream skills)
- Modify production systems
- Make business decisions about product direction

## Quality Checklist

- [ ] All 8 QA categories addressed (or explicitly marked N/A with rationale)
- [ ] Critical user flows identified and documented
- [ ] Risk areas ranked by business impact
- [ ] Technical stack and constraints captured
- [ ] Testing type recommendations align with project context
- [ ] Compliance requirements identified (or confirmed none apply)
- [ ] No ambiguous or conflicting statements in final brief
- [ ] Brief is sufficient for downstream skills to operate without additional input

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Interview feels too long | Too many categories explored in depth | Adapt: skip/abbreviate clear categories, focus on gaps |
| Interviewee gives vague answers | Unclear questions or unfamiliar domain | Rephrase with concrete examples; offer multiple-choice options |
| Conflicting priorities discovered | Stakeholder misalignment | Enter Phase 4: present conflicts explicitly, ask for resolution |
| Research loop finds no codebase | New project, no code yet | Skip code research, focus on specs/mockups/descriptions |
| Embedded trigger too aggressive | Skill triggers interview on minimal input | Check threshold: <3 sentences AND missing critical context (both conditions) |
| Brief too shallow for downstream | Rushed interview or skipped categories | Re-run completeness check, fill gaps with follow-up questions |
