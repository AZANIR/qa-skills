---
name: qa-jmeter-writer
description: Generate JMeter performance test plans in XML/JMX format with thread groups, samplers, listeners, assertions, and CI-ready configuration.
output_dir: tests/performance
---

# QA JMeter Writer

## Purpose

Write JMeter test plans (.jmx) from performance test specifications. Transform structured performance requirements (from qa-plan-creator performance plans, qa-nfr-analyst NFR specs) into executable JMeter XML test plans with thread groups, samplers, listeners, assertions, and CI-ready configuration.

## Trigger Phrases

- "Write JMeter tests for [API/endpoint]"
- "Generate JMeter load tests from performance plan"
- "Create JMeter .jmx for [service]"
- "JMeter thread group with HTTP samplers"
- "JMeter test plan with assertions and listeners"
- "JMeter CSV data parameterization"
- "JMeter CI integration non-GUI mode"
- "JMeter distributed load test plan"
- "JMeter JSON assertion for API"
- "JMeter JSR223 Groovy preprocessor"

## Key Features

| Feature | Description |
|---------|-------------|
| **Thread Groups** | Users, ramp-up, loops, duration for load modeling |
| **HTTP Request Sampler** | URL, method, body, headers, path |
| **JDBC/JMS Samplers** | Database and messaging protocol support |
| **Listeners** | Aggregate Report, Summary Report, Graph Results, View Results Tree |
| **Assertions** | Response Assertion, Duration Assertion, Size Assertion, JSON Assertion |
| **CSV Data Set Config** | Parameterization from CSV files |
| **Extractors** | Regular Expression Extractor, JSON Extractor |
| **Timers** | Constant, Uniform Random, Gaussian for think time |
| **Pre/Post Processors** | JSR223 (Groovy), BeanShell for correlation |

## Workflow

1. **Read performance plan** — From qa-plan-creator (performance plan) or qa-nfr-analyst (NFR specs)
2. **Design thread groups** — Map load profiles to Thread Group (users, ramp-up, loops, duration)
3. **Add samplers** — HTTP Request, JDBC, JMS as needed
4. **Configure assertions** — Response, Duration, Size, JSON for validation
5. **Add listeners** — Aggregate Report, Summary Report for results
6. **Generate .jmx** — Produce valid JMeter XML test plan file

## Key Patterns

| Pattern | Usage |
|---------|-------|
| **Thread Group** | `num_threads`, `ramp_time`, `loops`, `duration` for load modeling |
| **HTTP Request** | Domain, path, method, body, headers |
| **Response Assertion** | Status code, response text, response code |
| **Duration Assertion** | Max response time (ms) |
| **JSON Assertion** | JSONPath, expected value |
| **CSV Data Set Config** | Filename, variable names, delimiter |
| **Regular Expression Extractor** | Regex, template, match number, variable |
| **JSR223 PreProcessor** | Groovy script for correlation |

### Thread Group Example

```xml
<ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="Load Users" enabled="true">
  <stringProp name="ThreadGroup.num_threads">50</stringProp>
  <stringProp name="ThreadGroup.ramp_time">60</stringProp>
  <elementProp name="ThreadGroup.main_controller" elementType="LoopController">
    <stringProp name="LoopController.loops">-1</stringProp>
    <stringProp name="ThreadGroup.duration">300</stringProp>
  </elementProp>
</ThreadGroup>
```

### HTTP Request Sampler

```xml
<HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="GET /api/users" enabled="true">
  <stringProp name="HTTPSampler.domain">api.example.com</stringProp>
  <stringProp name="HTTPSampler.path">/api/users</stringProp>
  <stringProp name="HTTPSampler.method">GET</stringProp>
  <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
</HTTPSamplerProxy>
```

### Response Assertion

```xml
<ResponseAssertion guiclass="AssertionGui" testclass="ResponseAssertion" testname="Status 200" enabled="true">
  <collectionProp name="Assertion.test_strings">
    <stringProp name="49586">200</stringProp>
  </collectionProp>
  <stringProp name="Assertion.custom_message"></stringProp>
  <stringProp name="Assertion.test_field">Assertion.response_code</stringProp>
  <boolProp name="Assertion.assume_success">false</boolProp>
</ResponseAssertion>
```

See `references/patterns.md` for thread groups, samplers, assertions, extractors, timers, controllers.

## Output

- **JMeter test plans** — `.jmx` files in `tests/`, `performance/`, or `jmeter/` per project convention
- **Run via CLI** — `jmeter -n -t test.jmx -l results.jtl -e -o report/`
- **CI integration** — Non-GUI mode (`-n`), JTL results (`-l`), HTML report (`-e -o`)

## CI Integration

| Option | Description |
|--------|-------------|
| `-n` | Non-GUI mode (headless) |
| `-t test.jmx` | Test plan file |
| `-l results.jtl` | Results file (JTL/CSV) |
| `-e` | Generate HTML report after run |
| `-o report/` | Output directory for HTML report |
| `-Jprop=value` | Override JMeter properties |

## Scope

**Can do (autonomous):**
- Generate .jmx test plans from performance plans and NFR specs
- Design thread groups (users, ramp-up, loops, duration)
- Add HTTP, JDBC, JMS samplers with proper configuration
- Configure Response, Duration, Size, JSON assertions
- Add CSV Data Set Config for parameterization
- Add Regular Expression Extractor, JSON Extractor for correlation
- Add timers (Constant, Uniform Random) for think time
- Add JSR223 PreProcessor (Groovy) for dynamic logic
- Add listeners (Aggregate Report, Summary Report)
- Generate CI-ready run commands

**Cannot do (requires confirmation):**
- Change production service configuration
- Target production without explicit consent
- Add JMeter plugins not in standard distribution
- Override project JMeter config without approval

**Will not do (out of scope):**
- Execute tests (user runs `jmeter -n -t test.jmx`)
- Write E2E functional tests (use qa-playwright-ts-writer)
- Provision load infrastructure (distributed JMeter setup)
- Modify CI/CD pipelines beyond JMeter integration

## References

- `references/patterns.md` — Thread groups, samplers, assertions, extractors, timers, controllers
- `references/config.md` — CLI mode, properties, plugins, distributed testing
- `references/best-practices.md` — Non-GUI mode, parameterization, correlation, result analysis

## Quality Checklist

- [ ] Thread groups match performance plan load profiles (users, ramp-up, duration)
- [ ] Assertions validate critical responses (status, duration, size)
- [ ] No hardcoded secrets; use `${__P()}` or CSV for credentials
- [ ] Think time (timers) between requests where realistic
- [ ] Listeners suitable for CI (Aggregate Report, Summary Report; avoid View Results Tree in load runs)
- [ ] CSV Data Set Config for parameterization when needed
- [ ] Extractors for correlation when session/token required
- [ ] Test plan runs in non-GUI mode without errors

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| OutOfMemoryError in JMeter | Too many threads or listeners | Reduce threads; remove View Results Tree; increase JVM heap (`-Xmx`) |
| Assertions fail in CI | Different baseline or env | Align assertion thresholds; use `${__P()}` for env-specific values |
| High error rate | Timeouts, 5xx, or wrong assertions | Increase timeout; fix assertion logic; verify endpoint |
| CSV not found | Relative path | Use absolute path or `${__BeanShell(import org.apache.jmeter.services.FileServer; FileServer.getFileServer().getBaseDir();)}` |
| Correlation fails | Extractor order or regex | Ensure extractor runs before dependent sampler; verify regex |
| JMX invalid XML | Malformed elements | Validate XML; ensure proper closing tags; check JMeter version compatibility |
| Slow HTML report | Large JTL file | Use Aggregate Report listener; reduce sample logging; filter by label |
