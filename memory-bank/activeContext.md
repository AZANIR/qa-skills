# Active Context

## Current Focus
v2.1: QA Project Memory skill added — structured log of all QA activities with auto-update, archive system, and searchable index.

## Recent Changes
- **v2.1:** Created `qa-project-memory` skill with auto-update protocol, archive system, and bilingual triggers (EN/UA)
  - SKILL.md + 5 reference files (auto-update-protocol, file-formats, archive-strategy, integration-hooks, maintenance-guide)
  - `docs/qa-memory/` initialized with 6 memory files + `_index.md` + `_archive/`
  - CLAUDE.md updated with Post-Task Memory Protocol (MANDATORY)
  - AGENTS.md updated with qa-project-memory agent
  - qa-orchestrator chains updated: memory update is now final step in every chain
- v2.0: Java ecosystem (selenium-java, rest-assured, junit5, spring-test)
- v1.4: @qa-skills/installer CLI (multi-editor)
- v1.3: ClickUp + Shortcut integrations
- v1.2: Jira + Linear integrations
- v1.1: Qase.io TMS + GitHub Issues enhanced
- v1.0: Core 45 skills

## Current State
- **58 skills** with SKILL.md + references + templates
- **174 reference files** across all skills
- **14 template files** in skills
- **3 Cursor rules** (.mdc)
- **6 memory-bank files**
- **8 qa-memory files** (docs/qa-memory/)
- **6 MCP servers** configured
- **2 tool-agnostic entrypoints** (AGENTS.md, CLAUDE.md)
- **1 installer CLI** (@qa-skills/installer)

## Next Steps
1. User testing of qa-project-memory on real projects
2. Add evals/ (self-test cases) to skills for quality validation
3. Add scripts/scaffold.py to Phase 3 writer skills
4. Consider Azure DevOps and TestRail integrations (v1.5)
5. Clean up root templates/ directory (legacy duplication)

## Active Decisions
- Framework-specific skills (not generic unit/integration/E2E) — each framework has its own skill
- Diagram generator and discovery-interview are embeddable services (other skills auto-trigger them)
- Task creator works both standalone and paired with bug-ticket-creator
- Playwright writers support 3 modes: Record, Generate, Heal
- Templates use -template suffix convention and live inside owner skills (no central templates/ folder)
- **`memory-bank/` vs `docs/qa-memory/`** — different abstraction layers: memory-bank describes WHAT the project IS; qa-memory describes WHAT QA HAS DONE
- **Archive over delete** — qa-memory never deletes entries, always archives to `_archive/` with searchable index
- **English-only content** — all memory file entries in English; agent responds in user's language (EN/UA)
