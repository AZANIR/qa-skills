---
name: qa-pact-writer
description: Generate consumer-driven contract tests using Pact for JavaScript and Python to verify microservice API compatibility between consumer and provider.
output_dir: tests/contracts
dependencies:
  recommended:
    - qa-api-contract-curator
---

# QA Pact Writer

## Purpose

Write consumer-driven contract tests for microservice API compatibility. Transform API contracts (from qa-api-contract-curator) into Pact consumer tests and provider verification tests. Ensure consumer and provider services remain compatible without brittle end-to-end integration tests.

## Key Concepts

| Concept | Description |
| ------- | ----------- |
| **Consumer** | Service that makes requests (e.g., frontend, API gateway, another microservice) |
| **Provider** | Service that serves requests (e.g., REST API, backend service) |
| **Pact** | Contract/agreement describing expected request/response between consumer and provider |
| **Pact Broker** | Central repository for publishing, versioning, and sharing pacts |
| **Consumer-driven** | Consumer defines expectations; provider verifies it meets them |

## Languages & Libraries

| Language | Library | Notes |
| -------- | ------- | ----- |
| **JavaScript/TypeScript** | `@pact-foundation/pact` | PactV4 (default), HTTP + async/sync messages |
| **Python** | `pact-python` | pytest integration, functional state handlers (v2.3+) |

## Workflow

1. **Read API contract** — From qa-api-contract-curator (OpenAPI) or existing endpoint specs
2. **Write consumer tests** — Define interactions (given state, request, expected response); run tests to generate pact JSON
3. **Generate pact files** — Pact JSON written to `pacts/` or published to broker
4. **Write provider verification** — Verify pact against real provider; set up provider states
5. **Publish to broker** — Publish pacts; run can-i-deploy checks; configure webhooks

## Consumer Side

- **Define interactions** — `given` (provider state), `uponReceiving` (scenario name), request (method, path, headers, body), expected response (status, headers, body)
- **Run tests** — Consumer tests hit Pact mock server; generate pact JSON on success
- **Matchers** — `like`, `eachLike`, `term`, `regex` for flexible matching

## Provider Side

- **Verify pact** — Replay interactions from pact against real provider
- **Provider states** — Set up data/state before each interaction (e.g., "user exists", "order is pending")
- **State handlers** — Functions or endpoints that prepare provider for each `given` state

## Pact Broker

- **Publish pacts** — Consumer publishes after tests pass
- **can-i-deploy** — Check if consumer/provider versions are compatible before deployment
- **Webhooks** — Trigger provider verification when new pacts are published

## Key Patterns

| Pattern | JavaScript | Python |
| ------- | ---------- | ------ |
| **Consumer setup** | `new PactV4()` / `new Pact()` | `pact.Consumer(...).has_pact_with(...)` |
| **Provider verification** | `Verifier.verifyProvider()` | `Verifier(provider=...).verify_pacts()` |
| **Provider states** | `given()` in interaction | `state_handler` / `set_state` |
| **Matchers** | `like()`, `eachLike()`, `term()` | `Like`, `EachLike`, `Term` |
| **Pending pacts** | `pending: true` | `pending: True` |
| **WIP pacts** | `wip: true` | `wip: True` |

See `references/patterns.md` for consumer tests, provider verification, matchers, provider states.

## Output

- **Consumer tests** — Jest/Vitest (JS) or pytest (Python) files that generate pacts
- **Provider verification tests** — Scripts or config that verify provider against pacts
- **Pact JSON contracts** — `{consumer}-{provider}.json` in `pacts/` or broker

## Feeds Into / From

- **qa-api-contract-curator** — Use OpenAPI as input for consumer expectations
- **qa-supertest-writer** — Consumer tests may use Supertest-like patterns for HTTP
- **qa-httpx-writer** — Python consumer tests may use httpx for HTTP calls

## Scope

**Can do (autonomous):**
- Generate consumer tests from API contract (OpenAPI or description)
- Generate provider verification setup from pact files
- Define provider states and state handlers
- Use matchers (like, eachLike, term, regex)
- Configure Pact Broker publish and verification
- Add pending/WIP pacts for in-progress work
- Call qa-api-contract-curator for contract when needed

**Cannot do (requires confirmation):**
- Change production API implementation
- Add dependencies not in package.json / requirements.txt
- Override project test config without approval
- Deploy or modify Pact Broker infrastructure

**Will not do (out of scope):**
- Execute tests (user runs `npm test` or `pytest`)
- Set up or host Pact Broker (use Pactflow, self-hosted broker)
- Write E2E browser tests (use qa-playwright-ts-writer)

## Quality Checklist

Before delivering Pact tests:

- [ ] Consumer tests define all interactions from API contract
- [ ] Provider states match consumer `given` clauses
- [ ] Matchers used for dynamic fields (IDs, timestamps, etc.)
- [ ] No hardcoded secrets; use env vars for broker URL, tokens
- [ ] Pact file path or broker config is correct
- [ ] Provider verification runs against real provider (or documented stub)
- [ ] Pending/WIP pacts have clear comments on completion criteria

## Troubleshooting

| Symptom | Likely Cause | Fix |
| ------- | ------------ | --- |
| Pact mock server port conflict | Port already in use | Change `port` in Pact config; use random port |
| Provider verification fails | State handler not matching `given` | Ensure state handler name matches consumer `given` exactly |
| Pact not published to broker | Wrong URL, auth, or version | Verify `PACT_BROKER_BASE_URL`, `PACT_BROKER_TOKEN`; check version in publish |
| Matcher mismatch on provider | Provider returns different shape | Align consumer matchers with provider response; or fix provider |
| Consumer test passes, pact empty | Pact not written before teardown | Ensure `executeTest()` / `verify()` completes; check output path |
| Python state handler not called | Wrong state name or handler signature | Match `given` string; use `state_handler` with correct params (v2.3+) |

## References

- `references/patterns.md` — Consumer tests, provider verification, matchers, provider states
- `references/config.md` — Pact Broker setup, CI integration, can-i-deploy
- `references/best-practices.md` — Consumer-driven workflow, versioning, broker management
