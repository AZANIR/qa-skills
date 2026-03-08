# k6 Best Practices

## Realistic Load

### Think Time (sleep)
Simulate user think time between actions to avoid unrealistic burst patterns.

```javascript
import { sleep } from 'k6';

export default function () {
  http.get('https://example.com/');
  sleep(Math.random() * 3 + 1);  // 1–4 seconds
  http.get('https://example.com/dashboard');
  sleep(2);
}
```

### Ramp Up Gradually
Avoid instant load spikes; use stages to ramp up and down.

```javascript
// Good: gradual ramp
stages: [
  { duration: '2m', target: 50 },
  { duration: '5m', target: 50 },
  { duration: '2m', target: 0 },
]

// Avoid: instant spike (unless testing spike scenario)
vus: 500,
duration: '1m',
```

---

## Correlation

Extract dynamic values from responses for subsequent requests.

```javascript
const loginRes = http.post('https://api.example.com/login', JSON.stringify(creds), {
  headers: { 'Content-Type': 'application/json' },
});
const token = loginRes.json('access_token');

const apiRes = http.get('https://api.example.com/protected', {
  headers: { Authorization: `Bearer ${token}` },
});
```

### Session Cookies
```javascript
const res = http.get('https://example.com/');
const cookies = res.cookies;
// Cookies automatically sent in subsequent requests from same VU
http.get('https://example.com/dashboard');
```

---

## Parameterization

### SharedArray (Memory-Efficient)
Use `SharedArray` for large datasets; data is shared across VUs.

```javascript
import { SharedArray } from 'k6/data';

const users = new SharedArray('users', function () {
  return JSON.parse(open('./users.json'));
});

export default function () {
  const user = users[__ITER % users.length];
  // use user
}
```

### Regular Array (Small Data)
```javascript
const items = JSON.parse(open('./items.json'));
```

### CSV
```javascript
import { SharedArray } from 'k6/data';
import papaparse from 'https://jslib.k6.io/papaparse/5.1.1/index.js';

const data = new SharedArray('csv', function () {
  return papaparse.parse(open('./data.csv'), { header: true }).data;
});
```

---

## CI Integration

### GitHub Actions
```yaml
name: k6 Performance Tests
on: [push]
jobs:
  k6:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: grafana/setup-k6-action@v1
        with:
          k6-version: v0.48.0
      - name: Run k6
        run: k6 run --out json=results.json tests/load/script.js
      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: k6-results
          path: results.json
```

### Exit Code
k6 exits with code 0 if all thresholds pass, non-zero if any fail. CI can use this for gating.

```bash
k6 run script.js
echo $?  # 0 = pass, 1 = fail
```

### Threshold Failure
```yaml
- name: Run k6
  run: k6 run script.js
  # Job fails automatically if thresholds fail
```

---

## Script Structure

### Default Export
```javascript
export default function () {
  // Main VU logic
}
```

### Scenario-Specific Functions
```javascript
export const options = {
  scenarios: {
    browse: { exec: 'browseFlow', ... },
    api: { exec: 'apiFlow', ... },
  },
};

export function browseFlow() { /* ... */ }
export function apiFlow() { /* ... */ }
```

### Setup and Teardown
```javascript
export function setup() {
  // Run once before test; return data for default function
  return { token: getAuthToken() };
}

export default function (data) {
  // Use data.token
}

export function teardown(data) {
  // Run once after test
}
```

---

## Checks and Thresholds

### Use Both
- **Checks** — Per-request assertions; track success rate
- **Thresholds** — Pass/fail the entire run

```javascript
import { check } from 'k6';
import http from 'k6/http';

export const options = {
  thresholds: {
    checks: ['rate>0.95'],
    http_req_duration: ['p(95)<200'],
  },
};

export default function () {
  const res = http.get('https://example.com/');
  check(res, {
    'status 200': (r) => r.status === 200,
    'has body': (r) => r.body.length > 0,
  });
}
```

---

## Avoid Anti-Patterns

| Anti-Pattern | Fix |
| ------------ | --- |
| No sleep between requests | Add `sleep()` for realistic pacing |
| Hardcoded URLs/secrets | Use `__ENV` or `options.env` |
| Single huge default function | Split into `group()` or scenario functions |
| Ignoring failed requests | Add `http_req_failed` threshold |
| No thresholds | Define at least `http_req_duration` and `http_req_failed` |
| Loading large JSON with `open()` in default | Use `SharedArray` for memory efficiency |
| Testing production without coordination | Use staging; coordinate with ops |

---

## Debugging

### Verbose Output
```bash
k6 run --verbose script.js
```

### Single VU, Single Iteration
```bash
k6 run --vus 1 --iterations 1 script.js
```

### HTTP Debug
```javascript
export const options = {
  httpDebug: 'full',  // Log all HTTP traffic
};
```
