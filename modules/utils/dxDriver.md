# dxDriver

## 1. Overview

`dxDriver` is one of the **core basic modules** of DejaOS.  
It provides a unified entry point for all **device‑specific hardware drivers**, combining a JavaScript configuration file (`dxDriver.js`) with a set of native driver `.so` libraries.

- Defines **all hardware resource mappings** for a specific device model (GPIO pins, UART paths, camera devices, PWM channels, etc.).
- Loads the corresponding **native driver libraries** that actually drive the hardware.
- Is **required in almost all real devices** and should be enabled by default in DejaOS projects.

## 2. Files

- `dxDriver.js`
- Multiple `*.so` files

> Ensure **all** these files are included under the `dxmodules` subdirectory of your project root.

## 3. Dependencies

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+.

## 5. Configuration Structure

Below is a simplified example from the **DW200** device:

```javascript
const dxDriver = {};

// 1) GPIO pins
dxDriver.GPIO = {
  // Relay control
  RELAY: 35,
};

// 2) Communication channels
dxDriver.CHANNEL = {
  // RS‑485 UART
  UART_PATH: "/dev/ttyS3",
  // USB HID virtual device
  USBHID_PATH: "/dev/hidg1",
};

// 3) Camera parameters
dxDriver.CAPTURER = {
  WIDTH: 800,
  HEIGHT: 600,
  PATH: "/dev/video11",
};

// 4) PWM channel for buzzer
dxDriver.PWM = {
  BEEP_CHANNEL: 4,
  BEEP_GPIO: 130,
  BEEP_PERIOD_NS: 366166,
  BEEP_DUTY: (366166 * 50) / 255,
};

export default dxDriver;
```

Each device can define its own sections (e.g. `GPIO`, `CHANNEL`, `CAPTURER`, `PWM`, etc.) according to its hardware design.

## 6. Usage

### 6.1 Importing `dxDriver`

```javascript
import dxDriver from "./dxmodules/dxDriver.js";

// Example: use GPIO resource to control a relay
const relayPin = dxDriver.GPIO.RELAY;
// Pass relayPin to your GPIO abstraction (e.g. dxGpio) to drive the hardware
```

Typical patterns:

- Use `dxDriver.GPIO` constants when configuring `dxGpio` / `dxGpioKey`.
- Use `dxDriver.CHANNEL.UART_PATH` when configuring serial communication modules.
- Use `dxDriver.CAPTURER` when initializing camera modules.
- Use `dxDriver.PWM` when controlling buzzers or LEDs via `dxPwm`.

## 7. Best Practices

- Treat `dxDriver` as the **single source of truth** for all hardware resource definitions in your project.
- Avoid hard‑coding GPIO numbers or `/dev/...` paths elsewhere in your code; always reference them through `dxDriver`.
- For new hardware revisions, create a **separate** `dxDriver.js` variant (and driver `.so` set) to keep configurations clean and maintainable.
