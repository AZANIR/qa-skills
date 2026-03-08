# Visual Analysis Guide for UI Screenshots

Guide for analyzing UI screenshots to identify elements, infer semantics, and derive test scenarios. Use when processing images for qa-testcase-from-ui.

---

## Element Identification Techniques

### 1. Shape and Layout Heuristics

| Visual Pattern | Likely Element | Confidence |
|----------------|----------------|------------|
| Rounded rectangle with placeholder text | Text input | High |
| Small square with checkmark | Checkbox | High |
| Circle with dot | Radio button | High |
| Rectangle with dropdown arrow | Select/dropdown | High |
| Rounded rectangle, filled, with label | Button | High |
| Grid of rows and columns | Table | High |
| Overlay with centered content | Modal/dialog | High |
| Horizontal row of links with separators | Navigation bar | Medium |
| Vertical list with indentation | Tree or nested menu | Medium |

### 2. Label and Context Clues

- **"Email", "Password", "Username"** → Form fields with implied validation
- **"Submit", "Save", "Cancel"** → Button actions
- **"Sign In", "Log in"** → Auth flow entry
- **"Search"** → Search input or button
- **"Add", "+", "New"** → Create action
- **"Edit", "Delete", trash icon** → CRUD actions
- **"Settings", gear icon** → Configuration/settings
- **"Help", "?"** → Help or documentation

### 3. Position Conventions

- **Top of viewport:** Logo, primary nav, search
- **Center:** Main content, forms, modals
- **Bottom:** Submit buttons, footer links
- **Right edge:** Sidebar, secondary actions
- **Floating:** Notifications, tooltips

---

## Semantic Mapping Rules

### From Visual to Action

1. **Input-like shapes** → User can type or select
2. **Button-like shapes** → User can click to trigger action
3. **Links (underlined or distinct color)** → Navigation
4. **Overlays** → Modal flow (open → interact → close)
5. **Tables** → Data display + possible sort/filter/pagination
6. **Tabs** → Switch between views/panels

### Inferring Validation

- **Required indicator** (asterisk, "Required") → Empty submit should show error
- **Format hints** (e.g., "DD/MM/YYYY") → Invalid format should be rejected
- **Character counter** → Max length validation
- **Password strength meter** → Password rules apply

### Inferring State

- **Disabled** (grayed out, reduced opacity) → Not clickable
- **Loading** (spinner, skeleton) → Async operation in progress
- **Error** (red border, error icon) → Validation failed
- **Success** (green check, success message) → Operation completed

---

## Common UI Patterns

### Login / Auth Screens

- Email + Password inputs
- "Sign In" / "Log in" button
- "Forgot password?" link
- "Create account" / "Register" link
- Social login buttons (Google, etc.)

**Test focus:** Valid/invalid credentials, empty fields, forgot password flow.

### Dashboard / List Views

- Table or card grid
- Search/filter bar
- "Add" or "Create" button
- Row/card actions (edit, delete)
- Pagination or infinite scroll

**Test focus:** CRUD, search, filter, sort, pagination.

### Form Pages (Create/Edit)

- Multiple form fields
- Required indicators
- Submit and Cancel buttons
- Possible "Save draft" or "Reset"

**Test focus:** Validation, submission, cancel, reset.

### Settings / Configuration

- Tabs or sidebar sections
- Toggles, checkboxes, inputs
- "Save" or "Apply" button
- Possible "Reset to default"

**Test focus:** Toggle states, save, reset, section navigation.

---

## Edge Cases to Consider

| Scenario | When to Include |
|----------|-----------------|
| Empty input submit | Form with required fields |
| Invalid format | Email, date, phone inputs |
| Max length exceeded | Inputs with character limits |
| Modal ESC/backdrop | Any modal/dialog |
| No results | Search, filter, or list views |
| Loading state | Any async action (submit, fetch) |
| Disabled state | Buttons that depend on form validity |
| Responsive collapse | Nav, sidebar, tables on small screens |

---

## Coordinate and Reference Conventions

When describing element location for test cases:

1. **Prefer semantic description** over coordinates: "Email input, top of form" vs "x:120, y:200"
2. **Use relative terms:** "Center of modal", "First row of table", "Primary CTA button"
3. **Include labels:** "Button labeled 'Submit'", "Input with placeholder 'Search'"
4. **Note ambiguity:** "Possible dropdown (chevron visible)" when uncertain

---

## Limitations

- **Static images** do not reveal dynamic behavior (e.g., API errors, real-time validation)
- **Design vs implementation** — Figma/mockups may differ from built UI
- **Overlapping elements** — Hard to distinguish without interaction
- **Custom components** — May not match standard patterns; use conservative labels

When in doubt, flag elements for manual verification and suggest live capture for implementation-level tests.
