# dxOta

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used for Over-The-Air (OTA) upgrade functionality.
It provides comprehensive upgrade capabilities for dejaOS applications:

- HTTP online upgrade from remote servers
- Local file upgrade from local storage
- Automatic MD5 integrity verification
- Pre-upgrade disk space validation
- Automatic device reboot after upgrade
- Support for .dpk package format (zip-based)

## 2. Files

- dxOta.js

> - Ensure this file is included in the dxmodules subdirectory under your project root directory

## 3. Dependencies

- dxLogger
- dxCommon
- dxHttpClient
- os (built-in module)

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+. Device must have sufficient storage space for upgrade packages.

## 5. Usage

### Basic Usage

```javascript
import ota from "./dxmodules/dxOta.js";

// HTTP upgrade example
try {
  // Download and upgrade from HTTP URL
  ota.updateHttp(
    "https://example.com/upgrade.dpk",
    "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    120, // 2 minutes timeout
    1024 // 1MB package size for disk space check
  );

  // Reboot device to apply upgrade
  ota.reboot();
} catch (error) {
  console.error("Upgrade failed:", error.message);
}

// Local file upgrade example
try {
  // Upgrade from local file
  ota.updateFile(
    "/app/code/upgrade.dpk",
    "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    2048 // 2MB package size for disk space check
  );

  // Reboot device to apply upgrade
  ota.reboot();
} catch (error) {
  console.error("Upgrade failed:", error.message);
}
```

## 6. API Reference

### `ota.updateHttp(url, md5, timeout, size, httpOpts)`

Downloads and prepares an upgrade package from an HTTP URL. This function handles the complete upgrade process including download, verification, and preparation.

**Parameters:**

- `url` (string, required): HTTP URL for downloading the upgrade package
- `md5` (string, required): MD5 hash for integrity verification (32-character lowercase hexadecimal)
- `timeout` (number, optional): Download timeout in seconds (default: 60)
- `size` (number, optional): Package size in KB for disk space validation
- `httpOpts` (object, optional): Additional HTTP request options passed to dxHttpClient

**Returns:** `void`

**Throws:** `Error` if:

- URL or MD5 parameters are missing
- Size parameter is not a number
- Insufficient disk space
- Download fails
- MD5 verification fails

**Process Flow:**

1. **Disk Space Check**: Validates available storage (requires 3x package size)
2. **Cleanup**: Removes existing upgrade files
3. **Download**: Downloads package to temporary location
4. **Verification**: Validates file existence and MD5 checksum
5. **Preparation**: Moves verified package to upgrade directory

**Example:**

```javascript
ota.updateHttp(
  "https://server.com/app_v2.0.dpk",
  "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  180, // 3 minutes timeout
  512 // 512KB package
);
```
> - 假如需要从https下载文件，需要增加httpOpts的参数，具体参考 [dxHttpClient](/modules/network/dxHttpClient).

### `ota.updateFile(path, md5, size)`

Upgrades from a local file that has already been downloaded or placed on the device. Use this when you've already obtained the upgrade package through custom methods.

**Parameters:**

- `path` (string, required): Path to the upgrade package file
- `md5` (string, required): MD5 hash for integrity verification (32-character lowercase hexadecimal)
- `size` (number, optional): Package size in KB for disk space validation

**Returns:** `void`

**Throws:** `Error` if:

- Path or MD5 parameters are missing
- Size parameter is not a number
- File not found at specified path
- Insufficient disk space
- MD5 verification fails

**Process Flow:**

1. **File Check**: Verifies file exists at specified path
2. **Disk Space Check**: Validates available storage (requires 3x package size)
3. **Verification**: Validates MD5 checksum
4. **Preparation**: Moves verified package to upgrade directory

**Example:**

```javascript
ota.updateFile(
  "/app/code/upgrade.dpk",
  "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  1024 // 1MB package
);
```

### `ota.reboot()`

Triggers a device reboot to apply the upgrade. This function should be called after a successful upgrade operation.

**Parameters:** None

**Returns:** `void`

**Note:** This function initiates an asynchronous reboot with a 2-second delay to ensure all operations complete.

**Example:**

```javascript
// Check if message is an upgrade command
if (msg.topic == 'upgrade_demo/v1/cmd/' + sn + '/upgrade') {
    log.info('upgrade cmd received')
    let payload = JSON.parse(msg.payload)
    log.info('upgrade url:', payload.url)
    log.info('upgrade md5:', payload.md5)

    // Perform OTA update with provided URL and MD5 hash
    ota.updateHttp(payload.url, payload.md5)
    mqtt.send('upgrade_demo/v1/cmd/upgrade_reply', JSON.stringify({ uuid: sn, timestamp: timestamp() }), options.id)
    ota.reboot()
}
```
[Source Code](https://github.com/DejaOS/DejaOS/blob/main/demos/dw200_v10/dw200_mqtt_upgrade/client/src/mqttworker.js)

