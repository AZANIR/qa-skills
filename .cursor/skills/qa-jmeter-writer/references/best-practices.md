# JMeter Best Practices

## Non-GUI Mode

| Do | Don't |
|----|-------|
| Always use `-n` for load tests | Run load tests in GUI mode |
| Disable View Results Tree in load plans | Keep View Results Tree enabled for 1000+ threads |
| Use Aggregate Report, Summary Report | Use listeners that store full response data |
| Set `jmeter.save.saveservice.response_data=false` | Save response data in JTL for load runs |

**Why:** GUI mode consumes significant memory and is not designed for high load. View Results Tree stores every response and causes OOM.

---

## Parameterization

### CSV Data Set Config

| Setting | Recommendation |
|--------|----------------|
| **Sharing mode** | `All threads` for shared data; `Current thread` for unique per user |
| **Delimiter** | `,` (comma) or `\t` (tab) |
| **Recycle on EOF** | `true` for repeated use; `false` to stop when exhausted |
| **Stop thread on EOF** | `true` when recycle=false and you want graceful stop |
| **File path** | Use `${__P(csvPath, default.csv)}` for CI flexibility |

### Unique Data

- Use enough rows for `threads × loops` when recycle=false
- For user simulation: unique emails, usernames per row
- Consider UUID or timestamp in JSR223 for dynamic uniqueness

### Avoid

- Hardcoded URLs, credentials, IDs
- Same data for all users when testing concurrency (e.g., same login)

---

## Correlation

### Order of Execution

1. **Sampler** (e.g., Login) → **PostProcessor** (extract token) → **Next Sampler** (use `${token}`)
2. Extractors must be children of the sampler whose response they parse
3. Use **JSON Extractor** or **Regular Expression Extractor** as PostProcessor

### Variable Scope

- `vars` (JMeterVariables): per-thread, cleared each iteration
- `props` (JMeterProperties): global, shared across threads
- Use `vars.put("name", value)` in JSR223; `${name}` in samplers

### Regex Tips

- Prefer non-greedy: `"token":"([^"]+)"` over `"token":"(.+)"`
- Use `$1$` in Template for first capture group
- Test regex in View Results Tree (debug only) or regex101.com

### JSON Extraction

- Use **JSON Extractor** or **JSR223 PostProcessor** with JsonSlurper
- JSONPath: `$.data.token`, `$.items[0].id`

---

## Result Analysis

### JTL Columns

| Column | Purpose |
|--------|---------|
| `timeStamp` | Request time |
| `elapsed` | Total time (ms) |
| `label` | Sampler name |
| `responseCode` | HTTP status |
| `success` | true/false |
| `bytes` | Response size |
| `latency` | Time to first byte |
| `connect` | Connection time |

### HTML Report

- **Dashboard**: Overview, APDEX, response times, throughput
- **APDEX**: Satisfied (fast), Tolerated (ok), Frustrated (slow)
- **Throughput**: Requests per second
- **Response Times**: Percentiles (90, 95, 99)

### Interpreting Results

| Metric | Good | Investigate |
|--------|------|-------------|
| Error rate | < 1% | > 1% |
| p95 latency | Within SLA | Exceeds SLA |
| Throughput | Meets target | Below target |
| Connect time | Low, stable | High or spiking |

---

## Test Design

### Ramp-Up

- **Rule of thumb**: Ramp-up = 10–20% of total test duration
- Too short: artificial spike, connection storms
- Too long: wastes time before steady state

### Think Time

- Add **Constant Timer** or **Uniform Random Timer** between requests
- Typical: 1–3 seconds for web; 0–500 ms for API
- Omit for throughput-only tests

### Assertions

- Use **Response Assertion** for status codes (200, 201)
- Use **Duration Assertion** for SLA (e.g., 2000 ms)
- Use **JSON Assertion** for API contract validation
- Avoid overly strict assertions that fail on minor variations

### Naming

- Use descriptive **labels** for samplers (e.g., `GET /users`, `POST /login`)
- Labels appear in reports and JTL; avoid generic names like "HTTP Request"

---

## Performance of JMeter Itself

| Tweak | Purpose |
|-------|---------|
| Increase JVM heap | `-Xmx4g` for 5k+ threads |
| Disable unnecessary listeners | Reduce memory and I/O |
| Use `jmeter.save.saveservice.*` to minimize JTL | Smaller files, faster writes |
| Run workers on separate machines | Distribute load, avoid single-node bottleneck |
| Use latest JMeter | Bug fixes, performance improvements |

---

## Security

- Never commit credentials; use `${__P()}` or environment variables
- Use `user.properties` (gitignored) for local overrides
- In CI: use secrets for API keys, tokens
- Test against staging/QA, not production, unless explicitly approved

---

## Integration with QA Skills

| Skill | Use Case |
|-------|----------|
| **qa-plan-creator** | Performance plan → thread groups, duration, load profile |
| **qa-nfr-analyst** | NFR specs → SLA assertions, duration thresholds |
| **qa-api-contract-curator** | OpenAPI → HTTP samplers, JSON assertions |
| **qa-requirements-generator** | Requirements → test scenarios, endpoints |
