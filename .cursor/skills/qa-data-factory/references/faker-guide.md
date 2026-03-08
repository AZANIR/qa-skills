# Faker Library Usage Guide for Realistic Test Data

## Overview

Faker libraries generate realistic-looking random data for names, addresses, emails, dates, and more. Support for multiple locales ensures culturally appropriate data.

---

## TypeScript: @faker-js/faker

### Basic Usage

```typescript
import { faker } from '@faker-js/faker';

// Names
faker.person.fullName();      // "John Doe"
faker.person.firstName();     // "Jane"
faker.internet.email();       // "john.doe@example.com"

// Addresses
faker.location.streetAddress();
faker.location.city();
faker.location.country();

// Dates
faker.date.past();
faker.date.between({ from: '2020-01-01', to: '2024-12-31' });
```

### Locale

```typescript
import { faker } from '@faker-js/faker/locale/de';

faker.person.fullName();  // German names
faker.location.city();   // German cities
```

### Reproducibility (Seed)

```typescript
faker.seed(12345);
const name1 = faker.person.fullName();
faker.seed(12345);
const name2 = faker.person.fullName();
// name1 === name2
```

### Common Providers

| Provider | Example |
|----------|---------|
| `faker.person.*` | fullName, firstName, lastName |
| `faker.internet.*` | email, userName, url |
| `faker.finance.*` | creditCardNumber, iban (test patterns) |
| `faker.commerce.*` | productName, price, department |
| `faker.string.uuid()` | UUID |
| `faker.number.int({ min, max })` | Bounded integers |

---

## Python: Faker

### Basic Usage

```python
from faker import Faker

fake = Faker()

# Names
fake.name()
fake.first_name()
fake.last_name()

# Emails and internet
fake.email()
fake.user_name()
fake.url()

# Addresses
fake.street_address()
fake.city()
fake.country()
```

### Locale

```python
fake_de = Faker('de_DE')
fake_de.name()   # German names
fake_de.city()   # German cities
```

### Reproducibility (Seed)

```python
Faker.seed(12345)
name1 = fake.name()
Faker.seed(12345)
name2 = fake.name()
# name1 == name2
```

### Common Providers

| Provider | Example |
|----------|---------|
| `fake.name()`, `fake.first_name()` | Names |
| `fake.email()`, `fake.user_name()` | Internet |
| `fake.street_address()`, `fake.city()` | Addresses |
| `fake.credit_card_number()` | Test card numbers |
| `fake.uuid4()` | UUID |
| `fake.date_between()`, `fake.date_time_between()` | Dates |
| `fake.random_int(min=1, max=100)` | Integers |

---

## Test Card Numbers

Use provider-specific test patterns (e.g., 4111... for Visa test cards). Never use real card numbers.

---

## Best Practices

1. **Set seed** for reproducible test runs when debugging.
2. **Use locale** when testing i18n or region-specific formats.
3. **Avoid PII** — generated data should not resemble real people.
4. **Unique identifiers** — use sequences or UUIDs when uniqueness matters.
