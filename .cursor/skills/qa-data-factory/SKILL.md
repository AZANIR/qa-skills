---
name: qa-data-factory
description: Generate realistic test data using fixtures, factory patterns, and faker-based seeds for consistent and reproducible test environments.
output_dir: data/fixtures
---

# QA Data Factory

## Purpose

Generate realistic, consistent, and reproducible test data for automated and manual testing. Supports fixtures (static JSON/YAML), factory patterns (dynamic generation with overrides), faker-based seeds (realistic random data), and builder patterns (fluent API for complex objects). Produces fixtures, factory classes, seed scripts, and data cleanup utilities.

## Trigger Phrases

- "Generate test data for [entity type]"
- "Create fixtures for [Users/Products/Orders]"
- "Factory pattern for test data"
- "Faker-based seed data"
- "Test data builder for [complex object]"
- "Realistic test data with locale [en_US/de_DE]"
- "Seed script for test database"
- "Data cleanup utilities for tests"

## Data Generation Approaches

| Approach | Use Case | Output |
|----------|----------|--------|
| **Fixtures** | Static, version-controlled data; predictable | JSON, YAML, CSV files |
| **Factory pattern** | Dynamic generation with overrides; per-test customization | Factory classes (TypeScript/Python) |
| **Faker-based seeds** | Realistic but random; locale-aware | Seed scripts, inline generation |
| **Builder pattern** | Complex nested objects; fluent API | Builder classes |

See `references/factory-patterns.md` for implementation details.

## TypeScript Tools

| Tool | Purpose |
|------|---------|
| **@faker-js/faker** | Realistic random data (names, emails, addresses, dates) |
| **fishery** | Factory pattern with sequences and traits |
| **factory.ts** | TypeScript factories with associations |
| **Test data builders** | Fluent API for complex objects |

## Python Tools

| Tool | Purpose |
|------|---------|
| **Faker** | Realistic random data; locale support |
| **factory_boy** | Factory pattern with sequences, subfactories |
| **pytest-factoryboy** | Pytest integration; fixtures from factories |
| **model_bakery** | Django model factories; minimal boilerplate |

See `references/faker-guide.md` for usage patterns.

## Data Types Supported

| Type | Examples | Locale-aware |
|------|----------|--------------|
| **Users** | name, email, username, password hash | Yes (names, formats) |
| **Products** | SKU, title, price, category | Yes (currency, formats) |
| **Orders** | order ID, items, totals, status | Yes (dates, currency) |
| **Addresses** | street, city, postal code, country | Yes |
| **Payment info** | card numbers (test), expiry, CVV | Test card patterns |
| **Dates** | birthdate, created_at, expiry | Yes (formats) |
| **Emails** | valid format, domain | Yes |
| **Names** | first, last, full | Yes (locale-specific) |

## Output Artifacts

1. **Test data fixtures** — Static JSON/YAML/CSV for predictable scenarios
2. **Factory classes** — TypeScript or Python factories with overrides
3. **Seed scripts** — Scripts to populate test DB with faker data
4. **Data cleanup utilities** — Teardown scripts, truncate/reset helpers

## Workflow

1. **Identify data needs** — Entity types, required fields, relationships
2. **Choose approach** — Fixtures vs factory vs faker based on use case
3. **Select tools** — Match project stack (TS/Python, framework)
4. **Generate artifacts** — Fixtures, factories, seed scripts
5. **Add cleanup** — Teardown for isolation between test runs

## Scope

**Can do (autonomous):**
- Generate fixtures, factories, seed scripts for specified entities
- Use Faker/faker-js for realistic locale-aware data
- Produce TypeScript (fishery, factory.ts) and Python (factory_boy, Faker) code
- Create data cleanup utilities
- Reference factory-patterns and faker-guide

**Cannot do (requires confirmation):**
- Add new dependencies without approval
- Modify production schemas or migrations
- Generate data for proprietary/restricted formats

**Will not do (out of scope):**
- Execute seed scripts or modify databases directly
- Generate production data or PII
- Bypass data validation or security constraints

## References

| Topic | File |
|-------|------|
| Factory pattern implementations (TS, Python) | `references/factory-patterns.md` |
| Faker library usage for realistic data | `references/faker-guide.md` |

## Quality Checklist

- [ ] Generated data matches entity schema/contract
- [ ] Locale specified when names/addresses/formats matter
- [ ] No real PII or production-like secrets
- [ ] Fixtures are deterministic; faker seeds use configurable seed for reproducibility
- [ ] Cleanup utilities included for test isolation
- [ ] Factory overrides documented for common scenarios

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Data conflicts between tests | Shared state; no cleanup | Add teardown; use unique IDs/emails per test |
| Unrealistic data | Default faker; wrong locale | Set locale; use appropriate faker providers |
| Factory too verbose | Over-specification | Use sensible defaults; override only when needed |
| Seed non-reproducible | Random seed not set | Use faker.seed(123) or equivalent |
| Schema mismatch | Generated fields don't match API/DB | Align with OpenAPI/DB schema; validate output |
