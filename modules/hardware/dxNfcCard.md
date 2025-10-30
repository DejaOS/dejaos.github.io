# dxNfcCard

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used for interacting with NFC (Near Field Communication) cards. It provides a comprehensive singleton interface for detecting, reading, and writing various NFC card types.

Key Features:

- **Multi-Card Support**: Handles various basic NFC card types, including M1, CPU, and NTAG cards.
- **eID Functionality**: Integrates functionality for reading Chinese 2nd Generation ID cards (eID). **Note**: This feature requires a network connection.
- **Event-Driven**: Uses an asynchronous, event-driven model to handle card detection.
- **Configuration**: Allows for detailed configuration of the underlying NFC hardware parameters.

## 2. Files

- `dxNfcCard.js`
- `libvbar-m-dxnfccard.so`

> Ensure these two files are included in the `dxmodules` subdirectory under your project root directory.

## 3. Dependencies

- `dxLogger` (for logging, optional)

## 4. Compatible Devices

Compatible with all devices running dejaOS 2.0+ that are equipped with NFC hardware.

## 5. Usage

### Basic Usage (Standard NFC Cards)

```javascript
import { dxNfcCard } from "./dxmodules/dxNfcCard.js";
import logger from "./dxmodules/dxLogger.js";

// 1. Initialize the module
dxNfcCard.init();

// 2. Set callbacks for card detection
dxNfcCard.setCallbacks({
  onCardDetected: (cardInfo) => {
    logger.info("NFC Card Detected:", cardInfo);
    // cardInfo contains { card_type, id, id_len, type, sak, ... }
  },
});

// 3. Poll for events in a timer
setInterval(() => {
  try {
    dxNfcCard.loop();
  } catch (e) {
    logger.error("Error in NFC loop:", e);
  }
}, 100); // Process events every 100ms
```

### eID (ID Card) Reading Usage

```javascript
import { dxNfcCard } from "./dxmodules/dxNfcCard.js";
import logger from "./dxmodules/dxLogger.js";

// 1. Initialize the module
dxNfcCard.init();

// 2. Initialize eID functionality with your credentials
dxNfcCard.eidInit({
  config: {
    appid: "your_app_id",
    sn: "your_device_sn",
    device_model: "your_device_model",
  },
});

// 3. Set callbacks for both standard cards and eID
dxNfcCard.setCallbacks({
  onCardDetected: (cardInfo) => {
    logger.info("NFC Card:", cardInfo);
  },
  onEidDetected: (eidInfo) => {
    logger.info("eID Card Detected:", eidInfo);
    // eidInfo contains { name, sex, idCardNo, address, picture, ... }
  },
});

// 4. Poll for events in a timer
setInterval(dxNfcCard.loop, 100);
```

## 6. API Reference

### Core Lifecycle

#### `dxNfcCard.init()`

Initializes the NFC module. Must be called before any other operations.
**Returns**: `void`

#### `dxNfcCard.deinit()`

Deinitializes the NFC module and releases all resources.
**Returns**: `void`

#### `dxNfcCard.loop()`

Processes events from the NFC event queue. Should be called periodically (e.g., in `setInterval`). This function triggers the `onCardDetected` and `onEidDetected` callbacks.
**Returns**: `void`

### Callbacks

#### `dxNfcCard.setCallbacks(callbacks)`

Sets callback handlers for NFC events.

- `callbacks` (Object): An object containing the callback functions.
  - `onCardDetected` (Function): Called when a standard NFC card is detected. Receives a `CardInfo` object as an argument.
  - `onEidDetected` (Function): Called when an eID (ID card) is successfully read. Receives an `EidInfo` object as an argument.

**`CardInfo` Object Structure:**

- `card_type` (Number): The type of the card (see `dxNfcCard.CARD_TYPE`).
- `id` (String): The card's unique identifier as a hex string.
- `id_len` (Number): The length of the card's ID in bytes.
- `type` (Number): Detailed card type.
- `sak` (Number): SAK value (Select Acknowledge).
- `timestamp` (Number): The system timestamp of the event.
- `monotonic_timestamp` (Number): The monotonic timestamp of the event.

**`EidInfo` Object Structure:**

- `name` (String): Full name.
- `sex` (String): Sex / Gender.
- `nation` (String): Ethnic group.
- `birthday` (String): Date of birth (Format: YYYYMMDD).
- `address` (String): Residential address.
- `idCardNo` (String): Citizen identification number.
- `grantDept` (String): Issuing authority.
- `userLifeBegin` (String): Valid from date (Format: YYYYMMDD).
- `userLifeEnd` (String): Valid until date (Format: YYYYMMDD or "长期" for long-term).
- `picture` (String): Base64 encoded string of the ID photo.

### Configuration

#### `dxNfcCard.getConfig()`

Retrieves the current NFC hardware configuration.
**Returns**: `Object` - The current configuration object.

#### `dxNfcCard.updateConfig(config)`

Updates the NFC configuration. Use default values unless you have special requirements.

- `config` (Object): A configuration object with properties to update.
  **Returns**: `void`

### General Card Operations

#### `dxNfcCard.isCardIn()`

Checks if a card is currently present in the NFC field.
**Returns**: `boolean` - `true` if a card is present, `false` otherwise.

#### `dxNfcCard.iso14443Apdu(command, [taskFlag=0])`

Sends an ISO14443-A APDU command to the card.

- `command` (ArrayBuffer): The APDU command to send.
- `taskFlag` (Number, Optional): Optional task flag for card selection.
  **Returns**: `ArrayBuffer` - An ArrayBuffer containing the APDU response from the card.

### M1 Card Operations

#### `dxNfcCard.m1ReadBlock(blockNumber, key, keyType, [taskFlag=0])`

Reads a 16-byte block from an M1 card.

- `blockNumber` (Number): The block number to read.
- `key` (ArrayBuffer): A 6-byte ArrayBuffer for the key (A or B).
- `keyType` (Number): `0x60` for Key A, `0x61` for Key B.
  **Returns**: `ArrayBuffer` - A 16-byte ArrayBuffer with the block data.

#### `dxNfcCard.m1WriteBlock(blockNumber, data, key, keyType, [taskFlag=0])`

Writes a 16-byte block to an M1 card.

- `blockNumber` (Number): The block number to write.
- `data` (ArrayBuffer): A 16-byte ArrayBuffer of data to write.
- `key` (ArrayBuffer): A 6-byte ArrayBuffer for the key (A or B).
- `keyType` (Number): `0x60` for Key A, `0x61` for Key B.
  **Returns**: `Number` - `0` on success.

### NTAG Card Operations

#### `dxNfcCard.ntagReadPage(pageNum)`

Reads 4 pages (16 bytes) from an NTAG card.

- `pageNum` (Number): The starting page number to read from.
  **Returns**: `ArrayBuffer` - A 16-byte ArrayBuffer with the data.

#### `dxNfcCard.ntagWritePage(pageNum, data)`

Writes one page (4 bytes) to an NTAG card.

- `pageNum` (Number): The page number to write to.
- `data` (ArrayBuffer): A 4-byte ArrayBuffer of data to write.
  **Returns**: `void`

### eID (ID Card) Operations

#### `dxNfcCard.eidInit(options)`

Initializes the eID (electronic ID) reading functionality. Requires an active network connection.

- `options` (Object): Configuration for the eID service.
  - `ip` (String, Optional): The eID server IP address. Defaults to `"deviceid.dxiot.com"`.
  - `port` (Number, Optional): The eID server port. Defaults to `9889`.
  - `config` (Object): **Required**. Advanced parameters. - `appid` (String): **Required**. App ID assigned by the platform. - `sn` (String): **Required**. Device serial number. - `device_model` (String): **Required**. Device model. - `...` (other optional fields)
    **Returns**: `void`
    **Throws**: `Error` if required config properties are missing.

#### `dxNfcCard.eidActive(options)`

Activates the eID module using an activation code. This is typically done once. Requires an active network connection.

- `options` (Object): Activation options.
  - `codeMsg` (String): **Required**. The activation code message.
  - `sn` (String): **Required**. Device Serial Number.
  - `version` (String): **Required**. Firmware version.
  - `macAddr` (String): **Required**. Device MAC address.
    **Returns**: `Number` - `0` on success, negative value on failure.
    **Throws**: `Error` if required options are missing.

#### `dxNfcCard.eidDeinit()`

Deinitializes the eID functionality.
**Returns**: `void`

## 7. Card Type Constants

The `onCardDetected` callback returns a `card_type` field. You can compare it with the constants in `dxNfcCard.CARD_TYPE`.

```javascript
import { dxNfcCard } from "./dxmodules/dxNfcCard.js";

// Example:
if (cardInfo.card_type === dxNfcCard.CARD_TYPE.MIFARE_CLASSIC_1K_4B) {
  logger.info("Mifare Classic 1K card detected!");
}
```

- `TYPE_A`: 64
- `MIFARE_ULTRALIGHT`: 65
- `MIFARE_CLASSIC_1K_4B`: 66
- `MIFARE_CLASSIC_4K`: 67
- `CPU_A`: 68
- `MIFARE_DESFIRE`: 69
- `IDENTITY_CARD`: 70
- `ISO15693`: 71
- `TYPE_B`: 74
- `CPU_B`: 75
- `M1`: 76
- `FELICA`: 77
- `MIFARE_PLUS`: 78
- `IDCARD`: 97
- `NOT_SUPPORT`: 127

## 8. Related Modules

- **dxNfc:** Deprecated,replaced by dxNfcCard
- **dxEid:** Deprecated,replaced by dxNfcCard