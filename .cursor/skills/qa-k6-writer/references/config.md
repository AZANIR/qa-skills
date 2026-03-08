# k6 Configuration Reference

## Options Object

The `options` object configures test execution. Place at top of script or pass via CLI.

```javascript
export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {},
  scenarios: {},
  stages: [],
  tags: {},
  noConnectionReuse: false,
  userAgent: 'k6',
  insecureSkipTLSVerify: false,
  tlsVersion: { min: 'tls1.2', max: 'tls1.3' },
};
```

---

## Scenarios

Define multiple execution patterns in a single test.

```javascript
export const options = {
  scenarios: {
    scenario_name: {
      executor: 'constant-vus',
      vus: 10,
      duration: '5m',
      exec: 'functionName',
      startTime: '0s',
      gracefulStop: '30s',
      env: { MY_VAR: 'value' },
      tags: { scenario: 'api' },
    },
  },
};
```

### Executor Reference

| Executor | Parameters |
| -------- | ---------- |
| shared-iterations | `iterations`, `vus`, `maxDuration` |
| per-vu-iterations | `vus`, `iterations`, `maxDuration` |
| constant-vus | `vus`, `duration` |
| ramping-vus | `startVUs`, `stages`, `gracefulRampDown` |
| constant-arrival-rate | `rate`, `timeUnit`, `duration`, `preAllocatedVUs`, `maxVUs` |
| ramping-arrival-rate | `startRate`, `timeUnit`, `stages`, `preAllocatedVUs`, `maxVUs` |
| externally-controlled | `maxVUs`, `duration` |

---

## Stages (Ramping)

Define load profile with time-based stages.

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 VUs over 2 min
    { duration: '5m', target: 50 },   // Stay at 50 VUs for 5 min
    { duration: '2m', target: 100 },  // Ramp to 100 VUs
    { duration: '5m', target: 100 },  // Stay at 100 VUs
    { duration: '2m', target: 0 },    // Ramp down to 0
  ],
};
```

Time units: `s`, `m`, `h`.

---

## Thresholds

Pass/fail criteria for the test run.

```javascript
export const options = {
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.95'],
    'http_req_duration{name:api}': ['p(95)<300'],
  },
};
```

### Percentile Syntax
- `p(50)` — Median
- `p(90)` — 90th percentile
- `p(95)` — 95th percentile
- `p(99)` — 99th percentile

---

## Output Formats

### JSON
```bash
k6 run --out json=results.json script.js
```

### CSV
```bash
k6 run --out csv=results.csv script.js
```

### InfluxDB
```bash
k6 run --out influxdb=http://localhost:8086/k6 script.js
```

### Prometheus (via k6 Prometheus extension)
```bash
k6 run --out experimental-prometheus script.js
```

### Cloud (k6 Cloud)
```bash
k6 cloud script.js
```

### Summary
Built-in summary prints to stdout. Customize with:
```javascript
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';

export function handleSummary(data) {
  return {
    'summary.html': htmlReport(data),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
```

---

## Environment and Variables

### Environment Variables
```javascript
const baseUrl = __ENV.BASE_URL || 'https://example.com';
const apiKey = __ENV.API_KEY;
```

### Options Override via Env
```bash
BASE_URL=https://staging.example.com k6 run script.js
```

### Options Override via CLI
```bash
k6 run -e BASE_URL=https://staging.example.com script.js
k6 run --vus 20 --duration 1m script.js
```

---

## Tags

Add tags for filtering metrics and organizing output.

```javascript
import http from 'k6/http';

export default function () {
  const res = http.get('https://api.example.com/items', {
    tags: { name: 'list_items', endpoint: 'GET /items' },
  });
}
```

```javascript
export const options = {
  tags: {
    project: 'my-project',
    env: 'staging',
  },
};
```

---

## TLS and Security

```javascript
export const options = {
  insecureSkipTLSVerify: true,  // For dev/staging only
  tlsVersion: {
    min: 'tls1.2',
    max: 'tls1.3',
  },
};
```

---

## Graceful Stop

Allow in-flight requests to complete before stopping VUs.

```javascript
export const options = {
  scenarios: {
    main: {
      executor: 'constant-vus',
      vus: 10,
      duration: '5m',
      gracefulStop: '30s',
    },
  },
};
```
