# k6 Patterns Reference

## Load Profiles

### Load Testing (Steady Load)
Gradual ramp-up, sustained load, gradual ramp-down.

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '5m', target: 50 },
    { duration: '2m', target: 0 },
  ],
};
```

### Stress Testing (Beyond Capacity)
Increase load until system breaks; identify breaking point.

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 300 },
    { duration: '5m', target: 300 },
    { duration: '2m', target: 0 },
  ],
};
```

### Soak Testing (Endurance)
Sustained load over extended period to find memory leaks, degradation.

```javascript
export const options = {
  stages: [
    { duration: '5m', target: 50 },
    { duration: '2h', target: 50 },
    { duration: '5m', target: 0 },
  ],
};
```

### Spike Testing (Sudden Burst)
Rapid spike to simulate traffic surge.

```javascript
export const options = {
  stages: [
    { duration: '10s', target: 0 },
    { duration: '1m', target: 500 },
    { duration: '3m', target: 500 },
    { duration: '1m', target: 0 },
  ],
};
```

### Smoke Testing (Minimal Validation)
Light load to verify script and basic functionality.

```javascript
export const options = {
  vus: 5,
  duration: '1m',
};
```

### Breakpoint Testing
Find maximum capacity by incrementally increasing load.

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 50 },
    { duration: '2m', target: 100 },
    { duration: '2m', target: 150 },
    { duration: '2m', target: 200 },
    { duration: '2m', target: 250 },
    { duration: '2m', target: 0 },
  ],
};
```

---

## Scenario Executors

| Executor | Use Case | Key Params |
| -------- | -------- | ---------- |
| **shared-iterations** | Fixed total iterations across all VUs | `iterations`, `vus` |
| **per-vu-iterations** | Each VU runs N iterations | `vus`, `iterations` |
| **constant-vus** | Fixed VU count for duration | `vus`, `duration` |
| **ramping-vus** | Ramp VUs up/down | `startVUs`, `stages`, `gracefulRampDown` |
| **constant-arrival-rate** | Fixed request rate (arrivals/sec) | `rate`, `timeUnit`, `duration`, `preAllocatedVUs`, `maxVUs` |
| **ramping-arrival-rate** | Variable request rate | `startRate`, `stages`, `preAllocatedVUs`, `maxVUs` |
| **externally-controlled** | Control VUs from external source | `maxVUs`, `duration` |

### Example: Multiple Scenarios

```javascript
export const options = {
  scenarios: {
    browse: {
      executor: 'constant-vus',
      vus: 10,
      duration: '5m',
      exec: 'browseFlow',
      startTime: '0s',
    },
    api: {
      executor: 'constant-arrival-rate',
      rate: 20,
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 10,
      maxVUs: 50,
      exec: 'apiFlow',
      startTime: '0s',
    },
  },
};
```

---

## Thresholds

### Common Threshold Patterns

```javascript
export const options = {
  thresholds: {
    // p95 response time under 200ms
    http_req_duration: ['p(95)<200'],
    // Error rate under 1%
    http_req_failed: ['rate<0.01'],
    // Combined: both must pass
    'http_req_duration{name:api}': ['p(99)<500'],
    'http_req_failed{name:api}': ['rate<0.005'],
  },
};
```

### Threshold Operators

| Operator | Meaning |
| -------- | ------- |
| `<` | Less than |
| `<=` | Less than or equal |
| `>` | Greater than |
| `>=` | Greater than or equal |
| `==` | Equal |

### Built-in Metrics

| Metric | Description |
| ------ | ----------- |
| `http_req_duration` | Request duration (ms) |
| `http_req_failed` | Failed request rate (0–1) |
| `http_reqs` | Total HTTP requests |
| `iterations` | Completed iterations |
| `vus` | Current virtual users |
| `vus_max` | Max configured VUs |

---

## Custom Metrics

### Trend (Duration)
```javascript
import { Trend } from 'k6/metrics';
const myTrend = new Trend('my_custom_duration');

export default function () {
  const start = Date.now();
  // ... do work ...
  myTrend.add(Date.now() - start);
}
```

### Rate (Success/Failure)
```javascript
import { Rate } from 'k6/metrics';
const myRate = new Rate('my_success_rate');

export default function () {
  const success = doSomething();
  myRate.add(success);
}
```

### Counter
```javascript
import { Counter } from 'k6/metrics';
const myCounter = new Counter('my_counter');

export default function () {
  myCounter.add(1);
}
```

### Gauge (Latest Value)
```javascript
import { Gauge } from 'k6/metrics';
const myGauge = new Gauge('my_gauge');

export default function () {
  myGauge.add(someValue);
}
```

---

## Groups

Organize related operations for clearer output and metrics.

```javascript
import http from 'k6/http';
import { group } from 'k6';

export default function () {
  group('Homepage', function () {
    const res = http.get('https://example.com/');
    // assertions
  });

  group('API - List', function () {
    const res = http.get('https://api.example.com/items');
    // assertions
  });

  group('API - Create', function () {
    const res = http.post('https://api.example.com/items', JSON.stringify({ name: 'item' }), {
      headers: { 'Content-Type': 'application/json' },
    });
    // assertions
  });
}
```

---

## Checks vs Thresholds

**Checks** — Assertions per iteration; don't fail the test.
```javascript
import { check } from 'k6';
import http from 'k6/http';

export default function () {
  const res = http.get('https://example.com/');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
```

**Thresholds** — Pass/fail criteria for the entire test run.
```javascript
export const options = {
  thresholds: {
    checks: ['rate>0.95'],
  },
};
```

---

## HTTP Patterns

### Basic GET/POST
```javascript
import http from 'k6/http';

const res = http.get('https://api.example.com/items');
const res2 = http.post('https://api.example.com/items', JSON.stringify({ name: 'test' }), {
  headers: { 'Content-Type': 'application/json' },
});
```

### Correlation (Extract from Response)
```javascript
const res = http.get('https://api.example.com/login');
const token = res.json('token');
http.get('https://api.example.com/protected', {
  headers: { Authorization: `Bearer ${token}` },
});
```

### Parameterization (CSV)
```javascript
import { SharedArray } from 'k6/data';
const data = new SharedArray('users', function () {
  return JSON.parse(open('./users.json'));
});

export default function () {
  const user = data[__ITER % data.length];
  http.post('https://api.example.com/login', JSON.stringify(user));
}
```
