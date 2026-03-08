# Tech Context: QA Agent Skills Ecosystem

## Technology Stack

### MCP Servers (External Integrations)

| Server | Purpose |
|--------|---------|
| Playwright | Browser automation, record/replay, test execution |
| GitHub | Repos, PRs, issues, CI workflows |
| Filesystem | File operations, templates, artifact management |
| Sequential Thinking | Stepwise reasoning for complex tasks |
| Memory | Context persistence across sessions |
| Context7 | Extended context retrieval |

**Configuration:** `.cursor/mcp.json`

### Language Ecosystems

#### TypeScript

- **Frameworks:** Jest, Vitest, Playwright, Cypress, WebdriverIO, CodeceptJS, Supertest
- **Use:** Unit, integration, E2E, API testing

#### Python

- **Frameworks:** pytest, Playwright, Selenium, Robot Framework, httpx
- **Use:** Unit, E2E, API, BDD-style tests

#### Cross-Language

- **Load/Perf:** k6, Locust, JMeter
- **Security:** OWASP ZAP, axe-core
- **Contract:** Pact
- **Mobile:** Appium

### Diagramming

- **Mermaid** — flowcharts, sequence diagrams, Gantt charts
- Embedded in markdown; diagram-generator skill produces Mermaid output

### CI/CD

- **GitHub Actions** — primary CI/CD platform
- Workflows for test execution, reporting, quality gates

### Secrets & Configuration

- **`.env`** — API keys, tokens, credentials
- **Rule:** Never hardcode secrets; reference via env vars
- `.env` excluded from version control

## Development Setup

- **Workspace:** `D:\QA_A\qa-skills`
- **Skills:** `.cursor/skills/qa-{name}/`
- **Rules:** `.cursor/rules/*.mdc`
- **Templates:** `templates/`
- **Memory Bank:** `memory-bank/`

## Constraints

- Skills must work within Cursor's agent execution model
- MCP servers must be configured and reachable
- Output formats should be parseable for handoff chains
- Progressive loading keeps SKILL.md under 500 lines
