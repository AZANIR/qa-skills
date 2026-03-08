# OWASP Web Security Testing Guide — Baseline Scenarios

Baseline security testing scenarios aligned with OWASP WSTG v4.2. Use for NFR security criteria and test case design.

---

## 4.1 Information Gathering

| ID | Scenario | Test Objective |
|----|----------|----------------|
| WSTG-INFO-01 | Conduct Search Engine Discovery | Identify sensitive info exposed via search engines |
| WSTG-INFO-02 | Fingerprint Web Server | Identify server type, version, technologies |
| WSTG-INFO-03 | Review Webserver Metafiles | Check robots.txt, sitemap.xml, .well-known for sensitive paths |
| WSTG-INFO-04 | Enumerate Applications on Webserver | Discover hidden apps, admin panels, backup files |
| WSTG-INFO-05 | Review Webpage Content and Metadata | Extract comments, version info, credentials in source |
| WSTG-INFO-06 | Identify Application Entry Points | Map all inputs: forms, URLs, headers, cookies |
| WSTG-INFO-07 | Map Execution Paths Through Application | Trace user flows and data flow |
| WSTG-INFO-08 | Review File Extensions Handled | Identify handlers for unusual extensions |
| WSTG-INFO-09 | Analyze Web Application Architecture | Document tiers, trust boundaries, data flow |
| WSTG-INFO-10 | Review HTTP Methods | Test allowed methods (GET, POST, PUT, DELETE, etc.) |

---

## 4.2 Configuration and Deployment Management

| ID | Scenario | Test Objective |
|----|----------|----------------|
| WSTG-CONF-01 | Test Network/Infrastructure Configuration | Verify firewall, load balancer, TLS config |
| WSTG-CONF-02 | Test Application Platform Configuration | Check default credentials, sample apps, debug mode |
| WSTG-CONF-03 | Test File Extensions Handling | Verify dangerous extensions blocked |
| WSTG-CONF-04 | Review Old, Backup, Unreferenced Files | Find backup, temp, old files |
| WSTG-CONF-05 | Enumerate Infrastructure and Admin Interfaces | Discover admin, debug, monitoring endpoints |
| WSTG-CONF-06 | Test HTTP Methods | Verify unnecessary methods disabled |
| WSTG-CONF-07 | Test HTTP Strict Transport Security | Verify HSTS header, redirect to HTTPS |
| WSTG-CONF-08 | Test RIA Cross Domain Policy | Check crossdomain.xml, clientaccesspolicy.xml |
| WSTG-CONF-09 | Test File Permission | Verify file permissions restrict access |
| WSTG-CONF-10 | Test for Subdomain Takeover | Check dangling DNS records |

---

## 4.3 Identity Management

| ID | Scenario | Test Objective |
|----|----------|----------------|
| WSTG-IDEN-01 | Test Role Definitions | Verify roles and permissions defined correctly |
| WSTG-IDEN-02 | Test User Registration Process | Test registration validation, duplicate handling |
| WSTG-IDEN-03 | Test Account Provisioning Process | Verify provisioning workflows, approval |
| WSTG-IDEN-04 | Testing for Account Enumeration | Check if valid/invalid usernames distinguishable |
| WSTG-IDEN-05 | Testing for Weak or Unenforced Username Policy | Test username rules, predictability |

---

## 4.4 Authentication Testing

| ID | Scenario | Test Objective |
|----|----------|----------------|
| WSTG-ATHN-01 | Testing for Credentials Transported over Encrypted Channel | Verify login over HTTPS only |
| WSTG-ATHN-02 | Testing for Default Credentials | Check default admin/user credentials |
| WSTG-ATHN-03 | Testing for Weak Lock Out Mechanism | Test account lockout, brute-force protection |
| WSTG-ATHN-04 | Testing for Bypassing Authentication Schema | Test direct object reference, token manipulation |
| WSTG-ATHN-05 | Testing for Vulnerable Remember Password | Test secure storage of credentials |
| WSTG-ATHN-06 | Testing for Browser Cache Weaknesses | Verify sensitive data not cached |
| WSTG-ATHN-07 | Testing for Weak Password Policy | Test password complexity, history |
| WSTG-ATHN-08 | Testing for Weak Security Question/Answer | Test predictability of security questions |
| WSTG-ATHN-09 | Testing for Weak Password Change or Reset | Test reset flow for token predictability |
| WSTG-ATHN-10 | Testing for Weaker Authentication in Alternative Channel | Test fallback auth (e.g., SMS) |

---

## 4.5 Authorization (Access Control) Testing

| ID | Scenario | Test Objective |
|----|----------|----------------|
| WSTG-ATHZ-01 | Testing Directory Traversal/File Include | Test path traversal (../, absolute paths) |
| WSTG-ATHZ-02 | Testing for Bypassing Authorization Schema | Test horizontal/vertical privilege escalation |
| WSTG-ATHZ-03 | Testing for Privilege Escalation | Test role elevation, IDOR |
| WSTG-ATHZ-04 | Testing for Insecure Direct Object References | Test predictable IDs, access to others' data |
| WSTG-ATHZ-05 | Testing for Missing Function Level Access Control | Test direct access to admin functions |

---

## 4.6 Session Management Testing

| ID | Scenario | Test Objective |
|----|----------|----------------|
| WSTG-SESS-01 | Testing for Session Management Schema | Verify session ID entropy, lifecycle |
| WSTG-SESS-02 | Testing for Cookie Attributes | Check HttpOnly, Secure, SameSite |
| WSTG-SESS-03 | Testing for Session Fixation | Test session ID reuse after login |
| WSTG-SESS-04 | Testing for Exposed Session Variables | Check session data in URL, logs |
| WSTG-SESS-05 | Testing for Cross-Site Request Forgery | Test CSRF tokens, SameSite cookies |
| WSTG-SESS-06 | Testing for Logout Functionality | Verify session invalidation on logout |
| WSTG-SESS-07 | Testing for Session Timeout | Verify timeout and re-auth |
| WSTG-SESS-08 | Testing for Session Puzzling | Test session variable confusion |
| WSTG-SESS-09 | Testing for Session Hijacking | Test session fixation, prediction |

---

## 4.7 Input Validation Testing (Injection)

| ID | Scenario | Test Objective |
|----|----------|----------------|
| WSTG-INPV-01 | Testing for Reflected Cross-Site Scripting (XSS) | Test reflected XSS in all inputs |
| WSTG-INPV-02 | Testing for Stored Cross-Site Scripting (XSS) | Test stored XSS in persistent storage |
| WSTG-INPV-03 | Testing for HTTP Verb Tampering | Test method override, verb confusion |
| WSTG-INPV-04 | Testing for HTTP Parameter Pollution | Test duplicate parameters, HPP |
| WSTG-INPV-05 | Testing for SQL Injection | Test SQLi in all query inputs |
| WSTG-INPV-06 | Testing for LDAP Injection | Test LDAP filter injection |
| WSTG-INPV-07 | Testing for XML Injection | Test XXE, XPath injection |
| WSTG-INPV-08 | Testing for SSI Injection | Test server-side includes |
| WSTG-INPV-09 | Testing for XPath Injection | Test XPath in XML queries |
| WSTG-INPV-10 | Testing for IMAP/SMTP Injection | Test mail-related injection |
| WSTG-INPV-11 | Testing for Code Injection | Test OS command, script injection |
| WSTG-INPV-12 | Testing for Local File Inclusion | Test LFI, path traversal |
| WSTG-INPV-13 | Testing for Remote File Inclusion | Test RFI |
| WSTG-INPV-14 | Testing for Command Injection | Test OS command injection |
| WSTG-INPV-15 | Testing for Format String Injection | Test format string bugs |
| WSTG-INPV-16 | Testing for Incubated Vulnerability | Test delayed/stored injection |
| WSTG-INPV-17 | Testing for HTTP Splitting/Smuggling | Test CRLF, request smuggling |
| WSTG-INPV-18 | Testing for Host Header Injection | Test Host header manipulation |
| WSTG-INPV-19 | Testing for Server-Side Template Injection | Test SSTI in templating engines |
| WSTG-INPV-20 | Testing for Server-Side Request Forgery | Test SSRF to internal resources |

---

## 4.8 Error Handling Testing

| ID | Scenario | Test Objective |
|----|----------|----------------|
| WSTG-ERRH-01 | Testing for Improper Error Handling | Verify no stack traces, paths, versions in errors |
| WSTG-ERRH-02 | Testing for Stack Traces | Ensure stack traces disabled in production |
| WSTG-ERRH-03 | Testing for Improper Error Handling - Oracle | Test error-based information disclosure |
| WSTG-ERRH-04 | Testing for Improper Error Handling - Empty Responses | Test empty/blank error responses |
| WSTG-ERRH-05 | Testing for Improper Error Handling - SQL | Test SQL error disclosure |
| WSTG-ERRH-06 | Testing for Improper Error Handling - XML | Test XML error disclosure |

---

## 4.9 Cryptography Testing

| ID | Scenario | Test Objective |
|----|----------|----------------|
| WSTG-CRYP-01 | Testing for Weak Transport Layer Security | Verify TLS 1.2+, strong ciphers, no SSL |
| WSTG-CRYP-02 | Testing for Padding Oracle | Test padding oracle in crypto |
| WSTG-CRYP-03 | Testing for Sensitive Data Sent via Unencrypted Channels | Verify no sensitive data over HTTP |
| WSTG-CRYP-04 | Testing for Weak Encryption | Check algorithm strength, key management |
| WSTG-CRYP-05 | Testing for Insufficient Entropy | Test PRNG, session ID entropy |

---

## 4.10 Business Logic Testing

| ID | Scenario | Test Objective |
|----|----------|----------------|
| WSTG-BUSL-01 | Test Business Logic Data Validation | Test workflow bypass, negative amounts |
| WSTG-BUSL-02 | Test Ability to Forge Requests | Test parameter tampering, replay |
| WSTG-BUSL-03 | Test Integrity Checks | Test checksum, signature bypass |
| WSTG-BUSL-04 | Test for Process Timing | Test race conditions, TOCTOU |
| WSTG-BUSL-05 | Test for Function-Specific Input Validation | Test business rule enforcement |
| WSTG-BUSL-06 | Test for Content Spoofing | Test content injection, defacement |
| WSTG-BUSL-07 | Test for Application Logic Flaws | Test workflow, state machine bypass |
| WSTG-BUSL-08 | Test for Upload of Unexpected File Types | Test file upload validation |
| WSTG-BUSL-09 | Test for Upload of Malicious Files | Test malware upload, polyglot files |

---

## 4.11 Client-Side Testing

| ID | Scenario | Test Objective |
|----|----------|----------------|
| WSTG-CLNT-01 | Testing for DOM-Based Cross-Site Scripting | Test DOM XSS, client-side injection |
| WSTG-CLNT-02 | Testing for JavaScript Execution | Test script injection in sinks |
| WSTG-CLNT-03 | Testing for HTML Injection | Test HTML injection, attribute injection |
| WSTG-CLNT-04 | Testing for Client-Side URL Redirect | Test open redirect, parameter injection |
| WSTG-CLNT-05 | Testing for CORS Misconfiguration | Test CORS origin validation |
| WSTG-CLNT-06 | Testing for Cross-Domain Data Leakage | Test postMessage, CORS leakage |
| WSTG-CLNT-07 | Testing for Cross-Site Flashing | Test Flash-based XSS |
| WSTG-CLNT-08 | Testing for Clickjacking | Test X-Frame-Options, frame busting |
| WSTG-CLNT-09 | Testing for WebSocket Security | Test WebSocket auth, message validation |
| WSTG-CLNT-10 | Testing for Web Messaging | Test postMessage origin validation |
| WSTG-CLNT-11 | Testing for Browser Storage | Test localStorage/sessionStorage for sensitive data |
| WSTG-CLNT-12 | Testing for Cross-Site Script Inclusion | Test XSSI, JSONP callback injection |

---

## Baseline Test Set (Minimum)

For NFR security criteria, prioritize:

1. **Injection**: WSTG-INPV-01, 02, 05 (XSS, SQLi)
2. **Authentication**: WSTG-ATHN-01, 03, 07 (TLS, lockout, password policy)
3. **Session**: WSTG-SESS-02, 05, 06 (cookies, CSRF, logout)
4. **Access Control**: WSTG-ATHZ-02, 04 (privilege escalation, IDOR)
5. **Cryptography**: WSTG-CRYP-01, 03 (TLS, unencrypted channels)
6. **Error Handling**: WSTG-ERRH-01, 02 (no info disclosure)

---

## References

- [OWASP WSTG v4.2](https://owasp.org/www-project-web-security-testing-guide/v42/)
- [OWASP WSTG Stable](https://owasp.org/www-project-web-security-testing-guide/stable/)
- [OWASP Testing Guide GitHub](https://github.com/OWASP/wstg)
