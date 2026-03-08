# Mobile Test Patterns

## Native Apps

### Element Location Strategies

| Strategy | iOS | Android | Priority |
|----------|-----|---------|----------|
| **accessibility id** | accessibilityIdentifier | content-desc / resource-id | 1 (most stable) |
| **resource-id** | — | resource-id | 1 (Android) |
| **id** | — | id attribute | 1 (Android) |
| **class name** | XCUIElementType* | android.widget.* | 2 |
| **xpath** | Full path | Full path | 3 (last resort) |
| **predicate** | -ios predicate string | — | 2 (iOS) |
| **uiautomator** | — | -android uiautomator | 2 (Android) |

### Appium Native Example

```javascript
// Appium (WebdriverIO)
const loginBtn = await $('~login-button');  // accessibility id
await loginBtn.click();

// Android resource-id
const submitBtn = await $('id=com.example:id/submit');
await submitBtn.click();

// iOS predicate
const cell = await $('-ios predicate string:name == "Settings"');
await cell.click();

// Android UiAutomator
const item = await $('-android uiautomator:new UiSelector().text("Submit")');
await item.click();
```

### Flutter Native Example

```dart
// integration_test/app_test.dart
import 'package:flutter_test/flutter_test.dart';
import 'package:integration_test/integration_test.dart';
import 'package:my_app/main.dart' as app;

void main() {
  IntegrationTestWidgetsFlutterBinding.ensureInitialized();

  testWidgets('login flow', (tester) async {
    app.main();
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(Key('login-button')));
    await tester.pumpAndSettle();

    await tester.enterText(find.byKey(Key('email-field')), 'user@test.com');
    await tester.enterText(find.byKey(Key('password-field')), 'secret');
    await tester.tap(find.byKey(Key('submit-button')));
    await tester.pumpAndSettle();

    expect(find.text('Welcome'), findsOneWidget);
  });
}
```

---

## Hybrid Apps

### Context Switching

Hybrid apps have native and webview contexts. Switch to webview to interact with web content.

```javascript
// Get all contexts
const contexts = await driver.getContexts();
// ['NATIVE_APP', 'WEBVIEW_com.example.app']

// Switch to webview
await driver.switchContext('WEBVIEW_com.example.app');

// Use web selectors (CSS, XPath)
await $('input[name="email"]').setValue('user@test.com');
await $('button[type="submit"]').click();

// Switch back to native
await driver.switchContext('NATIVE_APP');
```

### Webview Detection

```javascript
// Wait for webview to appear
await driver.waitUntil(
  async () => (await driver.getContexts()).some(c => c.includes('WEBVIEW')),
  { timeout: 10000 }
);
```

---

## Gestures

### Touch Actions (Legacy)

```javascript
// Single tap
await element.touchAction('tap');

// Long press
await element.touchAction([
  { action: 'longPress' },
  { action: 'release' }
]);

// Swipe
await driver.touchAction([
  { action: 'press', x: 300, y: 800 },
  { action: 'wait', ms: 500 },
  { action: 'moveTo', x: 300, y: 200 },
  { action: 'release' }
]);

// Scroll (element-based)
await element.touchAction([
  { action: 'press', x: 150, y: 500 },
  { action: 'moveTo', x: 150, y: 100 },
  { action: 'release' }
]);
```

### W3C Actions API (Preferred)

```javascript
// Tap
await driver.performActions([
  {
    type: 'pointer',
    id: 'finger1',
    parameters: { pointerType: 'touch' },
    actions: [
      { type: 'pointerMove', duration: 0, x: 100, y: 200 },
      { type: 'pointerDown', button: 0 },
      { type: 'pointerUp', button: 0 }
    ]
  }
]);

// Swipe
await driver.performActions([
  {
    type: 'pointer',
    id: 'finger1',
    parameters: { pointerType: 'touch' },
    actions: [
      { type: 'pointerMove', duration: 0, x: 200, y: 600 },
      { type: 'pointerDown', button: 0 },
      { type: 'pause', duration: 100 },
      { type: 'pointerMove', duration: 300, x: 200, y: 200 },
      { type: 'pointerUp', button: 0 }
    ]
  }
]);
```

### Scroll to Element

```javascript
// Scroll until element visible (Appium)
await driver.execute('mobile: scroll', {
  direction: 'down',
  predicateString: 'name == "Target Element"'
});

// Or use scrollIntoView (if supported)
await element.scrollIntoView();
```

---

## App Lifecycle

### Install / Uninstall

```javascript
// Install app
await driver.installApp('/path/to/app.apk');
await driver.installApp('https://example.com/app.apk');

// Uninstall
await driver.removeApp('com.example.app');
```

### Launch / Terminate

```javascript
// Launch (activate) app
await driver.activateApp('com.example.app');

// Terminate
await driver.terminateApp('com.example.app');
```

### Reset Options

| Capability | Effect |
|------------|--------|
| `noReset: true` | Reuse app state; faster; may leave data |
| `fullReset: true` | Uninstall + reinstall; clean state |
| `dontStopAppOnReset: true` | Don't stop app before session |

### Background / Foreground

```javascript
// Send app to background
await driver.background(5);  // 5 seconds

// Resume
await driver.activateApp('com.example.app');
```

---

## Deep Links

### Open Deep Link

```javascript
// Android
await driver.execute('mobile: deepLink', {
  url: 'myapp://screen/detail/123',
  package: 'com.example.app'
});

// iOS
await driver.execute('mobile: launchApp', {
  bundleId: 'com.example.app',
  arguments: ['--url', 'myapp://screen/detail/123']
});
```

### URL Scheme (Alternative)

```javascript
// Open URL that triggers app
await driver.url('myapp://screen/detail/123');
```

---

## Mobile Web

### Capabilities for Mobile Browser

```javascript
// Android Chrome
{
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  browserName: 'Chrome',
  'appium:deviceName': 'emulator-5554'
}

// iOS Safari
{
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  browserName: 'Safari',
  'appium:deviceName': 'iPhone 15'
}
```

### Mobile Web Selectors

Use standard web selectors (CSS, XPath) when context is browser. Viewport and touch behavior differ from desktop.

---

## Flutter Finders

| Finder | Use Case |
|--------|----------|
| `find.byKey(Key('id'))` | Stable; requires Key in widget |
| `find.text('Label')` | Visible text |
| `find.byType(MyWidget)` | Widget type |
| `find.bySemanticsLabel('label')` | Accessibility |
| `find.byIcon(Icons.add)` | Icon |
| `find.byTooltip('tip')` | Tooltip |

### Pumping

```dart
await tester.pump();           // One frame
await tester.pump(Duration(seconds: 1));  // Advance time
await tester.pumpAndSettle();  // Pump until no more frames (animations done)
```

### Golden Tests

```dart
await expectLater(
  find.byType(MyWidget),
  matchesGoldenFile('goldens/my_widget.png'),
);
```
