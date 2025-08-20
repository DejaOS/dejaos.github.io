# dxOs

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), providing essential functions for interacting with the underlying operating system and hardware. It is designed to be the primary interface for system-level information and control.

It includes a range of core features:
- **System Information**: Access uptime, total/free memory, total/free disk space, CPU ID, device UUID, and serial number.
- **Shell Commands**: Execute shell commands, with options for blocking/non-blocking execution and capturing output.
- **Device Management**: Control device state, including setting the operational mode and rebooting.
- **Synchronization**: A simple mechanism (`dxOs.sync`) for coordinating asynchronous operations.

## 2. Files

- `dxOs.js`
- `libvbar-m-dxos.so`

> - Ensure these 2 files are included in the dxmodules subdirectory under your project root directory.

## 3. Dependencies

- `dxMap.js` (used by the `dxOs.sync` feature)

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+.

## 5. Usage

### Basic Usage

```javascript
import dxOs from "./dxmodules/dxOs.js";
import log from "./dxmodules/dxLogger.js";

// 1. Get system information
const uptime = dxOs.getUptime();
log.info('System Uptime (s):', uptime);

const cpuId = dxOs.getCpuid();
log.info('CPU ID:', cpuId);

// 2. Execute a shell command
const result = dxOs.systemWithRes("ls -l /", 256);
log.info('Result of "ls -l /":', result);

// 3. Get current device mode
const currentMode = dxOs.getMode();
log.info('Current device mode:', currentMode); // e.g., "prod", "dev", or null
```

## 6. API Reference

### `dxOs.getUptime()`
Get the running time of system startup.
- **Returns:** `number` - Running time in seconds.

### `dxOs.getTotalmem()`
Get the total memory of the system.
- **Returns:** `number` - Total memory in bytes.

### `dxOs.getFreemem()`
Retrieve the remaining memory of the system.
- **Returns:** `number` - Remaining memory in bytes.

### `dxOs.getTotaldisk(path)`
Get the total disk space of a partition.
- **Parameters:**
  - `path` (string): The disk partition name (e.g., "/"). (optional, defaults to "/")
- **Returns:** `number` - Total disk space in bytes.

### `dxOs.getFreedisk(path)`
Retrieve the remaining available disk space of a partition.
- **Parameters:**
  - `path` (string): The disk partition name (e.g., "/"). (optional, defaults to "/")
- **Returns:** `number` - Free disk space in bytes.

### `dxOs.getCpuid()`
Get the CPU ID.
- **Returns:** `string` - The CPU ID.

### `dxOs.getUuid()`
Get the device's unique identifier (UUID).
- **Returns:** `string` - The device UUID.

### `dxOs.getSn()`
Get the device's serial number (SN). It first tries to read from the SN file; if that fails, it falls back to the device UUID.
- **Returns:** `string` - The device's serial number.

### `dxOs.getUuid2mac()`
Obtain the MAC address calculated from the UUID.
- **Returns:** `string` - MAC address in the format `b2:a1:63:3f:99:b6`.

### `dxOs.getFreecpu()`
Get the current CPU usage rate.
- **Returns:** `number` - A number not greater than 100.

### `dxOs.system(cmd)`
Execute a shell command without printing the result to the terminal.
- **Parameters:**
  - `cmd` (string): The command to execute. (required)
- **Returns:** `number` - The exit code of the command.

### `dxOs.systemBrief(cmd)`
Execute a shell command and print the result to the terminal.
- **Parameters:**
  - `cmd` (string): The command to execute. (required)
- **Returns:** `number` - The exit code of the command.

### `dxOs.systemWithRes(cmd, resLen)`
Execute a shell command and return the result as a string.
- **Parameters:**
  - `cmd` (string): The command to execute. (required)
  - `resLen` (number): The maximum length of the result to receive. (required)
- **Returns:** `string` - The command's stdout result.

### `dxOs.systemBlocked(cmd)`
Execute a shell command and wait for it to complete (blocking).
- **Parameters:**
  - `cmd` (string): The command to execute. (required)
- **Returns:** `number` - The exit code of the command.

### `dxOs.asyncReboot(delay_s)`
Asynchronously restart the device after a delay.
- **Parameters:**
  - `delay_s` (number): The delay in seconds before restarting. (required)
- **Returns:** `number` - The result of the operation.

### `dxOs.setMode(mode)`
Switch the device's operational mode. The device will restart after switching. If the device is already in the target mode, it will do nothing and return `true`.
- **Parameters:**
  - `mode` (string): The target mode. Must be one of `"dev"`, `"test"`, `"prod"`, `"safe"`. (required)
- **Returns:** `boolean` - `true` if the mode switch was initiated or if the device was already in the target mode, `false` otherwise.

### `dxOs.getMode()`
Query the current device mode.
- **Returns:** `string | null`
  - `string`: The current mode name (e.g., "dev", "prod").
  - `null`: If the mode file is not found or is empty.

### Sync Namespace (`dxOs.sync`)
Provides a simple mechanism for synchronous-like communication between asynchronous parts of an application.

#### `sync.request(topic, timeout)`
Waits for a response on a specific topic.
- **Parameters:**
  - `topic` (string): The topic to wait for. (required)
  - `timeout` (number): Timeout in milliseconds. (required)
- **Returns:** `*` - The data received on the topic, or `undefined` if it times out.

#### `sync.response(topic, data)`
Sends a response to a specific topic.
- **Parameters:**
  - `topic` (string): The topic to respond to. (required)
  - `data` (*): The data to send. (required)


## 7. Related Modules

- **dxCommon:** Deprecated. Replaced by dxOs and dxCommonUtils.

## 8. Example

```javascript
import log from "../dxmodules/dxLogger.js"
import dxOs from "../../js/dxOs.js";

function assert(actual, expected, message) {
  if (arguments.length == 1) {
    expected = true;
  }
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    log.info(`[PASS] ${message}`);
    return;
  } else {
    log.error(`[FAIL] ${message}`);
    throw Error(`Assertion failed: got |${a}|, expected |${e}|`);
  }
}

log.info("--- Starting dxOs example ---");

// --- System Information ---
log.info("--- Testing System Information ---");
let time = dxOs.getUptime();
log.info("System running time:", time)
assert(typeof time, 'number', 'getUptime should return a number');

let totalmem = dxOs.getTotalmem();
log.info("Total memory of the system:", totalmem)
assert(typeof totalmem, 'number', 'getTotalmem should return a number');

let sn = dxOs.getSn()
log.info("SN:", sn)
assert(typeof sn, 'string', 'getSn should return a string');

// --- Shell Commands ---
log.info("--- Testing Shell Commands ---");
const PWD_RESULT = dxOs.systemWithRes("pwd", 128)
log.info("systemWithRes('pwd') result:", PWD_RESULT);
assert(PWD_RESULT.includes('/'), true, "systemWithRes('pwd') should contain '/'");

let exitCode = dxOs.system("ls /")
log.info("system('ls /') exit code:", exitCode)
assert(exitCode, 0, "system('ls /') should return exit code 0");

// --- Mode Management ---
log.info("--- Testing Mode Management ---");
let mode = dxOs.getMode()
log.info("Current mode:", mode)
assert(typeof mode === 'string' || mode === null, true, "getMode should return a string or null");

/*
// --- setMode Example ---
// The following will change the device's mode and trigger a reboot.
// Uncomment it only when you want to explicitly test this functionality.

log.info("Attempting to set mode to 'test'...");
const setResult = dxOs.setMode('test');
log.info("dxOs.setMode('test') returned:", setResult, "(Device should reboot shortly)");
assert(setResult, true, "setMode('test') should return true");
*/

log.info("--- dxOs example completed successfully ---");
```
