# httpx Response Validation

## Status Codes

```python
response = client.get(f"{base_url}/users")
assert response.status_code == 200

response = client.post(f"{base_url}/users", json={...})
assert response.status_code == 201

response = client.delete(f"{base_url}/users/1")
assert response.status_code == 204

response = client.get(f"{base_url}/users/99999")
assert response.status_code == 404

response = client.get(f"{base_url}/users")  # No auth
assert response.status_code == 401

response = client.post(f"{base_url}/users", json={"email": "invalid"})
assert response.status_code == 400
```

| Code | Typical Use |
| ---- | ----------- |
| 200 | OK — GET, PUT, PATCH success |
| 201 | Created — POST success |
| 204 | No Content — DELETE success |
| 400 | Bad Request — validation error |
| 401 | Unauthorized — missing/invalid auth |
| 403 | Forbidden — insufficient permissions |
| 404 | Not Found — resource missing |
| 409 | Conflict — duplicate, constraint violation |
| 422 | Unprocessable Entity — semantic validation |
| 500 | Internal Server Error |

## JSON Body Assertions

### Basic Checks

```python
data = response.json()
assert "users" in data
assert isinstance(data["users"], list)
assert len(data["users"]) > 0
```

### Partial Match (Dynamic Fields)

```python
# Use dict subset for id, createdAt, etc.
user = response.json()
assert user["email"] == "test@example.com"
assert "id" in user
assert isinstance(user["id"], int)
```

### Nested Structure

```python
data = response.json()
assert "data" in data
assert "items" in data["data"]
assert all("id" in item for item in data["data"]["items"])
```

## Header Assertions

```python
assert "application/json" in response.headers.get("content-type", "")
assert "x-request-id" in response.headers
assert response.headers["cache-control"] == "no-cache"
```

## Schema Validation with Pydantic

### Define Model

```python
from pydantic import BaseModel

class UserResponse(BaseModel):
    id: int
    email: str
    name: str | None = None
```

### Validate Response

```python
def test_user_response_schema(client, base_url, auth_headers):
    response = client.get(f"{base_url}/users/1", headers=auth_headers)
    assert response.status_code == 200
    user = UserResponse.model_validate(response.json())
    assert user.id == 1
    assert "@" in user.email
```

### List Response

```python
class UserListResponse(BaseModel):
    users: list[UserResponse]
    total: int

def test_user_list_schema(client, base_url, auth_headers):
    response = client.get(f"{base_url}/users", headers=auth_headers)
    assert response.status_code == 200
    data = UserListResponse.model_validate(response.json())
    assert isinstance(data.users, list)
    assert data.total >= 0
```

### ValidationError Handling

```python
from pydantic import ValidationError

def test_invalid_response_raises(client, base_url):
    response = client.get(f"{base_url}/broken")
    assert response.status_code == 200
    with pytest.raises(ValidationError):
        UserResponse.model_validate(response.json())
```

## JSON Schema Validation

```python
import jsonschema

USER_SCHEMA = {
    "type": "object",
    "required": ["id", "email"],
    "properties": {
        "id": {"type": "integer"},
        "email": {"type": "string", "format": "email"},
        "name": {"type": "string"},
    },
}

def test_user_json_schema(client, base_url, auth_headers):
    response = client.get(f"{base_url}/users/1", headers=auth_headers)
    assert response.status_code == 200
    jsonschema.validate(response.json(), USER_SCHEMA)
```

## Content-Type Check

```python
def test_json_response(client, base_url):
    response = client.get(f"{base_url}/users")
    assert response.status_code == 200
    content_type = response.headers.get("content-type", "")
    assert "application/json" in content_type
    # Only then parse JSON
    data = response.json()
```

## Empty Response (204)

```python
def test_delete_returns_empty(client, base_url, auth_headers):
    response = client.delete(f"{base_url}/users/1", headers=auth_headers)
    assert response.status_code == 204
    assert response.content == b""
    # Do not call response.json() on 204
```

## Error Response Structure

```python
def test_validation_error_structure(client, base_url):
    response = client.post(f"{base_url}/users", json={})
    assert response.status_code == 400
    data = response.json()
    assert "errors" in data or "message" in data
    if "errors" in data:
        assert isinstance(data["errors"], list)
```

## Parametrized Assertions

```python
@pytest.mark.parametrize("status,expected", [
    (200, True),
    (201, True),
    (400, False),
    (404, False),
])
def test_status_codes(client, base_url, status, expected):
    # Adjust endpoint to trigger each status
    response = client.get(f"{base_url}/users")
    assert (response.status_code == status) == expected
```
