# Severity and Priority Classification Guide

*Reference for assigning severity and priority to bug reports.*

---

## Severity (Impact)

Severity reflects the **impact** of the defect on the system or user.

| Severity | Definition | Examples |
| -------- | ---------- | -------- |
| **Blocker** | System unusable; blocks testing or deployment | App crashes on launch, login completely broken, data loss |
| **Critical** | Major feature broken; no workaround | Checkout fails for all users, API returns 500 for core endpoint |
| **Major** | Significant feature impaired; workaround exists | Login fails with special chars, search returns wrong results |
| **Minor** | Small defect; limited impact | Typo, minor UI misalignment, non-critical validation |
| **Trivial** | Cosmetic or negligible | Font size off by 1px, redundant message |

### Severity Decision Tree

1. **Blocks deployment or testing?** → Blocker
2. **Core feature completely broken?** → Critical
3. **Core feature impaired with workaround?** → Major
4. **Non-core feature affected?** → Minor
5. **Cosmetic only?** → Trivial

---

## Priority (Urgency)

Priority reflects **when** the defect should be fixed (business/urgency).

| Priority | Definition | Typical Use |
| -------- | ---------- | ----------- |
| **P1** | Fix immediately | Production down, security vulnerability |
| **P2** | Fix in current sprint | Critical for release |
| **P3** | Fix in next sprint | Important but not blocking |
| **P4** | Fix when possible | Low impact |
| **P5** | Backlog / wishlist | Trivial, nice-to-have |

### Priority vs Severity

- **High severity** usually implies **high priority**, but not always
  - Example: Blocker in deprecated feature → P3
- **Low severity** can be **high priority**
  - Example: Legal/compliance typo → P1

---

## Default Mapping (Test Failures)

When deriving from test failures without explicit user input:

| Failure Type | Default Severity | Default Priority |
| ------------ | ---------------- | ----------------- |
| E2E test failure (core flow) | Major | P2 |
| E2E test failure (edge flow) | Minor | P3 |
| Unit test failure | Major | P2 |
| API test failure (4xx/5xx) | Critical if 5xx, Major if 4xx | P2 |
| Visual regression | Minor | P3 |
| Accessibility failure | Major (WCAG) | P2 |
| Performance threshold breach | Major | P2 |

Override when user provides explicit severity/priority.

---

## Component → Label Mapping (GitHub)

Suggested label mapping by component:

| Component | Labels |
| --------- | ------ |
| auth | `bug`, `auth`, `security` |
| api | `bug`, `api`, `backend` |
| frontend | `bug`, `frontend`, `ui` |
| checkout | `bug`, `checkout`, `critical` |
| search | `bug`, `search` |
| mobile | `bug`, `mobile` |

Customize per project; store in skill config or user input.
