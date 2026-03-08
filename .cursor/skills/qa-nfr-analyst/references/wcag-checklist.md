# WCAG 2.2 Success Criteria Checklist

Web Content Accessibility Guidelines 2.2 (W3C Recommendation, October 2023). Use this checklist for testable accessibility criteria.

---

## Level A (Minimum)

### Principle 1: Perceivable

| ID | Criterion | Testable Checkpoint |
|----|-----------|---------------------|
| 1.1.1 | Non-text Content | All images have alt text; decorative images use alt="" or aria-hidden |
| 1.2.1 | Audio-only and Video-only (Prerecorded) | Audio/video-only media has text transcript or audio description |
| 1.2.2 | Captions (Prerecorded) | Prerecorded video has synchronized captions |
| 1.2.3 | Audio Description or Media Alternative (Prerecorded) | Prerecorded video has audio description or text alternative |
| 1.3.1 | Info and Relationships | Structure conveyed via markup (headings, lists, tables, form labels) |
| 1.3.2 | Meaningful Sequence | Reading order is logical when content is linearized |
| 1.4.1 | Use of Color | Information not conveyed by color alone |
| 1.4.2 | Audio Control | No auto-playing audio, or user can pause/stop |
| 1.4.3 | Contrast (Minimum) | Text contrast ratio ≥ 4.5:1 (normal), 3:1 (large) |
| 1.4.4 | Resize Text | Text can be resized to 200% without loss of content/function |
| 1.4.5 | Images of Text | Prefer real text over images of text |
| 1.4.10 | Reflow | Content reflows at 320px width without horizontal scroll |
| 1.4.11 | Non-text Contrast | UI components and graphics have 3:1 contrast |
| 1.4.12 | Text Spacing | No loss of content when spacing overrides applied |
| 1.4.13 | Content on Hover or Focus | Dismissible, hoverable, persistent on pointer hover/focus |

### Principle 2: Operable

| ID | Criterion | Testable Checkpoint |
|----|-----------|---------------------|
| 2.1.1 | Keyboard | All functionality available via keyboard |
| 2.1.2 | No Keyboard Trap | Focus can be moved away from any component |
| 2.1.4 | Character Key Shortcuts | Single-character shortcuts can be turned off/remapped |
| 2.2.1 | Timing Adjustable | Time limits can be extended or turned off |
| 2.2.2 | Pause, Stop, Hide | Auto-updating content can be paused/stopped/hidden |
| 2.3.1 | Three Flashes or Below | No content flashes more than 3 times per second |
| 2.4.1 | Bypass Blocks | Skip link or landmark to bypass repeated content |
| 2.4.2 | Page Titled | Page has descriptive title |
| 2.4.3 | Focus Order | Tab order is logical and meaningful |
| 2.4.4 | Link Purpose (In Context) | Link purpose determinable from link text or context |
| 2.5.1 | Pointer Gestures | No path-based gestures required; alternatives exist |
| 2.5.2 | Pointer Cancellation | No activation on down-only; cancel on up |
| 2.5.3 | Label in Name | Accessible name includes visible label text |
| 2.5.4 | Motion Actuation | Functionality not triggered only by device motion |

### Principle 3: Understandable

| ID | Criterion | Testable Checkpoint |
|----|-----------|---------------------|
| 3.1.1 | Language of Page | Page has lang attribute |
| 3.2.1 | On Focus | Receiving focus does not change context |
| 3.2.2 | On Input | Changing a setting does not automatically change context |
| 3.3.1 | Error Identification | Input errors identified and described in text |
| 3.3.2 | Labels or Instructions | Labels/instructions provided for user input |

### Principle 4: Robust

| ID | Criterion | Testable Checkpoint |
|----|-----------|---------------------|
| 4.1.1 | Parsing | Markup validates; no duplicate IDs |
| 4.1.2 | Name, Role, Value | UI components have accessible name, role, value |
| 4.1.3 | Status Messages | Status messages identified via role or live region |

---

## Level AA (Common Target)

### Principle 1: Perceivable

| ID | Criterion | Testable Checkpoint |
|----|-----------|---------------------|
| 1.2.4 | Captions (Live) | Live audio has captions |
| 1.2.5 | Audio Description (Prerecorded) | Prerecorded video has audio description |
| 1.3.3 | Sensory Characteristics | Instructions not rely on shape, size, location alone |
| 1.3.4 | Orientation | Content not restricted to portrait or landscape |
| 1.3.5 | Identify Input Purpose | Input purpose programmatically determinable (autocomplete) |
| 1.4.3 | Contrast (Minimum) | Text 4.5:1 (normal), 3:1 (large); enhanced 7:1/4.5:1 |
| 1.4.4 | Resize Text | Text resizable to 200% |
| 1.4.5 | Images of Text | Images of text used only for decoration or essential |
| 1.4.10 | Reflow | No horizontal scroll at 320px |
| 1.4.11 | Non-text Contrast | 3:1 for UI and graphics |
| 1.4.12 | Text Spacing | No loss when spacing overrides applied |
| 1.4.13 | Content on Hover or Focus | Dismissible, hoverable, persistent |

### Principle 2: Operable

| ID | Criterion | Testable Checkpoint |
|----|-----------|---------------------|
| 2.4.5 | Multiple Ways | Multiple ways to find pages (sitemap, search, nav) |
| 2.4.6 | Headings and Labels | Headings and labels descriptive |
| 2.4.7 | Focus Visible | Keyboard focus indicator visible |
| 2.5.1 | Pointer Gestures | Path-based gestures have single-pointer alternative |
| 2.5.2 | Pointer Cancellation | No down-only activation |
| 2.5.3 | Label in Name | Accessible name includes visible label |
| 2.5.4 | Motion Actuation | Motion not sole trigger |

### Principle 3: Understandable

| ID | Criterion | Testable Checkpoint |
|----|-----------|---------------------|
| 3.1.2 | Language of Parts | Language of passages programmatically determinable |
| 3.2.3 | Consistent Navigation | Navigation repeated in same order |
| 3.2.4 | Consistent Identification | Components with same function identified consistently |
| 3.3.3 | Error Suggestion | Suggestions provided for input errors |
| 3.3.4 | Error Prevention (Legal, Financial) | Reversible or confirmable for legal/financial submissions |

### Principle 4: Robust

| ID | Criterion | Testable Checkpoint |
|----|-----------|---------------------|
| 4.1.3 | Status Messages | Status messages use role or live region (no change to 4.1.2) |

---

## Level AAA (Enhanced)

### Principle 1: Perceivable

| ID | Criterion | Testable Checkpoint |
|----|-----------|---------------------|
| 1.2.6 | Sign Language (Prerecorded) | Sign language interpretation for prerecorded audio |
| 1.2.7 | Extended Audio Description (Prerecorded) | Extended audio description when pauses insufficient |
| 1.2.8 | Media Alternative (Prerecorded) | Text alternative for prerecorded media |
| 1.2.9 | Audio-only (Live) | Alternative for live audio-only |
| 1.3.6 | Identify Purpose | Purpose of UI components programmatically determinable |
| 1.4.6 | Contrast (Enhanced) | 7:1 (normal), 4.5:1 (large) |
| 1.4.7 | Low or No Background Audio | No background audio or can be turned off |
| 1.4.8 | Visual Presentation | User can control text presentation (foreground/background, width, etc.) |
| 1.4.9 | Images of Text (No Exception) | No images of text except essential |
| 1.4.11 | Non-text Contrast | 3:1 (same as AA for graphics) |
| 1.4.12 | Text Spacing | No loss with spacing overrides |
| 1.4.13 | Content on Hover or Focus | Dismissible, hoverable, persistent |

### Principle 2: Operable

| ID | Criterion | Testable Checkpoint |
|----|-----------|---------------------|
| 2.2.3 | No Timing | No time limits on content |
| 2.2.4 | Interruptions | User can postpone or suppress interruptions |
| 2.2.5 | Re-authenticating | Re-auth preserves data |
| 2.3.2 | Three Flashes | No content flashes more than 3/sec |
| 2.3.3 | Animation from Interactions | Motion from interaction can be disabled |
| 2.4.8 | Location | User can determine location in set of pages |
| 2.4.9 | Link Purpose (Link Only) | Link purpose from link text alone |
| 2.4.10 | Section Headings | Section headings used to organize content |
| 2.5.5 | Target Size | Touch target ≥ 44×44 CSS pixels |
| 2.5.6 | Concurrent Input Mechanisms | No restriction to single input modality |

### Principle 3: Understandable

| ID | Criterion | Testable Checkpoint |
|----|-----------|---------------------|
| 3.1.3 | Unusual Words | Mechanism to identify definitions |
| 3.1.4 | Abbreviations | Mechanism to expand abbreviations |
| 3.1.5 | Reading Level | Supplemental content for text above lower-secondary level |
| 3.1.6 | Pronunciation | Mechanism to determine pronunciation |
| 3.2.5 | Change on Request | Context changes only on user request |
| 3.3.5 | Help | Context-sensitive help available |
| 3.3.6 | Error Prevention (All) | Reversible or confirmable for all submissions |

### Principle 4: Robust

| ID | Criterion | Testable Checkpoint |
|----|-----------|---------------------|
| 4.1.3 | Status Messages | Same as AA |

---

## Testing Tools

- **axe-core** / **axe DevTools**: Automated WCAG checks
- **WAVE**: Visual accessibility evaluation
- **Lighthouse**: Chrome DevTools accessibility audit
- **Screen readers**: NVDA, JAWS, VoiceOver, TalkBack
- **Keyboard-only**: Tab, Enter, Space, Arrow keys

---

## References

- [WCAG 2.2 Quick Reference](https://www.w3.org/WAI/WCAG22/quickref/)
- [Understanding WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/)
