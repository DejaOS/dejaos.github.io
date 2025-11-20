# dxEventBus：线程安全的事件总线

---

## 简介

在 `Worker` [概述](./overview.md) 中我们提到，DejaOS 推荐使用 `dxEventBus` 作为 `Worker` 间的标准通信方式。`dxEventBus` 是一个基于**发布/订阅模式**的全局事件总线，它构建在 QuickJS 的原生 `postMessage` 机制之上，但提供了更高级、更解耦的抽象，是构建复杂多线程应用的首选。

**核心优势：**

- **完全解耦**: 通信双方无需相互持有引用，只需约定好事件名称（`topic`）即可通信。
- **架构统一**: 无论是主线程与 `Worker`，还是 `Worker` 与 `Worker` 之间，都使用相同的 `bus.on`/`bus.fire` API，形成统一的事件驱动架构。
- **模式灵活**: 可以轻松实现一对一、一对多（广播）等多种通信模式。

---

## 核心机制：主线程转发

`dxEventBus` 的设计遵循了 QuickJS Worker 的底层通信机制，其核心是：**主线程必须作为所有跨线程事件的中转枢纽**。这是由 QuickJS 的 `Worker` 模型决定的，`Worker` 之间无法直接通信，所有消息都必须通过主线程进行收发。`dxEventBus` 在此基础上提供了优雅的封装。

当一个 `Worker` 调用 `bus.fire()` 时，事件并不会直接发送到另一个 `Worker`。相反，它会经历以下流程：

1.  `Worker A` 通过 `postMessage` 将事件发送给**主线程**。
2.  **主线程**接收到事件后，在其内部的订阅者列表中查找该事件的所有订阅者。
3.  如果**主线程**发现 `Worker B` 订阅了该事件，它会再次通过 `postMessage` 将事件转发给 `Worker B`。
4.  `Worker B` 接收到主线程转发来的消息，并最终执行对应的回调函数。

```text
+----------+                  +-------------+                  +----------+
| Worker A |                  | Main Thread |                  | Worker B |
+----------+                  +-------------+                  +----------+
    |                                |                               |
    | bus.fire('topic', data)        |                               |
    |------------------------------->|                               |
    | (底层通过 postMessage)         |                               |
    |                                | 查找 'topic' 的订阅者         |
    |                                |------------------------------>|
    |                                |                               |
    |                                | 发现 Worker B 订阅了该事件    |
    |                                |------------------------------>|
    |                                |                               |
    |                                | 转发事件和数据                |
    |                                |------------------------------>|
    |                                | (底层通过 postMessage)        |
    |                                |                               |
    |                                |                               | 执行 bus.on('topic') 回调
    |                                |                               |------------------------------>|
    |                                |                               |
```

:::danger 性能考量
理解这个核心机制至关重要。这意味着**所有 `Worker` 之间的通信都会经过主线程，并产生两次 `postMessage` 的开销（Worker A -> Main -> Worker B）**。因此，它非常适合业务逻辑的解耦和状态通知，但对于需要极低延迟、高吞吐量的原始数据交换场景，后续文档将介绍的 `dxMap` 可能是更好的选择。
:::

---

## 基础 API

`dxEventBus` 的 API 非常简洁直观。

- `bus.on(topic, callback)`: 订阅一个事件。当任何线程触发了该 `topic` 的事件时，`callback` 函数就会被执行。
  :::info 注意
  在同一个线程（主线程或某个 Worker）内，对同一个 `topic` 多次调用 `bus.on`，**新的回调函数会覆盖旧的回调函数**。每个 `topic` 在单个线程内只对应一个处理函数。
  :::
- `bus.fire(topic, data)`: 触发一个事件。`topic` 是事件名称，`data` 是希望传递的数据对象。
- `bus.off(topic)`: 取消当前线程对某个事件的订阅。
- `bus.newWorker(id, file)`: (仅主线程可用) 创建一个 `Worker` 并自动将其纳入 `dxEventBus` 的管理体系。
  - `id` string: Worker 的唯一标识符，必须**全局唯一**，不能重复。
  - `file` string: Worker 入口脚本的**绝对路径**。DejaOS 的 `Worker` 模型要求将代码预先写入一个 JS 文件，然后通过路径加载，无法动态创建后注入代码。

:::danger 重要提醒
为了确保 `Worker` 能被事件总线正确管理，**必须使用 `bus.newWorker()` 来创建线程**，而不能使用 QuickJS 原生的 `new Worker()`。使用原生接口创建的 `Worker` 将独立于 `dxEventBus` 体系之外，无法接收或发送总线事件。
:::

---

## 使用示例

### 1. 主线程与 Worker 通信

这是最常见的场景。主线程分发任务给 `Worker`，`Worker` 完成后通知主线程。

**`main.js` (主线程)**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import log from "./dxmodules/dxLogger.js";

log.info("Main thread started.");

// 1. 使用 bus.newWorker 创建并启动 worker
bus.newWorker("task-worker", "/app/code/worker.js");

// 2. 监听来自 worker 的完成事件
bus.on("task-complete", (result) => {
  log.info("[Main] Received result from worker:", result);
  // 可以在这里更新 UI 或执行其他操作
});

// 3. 200ms 后，向 worker 派发一个任务
setTimeout(() => {
  log.info("[Main] Firing start-task event to worker...");
  bus.fire("start-task", { seconds: 5 });
}, 200);
```

**`worker.js` (工作线程)**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import log from "./dxmodules/dxLogger.js";

log.info(`[Worker ${bus.id}] started and is ready.`);

// 1. 监听来自主线程的任务事件
bus.on("start-task", (task) => {
  log.info(`[Worker] Received task: wait for ${task.seconds} seconds.`);

  // 模拟一个耗时操作
  setTimeout(() => {
    const result = { status: "done", processedIn: bus.id };
    log.info("[Worker] Task finished, firing task-complete event...");
    // 2. 任务完成，触发事件通知主线程
    bus.fire("task-complete", result);
  }, task.seconds * 1000);
});
```

### 2. Worker 与 Worker 之间通信

如核心机制所述，这种通信是**通过主线程间接完成的**。

**`main.js` (主线程)**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import log from "./dxmodules/dxLogger.js";

// 创建两个 worker
bus.newWorker("worker-A", "/app/code/workerA.js");
bus.newWorker("worker-B", "/app/code/workerB.js");

log.info("[Main] worker-A and worker-B have been started.");
// 主线程在这里仅作启动，之后便作为事件转发枢纽，无需额外代码。
```

**`workerA.js`**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import log from "./dxmodules/dxLogger.js";

// 3秒后，向 worker-B 发送消息
setTimeout(() => {
  log.info("[Worker-A] Firing event to worker-B...");
  bus.fire("data-for-b", { message: "Hello from Worker A!" });
}, 3000);
```

**`workerB.js`**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import log from "./dxmodules/dxLogger.js";

// 监听来自 worker-A 的事件
bus.on("data-for-b", (data) => {
  log.info(`[Worker-B] Received data: "${data.message}"`);
});
```

### 3. Worker 内部通信

`dxEventBus` 也可以在单个 `Worker` 内部作为普通事件发射器使用，将 `Worker` 内部的不同逻辑模块解耦。

:::tip
虽然可以实现，但这通常不是必要的。在单个线程内部，直接的函数调用通常更简单、高效。仅在需要深度解耦 `Worker` 内部的复杂模块时才应考虑此用法。
:::

**`some-worker.js`**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import log from "./dxmodules/dxLogger.js";

// 模块 B 负责监听
function moduleB() {
  bus.on("internal-notification", (data) => {
    log.info(`[Module B] Received internal event: ${data.info}`);
  });
}

// 模块 A 负责触发
function moduleA() {
  log.info("[Module A] Firing internal event...");
  bus.fire("internal-notification", { info: "Something happened in Module A" });
}

// 初始化
moduleB();
moduleA();
```
