# dxFingerMz Fingerprint Recognition Module Documentation

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
  - [Initialization](#initialization)
  - [Image Capture](#image-capture)
  - [Feature Generation](#feature-generation)
  - [Fingerprint Matching](#fingerprint-matching)
  - [Fingerprint Registration](#fingerprint-registration)
  - [Template Storage Management](#template-storage-management)
  - [System Functions](#system-functions)
  - [Other Functions](#other-functions)
- [Return Code Reference](#return-code-reference)
- [Usage Examples](#usage-examples)

---

## Overview

`dxFingerMz` is a JavaScript interface library for communicating with MZ fingerprint recognition modules. This module communicates with fingerprint recognition hardware via UART serial port, supporting complete functionality including fingerprint image capture, feature extraction, template generation, fingerprint matching, and storage management.

### Communication Method
- **Interface Type**: UART serial communication
- **Default Baud Rate**: 57600-8-N-2
- **Default Device Path**: `/dev/ttySLB0`
- **Default Timeout**: 500ms

---

## Features

### Core Features
- **Image Capture**: Supports fingerprint image capture in both verification and enrollment modes
- **Feature Extraction**: Generates feature files from fingerprint images
- **Fingerprint Matching**: 
  - One-to-one matching (1:1)
  - One-to-many search (1:N)
- **Fingerprint Registration**: Supports both manual and automatic registration methods
- **Storage Management**: Complete template storage, loading, deletion, and clearing functionality
- **System Configuration**: Read system parameters and configure module parameters

### Advanced Features
- **Auto Registration**: One-click complete fingerprint registration process including capture, feature generation, template merging, and storage
- **Auto Identification**: Automatically completes image capture, feature extraction, and library search
- **Template Transfer**: Supports template upload and download for backup and migration
- **Index Management**: Supports reading index tables for quick query of registered templates

---

## Quick Start

### Import Module
```javascript
import dxFingerMz from './dxFingerMz.js';
```

### Initialization
```javascript
dxFingerMz.init({
    id: 'fingerUart',           // Connection ID
    path: '/dev/ttySLB0',       // UART device path
    baudrate: '57600-8-N-2',    // Baud rate configuration
    timeout: 500,                // Timeout (ms)
    total: 5000,                 // Total fingerprint library capacity
    type: '3'                    // UART type
});
```

### Basic Usage Example
```javascript
// 1. Capture fingerprint image
const result = dxFingerMz.getImage();
if (result === 0) {
    console.log('Fingerprint image captured successfully');
}

// 2. Generate feature file
const genResult = dxFingerMz.genChar(1);
if (genResult === 0) {
    console.log('Feature file generated successfully');
}

// 3. Search fingerprint library
const searchResult = dxFingerMz.search(1, 0, 100);
if (searchResult && searchResult.code === 0) {
    console.log(`Match found, index: ${searchResult.pageIndex}, score: ${searchResult.score}`);
}
```

---

## API Documentation

### Initialization

#### `init(params)`
Initialize the fingerprint recognition module and configure UART connection parameters.

**Parameters:**
- `params` <code>&#123;Object&#125;</code> - Initialization parameters object
  - `id` <code>&#123;string&#125;</code> [Optional] - Connection ID, default: `'fingerUart'`
  - `path` <code>&#123;string&#125;</code> [Optional] - UART device path, default: `'/dev/ttySLB0'`
  - `baudrate` <code>&#123;string&#125;</code> [Optional] - Baud rate configuration, default: `'57600-8-N-2'`
  - `timeout` <code>&#123;number&#125;</code> [Optional] - Timeout (milliseconds), default: `500`
  - `total` <code>&#123;number&#125;</code> [Optional] - Total fingerprint library capacity, default: `5000`
  - `type` <code>&#123;string&#125;</code> [Optional] - UART type, default: `'3'`

**Returns:**
- No return value

**Example:**
```javascript
dxFingerMz.init({
    id: 'fingerUart',
    path: '/dev/ttySLB0',
    baudrate: '57600-8-N-2'
});
```

---

### Image Capture

#### `getImage()`
Detect finger and capture fingerprint image (for verification mode). Stores the fingerprint image in the image buffer.

**Parameters:**
- None

**Returns:**
- <code>&#123;number&#125;</code> - Confirmation code
  - `0`: Success
  - Other values: Failure (refer to return code reference for specific error codes)
  - `-1`: Communication failure or timeout

**Example:**
```javascript
const result = dxFingerMz.getImage();
if (result === 0) {
    console.log('Fingerprint image captured successfully');
} else {
    console.log('Fingerprint image capture failed, error code:', result);
}
```

#### `getEnrollImage()`
Detect finger and capture fingerprint image (for enrollment mode). Stores the fingerprint image in the image buffer.

**Parameters:**
- None

**Returns:**
- <code>&#123;number&#125;</code> - Confirmation code
  - `0`: Success
  - Other values: Failure
  - `-1`: Communication failure or timeout

**Example:**
```javascript
const result = dxFingerMz.getEnrollImage();
if (result === 0) {
    console.log('Enrollment fingerprint image captured successfully');
}
```

---

### Feature Generation

#### `genChar(bufferId)`
Generate a feature file from the fingerprint image in the image buffer and store it in the character buffer.

**Parameters:**
- `bufferId` <code>&#123;number&#125;</code> - Buffer ID, valid values: `1` or `2`

**Returns:**
- <code>&#123;number&#125;</code> - Confirmation code
  - `0`: Success
  - Other values: Failure
  - `-1`: Communication failure or timeout

**Example:**
```javascript
// Generate feature file to buffer 1
const result = dxFingerMz.genChar(1);
if (result === 0) {
    console.log('Feature file generated successfully');
}
```

---

### Fingerprint Matching

#### `match()`
Precise match. Compares feature files or templates in the buffer.

**Parameters:**
- None

**Returns:**
- <code>&#123;Object|null&#125;</code> - Match result object, returns `null` on failure
  - `code` <code>&#123;number&#125;</code> - Confirmation code, `0` indicates success
  - `score` <code>&#123;number&#125;</code> - Match score (higher value indicates better match)

**Example:**
```javascript
const result = dxFingerMz.match();
if (result && result.code === 0) {
    console.log(`Match successful, score: ${result.score}`);
} else {
    console.log('Match failed');
}
```

#### `search(bufferId, startPage, pageNum)`
Search fingerprint library. Uses the feature file in the buffer to search the fingerprint library (supports full library or partial range search).

**Parameters:**
- `bufferId` <code>&#123;number&#125;</code> - Character buffer ID, default uses `1`
- `startPage` <code>&#123;number&#125;</code> - Start page index
- `pageNum` <code>&#123;number&#125;</code> - Number of pages to search

**Returns:**
- <code>&#123;Object|null&#125;</code> - Search result object, returns `null` on failure
  - `code` <code>&#123;number&#125;</code> - Confirmation code, `0` indicates match found
  - `pageIndex` <code>&#123;number&#125;</code> - Found page index
  - `score` <code>&#123;number&#125;</code> - Match score

**Example:**
```javascript
// Search in index range 0-99
const result = dxFingerMz.search(1, 0, 100);
if (result && result.code === 0) {
    console.log(`Match found, index: ${result.pageIndex}, score: ${result.score}`);
} else {
    console.log('No match found');
}
```

#### `searchNow(startPage, pageNum)`
Search the library using the most recently extracted feature.

**Parameters:**
- `startPage` <code>&#123;number&#125;</code> - Start page index
- `pageNum` <code>&#123;number&#125;</code> - Number of pages to search

**Returns:**
- <code>&#123;Object|null&#125;</code> - Search result object, returns `null` on failure
  - `code` <code>&#123;number&#125;</code> - Confirmation code, `0` indicates match found
  - `pageIndex` <code>&#123;number&#125;</code> - Found page index
  - `score` <code>&#123;number&#125;</code> - Match score

**Example:**
```javascript
const result = dxFingerMz.searchNow(0, 100);
if (result && result.code === 0) {
    console.log(`Match found, index: ${result.pageIndex}`);
}
```

---

### Fingerprint Registration

#### `regModel()`
Register model (combine feature files). Merges feature files to generate a template and stores it in the character buffer.

**Parameters:**
- None

**Returns:**
- <code>&#123;number&#125;</code> - Confirmation code
  - `0`: Success
  - Other values: Failure
  - `-1`: Communication failure or timeout

**Notes:**
- This function requires feature files to be generated in buffer 1 and buffer 2 first
- Typically used in manual registration flow: capture fingerprint image twice, generate feature files separately, then merge

**Example:**
```javascript
// Manual registration flow example
// 1. First capture
dxFingerMz.getEnrollImage();
dxFingerMz.genChar(1);

// 2. Second capture
dxFingerMz.getEnrollImage();
dxFingerMz.genChar(2);

// 3. Merge feature files to generate template
const result = dxFingerMz.regModel();
if (result === 0) {
    console.log('Template generated successfully');
}
```

#### `autoRegister(pageIndex, count, timeout, config)`
Auto registration. One-click complete fingerprint registration process including image capture, feature generation, template merging, and storage.

**Parameters:**
- `pageIndex` <code>&#123;number&#125;</code> - Storage page index
- `count` <code>&#123;number&#125;</code> - Number of finger presses required (typically 2-3 times)
- `timeout` <code>&#123;number&#125;</code> [Optional] - Timeout (seconds), default: `60`
- `config` <code>&#123;number&#125;</code> [Optional] - Configuration flags, default: `0`

**Returns:**
- <code>&#123;ArrayBuffer|null&#125;</code> - Result data, returns `null` on failure or timeout

**Notes:**
- This function automatically handles multiple presses, feature merging, duplicate checking, and other processes
- Each press generates multiple responses (status, merge result, duplicate check, store result)

**Example:**
```javascript
// Auto register, requires 2 presses, store to index 10
const result = dxFingerMz.autoRegister(10, 2, 60, 0);
if (result) {
    console.log('Auto registration successful');
} else {
    console.log('Auto registration failed or timed out');
}
```

---

### Template Storage Management

#### `storeChar(bufferId, pageIndex)`
Store template. Stores the template file from the buffer to the flash database at the specified page index.

**Parameters:**
- `bufferId` <code>&#123;number&#125;</code> - Character buffer ID, default uses `1`
- `pageIndex` <code>&#123;number&#125;</code> - Fingerprint library location index

**Returns:**
- <code>&#123;number&#125;</code> - Confirmation code
  - `0`: Success
  - Other values: Failure
  - `-1`: Communication failure or timeout

**Example:**
```javascript
// Store template from buffer 1 to index 5
const result = dxFingerMz.storeChar(1, 5);
if (result === 0) {
    console.log('Template stored successfully');
}
```

#### `loadChar(bufferId, pageIndex)`
Load template. Reads the fingerprint template from the flash database at the specified page index into the buffer.

**Parameters:**
- `bufferId` <code>&#123;number&#125;</code> - Character buffer ID, default uses `2`
- `pageIndex` `{number}` - Fingerprint library location index

**Returns:**
- <code>&#123;number&#125;</code> - Confirmation code
  - `0`: Success
  - Other values: Failure
  - `-1`: Communication failure or timeout

**Example:**
```javascript
// Load template from index 5 to buffer 2
const result = dxFingerMz.loadChar(2, 5);
if (result === 0) {
    console.log('Template loaded successfully');
}
```

#### `upChar(bufferId)`
Upload template. Uploads the template file from the buffer to the host.

**Parameters:**
- `bufferId` <code>&#123;number&#125;</code> - Character buffer ID, default uses `2`

**Returns:**
- <code>&#123;ArrayBuffer|null&#125;</code> - Template data, returns `null` on failure

**Example:**
```javascript
// Upload template from buffer 2
const templateData = dxFingerMz.upChar(2);
if (templateData) {
    console.log('Template uploaded successfully, data length:', templateData.byteLength);
    // Can save to file or database
}
```

#### `downChar(bufferId, char)`
Download template. Downloads a template from the host to the module's buffer.

**Parameters:**
- `bufferId` `{number}` - Character buffer ID, default uses `1`
- `char` <code>&#123;ArrayBuffer&#125;</code> - Template data

**Returns:**
- <code>&#123;number&#125;</code> - Confirmation code
  - `0`: Success
  - Other values: Failure
  - `-1`: Communication failure or timeout

**Example:**
```javascript
// Read template data from file or database
const templateData = readTemplateFromFile();

// Download to buffer 1
const result = dxFingerMz.downChar(1, templateData);
if (result === 0) {
    console.log('Template downloaded successfully');
}
```

#### `deletChar(pageIndex, num)`
Delete template. Deletes N fingerprint templates starting from the specified page index in the flash database.

**Parameters:**
- `pageIndex` <code>&#123;number&#125;</code> - Starting index
- `num` <code>&#123;number&#125;</code> - Number of templates to delete

**Returns:**
- <code>&#123;number&#125;</code> - Confirmation code
  - `0`: Success
  - Other values: Failure
  - `-1`: Communication failure or timeout

**Example:**
```javascript
// Delete 3 templates starting from index 5
const result = dxFingerMz.deletChar(5, 3);
if (result === 0) {
    console.log('Templates deleted successfully');
}
```

#### `clearChar()`
Clear fingerprint library. Deletes all fingerprint templates in the flash database.

**Parameters:**
- None

**Returns:**
- <code>&#123;number&#125;</code> - Confirmation code
  - `0`: Success
  - Other values: Failure
  - `-1`: Communication failure or timeout

**Warning:**
- This operation is irreversible, use with caution

**Example:**
```javascript
const result = dxFingerMz.clearChar();
if (result === 0) {
    console.log('Fingerprint library cleared');
}
```

---

### System Functions

#### `readSysPara()`
Read system parameters. Reads the module's basic parameters (baud rate, packet size, etc.).

**Parameters:**
- None

**Returns:**
- <code>&#123;Object|null&#125;</code> - System parameters object, returns `null` on failure
  - `code` <code>&#123;number&#125;</code> - Confirmation code, `0` indicates success
  - `data` <code>&#123;Uint8Array&#125;</code> - System parameters data

**Example:**
```javascript
const result = dxFingerMz.readSysPara();
if (result && result.code === 0) {
    console.log('System parameters read successfully');
    // Parse result.data to get specific parameters
}
```

#### `writeReg(regId, context)`
Write system register. Writes data to a module register.

**Parameters:**
- `regId` <code>&#123;number&#125;</code> - Register ID
- `context` <code>&#123;number&#125;</code> - Content to write

**Returns:**
- <code>&#123;number&#125;</code> - Confirmation code
  - `0`: Success
  - Other values: Failure
  - `-1`: Communication failure or timeout

**Example:**
```javascript
const result = dxFingerMz.writeReg(0x01, 0x05);
if (result === 0) {
    console.log('Register written successfully');
}
```

#### `getValidTemplateNum()`
Get valid template count. Reads the number of registered valid templates.

**Parameters:**
- None

**Returns:**
- <code>&#123;Object|null&#125;</code> - Result object, returns `null` on failure
  - `code` <code>&#123;number&#125;</code> - Confirmation code, `0` indicates success
  - `validNum` <code>&#123;number&#125;</code> - Number of valid templates

**Example:**
```javascript
const result = dxFingerMz.getValidTemplateNum();
if (result && result.code === 0) {
    console.log(`Current valid template count: ${result.validNum}`);
}
```

#### `readIndexTable(indexPage)`
Read index table. Reads the index table of registered templates.

**Parameters:**
- `indexPage` <code>&#123;number&#125;</code> - Index table page number (0, 1, 2, 3...)
  - Each page corresponds to a template range (0-255, 256-511, 512-767...)
  - Each bit represents a template: 1 means enrolled, 0 means not enrolled

**Returns:**
- <code>&#123;Object|null&#125;</code> - Result object, returns `null` on failure
  - `code` <code>&#123;number&#125;</code> - Confirmation code, `0` indicates success
  - `indexTable` <code>&#123;Uint8Array&#125;</code> - Index table data

**Example:**
```javascript
// Read index table page 0 (corresponds to indices 0-255)
const result = dxFingerMz.readIndexTable(0);
if (result && result.code === 0) {
    console.log('Index table read successfully');
    // Parse result.indexTable to determine which indices are enrolled
}
```

#### `restSetting()`
Restore factory settings. Clears internal data (if enrolled) and deletes internal keys.

**Parameters:**
- None

**Returns:**
- <code>&#123;number&#125;</code> - Confirmation code
  - `0`: Success
  - Other values: Failure
  - `-1`: Communication failure or timeout

**Warning:**
- This operation will clear all registered fingerprint data, use with caution

**Example:**
```javascript
const result = dxFingerMz.restSetting();
if (result === 0) {
    console.log('Factory settings restored');
}
```

---

### Other Functions

#### `autoCompare(pageIndex, scoreLevel, config)`
Auto compare. Automatically completes fingerprint verification process including image capture, feature generation, and search.

**Parameters:**
- `pageIndex` <code>&#123;number&#125;</code> - Template index
  - Specific index: Performs 1:1 matching
  - `0xFFFF`: Performs 1:N search
- `scoreLevel` <code>&#123;number&#125;</code> - Security level (1-5, default recommended is 3)
- `config` <code>&#123;number&#125;</code> - Configuration flags

**Returns:**
- <code>&#123;Object|null&#125;</code> - Compare result object, returns `null` on failure
  - `code` <code>&#123;number&#125;</code> - Confirmation code, `0` indicates match successful
  - `index` <code>&#123;number&#125;</code> - Matched index
  - `score` <code>&#123;number&#125;</code> - Match score

**Example:**
```javascript
// 1:1 match (compare with template at index 10)
const result1 = dxFingerMz.autoCompare(10, 3, 0);
if (result1 && result1.code === 0) {
    console.log(`Match successful, score: ${result1.score}`);
}

// 1:N search (search entire library)
const result2 = dxFingerMz.autoCompare(0xFFFF, 3, 0);
if (result2 && result2.code === 0) {
    console.log(`Match found, index: ${result2.index}, score: ${result2.score}`);
}
```

#### `getChipSN()`
Get chip serial number. Reads the unique serial number of the chip.

**Parameters:**
- None

**Returns:**
- <code>&#123;Object|null&#125;</code> - Result object, returns `null` on failure
  - `code` <code>&#123;number&#125;</code> - Confirmation code, `0` indicates success
  - `sn` <code>&#123;Uint8Array&#125;</code> - Serial number data

**Example:**
```javascript
const result = dxFingerMz.getChipSN();
if (result && result.code === 0) {
    console.log('Chip serial number:', result.sn);
}
```

#### `sleep()`
Enter sleep mode. Sets the sensor to sleep mode to save power.

**Parameters:**
- None

**Returns:**
- <code>&#123;number&#125;</code> - Confirmation code
  - `0`: Success
  - Other values: Failure
  - `-1`: Communication failure or timeout

**Example:**
```javascript
const result = dxFingerMz.sleep();
if (result === 0) {
    console.log('Entered sleep mode');
}
```

#### `cancel()`
Cancel operation. Cancels auto-registration or auto-verification operations.

**Parameters:**
- None

**Returns:**
- <code>&#123;number&#125;</code> - Confirmation code
  - `0`: Success
  - Other values: Failure
  - `-1`: Communication failure or timeout

**Example:**
```javascript
// Cancel during auto registration
const result = dxFingerMz.cancel();
if (result === 0) {
    console.log('Operation cancelled');
}
```

#### `setChipAddr(startId, endId)`
Set device address. Sets the device address (default is 0xFFFFFFFF).

**Parameters:**
- `startId` <code>&#123;number&#125;</code> - Start ID
- `endId` <code>&#123;number&#125;</code> - End ID

**Returns:**
- <code>&#123;number|boolean&#125;</code> - Available fingerprint ID, returns `false` on failure

**Note:**
- This function is not fully implemented

---

## Return Code Reference

### Common Return Codes
- `0`: Operation successful
- `-1`: Communication failure or timeout

### Common Error Codes (Reference MZ Module Protocol)
- `0x00`: Success
- `0x01`: Data packet receive error
- `0x02`: No finger on sensor
- `0x03`: Failed to enroll fingerprint image
- `0x06`: Fingerprint image too messy
- `0x07`: Fingerprint image too normal
- `0x08`: Fingerprint images do not match
- `0x09`: No matching fingerprint found
- `0x0A`: Failed to merge features
- `0x0B`: Address exceeds fingerprint library range
- `0x0C`: Error reading template from fingerprint library or invalid
- `0x0D`: Failed to upload feature
- `0x0E`: Module cannot receive subsequent data packets
- `0x0F`: Failed to upload image
- `0x10`: Failed to delete template
- `0x11`: Failed to clear fingerprint library
- `0x15`: Invalid register number
- `0x18`: No valid templates in fingerprint library
- `0x19`: Template already exists (duplicate registration)

**Note:** Specific error codes may vary by module model, please refer to the protocol documentation provided by the hardware manufacturer.

---

## Usage Examples

### Complete Registration Flow Example

```javascript
import dxFingerMz from './dxFingerMz.js';

// 1. Initialize
dxFingerMz.init({
    id: 'fingerUart',
    path: '/dev/ttySLB0',
    baudrate: '57600-8-N-2'
});

// 2. Method 1: Auto registration (recommended)
function autoEnroll(pageIndex) {
    const result = dxFingerMz.autoRegister(pageIndex, 2, 60, 0);
    if (result) {
        console.log('Auto registration successful');
        return true;
    } else {
        console.log('Auto registration failed');
        return false;
    }
}

// 3. Method 2: Manual registration
function manualEnroll(pageIndex) {
    // First capture
    if (dxFingerMz.getEnrollImage() !== 0) {
        console.log('First capture failed');
        return false;
    }
    if (dxFingerMz.genChar(1) !== 0) {
        console.log('First feature generation failed');
        return false;
    }
    
    // Second capture
    if (dxFingerMz.getEnrollImage() !== 0) {
        console.log('Second capture failed');
        return false;
    }
    if (dxFingerMz.genChar(2) !== 0) {
        console.log('Second feature generation failed');
        return false;
    }
    
    // Merge features and store
    if (dxFingerMz.regModel() !== 0) {
        console.log('Template generation failed');
        return false;
    }
    if (dxFingerMz.storeChar(1, pageIndex) !== 0) {
        console.log('Template storage failed');
        return false;
    }
    
    console.log('Manual registration successful');
    return true;
}

// Usage example
autoEnroll(1);  // Register to index 1
```

### Complete Verification Flow Example

```javascript
// Method 1: Auto verification (recommended)
function autoVerify(pageIndex) {
    // 1:1 match
    const result = dxFingerMz.autoCompare(pageIndex, 3, 0);
    if (result && result.code === 0) {
        console.log(`Verification successful, score: ${result.score}`);
        return true;
    } else {
        console.log('Verification failed');
        return false;
    }
}

// Method 2: 1:N search
function searchFingerprint() {
    const result = dxFingerMz.autoCompare(0xFFFF, 3, 0);
    if (result && result.code === 0) {
        console.log(`Match found, index: ${result.index}, score: ${result.score}`);
        return result.index;
    } else {
        console.log('No matching fingerprint found');
        return -1;
    }
}

// Method 3: Manual verification flow
function manualVerify() {
    // Capture image
    if (dxFingerMz.getImage() !== 0) {
        console.log('Image capture failed');
        return false;
    }
    
    // Generate feature
    if (dxFingerMz.genChar(1) !== 0) {
        console.log('Feature generation failed');
        return false;
    }
    
    // Search fingerprint library
    const result = dxFingerMz.search(1, 0, 100);
    if (result && result.code === 0) {
        console.log(`Match found, index: ${result.pageIndex}, score: ${result.score}`);
        return true;
    } else {
        console.log('No matching fingerprint found');
        return false;
    }
}

// Usage example
searchFingerprint();  // Search in library
```

### Template Management Example

```javascript
// Backup template
function backupTemplate(pageIndex) {
    // Load template to buffer
    if (dxFingerMz.loadChar(2, pageIndex) !== 0) {
        console.log('Template load failed');
        return null;
    }
    
    // Upload template
    const templateData = dxFingerMz.upChar(2);
    if (templateData) {
        console.log('Template backup successful, data length:', templateData.byteLength);
        // Save to file or database
        return templateData;
    } else {
        console.log('Template backup failed');
        return null;
    }
}

// Restore template
function restoreTemplate(pageIndex, templateData) {
    // Download template to buffer
    if (dxFingerMz.downChar(1, templateData) !== 0) {
        console.log('Template download failed');
        return false;
    }
    
    // Store template
    if (dxFingerMz.storeChar(1, pageIndex) !== 0) {
        console.log('Template storage failed');
        return false;
    }
    
    console.log('Template restored successfully');
    return true;
}

// Query enrolled templates
function getEnrolledTemplates() {
    const enrolled = [];
    
    // Get valid template count
    const countResult = dxFingerMz.getValidTemplateNum();
    if (!countResult || countResult.code !== 0) {
        console.log('Failed to get template count');
        return enrolled;
    }
    console.log(`Total valid templates: ${countResult.validNum}`);
    
    // Read index table (assuming max 5000 templates, need to read about 20 pages)
    for (let page = 0; page < 20; page++) {
        const result = dxFingerMz.readIndexTable(page);
        if (result && result.code === 0) {
            // Parse index table to find enrolled indices
            const table = result.indexTable;
            for (let byteIdx = 0; byteIdx < table.length; byteIdx++) {
                const byte = table[byteIdx];
                for (let bitIdx = 0; bitIdx < 8; bitIdx++) {
                    if ((byte >> bitIdx) & 1) {
                        const index = page * 256 + byteIdx * 8 + bitIdx;
                        enrolled.push(index);
                    }
                }
            }
        }
    }
    
    return enrolled;
}
```

### System Information Query Example

```javascript
// Get system information
function getSystemInfo() {
    // Read system parameters
    const sysPara = dxFingerMz.readSysPara();
    if (sysPara && sysPara.code === 0) {
        console.log('System parameters read successfully');
        // Parse sysPara.data to get specific parameters
    }
    
    // Get chip serial number
    const snResult = dxFingerMz.getChipSN();
    if (snResult && snResult.code === 0) {
        console.log('Chip serial number:', snResult.sn);
    }
    
    // Get valid template count
    const countResult = dxFingerMz.getValidTemplateNum();
    if (countResult && countResult.code === 0) {
        console.log(`Valid template count: ${countResult.validNum}`);
    }
}
```

---

## Notes

1. **Initialization Order**: Must call `init()` before using any functionality
2. **Buffer Usage**: 
   - Buffer 1 and buffer 2 can be used independently
   - Registration requires two buffers to store features from two captures separately
3. **Error Handling**: It is recommended to check all API calls for errors and handle them according to return codes
4. **Timeout Settings**: Adjust `timeout` parameter according to actual application scenarios, image capture may require longer time
5. **Concurrent Operations**: Avoid performing multiple operations simultaneously, recommend serial execution
6. **Data Backup**: Important templates should be backed up using `upChar()`
7. **Sleep Mode**: Using `sleep()` can reduce power consumption, re-initialization required after wake-up

---

## Technical Support

For questions or suggestions, please contact the technical support team.

