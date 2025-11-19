# dxMap & dxQueue: High-Performance Inter-Thread Data Sharing

---

## Introduction

In DejaOS's multithreading model, `dxEventBus` and `dxMap`/`dxQueue` play different but complementary roles. Understanding their fundamental differences is crucial:

- `dxEventBus` solves the problem of **inter-thread communication and notification**. Its core is the **"event"**, used to tell other threads that "something just happened". Data is just incidental information attached to the event.
- `dxMap` and `dxQueue` solve the problem of **inter-thread data sharing**. Their core is the **"data"** itself, providing a shared memory container that all threads can access. Other threads can access the latest data state at any time, without caring when or by whom the data was written.

Although the underlying `postMessage` mechanism of `dxEventBus` incurs some performance overhead due to data cloning, this is not the only reason to choose `dxMap`/`dxQueue`. **The real basis for selection is your intent: are you trying to "send a notification" or "share a piece of data"?**

DejaOS provides `dxMap` and `dxQueue`, two high-performance, thread-safe data sharing modules implemented in native C/C++, which allow all threads to access the same block of memory, achieving **Zero-Copy** data exchange.

- **`dxMap`**: A thread-safe **Key-Value Store**, used for sharing **state** among multiple threads.
- **`dxQueue`**: A thread-safe **First-In, First-Out (FIFO) Queue**, used for implementing a **producer-consumer pattern** data flow among multiple threads.

---

## dxMap: Thread-Safe Shared State

`dxMap` provides a global, topic-isolated key-value store. You can think of it as a global object that all threads can read from and write to simultaneously.

### Core Mechanism

`dxMap` is implemented in C at the low level, ensuring that all operations like `put`/`get`/`del` are atomic, thus guaranteeing thread safety. When you access a `dxMap` instance of the same topic from different threads, they are all operating on the same underlying data structure.

### API Overview

1.  **Get/Create Instance**

    - `dxMap.get(topic)`: Gets a map instance for a specified `topic` name. If the map for this topic does not exist, it will be implicitly created on the first `put` operation.

2.  **Operation Methods**
    - `map.put(key, value)`: Sets a key-value pair. Supports strings, numbers, booleans, objects, and arrays. If `value` is `null` or `undefined`, the `key` will be deleted.
    - `map.get(key)`: Gets the value for a specified `key`. Returns `undefined` if the `key` does not exist.
    - `map.has(key)`: Checks if a specified `key` exists.
    - `map.del(key)`: Deletes a key-value pair.
    - `map.keys()`: Returns an array of all `key`s under the topic.
    - `map.destroy()`: Destroys the entire map for the topic, releasing resources.

### Usage Example

This example shows the main thread initializing a state, a `Worker` thread reading, modifying, and adding to this state, and finally the main thread verifying the changes.

**`main.js`**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import map from "./dxmodules/dxMap.js";
import log from "./dxmodules/dxLogger.js";

// 1. Get a map instance for inter-thread sharing
const sharedMap = map.get("app_status");

// 2. Main thread sets the initial state
log.info("[Main] Setting initial status...");
sharedMap.put("isRunning", true);
sharedMap.put("mode", "idle");
sharedMap.put("config", { version: "1.0.2" });

// 3. Start the Worker
bus.newWorker("status_worker", "/app/code/worker.js");

// 4. Listen for the worker's completion event and verify the final state of the map
bus.on("worker_finished", () => {
  log.info("[Main] Worker finished. Verifying final status:");
  log.info(`- isRunning: ${sharedMap.get("isRunning")}`); // Expected: false
  log.info(`- mode: ${sharedMap.get("mode")}`); // Expected: 'finished'
  log.info(`- workerId: ${sharedMap.get("workerId")}`); // Expected: 'status_worker'
  sharedMap.destroy(); // Clean up
});
```

**`worker.js`**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import map from "./dxmodules/dxMap.js";
import log from "./dxmodules/dxLogger.js";

// 1. Get the same map instance in the Worker
const sharedMap = map.get("app_status");
log.info("[Worker] Worker started.");

// 2. Read the state set by the main thread
const initialMode = sharedMap.get("mode");
log.info(`[Worker] Read initial mode: ${initialMode}`); // Expected: 'idle'

// 3. Modify and add to the state
sharedMap.put("isRunning", false);
sharedMap.put("mode", "finished");
sharedMap.put("workerId", bus.id); // bus.id can get the current worker's id

log.info("[Worker] Status updated.");

// 4. Notify the main thread that the task is complete
bus.fire("worker_finished");
```

---

## dxQueue: Producer-Consumer Data Flow

`dxQueue` implements a global, name-isolated, fixed-capacity FIFO queue. It is the ideal tool for implementing the "producer-consumer" pattern, where one or more threads (producers) put data into the queue, and one or more threads (consumers) take data out of the queue for processing.

### Core Mechanism

Similar to `dxMap`, `dxQueue` is also a thread-safe data structure implemented in C at the low level. It has an internal locking mechanism to ensure the atomicity of `push` and `pop` operations.

### API Overview

1.  **Initialization and Instance Retrieval**

    - `dxQueue.init(name, maxSize)`: **(Main thread only)** Initializes a queue with a specified name and maximum capacity. **Must be initialized by the main thread before use**.
    - `dxQueue.getInstance(name)`: **(Main thread or Worker)** Gets an instance of an already initialized queue.

2.  **Operation Methods**
    - `queue.push(value)`: Adds an element to the end of the queue. Throws an exception if the queue is full.
    - `queue.pop()`: Removes and returns an element from the front of the queue. Returns `null` if the queue is empty.
    - `queue.size()`: Returns the current number of elements in the queue.
    - `queue.isFull()`: Checks if the queue is full.
    - `queue.getMaxSize()`: Gets the maximum capacity of the queue.
    - `queue.destroy()`: Destroys the queue, releasing resources.

### Usage Example

In this example, the main thread acts as a **producer**, continuously generating tasks and putting them into the queue. A `Worker` thread acts as a **consumer**, constantly taking tasks from the queue and processing them.

**`main.js` (Producer)**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import queue from "./dxmodules/dxQueue.js";
import log from "./dxmodules/dxLogger.js";

const TASK_QUEUE_NAME = "task_queue";
const TASK_QUEUE_SIZE = 100;

// 1. Main thread initializes the queue
const taskQueue = queue.init(TASK_QUEUE_NAME, TASK_QUEUE_SIZE);
log.info(
  `[Main] Initialized queue '${TASK_QUEUE_NAME}' with size ${TASK_QUEUE_SIZE}.`
);

// 2. Start the consumer Worker
bus.newWorker("consumer", "/app/code/consumer_worker.js");

// 3. Simulate continuous task production
let taskId = 0;
setInterval(() => {
  if (!taskQueue.isFull()) {
    const task = { id: taskId++, timestamp: Date.now() };
    taskQueue.push(task);
    log.info(`[Main] Produced and pushed task #${task.id}`);
  } else {
    log.info("[Main] Task queue is full. Skipping production.");
  }
}, 500);
```

**`consumer_worker.js` (Consumer)**

```javascript
import queue from "./dxmodules/dxQueue.js";
import log from "./dxmodules/dxLogger.js";

const TASK_QUEUE_NAME = "task_queue";

log.info("[Worker] Consumer worker started.");

// 1. Worker gets the initialized queue instance
const taskQueue = queue.getInstance(TASK_QUEUE_NAME);

// 2. Periodically check and process tasks in the queue
setInterval(() => {
  const task = taskQueue.pop();
  if (task) {
    log.info(`[Worker] Consumed and processing task #${task.id}`);
    // ... execute actual task processing logic here ...
  } else {
    // log.info('[Worker] Queue is empty, waiting for tasks...');
  }
}, 100); // The consumer processes faster than the producer
```

---

## How to Choose: `dxEventBus` vs `dxMap` vs `dxQueue`

| Tool         | Core Purpose           | Data Flow                   | Typical Scenarios                                                                                                                                                                                     |
| :----------- | :--------------------- | :-------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dxEventBus` | **Event Notification** | Publish/Subscribe (1:N)     | - UI button click notifies a Worker to start a task<br/>- Worker completes a task, notifies the main thread to update UI<br/>- System-level event broadcast (e.g., network disconnect)                |
| `dxMap`      | **State Sharing**      | Multi-directional R/W (N:M) | - Sharing global configuration<br/>- Maintaining current device state (e.g., `isRunning`)<br/>- Worker puts calculation results, main thread reads at any time                                        |
| `dxQueue`    | **Task Flow**          | Producer -> Consumer (N:M)  | - Main thread continuously generates tasks, multiple Workers act as consumers for parallel processing<br/>- Multiple sensor Workers produce data, one data processing Worker consumes it sequentially |

**Core Principles for Selection:**

- When you need to **"tell"** another thread that something has happened and want it to respond **immediately** (asynchronously), use `dxEventBus`.
- When you need multiple threads to freely read and write the **same piece of data** to maintain a **shared state**, use `dxMap`.
- When you need to safely and sequentially pass a series of **data or tasks** from one or more "producer" threads to one or more "consumer" threads, use `dxQueue`.
