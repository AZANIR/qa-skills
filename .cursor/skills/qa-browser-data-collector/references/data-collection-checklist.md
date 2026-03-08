# Data Collection Checklist

Use this checklist when collecting data from each page during browser exploration. Tick items as they are captured.

## Page Metadata

- [ ] **URL** — Full URL of the page
- [ ] **Title** — Document title (`<title>`)
- [ ] **Timestamp** — When the page was captured

## Page Structure

- [ ] **Headings** — h1, h2, h3, h4, h5, h6 (text and hierarchy)
- [ ] **Landmarks** — main, nav, aside, header, footer, section
- [ ] **ARIA roles** — role attributes on key containers
- [ ] **DOM depth** — Notable nesting for key interactive areas

## Forms

- [ ] **Form ID/name** — Form identifier
- [ ] **Action URL** — Form action (if present)
- [ ] **Method** — GET or POST
- [ ] **Fields:**
  - [ ] Name/label
  - [ ] Input type (text, email, password, number, checkbox, radio, select, textarea)
  - [ ] Required vs optional
  - [ ] Placeholder text
  - [ ] Validation attributes (min, max, pattern, maxlength)
  - [ ] Autocomplete hints
- [ ] **Submit button** — Text and selector
- [ ] **Validation messages** — Trigger validation and capture error text

## Links

- [ ] **Internal links** — href, link text, destination
- [ ] **External links** — href, link text (for documentation)
- [ ] **Navigation menu items** — Structure and labels
- [ ] **Breadcrumbs** — If present, full path

## Buttons

- [ ] **Primary actions** — Text, type (button/submit), associated form
- [ ] **Secondary actions** — Cancel, back, etc.
- [ ] **Icon buttons** — aria-label or title for accessibility

## Images

- [ ] **Decorative images** — Count and context
- [ ] **Content images** — alt text, src (for traceability)
- [ ] **Lazy-loaded images** — Note loading behavior

## Tables

- [ ] **Table structure** — Headers, rows, columns
- [ ] **Sortable columns** — If applicable
- [ ] **Row actions** — Edit, delete, view links
- [ ] **Pagination** — Controls and behavior

## Modals & Dialogs

- [ ] **Modal triggers** — Buttons/links that open modals
- [ ] **Modal content** — Title, body, form fields
- [ ] **Close behavior** — Close button, overlay click, Escape
- [ ] **Confirm/Cancel** — Button labels and actions

## Network Requests

- [ ] **XHR/Fetch** — Endpoint, method, status code
- [ ] **Request payload** — Structure (not sensitive values)
- [ ] **Response structure** — Key fields for assertions
- [ ] **WebSocket** — If applicable, connection URL and message types

## Console & Errors

- [ ] **Console errors** — JavaScript errors on load
- [ ] **Console warnings** — Notable warnings
- [ ] **404 or error pages** — Structure of error fallbacks

## State & Transitions

- [ ] **Authentication state** — Logged in vs logged out indicators
- [ ] **Conditional visibility** — Elements that appear based on state
- [ ] **Tab/accordion state** — Default open/closed
- [ ] **Loading states** — Spinners, skeletons, disabled buttons

## Screenshots

- [ ] **Full page** — For key pages
- [ ] **Above-the-fold** — Initial viewport
- [ ] **Modals** — When open (if applicable)
- [ ] **Error states** — Validation or error page captures
