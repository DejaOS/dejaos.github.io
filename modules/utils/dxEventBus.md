# dxEventBus

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used for multi-threaded event communication between the main thread and Worker sub-threads.
It uses the main thread as a message relay, enabling a full-duplex event notification mechanism across all threads. Additionally, it includes a built-in RPC (Remote Procedure Call) mechanism based on the event bus, supporting safe cross-thread function calls.

- Supports communication between Worker threads via the main thread.
- Supports main-to-worker, worker-to-main, and intra-main-thread communication.
- Supports dynamic creation and termination of event-aware Workers.
- **[New]** Built-in RPC module supporting cross-thread request/response calls and asynchronous notifications.

## 2. Files

- dxEventBus.js

> - Ensure this file is located in the dxmodules subdirectory under your project root directory.

## 3. Dependencies

- dxStd

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+ that support Workers.

## 5. Usage

### 5.1 Basic Event Bus (`bus.on` / `bus.fire`)

**Main Thread (`main.js`)**

```javascript
import bus from "../dxmodules/dxEventBus.js";
import log from "../dxmodules/dxLogger.js";

// 1. Create a new Worker
bus.newWorker("my_worker_1", "/app/code/src/worker.js");

// 2. Listen for the 'worker_to_main' event from any Worker
bus.on("worker_to_main", (data) => {
  log.info(`[Main] Received from worker:`, data);
});

// 3. Fire an event to all subscribers (including Workers)
log.info("[Main] Firing 'main_to_worker' event...");
bus.fire("main_to_worker", { message: "Hello from main thread!" });
```

**Worker Thread (`/app/code/src/worker.js`)**

```javascript
import bus from "../dxmodules/dxEventBus.js";
import log from "../dxmodules/dxLogger.js";

// 1. Listen for the 'main_to_worker' event from the main thread
bus.on("main_to_worker", (data) => {
  log.info(`[Worker ${bus.getId()}] Received from main:`, data);

  // 2. After receiving a message, reply with an event to the main thread
  bus.fire("worker_to_main", { reply: "Hi, main! I got your message." });
});
```

### 5.2 RPC (`bus.rpc`)

**Callee (e.g., Worker)**

```javascript
import bus from "../dxmodules/dxEventBus.js";
import std from "../dxmodules/dxStd.js";

// Note: It is recommended to register in setTimeout to ensure the RPC module is fully initialized
std.setTimeout(() => {
  // Register a function named 'add' for external calls
  bus.rpc.register("add", ({ a, b }) => {
    return a + b;
  });
}, 1000);
```

**Caller (e.g., Main Thread)**

```javascript
import bus from "../dxmodules/dxEventBus.js";
import log from "../dxmodules/dxLogger.js";

async function callWorker() {
  try {
    // Call the 'add' function registered in 'my_worker_1'
    const result = await bus.rpc.call("my_worker_1", "add", { a: 5, b: 10 });
    log.info("RPC Result:", result); // Output: 15
  } catch (e) {
    log.error("RPC Error:", e.message);
  }
}

// Ensure the Worker has started and registered the function before calling
setTimeout(callWorker, 2000);
```

## 6. API Reference

### Core Management API

#### `bus.newWorker(id, file)`

Creates a new Worker in the main thread and registers it with the event bus. **This function must be called from the main thread.** The RPC module is automatically initialized after the Worker is created.

**Parameters:**

- `id` (string): A unique identifier for the Worker. Cannot be empty or duplicated.
- `file` (string): The absolute path to the Worker's script file.

**Throws:** `Error` if the id is invalid, the file does not exist, or if called from a non-main thread.

#### `bus.delWorker(id)`

Terminates a Worker and cleans up all its resources from the event bus, including removing all of its event subscriptions.

**Parameters:**

- `id` (string): The unique identifier of the Worker to terminate.

#### `bus.listWorkers()`

Lists the IDs of all currently active Workers.

**Returns:** `string[]` - An array of Worker IDs.

#### `bus.getId()`

Returns the ID of the current thread. In the main thread, it always returns `__main`.

**Returns:** `string|null` - The ID of the current thread.

---

### Event Bus API

#### `bus.on(topic, callback)`

Subscribes to an event topic. The callback function is executed when an event for that topic is fired.

**Parameters:**

- `topic` (string): The event topic to subscribe to.
- `callback` (function): The callback function to execute when the event is fired. It receives the event data as its only argument.

#### `bus.fire(topic, data)`

Fires an event to notify all subscribers for a given topic. This is a "fire-and-forget" operation.

- In the main thread, subscriber callbacks are executed **synchronously**.
- For subscribers in Workers, the event is sent **asynchronously** via `postMessage`.

**Parameters:**

- `topic` (string): The event topic to fire.
- `data` (\*): The data to pass to the event subscribers.

#### `bus.off(topic)`

Unsubscribes from the specified event topic. All callback functions for that topic will be removed.

**Parameters:**

- `topic` (string): The event topic to unsubscribe from.

---

### RPC API (`bus.rpc`)

`dxEventBus` includes a built-in RPC module, accessible via the `bus.rpc` object.

#### `bus.rpc.register(name, handlerFn)`

Registers a function so it can be called by other threads.

**Parameters:**

- `name` (string): The unique name of the function.
- `handlerFn` (function): The handler function. Receives an argument object and returns a result (supports Promise).

#### `bus.rpc.call(targetId, name, args, [timeout])`

Calls a registered function in another thread and waits for the result (Request/Response).

**Parameters:**

- `targetId` (string): The target thread ID (e.g., `'__main'` or a Worker ID).
- `name` (string): The name of the function to call.
- `args` (object): The argument object passed to the function. Defaults to `{}`.
- `timeout` (number): [Optional] Timeout in milliseconds. Defaults to 5000ms.

**Returns:** `Promise<any>` - Resolves with the return value of the remote function.

#### `bus.rpc.notify(targetId, name, args)`

Sends a one-way notification call (Fire-and-Forget). Does not wait for a result and does not return a Promise.

**Parameters:**

- `targetId` (string): The target thread ID.
- `name` (string): The name of the function to call.
- `args` (object): The argument object passed to the function.

## 7. Example

None.
