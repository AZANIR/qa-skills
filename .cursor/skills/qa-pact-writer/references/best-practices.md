# Contract Testing Best Practices

## Consumer-Driven Workflow

1. **Consumer defines expectations** — Consumer team writes tests based on what they need from the API, not what the provider thinks it offers.
2. **Provider verifies** — Provider team runs verification to ensure they meet consumer expectations.
3. **Negotiate changes** — When provider cannot meet expectations, teams discuss; consumer may relax expectations or provider may implement.

### Benefits

- Prevents over-specification (provider only implements what consumers need)
- Catches breaking changes before deployment
- Reduces need for expensive, brittle E2E tests
- Enables independent deployment of services

## Versioning

### Consumer Version

- Use deterministic versions: git SHA, semver from package.json
- Publish on every successful consumer test run
- Tag with branch for branch-based verification

### Provider Version

- Publish verification results with provider version
- Link verification to provider deployment pipeline
- Use same versioning scheme as consumer

### Pact Contract Versioning

- Pact spec version (v3, v4) is separate from application versions
- Upgrade Pact library when adding new features (e.g., PactV4 for async)

## Broker Management

### Organizing Pacts

- One pact per consumer-provider pair
- Use consistent naming: `{ConsumerService}-{ProviderService}.json`
- Tag with environments after successful verification

### Webhooks

- Configure webhook: when consumer publishes pact → trigger provider verification
- Reduces manual coordination between teams
- Provider verification can run in provider's CI or a shared contract verification pipeline

### Retention

- Keep pact history for auditing and debugging
- Consider retention policy for old versions (broker-dependent)
- Archive or delete pacts for deprecated consumer-provider pairs

## Test Design

### Consumer Tests

- **One interaction per test** — Isolate scenarios; easier to debug
- **Minimal expectations** — Assert only what the consumer uses
- **Use matchers** — Avoid exact matches for IDs, timestamps, dynamic data
- **Descriptive scenario names** — `uponReceiving` should describe the scenario clearly

### Provider States

- **Idempotent** — State setup should be repeatable
- **Isolated** — No shared state between interactions
- **Fast** — Prefer in-memory or test DB; avoid slow external calls
- **Parameterized** — Use params for reusable states (e.g., `userId`)

### Provider Verification

- **Run against real provider** — Use actual app, not mocks (except for provider's own dependencies)
- **Test DB or fixtures** — Provider states seed data; use separate test DB
- **Parallel verification** — Verify multiple pacts in parallel when possible

## Pending and WIP Pacts

### Pending Pacts

- New consumer expectations not yet implemented by provider
- Mark as `pending: true` so provider verification does not fail
- Remove pending when provider implements and verification passes

### WIP (Work in Progress) Pacts

- In-progress consumer work; pact may change frequently
- Mark as `wip: true` to exclude from strict verification
- Use `consumerVersionSelectors` with `wip: true` to include in verification without failing

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Better Approach |
| ------------ | ------- | --------------- |
| Copy-pasting provider response | Over-specification; brittle | Use matchers; assert only needed fields |
| Skipping provider states | Flaky verification | Always define state handlers for `given` |
| Verifying against mocks | False confidence | Verify against real provider |
| One giant interaction | Hard to debug | One interaction per scenario |
| Hardcoded broker URL/token | Security risk | Use env vars |
| Ignoring pending pacts | Blocked deployments | Use pending; track implementation |
