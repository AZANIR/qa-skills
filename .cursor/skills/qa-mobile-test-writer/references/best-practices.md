# Mobile Testing Best Practices

## Test Stability

### Prefer Accessibility IDs

```javascript
// Good — stable, semantic
await $('~login-button').click();
await $('~email-input').setValue('user@test.com');

// Avoid — brittle
await $('//android.widget.Button[@index="2"]').click();
await $('.android.widget.EditText').setValue('user@test.com');
```

**Recommendation:** Add `accessibilityIdentifier` (iOS) and `contentDescription` / `testID` (Android/React Native) to key UI elements. Use these for automation.

### Explicit Waits

```javascript
// Good — wait for condition
await $('~welcome-message').waitForDisplayed({ timeout: 10000 });
await $('~submit-btn').waitForClickable();

// Bad — arbitrary delay
await driver.pause(3000);
```

### Handle Animations

- **Flutter:** Use `pumpAndSettle()` to wait for animations to finish
- **Appium:** Add short waits after navigation; use `waitForDisplayed` before interaction
- **Tip:** Disable animations on emulators for faster, more stable runs:
  - Android: Settings → Developer options → Window/Transition/Animator scale → Off
  - iOS: Settings → Accessibility → Motion → Reduce Motion

### Avoid Order Dependencies

- Each test should run in isolation
- Use `beforeEach` to reset app state or use `fullReset` when needed
- Prefer API/data setup over UI-based setup when possible

---

## Device Matrix

### Prioritize Key Combinations

| Priority | Android | iOS |
|----------|---------|-----|
| High | Latest (API 34) | Latest (17) |
| Medium | L-1 (API 33) | N-1 (16) |
| Low | Older (API 30) | Older (15) |

### Screen Sizes

- **Phone:** Small (320pt), Medium (375pt), Large (414pt)
- **Tablet:** 768pt, 1024pt (if app supports)
- **Orientation:** Portrait and landscape for critical flows

### Strategy

- **Smoke:** 1–2 devices (latest Android + iOS)
- **Regression:** 4–6 devices covering OS versions and screen sizes
- **Full matrix:** Device farm with parallel execution

---

## Accessibility IDs

### iOS (Swift/SwiftUI)

```swift
Button("Login") { ... }
  .accessibilityIdentifier("login-button")

TextField("Email", text: $email)
  .accessibilityIdentifier("email-input")
```

### Android (Kotlin/XML)

```xml
<Button
  android:id="@+id/login_button"
  android:contentDescription="Login" />
```

```kotlin
// Or programmatically
view.accessibilityDelegate = object : AccessibilityDelegate() {
  // Use contentDescription for screen readers and automation
}
```

### React Native

```jsx
<Button testID="login-button" title="Login" />
<TextInput testID="email-input" />
```

### Flutter

```dart
ElevatedButton(
  key: Key('login-button'),
  onPressed: () {},
  child: Text('Login'),
)
```

---

## CI with Emulators

### Caching

- Cache Android SDK and emulator images
- Cache iOS simulators (Xcode)
- Cache npm/pip dependencies

### Parallelization

```yaml
# Run Android and iOS in parallel
jobs:
  android:
    runs-on: ubuntu-latest
    steps:
      - run: npx wdio run wdio.android.conf.ts
  ios:
    runs-on: macos-latest
    steps:
      - run: npx wdio run wdio.ios.conf.ts
```

### Sharding

```bash
# Split specs across workers
npx wdio run wdio.conf.ts --shard=1/4
npx wdio run wdio.conf.ts --shard=2/4
# ...
```

### Artifacts on Failure

- Screenshots on failure
- Appium logs
- Video recording (device farms often provide this)

```javascript
afterTest: async function (test, context, result) {
  if (result.error) {
    const screenshot = await browser.takeScreenshot();
    // Write to file, upload to artifact storage
  }
},
```

---

## Hybrid App Considerations

- **Context switching:** Always verify current context before interacting
- **Webview load:** Wait for webview context to appear and page to load
- **Selectors in webview:** Use web selectors (CSS, XPath) after switching to webview
- **Performance:** Webview interactions can be slower; increase timeouts if needed

---

## Flutter-Specific

### Use Keys for Stability

```dart
// In app
ElevatedButton(key: Key('submit'), ...)

// In test
await tester.tap(find.byKey(Key('submit')));
```

### pumpAndSettle for Animations

```dart
await tester.pumpAndSettle();  // Waits for all animations
```

### Golden Tests

- Store golden images in version control
- Review visual diffs in PRs
- Use `flutter test --update-goldens` to update when UI intentionally changes

---

## Security

- Never hardcode device farm credentials
- Use `process.env` or CI secrets
- Store app paths in config; avoid committing .apk/.ipa to repo
- Use signed builds for real device testing

---

## Performance

- Use `noReset: true` when possible to avoid reinstall between tests
- Run tests in parallel on device farms
- Minimize unnecessary app restarts
- Consider splitting long flows into smaller, focused tests
