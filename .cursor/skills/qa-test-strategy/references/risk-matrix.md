# Risk Assessment Matrix Template

Use this template when populating the risk assessment section of a test strategy. Covers risk categories, scoring, and mitigation strategies.

---

## Risk Categories

| Category | Description | Examples |
| -------- | ----------- | -------- |
| **Technical** | Architecture, integration, performance, security, tooling | New tech stack, third-party APIs, legacy integration |
| **Business** | Requirements, scope, stakeholders, compliance | Vague requirements, scope creep, regulatory deadlines |
| **Process** | Team, schedule, environment, data | Resource turnover, tight timeline, env instability |

---

## Probability × Impact Scoring

### Probability (Likelihood)

| Score | Level | Description |
| ----- | ----- | ----------- |
| 1 | Low | Unlikely; rare occurrence |
| 2 | Medium | Possible; has happened before |
| 3 | High | Likely; frequent or expected |

### Impact (Severity)

| Score | Level | Description |
| ----- | ----- | ----------- |
| 1 | Low | Minor delay; workaround exists |
| 2 | Medium | Notable impact; extra effort to fix |
| 3 | High | Major impact; release blocker or critical defect |

### Risk Score = Probability × Impact

| Score | Risk Level | Action |
| ----- | ---------- | ------ |
| 1 | Low | Monitor; standard testing |
| 2–4 | Medium | Mitigate; add targeted tests |
| 6–9 | High | Actively mitigate; prioritize coverage, exploratory, early testing |

---

## Risk Matrix Template

| ID | Risk | Category | Prob | Impact | Score | Mitigation |
| -- | ---- | -------- | ---- | ------ | ----- | ---------- |
| R1 | [Description] | Technical/Business/Process | 1–3 | 1–3 | P×I | [Strategy] |
| R2 | | | | | | |
| R3 | | | | | | |

---

## Mitigation Strategies by Category

### Technical Risks

| Risk Type | Mitigation |
| --------- | ---------- |
| New technology | Spike/POC; early automation; training |
| Third-party dependency | Contract tests; mock in CI; fallback scenarios |
| Performance | Early load testing; baseline metrics; capacity planning |
| Security | OWASP scan; auth testing; penetration test |
| Legacy integration | Integration tests; compatibility matrix; rollback plan |

### Business Risks

| Risk Type | Mitigation |
| --------- | ---------- |
| Vague requirements | Exploratory testing; early UAT; clarify DoR |
| Scope creep | Change control; impact assessment; regression scope |
| Compliance | Dedicated compliance test plan; audit trail |
| Stakeholder availability | Async reviews; documented sign-off criteria |

### Process Risks

| Risk Type | Mitigation |
| --------- | ---------- |
| Resource turnover | Documentation; pair testing; knowledge sharing |
| Tight timeline | Risk-based prioritization; reduce scope; parallel execution |
| Environment instability | Dedicated env; containerization; env health checks |
| Test data | Synthetic data; masking; refresh strategy |

---

## Example Risk Entries

| ID | Risk | Category | P | I | Score | Mitigation |
| -- | ---- | -------- | - | - | ----- | ---------- |
| R1 | Third-party payment API changes without notice | Technical | 2 | 3 | 6 | Contract tests; mock in CI; monitor changelog |
| R2 | Requirements unclear for checkout flow | Business | 3 | 2 | 6 | Exploratory sessions; early UAT; DoR checklist |
| R3 | Single QA resource; vacation in release week | Process | 2 | 3 | 6 | Cross-train; document runbooks; automate smoke |

---

## Visualization

Use **qa-diagram-generator** with `references/charts.md` (quadrant chart) to visualize risks:
- X-axis: Probability
- Y-axis: Impact
- Quadrants: Low / Medium / High priority
