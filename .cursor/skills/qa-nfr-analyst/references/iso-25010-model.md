# ISO/IEC 25010 Product Quality Model Reference

ISO/IEC 25010 defines a product quality model for software and systems. This reference covers the eight core characteristics (ISO 25010:2011) widely used in NFR analysis. ISO 25010:2023 adds Compatibility, renames Usability to Interaction Capability, and introduces Safety.

---

## 1. Performance Efficiency

Degree to which a product performs its functions within stated time and resource constraints.

| Sub-characteristic | Definition | Measurement Examples |
|--------------------|------------|----------------------|
| **Time behavior** | Response time, throughput, processing time | p50/p95/p99 latency (ms), requests/sec, time to first byte |
| **Resource utilization** | Amount of resources used relative to capacity | CPU %, memory MB, disk I/O, network bandwidth |
| **Capacity** | Maximum limits of product parameters | Concurrent users, max throughput, data volume limits |

**Testable criteria:**
- API response time ≤ X ms at p95
- Page load time ≤ Y seconds
- Throughput ≥ Z requests/second under load
- Memory usage ≤ W MB under normal operation

---

## 2. Security

Degree to which a product protects information and data so that persons or other products have the appropriate degree of data access control.

| Sub-characteristic | Definition | Measurement Examples |
|--------------------|------------|----------------------|
| **Confidentiality** | Data accessible only to authorized entities | Encryption at rest/transit, access controls, data masking |
| **Integrity** | Data accuracy and consistency | Checksums, signatures, tamper detection |
| **Non-repudiation** | Actions attributable to entities | Audit logs, digital signatures |
| **Accountability** | Actions traceable to responsible entities | User attribution, audit trails |
| **Authenticity** | Identity of entities can be verified | Authentication, certificate validation |

**Testable criteria:**
- All sensitive data encrypted (TLS 1.2+)
- Authentication required for protected resources
- Audit logs capture critical actions
- Input validation prevents injection

---

## 3. Usability (Interaction Capability in 25010:2023)

Degree to which a product can be used by specified users to achieve specified goals with effectiveness, efficiency, and satisfaction.

| Sub-characteristic | Definition | Measurement Examples |
|--------------------|------------|----------------------|
| **Appropriateness recognizability** | Users can recognize suitability for their needs | Task completion rate, user surveys |
| **Learnability** | Users can learn to use the product | Time to first task, help usage, training time |
| **Operability** | Users can operate and control the product | Error rate, task completion time, clicks to goal |
| **User error protection** | System protects against user errors | Confirmation dialogs, undo, validation feedback |
| **User interface aesthetics** | UI is pleasing and satisfying | SUS score, satisfaction surveys |
| **Accessibility** | Product usable by people with disabilities | WCAG conformance, screen reader compatibility |

**Testable criteria:**
- WCAG 2.2 Level AA conformance
- Task completion rate ≥ X%
- Time to complete key task ≤ Y minutes
- Error recovery available for destructive actions

---

## 4. Reliability

Degree to which a product performs specified functions under specified conditions for a specified period of time.

| Sub-characteristic | Definition | Measurement Examples |
|--------------------|------------|----------------------|
| **Maturity** | Product meets reliability needs under normal use | Defect density, failure rate |
| **Availability** | Product is operational when required | Uptime %, MTBF, planned downtime |
| **Fault tolerance** | Product operates despite hardware/software faults | Graceful degradation, redundancy |
| **Recoverability** | Product can recover data and restore service | RTO, RPO, backup/restore success |

**Testable criteria:**
- Availability ≥ 99.9% (excluding planned maintenance)
- RTO ≤ X minutes
- RPO ≤ Y minutes
- Automatic failover within Z seconds

---

## 5. Maintainability

Degree of effectiveness and efficiency with which a product can be modified.

| Sub-characteristic | Definition | Measurement Examples |
|--------------------|------------|----------------------|
| **Modularity** | Components have minimal coupling | Cyclomatic complexity, coupling metrics |
| **Reusability** | Components can be used in other systems | Component reuse count, API stability |
| **Analysability** | Impact of defects can be diagnosed | Logging, tracing, observability |
| **Modifiability** | Product can be modified without defects | Change impact analysis, regression rate |
| **Testability** | Product can be effectively tested | Test coverage, test execution time |

**Testable criteria:**
- Cyclomatic complexity ≤ 10 per function
- Test coverage ≥ 80% for critical paths
- Deployment time ≤ X minutes
- Documentation exists for public APIs

---

## 6. Portability (Flexibility in 25010:2023)

Degree to which a product can be transferred from one environment to another.

| Sub-characteristic | Definition | Measurement Examples |
|--------------------|------------|----------------------|
| **Adaptability** | Product can be adapted to different environments | Config-driven behavior, environment variables |
| **Installability** | Product can be installed in specified environments | Install success rate, install time |
| **Replaceability** | Product can replace another for the same purpose | API compatibility, migration scripts |

**Testable criteria:**
- Runs on specified OS/browser matrix
- Installation script completes without manual intervention
- Configuration externalized (no hardcoded env-specific values)

---

## 7. Compatibility (25010:2023)

Degree to which a product can exchange information with other products and perform required functions while sharing the same environment.

| Sub-characteristic | Definition | Measurement Examples |
|--------------------|------------|----------------------|
| **Coexistence** | Product functions when other products are present | No conflicts, shared resource handling |
| **Interoperability** | Product can exchange information with other products | API compatibility, data format support |

---

## 8. Functional Suitability

Degree to which a product provides functions that meet stated and implied needs.

| Sub-characteristic | Definition | Measurement Examples |
|--------------------|------------|----------------------|
| **Functional completeness** | All required functions present | Requirement coverage |
| **Functional correctness** | Functions produce correct results | Pass/fail test results |
| **Functional appropriateness** | Functions support the task | User acceptance, task fit |

---

## Quality Attribute Relationships

```
Performance ←→ Security (encryption overhead)
Usability ←→ Accessibility (WCAG)
Reliability ←→ Maintainability (observability)
Portability ←→ Maintainability (modularity)
```

---

## References

- ISO/IEC 25010:2011 Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model
- ISO/IEC 25010:2023 (Edition 2) — Updated model with Compatibility, Safety, Interaction Capability, Flexibility
