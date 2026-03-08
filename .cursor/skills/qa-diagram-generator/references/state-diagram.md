# Mermaid State Diagram Syntax — QA Use Cases

## Syntax Overview

State diagrams use `stateDiagram-v2`. States: `state "Name" as id`. Transitions: `id --> id2 : event`. Composite: `state state_name { [*] --> s1; s1 --> s2 }`. Choice: `[*] --> choice`, `choice --> s1 : cond`.

```mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Running : start
    Running --> Idle : stop
```

## Example 1: Bug Lifecycle

```mermaid
stateDiagram-v2
    [*] --> New
    New --> InProgress : Assign
    InProgress --> InReview : Submit
    InReview --> InProgress : Reject
    InReview --> Done : Approve
    Done --> InProgress : Reopen
```

## Example 2: Test Case States

```mermaid
stateDiagram-v2
    [*] --> Draft
    Draft --> Ready : Review
    Ready --> Executing : Run
    Executing --> Passed : Pass
    Executing --> Failed : Fail
    Executing --> Blocked : Block
    Passed --> Ready : Rerun
    Failed --> Ready : Rerun
    Blocked --> Ready : Unblock
```

## Example 3: User Session States

```mermaid
stateDiagram-v2
    [*] --> Anonymous
    Anonymous --> Authenticated : Login
    Authenticated --> Anonymous : Logout
    Authenticated --> Expired : Timeout
    Expired --> Anonymous : Re-login
```

## When to Use

- **Bug lifecycle:** New → In Progress → Done
- **Test case states:** Draft, Ready, Executing, Passed/Failed
- **Session/auth states:** Anonymous, Authenticated, Expired
