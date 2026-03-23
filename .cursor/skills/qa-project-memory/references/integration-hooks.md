# Integration Hooks

How `qa-project-memory` integrates with other skills in the ecosystem.

---

## Auto-Record Hooks by Skill Category

### Writer Skills → `test-log.md`

All test writer skills auto-record what was generated.

| Skill | Records |
|---|---|
| `qa-playwright-ts-writer` | Test file path, test count, describe blocks, coverage |
| `qa-playwright-py-writer` | Test file path, test count, fixtures used |
| `qa-cypress-writer` | Test file path, test count, cy.intercept usage |
| `qa-jest-writer` | Test file path, test count, mock coverage |
| `qa-vitest-writer` | Test file path, test count, ESM features used |
| `qa-pytest-writer` | Test file path, test count, fixtures, parametrize |
| `qa-supertest-writer` | Test file path, endpoint count, auth method |
| `qa-httpx-writer` | Test file path, endpoint count, async usage |
| `qa-webdriverio-writer` | Test file path, browser matrix, page objects |
| `qa-codeceptjs-writer` | Test file path, scenario count, Gherkin steps |
| `qa-selenium-py-writer` | Test file path, POM pages, wait strategies |
| `qa-selenium-java-writer` | Test file path, test count, Allure annotations |
| `qa-robot-framework-writer` | Test file path, keyword count, libraries |
| `qa-k6-writer` | Script path, scenario type, thresholds |
| `qa-locust-writer` | Script path, user classes, load shape |
| `qa-jmeter-writer` | JMX path, thread groups, samplers |
| `qa-security-test-writer` | Test file path, OWASP checks covered |
| `qa-accessibility-test-writer` | Test file path, WCAG rules checked |
| `qa-visual-regression-writer` | Test file path, baseline screenshots |
| `qa-pact-writer` | Contract path, consumer/provider pair |
| `qa-mobile-test-writer` | Test file path, platform, device matrix |
| `qa-junit5-writer` | Test file path, test count, extensions |
| `qa-rest-assured-writer` | Test file path, endpoint count, validations |
| `qa-spring-test-writer` | Test file path, slices used, containers |

### Bug/Issue Skills → `bugs.md`

| Skill | Records |
|---|---|
| `qa-bug-ticket-creator` | Local copy of bug for fast lookup |
| `qa-test-healer` | What broke + how it was fixed |
| Any writer (when test fails) | Bug discovered during test generation |

### Analysis Skills → `regressions.md`

| Skill | Records |
|---|---|
| `qa-flaky-detector` | Flaky pattern with classification (race/state/time/external) |
| `qa-test-healer` | Regression pattern when same fix applies repeatedly |
| `qa-visual-regression-writer` | Visual diff that indicates regression |
| `qa-changelog-analyzer` | Change-induced regression risk |

### Strategy/Planning Skills → `decisions.md`

| Skill | Records |
|---|---|
| `qa-test-strategy` | Strategic QA decisions (test approach, tool choices) |
| `qa-plan-creator` | Plan decisions (scope, schedule, resources) |
| `qa-coverage-analyzer` | Coverage strategy decisions |
| `qa-risk-analyzer` | Risk-based prioritization decisions |

### Environment Skills → `environment.md`

| Skill | Records |
|---|---|
| `qa-environment-checker` | Environment config changes, readiness status |
| `qa-browser-data-collector` | Discovered URLs, endpoints, app structure |

### Workaround Skills → `known-issues.md`

| Skill | Records |
|---|---|
| `qa-test-healer` | Unfixable issues marked as `test.fixme()` with workaround |
| `qa-spec-auditor` | Spec drift that requires workaround |
| Any skill finding limitations | Documented workarounds |

---

## Orchestrator Integration

### Final Step in Every Chain

The `qa-orchestrator` adds `qa-project-memory:update` as the last step in every handoff chain:

```
Chain 0: discovery → ... → reporter → **memory:update**
Chain 1: requirements → ... → reporter → **memory:update**
Chain 2: browser-data → ... → task-creator → **memory:update**
Chain 3: api-contract → ... → reporter → **memory:update**
Chain 4: flaky-detector → ... → changelog → **memory:update**
```

### Memory Update Step Contract

| Field | Value |
|---|---|
| **Input** | Results from all previous chain steps |
| **Action** | Scan output → classify → dedup → write → index → cross-ref |
| **Output** | Confirmation with count of new/updated entries |

---

## Pre-Task Memory Check

Before starting work, skills should check memory:

1. `bugs.md` — is this bug already known?
2. `decisions.md` — does the new approach conflict with existing decisions?
3. `known-issues.md` — is there a workaround already?
4. If not found in active files → search `_index.md` and `_archive/`

This prevents rediscovering known issues and contradicting past decisions.
