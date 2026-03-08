# OWASP ZAP Configuration

Configuration guide for OWASP ZAP (Zed Attack Proxy) for DAST scanning. Use with qa-security-test-writer when generating ZAP automation configs.

---

## Overview

| Mode | Purpose |
|------|---------|
| **Passive scan** | Observe traffic; detect issues without sending attack payloads |
| **Active scan** | Send probes to find vulnerabilities (injection, XSS, etc.) |
| **API scan** | Target OpenAPI/Swagger-defined endpoints |
| **AJAX spider** | Crawl SPAs and dynamic content |

---

## Basic Configuration

### Target URL

```yaml
# zap-config.yaml (conceptual)
target:
  url: "https://staging.example.com"
  include: ["https://staging.example.com/*"]
  exclude: ["https://staging.example.com/logout", "https://staging.example.com/admin/dangerous"]
```

### Command-Line (Docker)

```bash
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t https://staging.example.com \
  -r zap-report.html
```

```bash
# Full scan (active + passive)
docker run -t owasp/zap2docker-stable zap-full-scan.py \
  -t https://staging.example.com \
  -r zap-report.html
```

---

## Scan Policies

### Policy Levels

| Policy | Risk | Description |
|--------|------|-------------|
| **Low** | Lower false positives, may miss issues |
| **Medium** | Balanced |
| **High** | More thorough, more false positives |

### Custom Policy (API)

```python
# Python ZAP API example
import zapv2

zap = zapv2.ZAPv2(apikey='your-api-key', proxies={'http': 'http://127.0.0.1:8080'})

# Enable/disable specific scanners
zap.ascan.enable_all_scanners()
zap.ascan.disable_scanners(['40018'])  # Disable specific scanner ID

# Set scan policy
zap.ascan.set_scanner_alert_threshold('40018', 'HIGH')  # SQL Injection
```

### Scanner IDs (Common)

| ID | Scanner |
|----|---------|
| 40018 | SQL Injection |
| 40014 | Cross Site Scripting (Reflected) |
| 40016 | Cross Site Scripting (Persistent) |
| 40012 | Cross Site Scripting (DOM) |
| 90011 | Content Security Policy |
| 90033 | X-Content-Type-Options |
| 40009 | Path Traversal |

---

## Authentication

### Form-Based Authentication

```yaml
auth:
  type: form
  login_url: "https://staging.example.com/login"
  login_request:
    method: POST
    url: "https://staging.example.com/login"
    body: "username={%username%}&password={%password%}"
  logout:
    url: "https://staging.example.com/logout"
  credentials:
    username: "${TEST_USER}"
    password: "${TEST_PASSWORD}"
```

### JSON API Authentication

```yaml
auth:
  type: json
  login_url: "https://staging.example.com/api/auth/login"
  login_request:
    method: POST
    body: '{"email":"{%username%}","password":"{%password%}"}'
  token_extract:
    from: response.body
    json_path: "$.token"
  token_usage:
    header: "Authorization"
    value: "Bearer {%token%}"
```

### Script-Based Authentication (ZAP API)

```python
# Configure auth via ZAP API
zap.authentication.set_authentication_method(
    contextid='1',
    authmethodname='formBasedAuthentication',
    authmethodconfigparams='loginUrl=https://staging.example.com/login' +
        '&loginRequestData=username%3D%7B%25username%25%7D%26password%3D%7B%25password%25%7D'
)
zap.users.new_user(contextid='1', name='TestUser')
zap.users.set_authentication_credentials(
    contextid='1', userid='0',
    authcredentialsconfigparams='username=testuser&password=TestPass123!'
)
zap.users.set_user_enabled(contextid='1', userid='0', enabled='true')
```

---

## API Scan

### OpenAPI/Swagger

```bash
# ZAP with OpenAPI definition
docker run -t owasp/zap2docker-stable zap-api-scan.py \
  -t https://staging.example.com \
  -f openapi \
  -d openapi.json \
  -r zap-api-report.html
```

```yaml
# Config for API scan
api_scan:
  definition_url: "https://staging.example.com/openapi.json"
  # or local file path
  definition_file: "./openapi.json"
  target_url: "https://staging.example.com"
```

---

## Passive Scan

- Runs by default when proxying or spidering
- No attack payloads; analyzes requests/responses
- Detects: missing security headers, sensitive data exposure, cookie flags

### Passive Scan Tuning

```python
# Enable all passive scanners
zap.pscan.enable_all_scanners()

# Set alert threshold for a passive rule
zap.pscan.set_scanner_alert_threshold('10021', 'HIGH')  # Content-Type
```

---

## Active Scan

- Sends probes to find vulnerabilities
- **Always run against test/staging only**
- Can be destructive; configure exclusions

### Active Scan Scope

```python
# Scan only in-scope URLs
zap.ascan.scan(url='https://staging.example.com/api', recurse=True)

# Exclude sensitive paths
zap.context.exclude_from_context(contextname='Default', regex='https://staging.example.com/admin/.*')
```

---

## Headless / CI Integration

### GitHub Actions Example

```yaml
- name: ZAP Baseline Scan
  uses: zaproxy/action-baseline@v0.10.0
  with:
    target: 'https://staging.example.com'
    rules_file_name: '.zap/rules.tsv'
    fail_action: true
```

### Zaproxy Jenkins Plugin

- Configure target URL, auth, and scan policy
- Publish HTML/XML report
- Fail build on high/critical findings

---

## Report Output

| Format | Use Case |
|--------|----------|
| HTML | Human review |
| JSON | CI parsing, custom tooling |
| XML | JUnit-style, SARIF |

```bash
# Generate multiple formats
zap-full-scan.py -t https://staging.example.com \
  -r report.html \
  -J report.json \
  -x report.xml
```

---

## Best Practices

1. **Never scan production** without explicit approval and change window
2. **Use test credentials** stored in env vars; never hardcode
3. **Exclude destructive endpoints** (delete, reset, admin actions)
4. **Whitelist test environment** in WAF/firewall to avoid blocking
5. **Tune false positives** by adjusting policy or excluding known-safe patterns
6. **Run during off-peak** to minimize impact on shared staging

---

## References

- [ZAP Docker](https://www.zaproxy.org/docs/docker/)
- [ZAP API](https://www.zaproxy.org/docs/api/)
- [ZAP Jenkins Plugin](https://plugins.jenkins.io/zaproxy/)
- [ZAP GitHub Action](https://github.com/zaproxy/action-baseline)
