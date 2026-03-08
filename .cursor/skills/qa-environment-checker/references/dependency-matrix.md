# Dependency Matrix for Test Types

## Overview

This reference defines which dependencies and tools are required for different test types. Use this to scope environment checks and avoid running irrelevant checks.

## Test Type → Dependencies

| Test Type | Runtime | Tools | Services | Config |
|-----------|---------|-------|----------|--------|
| **Unit (Jest/Vitest)** | Node.js | npm/pnpm, jest/vitest | None | package.json, jest.config |
| **Unit (pytest)** | Python | pip, pytest | None | pyproject.toml, pytest.ini |
| **E2E (Playwright TS)** | Node.js | npm/pnpm, Playwright, browsers | Optional API | playwright.config.ts |
| **E2E (Playwright Py)** | Python | pip, Playwright, browsers | Optional API | pytest.ini, playwright |
| **E2E (Cypress)** | Node.js | npm/pnpm, Cypress | Optional API | cypress.config.ts |
| **API (Supertest/httpx)** | Node/Python | Runtime + HTTP client | API under test | BASE_URL, .env |
| **API (Postman/k6)** | Node/standalone | Postman/k6 CLI | API under test | Collection, env vars |
| **DB integration** | Runtime | DB client | Database | DATABASE_URL, migrations |
| **Visual regression** | Node.js | Playwright/Percy/Backstop | App server | Screenshot config |
| **Performance (k6)** | Standalone | k6 binary | Target URL | k6 script |
| **Performance (JMeter)** | JVM | Java, JMeter | Target URL | .jmx plan |
| **Security (ZAP)** | Java | Java, ZAP | Target URL | ZAP config |
| **Mobile (Appium)** | Node/Python | Appium, drivers | Device/emulator | Appium config |

## Runtime Version Requirements

| Runtime | Minimum | Recommended |
|---------|---------|-------------|
| Node.js | 18.x | 20.x LTS |
| Python | 3.10 | 3.12 |
| Java (JMeter) | 11 | 17 |
| Java (ZAP) | 11 | 17 |

## Package Manager Checks

| Manager | Check Command |
|---------|---------------|
| npm | `npm --version` |
| pnpm | `pnpm --version` |
| yarn | `yarn --version` |
| pip | `pip --version` |
| poetry | `poetry --version` |

## Browser/Driver Checks

| Tool | Check |
|------|-------|
| Playwright | `npx playwright install chromium` (or verify browsers exist) |
| Cypress | `npx cypress verify` |
| Chrome/Chromium | Path in PATH or known location |
| WebDriver | chromedriver/geckodriver version |

## Database Clients

| DB | Package/Driver |
|----|----------------|
| PostgreSQL | psycopg2, pg, postgres.js |
| MySQL | mysql-connector, mysql2 |
| MongoDB | pymongo, mongodb |
| SQLite | built-in (sqlite3) |
| Redis | redis, ioredis |

## Environment Variables by Test Type

| Test Type | Typical Required Vars |
|-----------|------------------------|
| E2E | BASE_URL, (optional) TEST_USER, TEST_PASSWORD |
| API | BASE_URL, API_KEY (if auth) |
| DB | DATABASE_URL |
| Auth tests | TEST_USER, TEST_PASSWORD, ADMIN_USER |
| External services | MOCK_SERVER_URL, WEBHOOK_URL |

## Config File Locations

| Stack | Config Files |
|-------|--------------|
| Node/TS | package.json, tsconfig.json, .env |
| Jest | jest.config.js, jest.config.ts |
| Vitest | vitest.config.ts |
| Playwright | playwright.config.ts |
| Cypress | cypress.config.ts |
| pytest | pyproject.toml, pytest.ini, conftest.py |
| Robot | robot.yaml, variables.py |

## Check Order Recommendation

1. **Runtime** (Node/Python/Java) — Fail fast if missing
2. **Package manager** — Required for install
3. **Config files** — Present and valid
4. **Dependencies installed** — node_modules, venv, etc.
5. **Tools** (Playwright, Cypress) — If E2E
6. **Services** (API, DB) — If integration/E2E
7. **Env vars** — Required vars set
8. **Ports** — If binding local server

## Skipping Checks

- **Unit-only:** Skip API, DB, browser checks
- **API-only:** Skip browser, DB (unless API uses DB)
- **E2E:** Run full matrix
- **CI vs local:** CI may have different env (e.g., no browsers in headless runner)
