---
name: qa-orchestrator
description: Master skill coordinating all QA skills through pipeline modes (full-cycle, docs-only, testcases-only, write-tests, report), formalized handoff chains, scheduler rules, and framework/language selection based on project context.
dependencies:
  recommended:
    - qa-diagram-generator
    - qa-discovery-interview
---

# QA Orchestrator

## Purpose

Master coordinator for all QA skills in the ecosystem. Routes work through pipeline modes, formalized handoff chains, and scheduler rules. Selects frameworks and languages based on project context. Uses Memory MCP for cross-session persistence.

## Trigger Phrases

- "Run full QA cycle" / "Full-cycle pipeline"
- "Docs only" / "Generate QA docs"
- "Test cases only" / "Testcase pipeline"
- "Write tests" / "Test writing pipeline"
- "Report only" / "Generate test report"
- "Orchestrate [chain name]" / "Run Chain 1" / "E2E chain" / "API-first chain"
- "After merge" / "Before release" / "Requirement changed"
- "Select framework for [project]"

## Pipeline Modes

| Mode | Flow | When to Use |
| ---- | ---- | ----------- |
| **full-cycle** | docs → test cases → tests → execution → reports | New feature, full validation |
| **docs-only** | requirements → spec → diagram | Documentation phase |
| **testcases-only** | docs/spec → test cases | Test design phase |
| **write-tests** | test cases → tests | Automation phase |
| **report** | results → report | Post-execution reporting |

See `references/pipeline-modes.md` for detailed configurations.

## Formalized Handoff Chains

### Chain 0 — Discovery → Full E2E
`discovery-interview` → `requirements-generator` → `spec-writer` → `diagram-generator` → `testcase-from-docs` → `playwright-ts-writer` → `test-healer` (if fail) → `test-reviewer` → `test-reporter`

### Chain 1 — Full E2E
`requirements-generator` → `spec-writer` → `diagram-generator` → `testcase-from-docs` → `playwright-ts-writer` → `test-healer` (if fail) → `test-reviewer` → `test-reporter`

### Chain 2 — UI-first
`browser-data-collector` → `testcase-from-ui` → `playwright-ts-writer` → `test-healer` → `coverage-analyzer` → `task-creator` (for gaps)

### Chain 3 — API-first
`api-contract-curator` → `testcase-from-docs` → `supertest-writer` / `httpx-writer` → `pact-writer` → `test-reporter`

### Chain 4 — Stabilization
`flaky-detector` → `test-healer` → `test-reviewer` → `changelog-analyzer` → regression scope

See `references/handoff-chains.md` for input/output contracts per step.

## Scheduler Rules

| Trigger | Actions |
| ------- | ------- |
| **After merge** | Smoke/regression → report → bug if fail |
| **Before release** | Completion report + risk analysis |
| **After requirement change** | Impact analysis → update RTM |

See `references/scheduler-rules.md` for automation patterns.

## Framework / Language Selection

| Project Signal | Ecosystem | Writers |
| -------------- | --------- | ------- |
| `tsconfig.json` present | TypeScript | playwright-ts-writer, jest-writer, vitest-writer, supertest-writer, cypress-writer |
| `setup.py` / `pyproject.toml` | Python | playwright-py-writer, pytest-writer, httpx-writer, selenium-py-writer |
| `pom.xml` / `build.gradle` | Java | selenium-java-writer, junit5-writer, rest-assured-writer, spring-test-writer |

Selection is automatic based on project root detection. User can override.

## Memory MCP

Uses Memory MCP for cross-session persistence:
- Last pipeline mode and chain used
- Project context (framework, language)
- Scheduler state (last run, next trigger)
- Handoff artifacts (IDs, paths) for resume

## Workflow

1. **Input** — User request (pipeline mode, chain, or scheduler trigger)
2. **Context** — Detect project (tsconfig, pyproject, pom.xml)
3. **Route** — Select chain or pipeline per mode
4. **Execute** — Invoke skills in sequence; pass outputs as inputs
5. **Persist** — Store state via Memory MCP
6. **Output** — Final artifact (report, tests, docs) + summary

## Scope

**Can do (autonomous):**
- Route to any pipeline mode or handoff chain
- Select framework/language from project structure
- Invoke skills in sequence with handoff contracts
- Persist state via Memory MCP
- Apply scheduler rules when triggered

**Cannot do (requires confirmation):**
- Change project scope or release criteria
- Override organizational test policy
- Execute tests in production

**Will not do (out of scope):**
- Modify production code or environments
- Approve releases (stakeholder responsibility)
- Create skills not in ecosystem

## Quality Checklist

- [ ] Pipeline mode matches user intent
- [ ] Chain selected aligns with project type (E2E, UI, API, stabilization)
- [ ] Framework/language detected correctly
- [ ] Each handoff passes valid input per contract
- [ ] Scheduler rules applied when trigger matches
- [ ] State persisted for resume
- [ ] Final output (report, tests, docs) produced

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Wrong chain selected | Ambiguous project type | Ask: E2E, UI-first, or API-first? |
| Missing handoff | Skill output format mismatch | Check `references/handoff-chains.md` contracts |
| Framework not detected | Non-standard project layout | User override: specify ts/py/java |
| Scheduler not firing | Trigger not matched | Verify "after merge" / "before release" phrasing |
| State lost between sessions | Memory MCP not configured | Ensure MCP server enabled and connected |
