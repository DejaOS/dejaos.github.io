# dxPwm

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used for PWM (Pulse Width Modulation) control functionality.
It includes comprehensive PWM control features:

- PWM channel initialization and management
- Power level control (0-100 range)
- Beep sound generation with customizable parameters
- Pre-defined beep patterns for different scenarios (press, success, fail, warning)
- Cross-thread PWM control support

On some devices, the PWM output is connected to an **LED** instead of a buzzer: in this case, `setPower` controls LED brightness (duty cycle), and `pwm.beep()` becomes a blink pattern (with `volume` interpreted as blink brightness). Channel indexes must match your hardware design. If no channel is passed, most APIs default to channel `0`.

## 2. Files

- dxPwm.js
- libvbar-b-dxpwm.so

> - Ensure these 2 files are included in the dxmodules subdirectory under your project root directory

## 3. Dependencies

- None

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+ that have PWM hardware support.

## 5. Usage

### Basic Usage

```javascript
import pwm from '../dxmodules/dxPwm_new.js'
import logger from '../dxmodules/dxLogger.js'
import std from '../dxmodules/dxStd.js'
import * as os from "os"

// Initialize PWM channel
pwm.init(); // channel 0

// Set power level
let power = 0
pwm.setPower(power)
os.sleep(500)

power = 50
pwm.setPower(power)
os.sleep(300)

power = 0
pwm.setPower(power)
os.sleep(500)

// Generate a simple beep
pwm.beep({
    delay: 50,
    interval: 50,
    count: 2
})

// Use pre-defined beep patterns
pwm.pressBeep();    // Short beep for key press
pwm.successBeep();  // Two short beeps for success
pwm.failBeep();     // Long beep for failure
pwm.warningBeep();  // Standard warning beep

```

### PWM for LED (Brightness and Blinking)

The example below assumes channel `0` drives a white LED and channel `1` is another output (for example, NIR). Only the white channel is used in this demo. For multi-channel use, initialize each channel before use.

```javascript
import pwm from "../dxmodules/dxPwm_new.js";
import logger from "../dxmodules/dxLogger.js";
import * as os from "os";

// Channel IDs must match hardware wiring.
// If channel is omitted, init / setPower / beep usually use channel 0 by default.
const CHANNEL_WHITE = 0;
const CHANNEL_NIR = 1; // Not used in this demo

// Initialize the PWM channel before any operation on it.
let resp = pwm.init(CHANNEL_WHITE);
logger.info("PWM init: " + resp);

// --- Steady light: setPower(0-100) controls duty cycle / brightness ---
let power = 0;
pwm.setPower(power, CHANNEL_WHITE);
os.sleep(500);

power = 10; // Example low brightness; tune per hardware and visual effect
pwm.setPower(power, CHANNEL_WHITE);
os.sleep(2000);

power = 0;
pwm.setPower(power, CHANNEL_WHITE);
os.sleep(500);

// --- Blink pattern: beep is "sound" on a buzzer, but "blink rhythm" on LED ---
// time: LED on duration per blink (ms)
// interval: pause between blinks (ms)
// count: number of blinks
// volume: brightness level during blink (0-100)
logger.info("Two short blinks demo");
pwm.beep(
  {
    time: 50,
    interval: 50,
    count: 2,
    volume: 80,
  },
  CHANNEL_WHITE
);
```

## 6. API Reference

### `pwm.init(channel)`

Initializes the specified PWM channel. Must be called before any other PWM operations on that channel.

**Parameters:**

- `channel` (number): The PWM channel number to initialize, default 0

**Returns:** `object` - Initialization result object

**Note:** This function must be called before using any other PWM functions on the specified channel.

### `pwm.deinit(channel)`

Releases and cleans up the designated PWM channel.

**Parameters:**

- `channel` (number): The PWM channel number to deinitialize, default 0

**Returns:** `boolean` - true if deinitialization successful, false otherwise

**Throws:** `Error` if channel parameter is invalid

### `pwm.setPower(power, channel)`

Sets the power level of the specified PWM channel.

**Parameters:**

- `power` (number): Power level (0-100), required
- `channel` (number): The PWM channel number to use, default 0

**Returns:** `boolean` - true if power set successfully, false otherwise

**Throws:** `Error` if power or channel parameters are invalid

**Power Range:**

- 0: No power output
- 1-99: Variable power levels
- 100: Maximum power output

### `pwm.beep(options, channel)`

Generates a beep sound with customizable parameters.

**Parameters:**

- `options` (object): Beep configuration parameters, optional
  - `count` (number): Number of beeps, default 1
  - `time` (number): Duration of each beep in milliseconds, default 50
  - `interval` (number): Interval between beeps in milliseconds, default 50
  - `volume` (number): Beep volume (0-100), default 50
- `channel` (number): The PWM channel to use, default 0

**Returns:** `void`

**Note:** This function returns immediately and performs beeping in the background. The PWM channel must be initialized with `pwm.init()` before using this function.

**Example:**

```javascript
// Custom beep pattern
pwm.beep({
    count: 3,      // 3 beeps
    time: 200,     // Each beep lasts 200ms
    interval: 100, // 100ms pause between beeps
    volume: 80     // 80% volume
}, 0);
```

### `pwm.pressBeep(volume, channel)`

Plays a short beep, typically used for key press feedback.

**Parameters:**

- `volume` (number): Beep volume (0-100), default 50
- `channel` (number): The PWM channel to use, default 0

**Returns:** `void`

**Configuration:** Single beep, 30ms duration

### `pwm.successBeep(volume, channel)`

Plays two short beeps, typically used to indicate successful operations.

**Parameters:**

- `volume` (number): Beep volume (0-100), default 50
- `channel` (number): The PWM channel to use, default 0

**Returns:** `void`

**Configuration:** Two beeps, 30ms duration each

### `pwm.failBeep(volume, channel)`

Plays a long beep, typically used to indicate failure or error conditions.

**Parameters:**

- `volume` (number): Beep volume (0-100), default 50
- `channel` (number): The PWM channel to use, default 0

**Returns:** `void`

**Configuration:** Single beep, 500ms duration

### `pwm.warningBeep(volume, channel)`

Plays a standard beep, typically used as a warning signal.

**Parameters:**

- `volume` (number): Beep volume (0-100), default 50
- `channel` (number): The PWM channel to use, default 0

**Returns:** `void`

**Configuration:** Single beep, 50ms duration

## 7. Constants

No specific constants are defined in this module. However, the following ranges are used:

- **Channel Range:** 0 and up (device-dependent)
- **Power Range:** 0-100 (0 = no power, 100 = maximum power)
- **Volume Range:** 0-100 (0 = no sound, 100 = maximum volume)

## 8. Related Modules

## 9. Example

None.