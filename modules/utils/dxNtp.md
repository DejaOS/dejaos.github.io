# dxNtp

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used for automatically synchronizing the device's time via NTP (Network Time Protocol). It provides features like automatic retries, timezone management, and hardware clock synchronization to ensure the device's time is accurate.

Main features include:

- Automatic time synchronization from an NTP server.
- Configurable sync intervals and failure retry intervals.
- Automatically writes the system time to the hardware clock (RTC) after a successful sync.
- Supports updating the system timezone.
- Uses a non-blocking timer mechanism that does not interfere with the main business logic.

> Note
>
> - NTP time synchronization depends on a network connection and should be started after the network is successfully connected.
> - It is recommended to start this module after the `dxNetwork` module reports a successful network connection..

## 2. Files

- dxNtp.js

## 3. Dependencies

- dxLogger (for log output)
- dxCommon (for executing system commands)

## 4. Compatible Devices

Compatible with all devices running `dejaOS v2.0+` that support networking.

## 5. Usage

### Starting and Stopping Sync

```javascript
// Start NTP sync with default settings
// Default server: '182.92.12.11', success interval: 24 hours, retry interval: 5 minutes
dxNtp.startSync();

// Start sync with custom parameters
// NTP server: 'time.nist.gov', success interval: 60 minutes, retry interval: 10 minutes
dxNtp.startSync("time.nist.gov", 60, 10);

// Stop NTP sync
dxNtp.stopSync();
```

### Querying Status

```javascript
// Get NTP sync status
let status = dxNtp.getSyncStatus();
logger.info("NTP Status:", status);

/*
Return format:
{
  "isRunning": true,          // Whether it is currently running
  "server": "182.92.12.11",   // Current NTP server address
  "interval": 1440,           // Normal sync interval (minutes)
  "retryInterval": 5,         // Failure retry interval (minutes)
  "hasTimer": true,           // Whether a timer is active
  "lastSyncTime": 1677610000000 // Timestamp of the last successful sync (milliseconds)
}
*/
```

### Timezone Management

```javascript
// Update GMT timezone, e.g., set to Beijing time (GMT+8). The valid range is 0-24.
// Note: The device must be rebooted for the change to take effect.
dxNtp.updateGmt(8);
```

### Deprecated Methods

The `dxNtp.loop()` and `dxNtp.beforeLoop()` methods are deprecated. Please use `dxNtp.startSync()` instead, which provides a more complete automatic management mechanism.

## 6. Multi-threading Support

- **Multi-threading is not supported**. All methods, including `startSync`, `stopSync`, `getSyncStatus`, and `updateGmt`, must be called from the same thread. The internal state of this module is not thread-safe.

## 7. Related Modules

This module is fundamental for system time management and is typically used in conjunction with the network module:

- dxNetwork: It is recommended to start this module after the `dxNetwork` module reports a successful network connection.

## 8. Examples

None
