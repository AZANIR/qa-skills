# Pytest Assertion Patterns

Pytest uses Python's built-in `assert` statement. Failed assertions are rewritten for rich, readable output.

## Basic Assertions

```python
assert x == 5
assert x != 0
assert x > 3
assert x >= 3
assert x < 10
assert x <= 10
assert x in [1, 2, 3]
assert x not in []
assert "hello" in s
assert True
assert not False
```

## Comparison Assertions

```python
# Equality
assert result == expected
assert result != unexpected

# Identity
assert x is None
assert x is not None

# Type
assert isinstance(obj, MyClass)
assert not isinstance(obj, str)
```

## Collection Assertions

```python
# Lists
assert len(items) == 3
assert item in items
assert items == [1, 2, 3]
assert items != []

# Dicts
assert "key" in d
assert d["key"] == value
assert d.get("missing") is None
```

## Exception Testing

### pytest.raises

```python
import pytest

def test_raises_exception():
    with pytest.raises(ValueError):
        raise ValueError("invalid")

def test_raises_with_message():
    with pytest.raises(ValueError, match="invalid"):
        raise ValueError("invalid input")

def test_raises_exception_info():
    with pytest.raises(ValueError) as exc_info:
        raise ValueError("error message")
    assert "error" in str(exc_info.value)
```

### Exception Type and Message

```python
with pytest.raises(ValueError, match=r"expected pattern"):
    failing_function()
```

## Warning Testing

```python
import pytest
import warnings

def test_warning():
    with pytest.warns(UserWarning, match="deprecated"):
        deprecated_function()

def test_warning_count():
    with pytest.warns(UserWarning) as record:
        warn_twice()
    assert len(record) == 2
```

## Approximate Comparisons

For floating-point values, use `pytest.approx`:

```python
def test_float_approximate():
    assert 0.1 + 0.2 == pytest.approx(0.3)

def test_float_with_tolerance():
    assert 3.14159 == pytest.approx(3.14, rel=1e-2)

def test_sequence_approximate():
    assert [1.0, 2.0] == pytest.approx([1.001, 2.002], rel=1e-2)
```

## Mock Assertions (unittest.mock)

```python
from unittest.mock import MagicMock

def test_mock_called(mock_obj):
    mock_obj.method()
    mock_obj.method.assert_called_once()
    mock_obj.method.assert_called_with(arg1, arg2)
    mock_obj.method.assert_called_once_with(arg1, arg2)
    assert mock_obj.method.call_count == 1
```

## Boolean and Truthiness

```python
assert result
assert not empty_list
assert bool(value) is True
```

## String Assertions

```python
assert "substring" in full_string
assert full_string.startswith("prefix")
assert full_string.endswith("suffix")
assert "pattern" in full_string
import re
assert re.search(r"pattern", full_string)
```

## Best Practices

1. **One logical assertion per test** — Easier to diagnose failures
2. **Use descriptive variable names** — `expected_total` vs `x`
3. **Prefer `pytest.approx` for floats** — Avoid direct `==` on floats
4. **Use `pytest.raises` for exceptions** — Don't use try/except with assert
5. **Assert on behavior, not implementation** — Test outcomes, not internals
