# Security Testing Best Practices

Best practices for safe, effective security testing. Use with qa-security-test-writer when generating tests and configuring scans.

---

## Safe Testing

### Payload Safety

| Do | Don't |
|----|-------|
| Use read-only or non-destructive payloads | Use `DROP TABLE`, `rm -rf`, or similar |
| Test in isolated test/staging environments | Run against production without approval |
| Use parameterized/safe SQL for comparison | Execute raw attacker payloads against real DB |
| Verify rejection/encoding, not exploitation | Attempt to actually exfiltrate data |

### Example: Safe SQL Injection Test

```python
# Good: Verify app rejects or sanitizes
def test_sqli_rejected(client):
    r = client.get("/api/search", params={"q": "' OR '1'='1"})
    assert r.status_code in (400, 403, 422)
    # Do NOT actually expect to retrieve all rows

# Bad: Expecting to bypass and get data
def test_sqli_bad(client):
    r = client.get("/api/search", params={"q": "' OR 1=1--"})
    assert len(r.json()["results"]) > 0  # Never assert success of attack
```

### Credentials and Secrets

- Store test credentials in `.env` or CI secrets
- Never commit passwords, API keys, or tokens
- Use separate test accounts with minimal privileges
- Rotate test credentials periodically

---

## Test Environments

### Environment Isolation

| Environment | Use For | Scan Type |
|-------------|---------|-----------|
| **Local** | Unit/integration security tests | Custom scripts only |
| **Staging** | DAST, full security suite | ZAP, custom scripts |
| **Production** | Never for active security testing | Passive monitoring only (if approved) |

### Pre-Scan Checklist

- [ ] Target is staging/test, not production
- [ ] WAF/firewall allows test IP or is disabled in test env
- [ ] Test accounts exist and credentials are in env vars
- [ ] Destructive endpoints (delete, reset) are excluded
- [ ] Scan window communicated to team (if shared env)

---

## Reporting

### Vulnerability Report Structure

```
1. Executive Summary
   - Scope, dates, high-level findings count

2. Findings by Severity
   - Critical, High, Medium, Low, Informational

3. Per Finding
   - Title, CWE, OWASP category
   - Description, evidence (request/response snippets)
   - Affected URL/parameter
   - Remediation guidance
   - References (CWE, OWASP, etc.)

4. Appendix
   - Scan config, tools, versions
   - Exclusions and scope
```

### Severity Mapping

| Severity | Typical Response |
|----------|------------------|
| Critical | Fix before release; block deployment |
| High | Fix in current sprint |
| Medium | Plan fix; accept risk if documented |
| Low | Backlog; fix when convenient |
| Informational | Review; no mandatory fix |

### False Positive Handling

- Document why a finding is a false positive
- Add exclusion in ZAP context or scan policy
- Re-verify after app changes
- Do not ignore without documentation

---

## Remediation Guidance

### Common Remediation Patterns

| Vulnerability | Remediation |
|---------------|-------------|
| **SQL Injection** | Parameterized queries, ORM, input validation |
| **XSS** | Output encoding, CSP, sanitization (DOMPurify, etc.) |
| **CSRF** | CSRF tokens, SameSite cookies, double-submit cookie |
| **Broken Access Control** | Authorization checks on every request, avoid IDOR |
| **Missing Headers** | Add HSTS, X-Frame-Options, X-Content-Type-Options, CSP |
| **Weak Auth** | Strong password policy, MFA, lockout, secure session |
| **Sensitive Data Exposure** | Encrypt at rest/transit, no PII in logs/errors |

### Reference Remediation Sources

- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Secure Coding](https://www.nist.gov/)

---

## Integration with QA Workflow

### CI/CD

- Run security tests in CI on every PR (custom scripts)
- Run ZAP baseline weekly or on release branches
- Fail pipeline on critical/high (configurable)
- Store reports as artifacts

### NFR Traceability

- Link security tests to NFR IDs (e.g., NFR-SEC-001)
- Link to OWASP WSTG IDs (e.g., WSTG-INPV-05)
- Trace findings back to requirements for coverage reporting

### Collaboration

- Share reports with dev and security teams
- Triage findings in sprint planning
- Track remediation in issue tracker
- Re-scan after fixes to verify

---

## References

- [OWASP Testing Guide](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [PTES Technical Guidelines](http://www.pentest-standard.org/)
- [NIST SP 800-115](https://csrc.nist.gov/publications/detail/sp/800-115/final)
