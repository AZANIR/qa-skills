# QA Skills Ecosystem — Claude Code Entrypoint

## Project Overview

QA automation skills ecosystem for Cursor IDE: 58 specialized agent skills covering the full QA lifecycle — documentation, test case design, test writing (TypeScript + Python + specialized), reporting, analysis, orchestration, and project memory.

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

---

## QA Project Memory (auto-update)

**Project memory:** `docs/qa-memory/` — structured log of all QA activities.

### MANDATORY rule:
After EVERY completed QA task, record the result in `docs/qa-memory/`.
Detailed protocol → `.cursor/skills/qa-project-memory/references/auto-update-protocol.md`

### Before starting work:
- Check `docs/qa-memory/bugs.md` — is this bug already known?
- Check `docs/qa-memory/decisions.md` — does the new approach conflict?
- Check `docs/qa-memory/known-issues.md` — is there a workaround?
- If not found in active files → search `_index.md` and `_archive/`

### Post-Task Memory Protocol (6 steps):
1. **Classify** — determine which file(s) to update (test-log, bugs, decisions, regressions, environment, known-issues)
2. **Archive check** — if entry count >= threshold, rotate oldest entries to `_archive/`
3. **Deduplicate** — search target file for similar entries; update existing if found
4. **Write** — append entry with date, sequential ID, description, source skill (English only)
5. **Index** — add/update entry in `_index.md` with ID, date, summary, file path
6. **Cross-reference** — link related entries by ID (BUG → REG → ADR → TL)

### Language:
- All memory content is **English only**
- Agent responds in the language the user writes in (EN or UA)
- Trigger phrases and commands work in both EN and UA
