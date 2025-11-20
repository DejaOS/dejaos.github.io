# dxWorkerPool: Thread Pool Management

---

## Introduction

When dealing with a large number of concurrent, independent tasks, manually creating a new `Worker` for each task is highly inefficient. The creation and destruction of threads consume system resources, and creating an unlimited number of threads can lead to performance degradation due to resource contention.

`dxWorkerPool` provides an elegant solution. It is a **thread pool** manager, specifically designed to handle event streams from `dxEventBus`.

**Core Idea**:
`dxWorkerPool` pre-creates and maintains a fixed number of `Worker`s. When the main thread fires a listened-to event via `dxEventBus`, the thread pool automatically treats this event as a "task", takes it from its internal task queue, and assigns it to a currently idle `Worker` for processing.

**Core Advantages**:

- **Resource Reuse**: By reusing `Worker` threads, it avoids the performance overhead of frequently creating and destroying threads.
- **Load Balancing**: Automatically distributes tasks to idle `Worker`s, achieving simple load balancing.
- **Flow Control**: A built-in task queue can buffer tasks when the task volume exceeds the `Worker`s' processing capacity, preventing system overload.
- **Simplified Development**: It completely encapsulates complex task distribution and `Worker` management logic, allowing developers to focus solely on the business logic itself.

---

## Workflow

The workflow of `dxWorkerPool` is entirely event-driven:

```text
+-------------+        +------------+        +--------------+        +----------+
| Main Thread |        | dxEventBus |        | dxWorkerPool |        | Worker 1 |
+-------------+        +------------+        +--------------+        +----------+
       |                     |                      |                      |
       | bus.fire('topic')   |                      |                      |
       |-------------------->|                      |                      |
       |                     | on('topic', ...)     |                      |
       |                     |--------------------->|                      |
       |                     |                      | Add task to queue    |
       |                     |                      |--------------------->|
       |                     |                      |                      |
       |                     |                      | (Idle) Assign task   |
       |                     |                      |--------------------->|
       |                     |                      |                      |
       |                     |                      |                      | Execute pool.callback()
       |                     |                      |                      |-------------------->|
       |                     |                      |                      |
       |                     |                      | Notify completion    |
       |                     |                      |<---------------------|
       |                     |                      |                      |
       |                     |                      | (Become Idle)        |
       |                     |                      |--------------------->|
```

---

## API Overview

### Main Thread API

#### `pool.init(file, bus, topics, [count], [maxsize])`

(Main thread only) Initializes and starts the thread pool. This is the first step in using the thread pool and can only be called once.

- `file` String: The **absolute path** to the Worker script.
- `bus` Object: The instance of `dxEventBus` that the thread pool will use to listen for tasks.
- `topics` `string[]`: An array of strings that defines all the `dxEventBus` topics the thread pool should listen to. Any event sent to these topics will be treated as a task.
- `count` Number: (Optional) The number of `Worker`s in the thread pool, defaults to 2.
- `maxsize` Number: (Optional) The maximum length of the internal task queue, defaults to 100. If the queue is full, the newest task will replace the oldest one.

### Worker Thread API

#### `pool.callback(handlerFn)`

(Worker thread only) Registers the callback function for processing tasks in the Worker script.

- `handlerFn` Function: The handler function. This function is called when a `Worker` receives a task from the thread pool. It receives a `task` object as an argument, with the structure `{ topic: string, data: any }`.

#### `pool.getWorkerId()`

(Available in both Main and Worker threads) Gets the ID of the current thread. Returns `'main'` in the main thread, and returns a unique ID assigned by the thread pool (e.g., `'pool__id0'`) in a Worker thread.

---

## Usage Example

The following example demonstrates how to initialize a thread pool to handle tasks from two different topics.

**`worker.js` (Task Handler)**

```javascript
import pool from "../dxmodules/dxWorkerPool.js";
import log from "../dxmodules/dxLogger.js";
import std from "../dxmodules/dxStd.js";

// 1. Register a callback function to handle all tasks assigned to this Worker
pool.callback(function (task) {
  const workerId = pool.getWorkerId();
  log.info(`[${workerId}] Start processing task from '${task.topic}'`);
  log.info(`[${workerId}] Task data: ${JSON.stringify(task.data)}`);

  // 2. Simulate a time-consuming operation
  const workTime = Math.floor(Math.random() * 200) + 50; // 50-250ms
  std.sleep(workTime);

  log.info(`[${workerId}] Finished processing task in ${workTime}ms.`);
});

log.info(`Worker ${pool.getWorkerId()} is ready and waiting for tasks...`);
```

**`main.js` (Task Publisher)**

```javascript
import pool from "../dxmodules/dxWorkerPool.js";
import eventBus from "../dxmodules/dxEventBus.js";
import log from "../dxmodules/dxLogger.js";
import std from "../dxmodules/dxStd.js";

log.info("----------- dxWorkerPool Example -----------");

// 1. Define the thread pool configuration
const workerFile = "/app/code/src/worker.js";
const topicsToProcess = ["image.resize", "log.upload"];
const workerCount = 3;
const queueSize = 10;

// 2. Initialize the thread pool
log.info(
  `Initializing ${workerCount} Workers to handle tasks from [${topicsToProcess.join(
    ", "
  )}] topics`
);
pool.init(workerFile, eventBus, topicsToProcess, workerCount, queueSize);
log.info("Thread pool initialized successfully.");

// 3. Fire a series of events via dxEventBus, which will be automatically handled by the thread pool
const taskCount = 8;
log.info(`\n--- Dispatching ${taskCount} tasks to the event bus... ---`);
for (let i = 1; i <= taskCount; i++) {
  // Alternate sending tasks to different topics
  const topic = i % 2 === 0 ? topicsToProcess[0] : topicsToProcess[1];
  const payload = { taskId: i, message: `Task details #${i}` };

  log.info(`-> [Main] Firing event to '${topic}'`);
  eventBus.fire(topic, payload);
  std.sleep(50); // A short sleep to make the logs clearer
}

log.info(
  `\n--- All ${taskCount} tasks have been dispatched. Observe the Worker logs to see the task distribution. ---`
);
```
