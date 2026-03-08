---
name: qa-browser-data-collector
description: Autonomously explore live web applications using Playwright MCP to collect page structure, form fields, validation rules, API endpoints, and user flows for test case generation.
---

# QA Browser Data Collector

## Purpose

Use Playwright MCP to autonomously explore live web applications and collect structured data for test generation. The skill navigates URLs, captures accessibility snapshots, inspects forms, records network traffic, and maps navigation paths—producing a "UI spec" that feeds into test case generators (e.g., qa-testcase-from-docs, qa-playwright-ts-writer).

## Trigger Phrases

- "Collect data from [URL]" / "Explore [app URL] and gather UI spec"
- "Capture form fields and validation from [URL]"
- "Map navigation and API calls for [application]"
- "Generate UI spec from live app at [URL]"
- "Browser data collection for test generation"
- "Explore [URL] and extract page structure, forms, and endpoints"

## Data Collection Workflow

1. **Navigate URLs** — Open target URLs via Playwright MCP; support multiple entry points (home, login, key flows).
2. **Capture accessibility snapshots** — Use snapshot tools to extract DOM structure, headings, landmarks, interactive elements.
3. **Collect form fields & validation rules** — Identify inputs, selects, textareas; infer types, required/optional, placeholders, validation patterns.
4. **Record error messages** — Trigger validation (e.g., submit empty), capture error text, fallback pages, toast/alert messages.
5. **Capture API endpoints from network** — Intercept or record XHR/fetch requests: endpoints, methods, status codes, payloads.
6. **Map navigation paths** — Extract links, menus, breadcrumbs, routing patterns; document user flow sequences.
7. **Screenshot pages** — Capture key screens for visual reference and test traceability.
8. **Extract state transitions** — Document login/logout, modal open/close, tab switches, conditional visibility.

## Collected Data Types

| Category | Examples |
|----------|----------|
| **Page structure** | DOM tree, headings (h1–h6), landmarks (main, nav, aside), ARIA roles |
| **Forms** | Fields (name, type, placeholder, required/optional), validation rules, submit targets |
| **Navigation** | Links (href, text), menus, breadcrumbs, routing patterns |
| **API calls** | Endpoints, HTTP methods, status codes, request/response payloads |
| **Error handling** | Validation messages, error pages, fallbacks, console errors |
| **Authentication flows** | Login form, session indicators, token storage, logout paths |

## Output Format

Structured "UI spec" suitable for test case generators:

```json
{
  "url": "https://example.com/login",
  "collectedAt": "ISO8601",
  "pages": [
    {
      "path": "/login",
      "title": "Sign In",
      "headings": ["Sign In", "Forgot password?"],
      "forms": [
        {
          "id": "login-form",
          "fields": [
            { "name": "email", "type": "email", "required": true },
            { "name": "password", "type": "password", "required": true }
          ],
          "submitButton": "Sign In",
          "validationMessages": ["Email is required", "Invalid email format"]
        }
      ],
      "links": [...],
      "apiCalls": [...]
    }
  ],
  "navigationPaths": [...],
  "authFlow": { "login": "/login", "logout": "/logout" }
}
```

Markdown output is also supported for human-readable specs. See `references/data-collection-checklist.md` for a full checklist.

## Scope

**Can do (autonomous):**
- Navigate to provided URLs and follow links within scope
- Capture accessibility snapshots and extract structure
- Inspect forms (fields, types, validation) without submitting real data
- Record network requests (endpoints, methods, status codes)
- Map navigation paths and document user flows
- Take screenshots for reference
- Produce structured JSON/markdown UI spec
- Reference `references/data-collection-checklist.md` and `references/playwright-mcp-patterns.md`

**Cannot do (requires confirmation):**
- Navigate to URLs not explicitly provided
- Submit forms with real user data (use placeholders/test data only)
- Access authenticated areas without credentials provided by user
- Modify app state beyond read-only exploration

**Will not do (out of scope):**
- **Modify any data in the application** — No form submissions with real data, no create/update/delete actions
- Execute tests or assertions
- Generate test code (hand off to qa-playwright-ts-writer or similar)
- Bypass security or access restricted areas without permission

## Quality Checklist

Before delivering a UI spec:

- [ ] All target URLs explored per user scope
- [ ] Page structure captured (headings, landmarks, key elements)
- [ ] Forms documented with field types, required/optional, validation
- [ ] API endpoints recorded with method, path, and status
- [ ] Navigation paths mapped (links, menus, flows)
- [ ] Error/validation messages captured where applicable
- [ ] Screenshots taken for key pages
- [ ] Output format valid (JSON or markdown)
- [ ] No real user data submitted or stored
- [ ] Scope boundaries respected (no unintended modifications)

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Snapshot empty or incomplete | Page not fully loaded, SPA hydration | Use wait patterns; retry snapshot after load |
| Forms not detected | Dynamic forms, iframes | Check for iframes; wait for form visibility |
| API calls not captured | Network interception not active | Ensure network recording started before navigation |
| Login required | Protected area | Ask user for test credentials or skip authenticated routes |
| Rate limiting / blocking | Bot detection | Reduce request frequency; use realistic delays |
| CORS or mixed content | Cross-origin restrictions | Document observed behavior; note limitations |
| Element refs stale | DOM changed between snapshot and action | Re-snapshot before interaction |

## References

- `references/data-collection-checklist.md` — Checklist of data points to collect per page
- `references/playwright-mcp-patterns.md` — Common Playwright MCP patterns for data collection
