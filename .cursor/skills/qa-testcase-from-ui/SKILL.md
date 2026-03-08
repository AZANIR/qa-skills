---
name: qa-testcase-from-ui
description: Generate test cases from screenshots, UI mockups, and Figma exports using vision analysis to identify interactive elements and derive test scenarios.
output_dir: test-cases/from-ui
dependencies:
  recommended:
    - qa-browser-data-collector
---

# QA Test Case from UI

## Purpose

Generate UI-specific test cases from visual representations of interfaces. Use vision analysis to identify interactive elements, infer user actions, and produce structured test scenarios with visual references (element descriptions, coordinates) for manual or automated testing.

## Trigger Phrases

- "Generate test cases from this screenshot" / "Create tests from UI image"
- "Test cases from Figma export" / "Tests from mockup"
- "Analyze this wireframe and write test scenarios"
- "UI test cases from [screenshot/mockup/wireframe]"
- "Identify interactive elements and create test cases"
- "Vision-based test case generation" / "Visual UI testing scenarios"

## Input Types

| Type | Formats | Notes |
|------|---------|-------|
| **Screenshots** | PNG, JPG, WebP | Live app captures, design exports |
| **Figma exports** | PNG, SVG, PDF | Design-to-test workflow |
| **UI mockups** | PNG, JPG | Static design comps |
| **Wireframes** | PNG, PDF | Low-fidelity layouts |

## Vision Analysis Workflow

1. **Accept image paths** — User provides one or more image file paths
2. **Identify UI elements** — Detect fields, buttons, tables, modals, forms, navigation, links, icons
3. **Semantic mapping** — Infer possible user actions from context (labels, layout, conventions)
4. **Generate UI test scenarios** — Produce scenarios covering navigation, forms, validation, responsiveness, edge cases

## Test Scenario Categories

| Category | Examples |
|----------|----------|
| **Form interactions** | Input, validation, submission, reset |
| **Navigation flows** | Menu, breadcrumbs, tabs, links |
| **Modal/dialog interactions** | Open, close, confirm, cancel |
| **Table/list operations** | Sort, filter, pagination, row actions |
| **Responsive layout** | Breakpoints, overflow, touch targets |
| **Error states** | Validation messages, empty states |
| **Loading states** | Spinners, skeletons, disabled states |
| **Accessibility** | Focus order, labels, contrast |

## Output Format

Test cases include visual references for traceability:

```markdown
## TC-UI-001: Login form submission
**Visual ref:** Login form, center of screen (~50%, 40%)
**Elements:** Email input, Password input, "Sign In" button

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Enter valid email in Email field | Value accepted |
| 2 | Enter valid password | Value masked |
| 3 | Click "Sign In" | Redirect to dashboard |
```

## Scope

**Can do (autonomous):**
- Analyze provided image paths for UI elements
- Identify common patterns (forms, buttons, tables, modals, nav)
- Generate test scenarios with element descriptions
- Infer semantic actions from labels and layout
- Produce structured output (tables, Gherkin, or project format)
- Reference `references/ui-element-patterns.md` and `references/visual-analysis-guide.md`

**Cannot do (requires confirmation):**
- Access images without explicit paths
- Assume element behavior not visible in image
- Generate assertions for dynamic behavior (e.g., API responses) without context

**Will not do (out of scope):**
- Execute tests or interact with live applications
- Modify source images or designs
- Generate test code (hand off to qa-playwright-ts-writer or similar)

## Quality Checklist

- [ ] All visible interactive elements identified
- [ ] Test scenarios map to inferred user actions
- [ ] Visual references included (element descriptions, approximate location)
- [ ] Categories cover forms, navigation, modals, tables, states
- [ ] Edge cases considered (empty, invalid, loading)
- [ ] Output format matches project convention
- [ ] No assumptions about backend behavior without context

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Elements not identified | Low resolution, overlapping UI | Ask for higher-res image or zoomed crop |
| Wrong element type inferred | Ambiguous visual design | Use conservative labels; flag for review |
| Too many/too few scenarios | Scope unclear | Ask user for priority (smoke vs full coverage) |
| Coordinates inaccurate | Vision model variance | Use semantic descriptions over coordinates |
| Figma export differs from screenshot | Design vs implementation gap | Note "design intent"; suggest live capture for implementation tests |
| Non-interactive elements flagged | Decorative elements look clickable | Apply visual-analysis-guide heuristics |
