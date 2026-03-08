# Mermaid Sequence Diagram Syntax — QA Use Cases

## Syntax Overview

Sequence diagrams use `sequenceDiagram`. Participants: `participant A`, `actor User`. Messages: `A->>B: message`, `A-->>B: async`, `A->>+B: create`, `A->>-B: destroy`. Loops: `loop`, `alt`, `opt`, `par`.

```mermaid
sequenceDiagram
    participant U as User
    participant A as API
    U->>A: request
    A-->>U: response
```

## Example 1: API Interaction

```mermaid
sequenceDiagram
    participant T as Test
    participant API as REST API
    participant DB as Database
    T->>API: POST /users
    API->>DB: INSERT user
    DB-->>API: OK
    API-->>T: 201 Created
```

## Example 2: Login Flow

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend
    participant Auth as Auth Service
    participant DB as Database
    U->>UI: Enter credentials
    UI->>Auth: POST /login
    Auth->>DB: Validate
    alt Valid
        DB-->>Auth: User
        Auth-->>UI: JWT
        UI-->>U: Redirect
    else Invalid
        Auth-->>UI: 401
        UI-->>U: Error message
    end
```

## Example 3: Test Execution Flow

```mermaid
sequenceDiagram
    participant CI as CI Runner
    participant Runner as Test Runner
    participant SUT as System
    CI->>Runner: Execute suite
    loop Each test
        Runner->>SUT: Setup
        Runner->>SUT: Execute
        Runner->>Runner: Assert
    end
    Runner-->>CI: Results
```

## When to Use

- **API flows:** Request/response, error paths
- **Auth flows:** Login, token refresh, logout
- **Test execution:** Setup → act → assert sequence
