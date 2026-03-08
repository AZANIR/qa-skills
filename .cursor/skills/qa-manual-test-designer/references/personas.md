# Persona-Based Testing

Detailed persona descriptions for manual and exploratory testing. Use these to derive test scenarios that reflect different user behaviors, goals, and failure modes.

---

## Novice User

**Profile:** First-time user, unfamiliar with the system. Easily confused, may ignore hints, gets lost in flows.

### Behaviors
- Clicks randomly or follows visual cues only
- Skips onboarding or help text
- Enters invalid data without reading validation messages
- Uses back button or closes tab when stuck
- May abandon flows mid-way
- Relies on default values, rarely changes settings

### Goals
- Complete a simple task with minimal learning
- Understand what the system does without reading documentation
- Get help when something goes wrong

### Test Scenarios
- First-time flow without prior knowledge
- Empty state / no data: what does the user see?
- Invalid input: are error messages clear and actionable?
- Dead ends: can the user recover or find a way back?
- Onboarding: does it explain enough? Can it be skipped?
- Default values: do they lead to success or confusion?

---

## Power User

**Profile:** Experienced user who values efficiency. Uses keyboard shortcuts, bulk actions, advanced features.

### Behaviors
- Prefers keyboard over mouse (Tab, Enter, shortcuts)
- Uses bulk operations, import/export, batch actions
- Pushes limits: max items, max length, edge cases
- Combines features in unexpected ways
- Expects consistency across similar flows
- May use API or CLI if available

### Goals
- Complete tasks quickly
- Automate or batch repetitive work
- Use advanced features without friction

### Test Scenarios
- Keyboard-only navigation through main flows
- Bulk operations: select all, bulk delete, bulk edit
- Boundary values: max length, max items, max file size
- Shortcuts: do they work? Are they documented?
- Import/export: large files, malformed data, encoding
- Feature combinations: use A then B in same session
- Performance: does it feel fast for power workflows?

---

## Attacker

**Profile:** Malicious actor trying to bypass security, inject code, or escalate privileges.

### Behaviors
- Injects SQL, XSS, command injection in input fields
- Manipulates URLs, headers, cookies
- Tries auth bypass: session hijack, token reuse, privilege escalation
- Tests file upload: executable files, path traversal
- Probes for information disclosure (stack traces, debug info)
- Uses automation (scripts, tools) to probe at scale

### Goals
- Bypass authentication or authorization
- Extract or corrupt data
- Disrupt service or degrade quality

### Test Scenarios
- SQL injection in search, login, form fields
- XSS in user-generated content, error messages
- Auth bypass: expired token, modified JWT, session fixation
- Privilege escalation: access admin functions as regular user
- File upload: .exe, .php, path traversal (../../../etc/passwd)
- IDOR: change resource IDs in URLs to access others' data
- Rate limiting: can brute-force or DoS be triggered?
- Information disclosure: stack traces, internal URLs in responses

---

## Admin

**Profile:** System administrator configuring roles, permissions, and system behavior.

### Behaviors
- Manages users, roles, permissions
- Configures system settings, integrations, webhooks
- Reviews audit logs and activity
- Handles bulk user operations
- Expects clear separation of admin vs. user capabilities
- May use API or admin-only UI

### Goals
- Configure the system correctly and securely
- Audit who did what and when
- Manage access without breaking user experience

### Test Scenarios
- Role creation and assignment: do permissions apply correctly?
- Permission boundaries: can admin do X? Can user do X when denied?
- Audit logs: are actions logged? Can logs be tampered?
- Configuration changes: do they take effect? Rollback?
- Bulk operations: deactivate users, change roles
- Admin vs. user UI: no privilege leakage to non-admin views
- Integration setup: webhooks, API keys, OAuth — secure storage and usage

---

## Mobile User

**Profile:** User on phone or tablet. Touch interaction, small screen, variable network.

### Behaviors
- Uses touch: tap, swipe, pinch, long-press
- Holds device in portrait and landscape
- May have slow or intermittent network
- Uses thumb for primary interactions (reachability)
- May switch apps and return (session restore)
- Expects responsive layout, no horizontal scroll
- May use mobile-specific features (camera, location)

### Goals
- Complete tasks on mobile without desktop
- Have a usable experience on small screens
- Work offline or with poor connectivity when possible

### Test Scenarios
- Touch targets: are buttons/links large enough (min 44×44 px)?
- Thumb reach: can primary actions be reached one-handed?
- Orientation: portrait and landscape both usable?
- Responsive layout: no horizontal scroll, readable text
- Slow network: loading states, timeouts, retry
- Session restore: return after backgrounding — state preserved?
- Forms: mobile-friendly inputs (tel, email, date pickers)
- File upload: camera, gallery — supported and secure?
- Gestures: swipe, pull-to-refresh — consistent and discoverable?
