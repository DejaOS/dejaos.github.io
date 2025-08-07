# System Mode

## Overview

The dejaOS system provides four operating modes, each with different system behaviors, and modes can be switched between:

- Safe Mode (safe)
- Development Mode (dev)
- Production Mode (prod)
- Test Mode (test)

## 1. Safe Mode

Safe mode is similar to the BIOS mode of a PC computer. When the device starts up, there is a 2-second delay window during which you can connect to PC tools via serial cable to enter safe mode. The main functions of safe mode are:

- **Install DPK Applications**: This is the most important function of safe mode.
- **Switch System Modes**: You can use tools to switch the device to other modes.
- **Get System Information**: You can view basic information about the system and installed applications.

![Application Installation](/img/app_install2.png)

## 2. Development Mode

Development mode is the default mode for development devices. In development mode:

- **No Applications Start by Default**: No App will automatically start after device restart.
- **No Interface Display**: If the device has a screen, it won't display application-related interfaces.
- **Debug App**: The system automatically starts a built-in debug App for interacting with VSCode via USB cable. This mode is suitable for syncing JavaScript code under development to the device.

You can manually switch to development mode using tools in safe mode.

## 3. Production Mode

Production mode is the default mode for production devices. In production mode:

- **Start Production App**: The corresponding production App will automatically start after device restart.
- **Application Interface Display**: If the device has a screen, it will display application-related interfaces.
- **Debugging Disabled**: The debug App won't start, and you cannot sync code to the device via VSCode.

You can switch to production mode using tools in safe mode.

## 4. Test Mode

In test mode, both the production App and debug App run simultaneously, typically used for special testing requirements. In this mode:

- **Start Production App**: The corresponding production App will automatically start after device restart and display the application interface (if the device has a screen).
- **Start Debug App**: The debug App will automatically start after device startup, allowing code syncing to the device via VSCode.

You can manually switch to test mode using tools in safe mode.

## Switching Modes via Code

In addition to using tools to switch modes, you can also trigger mode switching through code, such as scanning QR codes on the device or using other protocols. You can use the `setMode` function of the `dxCommon` module for switching:

```javascript
import common from "../dxmodules/dxCommon.js";
if (condition1) {
  common.setMode("prod"); // Supported parameters include: dev, test, prod
} else if (condition2) {
  common.setMode("dev"); // Supported parameters include: dev, test, prod
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

| Mode             | Start App | Display Interface | Support Debug | Application Scenarios                          |
| ---------------- | --------- | ----------------- | ------------- | ---------------------------------------------- |
| Safe Mode        | No        | No                | No            | Installation, mode switching, view information |
| Development Mode | No        | No                | ✅            | Development and debugging phase                |
| Production Mode  | ✅        | ✅                | No            | Commercial deployment, official release        |
| Test Mode        | ✅        | ✅                | ✅            | Integration testing, pre-release validation    |

---

For information on how to set default modes in batch devices or perform pre-factory mode burning configuration, please contact DejaOS official support.
