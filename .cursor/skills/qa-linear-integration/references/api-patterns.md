# Linear GraphQL API Patterns

*GraphQL operations for creating, querying, and updating Linear issues.*

---

## Base URL

```
https://api.linear.app/graphql
```

**Headers:**
```
Authorization: Bearer {LINEAR_API_KEY}
Content-Type: application/json
```

---

## Create Issue

```graphql
mutation IssueCreate($input: IssueCreateInput!) {
  issueCreate(input: $input) {
    issue {
      id
      identifier
      title
      url
      state { name }
    }
    success
  }
}
```

**Variables:**
```json
{
  "input": {
    "teamId": "uuid-of-team",
    "title": "Login fails when password contains special chars",
    "description": "**Expected:** User should log in successfully.\n\n**Actual:** 500 error.\n\n**Steps:** 1. Go to /login 2. Enter password with !@# 3. Submit",
    "priority": 1,
    "labelIds": ["uuid-of-label"],
    "projectId": "uuid-of-project",
    "cycleId": "uuid-of-cycle"
  }
}
```

**Priority values:** 0 = No priority, 1 = Urgent, 2 = High, 3 = Medium, 4 = Low.

---

## Update Issue

```graphql
mutation IssueUpdate($id: String!, $input: IssueUpdateInput!) {
  issueUpdate(id: $id, input: $input) {
    issue {
      id
      identifier
      title
      state { name }
    }
    success
  }
}
```

**Variables:**
```json
{
  "id": "uuid-of-issue",
  "input": {
    "title": "Updated title",
    "description": "Updated description",
    "priority": 2,
    "stateId": "uuid-of-state"
  }
}
```

---

## Query Issues

```graphql
query Issues($filter: IssueFilter) {
  issues(filter: $filter, first: 50) {
    nodes {
      id
      identifier
      title
      description
      state { name }
      priority
      url
      createdAt
    }
    pageInfo { hasNextPage endCursor }
  }
}
```

**Filter examples:**
```json
{
  "filter": {
    "state": { "name": { "neq": "Done" } },
    "team": { "key": { "eq": "ENG" } }
  }
}
```

```json
{
  "filter": {
    "identifier": { "containsIgnoreCase": "BUG" }
  }
}
```

---

## Query Teams

```graphql
query Teams {
  teams {
    nodes {
      id
      name
      key
    }
  }
}
```

Use `id` for `teamId` in issueCreate.

---

## Query Projects

```graphql
query Projects {
  projects {
    nodes {
      id
      name
      state
    }
  }
}
```

---

## Query Cycles

```graphql
query Cycles($filter: CycleFilter) {
  cycles(filter: $filter, first: 20) {
    nodes {
      id
      name
      state
      startsAt
      endsAt
    }
  }
}
```

**Filter by team:**
```json
{
  "filter": {
    "teamId": { "eq": "uuid-of-team" }
  }
}
```

---

## Create Issue Relation (Blocks / Relates To)

```graphql
mutation IssueRelationCreate($input: IssueRelationCreateInput!) {
  issueRelationCreate(input: $input) {
    issueRelation {
      id
    }
    success
  }
}
```

**Variables (blocks):**
```json
{
  "input": {
    "issueId": "uuid-of-blocking-issue",
    "relatedIssueId": "uuid-of-blocked-issue",
    "type": "blocks"
  }
}
```

**Relation types:** `blocks`, `duplicate`, `related`.

---

## Create Sub-Issue (Parent)

Use `parentId` in issueCreate:

```json
{
  "input": {
    "teamId": "uuid",
    "title": "Sub-task title",
    "parentId": "uuid-of-parent-issue"
  }
}
```

---

## Error Handling

GraphQL returns `errors` array on failure:

```json
{
  "data": null,
  "errors": [
    {
      "message": "Issue validation failed",
      "extensions": { "code": "VALIDATION_ERROR" }
    }
  ]
}
```

Check `errors` before using `data`; surface `message` to user.
