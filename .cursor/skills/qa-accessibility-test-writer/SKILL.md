---
name: qa-accessibility-test-writer
description: Generate accessibility tests for WCAG 2.2 compliance using axe-core, Pa11y, and Lighthouse with automated checks for ARIA patterns, keyboard navigation, color contrast, and screen reader support.
output_dir: tests/accessibility
---

# QA Accessibility Test Writer

## Purpose

Write accessibility tests ensuring WCAG 2.2 compliance. Transform NFR accessibility criteria (from qa-nfr-analyst) and application context into executable accessibility test scripts using axe-core, Pa11y, and Lighthouse. Support automated checks for ARIA patterns, keyboard navigation, focus management, color contrast, text alternatives, semantic HTML, form labels, skip links, responsive text sizing, and screen reader compatibility.

## Trigger Phrases

- "Write accessibility tests for [app/page]"
- "Generate WCAG 2.2 compliance tests"
- "Create axe-core tests for [framework]"
- "Accessibility tests for keyboard navigation"
- "ARIA and color contrast tests"
- "Pa11y/Lighthouse accessibility audit setup"
- "Screen reader compatibility tests"
- "Accessibility test scripts from NFR analysis"

## WCAG 2.2 Levels

| Level | Description | Typical Use |
|-------|--------------|-------------|
| **A** | Minimum; required for basic accessibility | Legal baseline |
| **AA** | Standard target; addresses major barriers | Most projects |
| **AAA** | Enhanced; highest conformance | Specialized contexts |

See `references/wcag-tests.md` for test scenarios per success criteria with code examples.

## Tools

| Tool | Purpose |
|------|---------|
| **axe-core** | Programmatic WCAG checks; integrates with Playwright, Cypress, Jest |
| **Pa11y** | CLI + Node API; batch page audits, CI integration |
| **Lighthouse** | Chrome DevTools Protocol; full accessibility audit with scores |

## Test Categories

| Category | Techniques | Tools |
|----------|-------------|-------|
| **ARIA patterns** | Roles, states, properties, live regions | axe-core |
| **Keyboard navigation** | Tab order, focus traps, shortcuts | Playwright/Cypress |
| **Focus management** | Visible focus, focus order, skip links | axe-core, custom |
| **Color contrast** | 4.5:1 (normal), 3:1 (large) | axe-core, Lighthouse |
| **Text alternatives** | Alt text, aria-label, captions | axe-core |
| **Semantic HTML** | Headings, landmarks, lists | axe-core |
| **Form labels** | Labels, error identification, autocomplete | axe-core, custom |
| **Skip links** | Bypass blocks (2.4.1) | axe-core, custom |
| **Responsive text sizing** | 200% resize, reflow | Lighthouse, custom |
| **Screen reader compatibility** | Name, role, value (4.1.2) | axe-core, manual |

## Workflow

1. **Read NFR analysis** — From qa-nfr-analyst; extract WCAG criteria and target level (A/AA/AAA)
2. **Map WCAG success criteria** — Align requirements to testable checkpoints (see `references/wcag-tests.md`)
3. **Generate accessibility test scripts** — Playwright + @axe-core/playwright, Cypress + cypress-axe, Jest + jest-axe
4. **Configure tools** — axe-core rules, Pa11y config, Lighthouse thresholds
5. **Run audits** — Execute tests; produce audit reports and WCAG compliance matrix

## Integration

| Framework | Package | Usage |
|-----------|---------|-------|
| **Playwright** | @axe-core/playwright | `await expect(page).toPassAxe()` or `axe.run(page)` |
| **Cypress** | cypress-axe | `cy.injectAxe(); cy.checkA11y()` |
| **Jest** | jest-axe | `expect(container).toHaveNoViolations()` (React Testing Library) |

See `references/axe-core-patterns.md` for integration patterns and examples.

## Output

- **Accessibility test scripts** — `tests/accessibility/` or `e2e/a11y/` with TS/JS files
- **Audit reports** — JSON/HTML summaries of violations, impact, remediation
- **WCAG compliance matrix** — Mapping of success criteria to pass/fail status

## References

- `references/wcag-tests.md` — WCAG 2.2 test scenarios per success criteria with code examples
- `references/axe-core-patterns.md` — axe-core integration patterns for Playwright, Cypress, Jest
- `references/best-practices.md` — Automated vs manual, screen reader testing, keyboard testing

## Scope

**Can do (autonomous):**
- Generate accessibility test scripts from NFR analysis or WCAG criteria
- Create axe-core/Pa11y/Lighthouse configurations
- Write Playwright, Cypress, or Jest accessibility tests
- Map WCAG 2.2 success criteria to test cases
- Call qa-nfr-analyst for WCAG criteria when needed
- Use qa-diagram-generator for accessibility flow diagrams

**Cannot do (requires confirmation):**
- Add dependencies not in package.json
- Override project accessibility target level (A/AA/AAA)
- Change WCAG conformance scope without approval

**Will not do (out of scope):**
- Execute tests (user runs them)
- Perform manual screen reader testing (provide guidance only)
- Implement accessibility fixes in application code

## Quality Checklist

- [ ] Tests cover WCAG 2.2 criteria relevant to the application
- [ ] Target level (A/AA/AAA) specified and rules configured accordingly
- [ ] axe-core rules/tags aligned with WCAG level (wcag2a, wcag2aa, wcag2aaa)
- [ ] Keyboard navigation tests for interactive components
- [ ] Focus visible and focus order verified where applicable
- [ ] File naming follows `*.a11y.spec.ts` or `test_*_accessibility.ts`
- [ ] References to WCAG success criterion IDs where applicable
- [ ] Audit report includes impact, description, and remediation guidance

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| axe-core reports no violations but page is inaccessible | Dynamic content not loaded, shadow DOM | Wait for content; use `include` for shadow roots |
| False positives (decorative images) | axe flags alt="" on img | Use `aria-hidden="true"` or `role="presentation"` for decorative |
| Pa11y timeout | Slow page load, SPA | Increase timeout; wait for network idle |
| Lighthouse score inconsistent | Network variance, animations | Run multiple times; use median; disable animations |
| Keyboard test fails (focus not visible) | Custom focus styles missing | Add `:focus-visible` styles; verify in test |
| cypress-axe "injectAxe" fails | Page not ready | Call `cy.injectAxe()` after `cy.visit` and content load |
