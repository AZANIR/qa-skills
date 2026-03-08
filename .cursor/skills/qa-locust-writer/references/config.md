# Locust Configuration

## CLI Arguments

### Common Options

| Option | Short | Description | Example |
| ------ | ----- | ----------- | ------- |
| `--host` | `-H` | Base URL for requests | `--host https://api.example.com` |
| `--users` | `-u` | Number of users to simulate | `--users 100` |
| `--spawn-rate` | `-r` | Users spawned per second | `--spawn-rate 10` |
| `--run-time` | `-t` | Test duration | `--run-time 5m` |
| `--headless` | | Run without web UI | `--headless` |
| `--locustfile` | `-f` | Path to locustfile | `-f locustfile.py` |
| `--web-host` | | Web UI bind address | `--web-host 0.0.0.0` |
| `--web-port` | | Web UI port | `--web-port 8089` |

### Distributed Options

| Option | Description |
| ------ | ----------- |
| `--master` | Run as master node |
| `--worker` | Run as worker node |
| `--master-host` | Master node hostname/IP |
| `--master-port` | Master port (default 5557) |
| `--expect-workers` | Master waits for N workers before starting |

### Example Commands

```bash
# Web UI mode
locust -f locustfile.py --host https://api.example.com

# Headless (CI)
locust -f locustfile.py --host https://api.example.com --headless -u 100 -r 10 -t 5m

# With custom user class
locust -f locustfile.py ApiUser --host https://api.example.com
```

## locust.conf

Create `locust.conf` in project root or same directory as locustfile:

```ini
# locust.conf
locustfile = locustfile.py
host = https://api.example.com

# Web UI
web-host = 0.0.0.0
web-port = 8089

# Headless defaults
users = 100
spawn-rate = 10
run-time = 5m
headless = false

# Logging
loglevel = INFO
logfile = locust.log
```

### Using Config File

```bash
locust  # Uses locust.conf in cwd
locust -f locustfile.py --config locust.conf
```

CLI args override config file values.

## Environment Variables

| Variable | Description |
| -------- | ----------- |
| `LOCUST_HOST` | Base URL (same as `--host`) |
| `LOCUST_LOCUSTFILE` | Path to locustfile |
| `LOCUST_USERS` | Number of users |
| `LOCUST_SPAWN_RATE` | Spawn rate |
| `LOCUST_RUN_TIME` | Run time (e.g., `5m`, `1h`) |
| `LOCUST_HEADLESS` | Set to `true` for headless |
| `LOCUST_WEB_HOST` | Web UI host |
| `LOCUST_WEB_PORT` | Web UI port |

### Example

```bash
export LOCUST_HOST=https://api.staging.example.com
export LOCUST_USERS=200
export LOCUST_SPAWN_RATE=20
export LOCUST_RUN_TIME=10m
locust -f locustfile.py --headless
```

## Distributed Setup

### Architecture

```
[Master] ---- port 5557 ---- [Worker 1]
    |                         [Worker 2]
    |                         [Worker 3]
    +---- Web UI :8089        [Worker 4]
```

### Master Configuration

```bash
locust -f locustfile.py \
  --master \
  --expect-workers=4 \
  --host https://api.example.com \
  --users 1000 \
  --spawn-rate 50 \
  --run-time 10m \
  --headless
```

### Worker Configuration

```bash
locust -f locustfile.py \
  --worker \
  --master-host=192.168.1.100 \
  --master-port=5557
```

### Docker Compose Example

```yaml
services:
  master:
    image: locustio/locust
    command: -f /mnt/locustfile.py --master --expect-workers=4
    ports:
      - "8089:8089"
      - "5557:5557"
    volumes:
      - ./locustfile.py:/mnt/locustfile.py
    environment:
      - LOCUST_HOST=https://api.example.com

  worker:
    image: locustio/locust
    command: -f /mnt/locustfile.py --worker --master-host=master
    volumes:
      - ./locustfile.py:/mnt/locustfile.py
    deploy:
      replicas: 4
```

## Host in Code

Override host per user class or at runtime:

```python
class ApiUser(HttpUser):
    host = "https://api.example.com"  # Overrides --host for this class
```

Or use environment:

```python
import os

class ApiUser(HttpUser):
    host = os.environ.get("LOCUST_HOST", "http://localhost:8000")
```
