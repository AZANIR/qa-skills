# Testing Types Reference

Reference for all testing types with descriptions, tools, and when to apply. Use this when selecting and justifying testing types in a test strategy.

---

## Functional Testing

### Unit Testing
| Attribute | Detail |
| --------- | ------ |
| **Description** | Tests individual units (functions, methods, classes) in isolation with mocks/stubs |
| **Tools** | Jest, Vitest, pytest, JUnit, NUnit, xUnit |
| **When to Apply** | All projects; highest volume in pyramid; developer-owned |
| **Coverage Target** | 70–80% for critical paths |

### Integration Testing
| Attribute | Detail |
| --------- | ------ |
| **Description** | Tests interactions between components, modules, or services |
| **Tools** | Supertest, pytest, TestContainers, WireMock |
| **When to Apply** | API contracts, DB interactions, service-to-service calls |
| **Coverage Target** | ~20% of test suite |

### End-to-End (E2E) Testing
| Attribute | Detail |
| --------- | ------ |
| **Description** | Tests full user journeys through the system from UI to backend |
| **Tools** | Playwright, Cypress, Selenium, WebdriverIO, CodeceptJS |
| **When to Apply** | Critical flows, smoke, release validation |
| **Coverage Target** | ~10%; focus on happy paths and high-risk flows |

### API Testing
| Attribute | Detail |
| --------- | ------ |
| **Description** | Tests REST/GraphQL/gRPC endpoints for correctness, status codes, payloads |
| **Tools** | Supertest, Postman, REST Assured, httpx, Pact |
| **When to Apply** | API-first apps, microservices, contract validation |
| **Coverage Target** | All public endpoints |

---

## Non-Functional Testing

### Performance Testing
| Attribute | Detail |
| --------- | ------ |
| **Description** | Load, stress, spike, endurance testing; measures response time, throughput |
| **Tools** | k6, Locust, JMeter, Gatling, Artillery |
| **When to Apply** | Before release; after major changes; SLA validation |
| **Coverage Target** | Critical user paths, peak load scenarios |

### Security Testing
| Attribute | Detail |
| --------- | ------ |
| **Description** | Vulnerability scanning, OWASP checks, auth/authz, injection, XSS |
| **Tools** | OWASP ZAP, Burp Suite, Snyk, npm audit, Bandit |
| **When to Apply** | Pre-release; after auth changes; compliance requirements |
| **Coverage Target** | Per OWASP WSTG baseline |

### Accessibility Testing
| Attribute | Detail |
| --------- | ------ |
| **Description** | WCAG compliance; screen reader, keyboard, contrast, ARIA |
| **Tools** | axe-core, Pa11y, Lighthouse, WAVE |
| **When to Apply** | Public-facing apps; regulated industries |
| **Coverage Target** | All public pages; WCAG 2.2 AA minimum |

### Visual Regression Testing
| Attribute | Detail |
| --------- | ------ |
| **Description** | Pixel/screenshot comparison to detect unintended UI changes |
| **Tools** | Playwright screenshots, Percy, Chromatic, BackstopJS |
| **When to Apply** | UI-heavy apps; design system changes |
| **Coverage Target** | Key pages and components |

---

## Specialized Testing

### Contract Testing
| Attribute | Detail |
| --------- | ------ |
| **Description** | Validates API contracts between consumer and provider |
| **Tools** | Pact, Spring Cloud Contract |
| **When to Apply** | Microservices; independent deployments |
| **Coverage Target** | All consumer-provider pairs |

### Mobile Testing
| Attribute | Detail |
| --------- | ------ |
| **Description** | Native/hybrid app testing on iOS/Android; device fragmentation |
| **Tools** | Appium, Detox, Maestro, XCTest, Espresso |
| **When to Apply** | Mobile apps; cross-device validation |
| **Coverage Target** | Critical flows on representative devices |

---

## Execution-Based Testing

### Smoke Testing
| Attribute | Detail |
| --------- | ------ |
| **Description** | Quick sanity check that core functionality works after deploy |
| **Tools** | Same as E2E (Playwright, Cypress, etc.) |
| **When to Apply** | After every deployment; CI gate |
| **Coverage Target** | 5–15 critical paths; < 15 min |

### Sanity Testing
| Attribute | Detail |
| --------- | ------ |
| **Description** | Narrow, focused test of changed areas |
| **Tools** | Manual or automated; subset of regression |
| **When to Apply** | After hotfixes; quick validation |
| **Coverage Target** | Changed modules only |

### Regression Testing
| Attribute | Detail |
| --------- | ------ |
| **Description** | Full or partial re-test to ensure no unintended breakage |
| **Tools** | Automated suite; risk-based selection |
| **When to Apply** | Before release; after major merges |
| **Coverage Target** | Risk-based; high-risk + changed areas |

### Exploratory Testing
| Attribute | Detail |
| --------- | ------ |
| **Description** | Unscripted, session-based testing; learning and discovery |
| **Tools** | Session sheets, heuristics, charters |
| **When to Apply** | New features; complex flows; high-risk areas |
| **Coverage Target** | Time-boxed sessions; charter-driven |

---

## Selection Matrix

| Project Type | Primary Types | Secondary Types |
| ------------ | ------------- | ---------------- |
| Web app | Unit, Integration, E2E, API | Performance, Accessibility, Visual |
| Mobile app | Unit, E2E (Appium), API | Performance, Security |
| API-only | Unit, Integration, API, Contract | Performance, Security |
| Microservices | Unit, Integration, Contract, API | Performance, Security |
| Legacy | Smoke, Regression, Exploratory | Integration where possible |
