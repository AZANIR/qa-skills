# Locust Patterns

## User Classes (HttpUser)

### Basic HttpUser

```python
from locust import HttpUser, task, between

class ApiUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def get_health(self):
        self.client.get("/health")

    @task(weight=3)
    def get_items(self):
        self.client.get("/api/items")

    @task(weight=1)
    def create_item(self):
        self.client.post("/api/items", json={"name": "test"})
```

### Multiple User Classes

```python
class ReadOnlyUser(HttpUser):
    wait_time = between(2, 5)
    weight = 3  # 3x more likely to spawn

    @task
    def browse(self):
        self.client.get("/api/items")
        self.client.get("/api/items/1")

class WriteUser(HttpUser):
    wait_time = between(1, 2)
    weight = 1

    @task
    def create_and_update(self):
        r = self.client.post("/api/items", json={"name": "new"})
        if r.status_code == 201:
            item_id = r.json()["id"]
            self.client.put(f"/api/items/{item_id}", json={"name": "updated"})
```

### on_start / on_stop

```python
class AuthenticatedUser(HttpUser):
    wait_time = between(1, 2)

    def on_start(self):
        """Run once per user when spawned."""
        r = self.client.post("/auth/login", json={"user": "test", "pass": "secret"})
        self.token = r.json()["token"]

    def on_stop(self):
        """Run when user stops (e.g., test end)."""
        self.client.post("/auth/logout", headers={"Authorization": f"Bearer {self.token}"})

    @task
    def get_profile(self):
        self.client.get("/profile", headers={"Authorization": f"Bearer {self.token}"})
```

## TaskSets

### Nested TaskSets

```python
from locust import HttpUser, task, TaskSet, between

class BrowseTasks(TaskSet):
    @task
    def list_items(self):
        self.client.get("/api/items")

    @task
    def view_item(self):
        self.client.get("/api/items/1")

class CheckoutTasks(TaskSet):
    @task
    def add_to_cart(self):
        self.client.post("/api/cart", json={"item_id": 1, "qty": 1})

    @task
    def checkout(self):
        self.client.post("/api/checkout", json={"payment": "card"})

class WebUser(HttpUser):
    wait_time = between(1, 3)
    tasks = [BrowseTasks, CheckoutTasks]
```

### Interrupt (stop TaskSet)

```python
class CheckoutFlow(TaskSet):
    @task
    def complete_checkout(self):
        self.client.post("/api/cart", json={"item_id": 1})
        self.client.post("/api/checkout")
        self.interrupt()  # Return to parent tasks
```

## Wait Time

| Type | Usage | Behavior |
| ---- | ----- | -------- |
| `between(min, max)` | Random uniform | Wait min–max seconds |
| `constant(n)` | Fixed | Wait n seconds every time |
| `constant_pacing(n)` | Rate-based | Maintain ~1/n seconds between requests |

```python
from locust import between, constant, constant_pacing

wait_time = between(1, 5)      # 1–5 sec between tasks
wait_time = constant(2)        # Always 2 sec
wait_time = constant_pacing(1) # ~1 req/sec per user
```

## Load Shapes (LoadTestShape)

### Ramp-Up / Ramp-Down

```python
from locust import LoadTestShape

class RampShape(LoadTestShape):
    min_users = 0
    peak_users = 100
    time_limit = 300  # 5 min

    def tick(self):
        run_time = self.get_run_time()
        if run_time < 60:
            return (int(run_time * self.peak_users / 60), 10)  # Ramp up
        elif run_time < 240:
            return (self.peak_users, 10)  # Sustain
        elif run_time < self.time_limit:
            return (int(self.peak_users * (300 - run_time) / 60), 10)  # Ramp down
        return None  # Stop
```

### Spike Test

```python
class SpikeShape(LoadTestShape):
    def tick(self):
        run_time = self.get_run_time()
        if run_time < 30:
            return (10, 5)   # Baseline
        elif run_time < 60:
            return (500, 50) # Spike
        elif run_time < 90:
            return (10, 5)   # Recovery
        return None
```

### Soak (Endurance) Test

```python
class SoakShape(LoadTestShape):
    def tick(self):
        run_time = self.get_run_time()
        if run_time < 60:
            return (50, 10)   # Ramp to 50 users
        elif run_time < 3600: # 1 hour
            return (50, 10)   # Hold
        return None
```

## Event Hooks

### Request Events

```python
from locust import events

@events.request.add_listener
def on_request(request_type, name, response_time, response_length, exception, **kwargs):
    if exception:
        print(f"Request failed: {name} - {exception}")

@events.request.add_listener
def log_slow_requests(request_type, name, response_time, **kwargs):
    if response_time > 2000:  # ms
        print(f"Slow: {name} took {response_time}ms")
```

### Test Lifecycle

```python
@events.test_start.add_listener
def on_test_start(environment, **kwargs):
    print("Load test starting")

@events.test_stop.add_listener
def on_test_stop(environment, **kwargs):
    print("Load test stopped")

@events.init.add_listener
def on_locust_init(environment, **kwargs):
    # Custom init (e.g., setup connections)
    pass
```

## Distributed Mode

### Master

```bash
locust -f locustfile.py --master --expect-workers=4
```

### Workers

```bash
locust -f locustfile.py --worker --master-host=192.168.1.100
```

### Headless Distributed

```bash
# Master
locust -f locustfile.py --master --expect-workers=4 --headless -u 1000 -r 50 -t 300s

# Workers (run on separate machines)
locust -f locustfile.py --worker --master-host=<master-ip>
```
