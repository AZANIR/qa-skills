# Archive Strategy

Never delete. Always archive. When memory files exceed thresholds, oldest entries move to `docs/qa-memory/_archive/` with a searchable index.

---

## Thresholds

| File | Max active entries | Age limit | Rationale |
|---|---|---|---|
| `bugs.md` | **50** | 6 months | ~10 lines/entry × 50 = ~500 lines |
| `test-log.md` | **50** | 3 months | Highest volume; 3 months keeps recent context |
| `regressions.md` | **50** | 6 months | Patterns stay relevant longer |
| `decisions.md` | **30** | 12 months | Larger entries (~15 lines); decisions rarely expire |
| `known-issues.md` | **50** | 3 months (resolved only) | Resolved issues archive faster |
| `environment.md` | **no archive** | never | Always current; updated in place |

**Hybrid trigger:** archive fires when **either** condition is met (count OR age), whichever comes first.

---

## Archive Process

### Step 1 — Check Thresholds

Before writing a new entry, count existing entries in the target file.
If count >= threshold OR oldest entry age exceeds the limit → trigger archive.

### Step 2 — Select Entries to Archive

- **By count:** move oldest N entries so that remaining = threshold × 0.7
  - Example: `bugs.md` at 50 → archive 15 oldest → 35 remain, room to grow
- **By age:** move all entries older than the age limit
- Apply whichever rule captures more entries

### Step 3 — Move to `_archive/`

- Filename pattern: `{original}_{YYYY}-{Q}.md`
  - Examples: `bugs_2025-Q1.md`, `test-log_2025-Q2.md`
- If archive file for this quarter already exists → **append** to it
- Preserve full entry content — no truncation, no data loss

### Step 4 — Update `_index.md`

- For each archived entry, update the `File` column from the active filename to the archive path
- Example: `bugs.md` → `_archive/bugs_2025-Q1.md`
- Index is append-only; it is never archived itself

### Step 5 — Confirm

- Log the archive operation in `test-log.md`:
  ```
  ### TL-XXX: Archived N entries from {file} (YYYY-MM-DD)
  - **Skill:** qa-project-memory
  - **Task type:** Archive rotation
  - **Details:** Moved {N} entries to _archive/{filename}
  - **Remaining:** {count} active entries
  ```

---

## `_index.md` Format

```markdown
# QA Memory Index

Searchable index of all entries — active and archived.
Use search or grep to find any entry by ID, keyword, or date.

## How to search
- By ID: search for "BUG-042" in docs/qa-memory/_index.md
- By keyword: search for "oauth" in docs/qa-memory/_index.md
- By date range: search for "2025-01" in docs/qa-memory/_index.md
- Full entry: find the file path in index → read that file

## Index entries

| ID | Date | Summary | Status | File |
|---|---|---|---|---|
| BUG-001 | 2025-01-15 | Docker arch mismatch on Cloud Run | Resolved | _archive/bugs_2025-Q1.md |
| TL-001 | 2025-01-15 | Generated Jest tests for utils | Done | _archive/test-log_2025-Q1.md |
| ADR-001 | 2025-01-10 | Use WIF for GitHub Actions auth | Active | decisions.md |
```

---

## Archive Commands

| Command (EN) | Alias (UA) | Action |
|---|---|---|
| `archive` | `архівувати` | Rotate all files exceeding thresholds |
| `archive bugs` | `архівувати баги` | Rotate only `bugs.md` |
| `archive test-log` | `архівувати лог` | Rotate only `test-log.md` |
| `archive --dry-run` | `архівувати --перегляд` | Show what would be archived without acting |

---

## Search Across Archive

The `search` command automatically searches both active files AND `_archive/`:

**Priority order:**
1. `_index.md` — fastest, lookup by ID/date/keyword
2. Active files in `docs/qa-memory/` — full-text
3. Archive files in `docs/qa-memory/_archive/` — full-text

---

## Archive File Naming

```
docs/qa-memory/_archive/
├── bugs_2025-Q1.md
├── bugs_2025-Q2.md
├── test-log_2025-Q1.md
├── test-log_2025-Q2.md
├── regressions_2025-Q1.md
├── decisions_2025-Q1.md
├── known-issues_2025-Q1.md
└── .gitkeep
```

Quarter boundaries: Q1 = Jan–Mar, Q2 = Apr–Jun, Q3 = Jul–Sep, Q4 = Oct–Dec.
