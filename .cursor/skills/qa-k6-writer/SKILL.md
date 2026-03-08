---
name: qa-k6-writer
description: Generate k6 performance tests in JavaScript for load, stress, soak, and spike testing with thresholds, scenarios, checks, and CI-friendly output.
output_dir: tests/performance
---

# QA k6 Writer

## Purpose

Write k6 performance tests from test case specifications and performance plans. Transform structured performance requirements (from qa-nfr-analyst, qa-plan-creator performance plans) into executable k6 scripts with scenarios, thresholds, checks, and CI-friendly output.

## Trigger Phrases

- "Write k6 tests for [API/endpoint]"
- "Generate k6 load tests from performance plan"
- "Create k6 stress tests for [service]"
- "Add k6 soak tests with thresholds"
- "k6 spike test for [endpoint]"
- "Performance tests with k6 scenarios"
- "k6 smoke test for [API]"
- "Breakpoint testing with k6"
- "k6 tests with custom metrics"
- "k6 CI integration for GitHub Actions"

## Test Types

| Type | Purpose | Key Characteristics |
|------|---------|---------------------|
| **Load testing** | Validate behavior under expected load | Steady VUs, target throughput |
| **Stress testing** | Find breaking point | Ramp up until failure |
| **Soak testing** | Detect memory leaks, degradation | Sustained load over hours |
| **Spike testing** | Sudden traffic surge | Sharp ramp up/down |
| **Smoke testing** | Quick sanity check | 1–5 VUs, minimal duration |
| **Breakpoint testing** | Find capacity limit | Incremental load until threshold fails |

## Key Features

| Feature | Description |
|---------|-------------|
| **JavaScript ES6** | Standard JS syntax; no transpilation required |
| **Scenarios** | Multiple executors: shared-iterations, per-vu-iterations, constant-arrival-rate, ramping-arrival-rate, externally-controlled |
| **Thresholds** | Pass/fail criteria: `http_req_duration`, `http_req_failed`, custom metrics |
| **Checks** | Assertions: `check(res, { 'status is 200': (r) => r.status === 200 })` |
| **Stages** | Ramp-up, steady, ramp-down for realistic load profiles |
| **Custom metrics** | Trend, Rate, Counter, Gauge for business metrics |
| **Protocols** | HTTP, WebSocket, gRPC |

## Workflow

1. **Read performance test plan** — From qa-plan-creator (performance plan) or qa-nfr-analyst (NFR specs)
2. **Define scenarios** — Map load profiles to k6 scenarios with appropriate executors
3. **Set thresholds** — Translate SLAs (p95, error rate) into threshold expressions
4. **Generate k6 script** — Produce `.js` file with `export default function`, HTTP calls, checks, groups
5. **Configure output** — JSON, CSV, InfluxDB, Prometheus, or CI-friendly summary

## Context7 MCP

Use **Context7 MCP** for k6 documentation when:
- Scenario executor options or syntax are uncertain
- Threshold expressions or custom metrics need verification
- WebSocket, gRPC, or advanced options require clarification
- Output format or CI integration details are needed

## Key Patterns

| Pattern | Usage |
|---------|-------|
| `export default function(options)` | Main entry; receives `options` (env, etc.) |
| `http.get(url)` / `http.post(url, body)` | HTTP requests; returns response |
| `check(res, assertions)` | Assertions; returns boolean; does not fail test |
| `sleep(duration)` | Think time between actions |
| `group(name, fn)` | Logical grouping; metrics tagged by group |
| `Trend`, `Rate`, `Counter`, `Gauge` | Custom metrics |
| `scenarios` in options | Define executor-based scenarios |

### Threshold Examples

```javascript
thresholds: {
  'http_req_duration': ['p(95)<200', 'p(99)<500'],
  'http_req_failed': ['rate<0.01'],
  'http_reqs': ['count>1000'],
}
```

### Scenario Executors

| Executor | Use Case |
|----------|----------|
| `shared-iterations` | Fixed total iterations across all VUs |
| `per-vu-iterations` | Each VU runs N iterations |
| `constant-arrival-rate` | Fixed request rate (RPS) |
| `ramping-arrival-rate` | Ramping RPS (stress/spike) |
| `externally-controlled` | Control VUs from external source |

See `references/patterns.md` for load profiles, scenario executors, thresholds, custom metrics, groups.

## Output

- **k6 scripts** — `.js` files in `tests/` or `performance/` per project convention
- **CI config** — GitHub Actions workflow for `k6 run`, threshold pass/fail

## Scope

**Can do (autonomous):**
- Generate k6 scripts from performance plans and NFR specs
- Define scenarios with appropriate executors (load, stress, soak, spike)
- Set thresholds from SLAs (p95, p99, error rate)
- Add checks for status codes and response validation
- Use stages for ramping; custom metrics (Trend, Rate, Counter, Gauge)
- Support HTTP, WebSocket, gRPC
- Generate GitHub Actions CI workflow for k6
- Use Context7 MCP for k6 docs

**Cannot do (requires confirmation):**
- Change production service configuration
- Add dependencies not in package.json
- Override project k6 config without approval
- Target production without explicit consent

**Will not do (out of scope):**
- Execute tests (user runs `k6 run script.js`)
- Write E2E functional tests (use qa-playwright-ts-writer)
- Modify CI/CD pipelines beyond k6 integration
- Provision load infrastructure (k6 Cloud, etc.)

## References

- `references/patterns.md` — Load profiles, scenario executors, thresholds, custom metrics, groups
- `references/config.md` — options, scenarios, stages, thresholds, output formats
- `references/best-practices.md` — Realistic load, correlation, parameterization, CI integration

## Quality Checklist

- [ ] Scenarios match performance plan load profiles
- [ ] Thresholds reflect SLAs (p95, p99, error rate)
- [ ] Checks validate critical responses; use `threshold` for pass/fail
- [ ] Think time (sleep) between requests where realistic
- [ ] No hardcoded secrets; use `__ENV` or options
- [ ] Groups used for logical metric segmentation
- [ ] Output format suitable for CI (JSON summary or exit code)
- [ ] Stages/ramping match test type (stress = ramp up, soak = steady)

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Thresholds fail in CI | Different baseline or env | Align thresholds with target env; use env-specific config |
| High `http_req_failed` | Timeouts, 5xx, or wrong assertions | Increase timeout; fix check logic; verify endpoint |
| VUs not ramping as expected | Wrong executor or stage config | Use `ramping-vus` or `ramping-arrival-rate` for stress |
| Metrics not tagged | Missing groups | Wrap logic in `group('name', () => { ... })` |
| Script fails to run | ES module or import error | Use `export default`; ensure k6-compatible imports |
| WebSocket/gRPC errors | Protocol-specific setup | Use `k6/experimental/grpc` or `k6/ws`; check Context7 docs |
| CI exit code 0 despite failures | Thresholds not enforced | Ensure `--threshold` or options.thresholds set; k6 exits non-zero on threshold fail |
