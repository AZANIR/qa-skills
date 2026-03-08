# Common Requirement Patterns

Reusable requirement templates for recurring functionality. Adapt IDs, entity names, and specifics to the project.

---

## CRUD Operations

### Create

```
[REQ-FN-XXX] Create [Entity]
Description: The system shall allow [user role] to create a new [entity] by providing [required fields].
Priority: High
Acceptance Criteria:
  Given [user] is authenticated with [create] permission
  When [user] submits the [entity] form with valid [fields]
  Then the system shall persist the [entity] and return a confirmation
  And the system shall assign a unique identifier to the new [entity]
  And the system shall validate [field] according to [rules]
Source: [Code | Description]
Dependencies: [REQ-FN-AUTH]
Status: Draft
```

### Read (Single)

```
[REQ-FN-XXX] View [Entity] Details
Description: The system shall allow [user role] to view details of an existing [entity] by [entity] ID.
Priority: High
Acceptance Criteria:
  Given [user] is authenticated and has access to [entity]
  When [user] requests [entity] with ID [id]
  Then the system shall return [entity] details if authorized
  And the system shall return 404 if [entity] does not exist
  And the system shall return 403 if [user] lacks permission
Source: [Code | Description]
Dependencies: [REQ-FN-AUTH]
Status: Draft
```

### Update

```
[REQ-FN-XXX] Update [Entity]
Description: The system shall allow [user role] to update an existing [entity] by modifying [editable fields].
Priority: High
Acceptance Criteria:
  Given [user] is authenticated with [update] permission
  When [user] submits changes to [entity] [id]
  Then the system shall validate and persist the changes
  And the system shall preserve [immutable fields]
  And the system shall record the modification timestamp and actor
Source: [Code | Description]
Dependencies: [REQ-FN-READ]
Status: Draft
```

### Delete

```
[REQ-FN-XXX] Delete [Entity]
Description: The system shall allow [user role] to delete an [entity] when [conditions].
Priority: Medium
Acceptance Criteria:
  Given [user] is authenticated with [delete] permission
  When [user] requests deletion of [entity] [id]
  Then the system shall perform [soft|hard] delete
  And the system shall [cascade|prevent] deletion if [entity] has [dependencies]
  And the system shall require confirmation for [destructive] operations
Source: [Code | Description]
Dependencies: [REQ-FN-READ]
Status: Draft
```

---

## Authentication / Authorization

### Login

```
[REQ-FN-XXX] User Login
Description: The system shall authenticate users via [method: password | SSO | MFA].
Priority: Critical
Acceptance Criteria:
  Given a user with valid credentials
  When the user submits login credentials
  Then the system shall validate credentials against [identity provider]
  And the system shall create a session with [token type] valid for [duration]
  And the system shall return an error for invalid credentials without revealing which field failed
  And the system shall enforce [lockout policy] after [N] failed attempts
Source: [Code | Description]
Dependencies: []
Status: Draft
```

### Logout

```
[REQ-FN-XXX] User Logout
Description: The system shall allow authenticated users to terminate their session.
Priority: High
Acceptance Criteria:
  Given an authenticated user
  When the user initiates logout
  Then the system shall invalidate the session/token
  And the system shall redirect the user to [login | home] page
  And the system shall clear client-side session data
Source: [Code | Description]
Dependencies: [REQ-FN-LOGIN]
Status: Draft
```

### Role-Based Access

```
[REQ-FN-XXX] Role-Based Access Control
Description: The system shall enforce access to [resources] based on user roles [list roles].
Priority: Critical
Acceptance Criteria:
  Given a user with role [R]
  When the user attempts to [action] on [resource]
  Then the system shall allow the action if role [R] has permission
  And the system shall return 403 Forbidden if permission is denied
  And the system shall not expose [resource] existence when access is denied [if applicable]
Source: [Code | Description]
Dependencies: [REQ-FN-LOGIN]
Status: Draft
```

---

## Search / Filter

```
[REQ-FN-XXX] Search [Entities]
Description: The system shall allow users to search [entities] by [searchable fields].
Priority: High
Acceptance Criteria:
  Given [user] is authenticated
  When [user] enters search criteria [fields] and submits
  Then the system shall return [entities] matching [matching logic: exact | partial | fuzzy]
  And the system shall support [AND | OR] combination of criteria
  And the system shall return results within [time] for [volume]
  And the system shall support [pagination | infinite scroll]
Source: [Code | Description]
Dependencies: [REQ-FN-READ-LIST]
Status: Draft
```

```
[REQ-FN-XXX] Filter [Entities] List
Description: The system shall allow users to filter [entities] by [filterable attributes].
Priority: Medium
Acceptance Criteria:
  Given a list of [entities]
  When [user] applies filters [filter1, filter2, ...]
  Then the system shall return only [entities] matching all active filters
  And the system shall support [single | multi] select per filter
  And the system shall persist filter state in [URL | session] for shareability
Source: [Code | Description]
Dependencies: [REQ-FN-READ-LIST]
Status: Draft
```

---

## Notifications

```
[REQ-FN-XXX] In-App Notifications
Description: The system shall display notifications to users for [events].
Priority: Medium
Acceptance Criteria:
  Given [user] is authenticated and [event] occurs
  When the event is relevant to the user
  Then the system shall create a notification visible in [notification center | bell icon]
  And the system shall mark notifications as read when [user views | user dismisses]
  And the system shall support [real-time | polled] delivery
Source: [Code | Description]
Dependencies: [REQ-FN-LOGIN]
Status: Draft
```

```
[REQ-FN-XXX] Email Notifications
Description: The system shall send email notifications for [events] to [recipients].
Priority: Medium
Acceptance Criteria:
  Given [event] occurs
  When the event triggers an email (e.g., [welcome, password reset, order confirmation])
  Then the system shall send an email to [recipient] within [time]
  And the system shall include [required content]
  And the system shall respect user notification preferences
  And the system shall use [template] with [personalization]
Source: [Code | Description]
Dependencies: []
Status: Draft
```

---

## File Upload

```
[REQ-FN-XXX] File Upload
Description: The system shall allow [user role] to upload files for [purpose].
Priority: High
Acceptance Criteria:
  Given [user] is authenticated
  When [user] selects a file for upload
  Then the system shall accept files of type [MIME types] up to [size] MB
  And the system shall validate [virus scan | content check] before persisting
  And the system shall store the file in [storage] and record metadata
  And the system shall return [progress | success | error] feedback
  And the system shall reject files exceeding size or type limits with a clear message
Source: [Code | Description]
Dependencies: [REQ-FN-AUTH]
Status: Draft
```

---

## Pagination

```
[REQ-FN-XXX] Paginated List
Description: The system shall paginate [entity] lists with configurable page size.
Priority: Medium
Acceptance Criteria:
  Given a list of [entities] with [N] total items
  When [user] requests page [P] with size [S]
  Then the system shall return items [(P-1)*S] through [P*S - 1]
  And the system shall include metadata: total count, page number, page size, hasNext, hasPrev
  And the system shall support page sizes [10, 25, 50, 100]
  And the system shall default to page size [25]
Source: [Code | Description]
Dependencies: [REQ-FN-READ-LIST]
Status: Draft
```

---

## Error Handling

```
[REQ-FN-XXX] User-Facing Error Messages
Description: The system shall display clear, actionable error messages for [error types].
Priority: High
Acceptance Criteria:
  Given an error occurs during [operation]
  When the error is user-facing
  Then the system shall display a message that [describes the problem | suggests next steps]
  And the system shall avoid exposing [internal details | stack traces]
  And the system shall use [localization] for error text
  And the system shall log full error details server-side for debugging
Source: [Code | Description]
Dependencies: []
Status: Draft
```

```
[REQ-FN-XXX] Validation Error Feedback
Description: The system shall provide field-level validation feedback for form submissions.
Priority: High
Acceptance Criteria:
  Given [user] submits a form with invalid data
  When validation fails for [field(s)]
  Then the system shall highlight invalid fields and display error messages
  And the system shall prevent submission until all errors are resolved
  And the system shall support [client-side | server-side | both] validation
  And the system shall show errors [inline | summary | both]
Source: [Code | Description]
Dependencies: []
Status: Draft
```
