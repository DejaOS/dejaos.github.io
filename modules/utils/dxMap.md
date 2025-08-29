# dxMap

## 1. Overview

`dxMap` module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used for in-memory key-value storage with topic-based namespaces.

This module provides a **thread-safe, topic-based in-memory storage system**. Each topic is a separate namespace for keys, allowing multiple JavaScript threads to safely access and modify data without conflicts.

**Key Features:**
- Topic-based key-value storage with automatic namespace isolation
- Thread-safe operations for multi-threaded environments
- Automatic serialization/deserialization of various data types
- Support for string, number, boolean, object, and array data types
- Memory-efficient storage with automatic cleanup capabilities
- Simple and intuitive API design

## 2. Files

- `dxMap.js` - JavaScript module wrapper
- `libvbar-m-dxmap.so` - Underlying C language implementation

> Ensure both files are included in the `dxmodules` subdirectory under your project root directory.

## 3. Dependencies

- None

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+

## 5. API Reference

### `map.get(topicName)`

This is the core function of the module. It returns a map instance for a specific topic namespace.

- `topicName` `{string}`: **(Required)** The name of the topic namespace. Must not be null or empty.
- **Returns**: A map instance object with methods to manage data within the specified topic.
- **Throws**: `Error` if the topic name is null or empty.

### Map Instance Methods

Each map instance returned by `map.get(topicName)` provides the following methods:

#### `instance.put(key, value)`
Inserts or updates a key-value pair within the current topic.

- `key` `{string}`: **(Required)** The key to set. Must not be null or empty.
- `value` `{*}`: The value to associate with the key. Supported types: string, number, boolean, object, array. Functions are not supported.
- **Returns**: `{boolean}` Returns `true` on success.
- **Throws**: `Error` if the key is null or empty, or if the value is a function.
- **Special behavior**: If `value` is `null` or `undefined`, the key will be automatically deleted.

#### `instance.get(key)`
Retrieves the value associated with a key within the current topic.

- `key` `{string}`: **(Required)** The key to retrieve. Must not be null or empty.
- **Returns**: The value associated with the key, or `undefined` if the key does not exist.
- **Throws**: `Error` if the key is null or empty.
- **Note**: The returned value is automatically deserialized to its original type.

#### `instance.has(key)`
Checks if a key exists within the current topic.

- `key` `{string}`: **(Required)** The key to check. Must not be null or empty.
- **Returns**: `{boolean}` `true` if the key exists, `false` otherwise.
- **Throws**: `Error` if the key is null or empty.

#### `instance.del(key)`
Deletes a key-value pair from the current topic.

- `key` `{string}`: **(Required)** The key to delete. Must not be null or empty.
- **Returns**: `{boolean}` `true` if the key was found and deleted, `false` otherwise.
- **Throws**: `Error` if the key is null or empty.

#### `instance.keys()`
Retrieves all keys within the current topic.

- **Returns**: `{string[]}` An array of all keys for the topic. Returns an empty array if the topic is empty or does not exist.

#### `instance.destroy()`
Destroys the entire topic, deleting all its keys and freeing associated memory.

- **Returns**: `{boolean}` Returns `true` on success.
- **Warning**: After calling destroy, the instance should not be used anymore.

## 6. Usage Examples

```javascript
import map from 'dxmodules/dxMap.js';
import * as log from 'dxmodules/dxLogger.js';

// 1. Get a map instance for the 'user' topic
log.info("\n=== User Topic ===");
const userMap = map.get('user');

// 2. Store various data types
userMap.put('name', 'John Doe');
userMap.put('age', 30);
userMap.put('isActive', true);
userMap.put('roles', ['admin', 'editor']);
userMap.put('profile', { email: 'john@example.com', lastLogin: '2024-01-01' });

// 3. Retrieve data
log.info('Name:', userMap.get('name'));           // "John Doe"
log.info('Age:', userMap.get('age'));             // 30
log.info('Is Active:', userMap.get('isActive')); // true
log.info('Roles:', userMap.get('roles'));         // ['admin', 'editor']
log.info('Profile:', userMap.get('profile'));     // { email: 'john@example.com', lastLogin: '2024-01-01' }

// 4. Check if keys exist
log.info('Has name:', userMap.has('name'));      // true
log.info('Has email:', userMap.has('email'));    // false

// 5. Get all keys
log.info('All keys:', userMap.keys());           // ['name', 'age', 'isActive', 'roles', 'profile']

// 6. Delete a key
userMap.del('isActive');
log.info('After deletion - has isActive:', userMap.has('isActive')); // false

// 7. Set null/undefined to delete (special behavior)
userMap.put('age', null);  // This automatically deletes the 'age' key
log.info('After setting null - has age:', userMap.has('age')); // false

// 8. Create another topic for different data
log.info("\n=== Settings Topic ===");
const settingsMap = map.get('settings');
settingsMap.put('theme', 'dark');
settingsMap.put('language', 'en');
settingsMap.put('notifications', true);

log.info('Settings keys:', settingsMap.keys());   // ['theme', 'language', 'notifications']
log.info('Theme:', settingsMap.get('theme'));     // "dark"

// 9. Clean up when done
settingsMap.destroy();  // Destroy the settings topic
log.info('After destroy - settings keys:', settingsMap.keys()); // []
```

## 7. Data Type Support

The module automatically handles serialization and deserialization of the following data types:

### Supported Types:
- **String**: Stored as-is
- **Number**: Stored with `#n#` prefix (e.g., `#n#42`, `#n#3.14`)
- **Boolean**: Stored with `#b#` prefix (e.g., `#b#true`, `#b#false`)
- **Array**: Stored with `#a#` prefix and JSON serialization (e.g., `#a#["item1","item2"]`)
- **Object**: Stored with `#o#` prefix and JSON serialization (e.g., `#o#{"key":"value"}`)

### Unsupported Types:
- **Function**: Throws an error if attempted to store
- **null/undefined**: Automatically deletes the key when set

## 8. Thread Safety

The module is designed to be thread-safe, allowing multiple JavaScript threads to safely:
- Access the same topic simultaneously
- Modify data within the same topic
- Create and destroy topics independently

Each topic operates in its own namespace, preventing key conflicts between different parts of your application.

## 9. Demo
None
