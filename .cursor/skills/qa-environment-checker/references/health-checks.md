# Service Health Check Patterns

## Overview

This reference documents patterns for verifying service health before test execution. Use these patterns when implementing environment checks for APIs, databases, and external services.

## HTTP Health Endpoints

### Basic GET Check

```bash
# Simple health check
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/health
# Expected: 200
```

### With Timeout

```bash
curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000/health
```

### TypeScript/Node (fetch)

```typescript
async function checkHealth(url: string, timeoutMs = 5000): Promise<boolean> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return res.ok; // 2xx
  } catch {
    clearTimeout(timeout);
    return false;
  }
}
```

### Python (httpx/requests)

```python
def check_health(url: str, timeout: float = 5.0) -> bool:
    try:
        r = httpx.get(url, timeout=timeout)
        return 200 <= r.status_code < 300
    except Exception:
        return False
```

## Common Health Endpoint Paths

| Framework/Stack | Typical Path | Notes |
|-----------------|--------------|-------|
| Express/Koa | `/health`, `/healthz`, `/ready` | Often custom |
| Spring Boot | `/actuator/health` | JSON with status |
| FastAPI | `/health`, `/docs` | OpenAPI at /docs |
| Django | `/health/` | May need django-health-check |
| Kubernetes | `/healthz`, `/readyz` | Liveness vs readiness |

## Database Connectivity

### PostgreSQL

```bash
pg_isready -h localhost -p 5432 -U testuser
# Exit 0 = ready
```

```python
# Python
def check_postgres(conn_str: str) -> bool:
    try:
        with psycopg2.connect(conn_str) as conn:
            conn.execute("SELECT 1")
        return True
    except Exception:
        return False
```

### MySQL/MariaDB

```bash
mysqladmin ping -h localhost -u testuser -p
```

### MongoDB

```bash
mongosh --eval "db.adminCommand('ping')" --quiet
# Exit 0 = ok
```

### SQLite

```python
def check_sqlite(path: str) -> bool:
    try:
        conn = sqlite3.connect(path, timeout=2)
        conn.execute("SELECT 1")
        conn.close()
        return True
    except Exception:
        return False
```

## Redis

```bash
redis-cli ping
# Expected: PONG
```

## Docker Services

```bash
# Check container running
docker ps --filter "name=postgres" --format "{{.Status}}"
# Expected: Up X minutes/hours

# Check container health (if healthcheck defined)
docker inspect --format='{{.State.Health.Status}}' postgres
# Expected: healthy
```

## Port Availability

### Check if port is in use

```bash
# Linux/macOS
lsof -i :3000
# Or
netstat -tuln | grep 3000

# Windows
netstat -ano | findstr :3000
```

### Check if port is free (for binding)

```python
import socket
def is_port_free(host: str, port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind((host, port))
            return True
        except OSError:
            return False
```

## Environment Variables

### Required vars validation

```python
REQUIRED_VARS = ["DATABASE_URL", "API_KEY", "BASE_URL"]

def check_env_vars() -> list[str]:
    missing = [v for v in REQUIRED_VARS if not os.environ.get(v)]
    return missing
```

### .env file presence and format

- Check file exists
- Parse and validate (no secrets in output)
- Report missing required keys

## Tool Availability

### Version checks

```bash
node --version   # v18.x, v20.x
python --version # 3.10+
pnpm --version
docker --version
git --version
```

### Playwright browsers

```bash
npx playwright install --dry-run
# Or
npx playwright install chromium
```

## Retry and Backoff

For flaky services, use retry with exponential backoff:

```python
def check_with_retry(check_fn, max_attempts=3, delay=2):
    for i in range(max_attempts):
        if check_fn():
            return True
        if i < max_attempts - 1:
            time.sleep(delay * (2 ** i))
    return False
```

## Security Notes

- Never log or report full connection strings or secrets
- Use masked values in reports (e.g., `DATABASE_URL=***@localhost`)
- Prefer health endpoints over raw DB checks when available
