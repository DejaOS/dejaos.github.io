# dxQueue

## 1. Overview

`dxQueue` module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used for creating thread-safe, in-memory, topic-based FIFO (First-In, First-Out) queues.

This module provides a **thread-safe, topic-based in-memory queue system**. Each topic (or queue name) is a separate queue, allowing multiple JavaScript threads to safely push and pop data without conflicts.

**Key Features:**
- Topic-based FIFO queues with automatic namespace isolation
- Thread-safe operations for multi-threaded environments
- Automatic serialization/deserialization of various data types
- Support for string, number, boolean, object, and array data types
- Fixed-size queues to prevent uncontrolled memory growth and manage backpressure
- Explicit initialization and lifecycle management (`init`, `getInstance`, `destroy`, `clearAll`)

## 2. Files

- `dxQueue.js` - JavaScript module wrapper
- `libvbar-m-dxqueue.so` - Underlying C language implementation

> - Ensure all files are included in the `dxmodules` subdirectory under your project root directory.

## 3. Dependencies

- `dxMap.js` 

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+

## 5. API Reference

### `queue.init(name, maxSize)`
Initializes a new queue with a specific name and maximum size. This must be called before the queue can be used.

- `name` `{string}`: **(Required)** The unique name for the queue. Must not be null or empty.
- `maxSize` `{number}`: **(Required)** The maximum number of items the queue can hold. Must be a non-negative integer. Use `0` for an unlimited size.
- **Returns**: `{DxQueueInstance}` An object with methods to interact with the newly created queue.
- **Throws**: `Error` If the name or `maxSize` is invalid, or if a queue with the same name already exists.

### `queue.getInstance(name)`
Gets an instance of a previously initialized queue. This is the standard way to access a queue from any thread after it has been initialized once.

- `name` `{string}`: **(Required)** The name of the queue to retrieve.
- **Returns**: `{DxQueueInstance}` An object with methods to interact with the specified queue.
- **Throws**: `Error` If the name is invalid, or if the queue has not been initialized with `init()`.

### `queue.clearAll()`
Clears all queues, removing all elements from every queue and releasing their associated memory. The queue module itself remains initialized and new queues can be created after calling this.

- **Warning**: This is a global operation that affects all queues. To destroy a single queue, use the `.destroy()` method on an instance.

### Queue Instance Methods

Each queue instance returned by `queue.init()` or `queue.getInstance()` provides the following methods:

#### `instance.push(value)`
Adds an item to the end of the queue.

- `value` `{*}`: The value to add. Supported types: string, number, boolean, object, array. Functions, `null`, and `undefined` are not supported.
- **Returns**: `{boolean}` `true` on success.
- **Throws**: `Error` if the queue is full, or if the value is of an unsupported type.

#### `instance.pop()`
Removes and returns the item at the beginning of the queue.

- **Returns**: `{*}` The item at the beginning of the queue, or `null` if the queue is empty.
- **Note**: The returned value is automatically deserialized to its original type.

#### `instance.size()`
Returns the current number of items in the queue.

- **Returns**: `{number}` The number of items in the queue.

#### `instance.getMaxSize()`
Returns the maximum size of the queue.

- **Returns**: `{number}` The maximum number of items the queue can hold.

#### `instance.isFull()`
Checks if the queue has reached its maximum size.

- **Returns**: `{boolean}` `true` if the queue is full, `false` otherwise.

#### `instance.destroy()`
Destroys this specific queue, deleting all its items and freeing associated memory.

- **Returns**: `{boolean}` `true` on success, `false` if the queue was already destroyed or not found.
- **Warning**: After calling destroy, this instance should not be used anymore.

## 6. Usage Examples

```javascript
import queue from 'dxmodules/dxQueue.js';
import * as log from 'dxmodules/dxLogger.js';

// 1. Initialize a queue for user events with a max size of 5
log.info("\n=== Event Queue ===");
const eventQueue = queue.init('user_events', 5);

// 2. Push various data types
eventQueue.push({ event: 'login', userId: 123 });
eventQueue.push("user interaction");
eventQueue.push(true);
log.info('Current size:', eventQueue.size()); // 3
log.info('Is full:', eventQueue.isFull());   // false

// 3. Pop data in FIFO order
log.info('Popped item 1:', eventQueue.pop()); // { event: 'login', userId: 123 }
log.info('Popped item 2:', eventQueue.pop()); // "user interaction"

// 4. Create another queue for background tasks
log.info("\n=== Task Queue ===");
const taskQueue = queue.init('bg_tasks', 10);
taskQueue.push({ task: 'send_report', priority: 'high' });

log.info('Event queue size:', eventQueue.size()); // 1
log.info('Task queue size:', taskQueue.size());  // 1

// 5. Fill a queue and handle the error
const q = queue.init('temp_q', 1);
q.push(1);
try {
    q.push(2); // This will fail
} catch (e) {
    log.error('Caught expected error:', e.message);
}

// 6. Clean up a single queue when done
eventQueue.destroy();
log.info('Event queue destroyed.');
try {
    queue.getInstance('user_events');
} catch (e) {
    log.error('Caught expected error:', e.message);
}

// 7. Globally clear all remaining queues before exit
queue.clearAll();
log.info('All queues cleared.');
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
- **Function**: Throws an error if attempted to be pushed.
- **null/undefined**: Throws an error if attempted to be pushed.

## 8. Thread Safety

The module is designed to be fully thread-safe. The `init`/`getInstance` pattern is central to this design.

- **`queue.init()`** should be called once to create and define a queue.
- **`queue.getInstance()`** can then be called from any thread to get a safe, local handle to the same underlying native queue.
- All instance methods (`push`, `pop`, `size`, etc.) are protected by mutexes in the underlying C implementation, allowing them to be safely called from multiple threads simultaneously on the same queue.

This model ensures that different parts of your application, running in different threads, can reliably communicate and share data through a common queue.

## 9. Demo
None
