---
name: qa-diagram-generator
description: Universal diagram generator supporting 14 Mermaid diagram types. Works standalone or as an embedded service for other QA skills.
output_dir: docs/diagrams
---

# QA Diagram Generator

## Purpose

Universal diagram generator for the QA skills ecosystem. Works in two modes:
- **Standalone:** User directly asks for a diagram (e.g., "create a flowchart for the login test process")
- **Embedded:** Other QA skills invoke this skill's patterns when they need visualizations

## Trigger Phrases

- "Draw a flowchart for [process/flow]"
- "Create a sequence diagram for [API/auth flow]"
- "Generate a Mermaid diagram from [description/screenshot]"
- "Visualize the [test process/architecture/data model]"
- "Diagram from screenshot" / "Create diagram from this image"
- "State diagram for [bug lifecycle/test case states]"
- "Gantt chart for [test schedule/sprint plan]"
- "ER diagram for [test data model]"
- "Mind map for [test coverage/feature decomposition]"
- "C4 diagram for [system architecture]"
- "User journey for [E2E scenario]"
- "Pie chart / quadrant chart for [results/risk matrix]"

## Dual-Use Pattern

| Mode | Trigger | Output |
|------|---------|--------|
| **Standalone** | User: "Draw a sequence diagram for API auth flow" | Full Mermaid diagram + explanation |
| **Embedded** | qa-spec-writer needs state diagram for spec | Reference `references/state-diagram.md` + generate inline |

When embedded, the calling skill references the appropriate `references/*.md` file and generates Mermaid code following those patterns.

## Input Sources

- **Text description** — User or skill describes the flow/structure
- **Screenshot/image analysis** — UI, architecture diagrams, whiteboards → appropriate diagram type
- **Existing documentation** — Extract structure from specs, requirements, test plans
- **Code analysis** — Infer from code structure (classes, flows, state machines)

## Supported Diagram Types

| Type | Use Cases | Mermaid Syntax | Reference |
|------|-----------|----------------|-----------|
| **Flowchart** | Test process flows, decision trees, regression flow | `flowchart` | `references/flowchart.md` |
| **Sequence Diagram** | API interactions, login flow, test execution flow | `sequenceDiagram` | `references/sequence.md` |
| **Class Diagram** | Test architecture, Page Object Model | `classDiagram` | `references/class-diagram.md` |
| **State Diagram** | Bug lifecycle, test case states, user session states | `stateDiagram-v2` | `references/state-diagram.md` |
| **ER Diagram** | Test data models, database schemas | `erDiagram` | `references/er-diagram.md` |
| **Mind Map** | Test coverage mapping, feature decomposition | `mindmap` | `references/mindmap.md` |
| **Gantt Chart** | Test schedules, sprint planning, release timelines | `gantt` | `references/gantt.md` |
| **C4 Model** | System architecture (context/container/component) | `C4Context`, `C4Container`, `C4Component` | `references/c4-model.md` |
| **User Journey** | User experience testing flows, E2E scenarios | `journey` | `references/journey.md` |
| **Pie Chart** | Test result distribution, coverage breakdown | `pie` | `references/charts.md` |
| **Quadrant Chart** | Risk matrix, priority vs effort, impact vs likelihood | `quadrantChart` | `references/charts.md` |
| **Git Graph** | Branch strategy, release flow, merge workflows | `gitGraph` | `references/flowchart.md` (see note) |
| **Block Diagram** | System components, data flow blocks | `block-beta` | `references/flowchart.md` |
| **BPMN** | Business process flows, approval workflows | `bpmn` | `references/flowchart.md` |

## Embedding Pattern for Other Skills

When another skill needs a diagram, reference the appropriate file:

| Visualization Need | Reference | Example |
|--------------------|-----------|---------|
| State machines, lifecycle | `references/state-diagram.md` | Bug lifecycle, test case states |
| API flows, interactions | `references/sequence.md` | Login flow, API contract validation |
| Decision logic, process flow | `references/flowchart.md` | Test process, regression flow |
| Timelines, schedules | `references/gantt.md` | Sprint plan, release schedule |
| Architecture layers | `references/c4-model.md` | System context, container diagram |
| Test data structure | `references/er-diagram.md` | Test DB schema, fixture models |
| Coverage/feature breakdown | `references/mindmap.md` | Test coverage map, feature tree |
| User flows, E2E scenarios | `references/journey.md` | UAT journey, UX test flow |
| Result distribution, risk | `references/charts.md` | Pass/fail pie, risk quadrant |
| From screenshot/image | `references/from-screenshot.md` | UI → flowchart, whiteboard → diagram |

## Workflow

1. **Input:** Determine source (text, screenshot, doc, code)
2. **Diagram type:** Select from 14 types based on content and purpose
3. **Generate:** Produce valid Mermaid syntax per reference patterns
4. **Output:** Markdown with fenced Mermaid block, ready for rendering

## Scope

**Can do (autonomous):**
- Generate any of the 14 diagram types from description
- Infer diagram type from content when not specified
- Produce valid Mermaid syntax per reference guides
- Support embedded invocation from other skills
- Analyze screenshots/images to suggest diagram type and content

**Cannot do (requires confirmation):**
- Render diagrams (output is Mermaid source only)
- Modify source documents or code
- Choose diagram type that contradicts user intent

**Will not do (out of scope):**
- Non-Mermaid diagram formats (PlantUML, etc.) unless explicitly requested
- Hand-drawn or raster image output

## Quality Checklist

- [ ] Diagram type matches content and purpose
- [ ] Mermaid syntax is valid (no parse errors)
- [ ] Labels and nodes are descriptive and QA-relevant
- [ ] Diagram fits intended audience (technical vs business)
- [ ] No sensitive data in labels
- [ ] Reference file patterns followed when embedded

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Mermaid parse error | Invalid syntax, reserved keywords | Check reference syntax; escape special chars |
| Wrong diagram type | Ambiguous input | Ask user or infer from dominant structure (flow vs state vs sequence) |
| Too complex | Too many nodes/edges | Split into multiple diagrams or simplify |
| Embedded skill gets wrong ref | Mismatch between need and ref | Use embedding table to map visualization need → reference |
| Screenshot analysis fails | Low quality or non-diagram image | Fall back to text description; ask user to describe |
| C4/ER syntax errors | Mermaid version differences | Use standard syntax from references; avoid experimental features |
