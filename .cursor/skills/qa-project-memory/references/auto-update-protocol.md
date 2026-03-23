# Post-Task Auto-Update Protocol

## Principle

After **every** completed task by any QA skill, the agent automatically writes the result to the appropriate `docs/qa-memory/` file. No user request required. Archive thresholds are checked before writing.

---

## 6-Step Protocol

### Step 1 — Classify Result

Determine which memory file(s) to update based on what happened:

| What happened | Write to |
|---|---|
| Tests written/generated | `test-log.md` |
| Bug found | `bugs.md` |
| QA decision made | `decisions.md` |
| Flaky test / regression detected | `regressions.md` |
| Environment / config changed | `environment.md` |
| Workaround found | `known-issues.md` |

One task may update **multiple** files. For example, a test writer that discovers a bug updates both `test-log.md` and `bugs.md`.

### Step 2 — Archive Check

Before writing, count entries in the target file:

```
IF count >= threshold → run archive rotation first
   (see archive-strategy.md for thresholds per file)
THEN proceed with write
```

Thresholds:
- `bugs.md`: 50 entries
- `test-log.md`: 50 entries
- `regressions.md`: 50 entries
- `decisions.md`: 30 entries
- `known-issues.md`: 50 entries
- `environment.md`: no archive (always updated in place)

### Step 3 — Deduplication

1. Extract key identifiers from the new entry (test file name, bug description keywords, decision topic)
2. Search the target file for similar entries:
   - Grep by test file path (for test-log)
   - Grep by error message or component (for bugs)
   - Grep by decision topic (for decisions)
3. If a similar entry is found → **update** the existing entry with new information
4. If no match → **append** as new entry with next sequential ID

### Step 4 — Write Entry

Append the entry to the **end** of the target file in the established format (see `file-formats.md`).

Required fields for every entry:
- **Date** — ISO 8601 (YYYY-MM-DD)
- **ID** — Sequential per file type (BUG-xxx, TL-xxx, REG-xxx, ADR-xxx, KI-xxx)
- **Description** — Brief summary of what happened
- **Source skill** — Which QA skill produced this result

All content must be in **English**.

### Step 5 — Update Index

Add or update entry in `docs/qa-memory/_index.md`:

```markdown
| {ID} | {date} | {one-line summary} | {Active/Resolved/Done} | {filename} |
```

- New entries → append to index table
- Updated entries → update the existing index row
- Archived entries → update file path to archive location

### Step 6 — Cross-Reference

If the entry relates to another entry, add bidirectional links:

| Entry type | Cross-reference to |
|---|---|
| Bug | Test case (TL-xxx), regression (REG-xxx) |
| Regression | Original bug (BUG-xxx), decision (ADR-xxx) |
| Decision | Affected skills, related bugs, test cases |
| Known issue | Related bugs (BUG-xxx) |
| Test log | Related bugs, decisions, known issues |

Format: `→ BUG-012`, `→ ADR-005`, `→ REG-008`

---

## Integration Point

This protocol is referenced in:
- `CLAUDE.md` — as MANDATORY rule
- `AGENTS.md` — in qa-project-memory description
- `qa-orchestrator` — as final step in every handoff chain

Every skill in the ecosystem should follow this protocol automatically after task completion.
