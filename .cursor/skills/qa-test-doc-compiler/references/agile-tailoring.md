# Agile/Scrum/DevOps Tailoring Guide for ISO 29119-3

*How to adapt ISO/IEC/IEEE 29119-3 test documentation for Agile, Scrum, and DevOps contexts while preserving traceability and compliance.*

## Principles

1. **Reduce ceremony, not traceability** — Merge documents, shorten cycles, but keep requirement → test case links.
2. **Living documents** — Confluence pages, wiki, or repo Markdown instead of static PDFs.
3. **Automation-friendly** — Structure for tool integration (Jira, Zephyr, TestRail, Allure).
4. **Just enough** — Include only what adds value for the team and stakeholders.

---

## Document Merging Strategies

### Option A: Minimal Set (Sprint-based)

| ISO Document | Agile Equivalent |
|--------------|------------------|
| Test Policy | Org-level; rarely changes; 1-page summary |
| Organizational Test Practices | Definition of Done, DoD for testing; wiki page |
| Project Test Plan | Release/sprint 0 doc; high-level only |
| Level/Type Test Plans | Merged into single "Test Approach" section |
| Test Model Specification | Inline in test case or BDD feature file |
| Test Case Specification | Jira/Zephyr/TestRail; or Markdown in repo |
| Test Procedure Specification | Steps in test case; or automated (code = procedure) |
| Test Execution Log | CI/CD results; JUnit/Allure/TestRail |
| Test Incident Report | Bug ticket (Jira, GitHub Issues) |
| Test Status Report | Sprint burndown, dashboard, standup notes |
| Test Completion Report | Release retrospective; 1-page summary |
| Test Data/Environment Requirements | README or runbook; as-needed |
| Readiness Reports | Checklist in Confluence; or omitted if self-evident |

### Option B: Hybrid (Regulated / Contract)

Keep formal documents for audit, but:
- Use templates; auto-populate from tools where possible
- Generate Test Completion Report from CI + bug tracker
- Keep Test Policy and Organizational Test Practices as living docs, reviewed quarterly

### Option C: DevOps / Continuous Delivery

- **Test Plan** → Pipeline config, quality gates, deployment criteria
- **Test Case** → Automated test code + BDD scenarios
- **Execution Log** → CI logs, Allure/JUnit XML
- **Incident Report** → Bug ticket linked to failing test
- **Status/Completion** → Dashboard (Grafana, custom); no separate report unless requested

---

## Tailoring by Document Type

### Test Policy

| Full ISO | Agile Tailoring |
|----------|------------------|
| Multi-page policy | 1-page summary: objectives, principles, governance |
| Formal approval cycle | Living doc; reviewed at org retro |
| Detailed roles | Link to RACI; keep high-level only |

### Organizational Test Practices

| Full ISO | Agile Tailoring |
|----------|------------------|
| Separate document | Merge into "Testing" section of team wiki |
| Detailed process | Definition of Done for testing; Definition of Ready |
| Tool strategy | Tool section; link to pipeline docs |

### Project Test Plan

| Full ISO | Agile Tailoring |
|----------|------------------|
| Full 13-section plan | Release/sprint 0: scope, approach, entry/exit, risks |
| Level + Type plans | Single "Test Approach" table: level × type × tools |
| Formal approvals | Async sign-off; or Product Owner acceptance |

### Test Model Specification

| Full ISO | Agile Tailoring |
|----------|------------------|
| Standalone document | Inline in BDD feature (Given/When/Then) or test case |
| Formal traceability | Link in test case to requirement ID |
| Diagrams | Use qa-diagram-generator; embed in Confluence |

### Test Case Specification

| Full ISO | Agile Tailoring |
|----------|------------------|
| Formal document | Test management tool (Zephyr, TestRail) or Markdown table |
| Full preconditions | Condensed; link to setup docs |
| Traceability | Requirement ID in test case; RTM auto-generated |

### Test Procedure Specification

| Full ISO | Agile Tailoring |
|----------|------------------|
| Separate procedure doc | Steps in test case; or automated test = procedure |
| Manual procedures | Keep for manual/exploratory; automate where possible |

### Test Execution Log

| Full ISO | Agile Tailoring |
|----------|------------------|
| Manual log | CI/CD results; JUnit XML, Allure, TestRail |
| Per-execution record | Pipeline run = execution; link build to test results |
| Manual tests | Log in tool; or lightweight spreadsheet |

### Test Incident Report

| Full ISO | Agile Tailoring |
|----------|------------------|
| Formal TIR template | Bug ticket (Jira, GitHub Issues) with: expected, actual, steps, severity |
| Separate numbering | Use ticket ID (e.g., PROJ-123) |
| Traceability | Link bug to test case ID |

### Test Status Report

| Full ISO | Agile Tailoring |
|----------|------------------|
| Periodic report | Sprint burndown, dashboard, standup summary |
| Formal document | Omit; or 1-page sprint test summary if stakeholder needs |
| Metrics | Coverage %, pass rate, open bugs; auto from tools |

### Test Completion Report

| Full ISO | Agile Tailoring |
|----------|------------------|
| Formal report | Release retrospective; 1-page: summary, exit criteria met, recommendations |
| Full metrics | Link to dashboard; summarize key numbers |
| Lessons learned | Part of retro; optional section |

### Test Data / Environment Requirements

| Full ISO | Agile Tailoring |
|----------|------------------|
| Formal document | README, runbook, or Confluence page |
| Readiness reports | Checklist; or omit if team self-manages |
| Traceability | Link from test plan or wiki |

---

## Scrum-Specific Patterns

### Sprint Cycle

| Phase | Documents |
|-------|-----------|
| **Sprint Planning** | Sprint Test Plan (lightweight) or Test Approach in sprint goal |
| **Development** | Test cases in backlog; BDD scenarios in code |
| **Daily** | No formal doc; standup covers blockers |
| **Sprint Review** | Demo = informal execution; bugs logged |
| **Sprint Retro** | Update Organizational Test Practices if needed |
| **Release** | Test Completion Report (1-page) if release sign-off required |

### Definition of Done (Testing)

Include in DoD:
- [ ] Test cases written for new/changed features
- [ ] Automated tests in pipeline where applicable
- [ ] No critical/high bugs open for release scope
- [ ] Test execution logged (CI or manual log)
- [ ] Traceability: requirement → test case

### Definition of Ready (Testing)

- [ ] Acceptance criteria defined
- [ ] Test environment available
- [ ] Test data identified
- [ ] Dependencies known

---

## DevOps-Specific Patterns

### Pipeline as Documentation

- **Test Plan** → Quality gates in pipeline (e.g., 80% pass, no critical failures)
- **Test Procedure** → Test code
- **Execution Log** → CI run logs, Allure report
- **Incident Report** → Bug created from failed test; auto-link

### Quality Gates

Define in pipeline config:
- Unit test pass rate
- Integration test pass rate
- Coverage threshold
- Security scan (OWASP, Snyk)
- Performance baseline (optional)

### Dashboards

Replace Test Status Report with:
- Pass/fail trend
- Coverage trend
- Open bugs by severity
- Deployment frequency
- Mean time to recovery (MTTR)

---

## Checklist: Applying Tailoring

- [ ] Context identified: Agile / Scrum / DevOps / Hybrid
- [ ] Document set chosen: Minimal / Hybrid / Full
- [ ] Merged documents listed (e.g., "Test Plan + Level Plans → single doc")
- [ ] Omitted sections documented (e.g., "Readiness reports omitted; checklist in Confluence")
- [ ] Tool integration specified (Jira, Zephyr, CI, etc.)
- [ ] Traceability preserved (requirement → test case → execution → incident)
- [ ] Stakeholder sign-off approach defined (async, PO, formal)
- [ ] Review cadence set (sprint, release, quarterly)

---

## When NOT to Over-Tailor

- **Regulated domains** (medical, finance, aviation): Keep formal documents; tailor format, not content.
- **Contractual requirements**: Customer may require specific ISO documents; confirm before omitting.
- **Audit trail**: If audits occur, ensure tool exports or generated reports satisfy auditors.
- **Distributed teams**: Slightly more documentation helps remote collaboration.
