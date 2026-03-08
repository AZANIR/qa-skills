# Cypress Best Practices

## Selecting Elements

### Prefer data-cy Attributes

```typescript
// Good — stable, test-specific
cy.get('[data-cy="submit-button"]').click();
cy.get('[data-cy="user-email"]').type('test@example.com');

// Avoid — brittle
cy.get('.btn-primary').click();
cy.get('#email').type('test@example.com');
cy.get('div > span:nth-child(2)').click();
```

Add `data-cy` to production markup or via build step. Never rely solely on CSS classes or structure that may change.

---

## Anti-Patterns to Avoid

### No cy.wait(ms)

```typescript
// Bad — flaky, arbitrary delay
cy.wait(3000);
cy.get('[data-cy="results"]').click();

// Good — wait for condition or request
cy.intercept('GET', '/api/results').as('getResults');
cy.visit('/dashboard');
cy.wait('@getResults');
cy.get('[data-cy="results"]').should('be.visible').click();
```

### No Cross-Test Dependencies

Each test must be independent. Do not rely on execution order or shared mutable state.

```typescript
// Bad
let sharedId;
it('creates item', () => { sharedId = ...; });
it('edits item', () => { cy.visit(`/items/${sharedId}`); });

// Good
it('edits item', () => {
  cy.login();
  cy.createItemViaApi({ name: 'Test' }).then((id) => {
    cy.visit(`/items/${id}`);
    // ...
  });
});
```

### Proper Cleanup

- Use `beforeEach` / `afterEach` for setup and teardown
- Use `cy.session()` for login to cache auth across tests
- Reset DB or use isolated test data when possible

---

## Flake Prevention

1. **Assert before acting** — Ensure element is ready before click/type
2. **Use aliases for async** — `cy.wait('@alias')` instead of fixed delays
3. **Retry-ability** — Chain assertions; Cypress retries until timeout
4. **Avoid testing third-party** — Mock external APIs with `cy.intercept`
5. **Stable selectors** — `data-cy` over classes/IDs that change

---

## CI Setup

- Set `baseUrl` via `CYPRESS_BASE_URL` or `env.baseUrl`
- Use `retries: { runMode: 2 }` for transient failures
- Enable `video: true` and archive on failure
- Run in parallel with `cypress run --record` (Cypress Dashboard)
- Use `--config viewportWidth=1280` for consistent viewport
