# Pact Configuration

## Pact Broker Setup

### Environment Variables

| Variable | Description | Required |
| -------- | ----------- | -------- |
| `PACT_BROKER_BASE_URL` | Broker URL (e.g., `https://broker.pactflow.io`) | For publish/verify from broker |
| `PACT_BROKER_TOKEN` | API token for authentication | When broker requires auth |
| `PACT_BROKER_USERNAME` | Basic auth username | Alternative to token |
| `PACT_BROKER_PASSWORD` | Basic auth password | Alternative to token |

### Publish Pact (Consumer)

**JavaScript:**
```json
{
  "scripts": {
    "pact:publish": "pact-broker publish pacts/ --consumer-app-version=$npm_package_version --tag=main"
  }
}
```

**Python:**
```bash
pact-broker publish pacts/ --consumer-app-version=1.2.3 --tag=main
```

### Verify from Broker (Provider)

**JavaScript:**
```typescript
await new Verifier({
  provider: 'UserService',
  providerBaseUrl: process.env.PROVIDER_URL,
  pactBrokerUrl: process.env.PACT_BROKER_BASE_URL,
  pactBrokerToken: process.env.PACT_BROKER_TOKEN,
  consumerVersionSelectors: [{ mainBranch: true }],
}).verifyProvider();
```

**Python:**
```python
verifier.verify_with_broker(
    broker_url=os.environ['PACT_BROKER_BASE_URL'],
    broker_token=os.environ['PACT_BROKER_TOKEN'],
    consumer_version_selectors=[{'mainBranch': True}],
)
```

## CI Integration

### Consumer Pipeline

1. Run consumer tests → generates pact JSON
2. Publish pact to broker with version + branch/tag
3. Trigger provider verification (via webhook or separate job)

```yaml
# GitHub Actions example
- name: Run consumer tests
  run: npm test -- --grep "Pact"

- name: Publish pact
  run: npx pact-broker publish pacts/ --consumer-app-version=${{ github.sha }} --branch=${{ github.ref_name }}
  env:
    PACT_BROKER_BASE_URL: ${{ secrets.PACT_BROKER_BASE_URL }}
    PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}
```

### Provider Pipeline

1. Fetch pacts from broker (or receive webhook)
2. Start provider (or use running instance)
3. Run verification against provider
4. Publish verification results to broker

```yaml
- name: Verify pacts
  run: npm run pact:verify
  env:
    PROVIDER_URL: http://localhost:3000
    PACT_BROKER_BASE_URL: ${{ secrets.PACT_BROKER_BASE_URL }}
    PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}
```

## can-i-deploy

Check if a consumer or provider version is safe to deploy based on verification status.

```bash
# Can consumer v1.2.3 be deployed?
pact-broker can-i-deploy --pacticipant=OrderService --version=1.2.3 --to-environment=production

# Can provider v2.0.0 be deployed?
pact-broker can-i-deploy --pacticipant=UserService --version=2.0.0 --to-environment=production

# Can both be deployed together?
pact-broker can-i-deploy --pacticipant=OrderService --version=1.2.3 --pacticipant=UserService --version=2.0.0
```

### In CI (pre-deploy gate)

```yaml
- name: Can I deploy?
  run: |
    pact-broker can-i-deploy \
      --pacticipant=OrderService \
      --version=${{ github.sha }} \
      --to-environment=staging
  env:
    PACT_BROKER_BASE_URL: ${{ secrets.PACT_BROKER_BASE_URL }}
    PACT_BROKER_TOKEN: ${{ secrets.PACT_BROKER_TOKEN }}
```

## Local Development

### Without Broker

- Consumer: write pact to `pacts/` directory
- Provider: verify from local `pacts/` path
- Share pact files via git or file copy

### With Broker (Pactflow / self-hosted)

- Use broker for all publish/verify
- Tag versions with branch names for branch-based verification
- Use `consumerVersionSelectors` to choose which pacts to verify

## Versioning

- **Consumer version**: Use git SHA, semver, or build number
- **Provider version**: Same as consumer
- **Tagging**: Tag with branch (`main`, `develop`) or environment (`production`, `staging`) for can-i-deploy
