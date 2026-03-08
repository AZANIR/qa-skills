---
name: qa-codeceptjs-writer
description: Generate CodeceptJS scenario-driven E2E and BDD tests for TypeScript with human-readable syntax, multi-backend support (Playwright/WebDriver/Puppeteer), and Gherkin integration.
output_dir: tests/e2e
---

# QA CodeceptJS Writer

## Purpose

Write CodeceptJS BDD/scenario-driven E2E tests from test case specifications. Transform structured test cases into executable scenarios using human-readable syntax (`I.click`, `I.see`, `I.fillField`), multi-backend support, and optional Gherkin BDD integration.

## Trigger Phrases

- "Write CodeceptJS tests for [feature/flow]"
- "Generate CodeceptJS E2E tests from test cases"
- "Create CodeceptJS BDD scenarios for [flow]"
- "Add CodeceptJS tests with Gherkin for [feature]"
- "CodeceptJS scenario-driven tests for [page]"
- "CodeceptJS data-driven tests for [scenario]"
- "CodeceptJS Page Object for [page]"
- "CodeceptJS tests with Playwright/WebDriver/Puppeteer backend"

## Workflow

1. **Read test cases** — From qa-testcase-from-docs, qa-manual-test-designer, qa-browser-data-collector
2. **Generate scenarios** — Create `Feature`/`Scenario` blocks or `.feature` files
3. **Add step definitions** — If BDD mode: implement Given/When/Then in step definition files
4. **Configure helper** — Ensure `codecept.conf.ts` has correct helper (Playwright, WebDriver, Puppeteer)

## Key Features

| Feature | Description |
|---------|-------------|
| **Scenario-driven syntax** | `I.click`, `I.see`, `I.fillField`, `I.grabTextFrom` — human-readable, framework-agnostic |
| **Multi-backend** | Playwright, WebDriver, Puppeteer — switch via config without changing test code |
| **BDD Gherkin** | `.feature` files + step definitions; Given/When/Then; Background, Examples, tables |
| **Page Objects** | Encapsulate page logic; inject via `inject()` |
| **Custom helpers** | Extend I with custom methods |
| **Data-driven** | `Data().Scenario` for parameterized scenarios |
| **within()** | Scope locators to a container element |

## Test Types

| Type | Scope | Approach |
|------|-------|----------|
| **Scenario** | E2E user flows | `Feature`/`Scenario` blocks; `I` actor |
| **BDD Gherkin** | Business-readable acceptance | `.feature` files + step definitions |
| **Data-driven** | Same flow, multiple data sets | `Data(table).Scenario` with `current` |

## Key Patterns

- **Structure:** `Feature('name')` / `Scenario('title', ({ I }) => { ... })`
- **Navigation:** `I.amOnPage('/path')`
- **Interactions:** `I.click('Submit')`, `I.fillField('Email', 'a@b.com')`, `I.selectOption('Country', 'US')`
- **Assertions:** `I.see('Welcome')`, `I.seeElement('.user')`, `I.dontSee('Error')`
- **Scoped locators:** `within('.modal', () => { I.click('OK'); })`
- **Data-driven:** `Data(accounts).Scenario('Login', ({ I, current }) => { ... })`
- **Debugging:** `pause()` — interactive console during execution
- **Auth:** `autoLogin` plugin — login once, reuse session

See `references/patterns.md` for full pattern reference.

## BDD Mode (Gherkin)

- **Feature files:** `features/*.feature` — human-readable scenarios
- **Step definitions:** `step_definitions/steps.ts` — Given/When/Then implementations
- **Init:** `npx codeceptjs gherkin:init`
- **Snippets:** `npx codeceptjs gherkin:snippets` — generate stubs for undefined steps
- **Run features only:** `npx codeceptjs run --features`

See `references/patterns.md` for Gherkin patterns.

## Configuration

- **codecept.conf.ts** — helpers (Playwright/WebDriver/Puppeteer), plugins (autoLogin, allure), include (Page Objects), output
- **Helper options** — url, browser, restart, video, trace, storageState

See `references/config.md` for full configuration guide.

## Context7 MCP

Uses Context7 MCP to fetch CodeceptJS documentation when needed. Query for CodeceptJS API, helpers, or configuration when patterns are unclear.

## Scope

**Can do (autonomous):**
- Generate CodeceptJS scenario and BDD tests from test case specs
- Create Page Objects and inject them via `inject()`
- Add `Data().Scenario` for data-driven tests
- Configure `codecept.conf.ts` (helpers, plugins, include)
- Use `within()` for scoped interactions
- Add step definitions for Gherkin scenarios
- Use autoLogin plugin for auth
- Use Context7 MCP for CodeceptJS docs

**Cannot do (requires confirmation):**
- Change production code structure
- Add dependencies not in package.json
- Override project CodeceptJS config without approval
- Switch helper (Playwright ↔ WebDriver) without user preference

**Will not do (out of scope):**
- Execute tests (user runs `npx codeceptjs run`)
- Write Jest/Vitest unit tests (use qa-jest-writer)
- Modify CI/CD pipelines
- Bypass security or access restricted areas

## References

- `references/patterns.md` — Scenario syntax, BDD Gherkin, Page Objects, custom helpers, data-driven
- `references/config.md` — codecept.conf.ts, helpers, plugins, output
- `references/best-practices.md` — Readable scenarios, step granularity, helper selection

## Quality Checklist

- [ ] Human-readable steps; avoid raw CSS/XPath when semantic locators suffice
- [ ] Page Objects for page-specific logic; inject via `inject()`
- [ ] No hardcoded waits; use helper retry or explicit `I.waitForVisible`
- [ ] Tests independent; no shared state between scenarios
- [ ] BDD step definitions map to single, focused actions
- [ ] Data-driven tests use `Data().Scenario` with `current`
- [ ] Traceability to test case IDs where applicable
- [ ] No hardcoded secrets (use env vars)

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Element not found | Locator too specific, dynamic content | Use semantic locators (text, label); add `data-test` with customLocator |
| I is undefined | Wrong inject/context | Ensure `({ I }) =>` in Scenario; use `inject()` in step defs |
| Step definition not matched | Regex/string mismatch | Run `gherkin:snippets`; check Cucumber expressions |
| Backend-specific failure | Helper API differs | Playwright/WebDriver/Puppeteer have different methods; check helper docs |
| autoLogin not working | Config or TypeScript | Ensure plugin enabled; check login function export |
| Data().Scenario fails | current not passed | Use `({ I, current })`; access `current.columnName` |
| within() scope wrong | Nested structure | Verify container selector; use strict locators `{ css: '...' }` |
