# Memory File Formats

Entry formats for all 6 memory files in `docs/qa-memory/`. All content is written in English.

---

## test-log.md

Task execution log — automatically recorded after every QA skill runs.

```markdown
### TL-047: Generated Playwright tests for Auth (2025-03-23)
- **Skill:** qa-playwright-ts-writer
- **Task type:** E2E test generation
- **Input:** specs/auth-flow.md
- **Output:** tests/e2e/auth.spec.ts (12 tests, 3 describe blocks)
- **Coverage:** +15% (auth module: 0% → 85%)
- **Duration:** ~3 min
- **Related:** → ADR-005 (POM choice), → BUG-012 (OAuth redirect)
```

**Required fields:** ID, date, skill, task type, input, output
**Optional fields:** coverage, duration, related

---

## bugs.md

Active bugs with root cause and solution — recorded when any skill finds a bug.

```markdown
### BUG-012: OAuth redirect loop on staging (2025-03-23)
- **Severity:** High
- **Found by:** qa-playwright-ts-writer (test auth.spec.ts:34)
- **Environment:** staging (https://staging.example.com)
- **Reproducibility:** Always
- **Steps:** 1) Login via Google OAuth 2) Redirect → /callback → /login → loop
- **Root Cause:** Wrong redirect_uri in .env.staging
- **Solution:** Change OAUTH_REDIRECT_URI to https://staging.example.com/callback
- **Test:** auth.spec.ts:34 — "should complete OAuth flow"
- **Status:** Resolved (2025-03-24)
- **Related:** → KI-003 (known workaround for staging OAuth)
```

**Required fields:** ID, date, severity, found by, steps
**Optional fields:** environment, root cause, solution, test, status, related

---

## regressions.md

Regression patterns — bugs that reappear across versions.

```markdown
### REG-008: Submit button disappears on resize <768px (2025-03-23)
- **Severity:** Critical
- **First found:** v2.1.0, BUG-005
- **Current recurrence:** v2.3.0, found by qa-visual-regression-writer
- **Recurrence cause:** CSS refactor overwrote media query
- **Protection:** visual-regression/responsive-form.spec.ts (added)
- **Related:** → BUG-005, → ADR-011 (CSS methodology)
```

**Required fields:** ID, date, severity, first found, current recurrence
**Optional fields:** recurrence cause, protection test, related

---

## decisions.md

QA decisions in ADR (Architecture Decision Record) format.

```markdown
### ADR-011: Adopt data-testid for test selectors (2025-03-22)

**Context:**
- Visual regression tests break when devs change CSS classes
- Need stable selectors not tied to styling

**Decision:**
- Use `data-testid` attributes for all interactive elements
- Require `data-testid` in PR review checklist

**Alternatives considered:**
- CSS class selectors → Rejected: too fragile
- XPath → Rejected: slow, unreadable

**Consequences:**
- ✅ Stable tests, no false positives from styling changes
- ✅ Clear contract between dev and QA
- ❌ Devs must add data-testid to every element
```

**Required fields:** ID, date, context, decision
**Optional fields:** alternatives considered, consequences

---

## known-issues.md

Known issues with workarounds — things that are broken but have a path forward.

```markdown
### KI-003: Staging OAuth requires manual cookie clear (2025-03-20)
- **Affected versions:** v2.0+
- **Environment:** staging only
- **Workaround:** Clear cookies → re-login → works on second attempt
- **Root cause:** Auth session TTL mismatch between staging and OAuth provider
- **Fix ETA:** Backlog (JIRA-456)
- **Status:** Open
- **Related:** → BUG-012
```

**Required fields:** ID, date, workaround, status
**Optional fields:** affected versions, environment, root cause, fix ETA, related

---

## environment.md

Test environments — always updated in place, never archived.

```markdown
### Staging
- **URL:** https://staging.example.com
- **API:** https://api-staging.example.com
- **DB:** staging-db.internal:5432 / qa_database
- **Test accounts:** see 1Password vault "QA"
- **Deploy:** auto-deploy from `develop` branch, resets nightly
- **Known issues:** → KI-003 (OAuth cookie)

### Production
- **URL:** https://app.example.com
- **API:** https://api.example.com
- **Test accounts:** read-only test user only
- **Deploy:** manual release from `main` branch

### Local
- **URL:** http://localhost:3000
- **API:** http://localhost:8080
- **DB:** localhost:5432 / qa_local
- **Setup:** `docker-compose up` → `npm run seed`
```

**Required fields:** environment name, URL
**Optional fields:** API, DB, test accounts, deploy info, known issues

---

## ID Conventions

| File | Prefix | Example |
|---|---|---|
| `test-log.md` | TL- | TL-001, TL-002 |
| `bugs.md` | BUG- | BUG-001, BUG-002 |
| `regressions.md` | REG- | REG-001, REG-002 |
| `decisions.md` | ADR- | ADR-001, ADR-002 |
| `known-issues.md` | KI- | KI-001, KI-002 |

IDs are sequential per file, never reused. When archiving, the ID stays with the entry.
