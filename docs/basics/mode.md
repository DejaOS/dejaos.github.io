# System Mode

## Overview

The dejaOS system provides three main operating modes, each with different system behaviors, and modes can be switched between:

- Development Mode (dev)
- Production Mode (prod)
- Test Mode (test)

## 1. Development Mode

Development mode is the default mode for development devices. In development mode:

- **No Applications Start by Default**: No App will automatically start after device restart.
- **No Interface Display**: If the device has a screen, it won't display application-related interfaces.
- **Debug App**: The system automatically starts a built-in debug App for interacting with VSCode via USB cable. This mode is suitable for syncing JavaScript code under development to the device.

## 2. Production Mode

Production mode is the default mode for production devices. In production mode:

- **Start Production App**: The corresponding production App will automatically start after device restart.
- **Application Interface Display**: If the device has a screen, it will display application-related interfaces.
- **Debugging Disabled**: The debug App won't start, and you cannot sync code to the device via VSCode.

## 3. Test Mode

In test mode, both the production App and debug App run simultaneously, typically used for special testing requirements. In this mode:

- **Start Production App**: The corresponding production App will automatically start after device restart and display the application interface (if the device has a screen).
- **Start Debug App**: The debug App will automatically start after device startup, allowing code syncing to the device via VSCode.

## Mode Switching

You can switch between different modes in the following two ways:

### 1. Via System Management App

This is the most common way to switch, especially during development, debugging, or device maintenance. You can use the System Manager App to switch the device to the desired mode.

For details, please refer to [System Management App](/docs/basics/managerapp).

### 2. Via Code

You can also trigger mode switching through code, which is typically used for specific business scenarios, such as scanning a QR code, receiving an MQTT command, or triggering via a specific gesture.

You can use the `setMode` function of the `dxOs` module for switching:

```javascript
import dxos from "../dxmodules/dxOs.js";
if (condition1) {
  dxos.setMode("prod"); // Supported parameters include: dev, test, prod
} else if (condition2) {
  dxos.setMode("dev"); // Supported parameters include: dev, test, prod
}
```

> ⚠️ Note:
>
> - After switching the mode, the device will automatically restart.
> - It's best to trigger the mode change conditionally, not on application startup, to prevent continuous reboots.
> - After switching to production mode, you can no longer modify code via VSCode, so there must be a way to switch back to development mode.
> - Usually, this is triggered by external commands like a QR code or MQTT. Refer to the [example of triggering a change via QR code](https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_switch_mode)

---

## Mode Behavior Comparison Table

| Mode | Start App | Display Interface | Support Debug | Application Scenarios |
| :--- | :--- | :--- | :--- | :--- |
| Development Mode | No | No | ✅ | Development and debugging phase |
| Production Mode | ✅ | ✅ | No | Commercial deployment, official release |
| Test Mode | ✅ | ✅ | ✅ | Integration testing, pre-release validation |

---

For information on how to set default modes in batch devices or perform pre-factory mode burning configuration, please contact DejaOS official support.
