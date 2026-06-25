# dxGpioKey

## 1. Overview

This module is part of the official [dejaOS](https://github.com/DejaOS/DejaOS) system module library. It provides **GPIO input (key) event** monitoring.

**What it does:** Reads state changes from hardware input interfaces wired to the device — for example **door contact (magnetic)**, **fire alarm input**, and **tamper (anti-removal) switch**. Events follow the Linux input event model (`type` / `code` / `value`). `value` is typically `1` (triggered / open) or `0` (released / closed).

**How it differs from dxGpio:** `dxGpioKey` is for **input** (listen to external sensors). `dxGpio` is for **output** (drive relays and other actuators). Input events typically trigger application logic; output performs the corresponding on/off action.

Features:

- Initialize / deinitialize GPIO key monitoring
- Query current status by key `code`
- Register `onKeyEvent` callback
- Process events via periodic `loop()` calls

> Callback registration and `loop()` should run in the **same thread**. The module can be used across threads, but event delivery is tied to the thread that calls `loop()`.

## 2. Files

- dxGpioKey.js
- libvbar-m-dxkey.so

> Ensure these files are placed under the `dxmodules` subdirectory in your project root.

## 3. Dependencies

- dxLogger (recommended for error logging in `loop()`)

## 4. Compatible Devices

Compatible with dejaOS v2.0+ devices that provide GPIO key / digital input hardware. The number of inputs and the meaning of each `code` (0, 1, 2, …) are **device and wiring dependent**.

## 5. Usage

### Basic usage

```javascript
import dxGpioKey from "./dxmodules/dxGpioKey.js";
import std from "./dxmodules/dxStd.js";

dxGpioKey.init();

dxGpioKey.setCallbacks({
  onKeyEvent: function (event) {
    // event: { code, srcCode, type, value }
    log.info("GPIO key event:", JSON.stringify(event));
  },
});

std.setInterval(() => {
  dxGpioKey.loop();
}, 50);
```

### Query status

```javascript
const status = dxGpioKey.getStatus(1);
// Example: { code: 1, srcCode: 33, type: 1, value: 1 }
```

In `onKeyEvent`, use `code` to identify the input channel and `value` for triggered vs. released:

```javascript
dxGpioKey.setCallbacks({
  onKeyEvent: function (event) {
    if (event.type !== dxGpioKey.GPIO_KEY_TYPE.KEY) {
      return;
    }
    if (event.code === 0 && event.value === 1) {
      // Input channel 0 triggered
    }
  },
});
```

## 6. API Reference

### `dxGpioKey.init()`

Initialize GPIO key monitoring.

**Returns:** `boolean`

### `dxGpioKey.deinit()`

Deinitialize and release resources.

**Returns:** `boolean`

### `dxGpioKey.getStatus(code)`

Query current state of a key by logical `code`.

**Parameters:**

- `code` (number): Key index `0` … `n-1` (`n` = number of GPIO key interfaces on the device)

**Returns:** `KeyEvent` object:

| Field | Type | Description |
| :--- | :--- | :--- |
| `code` | number | Logical key code |
| `srcCode` | number | Hardware source code |
| `type` | number | Event type (see `GPIO_KEY_TYPE`) |
| `value` | number | `1` pressed / triggered, `0` released |

### `dxGpioKey.setCallbacks(callbacks)`

Register event handlers.

**Parameters:**

- `callbacks.onKeyEvent` (function): Called with a `KeyEvent` when input changes

### `dxGpioKey.loop()`

Poll the native event queue and dispatch callbacks. Call periodically (e.g. every 20–50 ms in `setInterval`).

### `dxGpioKey.getNative()`

Returns the native GPIO key object, or `null` if not initialized.

## 7. Constants

### `dxGpioKey.GPIO_KEY_TYPE`

Linux input event types (subset):

```javascript
dxGpioKey.GPIO_KEY_TYPE = {
  SYN: 0x00, // sync
  KEY: 0x01, // key / GPIO key
  REL: 0x02, // relative
  ABS: 0x03, // absolute
  MSC: 0x04, // miscellaneous
  SW:  0x05, // switch
  LED: 0x11,
  SND: 0x12,
};
```

GPIO key events normally use `type === dxGpioKey.GPIO_KEY_TYPE.KEY`.

## 8. Related Modules

- **dxGpio:** GPIO **output** (relay / digital control)
- **dxDriver:** Device configuration constants

## 9. Examples

None.
