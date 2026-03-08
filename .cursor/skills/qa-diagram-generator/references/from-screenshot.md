# Diagram Generation from Screenshots/Images

## Overview
When the user provides a screenshot or image, analyze it to infer structure and generate an appropriate Mermaid diagram. Use vision capabilities to extract UI layout, flow, or relationships.

## Analysis Steps

1. **Identify diagram type:** UI flow → flowchart/sequence; form layout → class/ER; state transitions → state diagram; timeline → Gantt.
2. **Extract elements:** Buttons, fields, steps, screens, entities.
3. **Map relationships:** Navigation, data flow, dependencies.
4. **Generate Mermaid:** Use the matching reference (flowchart, sequence, etc.).

## Input Types

| Image Content | Diagram Type | Reference |
| ------------- | ------------ | --------- |
| Multi-step wizard, form flow | Flowchart | flowchart.md |
| Login/auth screens | Sequence | sequence.md |
| Form with fields, entities | Class/ER | class-diagram.md, er-diagram.md |
| Status badges, lifecycle | State | state-diagram.md |
| Dashboard with charts | Pie/Quadrant | charts.md |
| Calendar, timeline view | Gantt | gantt.md |

## Example: Login Screen → Sequence
Given a login screenshot with email, password, submit:
- Actors: User, Browser, API
- Steps: Enter credentials → Submit → Validate → Redirect
- Output: `references/sequence.md` pattern

## Example: Multi-Step Form → Flowchart
Given screenshots of Step 1 → Step 2 → Step 3:
- Nodes: Each step
- Edges: Next/Back/Submit
- Output: `references/flowchart.md` pattern

## When to Use
- User provides screenshot instead of text description
- Reverse-engineering UI flows for test design
- Documenting existing interfaces from visuals

## Limitations
Low-resolution or hand-drawn images may require user clarification. Fall back to asking for a text description when structure cannot be reliably inferred.

## Limitations
Low-resolution or hand-drawn images may require user clarification. Fall back to asking for a text description when structure cannot be reliably inferred.
