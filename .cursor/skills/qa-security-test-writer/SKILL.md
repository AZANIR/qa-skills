---
name: qa-security-test-writer
description: Generate security tests based on OWASP Top 10 and WSTG covering injection, XSS, CSRF, authentication bypass, and DAST using ZAP and custom scripts.
output_dir: tests/security
---

# QA Security Test Writer

## Purpose

Write security tests covering OWASP Top 10 vulnerabilities and OWASP WSTG scenarios. Transform NFR security requirements (from qa-nfr-analyst) and application context into executable security test scripts (TypeScript/Python), OWASP ZAP configurations, and vulnerability reports. Support both custom script-based testing and DAST (Dynamic Application Security Testing) via ZAP.

## Trigger Phrases

- "Write security tests for [app/API]"
- "Generate OWASP Top 10 tests"
- "Create ZAP configuration for [target]"
- "Security tests for SQL injection, XSS, CSRF"
- "DAST scan setup with OWASP ZAP"
- "Authentication bypass tests"
- "Security test scripts from NFR analysis"
- "OWASP WSTG test scenarios"

## OWASP Top 10 Coverage

| ID | Category | Test Focus |
|----|----------|------------|
| **A01** | Broken Access Control | IDOR, privilege escalation, path traversal, CORS |
| **A02** | Cryptographic Failures | TLS, weak hashing, sensitive data in transit/rest |
| **A03** | Injection | SQL, NoSQL, OS command, LDAP, XPath, SSTI |
| **A04** | Insecure Design | Business logic flaws, missing security controls |
| **A05** | Security Misconfiguration | Default creds, debug mode, verbose errors, headers |
| **A06** | Vulnerable Components | Dependency scanning, known CVEs |
| **A07** | Identification/Authentication Failures | Weak passwords, session fixation, credential stuffing |
| **A08** | Software/Data Integrity Failures | Unsigned updates, deserialization, CI/CD tampering |
| **A09** | Security Logging/Monitoring Failures | Missing audit logs, insufficient alerting |
| **A10** | Server-Side Request Forgery | SSRF to internal services, cloud metadata |

See `references/owasp-top10.md` for test scenarios and example code per category.

## Tools

| Tool | Purpose |
|------|---------|
| **OWASP ZAP** | DAST scanning, passive/active scan, API scan, authentication |
| **Custom TypeScript** | Supertest/httpx-style API security tests, Playwright for auth flows |
| **Custom Python** | httpx/requests API tests, pytest-based security checks |
| **Playwright** | Authentication bypass, session management, XSS verification |

## Workflow

1. **Read NFR analysis** — From qa-nfr-analyst; extract security criteria and OWASP WSTG baseline
2. **Map OWASP WSTG scenarios** — Align requirements to WSTG test IDs (see qa-nfr-analyst `references/owasp-wstg-baseline.md`)
3. **Generate security test scripts** — TypeScript (Supertest/Playwright) or Python (httpx/pytest)
4. **Configure ZAP** — Active/passive scan, auth, policies (see `references/zap-config.md`)
5. **Run DAST scan** — Execute ZAP; produce vulnerability report

## Test Categories

| Category | Techniques | Tools |
|----------|-------------|-------|
| **SQL Injection** | Union-based, error-based, blind, time-based | Custom scripts, ZAP |
| **XSS** | Reflected, stored, DOM-based | Custom scripts, Playwright, ZAP |
| **CSRF** | Missing token, token reuse, SameSite | Custom scripts, Playwright |
| **Authentication bypass** | Direct access, token manipulation, session fixation | Playwright, Supertest/httpx |
| **Session management** | Timeout, logout, cookie attributes | Custom scripts |
| **Header security** | HSTS, X-Frame-Options, CSP, X-Content-Type-Options | Custom scripts, ZAP |
| **CORS misconfiguration** | Wildcard origin, credential leakage | Custom scripts |
| **File upload** | Extension bypass, content-type spoofing, path traversal | Custom scripts |

## Output

- **Security test scripts** — `tests/security/` or `tests/security/` with TS/Python files
- **ZAP configuration** — `zap-config.yaml` or `.zap/config` for automation
- **Vulnerability report** — Summary of findings with severity, evidence, remediation

## References

- `references/owasp-top10.md` — OWASP Top 10 test scenarios with example test code
- `references/zap-config.md` — OWASP ZAP configuration (active/passive scan, API, auth, policies)
- `references/best-practices.md` — Safe testing, test environments, reporting, remediation

## Scope

**Can do (autonomous):**
- Generate security test scripts from NFR analysis or WSTG scenarios
- Create ZAP configuration for DAST
- Write custom TypeScript/Python tests for injection, XSS, CSRF, auth, headers
- Map OWASP Top 10 to test cases
- Call qa-nfr-analyst for security NFRs when needed
- Use qa-diagram-generator for threat/attack flow diagrams

**Cannot do (requires confirmation):**
- Run scans against production without explicit approval
- Add dependencies not in package.json/requirements.txt
- Override project security policy or scope

**Will not do (out of scope):**
- Execute ZAP or custom tests (user runs them)
- Perform penetration testing beyond automated checks
- Implement security fixes

## Quality Checklist

- [ ] Tests cover OWASP Top 10 categories relevant to the application
- [ ] No hardcoded credentials; use env vars or fixtures
- [ ] Payloads are safe (no destructive SQL/commands)
- [ ] ZAP config targets staging/test environment only
- [ ] Each test has clear assertion (pass = no vulnerability)
- [ ] File naming follows `test_*_security.ts` or `test_*_security.py`
- [ ] References to NFR IDs or WSTG IDs where applicable
- [ ] Vulnerability report includes severity and remediation guidance

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| ZAP scan finds nothing | Target not reachable, auth not configured | Verify base URL; configure ZAP authentication |
| Tests fail with 403 | WAF or rate limiting | Use test env; whitelist test IP; reduce concurrency |
| False positives in ZAP | Aggressive policy, app-specific behavior | Tune scan policy; add context/exclusions |
| XSS payload not reflected | Input sanitization, encoding | Try alternative payloads; check DOM sinks |
| CSRF test passes incorrectly | SameSite=Lax blocks cross-site POST | Use same-origin test or disable SameSite in test |
| Session tests flaky | Short timeout, shared state | Increase timeout; isolate session per test |
