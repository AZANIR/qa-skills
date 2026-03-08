# Mobile Test Configuration

## Appium Setup

### Installation

```bash
npm install -g appium
appium driver install xcuitest   # iOS
appium driver install uiautomator2  # Android
```

### Appium Server

```bash
# Start server (default port 4723)
appium

# Custom port
appium --port 4724

# With logs
appium --log ./logs/appium.log
```

### WebdriverIO + Appium Service

```typescript
// wdio.conf.ts
import type { Options } from '@wdio/types';

export const config: Options.Testrunner = {
  port: 4723,
  path: '/',
  specs: ['./test/specs/**/*.ts'],
  capabilities: [
    {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'emulator-5554',
      'appium:app': './apps/myapp.apk',
      'appium:noReset': true,
    },
  ],
  services: [
    ['appium', {
      args: { address: 'localhost', port: 4723 },
      logPath: './logs/',
    }],
  ],
  framework: 'mocha',
  // ...
};
```

---

## Desired Capabilities

### Android (UiAutomator2)

```javascript
{
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'emulator-5554',
  'appium:udid': 'emulator-5554',  // or device serial
  'appium:app': '/path/to/app.apk',
  'appium:appPackage': 'com.example.app',
  'appium:appActivity': '.MainActivity',
  'appium:noReset': true,
  'appium:fullReset': false,
  'appium:newCommandTimeout': 60,
}
```

### iOS (XCUITest)

```javascript
{
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': 'iPhone 15',
  'appium:udid': '...',  // Simulator or device UDID
  'appium:app': '/path/to/app.app',
  'appium:bundleId': 'com.example.app',
  'appium:noReset': true,
  'appium:fullReset': false,
  'appium:newCommandTimeout': 60,
}
```

### Mobile Web (Chrome on Android)

```javascript
{
  platformName: 'Android',
  'appium:automationName': 'UiAutomator2',
  'appium:deviceName': 'emulator-5554',
  browserName: 'Chrome',
  'appium:chromedriverAutodownload': true,
}
```

### Mobile Web (Safari on iOS)

```javascript
{
  platformName: 'iOS',
  'appium:automationName': 'XCUITest',
  'appium:deviceName': 'iPhone 15',
  browserName: 'Safari',
}
```

---

## Emulators and Simulators

### Android Emulator

```bash
# List AVDs
emulator -list-avds

# Start emulator
emulator -avd Pixel_6_API_34 -no-snapshot-load

# Verify device
adb devices
```

### iOS Simulator

```bash
# List simulators
xcrun simctl list devices

# Boot simulator
xcrun simctl boot "iPhone 15"

# Install app
xcrun simctl install booted /path/to/app.app
```

### Capability for Emulator

```javascript
// Android
'appium:deviceName': 'emulator-5554',
'appium:udid': 'emulator-5554',

// iOS (use UDID from simctl list)
'appium:deviceName': 'iPhone 15',
'appium:udid': '12345678-1234-1234-1234-123456789012',
```

---

## Device Farms

### BrowserStack

```javascript
{
  'bstack:options': {
    userName: process.env.BROWSERSTACK_USER,
    accessKey: process.env.BROWSERSTACK_KEY,
    projectName: 'My Project',
    buildName: 'Build 1',
    sessionName: 'Login test',
  },
  platformName: 'Android',
  'appium:deviceName': 'Samsung Galaxy S23',
  'appium:platformVersion': '13',
  'appium:app': 'bs://<app-id>',
  'appium:automationName': 'UiAutomator2',
}
```

**Capability URL:** `https://app-automate.browserstack.com/wd/hub`

### Sauce Labs

```javascript
{
  'sauce:options': {
    username: process.env.SAUCE_USERNAME,
    accessKey: process.env.SAUCE_ACCESS_KEY,
    build: 'Build 1',
    name: 'Login test',
  },
  platformName: 'Android',
  'appium:deviceName': 'Android GoogleAPI Emulator',
  'appium:platformVersion': '13',
  'appium:app': 'storage:filename=app.apk',
  'appium:automationName': 'UiAutomator2',
}
```

**Capability URL:** `https://ondemand.us-west-1.saucelabs.com/wd/hub`

### AWS Device Farm

```javascript
{
  platformName: 'Android',
  'appium:deviceName': 'Pixel 6',
  'appium:platformVersion': '13',
  'appium:app': process.env.DEVICE_FARM_APP_ARN,
  'appium:automationName': 'UiAutomator2',
}
```

Use AWS Device Farm test runner; upload app and test package via AWS CLI or console.

---

## Flutter Configuration

### integration_test Setup

```yaml
# pubspec.yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  integration_test:
    sdk: flutter
```

### Directory Structure

```
my_app/
  integration_test/
    app_test.dart
  lib/
    main.dart
```

### Run Flutter Integration Tests

```bash
# On connected device/emulator
flutter test integration_test/app_test.dart

# With driver (legacy)
flutter drive --target=test_driver/app.dart
```

### Flutter Driver (Legacy)

```dart
// test_driver/app.dart
import 'package:flutter_driver/driver_extension.dart';
import 'package:my_app/main.dart' as app;

void main() {
  enableFlutterDriverExtension();
  app.main();
}
```

---

## CI Integration

### GitHub Actions (Appium + Android Emulator)

```yaml
- uses: reactivecircus/android-emulator-runner@v2
  with:
    api-level: 34
    script: npx wdio run wdio.conf.ts
```

### GitHub Actions (iOS Simulator)

```yaml
- uses: maxim-lobanov/setup-xcode@v1
  with:
    xcode-version: '15.0'
- run: xcrun simctl boot "iPhone 15"
- run: npx wdio run wdio.ios.conf.ts
```

### Environment Variables

| Variable | Purpose |
|----------|---------|
| `BROWSERSTACK_USER` | BrowserStack username |
| `BROWSERSTACK_KEY` | BrowserStack access key |
| `SAUCE_USERNAME` | Sauce Labs username |
| `SAUCE_ACCESS_KEY` | Sauce Labs access key |
| `APP_PATH` | Path to .apk / .app |
| `DEVICE_UDID` | Device or simulator UDID |

---

## Key Options

| Option | Description | Default |
|--------|-------------|---------|
| `noReset` | Reuse app state; don't clear data | false |
| `fullReset` | Uninstall and reinstall app | false |
| `newCommandTimeout` | Idle timeout (seconds) | 60 |
| `autoGrantPermissions` | Auto-accept runtime permissions | false |
| `chromedriverAutodownload` | Auto-download ChromeDriver (Android) | false |
