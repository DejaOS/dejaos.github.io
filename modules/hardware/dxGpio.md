# dxGpio

## 1. Overview

This module is part of the official [dejaOS](https://github.com/DejaOS/DejaOS) system module library. It provides **GPIO output** control.

**What it does:** A GPIO pin can only be driven to **high level (1)** or **low level (0)**. Typical use cases include driving relays (door lock / electric strike), indicator outputs, and other on/off hardware. When a relay is wired to the pin, **high usually means energized (door open)** and **low means de-energized (door closed)** — confirm against your hardware schematic.

**How it differs from dxGpioKey:** `dxGpio` is for **output** (your app controls the pin). `dxGpioKey` is for **input** (external digital inputs report state changes). They are often used together: input events reflect peripheral state, output drives relays and other actuators.

Features:

- Initialize and release GPIO resources
- Request / free individual GPIO pins
- Set and read output level (0 / 1)
- Configure pin function, pull state, and drive strength (device-specific)

## 2. Files

- dxGpio.js
- libvbar-b-dxgpio.so

> Ensure these files are placed under the `dxmodules` subdirectory in your project root.

## 3. Dependencies

- None

## 4. Compatible Devices

Compatible with dejaOS v2.0+ devices that expose controllable GPIO pins. **GPIO pin numbers and function codes are device-specific** — use constants from `dxDriver` (e.g. `dxDriver.GPIO.RELAY0`) rather than hard-coding values.

## 5. Usage

### Basic usage

```javascript
import gpio from "./dxmodules/dxGpio.js";
import dxDriver from "./dxmodules/dxDriver.js";

// Initialize once
gpio.init();

// Request relay pin and configure as output (request() also sets function 0x04)
gpio.request(dxDriver.GPIO.RELAY0);

// Energize relay (door open)
gpio.setValue(dxDriver.GPIO.RELAY0, 1);

// De-energize relay (door closed)
gpio.setValue(dxDriver.GPIO.RELAY0, 0);

// Read current output level
let level = gpio.getValue(dxDriver.GPIO.RELAY0);

// Release when done (optional)
gpio.free(dxDriver.GPIO.RELAY0);
gpio.deinit();
```

### Timed pulse output

A common relay pattern is to drive the pin high, then return to low after a delay:

```javascript
import gpio from "./dxmodules/dxGpio.js";
import dxDriver from "./dxmodules/dxDriver.js";
import std from "./dxmodules/dxStd.js";

const relayPin = dxDriver.GPIO.RELAY0;
const holdMs = 3000;

gpio.init();
gpio.request(relayPin);

gpio.setValue(relayPin, 1);
std.setTimeout(() => {
  gpio.setValue(relayPin, 0);
}, holdMs);
```

## 6. API Reference

### `gpio.init()`

Initialize the GPIO subsystem. Call once before other operations.

**Returns:** `boolean` — `true` on success

### `gpio.deinit()`

Release GPIO resources.

**Returns:** `boolean`

### `gpio.request(gpio_)`

Request a GPIO pin and configure it for output (internally calls `setFunc(gpio_, 0x04)`).

**Parameters:**

- `gpio_` (number): GPIO identifier for the device, required

**Returns:** `boolean`

### `gpio.free(gpio_)`

Release a previously requested GPIO pin.

**Parameters:**

- `gpio_` (number): GPIO identifier, required

**Returns:** `boolean`

### `gpio.setValue(gpio_, value)`

Set output level.

**Parameters:**

- `gpio_` (number): GPIO identifier, required
- `value` (number): `1` = high, `0` = low, required

**Returns:** `boolean`

### `gpio.getValue(gpio_)`

Read current output level.

**Parameters:**

- `gpio_` (number): GPIO identifier, required

**Returns:** `number` — `1` or `0`

### `gpio.requestGpio(gpio_)`

Request a GPIO pin only (does not set function). Use with `setFuncGpio` when you need custom pin configuration.

**Returns:** `boolean`

### `gpio.setFuncGpio(gpio_, func)`

Set GPIO function attribute (device-specific, see `dxDriver.GPIO_FUNC`).

**Returns:** `boolean`

### `gpio.setPullState(gpio_, state)` / `gpio.getPullState(gpio_)`

Configure or read pull-up / pull-down state.

### `gpio.setDriveStrength(gpio_, strength)` / `gpio.getDriveStrength(gpio_)`

Configure or read drive strength.

## 7. Constants

GPIO function values are defined per device in `dxDriver.GPIO_FUNC`, for example:

```javascript
dxDriver.GPIO_FUNC = {
  GPIO_FUNC_3:  0x03,
  GPIO_OUTPUT0: 0x04, // output, default low
  GPIO_OUTPUT1: 0x05, // output, default high
};
```

Relay pin numbers are defined in `dxDriver.GPIO`, for example on VF203:

```javascript
dxDriver.GPIO = {
  RELAY0: 44,
  RELAY1: 84,
};
```

## 8. Related Modules

- **dxGpioKey:** GPIO **input** monitoring (door sensor, fire alarm, tamper, etc.)
- **dxDriver:** Device-specific GPIO / relay pin constants

## 9. Examples

None.
