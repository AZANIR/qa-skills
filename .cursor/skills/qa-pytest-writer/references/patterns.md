# Pytest Patterns

## Fixtures

### Basic Fixture

```python
import pytest

@pytest.fixture
def sample_data():
    return {"key": "value"}

def test_with_fixture(sample_data):
    assert sample_data["key"] == "value"
```

### Fixture Scopes

| Scope | Lifecycle |
| ----- | --------- |
| `function` | Default; one per test |
| `class` | One per test class |
| `module` | One per test module |
| `session` | One per test session |

```python
@pytest.fixture(scope="module")
def shared_resource():
    resource = create_resource()
    yield resource
    resource.cleanup()
```

### autouse Fixtures

Run automatically without being requested as a parameter:

```python
@pytest.fixture(autouse=True)
def reset_state():
    # Setup
    yield
    # Teardown
```

### Fixture with Teardown (yield)

```python
@pytest.fixture
def db_connection():
    conn = connect_to_db()
    yield conn
    conn.close()
```

### Fixture Composition

Fixtures can depend on other fixtures:

```python
@pytest.fixture
def base_url():
    return "https://api.example.com"

@pytest.fixture
def api_client(base_url):
    return ApiClient(base_url)
```

## Parametrize

### Basic Parametrize

```python
@pytest.mark.parametrize("a,b,expected", [
    (1, 2, 3),
    (0, 0, 0),
    (-1, 1, 0),
])
def test_add(a, b, expected):
    assert a + b == expected
```

### Parametrize with IDs

```python
@pytest.mark.parametrize("input,expected", [
    ("hello", "HELLO"),
    ("world", "WORLD"),
], ids=["uppercase_hello", "uppercase_world"])
def test_uppercase(input, expected):
    assert input.upper() == expected
```

### Parametrize with Fixtures

```python
@pytest.fixture
def calculator():
    return Calculator()

@pytest.mark.parametrize("a,b,expected", [(1, 2, 3), (4, 5, 9)])
def test_add(calculator, a, b, expected):
    assert calculator.add(a, b) == expected
```

## conftest.py

Shared fixtures and configuration. Place in test directory or package:

```
tests/
  conftest.py          # Shared by all tests in tests/
  unit/
    conftest.py        # Shared by unit tests only
    test_foo.py
  integration/
    conftest.py
    test_api.py
```

```python
# tests/conftest.py
import pytest

@pytest.fixture
def app_config():
    return {"env": "test", "debug": True}
```

## Markers

### Built-in Markers

```python
@pytest.mark.skip(reason="Not implemented yet")
def test_future_feature():
    pass

@pytest.mark.skipif(sys.platform == "win32", reason="Unix only")
def test_unix_only():
    pass

@pytest.mark.xfail(reason="Known bug #123")
def test_known_bug():
    assert False
```

### Custom Markers

Register in pytest.ini or pyproject.toml:

```ini
[pytest]
markers =
    slow: marks tests as slow
    integration: marks integration tests
```

```python
@pytest.mark.slow
def test_heavy_computation():
    pass

@pytest.mark.integration
def test_api_endpoint():
    pass
```

## Async Testing (pytest-asyncio)

```python
import pytest

@pytest.mark.asyncio
async def test_async_function():
    result = await async_operation()
    assert result == expected
```

Configure in pyproject.toml:

```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
```

## Mocking

### unittest.mock (patch)

```python
from unittest.mock import patch, MagicMock

@patch("mymodule.external_api")
def test_with_mock(mock_api):
    mock_api.return_value = {"status": "ok"}
    result = mymodule.fetch_data()
    assert result["status"] == "ok"
    mock_api.assert_called_once()
```

### pytest-mock (mocker fixture)

```python
def test_with_mocker(mocker):
    mock_api = mocker.patch("mymodule.external_api", return_value={"status": "ok"})
    result = mymodule.fetch_data()
    assert result["status"] == "ok"
    mock_api.assert_called_once()
```

### monkeypatch

```python
def test_env_var(monkeypatch):
    monkeypatch.setenv("API_KEY", "test-key")
    assert os.environ["API_KEY"] == "test-key"
    # Automatically restored after test
```

## tmp_path

Built-in fixture for temporary directories:

```python
def test_write_file(tmp_path):
    file_path = tmp_path / "output.txt"
    file_path.write_text("hello")
    assert file_path.read_text() == "hello"
```

## Test Organization

### Test Classes

```python
class TestCalculator:
    def test_add(self):
        assert 1 + 2 == 3

    def test_subtract(self):
        assert 5 - 3 == 2
```

### Naming Convention

- Test files: `test_*.py` or `*_test.py`
- Test functions: `test_*`
- Test classes: `Test*` (optional)
