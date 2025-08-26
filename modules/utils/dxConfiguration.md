# dxConfiguration

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), providing a modern, instance-based, and thread-safe solution for configuration management.

It leverages `dxEventBus` and a dedicated Worker to ensure that all file I/O operations are thread-safe, preventing race conditions. It allows for the management of one or more configuration files, each represented by an object instance, ensuring a clean and robust API.

- **Thread-Safe:** All file writing operations are handled by a single, dedicated worker to ensure they are executed sequentially.
- **Instance-Based:** Manage multiple configuration files (e.g., `system.json`, `user.json`) cleanly, with each file represented by its own instance.
- **Robust:** Automatically handles corrupted JSON files by falling back to default values and self-healing the file.
- **Flexible API:** Supports both immediate (`autosave`) and batched (`save()`) file-saving strategies.

## 2. Files

- `dxConfiguration.js`
- `configurationWorker.js`

> - Ensure the files is located in the `dxmodules` subdirectory under your project root.

## 3. Dependencies

- `dxStd`
- `dxMap`
- `dxEventBus`

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+ that support Workers.

## 5. Usage

### Main Thread (`main.js`)

```javascript
import dxConfiguration from '../dxmodules/dxConfiguration.js';
import log from '../dxmodules/dxLogger.js';

// 1. Define default values. These are used only if the config file does not exist.
const configPath = '/app/data/my_app_config.json';
const defaultValues = {
    'mqtt.ip': '127.0.0.1',
    'mqtt.port': 1883,
    'version': '1.0.0'
};

// 2. Initialize the configuration. The first call to init() also creates the background worker.
const myConfig = dxConfiguration.init(configPath, defaultValues);
log.info('Initial config:', myConfig.getAll());

// 3. Set a value and save it immediately.
myConfig.set('mqtt.ip', '192.168.1.100', true); // autosave = true
log.info('New IP:', myConfig.get('mqtt.ip'));

// 4. Perform multiple changes and save them all at once for better performance.
myConfig.set('mqtt.port', 8883); // autosave = false (default)
myConfig.set('user', 'testuser');
myConfig.save(); // Persist all staged changes to the file.
log.info('Batch changes saved. Current config:', myConfig.getAll());

// 5. To delete a key, set its value to null.
myConfig.set('user', null, true); // autosave = true
log.info('Config after deleting user:', myConfig.getAll());
```

### Worker Thread (`/app/code/src/my_worker.js`)

In worker threads, you **must not** call `init()`. Instead, use `getInstance()` to get a handle to the configuration that was already initialized by the main thread.

```javascript
import dxConfiguration from '../dxmodules/dxConfiguration.js';
import log from '../dxmodules/dxLogger.js';

const configPath = '/app/data/my_app_config.json';

// 1. Get the instance initialized by the main thread.
const myConfig = dxConfiguration.getInstance(configPath);

if (myConfig) {
    // 2. Read a value.
    const ip = myConfig.get('mqtt.ip');
    log.info(`[Worker] Read IP from config: ${ip}`);

    // 3. Modify a value and save it.
    myConfig.set('version', '2.0.0', true); // autosave = true
    log.info('[Worker] Updated version to 2.0.0');
} else {
    log.error('[Worker] Failed to get config instance. Was it initialized in the main thread?');
}
```

## 6. API Reference

### `dxConfiguration.init(savePath, [defaultValues])`

Creates and initializes a configuration instance. The first time this function is called anywhere in an application, it will also create the single, shared background worker for file operations. Subsequent calls will not create a new worker.

**Parameters:**

- `savePath` (string): The absolute path where the configuration file will be stored. This path also acts as the unique identifier for the configuration instance.
- `defaultValues` (object, optional): An object containing default key-value pairs. These are **only** used if the configuration file does not already exist, or if the existing file is corrupted.

**Returns:** `object` - The configuration instance.

### `dxConfiguration.getInstance(savePath)`

Retrieves an already initialized configuration instance. This is the standard way to access a configuration from any thread after it has been initialized in the main thread.

**Parameters:**

- `savePath` (string): The absolute path of the configuration file used in `init()`.

**Returns:** `object|null` - The configuration instance, or `null` if it has not been successfully initialized yet.

---

### `instance.get(key)`

Retrieves a value by key from the configuration instance's in-memory store.

- **Returns:** `*` - The value associated with the key, or `undefined` if the key does not exist.

### `instance.getAll()`

Retrieves a shallow copy of all key-value pairs for this configuration instance.

- **Returns:** `object` - An object containing all configuration data.

### `instance.set(key, value, [autosave])`

Sets a key-value pair in memory. If the `value` is `null` or `undefined`, the key will be removed.

- `key` (string): The configuration key. Must be a non-empty string.
- `value` (*): The value to set.
- `autosave` (boolean, optional): If `true`, saves the configuration file to disk immediately. Defaults to `false`.

### `instance.save()`

Asynchronously saves the current in-memory configuration to the file on disk. Useful for batching multiple `set()` or `clear()` operations.

### `instance.clear(key, [autosave])`

Removes a single key from the configuration instance's memory.

- `key` (string): The configuration key to remove. Must be a non-empty string.
- `autosave` (boolean, optional): If `true`, saves the configuration file to disk immediately. Defaults to `false`.

### `instance.clearAll()`

Removes all key-value pairs for this instance from memory and asynchronously deletes the corresponding configuration file from disk.

## 7. Related Modules
Related to another module called dxConfig, with similar functionality. dxConfiguration is the replacement for dxConfig, and dxConfig is being gradually deprecated. 

## 8. Example

None.
