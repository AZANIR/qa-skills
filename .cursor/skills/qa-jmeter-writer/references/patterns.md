# JMeter Test Plan Patterns

## Thread Groups

### Basic Thread Group

| Property | Purpose | Example |
|----------|---------|---------|
| `num_threads` | Number of virtual users | 10, 100, 1000 |
| `ramp_time` | Ramp-up period (seconds) | 60, 300 |
| `loops` | Iterations per user (-1 = forever) | 1, 10, -1 |
| `duration` | Test duration (seconds) | Use with loops=-1 |
| `scheduler` | Enable scheduler | true/false |
| `delay` | Startup delay (seconds) | 0 |
| `on_sample_error` | Action on failure | continue, stopthread, stoppage, stopnow |

### Load Profile Mapping

| Test Type | Threads | Ramp-up | Loops/Duration |
|-----------|---------|---------|---------------|
| Smoke | 1–5 | 10s | 1–5 |
| Load | Target VUs | 10–20% of duration | Duration-based |
| Stress | Ramp to breaking point | Gradual | Until failure |
| Soak | Steady VUs | Ramp-up | Hours |
| Spike | Sudden surge | Very short | Short burst |

### Ultimate Thread Group (Plugin)

For complex load profiles (stages), use Ultimate Thread Group or Stepping Thread Group plugins when available.

---

## Samplers

### HTTP Request Sampler

```xml
<HTTPSamplerProxy>
  <stringProp name="HTTPSampler.domain">${__P(host,api.example.com)}</stringProp>
  <stringProp name="HTTPSampler.path">/users</stringProp>
  <stringProp name="HTTPSampler.method">GET</stringProp>
  <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
  <boolProp name="HTTPSampler.auto_redirects">false</boolProp>
  <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
  <boolProp name="HTTPSampler.DO_MULTIPART_POST">false</boolProp>
  <elementProp name="HTTPsampler.Arguments">
    <collectionProp name="Arguments.arguments">
      <elementProp name="" elementType="HTTPArgument">
        <boolProp name="HTTPArgument.always_encode">false</boolProp>
        <stringProp name="Argument.value">{"email":"${email}"}</stringProp>
        <stringProp name="Argument.metadata">=</stringProp>
      </elementProp>
    </collectionProp>
  </elementProp>
</HTTPSamplerProxy>
```

| Property | Purpose |
|----------|---------|
| `HTTPSampler.domain` | Host (or use full URL in path) |
| `HTTPSampler.path` | Path + query |
| `HTTPSampler.method` | GET, POST, PUT, DELETE, PATCH |
| `HTTPSampler.protocol` | http or https |
| `HTTPSampler.port` | Port (empty = default) |
| `HTTPsampler.Arguments` | Request body (POST/PUT) |
| `HTTPSampler.contentEncoding` | UTF-8 |

### HTTP Header Manager

Add as child of sampler or test plan:

```xml
<HeaderManager>
  <collectionProp name="HeaderManager.headers">
    <elementProp name="Content-Type" elementType="Header">
      <stringProp name="Header.name">Content-Type</stringProp>
      <stringProp name="Header.value">application/json</stringProp>
    </elementProp>
    <elementProp name="Authorization" elementType="Header">
      <stringProp name="Header.name">Authorization</stringProp>
      <stringProp name="Header.value">Bearer ${token}</stringProp>
    </elementProp>
  </collectionProp>
</HeaderManager>
```

### JDBC Request Sampler

For database load testing:

| Property | Purpose |
|----------|---------|
| `dataSource` | JDBC connection pool variable |
| `queryType` | Select, Update, Callable, Prepared |
| `query` | SQL statement |

### JMS Sampler

For messaging (JMS Point-to-Point, Pub/Sub) when testing message brokers.

---

## Assertions

### Response Assertion

| Field | Purpose |
|-------|---------|
| `Assertion.test_field` | Response Code, Response Message, Response Headers, Response Body |
| `Assertion.pattern` | String or regex to match |
| `Assertion.test_type` | Contains, Matches, Equals, Substring |
| `Assertion.assume_success` | Treat as success if not applied |

Common patterns:
- Response Code: `200`, `201`, `2\d{2}`
- Response Body: `"success":\s*true`, `"id":\s*\d+`

### Duration Assertion

| Property | Purpose |
|----------|---------|
| `DurationAssertion.duration` | Max allowed response time (ms) |

Use for SLA validation (e.g., 2000 ms for p95).

### Size Assertion

| Property | Purpose |
|----------|---------|
| `SizeAssertion.size` | Expected size in bytes |
| `SizeAssertion.assume_success` | Treat as success if not applied |

### JSON Assertion (JMeter 5.2+)

| Property | Purpose |
|----------|---------|
| `JSON_PATH` | JSONPath expression (e.g., `$.data.id`) |
| `EXPECTED_VALUE` | Expected value or leave empty for existence |
| `ASSERT_JSON_PATH_EXISTS` | true/false |

---

## Extractors

### Regular Expression Extractor

| Property | Purpose |
|----------|---------|
| `Refname` | Variable name (e.g., `token`) |
| `Regex` | Regex with capture group, e.g., `"token":"([^"]+)"` |
| `Template` | `$1$` for first group |
| `Match Nr` | 1 = first, -1 = random, 0 = all |
| `Default` | Default value if no match |

### JSON Extractor

| Property | Purpose |
|----------|---------|
| `JSON_PATH` | JSONPath, e.g., `$.data.token` |
| `VAR` | Variable name |
| `DEFAULT` | Default if not found |

### Boundary Extractor

For simple left/right boundary extraction when regex is overkill.

---

## Timers

### Constant Timer

| Property | Purpose |
|----------|---------|
| `ConstantTimer.delay` | Delay in ms (e.g., 1000 for 1s think time) |

### Uniform Random Timer

| Property | Purpose |
|----------|---------|
| `ConstantTimer.delay` | Minimum delay (ms) |
| `RandomTimer.range` | Additional random range (ms) |

Total delay = delay + random(0, range).

### Gaussian Random Timer

Similar to Uniform but with Gaussian distribution for more realistic think time.

---

## Controllers

### Loop Controller

| Property | Purpose |
|----------|---------|
| `LoopController.loops` | Number of iterations |

### If Controller

| Property | Purpose |
|----------|---------|
| `IfController.condition` | JavaScript or `${__jexl3(...)}` expression |

Example: `${__jexl3(${status} == 200)}`

### Once Only Controller

Execute child elements only on first iteration (e.g., login once).

### Transaction Controller

Group samplers into a transaction for aggregate timing.

---

## Pre/Post Processors

### JSR223 PreProcessor (Groovy)

```groovy
// Set variable from previous response
vars.put("timestamp", String.valueOf(System.currentTimeMillis()));

// Correlation: extract from prev sampler (use PostProcessor on prior sampler instead)
// vars.put("token", prev.getResponseDataAsString());
```

Prefer Groovy over BeanShell (faster, maintained).

### JSR223 PostProcessor

```groovy
import groovy.json.JsonSlurper
def json = new JsonSlurper().parseText(prev.getResponseDataAsString())
vars.put("userId", json.data.id.toString())
```

### User Parameters

For per-iteration parameter overrides without CSV.
