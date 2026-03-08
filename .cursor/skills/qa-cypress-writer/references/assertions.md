# Cypress / Chai Assertion Reference

Cypress uses Chai assertions. Two styles: `should` (BDD) and `expect` / `assert` (TDD).

---

## should (BDD, chained)

```typescript
cy.get('[data-cy="title"]').should('have.text', 'Welcome');
cy.get('input').should('have.value', 'test').and('be.visible');
cy.get('button').should('be.disabled').and('have.class', 'primary');
```

---

## expect (TDD, explicit)

```typescript
cy.get('[data-cy="count"]').then(($el) => {
  expect($el.text()).to.eq('5');
  expect($el).to.be.visible;
});
```

---

## assert (TDD, explicit)

```typescript
cy.get('body').then(($body) => {
  assert.isTrue($body.find('[data-cy="success"]').length > 0);
});
```

---

## Common Assertions by Category

### DOM / Visibility

| Assertion | Example |
|-----------|---------|
| `be.visible` | `cy.get('el').should('be.visible')` |
| `be.hidden` | `cy.get('el').should('be.hidden')` |
| `exist` | `cy.get('el').should('exist')` |
| `not.exist` | `cy.get('el').should('not.exist')` |

### Text / Content

| Assertion | Example |
|-----------|---------|
| `have.text` | `cy.get('el').should('have.text', 'Hello')` |
| `contain` | `cy.get('el').should('contain', 'partial')` |
| `include.text` | `cy.get('el').should('include.text', 'partial')` |

### Attributes / Properties

| Assertion | Example |
|-----------|---------|
| `have.attr` | `cy.get('el').should('have.attr', 'href', '/home')` |
| `have.class` | `cy.get('el').should('have.class', 'active')` |
| `have.value` | `cy.get('input').should('have.value', 'typed')` |
| `have.css` | `cy.get('el').should('have.css', 'display', 'block')` |

### State

| Assertion | Example |
|-----------|---------|
| `be.disabled` | `cy.get('button').should('be.disabled')` |
| `be.enabled` | `cy.get('button').should('be.enabled')` |
| `be.checked` | `cy.get('checkbox').should('be.checked')` |
| `be.focused` | `cy.get('input').should('be.focused')` |

### Length / Count

| Assertion | Example |
|-----------|---------|
| `have.length` | `cy.get('li').should('have.length', 5)` |
| `have.length.greaterThan` | `cy.get('li').should('have.length.greaterThan', 0)` |

### URL

| Assertion | Example |
|-----------|---------|
| `include` | `cy.url().should('include', '/dashboard')` |
| `eq` | `cy.url().should('eq', 'https://app.example.com/')` |

### Negation

Prepend `not.`:

```typescript
cy.get('el').should('not.be.visible');
cy.get('el').should('not.contain', 'Error');
```

---

## Chaining Assertions

```typescript
cy.get('[data-cy="card"]')
  .should('be.visible')
  .and('have.class', 'highlighted')
  .and('contain', 'Success');
```

---

## Custom Chai Assertions

```typescript
chai.use((chai, utils) => {
  chai.Assertion.addMethod('validEmail', function () {
    const obj = this._obj;
    const pass = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(obj);
    this.assert(pass, 'expected #{this} to be valid email', 'expected #{this} not to be valid email');
  });
});
```
