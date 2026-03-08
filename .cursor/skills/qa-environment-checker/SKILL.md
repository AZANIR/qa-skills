---
name: qa-environment-checker
description: Verify test environment readiness by checking services, databases, required accounts, configurations, dependencies, and tool availability before test execution.
---

# QA Environment Checker

## Purpose

Verify that the test environment is ready for test execution. Checks service health, database connectivity, required accounts, configuration files, dependencies, and tool availability. Produces an environment readiness report with pass/fail per check, setup instructions for failures, and automated fix suggestions.

## Trigger Phrases

- "Check test environment" / "Environment readiness"
- "Verify environment before tests" / "Pre-test environment check"
- "Is my test env ready?" / "Environment validation"
- "Check services, DB, config before running tests"
- "Environment setup verification"
- "Dependency check for tests"
- "Health check for test environment"

## Checks Performed

| Category | Checks |
|----------|--------|
| **Service health** | API endpoints responding (HTTP 2xx), health endpoints |
| **Database** | Connectivity, schema state, migrations applied |
| **Accounts/credentials** | Required test accounts exist; credentials valid |
| **Configuration** | Config files present and valid (JSON, YAML, .env) |
| **Dependencies** | Node.js, Python, Playwright browsers, npm/pnpm packages |
| **Tools** | git, npm/pnpm/yarn, docker, CLI tools available |
| **Environment variables** | .env validation; required vars set |
| **Port availability** | Required ports free (e.g., 3000, 5432, 8080) |
| **Disk space** | Sufficient space for test artifacts |
| **Network** | Connectivity to external services if needed |

See `references/health-checks.md` for service health patterns and `references/dependency-matrix.md` for dependency requirements by test type.

## Output Format

### Environment Readiness Report Template

```markdown
# Environment Readiness Report

**Generated:** [timestamp]
**Target:** [project/env name]

## Summary
| Status | Count |
|--------|-------|
| Pass   | X     |
| Fail   | Y     |
| Skip   | Z     |

**Overall:** Ready / Not ready

## Checks

### [Category]: [Check name]
- **Status:** Pass / Fail / Skip
- **Details:** [output or error message]
- **Fix (if failed):** [setup instructions or command]
- **Auto-fix available:** Yes / No

## Failed Checks Summary
1. [Check] — [Brief fix]
2. [Check] — [Brief fix]

## Setup Instructions
[Step-by-step for failed checks]

## References
- Health checks: references/health-checks.md
- Dependency matrix: references/dependency-matrix.md
```

## Workflow

1. **Identify scope** — User specifies project, test type (E2E, API, unit), or config path
2. **Load dependency matrix** — Use `references/dependency-matrix.md` for required tools per test type
3. **Run checks** — Execute health checks, connectivity tests, config validation
4. **Collect results** — Pass/fail per check with details
5. **Generate report** — Structured output per template
6. **Provide fix suggestions** — Setup instructions, commands, or automated fix scripts for failures

## Integration with Other Skills

| Need | Skill | Usage |
|------|-------|-------|
| Run tests after env ready | qa-playwright-ts-writer, qa-pytest-writer | Environment checker runs first |
| API contract for health | qa-api-contract-curator | Health endpoint specs |
| Test data setup | qa-data-factory | Seed data after DB check passes |

## Scope

**Can do (autonomous):**
- Check service health (HTTP requests to health endpoints)
- Validate config files (syntax, required keys)
- Verify tool availability (which, version commands)
- Check env vars from .env (without exposing secrets)
- Produce readiness report with fix suggestions
- Reference health-checks and dependency-matrix

**Cannot do (requires confirmation):**
- Install dependencies or modify system (suggest only)
- Create accounts or credentials
- Run migrations (suggest commands only)
- Modify production or shared environments

**Will not do (out of scope):**
- Execute actual tests (only verify environment)
- Deploy or provision infrastructure
- Access restricted systems without permission
- Expose secrets in reports

## References

| Topic | File |
|-------|------|
| Service health check patterns | `references/health-checks.md` |
| Dependency matrix by test type | `references/dependency-matrix.md` |

## Quality Checklist

- [ ] All relevant checks run per test type (see dependency-matrix)
- [ ] Report includes pass/fail and fix suggestions for failures
- [ ] No secrets exposed in report output
- [ ] Setup instructions are actionable (commands, steps)
- [ ] Skip reason documented when check skipped
- [ ] References to health-checks and dependency-matrix correct

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Health check fails but service works | Wrong URL, auth, or timeout | Verify health endpoint in config; check health-checks.md |
| Dependency check reports missing | Wrong version or path | Update dependency-matrix for project stack |
| Config validation fails | Schema mismatch | Compare expected vs actual schema; document in report |
| Port check false positive | Process bound to different interface | Check 127.0.0.1 vs 0.0.0.0; document in health-checks |
| Report too noisy | Too many checks | Scope to test type; use dependency-matrix to filter |
| Auto-fix suggested but risky | Modifies system state | Mark as manual; require user confirmation |
