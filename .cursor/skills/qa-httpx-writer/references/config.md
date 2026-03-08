# httpx Test Configuration

## conftest.py Structure

```python
# tests/conftest.py
import os
import pytest
import httpx


@pytest.fixture
def base_url():
    return os.environ.get("API_BASE_URL", "http://localhost:8000")


@pytest.fixture
def client(base_url):
    """Sync client; use for non-async tests."""
    with httpx.Client(
        base_url=base_url,
        timeout=30.0,
        follow_redirects=True,
    ) as c:
        yield c


@pytest.fixture
async def async_client(base_url):
    """Async client; use with @pytest.mark.asyncio."""
    async with httpx.AsyncClient(
        base_url=base_url,
        timeout=30.0,
        follow_redirects=True,
    ) as c:
        yield c
```

## Base URL Management

### Environment Variable

```python
# .env.test or pytest.ini
# API_BASE_URL=https://api.staging.example.com

@pytest.fixture
def base_url():
    url = os.environ.get("API_BASE_URL")
    if not url:
        pytest.skip("API_BASE_URL not set")
    return url
```

### Per-Environment

```python
@pytest.fixture
def base_url():
    env = os.environ.get("TEST_ENV", "local")
    urls = {
        "local": "http://localhost:8000",
        "staging": "https://api.staging.example.com",
        "integration": "https://api.integration.example.com",
    }
    return urls.get(env, urls["local"])
```

## Client Fixtures

### Function-Scoped (Default)

```python
@pytest.fixture
def client(base_url):
    with httpx.Client(base_url=base_url) as c:
        yield c
# New client per test; no shared state
```

### Session-Scoped (Connection Reuse)

```python
@pytest.fixture(scope="session")
def client(base_url):
    with httpx.Client(base_url=base_url) as c:
        yield c
# Reuse connection across tests; faster but shared state
```

### With Custom Headers

```python
@pytest.fixture
def client(base_url, default_headers):
    with httpx.Client(
        base_url=base_url,
        headers=default_headers,
    ) as c:
        yield c

@pytest.fixture
def default_headers():
    return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "User-Agent": "qa-httpx-tests/1.0",
    }
```

## Auth Fixtures

```python
@pytest.fixture
def token(client, base_url):
    response = client.post(
        f"{base_url}/auth/login",
        json={
            "email": os.environ.get("TEST_USER_EMAIL", "test@example.com"),
            "password": os.environ.get("TEST_USER_PASSWORD", "test"),
        },
    )
    assert response.status_code == 200
    return response.json()["token"]


@pytest.fixture
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


@pytest.fixture
def auth_client(client, auth_headers):
    client.headers.update(auth_headers)
    return client
```

## pytest-asyncio Configuration

### pyproject.toml

```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
asyncio_default_fixture_loop_scope = "function"
testpaths = ["tests"]
```

### pytest.ini

```ini
[pytest]
asyncio_mode = auto
asyncio_default_fixture_loop_scope = function
```

## Timeout and Retry

```python
from httpx import Timeout, Limits

@pytest.fixture
def client(base_url):
    with httpx.Client(
        base_url=base_url,
        timeout=Timeout(60.0),
        limits=Limits(max_keepalive_connections=5, max_connections=10),
    ) as c:
        yield c
```

## Markers for API Tests

```toml
# pyproject.toml
[tool.pytest.ini_options]
markers = [
    "api: marks tests as API integration tests",
    "slow: marks tests as slow (network-dependent)",
]
```

```python
@pytest.mark.api
def test_users_endpoint(client, base_url):
    response = client.get(f"{base_url}/users")
    assert response.status_code == 200
```

## Directory Layout

```
tests/
  conftest.py           # Shared fixtures
  api/
    conftest.py         # API-specific fixtures (auth, etc.)
    test_users_api.py
    test_products_api.py
    test_auth_api.py
  fixtures/
    sample_users.json
```

## Environment Config

```python
# tests/conftest.py
def pytest_configure(config):
    os.environ.setdefault("TESTING", "1")
    if "API_BASE_URL" not in os.environ:
        os.environ["API_BASE_URL"] = "http://localhost:8000"
```
