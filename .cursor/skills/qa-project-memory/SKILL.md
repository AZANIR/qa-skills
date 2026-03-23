---
name: qa-project-memory
description: >
  QA project memory with auto-update. Structured log of bugs, decisions,
  tests, regressions, environments. Automatically updated after every QA task.
  Archive system with searchable index for large projects.
  
  Trigger phrases (EN): "initialize memory", "init qa memory", "find known bug",
  "search memory", "show what was done", "check regressions", "memory status",
  "archive memory", "log a bug", "add decision", "memory summary",
  "what bugs do we know", "update memory", "show test log".
  
  Trigger phrases (UA): "ініціалізувати пам'ять", "знайти відомий баг",
  "пошук у пам'яті", "показати що було зроблено", "перевірити регресії",
  "статус пам'яті", "архівувати пам'ять", "залогувати баг", "додати рішення",
  "зведення пам'яті", "які баги відомі", "оновити пам'ять", "показати лог тестів",
  "що ми вирішили про", "які тестові середовища є".
dependencies:
  recommended:
    - qa-orchestrator
    - qa-bug-ticket-creator
    - qa-flaky-detector
---

# QA Project Memory

## Purpose

Structured log of all QA activities — bugs found, decisions made, tests executed, regressions detected, environments configured, and known issues tracked. Automatically updated after every QA task with deduplication, cross-referencing, and archive rotation.

**Key distinction:** `memory-bank/` describes WHAT this project IS. `docs/qa-memory/` describes WHAT QA HAS DONE.

## Commands

| Command (EN) | Alias (UA) | Action |
|---|---|---|
| `init` | `ініціалізація` | Create `docs/qa-memory/` structure + update CLAUDE.md |
| `update` | `оновити` | Auto-record (called automatically after each task) |
| `search <query>` | `пошук <запит>` | Search across active + archive + index |
| `status` | `статус` | Memory health: entry count, last update, archive size |
| `archive` | `архівувати` | Rotate entries exceeding thresholds to `_archive/` |
| `archive --dry-run` | `архівувати --перегляд` | Show what would be archived without acting |
| `summary [period]` | `зведення [період]` | Summary for day/week/sprint |
| `log bug` | `залогувати баг` | Manually add a bug entry |
| `add decision` | `додати рішення` | Manually add an ADR entry |

## Language Policy

| Layer | Language | Rule |
|---|---|---|
| **Trigger phrases** | EN + UA | Both languages trigger the skill equally |
| **Command names** | EN + UA aliases | `search` = `пошук`, `status` = `статус`, etc. |
| **All documentation** | **English only** | SKILL.md body, references, protocols |
| **Memory file content** | **English only** | All entries, field labels, descriptions |
| **Agent responses** | **User's language** | Agent detects and responds in EN or UA |

## Memory Files

All files live in `docs/qa-memory/`:

| File | Purpose | Auto-updated by |
|---|---|---|
| `bugs.md` | Active bugs with solutions | Bug finders, test-healer |
| `decisions.md` | QA decisions (ADR format) | Strategy/plan skills |
| `test-log.md` | Task execution log | All writer skills, orchestrator |
| `regressions.md` | Regression patterns | Flaky-detector, test-healer |
| `environment.md` | Test environments, URLs, accounts | Environment-checker |
| `known-issues.md` | Known issues and workarounds | Any skill finding workarounds |
| `_index.md` | Searchable index across all files + archive | Every write operation |
| `_archive/` | Archived entries (auto-rotated by quarter) | Archive rotation |

See `references/file-formats.md` for entry formats with examples.

## Workflow

### `init` — Initialize Project Memory

1. Create `docs/qa-memory/` directory with all files from templates
2. Create `_archive/` subdirectory with `.gitkeep`
3. Populate `_index.md` with header and search instructions
4. Confirm creation with file count

### `update` — Auto-Record (Post-Task Protocol)

This runs automatically after every QA task. See `references/auto-update-protocol.md`.

1. **Classify** — determine which file(s) to update
2. **Archive check** — verify thresholds before writing
3. **Deduplicate** — search for existing similar entries
4. **Write** — append entry in established format (English)
5. **Index** — add/update entry in `_index.md`
6. **Cross-reference** — link related entries by ID

### `search <query>` — Search Memory

Priority order:
1. `_index.md` — fast lookup by ID, date, keyword
2. Active files — full-text search in `docs/qa-memory/*.md`
3. Archive — full-text search in `docs/qa-memory/_archive/*.md`

### `status` — Memory Health

Display per-file stats:
- Entry count / threshold
- Last update timestamp
- Archive file count and total archived entries
- Warnings for files approaching threshold

### `archive` — Manual Archive Rotation

Trigger archive rotation for files exceeding thresholds. See `references/archive-strategy.md`.

- `archive` — rotate all files
- `archive bugs` — rotate only `bugs.md`
- `archive --dry-run` — preview without changes

### `summary [period]` — Activity Summary

Aggregate entries from `test-log.md` for the specified period:
- **day** — today's entries
- **week** — last 7 days
- **sprint** — last 14 days (or custom sprint length)

Output: entry count by type, top bugs, coverage changes, decisions made.

## Scope

**Can do (autonomous):**
- Initialize memory structure (`init`)
- Auto-record after every QA task (`update`)
- Search across active files and archive
- Archive entries when thresholds exceeded
- Deduplicate entries
- Cross-reference related entries
- Generate summaries

**Cannot do (requires confirmation):**
- Delete any memory entry (archive only, never delete)
- Change archive thresholds
- Modify another skill's output

**Will not do (out of scope):**
- Replace `memory-bank/` (different abstraction layer)
- Store credentials or secrets
- Modify source code or test files

## Quality Checklist

- [ ] Memory files exist in `docs/qa-memory/` with correct headers
- [ ] Every entry has: date, sequential ID, description, source skill
- [ ] All content written in English
- [ ] No duplicate entries (deduplication applied)
- [ ] Cross-references use correct IDs (BUG-xxx → REG-xxx → ADR-xxx)
- [ ] `_index.md` updated on every write
- [ ] Archive thresholds respected
- [ ] Archived entries preserve full content (no data loss)

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---|---|---|
| Memory files not found | `init` not run | Run `init` or `ініціалізація` |
| Duplicate entries appear | Dedup keywords too narrow | Broaden grep pattern in Step 3 |
| Archive not triggering | Threshold not reached | Check `status` for current counts |
| Search misses archived entry | Index not updated | Rebuild index from active + archive files |
| Wrong language in entries | Non-English content written | All memory content must be English; fix entry |
| Cross-references broken | ID mismatch | Verify IDs exist in referenced file |
| `_index.md` out of sync | Manual file edit without index update | Rebuild: scan all files, regenerate index |

## References

- `references/auto-update-protocol.md` — 6-step post-task protocol
- `references/file-formats.md` — entry formats with examples for all 6 files
- `references/archive-strategy.md` — thresholds, rotation, index format
- `references/integration-hooks.md` — which skills write what, hook points
- `references/maintenance-guide.md` — archive commands, health checks, rebuild
