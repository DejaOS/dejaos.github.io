# dxMap & dxQueue: 高性能线程间数据共享

---

## 简介

在 DejaOS 的多线程模型中，`dxEventBus` 和 `dxMap`/`dxQueue` 扮演着不同但互补的角色。理解它们的本质区别至关重要：

- `dxEventBus` 解决的是**线程间的通信与通知**问题。它的核心是**“事件”**，用于告诉其他线程“某件事刚刚发生了”。数据只是事件的附带信息。
- `dxMap` 和 `dxQueue` 解决的是**线程间的数据共享**问题。它们的核心是**“数据”**本身，提供了一个所有线程都可以访问的共享内存容器。其他线程可以随时存取最新的数据状态，而无需关心数据是何时、由谁写入的。

虽然 `dxEventBus` 的底层 `postMessage` 机制因数据克隆会带来一些性能开销，但这并非选择 `dxMap`/`dxQueue` 的唯一原因。**真正的选择依据在于你的意图：你是想“发送一个通知”，还是想“共享一份数据”？**

DejaOS 提供了 `dxMap` 和 `dxQueue` 这两个基于原生 C/C++ 实现的高性能、线程安全的数据共享模块，它们允许所有线程访问同一块内存，实现了**零拷贝（Zero-Copy）**的数据交换。

- **`dxMap`**: 一个线程安全的**键值存储（Key-Value Store）**，用于在多个线程间共享**状态**。
- **`dxQueue`**: 一个线程安全的**先进先出队列（FIFO Queue）**，用于在多个线程间实现**生产者-消费者模式**的数据流。

---

## dxMap: 线程安全的共享状态

`dxMap` 提供了一个全局的、按主题（topic）隔离的键值存储区。你可以把它想象成一个所有线程都可以同时读写的全局对象。

### 核心机制

`dxMap` 由底层 C 实现，确保了所有 `put`/`get`/`del` 等操作都是原子性的，从而保证了线程安全。当你从不同的线程访问同一个 topic 的 `dxMap` 实例时，它们操作的都是同一个底层数据结构。

### API 概览

1.  **获取/创建实例**

    - `dxMap.get(topic)`: 获取一个指定 `topic` 名称的 map 实例。如果该 topic 的 map 不存在，它会在第一次 `put` 操作时被隐式创建。

2.  **操作方法**
    - `map.put(key, value)`: 设置一个键值对。支持字符串、数字、布尔值、对象和数组。如果 `value` 为 `null` 或 `undefined`，则会删除该 `key`。
    - `map.get(key)`: 获取指定 `key` 的值。如果 `key` 不存在，返回 `undefined`。
    - `map.has(key)`: 检查是否存在指定的 `key`。
    - `map.del(key)`: 删除一个键值对。
    - `map.keys()`: 返回该 topic 下所有 `key` 的数组。
    - `map.destroy()`: 销毁整个 topic 的 map，释放资源。

### 使用示例

这个例子展示了主线程初始化一个状态，`Worker` 线程读取、修改并增加这个状态，最后主线程验证变更。

**`main.js`**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import map from "./dxmodules/dxMap.js";
import log from "./dxmodules/dxLogger.js";

// 1. 获取一个用于线程间共享的 map 实例
const sharedMap = map.get("app_status");

// 2. 主线程设置初始状态
log.info("[Main] Setting initial status...");
sharedMap.put("isRunning", true);
sharedMap.put("mode", "idle");
sharedMap.put("config", { version: "1.0.2" });

// 3. 启动 Worker
bus.newWorker("status_worker", "/app/code/worker.js");

// 4. 监听 Worker 完成的事件，并验证 map 的最终状态
bus.on("worker_finished", () => {
  log.info("[Main] Worker finished. Verifying final status:");
  log.info(`- isRunning: ${sharedMap.get("isRunning")}`); // 预期: false
  log.info(`- mode: ${sharedMap.get("mode")}`); // 预期: 'finished'
  log.info(`- workerId: ${sharedMap.get("workerId")}`); // 预期: 'status_worker'
  sharedMap.destroy(); // 清理
});
```

**`worker.js`**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import map from "./dxmodules/dxMap.js";
import log from "./dxmodules/dxLogger.js";

// 1. 在 Worker 中获取同一个 map 实例
const sharedMap = map.get("app_status");
log.info("[Worker] Worker started.");

// 2. 读取主线程设置的状态
const initialMode = sharedMap.get("mode");
log.info(`[Worker] Read initial mode: ${initialMode}`); // 预期: 'idle'

// 3. 修改和增加状态
sharedMap.put("isRunning", false);
sharedMap.put("mode", "finished");
sharedMap.put("workerId", bus.id); // bus.id 可以获取当前worker的id

log.info("[Worker] Status updated.");

// 4. 通知主线程任务已完成
bus.fire("worker_finished");
```

---

## dxQueue: 生产者-消费者数据流

`dxQueue` 实现了一个全局的、按名称隔离的、固定容量的先进先出队列。它是实现“生产者-消费者”模式的理想工具，一个或多个线程（生产者）向队列中放入数据，一个或多个线程（消费者）从队列中取出数据进行处理。

### 核心机制

与 `dxMap` 类似，`dxQueue` 也是由底层 C 实现的线程安全数据结构。它内部带有锁机制，确保 `push` 和 `pop` 操作的原子性。

### API 概览

1.  **初始化与获取实例**

    - `dxQueue.init(name, maxSize)`: **（仅主线程）** 初始化一个指定名称和最大容量的队列。**必须在使用前由主线程初始化**。
    - `dxQueue.getInstance(name)`: **（主线程或 Worker）** 获取一个已初始化的队列实例。

2.  **操作方法**
    - `queue.push(value)`: 向队尾添加一个元素。如果队列已满，会抛出异常。
    - `queue.pop()`: 从队头取出一个元素并返回。如果队列为空，返回 `null`。
    - `queue.size()`: 返回队列中当前的元素数量。
    - `queue.isFull()`: 检查队列是否已满。
    - `queue.getMaxSize()`: 获取队列的最大容量。
    - `queue.destroy()`: 销毁该队列，释放资源。

### 使用示例

这个例子中，主线程作为**生产者**，持续生成任务并放入队列。`Worker` 线程作为**消费者**，不断从队列中取出任务并处理。

**`main.js` (生产者)**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import queue from "./dxmodules/dxQueue.js";
import log from "./dxmodules/dxLogger.js";

const TASK_QUEUE_NAME = "task_queue";
const TASK_QUEUE_SIZE = 100;

// 1. 主线程初始化队列
const taskQueue = queue.init(TASK_QUEUE_NAME, TASK_QUEUE_SIZE);
log.info(
  `[Main] Initialized queue '${TASK_QUEUE_NAME}' with size ${TASK_QUEUE_SIZE}.`
);

// 2. 启动消费者 Worker
bus.newWorker("consumer", "/app/code/consumer_worker.js");

// 3. 模拟持续产生任务
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

**`consumer_worker.js` (消费者)**

```javascript
import queue from "./dxmodules/dxQueue.js";
import log from "./dxmodules/dxLogger.js";

const TASK_QUEUE_NAME = "task_queue";

log.info("[Worker] Consumer worker started.");

// 1. Worker 获取已初始化的队列实例
const taskQueue = queue.getInstance(TASK_QUEUE_NAME);

// 2. 周期性地检查并处理队列中的任务
setInterval(() => {
  const task = taskQueue.pop();
  if (task) {
    log.info(`[Worker] Consumed and processing task #${task.id}`);
    // ... 在这里执行实际的任务处理逻辑 ...
  } else {
    // log.info('[Worker] Queue is empty, waiting for tasks...');
  }
}, 100); // 消费者处理速度比生产者快
```

---

## 如何选择：`dxEventBus` vs `dxMap` vs `dxQueue`

| 工具         | 核心目的     | 数据流向               | 典型场景                                                                                                            |
| :----------- | :----------- | :--------------------- | :------------------------------------------------------------------------------------------------------------------ |
| `dxEventBus` | **事件通知** | 发布/订阅 (1:N)        | - UI 按钮点击，通知 Worker 开始任务<br/>- Worker 完成任务，通知主线程更新 UI<br/>- 系统级事件广播（如网络断开）     |
| `dxMap`      | **状态共享** | 多向读写 (N:M)         | - 共享全局配置<br/>- 维护设备当前状态（如 `isRunning`）<br/>- Worker 将计算结果放入，主线程随时读取                 |
| `dxQueue`    | **任务流转** | 生产者 -> 消费者 (N:M) | - 主线程持续生成任务，多个 Worker 作为消费者并行处理<br/>- 多个传感器 Worker 产生数据，一个数据处理 Worker 顺序消费 |

**选择的核心原则：**

- 当你需要**“告诉”**另一个线程发生了什么事，并且希望它**立即**（异步地）做出响应时，使用 `dxEventBus`。
- 当你需要让多个线程自由地读写**同一份数据**，以维持一个**共享的状态**时，使用 `dxMap`。
- 当你需要将一系列**数据或任务**从一个或多个“生产者”线程安全地、按顺序地传递给一个或多个“消费者”线程时，使用 `dxQueue`。
