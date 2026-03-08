# UI Element Patterns and Test Scenarios

Common UI element patterns and their associated test scenarios. Use this reference when generating test cases from visual UI analysis.

---

## Forms

| Element | Visual Cues | Test Scenarios |
|---------|-------------|----------------|
| **Text input** | Rectangular field, placeholder/label | Valid input, empty submit, max length, special chars, paste |
| **Password input** | Masked dots, "show/hide" toggle | Valid password, empty, strength indicator, show/hide toggle |
| **Email input** | Label "Email", @ in placeholder | Valid format, invalid format, duplicate, empty |
| **Textarea** | Multi-line box | Valid text, resize, max chars, line breaks |
| **Checkbox** | Square, checked/unchecked | Toggle on/off, required unchecked, multiple selection |
| **Radio group** | Circles, one selected | Select option, required unselected, change selection |
| **Select/Dropdown** | Arrow, single visible value | Open, select option, keyboard nav, empty option |
| **Multi-select** | Chips/tags, "x" to remove | Add, remove, select all, clear all |
| **Date picker** | Calendar icon, date format | Select date, invalid date, past/future constraints |
| **File upload** | "Choose file" / drag zone | Valid file, invalid type, size limit, multiple files |
| **Submit button** | Primary CTA, often bottom-right | Click submit, disabled when invalid, loading state |

**Form-level scenarios:** Required field validation, inline vs on-submit validation, reset/clear, tab order, error message display.

---

## Buttons

| Type | Visual Cues | Test Scenarios |
|------|-------------|----------------|
| **Primary** | Filled, prominent color | Click action, disabled state, loading spinner |
| **Secondary** | Outline or muted | Click action, consistency with primary |
| **Destructive** | Red/danger color | Confirmation flow, cancel option |
| **Icon button** | Icon only, optional tooltip | Click, keyboard, tooltip on hover |
| **Link-styled** | Underlined text, cursor pointer | Navigate, open in new tab, disabled |

---

## Dropdowns

| Pattern | Visual Cues | Test Scenarios |
|---------|-------------|----------------|
| **Single select** | One value shown, chevron | Open, select, close on outside click, keyboard |
| **Multi-select** | Chips/tags | Add, remove, select all, search/filter |
| **Cascading** | Parent selection enables child | Parent change clears child, dependent options |
| **Searchable** | Input inside dropdown | Type to filter, no results state |
| **Grouped options** | Section headers | Navigate groups, select from group |

---

## Modals / Dialogs

| Pattern | Visual Cues | Test Scenarios |
|---------|-------------|----------------|
| **Confirmation** | Title, message, OK/Cancel | Confirm, cancel, ESC key, backdrop click |
| **Form modal** | Form inside overlay | Submit, cancel, validation, focus trap |
| **Alert** | Icon, message, single button | Dismiss, auto-close (if applicable) |
| **Full-screen modal** | Overlay covers viewport | Close button, ESC, scroll behavior |

**Common scenarios:** Focus trapped inside, focus returns on close, scroll lock on body, aria attributes.

---

## Tables

| Element | Visual Cues | Test Scenarios |
|---------|-------------|----------------|
| **Sortable columns** | Header arrows/icons | Sort asc/desc, multi-column sort |
| **Row actions** | Icons/buttons per row | Edit, delete, expand, bulk select |
| **Pagination** | Page numbers, prev/next | Navigate pages, change page size |
| **Filter** | Input above table | Filter by column, clear filter |
| **Empty state** | "No data" message | Display when no rows |
| **Loading** | Skeleton or spinner | Display during fetch |

---

## Navigation Bars

| Pattern | Visual Cues | Test Scenarios |
|---------|-------------|----------------|
| **Top nav** | Horizontal links, logo | Click each link, active state, responsive collapse |
| **Sidebar** | Vertical menu | Expand/collapse, nested items, active state |
| **Breadcrumbs** | Path: Home > Section > Page | Click each level, truncation |
| **Mega menu** | Hover reveals panel | Hover, click sub-items, keyboard nav |

---

## Tabs

| Pattern | Visual Cues | Test Scenarios |
|---------|-------------|----------------|
| **Horizontal tabs** | Underline or pill for active | Switch tabs, keyboard (arrow keys) |
| **Vertical tabs** | Side panel | Same as horizontal |
| **Scrollable tabs** | Overflow with arrows | Scroll, select from overflow |
| **Add/close tabs** | "+" or "x" on tab | Add tab, close tab, close last tab |

---

## Tooltips

| Pattern | Visual Cues | Test Scenarios |
|---------|-------------|----------------|
| **Hover tooltip** | Small popover on hover | Appear on hover, disappear on leave |
| **Focus tooltip** | Appears on focus | Keyboard focus, dismiss |
| **Rich tooltip** | Multi-line, links | Content display, link click |

---

## Notifications

| Pattern | Visual Cues | Test Scenarios |
|---------|-------------|----------------|
| **Toast** | Corner popup, auto-dismiss | Appear, auto-close, manual dismiss |
| **Inline alert** | Banner above/below content | Dismiss, persist until action |
| **Badge** | Count on icon (e.g., cart) | Display count, click navigates |
| **Status indicator** | Dot or icon (success/error) | Correct color for state |

---

## Cross-Cutting Scenarios

- **Responsive:** Element visibility at breakpoints, touch target size, overflow
- **Loading:** Skeleton, spinner, disabled state during async
- **Error:** Validation message placement, retry option
- **Empty:** Empty state message, CTA when no data
- **Accessibility:** Focus order, aria-labels, keyboard navigation
