# Accessibility Testing Best Practices

Best practices for automated and manual accessibility testing. Use with qa-accessibility-test-writer when generating tests and planning audits.

---

## Automated vs Manual Testing

### What Automation Covers

| Category | Automated | Manual |
|----------|-----------|--------|
| Color contrast | ✓ | ✓ (verify in context) |
| Alt text presence | ✓ | ✓ (verify accuracy) |
| ARIA validity | ✓ | ✓ (verify semantics) |
| Keyboard operability | Partial | ✓ |
| Focus order | Partial | ✓ |
| Screen reader experience | ✗ | ✓ |
| Cognitive load | ✗ | ✓ |
| Motion sensitivity | ✗ | ✓ |

### Recommended Mix

1. **Automated first** — axe-core, Pa11y, Lighthouse on every build
2. **Manual keyboard** — Tab through critical flows (login, checkout, forms)
3. **Manual screen reader** — NVDA/JAWS (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
4. **Manual spot checks** — Color contrast in context, zoom to 200%, reduced motion

---

## Screen Reader Testing

### Tools

| Platform | Screen Reader | Notes |
|----------|---------------|-------|
| Windows | NVDA (free) | Most common for testing |
| Windows | JAWS | Commercial; often required for compliance |
| macOS | VoiceOver | Built-in; Cmd+F5 |
| iOS | VoiceOver | Built-in; triple-click Home/Side |
| Android | TalkBack | Built-in |

### Key Scenarios

1. **Landmarks** — Can user jump between main, nav, footer?
2. **Headings** — Can user navigate by heading level?
3. **Forms** — Are labels announced? Are errors announced?
4. **Dynamic content** — Are live regions (`aria-live`) announced?
5. **Custom widgets** — Do dialogs, tabs, accordions have correct roles and states?

### Testing Workflow

```
1. Unplug mouse; use keyboard only
2. Turn on screen reader
3. Navigate page from top (headings, landmarks, links)
4. Complete critical user flow (e.g., add to cart, checkout)
5. Note: missing labels, wrong order, unannounced updates
```

---

## Keyboard Testing

### Essential Keys

| Key | Purpose |
|-----|---------|
| Tab | Move forward through focusable elements |
| Shift+Tab | Move backward |
| Enter | Activate links, buttons |
| Space | Toggle checkboxes, activate buttons |
| Arrow keys | Navigate within components (tabs, menus, sliders) |
| Escape | Close modals, cancel |

### Checklist

- [ ] All interactive elements reachable via Tab
- [ ] No keyboard traps (can always Tab out)
- [ ] Focus order matches visual order
- [ ] Focus indicator visible (outline or equivalent)
- [ ] Skip link works and targets main content
- [ ] Modals trap focus and return focus on close
- [ ] Dropdowns/menus operable with Arrow keys

### Common Failures

| Issue | Fix |
|-------|-----|
| Custom div not focusable | Add `tabindex="0"` and keyboard handlers |
| Focus lost after modal close | Store focused element; restore on close |
| No visible focus | Add `:focus-visible` styles |
| Wrong tab order | Use `tabindex` sparingly; fix DOM order |

---

## Color Contrast

### Requirements (WCAG 2.2)

| Level | Normal Text | Large Text |
|-------|-------------|------------|
| AA | 4.5:1 | 3:1 |
| AAA | 7:1 | 4.5:1 |

Large text = 18pt+ or 14pt+ bold.

### Tools

- **axe-core** — Automated contrast checks
- **WebAIM Contrast Checker** — Manual verification
- **Chrome DevTools** — Inspect element → Accessibility panel

### Edge Cases

- **Logos** — Exempt; no contrast requirement
- **Disabled elements** — No contrast requirement
- **Placeholder text** — Should meet 4.5:1 or have visible label
- **Focus indicators** — 3:1 against adjacent colors

---

## Form Accessibility

### Labels

- Every input has a visible `<label>` or `aria-label`
- Labels describe purpose; placeholders are supplementary
- Error messages linked via `aria-describedby` or `aria-errormessage`

### Error Handling

- Errors identified in text (not color alone)
- `aria-invalid="true"` on invalid fields
- `role="alert"` or `aria-live="assertive"` for error announcements
- Suggestions provided (3.3.3 Error Suggestion)

### Autocomplete

- Use `autocomplete` attribute for common fields (name, email, address)

---

## Testing in CI/CD

### Playwright Example

```yaml
# .github/workflows/a11y.yml
- name: Run accessibility tests
  run: npx playwright test tests/accessibility/
```

### Thresholds

- **Zero violations** for WCAG 2.2 A/AA in critical paths
- **Lighthouse accessibility score** ≥ 90 for key pages
- **Allow known exceptions** via axe `disableRules` with documented rationale

### Reporting

- Store JSON/HTML reports as artifacts
- Fail build on new violations
- Track trends over time (e.g., Lighthouse CI)

---

## When to Escalate

| Situation | Action |
|-----------|--------|
| axe reports "needs review" | Manual verification; document decision |
| Design conflicts with WCAG | Discuss with design; propose alternatives |
| Third-party widget fails | Contact vendor; document as known limitation |
| AAA required | Plan manual testing; automation covers subset |

---

## References

- [WCAG 2.2 Understanding](https://www.w3.org/WAI/WCAG22/Understanding/)
- [WebAIM Screen Reader User Survey](https://webaim.org/projects/screenreadersurvey9/)
- [Inclusive Design Principles](https://inclusivedesignprinciples.org/)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
