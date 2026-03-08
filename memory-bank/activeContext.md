# Active Context

## Current Focus
ALL phases complete. Full ecosystem delivered: 56 skills, 6 MCP servers, installer CLI, multi-editor entrypoints.

## Recent Changes
- Created qa-discovery-interview skill (the last remaining planned skill)
- Completed all Phase 0-6 infrastructure, skills, integrations, and distribution
- v1.0: Core 45 skills
- v1.1: Qase.io TMS + GitHub Issues enhanced
- v1.2: Jira + Linear integrations
- v1.3: ClickUp + Shortcut integrations
- v1.4: @qa-skills/installer CLI (multi-editor)
- v2.0: Java ecosystem (selenium-java, rest-assured, junit5, spring-test)

## Current State
- **56 skills** with SKILL.md + references + templates
- **169 reference files** across all skills
- **14 template files** in skills
- **3 Cursor rules** (.mdc)
- **6 memory-bank files**
- **6 MCP servers** configured
- **2 tool-agnostic entrypoints** (AGENTS.md, CLAUDE.md)
- **1 installer CLI** (@qa-skills/installer)

## Next Steps
1. User testing of individual skills on real projects
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
