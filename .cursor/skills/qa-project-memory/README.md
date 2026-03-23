<p align="center">
  <img src="qa-project-memory-logo.png" alt="QA Project Memory" width="800" />
</p>

<p align="center">
  <strong>Structured Log of All QA Activities</strong><br/>
  Auto-records bugs, decisions, tests, regressions, environments. Archive system with searchable index.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Auto--Update-after%20every%20task-brightgreen" alt="Auto-update" />
  <img src="https://img.shields.io/badge/Archive-never%20delete-blue" alt="Archive" />
  <img src="https://img.shields.io/badge/Language-EN%20%7C%20UA-yellow" alt="Bilingual" />
  <img src="https://img.shields.io/badge/Memory%20Files-6%20types-purple" alt="6 file types" />
  <img src="https://img.shields.io/badge/Index-searchable-orange" alt="Searchable index" />
</p>

---

## What it does

QA Project Memory maintains a structured, persistent log of everything QA has done on a project. After **every** QA task — test generation, bug discovery, decision making, environment change — the result is automatically recorded in `docs/qa-memory/`.

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

**Key distinction:** `memory-bank/` describes WHAT the project IS. `docs/qa-memory/` describes WHAT QA HAS DONE.

---

## Quick Start

```
> init qa memory

✓ Created docs/qa-memory/
  ├── bugs.md
  ├── decisions.md
  ├── test-log.md
  ├── regressions.md
  ├── environment.md
  ├── known-issues.md
  ├── _index.md
  └── _archive/
```

From this point on, every QA skill automatically records its results. No manual action needed.

---

## Features

### Auto-Update Protocol (6 steps)

Every QA task triggers a mandatory post-task protocol:

| Step | Action | Purpose |
|------|--------|---------|
| 1 | **Classify** | Determine target file(s) based on result type |
| 2 | **Archive check** | Verify thresholds before writing |
| 3 | **Deduplicate** | Search for existing similar entry; update if found |
| 4 | **Write** | Append entry with date, ID, description, source skill |
| 5 | **Index** | Add/update entry in `_index.md` |
| 6 | **Cross-reference** | Link related entries by ID (BUG → REG → ADR) |

### Memory Files

| File | ID Prefix | Purpose | Archive threshold |
|------|-----------|---------|-------------------|
| `bugs.md` | BUG- | Active bugs with root cause and solution | 50 entries / 6 months |
| `test-log.md` | TL- | Task execution log (auto-recorded) | 50 entries / 3 months |
| `decisions.md` | ADR- | QA decisions in ADR format | 30 entries / 12 months |
| `regressions.md` | REG- | Regression patterns across versions | 50 entries / 6 months |
| `known-issues.md` | KI- | Known issues with workarounds | 50 entries / 3 months (resolved) |
| `environment.md` | — | Test environments, URLs, accounts | Never (always current) |

### Archive System

**Never delete. Always archive.**

When a file exceeds its threshold, oldest entries rotate to `_archive/` by quarter:

```
docs/qa-memory/_archive/
├── bugs_2025-Q1.md
├── test-log_2025-Q1.md
├── test-log_2025-Q2.md
└── regressions_2025-Q1.md
```

Every entry — active or archived — is tracked in `_index.md` for instant lookup.

### Cross-References

Entries link to each other by ID:

```
BUG-012: OAuth redirect loop on staging
  → KI-003 (known workaround)
  → REG-008 (regression pattern)
  → ADR-005 (related decision)
  → TL-047 (test that found it)
```

---

## Commands

| Command (EN) | Alias (UA) | Action |
|---|---|---|
| `init` | `ініціалізація` | Create `docs/qa-memory/` structure |
| `update` | `оновити` | Auto-record (runs automatically after tasks) |
| `search <query>` | `пошук <запит>` | Search active + archive + index |
| `status` | `статус` | Entry counts, thresholds, last update |
| `archive` | `архівувати` | Manual archive rotation |
| `archive --dry-run` | `архівувати --перегляд` | Preview without changes |
| `summary [period]` | `зведення [період]` | Activity summary (day/week/sprint) |
| `log bug` | `залогувати баг` | Manually add a bug entry |
| `add decision` | `додати рішення` | Manually add an ADR entry |

---

## Entry Format Examples

### Bug Entry

```markdown
### BUG-012: OAuth redirect loop on staging (2025-03-23)
- **Severity:** High
- **Found by:** qa-playwright-ts-writer (test auth.spec.ts:34)
- **Environment:** staging (https://staging.example.com)
- **Steps:** 1) Login via Google OAuth 2) Redirect → /callback → /login → loop
- **Root Cause:** Wrong redirect_uri in .env.staging
- **Solution:** Change OAUTH_REDIRECT_URI to https://staging.example.com/callback
- **Related:** → KI-003
```

### Test Log Entry

```markdown
### TL-047: Generated Playwright tests for Auth (2025-03-23)
- **Skill:** qa-playwright-ts-writer
- **Task type:** E2E test generation
- **Output:** tests/e2e/auth.spec.ts (12 tests, 3 describe blocks)
- **Coverage:** +15% (auth module: 0% → 85%)
- **Related:** → ADR-005, → BUG-012
```

### Decision Entry (ADR)

```markdown
### ADR-011: Adopt data-testid for test selectors (2025-03-22)

**Context:**
- Visual regression tests break when devs change CSS classes

**Decision:**
- Use `data-testid` attributes for all interactive elements

**Consequences:**
- ✅ Stable tests, no false positives from styling changes
- ❌ Devs must add data-testid to every element
```

---

## Integration with QA Ecosystem

### Skills that auto-record

| Skill category | Writes to |
|---|---|
| **All writer skills** (playwright, jest, pytest…) | `test-log.md` |
| **qa-bug-ticket-creator** | `bugs.md` |
| **qa-test-healer** | `bugs.md` + `regressions.md` |
| **qa-flaky-detector** | `regressions.md` |
| **qa-coverage-analyzer** | `test-log.md` |
| **qa-environment-checker** | `environment.md` |
| **qa-test-strategy / qa-plan-creator** | `decisions.md` |
| **qa-orchestrator** | `test-log.md` (pipeline summary) |

### Orchestrator Chains

Memory update is the **final step** in every handoff chain:

```
Chain 1: requirements → spec → ... → reporter → project-memory:update
Chain 2: browser-data → ... → task-creator → project-memory:update
Chain 3: api-contract → ... → reporter → project-memory:update
Chain 4: flaky-detector → ... → changelog → project-memory:update
```

---

## Architecture

```
.cursor/skills/qa-project-memory/
├── SKILL.md                              # Agent instructions
├── README.md                             # This file
└── references/
    ├── auto-update-protocol.md           # 6-step post-task protocol
    ├── file-formats.md                   # Entry formats with examples
    ├── archive-strategy.md               # Thresholds, rotation, index
    ├── integration-hooks.md              # Which skills write what
    └── maintenance-guide.md              # Health checks, rebuilds

docs/qa-memory/                           # Created by `init`
├── bugs.md                               # Active bugs
├── decisions.md                          # QA decisions (ADR)
├── test-log.md                           # Task execution log
├── regressions.md                        # Regression patterns
├── environment.md                        # Test environments
├── known-issues.md                       # Known issues & workarounds
├── _index.md                             # Searchable index
└── _archive/                             # Archived entries by quarter
    ├── bugs_2025-Q1.md
    └── test-log_2025-Q1.md
```

---

## Language Policy

| Layer | Language |
|---|---|
| Trigger phrases & commands | EN + UA (bilingual) |
| Memory file content | **English only** |
| Agent responses | User's language (auto-detected) |

All entries, field labels, and descriptions are written in English for consistent grep, tooling, and cross-team readability. The agent responds in the language the user writes in.

---

## vs `memory-bank/`

| Aspect | `memory-bank/` | `docs/qa-memory/` |
|---|---|---|
| **Purpose** | Project context for Cursor | Log of QA activities |
| **Updates** | Manual or Cursor memory MCP | Auto after every task |
| **Content** | Architecture, patterns, progress | Bugs, tests, decisions, regressions |
| **Growth** | Static (manually curated) | Grows continuously → auto-archived |
| **Audience** | Cursor AI | Any agent + humans |

Both coexist — different abstraction layers, no conflict.

---
