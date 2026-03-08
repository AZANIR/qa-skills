# Factory Pattern Implementations for Test Data

## Overview

Factory patterns enable dynamic generation of test data with sensible defaults and per-test overrides. This document covers TypeScript and Python implementations.

---

## TypeScript: fishery

```typescript
import { Factory } from 'fishery';
import type { User } from '../types';

export const UserFactory = Factory.define<User>(({ sequence }) => ({
  id: sequence,
  email: `user${sequence}@example.com`,
  name: `User ${sequence}`,
  createdAt: new Date(),
}));

// Usage
const user = UserFactory.build();
const admin = UserFactory.build({ role: 'admin' });
const users = UserFactory.buildList(5);
```

### Traits

```typescript
export const UserFactory = Factory.define<User>(({ sequence, traits }) => ({
  id: sequence,
  email: `user${sequence}@example.com`,
  name: `User ${sequence}`,
  role: 'user',
})).trait('admin', { role: 'admin' })
  .trait('inactive', { status: 'inactive' });

// Usage
const admin = UserFactory.build({}, { traits: ['admin'] });
```

---

## TypeScript: factory.ts

```typescript
import { factory } from 'factory.ts';
import type { Product } from '../types';

export const ProductFactory = factory.make<Product>(s => ({
  id: s.sequence(),
  sku: `SKU-${s.sequence()}`,
  title: `Product ${s.sequence()}`,
  price: 9.99,
  inStock: true,
}));

// Usage
const product = ProductFactory.build();
const expensive = ProductFactory.build({ price: 999 });
```

---

## Python: factory_boy

```python
import factory
from myapp.models import User

class UserFactory(factory.Factory):
    class Meta:
        model = User

    id = factory.Sequence(lambda n: n)
    email = factory.Sequence(lambda n: f'user{n}@example.com')
    name = factory.Sequence(lambda n: f'User {n}')
    role = 'user'

# Usage
user = UserFactory()
admin = UserFactory(role='admin')
users = UserFactory.create_batch(5)
```

### Subfactories and LazyAttribute

```python
class OrderFactory(factory.Factory):
    class Meta:
        model = Order

    user = factory.SubFactory(UserFactory)
    total = factory.LazyAttribute(lambda o: sum(i.price for i in o.items))
```

---

## Python: pytest-factoryboy

```python
# conftest.py
import pytest
from .factories import UserFactory

@pytest.fixture
def user(db):
    return UserFactory()

@pytest.fixture
def admin_user(db):
    return UserFactory(role='admin')
```

---

## Builder Pattern (TypeScript)

```typescript
class UserBuilder {
  private data: Partial<User> = {};

  withId(id: number) {
    this.data.id = id;
    return this;
  }
  withEmail(email: string) {
    this.data.email = email;
    return this;
  }
  asAdmin() {
    this.data.role = 'admin';
    return this;
  }
  build(): User {
    return { id: 1, email: 'default@example.com', role: 'user', ...this.data };
  }
}

// Usage
const user = new UserBuilder().withEmail('test@example.com').asAdmin().build();
```

---

## Builder Pattern (Python)

```python
class UserBuilder:
    def __init__(self):
        self._data = {}

    def with_email(self, email: str):
        self._data['email'] = email
        return self

    def as_admin(self):
        self._data['role'] = 'admin'
        return self

    def build(self) -> dict:
        return {'id': 1, 'email': 'default@example.com', 'role': 'user', **self._data}
```
