# Worker Multithreading

---

## Introduction

In DejaOS, UI rendering and most business logic can run in the same main thread. If any time-consuming operations, such as complex data processing, database read/write, or network requests, are performed on this main thread, it will block the UI rendering, leading to issues like UI freezes and unresponsiveness, which seriously impacts the user experience.

To solve this problem, DejaOS fully utilizes the **`Worker`** capability provided by the QuickJS engine. `Worker` is an important concept in QuickJS that allows developers to create independent threads running in the background to offload time-consuming tasks from the main thread. This allows the main thread to focus on handling user interactions and UI updates, keeping the application smooth and responsive.

It can be said that **mastering `Worker` is the key to developing high-performance DejaOS applications**.

It's worth mentioning that many core components in DejaOS (e.g., face recognition `dxFacial`, barcode scanning `dxBarcode`, etc.) rely on high-frequency polling mechanisms to obtain real-time dynamic data (e.g., `dxFacial.getDetectionData()`). This means that any synchronous time-consuming operation in the main thread or a `Worker` thread will directly block and delay these polling calls, causing component functions to behave abnormally (e.g., the face frame does not update). Therefore, encapsulating all potentially time-consuming logic into independent `Worker`s is a **prerequisite** for ensuring the normal and smooth operation of these components.

:::danger Core Principle: Never Block the Event Loop
Whether it's the main thread or a Worker, both run on a single-threaded event loop model. **It is strictly forbidden to use synchronous infinite loops like `while(true)` or `for(;;)` in any thread** to wait for or process tasks.

Such code will **permanently block the current thread's event loop**, making it unable to respond to any new events (such as user input, timers, network messages, etc.). For the main thread, this means the UI will freeze; for a Worker, it means it can no longer receive any new tasks.

All time-consuming or waiting operations must be completed through asynchronous, event-driven patterns, such as using `dxStd.setInterval`, `dxStd.setTimeout`, or event callbacks.
:::

---

## Core Concepts

### 1. Independent Runtime Environment

A `Worker` is similar to a thread, but more accurately, it's like an independent "process". Each `Worker` instance created via `new Worker()` is a **completely isolated JavaScript runtime environment (VM)**.

This means:

- **Independent Global Scope**: Each `Worker` has its own `global` object, variables, and functions, completely isolated from the main thread and other `Worker`s.
- **No Shared Memory**: You cannot directly access or modify variables or functions in the main thread or other `Worker`s. This design avoids common multi-threading problems like race conditions and deadlocks, but it also imposes requirements for data exchange between threads.

### 2. Creation and Lifecycle

- **Creation**: `Worker`s can only be created by the main thread.
  ```javascript
  // main.js
  const myWorker = new Worker("path/to/worker_script.js");
  ```
- **Module Path**: The `module_filename` in the constructor is a string specifying the path of the JS module file to be executed in the new thread. This path is relative to the current script's path.
- **Limitation**: DejaOS currently does not support creating new `Worker`s inside another `Worker` (i.e., nested Workers).
- **Destruction**: A `Worker` is automatically terminated and its resources are released by the garbage collection mechanism only when there are no pending tasks in its event loop (e.g., no `onmessage` listener set, no running `setInterval`/`setTimeout`), and there are no more references to the `Worker` instance in the main thread.

---

## Worker Communication vs. Data Sharing

Interactions between `Worker`s are mainly divided into two categories: **Communication** and **Data Sharing**.

- **Communication**: Refers to when one thread needs to **notify** another thread that "something has happened". For this scenario, we recommend using `dxEventBus`, which focuses more on the delivery of **events**. For detailed usage, please refer to the [dxEventBus](./eventbus.md) documentation.

- **Data Sharing**: Refers to when multiple threads need to access or modify the **same piece of data**. Passing data directly using `dxEventBus` would incur performance overhead due to repeated cloning. More importantly, it does not align with the intent of "sharing state".

To achieve efficient and safe data sharing, DejaOS provides native modules like `dxMap` and `dxQueue`, leveraging the underlying C host environment. These modules allow multiple threads to access the same shared memory, enabling zero-copy data exchange. For detailed usage, please refer to the [dxMap & dxQueue](./mapqueue.md) documentation.

---

## Summary and Best Practices

- **Isolate Time-Consuming Tasks**: Put all time-consuming operations, especially I/O-intensive tasks (like **file I/O**, **SQLite database operations**, **MQTT communication**, **serial data communication**) and CPU-intensive tasks (like **face recognition algorithms**), into `Worker`s to ensure a smooth UI in the main thread.
- **Prefer `dxEventBus`**: Use `dxEventBus` for communication between `Worker`s to build clear, decoupled, event-driven applications.
- **Use `dxMap` for Data Sharing**: When you need to share state or exchange data with high performance between threads, use `dxMap` to avoid the overhead of data cloning.
- **Keep `Worker` Responsibilities Singular**: It is recommended to have each `Worker` be responsible for a specific category of background tasks, for example, one `Worker` dedicated to face recognition algorithms, and another for network communication.
- **Control the Number of Workers**: On DejaOS devices, due to limited hardware resources, it is advisable to reasonably control the number of `Worker`s to avoid excessive consumption of system resources.

## This Documentation Series

This series of documents covers several core modules of DejaOS Worker multithreading programming to help you build high-performance applications:

- **[./eventbus.md](./eventbus.md)**

  > Learn how to use `dxEventBus` for decoupled, event-driven **communication** between the main thread and Workers, as well as between Workers.

- **[./mapqueue.md](./mapqueue.md)**

  > Master how to use `dxMap` and `dxQueue` for zero-copy, high-performance **data sharing** between threads.

- **[./rpc.md](./rpc.md)**

  > Understand how to implement elegant cross-thread **Remote Procedure Calls (RPC)** on top of `dxEventBus`, allowing you to call functions in other threads as if they were local.

- **[./pool.md](./pool.md)**
  > Learn how to use the `dxWorkerPool` **thread pool** to manage and reuse Workers for efficiently handling a large number of concurrent tasks.
