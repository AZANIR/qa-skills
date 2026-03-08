---
name: qa-changelog-analyzer
description: Analyze git diff and commit history to recommend which tests to add, update, or run based on code changes.
output_dir: reports/changelog
---

# QA Changelog Analyzer

## Purpose

Analyze code changes (git diff, commit history, branch comparisons) to determine testing impact. Map changed files to modules/components, identify affected tests, and produce actionable recommendations: **tests to run** (regression scope), **tests to update** (if source changed), and **tests to add** (if new code uncovered).

## Trigger Phrases

- "What tests should I run for this PR?"
- "Analyze git diff for test impact"
- "Changelog analysis" / "Change impact report"
- "Which tests are affected by [branch/commit]?"
- "Recommend regression scope for [changes]"
- "Tests to add/update for recent commits"

## Workflow

1. **Read git diff** — Staged (`git diff --cached`), committed (`git diff HEAD~1..HEAD`), or between branches (`git diff base..HEAD`)
2. **Map changed files to modules** — Use directory structure, package/import conventions, or config (see `references/git-analysis-patterns.md`)
3. **Identify affected test files** — Coverage-based, path-based, or import-based mapping
4. **Recommend:**
   - **Tests to run** — Regression scope (must run, should run, optional)
   - **Tests to update** — If source changed and tests may be outdated
   - **Tests to add** — If new code has no coverage

## Change Analysis

| Change Type | Action | Recommendation |
|-------------|--------|-----------------|
| **New files** | Need new tests | Add unit/integration tests; flag for qa-task-creator |
| **Modified files** | Check existing coverage | Run existing tests; update if assertions/source diverged |
| **Deleted files** | Remove/update related tests | Remove obsolete tests; update imports in remaining tests |
| **Renamed/moved files** | Update imports in tests | Fix import paths; run affected tests |
| **Config changes** | Validate environment | Run env-specific/smoke tests; verify config loading |

See `references/impact-mapping.md` for mapping strategies.

## Output Deliverables

1. **Change Impact Report** — Summary of changed files, modules affected, and impact level
2. **Recommended Regression Scope** — Must run / Should run / Optional test lists
3. **Task Suggestions for qa-task-creator** — Add tests, update tests, remove obsolete tests

### Change Impact Report Template

```markdown
# Change Impact Report — [Branch/PR/Commit]

## Summary
| Change Type | Count | Modules Affected |
|-------------|-------|------------------|
| Added | N | [list] |
| Modified | N | [list] |
| Deleted | N | [list] |

## Regression Scope

### Must Run (High Impact)
- [test file paths]

### Should Run (Medium Impact)
- [test file paths]

### Optional (Low Impact)
- [test file paths]

## Task Suggestions
- **Add:** [new modules/files needing tests]
- **Update:** [tests that may need assertion/import updates]
- **Remove:** [obsolete tests for deleted code]
```

## Integration with Other Skills

| Need | Skill | Usage |
|------|-------|-------|
| Create tasks from recommendations | qa-task-creator | Pass task suggestions for add/update/remove |
| Coverage data for mapping | qa-coverage-analyzer | Which tests cover changed files |
| Risk prioritization | qa-risk-analyzer | Combine with risk scores for regression order |
| Git diff patterns | — | `references/git-analysis-patterns.md` |
| Impact mapping | — | `references/impact-mapping.md` |

## Scope

**Can do (autonomous):**
- Parse git diff (staged, committed, between branches)
- Map changed files to modules/components
- Identify affected test files (path, import, or coverage-based)
- Produce change impact report and regression scope
- Generate task suggestions for qa-task-creator

**Cannot do (requires confirmation):**
- Run tests or generate coverage (consume existing data)
- Modify source or test code
- Exclude files from analysis without justification

**Will not do (out of scope):**
- Execute tests or deployments
- Modify git history or branches
- Override project-specific mapping without config

## Quality Checklist

- [ ] Git diff correctly parsed (staged/committed/branch)
- [ ] Changed files mapped to modules
- [ ] Affected tests identified (path, import, or coverage)
- [ ] Regression scope categorized (must/should/optional)
- [ ] Task suggestions actionable for qa-task-creator
- [ ] No hardcoded paths; respect project structure
- [ ] Config changes flagged for env validation

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| No changed files | Wrong diff range or branch | Verify `git diff` range; check branch names |
| Module mapping empty | Unclear structure | Use directory convention; add `impact-mapping` config |
| Too many tests in scope | Broad imports or coverage | Narrow to direct tests first; use risk prioritization |
| Missing coverage data | qa-coverage-analyzer not run | Use path/import mapping as fallback |
| Renamed files not detected | Git rename detection off | Use `git diff -M` or `--find-renames` |
| Config changes missed | Only tracking source files | Include config paths in analysis (e.g. `.env`, `config/`) |

## Reference Files

| Topic | Reference |
|-------|-----------|
| Git diff parsing, file-to-module mapping | `references/git-analysis-patterns.md` |
| Mapping code changes to test recommendations | `references/impact-mapping.md` |
