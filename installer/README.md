# qa-skills

Interactive CLI installer for the **QA Skills Ecosystem** — install 56 specialized QA agent skills into Cursor, Claude Code, Codex, Cline, GitHub Copilot, Windsurf, and more.

## Quick Start

```bash
npx qa-skills init
```

Or install globally:

```bash
npm install -g qa-skills
qa-skills init
```

Running bare `qa-skills` is equivalent to `qa-skills init`.

## Features

- **Single `init` command** — one entry point for fresh machines and existing setups
- **Skills bundled** — works offline, no need to clone the repo first
- **Interactive prompts** — select skills with descriptions, grouped by category
- **Multi-agent support** — install to 11+ coding agents simultaneously
- **Dependency suggestions** — notifies when selected skills work best with companions
- **Symlink / Copy** — symlink (recommended) for single source of truth, or copy for independence
- **Project / Global scope** — install per-project or user-wide
- **MCP configuration** — optionally configure Playwright, GitHub, Filesystem MCP servers
- **Project structure rule** — maps each skill to an output directory via `AGENTS.md`
- **Non-interactive mode** — CLI flags for CI/CD automation

## Agent Support

| Agent | `--agent` flag | Project Path | Global Path |
|-------|---------------|--------------|-------------|
| Cursor | `cursor` | `.cursor/skills/` | `~/.cursor/skills/` |
| Claude Code | `claude-code` | `.claude/skills/` | `~/.claude/skills/` |
| Codex | `codex` | `.agents/skills/` | `~/.codex/skills/` |
| Cline | `cline` | `.agents/skills/` | `~/.agents/skills/` |
| GitHub Copilot | `github-copilot` | `.agents/skills/` | `~/.copilot/skills/` |
| Windsurf | `windsurf` | `.windsurf/skills/` | `~/.codeium/windsurf/skills/` |
| Roo Code | `roo` | `.roo/skills/` | `~/.roo/skills/` |
| OpenCode | `opencode` | `.agents/skills/` | `~/.config/opencode/skills/` |
| Gemini CLI | `gemini-cli` | `.agents/skills/` | `~/.gemini/skills/` |
| Amp | `amp` | `.agents/skills/` | `~/.config/agents/skills/` |
| VS Code | `vscode` | `.agents/skills/` | — |

## CLI Options

```
qa-skills init [options]

Options:
  -a, --agent <agents...>   Target specific agents (e.g., cursor claude-code)
  -s, --skill <skills...>   Install specific skills by name
  -g, --global              Install to user home directory instead of project
  --copy                    Copy files instead of symlinking
  -y, --yes                 Skip all confirmation prompts
  -l, --list                List available skills without installing
  -V, --version             Output version number
  -h, --help                Display help
```

### Examples

```bash
# Interactive — pick skills, agents, options
qa-skills init

# List available skills
qa-skills init --list

# Install specific skills to Cursor (non-interactive)
qa-skills init -a cursor -s playwright-ts-writer jest-writer -y

# Install all skills to multiple agents
qa-skills init -a cursor claude-code codex -y

# Install globally with copy method
qa-skills init -g --copy -a cursor -s orchestrator -y

# Shorthand (init is the default command)
qa-skills -a cursor -s jest-writer -y
```

## Skill Categories

| Category | Count | Skills |
|----------|-------|--------|
| Documentation & Planning | 8 | requirements-generator, spec-writer, nfr-analyst, api-contract-curator, plan-creator, diagram-generator, test-strategy, test-doc-compiler |
| Test Case Design | 4 | testcase-from-docs, testcase-from-ui, browser-data-collector, manual-test-designer |
| TypeScript Test Writers | 7 | jest-writer, vitest-writer, playwright-ts-writer, cypress-writer, webdriverio-writer, codeceptjs-writer, supertest-writer |
| Python Test Writers | 5 | pytest-writer, playwright-py-writer, selenium-py-writer, robot-framework-writer, httpx-writer |
| Java Test Writers | 4 | junit5-writer, selenium-java-writer, rest-assured-writer, spring-test-writer |
| Performance & Specialized | 8 | k6-writer, locust-writer, jmeter-writer, security-test-writer, accessibility-test-writer, visual-regression-writer, pact-writer, mobile-test-writer |
| Reporting & Analysis | 6 | test-reporter, coverage-analyzer, bug-ticket-creator, task-creator, risk-analyzer, spec-auditor |
| Orchestration | 1 | orchestrator |
| Support & Maintenance | 7 | test-healer, changelog-analyzer, flaky-detector, test-reviewer, data-factory, environment-checker, discovery-interview |
| Integrations | 6 | qase-integration, github-issues-enhanced, jira-integration, linear-integration, clickup-integration, shortcut-integration |

## Dependency System

Skills can recommend companions. After selection, the installer checks for missing recommendations:

```
Some selected skills work best with additional skills:

  qa-task-creator recommends qa-bug-ticket-creator
    Paired mode: auto-create linked fix tasks from bug tickets

  Add recommended skills? (space to toggle, enter to confirm)
    [x] qa-bug-ticket-creator
```

## Project Structure Rule

When enabled, the installer maps each skill to its output directory in two locations:

1. **`AGENTS.md`** (project root) — always committed to git, readable by all agents
2. **`.cursor/rules/qa-project-structure.mdc`** — only written if `.cursor/` is **not** in `.gitignore`

```
docs/requirements/    <- qa-requirements-generator
docs/specs/           <- qa-spec-writer
docs/plans/           <- qa-plan-creator, qa-test-strategy
tests/e2e/            <- qa-playwright-ts-writer, qa-cypress-writer, ...
reports/test-runs/    <- qa-test-reporter
```

Directories are created on-demand by skills — no empty folders are pre-created.

## Gitignore Handling

Many teams gitignore `.cursor/`, `.windsurf/`, etc. The installer handles this gracefully:

| Artifact | `.cursor/` gitignored | `.cursor/` committed |
|----------|----------------------|---------------------|
| Skills | Installed locally, each dev runs `qa-skills init` | Committed with project |
| Structure rule | Written to `AGENTS.md` only | Written to both `AGENTS.md` and `.cursor/rules/` |
| MCP config | Installed locally | Committed with project |

When `.cursor/` is gitignored, the installer shows a notice:
```
  warning .cursor/skills is in .gitignore — each developer must install individually
```

## Source Resolution

The installer finds skills in this priority order:

1. `QA_SKILLS_SOURCE` env var (explicit override)
2. Monorepo sibling: `../.cursor/skills/` (author developing locally)
3. Bundled: `skills/` inside the npm package (fresh machine via `npx`)

## skills.sh Compatibility

This repo is also compatible with the [skills.sh](https://skills.sh) ecosystem:

```bash
npx skills add owner/qa-skills
```

The `.cursor/skills/` directory is auto-discovered by the `skills` CLI.

## License

GPL-3.0 — see [LICENSE](../LICENSE)
