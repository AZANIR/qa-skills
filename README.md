# QA Skills Ecosystem

56 specialized agent skills covering the full QA lifecycle — from requirements to test execution to reporting. Works with Cursor, Claude Code, Codex, Cline, GitHub Copilot, Windsurf, and more.

## Quick Start

```bash
npm init qa-skills
```

Works on any machine with npm — skills are bundled with the package. Pick skills interactively, choose your agent, and go. No confirmation prompts, just like `npm init vite` or `npm init wdio`.

**Non-interactive (CI/CD):**

```bash
npm init qa-skills -- -a cursor -s playwright-ts-writer jest-writer -y
```

**Via [skills.sh](https://skills.sh):**

```bash
npx skills add owner/qa-skills
```

## What's Inside

| Category | Skills | What They Do |
|----------|--------|--------------|
| **Documentation & Planning** | 8 | Requirements, specs, NFR analysis, API contracts, test plans, diagrams, test strategy, ISO 29119-3 docs |
| **Test Case Design** | 4 | Test cases from docs, from UI screenshots, browser data collection, manual test design |
| **TypeScript Test Writers** | 7 | Jest, Vitest, Playwright, Cypress, WebdriverIO, CodeceptJS, Supertest |
| **Python Test Writers** | 5 | pytest, Playwright, Selenium, Robot Framework, httpx |
| **Java Test Writers** | 4 | JUnit 5, Selenium, REST Assured, Spring Boot |
| **Performance & Specialized** | 8 | k6, Locust, JMeter, security (OWASP), accessibility (WCAG 2.2), visual regression, Pact contracts, mobile (Appium) |
| **Reporting & Analysis** | 6 | Test reports, coverage analysis, bug tickets, task creation, risk analysis, spec audit |
| **Orchestration** | 1 | Pipeline coordinator with 5 modes and 4 handoff chains |
| **Support & Maintenance** | 7 | Test healer, changelog analyzer, flaky detector, test reviewer, data factory, environment checker, discovery interview |
| **Integrations** | 6 | Qase.io, GitHub Issues, Jira, Linear, ClickUp, Shortcut |

**Total: 56 skills, 169 reference files, 14 templates**

## How It Works

Each skill is a self-contained `SKILL.md` file with YAML frontmatter, trigger phrases, decision autonomy levels, quality checklists, and troubleshooting tables. Skills work standalone or chain together through the orchestrator.

```
User: "Write Playwright E2E tests for the login page"
           │
           ▼
   qa-playwright-ts-writer
           │
     reads SKILL.md ──► generates tests in tests/e2e/
           │
           ▼
   Output: login.spec.ts with POM pattern, auto-waits, assertions
```

### Orchestration Chains

The `qa-orchestrator` coordinates multi-skill workflows:

| Chain | Flow | Use Case |
|-------|------|----------|
| **Chain 0** | discovery → requirements → spec → diagram → test cases → tests → healer → reviewer → reporter | New project, full validation |
| **Chain 1** | requirements → spec → diagram → test cases → tests → reporter | Feature development |
| **Chain 2** | browser-collector → UI test cases → tests → healer → coverage → tasks | UI-first testing |
| **Chain 3** | API contracts → test cases → API tests → Pact contracts → reporter | API-first testing |
| **Chain 4** | flaky-detector → test-healer → test-reviewer → changelog-analyzer | Test stabilization |

### Dependency Awareness

Skills declare recommended companions. During installation, the CLI suggests missing dependencies:

```
qa-task-creator recommends qa-bug-ticket-creator
  → Paired mode: auto-create linked fix tasks from bug tickets

Add recommended skills? [y/N]
```

### Project Structure Convention

Skills route artifacts to standard directories (documented in `.cursor/rules/qa-project-structure.mdc`):

```
project/
├── docs/
│   ├── requirements/    ← qa-requirements-generator
│   ├── specs/           ← qa-spec-writer
│   ├── plans/           ← qa-plan-creator, qa-test-strategy
│   ├── bug-tickets/     ← qa-bug-ticket-creator
│   └── diagrams/        ← qa-diagram-generator
├── test-cases/
│   ├── from-docs/       ← qa-testcase-from-docs
│   ├── from-ui/         ← qa-testcase-from-ui
│   └── manual/          ← qa-manual-test-designer
├── tests/
│   ├── unit/            ← jest, vitest, pytest, junit5
│   ├── e2e/             ← playwright, cypress, selenium, webdriverio
│   ├── api/             ← supertest, httpx, rest-assured
│   ├── performance/     ← k6, locust, jmeter
│   ├── security/        ← OWASP-based security tests
│   └── accessibility/   ← WCAG 2.2 axe-core tests
├── reports/
│   ├── test-runs/       ← qa-test-reporter
│   ├── coverage/        ← qa-coverage-analyzer
│   └── risk/            ← qa-risk-analyzer
└── data/
    └── fixtures/        ← qa-data-factory
```

Directories are created on-demand when a skill first produces an artifact.

## Supported Agents

| Agent | Project Path | Global Path | MCP | Rules |
|-------|-------------|-------------|-----|-------|
| **Cursor** | `.cursor/skills/` | `~/.cursor/skills/` | `.cursor/mcp.json` | `.cursor/rules/` |
| **Claude Code** | `.claude/skills/` | `~/.claude/skills/` | — | — |
| **Codex** | `.agents/skills/` | `~/.codex/skills/` | — | — |
| **Cline** | `.agents/skills/` | `~/.agents/skills/` | — | — |
| **GitHub Copilot** | `.agents/skills/` | `~/.copilot/skills/` | — | — |
| **Windsurf** | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` | `.windsurf/mcp.json` | `.windsurf/rules/` |
| **Roo Code** | `.roo/skills/` | `~/.roo/skills/` | — | — |
| **OpenCode** | `.agents/skills/` | `~/.config/opencode/skills/` | — | — |
| **Gemini CLI** | `.agents/skills/` | `~/.gemini/skills/` | — | — |
| **Amp** | `.agents/skills/` | `~/.config/agents/skills/` | — | — |
| **VS Code** | `.agents/skills/` | — | — | — |

## MCP Servers

Skills are powered by 6 MCP servers (configured in `.cursor/mcp.json`):

| Server | Purpose |
|--------|---------|
| **Playwright** | Browser automation, record mode, live page interaction |
| **GitHub** | Repository operations, PRs, issues, CI status |
| **Filesystem** | File operations, template management, artifacts |
| **Sequential Thinking** | Step-by-step reasoning for complex analysis |
| **Memory** | Cross-session context persistence |
| **Context7** | Extended context retrieval |

## Standards

| Standard | Applied In |
|----------|-----------|
| ISO/IEC/IEEE 29148 | Requirements engineering (qa-requirements-generator) |
| ISO/IEC/IEEE 29119-3 | Test documentation (qa-test-doc-compiler) |
| ISO/IEC/IEEE 29119-4 | Test techniques (qa-testcase-from-docs, qa-manual-test-designer) |
| ISO/IEC 25010 | Quality model (qa-nfr-analyst) |
| WCAG 2.2 | Accessibility testing (qa-accessibility-test-writer) |
| OWASP WSTG | Security testing (qa-security-test-writer) |

## Repository Structure

```
qa-skills/
├── .cursor/
│   ├── skills/              # 56 skill directories — source of truth
│   ├── rules/               # Cursor rules (.mdc)
│   └── mcp.json             # MCP server configuration
├── installer/               # create-qa-skills CLI (npm package)
│   ├── src/
│   │   ├── installer.ts     # Main interactive/non-interactive flow
│   │   ├── dependencies.ts  # Skill dependency map and resolver
│   │   ├── scaffold.ts      # Project structure rule generator
│   │   └── agents/          # Agent registry (11 agents)
│   ├── scripts/
│   │   └── bundle-skills.js # Prebuild: copies skills into package
│   ├── skills/              # Bundled skills (build artifact, gitignored)
│   ├── bin/cli.js           # CLI entry point (init subcommand)
│   └── package.json
├── memory-bank/             # Project context and progress tracking
├── AGENTS.md                # Tool-agnostic agent entrypoint
├── CLAUDE.md                # Claude Code entrypoint
└── .cursorrules             # Project-level Cursor rules
```

## Installer CLI

```bash
npm init qa-skills [directory] [-- options]

Options:
  -a, --agent <agents...>   Target agents (cursor, claude-code, codex, ...)
  -s, --skill <skills...>   Specific skills to install
  -g, --global              Install to user home directory
  --copy                    Copy files instead of symlinking
  -y, --yes                 Skip confirmation prompts
  -l, --list                List available skills
  -V, --version             Show version
```

Also available as `npx create-qa-skills` or, after global install, `qa-skills init`.

See [installer/README.md](installer/README.md) for full documentation.

## License

GPL-3.0 — see [LICENSE](LICENSE)
