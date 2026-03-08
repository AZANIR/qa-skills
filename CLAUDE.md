# QA Skills Ecosystem — Claude Code Entrypoint

## Project Overview

QA automation skills ecosystem for Cursor IDE: 45+ specialized agent skills covering the full QA lifecycle—documentation, test case design, test writing (TypeScript + Python + specialized), reporting, analysis, and orchestration.

**Standards:** ISO/IEC/IEEE 29148 (requirements), ISO/IEC/IEEE 29119-3/4 (test documentation & techniques), ISO/IEC 25010 (quality model), WCAG 2.2, OWASP WSTG.

---

## How to Use the Skills

1. **Skills location:** `.cursor/skills/qa-{name}/SKILL.md`
2. **Invoke by purpose:** Ask for the task (e.g., "generate requirements from this spec", "write Playwright tests for login flow")
3. **Chain skills:** Use `qa-orchestrator` for full-cycle pipelines, or invoke skills in sequence per handoff chains
4. **Templates:** Use `templates/` for requirements, test cases, bug reports, test plans, RTM

---

## Key Conventions

| Convention | Details |
|------------|---------|
| **Naming** | Skills: `qa-{purpose}` (lowercase, hyphens) |
| **Secrets** | `.env` for API keys; never hardcode |
| **Quality** | Quality checklists mandatory before deliverables |
| **Outputs** | Markdown and JSON for test artifacts |
| **Embeddable** | `qa-diagram-generator` is embeddable—other skills reference its patterns |

---

## Quick Reference

- **AGENTS.md** — Full agent definitions with scope and capabilities
- **QA_SKILLS_ECOSYSTEM_PLAN.md** — Complete architecture, phases, MCP setup, handoff chains
- **templates/** — requirements-template, test-case-template, bug-report-template, test-plan-template, rtm-template
- **.cursor/rules/** — qa-project (always), qa-skill-authoring, qa-agent-authoring
