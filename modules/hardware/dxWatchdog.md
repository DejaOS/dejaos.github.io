# dxWatchdog

## 1. Overview

This module is part of the official [dejaOS](https://github.com/DejaOS/DejaOS) system module library. It wraps the native watchdog C library and provides a handle-based interface for **software and hardware watchdog** operations.

**What it does:** A watchdog timer resets the system if the application stops feeding it within the configured timeout. This helps recover from hangs, deadlocks, or runaway logic in production deployments.

**Typical usage:**

- Call `watchdog.init()` once at startup.
- Set a global timeout with `watchdog.start(timeout_ms)`.
- Enable one or more channels with `watchdog.enable(chan, true)`.
- Call `watchdog.restart(chan)` periodically from your main loop or a timer (for example every 5 seconds).
- Call `watchdog.stop()` and `watchdog.deinit()` when shutting down cleanly.

The module is designed for multi-threaded environments; different watchdog channels can be operated in parallel.

## 2. Files

- dxWatchdog.js
- libvbar-m-dxwatchdog.so

> Ensure these files are placed under the `dxmodules` subdirectory in your project root.

## 3. Dependencies

- None

## 4. Compatible Devices

Compatible with dejaOS v2.0+ devices that expose watchdog hardware or software watchdog support. Timeout behavior and channel count may vary by device—confirm against your product documentation.

## 5. Usage

### Basic usage

```javascript
import watchdog from "./dxmodules/dxWatchdog.js";
import logger from "./dxmodules/dxLogger.js";
import std from "./dxmodules/dxStd.js";

try {
  watchdog.init();
} catch (e) {
  logger.error("Failed to init watchdog:", e);
}

try {
  const started = watchdog.start(5000);
  logger.info("Watchdog started:", started);

  const isPoweron = watchdog.isPoweron();
  logger.info("Watchdog is poweron:", isPoweron);

  const enabled = watchdog.enable(0, true);
  logger.info("Channel enabled:", enabled);

  const restarted = watchdog.restart(0);
  logger.info("Watchdog restarted:", restarted);

  std.setInterval(() => {
    watchdog.restart(0);
  }, 5000);
} catch (e) {
  logger.error("Watchdog operation failed:", e);
}

// When shutting down cleanly
watchdog.stop();
watchdog.deinit();
```

### Production pattern

In production apps, keep feeding the watchdog from a stable code path (main loop or dedicated timer). If debugging causes frequent restarts, temporarily disable watchdog logic in sample code—see [FAQ](/docs/faq/devfaq).

## 6. API Reference

### `watchdog.TYPE`

Read-only enum for watchdog type:

| Constant | Value | Description |
| :--- | :--- | :--- |
| `SOFTWARE` | `1` | Software watchdog |
| `HARDWARE` | `2` | Hardware watchdog |

### `watchdog.init()`

Initialize the watchdog device.

**Returns:** none

**Throws:** `Error` if initialization fails.

### `watchdog.deinit()`

Release the watchdog device.

**Returns:** `boolean` — `true` on success

### `watchdog.isPoweron()`

Check whether the watchdog device is powered on.

**Returns:** `boolean`

### `watchdog.start(timeout_ms)`

Start the watchdog timer.

**Parameters:**

- `timeout_ms` (number): Timeout in milliseconds, must be greater than 0, required

**Returns:** `boolean` — `true` on success, `false` on failure

**Throws:** `Error` if `timeout_ms` is missing or not greater than 0

### `watchdog.stop()`

Stop the watchdog timer.

**Returns:** none

### `watchdog.enable(chan, toset)`

Enable or disable a watchdog channel.

**Parameters:**

- `chan` (number): Channel number, default `0`
- `toset` (boolean): `true` to enable, `false` to disable, default `true`

**Returns:** `boolean`

**Throws:** `Error` if `chan` is missing

### `watchdog.restart(chan)`

Feed the watchdog (restart the timer) for a specific channel.

**Parameters:**

- `chan` (number): Channel number, default `0`

**Returns:** `boolean`

**Throws:** `Error` if `chan` is missing

## 7. Related Modules

- **dxStd:** Timers (`setInterval`) for periodic `restart()` calls
- **dxLogger:** Log watchdog init and feed failures during debugging

## 8. Examples

None.
