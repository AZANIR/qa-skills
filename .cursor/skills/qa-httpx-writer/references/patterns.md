# httpx API Test Patterns

## Sync Client (httpx.Client)

```python
import httpx

def test_get_users():
    with httpx.Client(base_url="https://api.example.com") as client:
        response = client.get("/users")
        assert response.status_code == 200
        data = response.json()
        assert "users" in data
        assert isinstance(data["users"], list)
```

## Async Client (httpx.AsyncClient)

```python
import httpx
import pytest

@pytest.mark.asyncio
async def test_get_users_async():
    async with httpx.AsyncClient(base_url="https://api.example.com") as client:
        response = await client.get("/users")
        assert response.status_code == 200
        data = response.json()
        assert "users" in data
```

## CRUD Endpoints

### GET (List)

```python
def test_get_users_list(client, base_url):
    response = client.get(f"{base_url}/users")
    assert response.status_code == 200
    assert "application/json" in response.headers.get("content-type", "")
    data = response.json()
    assert isinstance(data.get("users"), list)

def test_get_users_unauthorized(client, base_url):
    response = client.get(f"{base_url}/users")  # No auth
    assert response.status_code == 401
```

### GET (Single)

```python
def test_get_user_by_id(client, base_url, auth_headers):
    response = client.get(f"{base_url}/users/1", headers=auth_headers)
    assert response.status_code == 200
    user = response.json()
    assert user["id"] == 1
    assert "email" in user

def test_get_user_not_found(client, base_url, auth_headers):
    response = client.get(f"{base_url}/users/99999", headers=auth_headers)
    assert response.status_code == 404
```

### POST (Create)

```python
def test_create_user(client, base_url, auth_headers):
    payload = {"email": "test@example.com", "name": "Test User"}
    response = client.post(f"{base_url}/users", json=payload, headers=auth_headers)
    assert response.status_code == 201
    user = response.json()
    assert "id" in user
    assert user["email"] == "test@example.com"

def test_create_user_validation_error(client, base_url, auth_headers):
    response = client.post(
        f"{base_url}/users",
        json={"email": "invalid"},
        headers=auth_headers
    )
    assert response.status_code == 400
    errors = response.json()
    assert "errors" in errors or "message" in errors
```

### PUT/PATCH (Update)

```python
def test_update_user(client, base_url, auth_headers):
    response = client.put(
        f"{base_url}/users/1",
        json={"name": "Updated Name"},
        headers=auth_headers
    )
    assert response.status_code == 200
    user = response.json()
    assert user["name"] == "Updated Name"
```

### DELETE

```python
def test_delete_user(client, base_url, auth_headers):
    response = client.delete(f"{base_url}/users/1", headers=auth_headers)
    assert response.status_code == 204
    assert response.content == b""

def test_delete_user_not_found(client, base_url, auth_headers):
    response = client.delete(f"{base_url}/users/99999", headers=auth_headers)
    assert response.status_code == 404
```

## Authentication

### Bearer Token

```python
@pytest.fixture
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}

@pytest.fixture
def token(client, base_url):
    response = client.post(
        f"{base_url}/auth/login",
        json={"email": "test@example.com", "password": "secret"}
    )
    assert response.status_code == 200
    return response.json()["token"]

def test_protected_route(client, base_url, auth_headers):
    response = client.get(f"{base_url}/users", headers=auth_headers)
    assert response.status_code == 200
```

### API Key

```python
@pytest.fixture
def api_key_headers():
    return {"X-API-Key": os.environ.get("TEST_API_KEY", "test-key")}

def test_with_api_key(client, base_url, api_key_headers):
    response = client.get(f"{base_url}/api/data", headers=api_key_headers)
    assert response.status_code == 200
```

### Basic Auth

```python
def test_basic_auth(client, base_url):
    auth = httpx.BasicAuth("user", "password")
    response = client.get(f"{base_url}/admin", auth=auth)
    assert response.status_code == 200
```

### OAuth2

```python
# Manual token flow
def test_oauth2_protected(client, base_url, oauth_token):
    response = client.get(
        f"{base_url}/protected",
        headers={"Authorization": f"Bearer {oauth_token}"}
    )
    assert response.status_code == 200
```

### Cookies (Session)

```python
def test_session_cookies(client, base_url):
    # Login to set cookies
    client.post(
        f"{base_url}/auth/login",
        json={"email": "test@example.com", "password": "secret"}
    )
    # Subsequent request uses session cookies
    response = client.get(f"{base_url}/users")
    assert response.status_code == 200
```

## File Upload

```python
def test_file_upload(client, base_url, auth_headers, tmp_path):
    file_path = tmp_path / "sample.pdf"
    file_path.write_bytes(b"%PDF-1.4 fake content")

    with open(file_path, "rb") as f:
        files = {"file": ("sample.pdf", f, "application/pdf")}
        response = client.post(
            f"{base_url}/upload",
            files=files,
            headers=auth_headers
        )

    assert response.status_code == 201
    data = response.json()
    assert "url" in data or "id" in data
```

## Streaming

```python
def test_streaming_response(client, base_url):
    with client.stream("GET", f"{base_url}/stream") as response:
        assert response.status_code == 200
        chunks = []
        for chunk in response.iter_bytes():
            chunks.append(chunk)
        assert len(chunks) > 0
```

## Query Parameters

```python
def test_query_params(client, base_url):
    response = client.get(
        f"{base_url}/search",
        params={"q": "test", "limit": 5}
    )
    assert response.status_code == 200
    # URL: /search?q=test&limit=5
```

## Retry Logic

```python
from httpx import Limits, Timeout

@pytest.fixture
def client_with_retry(base_url):
    transport = httpx.HTTPTransport(retries=3)
    with httpx.Client(
        base_url=base_url,
        transport=transport,
        timeout=Timeout(30.0)
    ) as client:
        yield client
```

## requests Fallback

When httpx is not available, use requests with similar patterns:

```python
import requests

def test_with_requests(base_url):
    response = requests.get(f"{base_url}/users")
    assert response.status_code == 200
    data = response.json()
    assert "users" in data

# Session for connection reuse
def test_with_session(base_url):
    with requests.Session() as session:
        session.headers.update({"Authorization": f"Bearer {token}"})
        response = session.get(f"{base_url}/users")
        assert response.status_code == 200
```
