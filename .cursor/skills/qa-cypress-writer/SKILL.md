---
name: qa-cypress-writer
description: Generate Cypress E2E and component tests for TypeScript with time-travel debugging, cy.intercept for network mocking, and component testing via cy.mount.
output_dir: tests/e2e
---

# QA Cypress Writer

## Purpose

Write Cypress E2E and component tests from test case specifications. Transform structured test cases into executable TypeScript test files with proper selectors, network mocking, and component isolation.

## Trigger Phrases

- "Write Cypress tests for [feature/page]"
- "Generate Cypress E2E tests from test cases"
- "Create Cypress component tests for [component]"
- "Add Cypress tests with cy.intercept for [API]"
- "Cypress tests with cy.mount for [React/Vue component]"
- "Cypress E2E test file for [flow]"
- "Cypress custom commands for [login/fillForm]"

## Test Types

| Type | Scope | When to Use |
|------|-------|-------------|
| **E2E** | Full user flows, page navigation | Critical paths, user journeys |
| **Component** | Isolated UI components | React/Vue/Angular/Svelte components |

## Workflow

1. **Read test cases** — From Phase 2 (qa-testcase-from-docs, qa-manual-test-designer, qa-browser-data-collector)
2. **Analyze target** — Page structure, API endpoints, component props/events
3. **Generate test files** — Create `*.cy.ts` in `cypress/e2e/` or `cypress/component/`
4. **Add intercepts/fixtures** — `cy.intercept()`, `cy.fixture()` for network control
5. **Verify selectors** — Prefer `data-cy` attributes; avoid brittle CSS

## Context7 MCP

Uses Context7 MCP to fetch current Cypress documentation when needed. Query for Cypress API, commands, or configuration when patterns are unclear.

## E2E Testing

- **Navigation:** `cy.visit()`, `cy.go()`, `cy.reload()`
- **Queries:** `cy.get()`, `cy.contains()`, `cy.find()` — chainable, retry-able
- **Actions:** `cy.click()`, `cy.type()`, `cy.clear()`, `cy.select()`, `cy.check()`
- **Chained commands** — Each command retries until timeout; enables time-travel debugging
- **Retry-ability** — Cypress automatically retries assertions and queries

## Component Testing

- **cy.mount()** — Mount React/Vue/Angular/Svelte components in isolation
- **Props/events/slots** — Test component behavior without full app
- **Dev server** — Uses `component.devServer` in config (Vite, Webpack, etc.)

## Network Mocking

- **cy.intercept()** — Stub, spy, or wait for HTTP requests
- **Fixtures** — `cy.fixture()` for response data; `cy.intercept('GET', '/api/users', { fixture: 'users.json' })`
- **Aliases** — `cy.intercept('GET', '/api/users').as('getUsers')`; `cy.wait('@getUsers')`

## Custom Commands

- **Cypress.Commands.add()** — Reusable actions: `cy.login()`, `cy.fillForm()`, `cy.logout()`
- **Declare in cypress/support/commands.ts** — Extend Cypress namespace for TypeScript

## Key Patterns

- **Structure:** `describe` / `it`, `beforeEach` / `afterEach`
- **Auth:** `cy.session()` for login state caching (Cypress 8+)
- **Screenshots:** `cy.screenshot()` for debugging; auto on failure
- **Data attributes:** `data-cy="submit-btn"` for stable selectors
- **Assertions:** Explicit `should()` / `expect()`; avoid implicit passes

## Configuration

- **cypress.config.ts** — `baseUrl`, `viewportWidth`/`viewportHeight`, `video`, `retries`, `component.devServer`
- **Support files** — `cypress/support/e2e.ts`, `commands.ts`

See `references/config.md` for full configuration guide.

## File Naming

- `cypress/e2e/{feature}.cy.ts` — E2E tests
- `cypress/component/{Component}.cy.tsx` — Component tests

## References

- `references/patterns.md` — E2E flows, component mounting, custom commands, fixtures, aliases
- `references/assertions.md` — should, expect, assert patterns (Chai)
- `references/config.md` — cypress.config.ts, env, plugins, support files
- `references/best-practices.md` — data-cy, anti-patterns, flake prevention, CI

## Scope

**Can do (autonomous):**
- Generate Cypress E2E and component tests from test cases
- Add `cy.intercept()` for API stubbing/spying
- Create custom commands in `commands.ts`
- Use `cy.fixture()` and `cy.session()` where appropriate
- Configure `cypress.config.ts` for baseUrl, viewport, retries
- Add `data-cy` selectors in generated tests (recommend adding to app if missing)

**Cannot do (requires confirmation):**
- Modify production code to add `data-cy` attributes
- Change existing Cypress config without user approval
- Add tests for flows/components not in scope

**Will not do (out of scope):**
- Unit tests (use qa-jest-writer)
- Visual regression (use dedicated tools)
- Modify application deployment or runtime

## Quality Checklist

- [ ] No `cy.wait(ms)` — use `cy.wait('@alias')` or assertions instead
- [ ] Use `data-cy` attributes for selectors where possible
- [ ] Assertions explicit — every meaningful step has assertion
- [ ] No cross-test dependencies — tests run in any order
- [ ] Proper cleanup — no leftover state between tests
- [ ] Intercepts scoped — avoid global intercepts that leak
- [ ] Descriptive test names — "should display error when login fails"

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Element not found | Selector too brittle or timing | Use `data-cy`; ensure element exists before action; increase timeout if needed |
| cy.wait(ms) flakiness | Arbitrary delays | Replace with `cy.wait('@alias')` or `should()` assertions |
| Intercept not matching | URL/pattern mismatch | Use `cy.intercept('**/api/users*')` or exact URL; check method |
| Session not persisting | cy.session misconfigured | Ensure `cy.session()` in `beforeEach`; validate cache key |
| Component mount fails | Missing provider/wrapper | Add providers in `cy.mount(<Provider><Component /></Provider>)` |
| Cross-origin errors | Navigating to different domain | Use `cy.origin()` for cross-origin flows |
| Timeout on assertion | Element never meets condition | Verify selector; check if element is in iframe (not supported) |
