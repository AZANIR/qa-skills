---
name: qa-requirements-generator
description: Extract and normalize requirements from any source (URL, Figma, code, description) into structured specifications per ISO 29148.
output_dir: docs/requirements
dependencies:
  recommended:
    - qa-discovery-interview
---

# QA Requirements Generator

## Purpose
Extract and normalize requirements from any source into structured specification documents following ISO/IEC/IEEE 29148 standards.

## Sub-Modes (Input Sources)

### `from-url`
Navigate a live application via Playwright MCP, collect user flows, page structure, form fields, navigation paths, and generate requirements from observed behavior.

**Steps:**
1. Use Playwright MCP to navigate the provided URL
2. Capture accessibility snapshots of each page
3. Identify user flows, forms, buttons, navigation elements
4. Extract validation rules, error messages, API endpoints
5. Generate requirements from observed functionality

### `from-figma`
Analyze Figma exports or UI screenshots via vision capabilities.

**Steps:**
1. Accept image paths (screenshots, Figma exports, mockups)
2. Analyze UI elements: fields, buttons, tables, modals, forms
3. Infer functional requirements from visual design
4. Map user interactions from layout and component relationships

### `from-code`
Analyze repository structure, components, API routes, models, and database schemas.

**Steps:**
1. Scan project structure (components, routes, models, services)
2. Extract API endpoints and their signatures
3. Identify data models and relationships
4. Derive requirements from existing implementation

### `from-description`
Transform text descriptions from PM/developer/stakeholder into structured requirements.

**Steps:**
1. Parse natural language input
2. Identify actors, actions, and outcomes
3. Decompose into atomic requirements
4. Add acceptance criteria (Given/When/Then)

### `full-audit`
Combine all sources for comprehensive requirement extraction.

## Output Format

Requirements document following ISO 29148 SRS structure. See `references/iso-29148-structure.md` for full section descriptions.

### Document Structure
```
1. Introduction
   1.1 Purpose
   1.2 Scope
   1.3 Definitions
2. Overall Description
   2.1 Product Perspective
   2.2 User Classes and Characteristics
   2.3 Operating Environment
3. Functional Requirements
   [REQ-FN-001] ...
4. Non-Functional Requirements
   [REQ-NFR-001] ...
5. External Interface Requirements
6. Constraints
7. Dependencies
```

### Requirement Format
Each requirement MUST include:
- **ID:** `[REQ-{type}-{number}]` (e.g., REQ-FN-001)
- **Title:** Short descriptive title
- **Description:** Clear, unambiguous statement
- **Priority:** Critical / High / Medium / Low
- **Acceptance Criteria:** Given/When/Then format
- **Source:** URL / Figma / Code / Description
- **Dependencies:** Links to related requirements
- **Status:** Draft / Reviewed / Approved

### User Story Format
```
As a [user role]
I want to [action]
So that [benefit]

Acceptance Criteria:
Given [precondition]
When [action]
Then [expected outcome]
```

## Scope

**Can do (autonomous):**
- Generate requirements from any supported input source
- Create user stories with acceptance criteria
- Assign requirement IDs and priorities
- Build dependency graphs between requirements
- Call qa-diagram-generator for flow diagrams

**Cannot do (requires confirmation):**
- Modify existing approved requirements
- Change requirement priorities set by stakeholders
- Delete requirements from registry

**Will not do (out of scope):**
- Implement features described in requirements
- Deploy or modify production systems
- Make business decisions about scope

## MCP Tools Used
- **Playwright MCP:** For `from-url` mode (navigate, screenshot, accessibility snapshot)
- **Sequential Thinking MCP:** For complex requirement decomposition
- **Filesystem MCP:** For reading codebase in `from-code` mode

## Embedding: Diagram Generator
When visualization is needed, reference qa-diagram-generator:
- User flows → `references/flowchart.md`
- API interactions → `references/sequence.md`
- Data models → `references/er-diagram.md`

## Requirement Patterns
See `references/requirement-patterns.md` for templates: CRUD, auth, search/filter, notifications, file upload, pagination, error handling.

## Quality Checklist
- [ ] Every requirement has a unique ID
- [ ] No ambiguous language (avoid: "should", "may", "might")
- [ ] All requirements are testable (measurable acceptance criteria)
- [ ] Dependencies are explicitly linked
- [ ] Priority is assigned based on business value
- [ ] Traceability links to source material
- [ ] No duplicate or conflicting requirements

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Empty requirements from URL | Page requires authentication | Provide login credentials, use Playwright to authenticate first |
| Vague requirements generated | Input description too brief | Ask for more detail, use multiple sub-modes |
| Missing non-functional requirements | Only functional analysis done | Run qa-nfr-analyst separately or use full-audit mode |
| Duplicate requirements | Multiple sources overlap | Run deduplication pass, merge by intent |
