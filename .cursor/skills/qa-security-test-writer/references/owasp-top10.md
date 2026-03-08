# OWASP Top 10 Test Scenarios and Example Code

Test scenarios and example test code for each OWASP Top 10 (2021) category. Use with qa-security-test-writer for generating security tests.

---

## A01: Broken Access Control

**Focus:** IDOR, privilege escalation, path traversal, CORS misconfiguration.

### IDOR (Insecure Direct Object Reference)

```typescript
// TypeScript (Supertest)
describe('A01 - IDOR', () => {
  it('should deny access to other user resources', async () => {
    const userAToken = await getAuthToken('userA');
    const userBResourceId = 'user-b-resource-id';
    const res = await request(app)
      .get(`/api/resources/${userBResourceId}`)
      .set('Authorization', `Bearer ${userAToken}`)
      .expect(403); // or 404 to avoid enumeration
    expect(res.body).not.toHaveProperty('data');
  });
});
```

```python
# Python (httpx)
def test_idor_denies_cross_user_access(client, user_a_token, user_b_resource_id):
    r = client.get(
        f"/api/resources/{user_b_resource_id}",
        headers={"Authorization": f"Bearer {user_a_token}"},
    )
    assert r.status_code in (403, 404)
    assert "data" not in r.json()
```

### Path Traversal

```python
def test_path_traversal_blocked(client):
    payloads = ["../../../etc/passwd", "..%2F..%2F..%2Fetc%2Fpasswd"]
    for payload in payloads:
        r = client.get(f"/api/file?path={payload}")
        assert r.status_code in (400, 403, 404)
        assert "root:" not in r.text
```

---

## A02: Cryptographic Failures

**Focus:** TLS, weak hashing, sensitive data over HTTP.

### TLS and Security Headers

```typescript
describe('A02 - Cryptographic Failures', () => {
  it('should serve over HTTPS only', async () => {
    const res = await request('http://localhost:3000').get('/');
    expect(res.status).toBe(301);
    expect(res.headers.location).toMatch(/^https:\/\//);
  });

  it('should set HSTS header', async () => {
    const res = await request(app).get('/').expect(200);
    expect(res.headers['strict-transport-security']).toBeDefined();
    expect(res.headers['strict-transport-security']).toMatch(/max-age=\d+/);
  });
});
```

```python
def test_no_sensitive_data_over_http(base_url_http):
    r = httpx.get(f"{base_url_http}/api/login", follow_redirects=True)
    assert r.url.scheme == "https"
```

---

## A03: Injection

**Focus:** SQL, NoSQL, OS command, LDAP, XPath, SSTI.

### SQL Injection

```typescript
describe('A03 - SQL Injection', () => {
  const sqlPayloads = [
    "' OR '1'='1",
    "1; DROP TABLE users--",
    "1' UNION SELECT null,null--",
    "1' AND SLEEP(5)--",
  ];

  sqlPayloads.forEach((payload) => {
    it(`should reject SQLi payload: ${payload.substring(0, 20)}...`, async () => {
      const res = await request(app)
        .get(`/api/search?q=${encodeURIComponent(payload)}`)
        .expect((status) => status >= 400 || status === 200);
      // Should not return SQL error or unexpected data
      expect(res.body).not.toMatch(/syntax error|mysql|postgresql|ora-/i);
    });
  });
});
```

```python
def test_sql_injection_blocked(client):
    payloads = ["' OR '1'='1", "1; DROP TABLE users--"]
    for p in payloads:
        r = client.get(f"/api/search", params={"q": p})
        assert r.status_code in (400, 403, 422)
        assert "syntax" not in r.text.lower() and "mysql" not in r.text.lower()
```

### XSS (Reflected)

```python
def test_reflected_xss_blocked(client):
    payload = "<script>alert(1)</script>"
    r = client.get(f"/api/search", params={"q": payload})
    assert payload not in r.text
    assert "&lt;script&gt;" in r.text or "script" not in r.text
```

---

## A04: Insecure Design

**Focus:** Business logic flaws, missing security controls.

```typescript
describe('A04 - Insecure Design', () => {
  it('should enforce workflow order (no step skipping)', async () => {
    const token = await getAuthToken('user');
    const res = await request(app)
      .post('/api/checkout/confirm')
      .set('Authorization', `Bearer ${token}`)
      .send({ orderId: '123' })
      .expect(400); // Should require prior steps
  });
});
```

---

## A05: Security Misconfiguration

**Focus:** Default credentials, debug mode, verbose errors, headers.

```typescript
describe('A05 - Security Misconfiguration', () => {
  it('should not expose stack traces', async () => {
    const res = await request(app).get('/api/nonexistent').expect(404);
    expect(res.body).not.toMatch(/at\s+\w+\.\w+|\.ts:\d+|\.js:\d+/);
  });

  it('should set secure headers', async () => {
    const res = await request(app).get('/').expect(200);
    expect(res.headers['x-content-type-options']).toBe('nosniff');
    expect(res.headers['x-frame-options']).toBeDefined();
  });
});
```

```python
def test_no_debug_info_in_errors(client):
    r = client.get("/api/trigger-error")
    assert "Traceback" not in r.text
    assert "__file__" not in r.text
```

---

## A06: Vulnerable Components

**Focus:** Dependency scanning, known CVEs. Typically handled by npm audit, pip-audit, Snyk, etc. Scripts can verify scan is run:

```typescript
describe('A06 - Vulnerable Components', () => {
  it('should have no high/critical vulnerabilities in lockfile', async () => {
    const { stdout } = await exec('npm audit --audit-level=high');
    expect(stdout).not.toMatch(/found \d+ high/);
  });
});
```

---

## A07: Identification and Authentication Failures

**Focus:** Weak passwords, session fixation, credential stuffing.

### Session Fixation

```typescript
describe('A07 - Authentication Failures', () => {
  it('should issue new session ID after login', async () => {
    const { browser } = await playwright.chromium.launch();
    const page = await browser.newPage();
    const cookiesBefore = await page.context().cookies();
    await page.goto('/login');
    await page.fill('#username', 'test');
    await page.fill('#password', 'Test123!');
    await page.click('button[type=submit]');
    const cookiesAfter = await page.context().cookies();
    const sessionBefore = cookiesBefore.find((c) => c.name === 'sessionId');
    const sessionAfter = cookiesAfter.find((c) => c.name === 'sessionId');
    expect(sessionAfter?.value).not.toBe(sessionBefore?.value);
  });
});
```

### Weak Password Policy

```python
def test_weak_password_rejected(client):
    r = client.post("/api/register", json={
        "email": "test@example.com",
        "password": "123",
    })
    assert r.status_code == 400
    assert "password" in r.json().get("errors", {}).get("password", "").lower()
```

---

## A08: Software and Data Integrity Failures

**Focus:** Unsigned updates, deserialization, CI/CD tampering.

```python
def test_deserialization_safe(client):
    # Send malicious pickle/serialized payload
    r = client.post("/api/import", data=b"\x80\x04...", headers={"Content-Type": "application/octet-stream"})
    assert r.status_code in (400, 415)
```

---

## A09: Security Logging and Monitoring Failures

**Focus:** Missing audit logs, insufficient alerting. Often manual/ops; scripts can verify logging endpoints exist:

```typescript
it('should log failed login attempts', async () => {
  await request(app).post('/api/login').send({ user: 'x', pass: 'y' });
  // Verify log sink received event (mock or integration)
  expect(logSpy).toHaveBeenCalledWith(expect.objectContaining({ event: 'login_failed' }));
});
```

---

## A10: Server-Side Request Forgery (SSRF)

**Focus:** SSRF to internal services, cloud metadata.

```python
def test_ssrf_blocked(client):
    internal_urls = [
        "http://localhost/admin",
        "http://169.254.169.254/latest/meta-data/",
        "http://127.0.0.1:6379/",
    ]
    for url in internal_urls:
        r = client.get("/api/fetch", params={"url": url})
        assert r.status_code in (400, 403, 422)
```

```typescript
describe('A10 - SSRF', () => {
  it('should block internal URL fetch', async () => {
    const res = await request(app)
      .get('/api/proxy?url=' + encodeURIComponent('http://169.254.169.254/'))
      .expect(400);
  });
});
```

---

## Cross-Cutting: XSS (Reflected, Stored, DOM)

### Stored XSS

```python
def test_stored_xss_blocked(client, auth_headers):
    payload = "<img src=x onerror=alert(1)>"
    r = client.post("/api/comments", json={"body": payload}, headers=auth_headers)
    assert r.status_code in (200, 201)
    r2 = client.get("/api/comments")
    assert payload not in r2.text
```

### DOM XSS (Playwright)

```typescript
it('should not execute DOM XSS in hash', async () => {
  const page = await browser.newPage();
  const dialogSpy = page.waitForEvent('dialog');
  await page.goto('/search#' + encodeURIComponent('<img src=x onerror=alert(1)>'));
  await expect(dialogSpy).rejects.toThrow(/timeout/);
});
```

---

## Cross-Cutting: CSRF

```typescript
describe('CSRF', () => {
  it('should require CSRF token for state-changing requests', async () => {
    const res = await request(app)
      .post('/api/transfer')
      .set('Origin', 'https://evil.com')
      .send({ to: 'attacker', amount: 1000 });
    expect(res.status).toBe(403);
  });
});
```

---

## References

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
