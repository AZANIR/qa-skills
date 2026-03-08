# AssertJ Assertion Reference

## Basic Assertions

```java
import static org.assertj.core.api.Assertions.*;

// Equality
assertThat(actual).isEqualTo(expected);
assertThat(actual).isNotEqualTo(unexpected);

// Null
assertThat(value).isNull();
assertThat(value).isNotNull();

// Boolean
assertThat(condition).isTrue();
assertThat(condition).isFalse();

// Same instance
assertThat(actual).isSameAs(expected);
assertThat(actual).isNotSameAs(other);
```

## String Assertions

```java
assertThat(str).isEqualTo("expected");
assertThat(str).contains("substring");
assertThat(str).startsWith("prefix");
assertThat(str).endsWith("suffix");
assertThat(str).matches("regex.*");
assertThat(str).isBlank();
assertThat(str).isNotEmpty();
assertThat(str).hasSize(10);
```

## Collection Assertions

```java
assertThat(list).isEmpty();
assertThat(list).isNotEmpty();
assertThat(list).hasSize(3);
assertThat(list).contains("a", "b");
assertThat(list).containsExactly("a", "b", "c");
assertThat(list).containsExactlyInAnyOrder("c", "a", "b");
assertThat(list).containsAnyOf("a", "x");
assertThat(list).doesNotContain("x");
assertThat(list).startsWith("a", "b");
assertThat(list).endsWith("b", "c");
assertThat(list).allMatch(e -> e.length() > 0);
assertThat(list).anyMatch(e -> e.equals("target"));
assertThat(list).noneMatch(e -> e.isBlank());
```

## Map Assertions

```java
assertThat(map).isEmpty();
assertThat(map).containsKey("key");
assertThat(map).containsValue("value");
assertThat(map).containsEntry("key", "value");
assertThat(map).hasSize(3);
```

## Number Assertions

```java
assertThat(number).isEqualTo(42);
assertThat(number).isGreaterThan(10);
assertThat(number).isGreaterThanOrEqualTo(10);
assertThat(number).isLessThan(100);
assertThat(number).isBetween(1, 100);
assertThat(number).isPositive();
assertThat(number).isNegative();
assertThat(number).isZero();
```

## Exception Assertions

```java
assertThatThrownBy(() -> service.doSomething())
    .isInstanceOf(ValidationException.class)
    .hasMessage("Invalid input")
    .hasMessageContaining("input")
    .hasCauseInstanceOf(IOException.class);

assertThatCode(() -> service.validCall()).doesNotThrowAnyException();
```

## Optional Assertions

```java
assertThat(optional).isPresent();
assertThat(optional).isEmpty();
assertThat(optional).hasValue("expected");
assertThat(optional).contains("expected");
```

## Object Assertions

```java
assertThat(obj).hasFieldOrProperty("name");
assertThat(obj).hasFieldOrPropertyWithValue("name", "value");
assertThat(obj).extracting("name").isEqualTo("value");
assertThat(obj).extracting("name", "age").containsExactly("John", 30);
```

## Soft Assertions

Collect multiple failures:
```java
assertSoftly(softly -> {
    softly.assertThat(a).isEqualTo(1);
    softly.assertThat(b).isEqualTo(2);
    softly.assertThat(c).isEqualTo(3);
});
```
