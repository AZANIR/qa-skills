# Git Diff Impact Analysis Patterns

## Overview

Impact analysis maps git changes to affected modules, tests, and regression scope. Use this to prioritize testing and scope regression sets.

---

## 1. Parsing Git Diff

### Commands

```bash
# Files changed in branch vs base
git diff --name-only base_branch..HEAD

# Files changed in last commit
git diff --name-only HEAD~1..HEAD

# Files changed in PR
git diff --name-only origin/main...HEAD

# With change stats
git diff --stat base_branch..HEAD
```

### Output Structure

- **Added:** New files (higher risk if untested)
- **Modified:** Changed files (map to modules)
- **Deleted:** Removed files (update test mapping)

---

## 2. File → Module Mapping

### Strategies

| Strategy | When to Use | How |
|----------|-------------|-----|
| **Directory** | Clear package structure | `src/auth/` → `auth` module |
| **Package/Import** | JS/TS/Python | Parse `package.json`, `__init__.py`, imports |
| **Config** | Custom mapping | `impact-mapping.json` or similar |
| **Convention** | Monorepo | `packages/auth`, `apps/web` |

### Example Mapping

```
src/auth/login.ts     → auth
src/auth/session.ts   → auth
src/api/users.ts      → api
tests/auth/login.spec.ts → auth (test)
```

---

## 3. Affected Tests

### Coverage-Based

- Use coverage report: which tests cover changed files?
- Tools: Istanbul `--reporter json`, JaCoCo, coverage.py
- Map: changed file → tests that execute it

### Naming/Path-Based

- Convention: `tests/<module>/` or `<module>.spec.ts`
- Changed `auth/login.ts` → run `tests/auth/*` or `**/auth*.spec.ts`

### Import-Based

- Parse test files for imports of changed modules
- Grep: `import.*from.*auth` in test files

---

## 4. Downstream Impact

### Dependencies

- **Import graph:** Who imports changed files?
- **API consumers:** If changed file exports API, find callers
- **Database:** Schema changes → migration tests, integration tests

### Patterns

```bash
# Find files importing changed module
grep -r "from.*auth" src/ tests/

# Find API consumers (if OpenAPI available)
# Cross-reference with qa-api-contract-curator
```

---

## 5. Regression Scope

### Suggested Set

1. **Direct:** Tests for changed modules (from mapping)
2. **Integration:** Tests that use changed APIs/components
3. **Smoke:** Critical path tests (from qa-test-strategy)
4. **Optional:** Full suite if risk > threshold

### Output Format

```markdown
## Regression Scope for [Branch/PR]

### Must Run (High Impact)
- tests/auth/login.spec.ts
- tests/auth/session.spec.ts
- tests/api/users.integration.spec.ts

### Should Run (Medium Impact)
- tests/checkout/flow.spec.ts

### Optional (Low Impact)
- Full E2E suite
```

---

## 6. Edge Cases

| Case | Handling |
|------|----------|
| **New file** | No change frequency; use complexity + criticality |
| **Config only** | Lower risk; may affect env-specific tests |
| **Test file changed** | Include in regression; flag for review |
| **Generated code** | Exclude or treat as low risk |
| **Merge conflict resolution** | Re-analyze after merge |
