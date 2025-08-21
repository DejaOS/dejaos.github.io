# dxLogger

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used to provide a simple and reliable logging functionality.
It is designed as a replacement for the standard `console.log`, with enhanced features for debugging in the DejaOS environment.

- Simple, static API with three log levels: `DEBUG`, `INFO`, `ERROR`.
- All log levels are always enabled.
- Supports logging various data types, including strings, numbers, objects, arrays, and Error objects.
- Cross-thread safe by design, as it is a stateless utility.

## 2. Files

- `dxLogger.js`

> - Ensure this file is included in the dxmodules subdirectory under your project root directory.

## 3. Dependencies

- None

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+.

## 5. Usage

### Basic Usage

```javascript
import log from "./dxmodules/dxLogger.js";

// Log messages at different levels
log.debug("This is a debug message for detailed tracing.");
log.info("Application has started successfully.");
log.error("An error occurred while processing the request.");

// Log different data types
log.info("User details:", { id: 101, name: "Deja" });
log.info("Processing queue:", [1, 2, 3]);

try {
  throw new Error("Something went wrong!");
} catch (e) {
  log.error("Caught an exception:", e);
}
```

## 6. API Reference

### `logger.debug(...data)`

Logs a message at the `DEBUG` level. Useful for detailed diagnostic information during development.

**Parameters:**

- `...data` (any): A list of arguments of any type to be logged. They will be converted to strings and concatenated.

**Returns:** `void`

**Example:**

```javascript
logger.debug("Component state:", { visible: true, value: "test" });
// Output: [DEBUG 2023-10-27 10:30:00.123]: Component state: {"visible":true,"value":"test"}
```

### `logger.info(...data)`

Logs a message at the `INFO` level. Used for informational messages that highlight the progress of the application.

**Parameters:**

- `...data` (any): A list of arguments of any type to be logged.

**Returns:** `void`

**Example:**

```javascript
const port = 8080;
logger.info("Server is running on port", port);
// Output: [INFO 2023-10-27 10:31:00.456]: Server is running on port 8080
```

### `logger.error(...data)`

Logs a message at the `ERROR` level. Used for logging errors that have occurred, including Error objects which will have their stack traces printed.

**Parameters:**

- `...data` (any): A list of arguments of any type to be logged.

**Returns:** `void`

**Example:**

```javascript
try {
  // some operation that fails
  throw new Error("File not found");
} catch (e) {
  logger.error("Failed to read file:", e);
  // Output will include the error message and stack trace.
}
```
