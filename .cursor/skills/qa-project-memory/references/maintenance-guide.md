# Maintenance Guide

Procedures for maintaining QA project memory health: archive rotation, status checks, index rebuilds, and reviews.

---

## Status Check

Run `status` (or `статус`) to see memory health:

```
QA Memory Status
================
File              Entries   Threshold   Last Update    Status
─────────────────────────────────────────────────────────────
bugs.md              23       50        2025-03-23     OK
test-log.md          47       50        2025-03-23     ⚠ Near threshold
decisions.md         12       30        2025-03-20     OK
regressions.md        8       50        2025-03-18     OK
known-issues.md      15       50        2025-03-22     OK
environment.md        3       ∞         2025-03-23     OK

Archive: 4 files, 127 total archived entries
Index: 182 entries in _index.md
```

**Warning indicators:**
- `⚠ Near threshold` — count >= threshold × 0.8
- `⚠ Stale entries` — oldest entry exceeds age limit
- `❌ Over threshold` — count > threshold (archive overdue)

---

## Manual Archive Trigger

If auto-archive hasn't run (e.g., no recent writes), manually trigger:

```
archive              → rotate all files
archive bugs         → rotate only bugs.md
archive --dry-run    → preview without changes
```

Dry-run output example:
```
Archive Dry Run
===============
bugs.md: 52 entries (threshold: 50)
  → Would archive 17 oldest entries (keep 35)
  → Target: _archive/bugs_2025-Q1.md

test-log.md: 48 entries (threshold: 50)
  → 12 entries older than 3 months
  → Would archive 12 entries
  → Target: _archive/test-log_2024-Q4.md

No changes made (dry run).
```

---

## Index Rebuild

If `_index.md` gets out of sync (e.g., manual file edits), rebuild it:

1. Scan all active files in `docs/qa-memory/` for entries matching `### {PREFIX}-{NNN}:` pattern
2. Scan all files in `docs/qa-memory/_archive/` for the same pattern
3. Extract: ID, date, summary (first line after `###`), status, file path
4. Regenerate `_index.md` table sorted by ID prefix then number

---

## Periodic Review

### Weekly (recommended)

- Run `status` to check file sizes and staleness
- Run `summary week` to review what QA accomplished
- Verify no `❌ Over threshold` warnings

### Sprint boundary

- Run `archive` to clean up before sprint retrospective
- Run `summary sprint` to compile sprint QA activity
- Review `decisions.md` for decisions that need revisiting

### Quarterly

- Verify archive files are properly formatted
- Check `_index.md` completeness against actual files
- Review `known-issues.md` for issues that have been fixed but not updated

---

## File Health Checks

### Entry count verification

Count entries per file using the `### {PREFIX}-` pattern:

```
bugs.md:         count ### BUG-
test-log.md:     count ### TL-
regressions.md:  count ### REG-
decisions.md:    count ### ADR-
known-issues.md: count ### KI-
```

### ID gap detection

IDs should be sequential. Gaps indicate missing entries or broken index:

```
Expected: BUG-001, BUG-002, BUG-003, ...
Gap found: BUG-001, BUG-002, BUG-005 → missing BUG-003, BUG-004
```

Gaps from archived entries are normal (check `_archive/`). Gaps with no archive entry indicate data loss.

### Cross-reference validation

Verify that referenced IDs exist:
- Every `→ BUG-xxx` points to an actual entry in `bugs.md` or `_archive/`
- Every `→ ADR-xxx` points to an actual entry in `decisions.md` or `_archive/`
- Every `→ REG-xxx` points to an actual entry in `regressions.md` or `_archive/`

---

## Backup Strategy

The `docs/qa-memory/` directory (including `_archive/`) should be committed to version control. Git provides:
- Full history of all changes
- Ability to recover accidentally modified entries
- Branching for experimental memory changes

**Never add to `.gitignore`.** Memory files are project documentation, not generated artifacts.
