# QA Skills Ecosystem — Agent Definitions

Multi-tool agent definitions for the QA automation skills ecosystem. Each skill is an agent with defined scope and capabilities.

---

## Documentation (8 agents)

| Agent | Description | Scope | Key Capabilities |
|-------|-------------|-------|------------------|
| `qa-requirements-generator` | Extract and normalize requirements from any source | from-url, from-figma, from-code, from-description, full-audit | SRS per ISO 29148, user stories, traceability registry |
| `qa-spec-writer` | Create technical specifications from requirements | Specs, acceptance criteria, boundary conditions | Given/When/Then, business rules, error handling |
| `qa-nfr-analyst` | NFR analysis per ISO 25010 quality model | Performance, security, usability, reliability | WCAG 2.2, OWASP WSTG, SLA definitions |
| `qa-api-contract-curator` | Manage and formalize API contracts | OpenAPI, versioning, compatibility | Contract validation, breaking change detection |
| `qa-plan-creator` | Universal QA plan generator | Test, sprint, regression, release, UAT, performance, migration, onboarding | Gantt timelines, plan types |
| `qa-diagram-generator` | Universal diagram generator (standalone + embeddable) | Flowchart, sequence, class, state, ER, Gantt, C4, BPMN | Mermaid/PlantUML, from text/image/code |
| `qa-test-strategy` | Test strategy and test plan documents | Scope, objectives, risk matrix | Entry/exit criteria, resource estimation |
| `qa-test-doc-compiler` | Compile formal test documentation per ISO 29119-3 | Test policy, plans, specifications, reports | Test model → case → procedure, execution logs |

---

## Test Cases (4 agents)

| Agent | Description | Scope | Key Capabilities |
|-------|-------------|-------|------------------|
| `qa-testcase-from-docs` | Generate test cases from Phase 1 documentation | Test model-based (ISO 29119-4) | State models, decision tables, RTM, positive/negative/boundary |
| `qa-testcase-from-ui` | Generate test cases from screenshots and mockups | Vision analysis, UI flows | Fields, buttons, forms, navigation scenarios |
| `qa-browser-data-collector` | Explore live apps via Playwright MCP | DOM, forms, network, screenshots | UI spec data, user flows, validation rules |
| `qa-manual-test-designer` | Design manual tests and exploratory charters | Decision tables, state transitions | Exploratory charters, risk-based prioritization |

---

## TypeScript Writers (7 agents)

| Agent | Description | Scope | Key Capabilities |
|-------|-------------|-------|------------------|
| `qa-jest-writer` | Jest unit and integration tests | describe/it, mocks, snapshots | Code coverage, jest.mock |
| `qa-vitest-writer` | Vitest unit and integration tests | ESM-native, Vite integration | Jest-compatible API |
| `qa-playwright-ts-writer` | Playwright E2E and component tests | Multi-browser, POM | Auto-wait, network interception, record mode |
| `qa-cypress-writer` | Cypress E2E and component tests | cy.mount, time-travel | cy.intercept, in-browser unit tests |
| `qa-webdriverio-writer` | WebdriverIO E2E and mobile web | W3C WebDriver, Appium | Page Objects, multi-browser |
| `qa-codeceptjs-writer` | CodeceptJS E2E and BDD | I.click, I.see, Gherkin | Multi-backend (Playwright/WebDriver) |
| `qa-supertest-writer` | Supertest API and integration tests | Express/Koa | Chained assertions, auth |

---

## Python Writers (5 agents)

| Agent | Description | Scope | Key Capabilities |
|-------|-------------|-------|------------------|
| `qa-pytest-writer` | pytest unit and integration tests | Fixtures, parametrize, markers | conftest, plugins |
| `qa-playwright-py-writer` | Playwright Python E2E | Async/sync API, pytest-playwright | POM |
| `qa-selenium-py-writer` | Selenium Python E2E | WebDriver, explicit/implicit waits | POM, headless |
| `qa-robot-framework-writer` | Robot Framework E2E and RPA | Keyword-driven, human-readable | SeleniumLibrary, BrowserLibrary |
| `qa-httpx-writer` | httpx/requests API tests | Async support, session management | Schema validation |

---

## Specialized (8 agents)

| Agent | Description | Scope | Key Capabilities |
|-------|-------------|-------|------------------|
| `qa-k6-writer` | k6 load and performance tests | Load, stress, soak, spike | Thresholds, scenarios, CI-friendly |
| `qa-locust-writer` | Locust load tests | Distributed mode, custom shapes | Real-time web UI |
| `qa-jmeter-writer` | JMeter performance tests | Thread groups, samplers | .jmx generation, assertions |
| `qa-security-test-writer` | OWASP-based security tests | OWASP Top 10, DAST | Injection, XSS, CSRF, auth bypass |
| `qa-accessibility-test-writer` | WCAG 2.2 accessibility tests | axe-core, Pa11y, Lighthouse | ARIA patterns, keyboard nav |
| `qa-visual-regression-writer` | Visual regression tests | Playwright, Percy, BackstopJS | Screenshot comparison, baseline management |
| `qa-pact-writer` | Pact contract tests | Consumer-driven contracts | Microservices contract testing |
| `qa-mobile-test-writer` | Appium and mobile tests | iOS/Android, Flutter | Native, hybrid, mobile web |

---

## Reporting (6 agents)

| Agent | Description | Scope | Key Capabilities |
|-------|-------------|-------|------------------|
| `qa-test-reporter` | Aggregate and report test results | JUnit, JSON, Allure, CI output | HTML/markdown reports, trend analysis |
| `qa-coverage-analyzer` | Requirements, technique, and code coverage | RTM, ISO 29119-4, Istanbul/JaCoCo | Coverage dashboard, gap analysis |
| `qa-bug-ticket-creator` | Generate bug reports from failures | GitHub Issues, Jira, Linear | Severity/priority, evidence, duplicate detection |
| `qa-task-creator` | Create work tasks from QA analysis | Standalone or paired with bug-ticket | Dev, QA, docs, enhancement tasks |
| `qa-risk-analyzer` | Risk-based testing prioritization | Impact analysis, risk index | Risk matrix, testing recommendations |
| `qa-spec-auditor` | Living documentation and spec drift | Requirements vs implementation | Spec drift detection, regression optimization |

---

## Support (6 agents)

| Agent | Description | Scope | Key Capabilities |
|-------|-------------|-------|------------------|
| `qa-test-healer` | Self-healing tests | Broken selectors, assertions, waits | Auto-fix, test.fixme() for unfixable |
| `qa-changelog-analyzer` | Analyze git diff for test impact | Recommend tests to add/update/run | Change-based scope |
| `qa-flaky-detector` | Find unstable tests in CI | 4-pattern classification | Race, shared state, time, external deps |
| `qa-test-reviewer` | Code review for tests | Structure, assertions, anti-patterns | Code-smell catalog, before/after |
| `qa-data-factory` | Generate realistic test data | Fixtures, factories, faker | Seeds, test data generation |
| `qa-environment-checker` | Verify test environment readiness | Services, DB, accounts, configs | Environment validation |

---

## Orchestration (1 agent)

| Agent | Description | Scope | Key Capabilities |
|-------|-------------|-------|------------------|
| `qa-orchestrator` | Master coordinator for all QA skills | full-cycle, docs-only, testcases-only, write-tests, report | Handoff chains, scheduler, framework selection |

---

## Handoff Chains

- **Full E2E:** requirements-generator → spec-writer → diagram-generator → testcase-from-docs → playwright-ts-writer → test-healer → test-reviewer → test-reporter
- **UI-first:** browser-data-collector → testcase-from-ui → playwright-ts-writer → test-healer → coverage-analyzer → task-creator
- **API-first:** api-contract-curator → testcase-from-docs → supertest/httpx-writer → pact-writer → test-reporter
- **Stabilization:** flaky-detector → test-healer → test-reviewer → changelog-analyzer → regression scope
