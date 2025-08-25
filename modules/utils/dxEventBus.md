# dxEventBus

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used for multi-threaded event communication between the main thread and Worker sub-threads.
It uses the main thread as a message relay, enabling a full-duplex event notification mechanism across all threads.

- Supports communication between Worker threads via the main thread.
- Supports main-to-worker, worker-to-main, and intra-main-thread communication.
- Supports dynamic creation and termination of event-aware Workers.

## 2. Files

- dxEventBus.js

> - Ensure this file is located in the dxmodules subdirectory under your project root directory.

## 3. Dependencies

- dxStd

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+ that support Workers.

## 5. Usage

### Main Thread (`main.js`)

```javascript
import bus from "../dxmodules/dxEventBus.js";
import log from "../dxmodules/dxLogger.js";

// 1. Create a new Worker
bus.newWorker('my_worker_1', '/app/code/src/worker.js');

// 2. Listen for the 'worker_to_main' event from any Worker
bus.on('worker_to_main', (data) => {
    log.info(`[Main] Received from worker:`, data);
});

// 3. Fire an event to all subscribers (including Workers)
log.info("[Main] Firing 'main_to_worker' event...");
bus.fire('main_to_worker', { message: 'Hello from main thread!' });
```

### Worker Thread (`/app/code/src/worker.js`)

```javascript
import bus from "../dxmodules/dxEventBus.js";
import log from "../dxmodules/dxLogger.js";


// 1. Listen for the 'main_to_worker' event from the main thread
bus.on('main_to_worker', (data) => {
    log.info(`[Worker ${bus.getId()}] Received from main:`, data);

    // 2. After receiving a message, reply with an event to the main thread
    bus.fire('worker_to_main', { reply: 'Hi, main! I got your message.' });
});
```

## 6. API Reference

### `bus.newWorker(id, file)`

Creates a new Worker in the main thread and registers it with the event bus. **This function must be called from the main thread.**

**Parameters:**

- `id` (string): A unique identifier for the Worker. Cannot be empty or duplicated.
- `file` (string): The absolute path to the Worker's script file.

**Returns:** `void`

**Throws:** `Error` if the id is invalid, the file does not exist, or if called from a non-main thread.

### `bus.delWorker(id)`

Terminates a Worker and cleans up all its resources from the event bus, including removing all of its event subscriptions.

**Parameters:**

- `id` (string): The unique identifier of the Worker to terminate.

**Returns:** `void`

### `bus.fire(topic, data)`

Fires an event to notify all subscribers for a given topic. This is a "fire-and-forget" operation.
- In the main thread, subscriber callbacks are executed **synchronously**.
- For subscribers in Workers, the event is sent **asynchronously** via `postMessage`.

**Parameters:**

- `topic` (string): The event topic to fire.
- `data` (*): The data to pass to the event subscribers.

**Returns:** `void`

### `bus.on(topic, callback)`

Subscribes to an event topic. The callback function is executed when an event for that topic is fired.

**Parameters:**

- `topic` (string): The event topic to subscribe to.
- `callback` (function): The callback function to execute when the event is fired. It receives the event data as its only argument.

**Returns:** `void`

### `bus.getId()`

Returns the ID of the current thread. In the main thread, it always returns `__main`.

**Returns:** `string|null` - The ID of the current thread.

**Note:** In a Worker, if this function is called at the top level of the script (before the event bus has fully initialized), it may return `null`. It is reliable to call this function within event handler callbacks.

## 7. Example

None.
