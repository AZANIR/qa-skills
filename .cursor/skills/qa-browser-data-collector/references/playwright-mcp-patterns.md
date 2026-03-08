# Playwright MCP Patterns for Data Collection

Common patterns for using Playwright MCP to collect browser data. Adapt tool names to the specific Playwright MCP server in use (e.g., `@playwright/mcp`, cursor-ide-browser).

## Navigation

| Goal | Pattern |
|------|---------|
| Open URL | `browser_navigate` or `playwright_navigate` with target URL |
| New tab | Use `newTab: true` or equivalent when opening a new context |
| Back/forward | `browser_navigate_back`, `browser_navigate_forward` |
| Reload | `browser_reload` after state changes |

**Best practice:** Lock the browser before a sequence of actions; unlock when done to avoid user interference.

## Snapshots

| Goal | Pattern |
|------|---------|
| Page structure | `browser_snapshot` — returns accessibility tree (headings, landmarks, interactive elements) |
| Interactive only | Use `interactive: true` to filter to clickable/focusable elements |
| Scoped snapshot | Use `selector` to snapshot a subtree (e.g., a form or modal) |
| Compact output | Use `compact: true` for smaller payloads |

**Best practice:** Take a snapshot after each navigation and after modals open. Use snapshots as the primary source for form fields, links, and buttons.

## Waiting

| Goal | Pattern |
|------|---------|
| Fixed delay | `browser_wait_for` with `time` (seconds) |
| Text appears | `browser_wait_for` with `text` and optional `timeout` |
| Text disappears | `browser_wait_for` with `textGone` |

**Best practice:** Prefer short incremental waits (1–3 seconds) with snapshot checks rather than one long wait. Proceed as soon as content is ready.

## Form Inspection

| Goal | Pattern |
|------|---------|
| Read input value | `browser_get_input_value` with element ref from snapshot |
| Check checkbox/radio | `browser_is_checked` |
| List options | Use snapshot with `selector` on `<select>` to see options |
| Trigger validation | `browser_click` submit with empty/invalid data; capture error text from snapshot |

**Best practice:** Do not submit forms with real data. Use placeholders or leave empty to trigger validation only.

## Network Interception

| Goal | Pattern |
|------|---------|
| List requests | `browser_network_requests` — returns requests since page load |
| Filter by type | Inspect returned list for XHR, fetch, document |
| Capture timing | Note request/response timing if available |

**Best practice:** Start network capture (or ensure it's active) before navigating. Re-navigate if needed to get a clean request list.

## Screenshots

| Goal | Pattern |
|------|---------|
| Viewport | `browser_take_screenshot` |
| Full page | Use `fullPage: true` if supported |
| Element | Use `ref` or `selector` for element-specific screenshots |

**Best practice:** Take screenshots after key state changes (e.g., after login, after modal open).

## Element Interaction (Read-Only)

| Goal | Pattern |
|------|---------|
| Click (e.g., open modal) | `browser_click` with ref from snapshot |
| Hover | `browser_hover` to reveal tooltips or dropdowns |
| Scroll into view | `browser_scroll` with `scrollIntoView: true` before interacting |
| Read attribute | `browser_get_attribute` for href, aria-*, data-* |

**Best practice:** Use interactions only to reveal data (open modals, expand sections). Do not submit forms or change persistent data.

## Lock/Unlock Workflow

1. Navigate to the page (or use existing tab).
2. Call `browser_lock` before a sequence of automated actions.
3. Perform snapshot, network capture, form inspection, screenshots.
4. Call `browser_unlock` when done.

## Typical Collection Sequence

```
1. browser_navigate(url)
2. browser_wait_for(time: 2)
3. browser_snapshot()
4. browser_network_requests()
5. [For each form] Inspect snapshot for fields; optionally trigger validation
6. [For modals] browser_click(trigger) → wait → snapshot
7. browser_take_screenshot()
8. browser_unlock()
```

## Tool Name Mapping

If using a different Playwright MCP implementation, map concepts:

| Concept | cursor-ide-browser | @playwright/mcp (typical) |
|---------|--------------------|---------------------------|
| Navigate | browser_navigate | playwright_navigate / goto |
| Snapshot | browser_snapshot | accessibility_snapshot / getTree |
| Wait | browser_wait_for | wait_for_selector / wait |
| Network | browser_network_requests | network_requests / har |
| Screenshot | browser_take_screenshot | screenshot |
| Click | browser_click | click |
| Lock | browser_lock | (session-scoped) |

Refer to your MCP server's documentation for exact tool names and parameters.
