# Locust Best Practices

## Realistic Scenarios

### Match Production Traffic Mix

- **User mix:** Define multiple `HttpUser` classes with `weight` to reflect real user types (e.g., 80% readers, 20% writers).
- **Task distribution:** Use `@task(weight=N)` so high-frequency actions (e.g., browse) have higher weight than rare ones (e.g., checkout).
- **Think time:** Use `wait_time = between(1, 5)` or `constant_pacing` to avoid unrealistic burst patterns.

### Avoid Constant Zero Wait

```python
# Avoid (unless intentional stress)
wait_time = constant(0)  # Max RPS, no think time

# Prefer
wait_time = between(1, 3)  # Simulates user think time
```

## Correlation and Session State

### Extract Dynamic Data from Responses

```python
class ApiUser(HttpUser):
    wait_time = between(1, 2)

    @task
    def create_and_get(self):
        r = self.client.post("/api/items", json={"name": "test"})
        if r.status_code == 201:
            item_id = r.json()["id"]
            self.client.get(f"/api/items/{item_id}")
```

### Use on_start for Auth

```python
def on_start(self):
    r = self.client.post("/auth/login", json={"user": "u", "pass": "p"})
    self.token = r.json()["token"]

@task
def authenticated_request(self):
    self.client.get("/api/secure", headers={"Authorization": f"Bearer {self.token}"})
```

### Avoid Global Mutable State

- Keep state per user instance (e.g., `self.token`).
- Do not use module-level variables that all users share; this can cause race conditions and skewed results.

## Custom Load Shapes

### Design for Test Type

| Test Type | Shape Pattern |
| --------- | ------------- |
| **Load** | Ramp up → sustain → optional ramp down |
| **Stress** | Gradual increase until failure |
| **Spike** | Low → sudden high → recovery |
| **Soak** | Ramp to target → hold for hours |

### Return Correct Tuple from tick()

```python
def tick(self):
    run_time = self.get_run_time()
    # Return (user_count, spawn_rate) or None to stop
    if run_time < 60:
        return (50, 5)
    return None
```

## CI Integration

### Headless Execution

```bash
locust -f locustfile.py --host $TARGET_HOST --headless \
  -u $USERS -r $SPAWN_RATE -t $DURATION \
  --html report.html --csv results
```

### Exit Codes

- Locust exits 0 on success, non-zero on failure.
- Use `--run-time` to ensure tests complete; otherwise Ctrl+C is needed.

### Environment-Specific Hosts

```yaml
# GitHub Actions example
- name: Run Locust
  env:
    LOCUST_HOST: ${{ secrets.STAGING_URL }}
    LOCUST_USERS: 100
    LOCUST_RUN_TIME: 5m
  run: |
    locust -f locustfile.py --headless
```

## Performance of the Test Itself

### Minimize Work in Tasks

- Avoid heavy computation, large allocations, or blocking I/O inside tasks.
- Use `self.client` (connection pooling) rather than creating new clients per request.

### Event Hooks

- Keep `events.request` listeners lightweight.
- Do not perform slow operations (e.g., DB writes) in listeners; use async or queue if needed.

## Security and Safety

- **No production by default:** Use staging/QA hosts unless explicitly requested.
- **Secrets:** Use environment variables for host, tokens, API keys.
- **Rate limits:** Respect target system limits; coordinate with team before large runs.

## Traceability

- Link load tests to performance plans (e.g., NFR IDs, plan section references).
- Document target SLAs (e.g., p95 < 500ms) in comments or a separate doc.
- Use consistent naming for user classes and tasks to align with plan scenarios.
