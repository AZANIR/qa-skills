# Mapping Code Changes to Test Recommendations

## Overview

Map code changes to concrete test recommendations: tests to run, tests to update, and tests to add. Used by qa-changelog-analyzer to produce actionable output.

---

## 1. Tests to Run (Regression Scope)

### Direct Mapping

Changed file → tests that cover it:

| Source | Method | Example |
|--------|--------|---------|
| Coverage report | Istanbul, JaCoCo, coverage.py | `auth/login.ts` → `login.spec.ts` |
| Path convention | `tests/<module>/` or `*.spec.ts` | `auth/` → `tests/auth/*` |
| Import grep | `import.*from.*auth` in tests | Find test files importing changed module |

### Priority Levels

- **Must run:** Direct unit/integration tests for changed modules
- **Should run:** Integration tests that use changed APIs/components
- **Optional:** Full suite, E2E, smoke (if risk threshold exceeded)

### Downstream Impact

- If `auth/session.ts` changed → check who imports it
- API changes → integration tests for API consumers
- DB schema → migration tests, repository tests

---

## 2. Tests to Update

### When Source Diverged

- Assertions expect old behavior
- Selectors target removed/changed elements
- Mocks no longer match API shape

### Detection Hints

- Test file in same module as changed source
- Test imports changed file
- Test name suggests coverage of changed functionality

### Recommendation Format

```markdown
- **tests/auth/login.spec.ts** — `login.ts` changed; verify assertions match new validation logic
- **tests/api/users.integration.spec.ts** — `users.ts` response shape changed; update expectations
```

---

## 3. Tests to Add

### New Files

- New source file with no corresponding test
- New module/component
- New API endpoint

### Uncovered Code Paths

- New branches, error handlers, edge cases in modified files
- Use coverage report: new lines with 0% coverage

### Recommendation Format

```markdown
- **Add unit tests for** `src/auth/oauth.ts` — new file, no coverage
- **Add integration test for** `POST /api/v2/users` — new endpoint
```

---

## 4. Tests to Remove

### Deleted Source

- Source file deleted → tests that only cover it are obsolete
- Remove or repurpose tests

### Deprecated Features

- Feature removed → remove feature-specific tests
- Keep shared setup/utilities if still used

---

## 5. Config and Environment Changes

| Change | Recommendation |
|--------|----------------|
| `.env`, `config/*` | Run env-specific tests; validate config loading |
| `package.json`, `requirements.txt` | Run install + smoke; may affect dependencies |
| CI config (`.github/`, `Jenkinsfile`) | Validate pipeline; run full suite once |
| Dockerfile, k8s | Integration/E2E in target environment |

---

## 6. Task Handoff to qa-task-creator

Format suggestions for qa-task-creator:

```markdown
## Tasks

1. **Add:** Unit tests for `src/auth/oauth.ts` (new file)
2. **Update:** `tests/auth/login.spec.ts` — assertions for new validation
3. **Remove:** `tests/legacy/deprecated.spec.ts` — source deleted
4. **Run:** Regression scope (see Must Run list above)
```

- Each task is self-contained with file/module reference
- Link to change impact report for context
- Use labels: `qa`, `development`, `test-coverage`
