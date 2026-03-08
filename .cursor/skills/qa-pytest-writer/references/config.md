# Pytest Configuration

## pyproject.toml (Preferred)

Modern Python projects use `pyproject.toml`:

```toml
[tool.pytest.ini_options]
minversion = "7.0"
testpaths = ["tests"]
pythonpath = ["."]
addopts = "-v --tb=short"
asyncio_mode = "auto"
filterwarnings = [
    "ignore::DeprecationWarning",
    "ignore::UserWarning",
]
markers = [
    "slow: marks tests as slow (deselect with '-m \"not slow\"')",
    "integration: marks integration tests",
]
```

## pytest.ini (Legacy)

```ini
[pytest]
minversion = 7.0
testpaths = tests
pythonpath = .
addopts = -v --tb=short
markers =
    slow: marks tests as slow
    integration: marks integration tests
filterwarnings =
    ignore::DeprecationWarning
```

## conftest.py

Use for fixtures, hooks, and plugin-like behavior. No pytest.ini options here; use for code.

```python
# conftest.py
import pytest

def pytest_configure(config):
    config.addinivalue_line("markers", "slow: marks tests as slow")

@pytest.fixture(scope="session")
def app():
    from myapp import create_app
    return create_app()
```

## Key Options

| Option | Description |
| ------ | ----------- |
| `testpaths` | Directories to search for tests |
| `pythonpath` | Paths to add to PYTHONPATH |
| `addopts` | Default command-line options |
| `minversion` | Minimum pytest version |
| `asyncio_mode` | `auto` or `strict` for pytest-asyncio |
| `filterwarnings` | Suppress or promote warnings |
| `markers` | Register custom markers |

## Markers

### Registering Markers

In pyproject.toml:

```toml
[tool.pytest.ini_options]
markers = [
    "slow: marks tests as slow",
    "integration: marks integration tests",
    "unit: marks unit tests",
]
```

### Using Markers

```python
@pytest.mark.slow
def test_heavy():
    pass

@pytest.mark.integration
def test_api():
    pass
```

### Running by Marker

```bash
pytest -m "not slow"
pytest -m integration
pytest -m "slow and integration"
```

## Plugins

### pytest-cov (Coverage)

```bash
pip install pytest-cov
pytest --cov=src --cov-report=html
```

In config:

```toml
[tool.pytest.ini_options]
addopts = "--cov=src --cov-report=term-missing"
```

### pytest-xdist (Parallel)

```bash
pip install pytest-xdist
pytest -n auto
```

### pytest-asyncio

```bash
pip install pytest-asyncio
```

```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"
```

### pytest-html (Reports)

```bash
pip install pytest-html
pytest --html=report.html
```

### pytest-factoryboy

```bash
pip install pytest-factoryboy
```

Integrates Factory Boy with pytest fixtures for test data factories.

## Hooks (conftest.py)

```python
def pytest_collection_modifyitems(config, items):
    """Add markers based on path."""
    for item in items:
        if "integration" in str(item.fspath):
            item.add_marker(pytest.mark.integration)

def pytest_configure(config):
    """Register markers."""
    config.addinivalue_line("markers", "slow: slow tests")
```

## Environment Variables

Set in conftest.py or shell:

```python
# conftest.py
import os
os.environ["TESTING"] = "1"
```

Or use `pytest-env` plugin or `.env` with `python-dotenv`.
