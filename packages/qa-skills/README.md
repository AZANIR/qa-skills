# qa-skills

CLI for managing QA Skills Ecosystem — add, sync, check, and maintain agent skills across Cursor, Claude Code, Codex, Copilot, Windsurf, and more.

This package is a convenience wrapper around [`create-qa-skills`](https://www.npmjs.com/package/create-qa-skills).

## Usage

```bash
# Add skills to an existing project
npx qa-skills add playwright-ts-writer jest-writer

# Check installation health
npx qa-skills doctor

# Sync skills to latest versions
npx qa-skills sync

# Validate configs and dependencies
npx qa-skills check

# Initialize a new project (same as npm init qa-skills)
npx qa-skills init
```

## Quick Start

For first-time setup, use the scaffolding command:

```bash
npm init qa-skills
```

This runs the interactive installer that sets up skills, agents, MCP config, and project structure.

## Links

- [GitHub](https://github.com/eleonorqa/qa-skills)
- [create-qa-skills on npm](https://www.npmjs.com/package/create-qa-skills)
