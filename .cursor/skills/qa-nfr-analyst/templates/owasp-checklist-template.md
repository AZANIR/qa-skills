# OWASP Security Testing Checklist

**Project:** {project name}
**Assessment Date:** {YYYY-MM-DD}
**Tester:** {name}
**Scope:** {URL or API}

---

## A01:2021 – Broken Access Control

- ☐ Vertical privilege escalation (user → admin)
- ☐ Horizontal privilege escalation (user A → user B)
- ☐ Direct object reference (IDOR)
- ☐ Path traversal / file inclusion
- ☐ Missing function-level access control

---

## A02:2021 – Cryptographic Failures

- ☐ Sensitive data transmitted over HTTP
- ☐ Weak or default crypto algorithms
- ☐ Hardcoded secrets or keys
- ☐ Insecure password storage (plaintext, weak hashing)

---

## A03:2021 – Injection

- ☐ SQL injection (all input vectors)
- ☐ NoSQL injection
- ☐ Command injection
- ☐ LDAP / XPath injection
- ☐ Template injection (SSTI)

---

## A04:2021 – Insecure Design

- ☐ Missing threat model
- ☐ Insecure default configuration
- ☐ Business logic flaws

---

## A05:2021 – Security Misconfiguration

- ☐ Default credentials in use
- ☐ Unnecessary features enabled
- ☐ Missing security headers
- ☐ Verbose error messages in production

---

## A06:2021 – Vulnerable Components

- ☐ Outdated dependencies (known CVEs)
- ☐ Unmaintained libraries
- ☐ Unnecessary dependencies

---

## A07:2021 – Auth & Session Failures

- ☐ Weak password policy
- ☐ Session fixation
- ☐ Session not invalidated on logout
- ☐ Predictable session IDs

---

## A08:2021 – Software & Data Integrity

- ☐ Unsigned / unverified updates
- ☐ Deserialization of untrusted data
- ☐ CI/CD pipeline integrity

---

## SSRF & Error Handling

- ☐ Server-Side Request Forgery (SSRF)
- ☐ Stack traces or sensitive data in errors
- ☐ Information disclosure via error messages

---

**Summary:** {X} Passed | {Y} Failed | {Z} N/A
