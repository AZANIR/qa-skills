---
name: qa-mobile-test-writer
description: Generate mobile tests using Appium, WebdriverIO Mobile, and Flutter Driver for iOS and Android native, hybrid, Flutter, and mobile web applications.
output_dir: tests/mobile
---

# QA Mobile Test Writer

## Purpose

Write mobile tests for iOS, Android, hybrid, Flutter, and mobile web applications. Transform structured test cases into executable mobile test scripts using Appium (cross-platform native + hybrid), WebdriverIO Mobile (@wdio/appium-service), and Flutter Driver / integration_test for Flutter apps.

## Trigger Phrases

- "Write mobile tests for [iOS/Android/Flutter]"
- "Generate Appium tests from test cases"
- "Create mobile E2E tests for [app]"
- "Add Flutter integration tests"
- "Appium tests for native/hybrid app"
- "Mobile web tests on device"
- "WebdriverIO mobile tests with Appium"
- "Touch actions, gestures, app lifecycle tests"
- "Configure device farm (BrowserStack, Sauce Labs)"
- "Mobile test capabilities and emulator setup"

## Workflow

1. **Read test cases** — From qa-testcase-from-docs, qa-manual-test-designer, qa-testcase-from-ui
2. **Determine platform/framework** — iOS vs Android, native vs hybrid vs Flutter vs mobile web
3. **Generate test files** — Create test scripts with appropriate framework (Appium, WDIO, Flutter)
4. **Configure capabilities** — platformName, automationName, app path, device/emulator
5. **Set up device/emulator** — Local emulator, simulator, or device farm config

## Frameworks

| Framework | Use Case | Drivers |
|-----------|----------|---------|
| **Appium** | Native, hybrid, mobile web | XCUITest (iOS), UiAutomator2 (Android), Espresso (Android) |
| **WebdriverIO Mobile** | WDIO + Appium; TypeScript | @wdio/appium-service, same drivers |
| **Flutter Driver** | Flutter apps only | Flutter driver, integration_test |

## Platform Coverage

| Platform | Driver | Automation |
|----------|--------|------------|
| **iOS** | XCUITest | Native, hybrid, Safari (mobile web) |
| **Android** | UiAutomator2 | Native, hybrid, Chrome (mobile web) |
| **Flutter** | Flutter Driver | Flutter widgets, integration_test |
| **Mobile Web** | Browser on device | Chrome (Android), Safari (iOS) |

## Key Patterns

- **Desired capabilities:** platformName, automationName, app (path or URL), deviceName, udid, noReset, fullReset
- **Touch actions:** tap, swipe, scroll, long press, multi-touch
- **Element location:** accessibility id, xpath, class name, resource-id (Android), name (iOS)
- **Gestures:** W3C Actions API, TouchAction, MultiTouchAction
- **App lifecycle:** install, launch, close, reset, background/foreground

See `references/patterns.md` for native apps, hybrid apps, gestures, app lifecycle, deep links.

## Flutter Integration

- **flutter_test** — Unit and widget tests
- **integration_test** — E2E on device/emulator
- **Finders:** find.byKey, find.text, find.byType, find.bySemanticsLabel
- **Pumping:** pumpWidget, pumpAndSettle
- **Golden tests** — Screenshot comparison for visual regression

## WebdriverIO Mobile

- **@wdio/appium-service** — Appium server management
- **Mobile-specific selectors** — accessibility id, -android uiautomator, -ios predicate string
- **Touch actions** — element.touchAction(), browser.touchAction()
- **Mobile commands** — getContext, switchContext (for hybrid)

## Device Farms

| Service | Use Case |
|---------|----------|
| **BrowserStack** | Real devices, parallel execution |
| **Sauce Labs** | Real devices, emulators, Appium cloud |
| **AWS Device Farm** | AWS-integrated device testing |
| **Local** | Emulators, simulators, USB devices |

See `references/config.md` for Appium setup, capabilities, device farms, emulators.

## Output

- Mobile test scripts (Appium, WDIO, Flutter)
- Capability configuration files
- CI integration snippets (GitHub Actions, Jenkins, etc.)
- Device/emulator setup instructions

## Scope

**Can do (autonomous):**
- Generate Appium, WebdriverIO Mobile, Flutter Driver tests from test cases
- Configure desired capabilities for iOS/Android
- Use touch actions, gestures, app lifecycle patterns
- Set up capability configs for BrowserStack, Sauce Labs, AWS Device Farm
- Generate Flutter integration_test with finders and pumping
- Apply accessibility id, resource-id, xpath for element location
- Delegate to qa-test-healer when tests fail (selector/assertion fixes)

**Cannot do (requires confirmation):**
- Change production app code or add test IDs
- Add dependencies not in package.json / pubspec.yaml
- Override project Appium/WDIO config without approval
- Install or configure emulators/simulators on user machine

**Will not do (out of scope):**
- Execute tests (user runs `npx wdio`, `appium`, `flutter test integration_test`)
- Write unit/widget tests (use qa-jest-writer, qa-pytest-writer)
- Modify CI/CD pipelines
- Provision or manage device farm accounts

## References

- `references/patterns.md` — Native apps, hybrid apps, gestures, app lifecycle, deep links
- `references/config.md` — Appium setup, capabilities, device farms, emulators
- `references/best-practices.md` — Test stability, device matrix, accessibility IDs, CI with emulators

## Quality Checklist

- [ ] Accessibility id / resource-id preferred over xpath where possible
- [ ] Touch actions used for mobile (tap, swipe, scroll) vs generic click
- [ ] App lifecycle handled (install, launch, reset) per test needs
- [ ] Capabilities match target platform (iOS XCUITest, Android UiAutomator2)
- [ ] Tests independent (no shared state, order-independent)
- [ ] No hardcoded secrets (use env vars for device farm credentials)
- [ ] Traceability to test case IDs where applicable
- [ ] Flutter: find.byKey used for stable element location when available

## Troubleshooting

| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| Element not found | Wrong locator strategy, timing | Use accessibility id; add explicit wait; check context (native vs webview) |
| Session not created | Capability mismatch, wrong driver | Verify platformName, automationName, app path; check Appium server version |
| Hybrid app: element in webview | Wrong context | Use getContext/switchContext to webview; use CSS/XPath in webview |
| Flaky on emulator | Timing, animations | Use pumpAndSettle (Flutter); add explicit waits; disable animations |
| Device farm timeout | Slow device, network | Increase timeout; use faster device; check app size |
| Gesture fails | Unsupported action | Use W3C Actions API; fallback to TouchAction |
| App not installing | Invalid path, signing | Verify app path; check .ipa/.apk signing for real devices |
