# Git Diff Parsing Patterns

## Overview

Parse git diff output to extract changed files, classify change types, and map to modules. Used by qa-changelog-analyzer for impact analysis.

---

## 1. Git Diff Commands

### Staged Changes (Pre-Commit)

```bash
git diff --name-only --cached
git diff --stat --cached
```

### Committed Changes

```bash
# Last commit
git diff --name-only HEAD~1..HEAD

# Last N commits
git diff --name-only HEAD~5..HEAD

# Specific commit range
git diff --name-only abc123..def456
```

### Branch Comparison

```bash
# PR: feature branch vs main
git diff --name-only origin/main...HEAD

# Branch vs branch
git diff --name-only base_branch..feature_branch
```

### With Rename Detection

```bash
git diff --name-only -M50% base..HEAD
git diff --find-renames base..HEAD
```

---

## 2. Parsing Output

### Name-Only Format

```
src/auth/login.ts
src/auth/session.ts
tests/auth/login.spec.ts
config/env.example
```

- One path per line
- Use `git status -s` for staged + unstaged with status prefix (`A`, `M`, `D`, `R`)

### Stat Format

```
 src/auth/login.ts   | 12 +++++----
 src/auth/session.ts |  5 +++++
 2 files changed, 17 insertions(+), 4 deletions(-)
```

- Parse for file paths and change magnitude
- Useful for prioritization (more changes = higher impact)

### Change Type Detection

| Git Status | Meaning | Action |
|------------|---------|--------|
| `A` or `??` (new) | Added | Need new tests |
| `M` | Modified | Run existing; check for updates |
| `D` | Deleted | Remove/update related tests |
| `R` or `R100` | Renamed | Update imports in tests |

---

## 3. File-to-Module Mapping

### Directory-Based

```
src/auth/login.ts      → auth
src/auth/session.ts    → auth
src/api/users.ts       → api
packages/core/utils.ts → core
```

- Use first path segment after `src/`, `packages/`, `lib/`, etc.
- Configurable per project

### Package/Import-Based (JS/TS)

- Parse `package.json` name
- Use import path: `@/auth` → auth
- Monorepo: `packages/auth` → auth

### Python

- `src.auth.login` → auth
- Directory: `src/auth/` → auth

### Config Override

- `impact-mapping.json` or `.qa-mapping` for custom mappings
- Override automatic detection when structure is non-standard

---

## 4. Exclusions

Common exclusions from impact analysis:

- `node_modules/`, `vendor/`, `__pycache__/`
- Generated files: `*.generated.ts`, `dist/`, `build/`
- Lock files: `package-lock.json`, `yarn.lock` (optional; may affect env)
- Docs only: `*.md`, `docs/` (optional; no test impact)
- Test files themselves: include in "tests to run" but not "modules affected"

---

## 5. Edge Cases

| Case | Handling |
|------|----------|
| Binary files | Skip or flag; no line-level analysis |
| Submodule changes | Treat as config; may need integration tests |
| Merge commits | Use `-m` or first parent; avoid duplicate counting |
| Large diff | Summarize by module; avoid listing every file |
| No git repo | Return error; require valid git context |
