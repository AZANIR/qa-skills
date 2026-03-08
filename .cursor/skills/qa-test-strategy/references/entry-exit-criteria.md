# Entry and Exit Criteria Reference

Common entry and exit criteria for different test levels. Use these checklists when defining conditions to start and complete testing in a test strategy.

---

## Entry Criteria (Definition of Ready)

Conditions that must be met **before** testing can begin at a given level.

### Unit Test Entry

- [ ] Code is committed and buildable
- [ ] Dependencies are resolvable
- [ ] Test framework configured
- [ ] Coverage tooling in place

### Integration Test Entry

- [ ] Unit tests passing
- [ ] Services/APIs available (or mocked)
- [ ] Test environment provisioned
- [ ] Test data prepared
- [ ] Database migrations applied

### System/E2E Test Entry

- [ ] Integration tests passing
- [ ] Build deployed to test environment
- [ ] Environment health checks pass
- [ ] Test accounts and data ready
- [ ] Smoke test suite available

### UAT Entry

- [ ] System testing complete (or agreed partial completion)
- [ ] Known defects documented and accepted
- [ ] UAT environment matches production parity (or agreed delta)
- [ ] Business scenarios and acceptance criteria documented
- [ ] UAT participants identified and available

### Performance Test Entry

- [ ] Functional tests passing
- [ ] Performance environment sized appropriately
- [ ] Load profiles and SLAs defined
- [ ] Monitoring/APM configured
- [ ] Test data volume representative

### Release/Go-Live Entry

- [ ] All test levels completed per exit criteria
- [ ] Critical/high defects resolved or accepted
- [ ] Rollback plan documented and tested
- [ ] Sign-off from required stakeholders

---

## Exit Criteria (Definition of Done for Testing)

Conditions that must be met **to complete** testing at a given level.

### Unit Test Exit

- [ ] Target coverage achieved (e.g., 70%+ for critical paths)
- [ ] No failing unit tests
- [ ] Linter/static analysis clean
- [ ] Code review completed

### Integration Test Exit

- [ ] All integration tests passing
- [ ] API contract tests passing
- [ ] No critical integration defects open
- [ ] Integration coverage report reviewed

### System/E2E Test Exit

- [ ] All planned E2E scenarios executed
- [ ] Critical user journeys pass
- [ ] No critical/high defects open (or accepted with waiver)
- [ ] Test execution report complete
- [ ] Regression suite run and results documented

### UAT Exit

- [ ] All UAT scenarios executed
- [ ] Acceptance criteria met or explicitly waived
- [ ] Business sign-off obtained
- [ ] Feedback and defects logged
- [ ] UAT report delivered

### Performance Test Exit

- [ ] Load tests executed per profile
- [ ] SLAs met (response time, throughput, error rate)
- [ ] No performance regressions vs baseline
- [ ] Performance report with recommendations
- [ ] Bottlenecks documented

### Release/Go-Live Exit

- [ ] All exit criteria for prior levels met
- [ ] Release checklist completed
- [ ] Stakeholder sign-off obtained
- [ ] Deployment runbook validated
- [ ] Post-release monitoring plan in place

---

## Level-Specific Checklists

### Sprint/Iteration Level

**Entry:**
- [ ] Stories meet DoR (clear acceptance criteria, estimable)
- [ ] Dev environment available
- [ ] Test cases/automation ready for new scope

**Exit:**
- [ ] All committed stories tested
- [ ] No critical bugs in "Done"
- [ ] Demo completed
- [ ] Retrospective held

### Regression Level

**Entry:**
- [ ] Regression scope defined (risk-based or full)
- [ ] Test environment stable
- [ ] Baseline from last run available

**Exit:**
- [ ] Regression suite executed
- [ ] Results compared to baseline
- [ ] New failures triaged and logged
- [ ] Regression report updated

### Release Level

**Entry:**
- [ ] Release scope frozen
- [ ] All test levels planned
- [ ] Environments and data ready

**Exit:**
- [ ] All test levels passed per their exit criteria
- [ ] Release notes and known issues documented
- [ ] Go/no-go decision made
- [ ] Sign-off obtained

---

## Measurable vs Subjective

Prefer **measurable** criteria:

| Avoid | Prefer |
| ----- | ------ |
| "Testing complete" | "All E2E scenarios executed; 0 critical defects open" |
| "Quality is good" | "Pass rate ≥ 95%; no P1/P2 open" |
| "Ready for release" | "All exit criteria met; sign-off from PM and QA lead" |

---

## Suspension and Resumption

Document when to **suspend** testing:
- Critical environment failure
- Blocking defect in core flow
- Missing test data or access

Document when to **resume**:
- Environment restored
- Blocking defect fixed and verified
- Access/data provided
