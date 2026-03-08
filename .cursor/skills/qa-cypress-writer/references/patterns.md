# Cypress Test Patterns

## E2E Flows

### Basic Page Visit and Interaction

```typescript
describe('Login flow', () => {
  it('logs in successfully', () => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type('user@example.com');
    cy.get('[data-cy="password-input"]').type('secret');
    cy.get('[data-cy="submit-btn"]').click();
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome').should('be.visible');
  });
});
```

### Chained Commands and Retry-ability

Cypress automatically retries commands until assertions pass or timeout:

```typescript
cy.get('[data-cy="loading"]').should('not.exist');
cy.get('[data-cy="results"]').should('be.visible').and('contain', 'Success');
```

### Time-Travel Debugging

Use `.pause()` or Cypress UI to step through commands and inspect DOM at each step.

---

## Component Testing

### React with cy.mount()

```typescript
import { mount } from 'cypress/react18';
import { Button } from './Button';

describe('Button', () => {
  it('calls onClick when clicked', () => {
    const onClick = cy.stub();
    cy.mount(<Button label="Submit" onClick={onClick} />);
    cy.get('[data-cy="button"]').click();
    cy.wrap(onClick).should('have.been.calledOnce');
  });

  it('renders with custom props', () => {
    cy.mount(<Button label="Save" disabled />);
    cy.get('[data-cy="button"]').should('be.disabled');
  });
});
```

### Vue with cy.mount()

```typescript
import { mount } from 'cypress/vue';
import HelloWorld from './HelloWorld.vue';

describe('HelloWorld', () => {
  it('emits event on click', () => {
    cy.mount(HelloWorld, { props: { msg: 'Hello' } });
    cy.get('button').click();
    cy.get('@emitSpy').should('have.been.calledWith', 'greet');
  });
});
```

### Slots and Events

```typescript
cy.mount(Component, {
  props: { title: 'Test' },
  slots: { default: '<span>Slot content</span>' },
});
```

---

## Custom Commands

### Defining Commands (cypress/support/commands.ts)

```typescript
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-cy="email-input"]').type(email);
    cy.get('[data-cy="password-input"]').type(password);
    cy.get('[data-cy="submit-btn"]').click();
    cy.url().should('include', '/dashboard');
  });
});

Cypress.Commands.add('fillForm', (selector: string, data: Record<string, string>) => {
  Object.entries(data).forEach(([name, value]) => {
    cy.get(`${selector} [data-cy="${name}"]`).clear().type(value);
  });
});
```

### Using Custom Commands

```typescript
beforeEach(() => {
  cy.login('user@example.com', 'password');
});

it('creates a new item', () => {
  cy.visit('/items/new');
  cy.fillForm('[data-cy="item-form"]', { name: 'Item 1', description: 'Desc' });
  cy.get('[data-cy="save-btn"]').click();
});
```

---

## Fixtures

### Loading Fixtures

```typescript
cy.fixture('users.json').then((users) => {
  cy.get('[data-cy="user-select"]').select(users[0].name);
});
```

### With cy.intercept

```typescript
cy.fixture('users.json').as('users');
cy.intercept('GET', '/api/users', { fixture: 'users.json' }).as('getUsers');
cy.visit('/users');
cy.wait('@getUsers');
```

---

## Aliases and cy.wait(@alias)

### Request Aliases

```typescript
cy.intercept('POST', '/api/orders').as('createOrder');
cy.get('[data-cy="checkout"]').click();
cy.wait('@createOrder').its('response.statusCode').should('eq', 201);
```

### Fixture Aliases

```typescript
cy.fixture('order.json').as('orderData');
cy.get('@orderData').then((data) => {
  cy.get('[data-cy="order-id"]').type(data.id);
});
```

---

## Assertions in E2E

```typescript
cy.get('[data-cy="count"]').should('have.text', '5');
cy.get('form').should('have.class', 'valid');
cy.get('[data-cy="list"]').find('li').should('have.length', 3);
```
