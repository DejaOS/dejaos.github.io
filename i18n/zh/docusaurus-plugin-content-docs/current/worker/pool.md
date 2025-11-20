# dxWorkerPool: 线程池管理

---

## 简介

在处理大量并发、独立的任务时，为每个任务都手动创建一个新的 `Worker` 是非常低效的。线程的创建和销毁本身会消耗系统资源，并且无限制地创建线程还会因资源竞争导致性能下降。

`dxWorkerPool` 提供了一个优雅的解决方案。它是一个**线程池**管理器，专为处理来自 `dxEventBus` 的事件流而设计。

**核心思想**：
`dxWorkerPool` 预先创建并维护一组固定数量的 `Worker`。当主线程通过 `dxEventBus` 触发一个被监听的事件时，线程池会自动将这个事件作为一个“任务”，从其内部的任务队列中取出，并将其分配给一个当前空闲的 `Worker` 去处理。

**核心优势**：

- **资源复用**: 通过复用 `Worker` 线程，避免了频繁创建和销毁线程带来的性能开销。
- **负载均衡**: 自动将任务分发给空闲的 `Worker`，实现了简单的负载均衡。
- **流量控制**: 内置任务队列，可以在任务量超过 `Worker` 处理能力时进行缓冲，防止系统过载。
- **简化开发**: 将复杂的任务分发和 `Worker` 管理逻辑完全封装，开发者只需关注业务本身。

---

## 工作流程

`dxWorkerPool` 的工作流程完全是事件驱动的：

```text
+-------------+        +------------+        +--------------+        +----------+
| Main Thread |        | dxEventBus |        | dxWorkerPool |        | Worker 1 |
+-------------+        +------------+        +--------------+        +----------+
       |                     |                      |                      |
       | bus.fire('topic')   |                      |                      |
       |-------------------->|                      |                      |
       |                     | on('topic', ...)     |                      |
       |                     |--------------------->|                      |
       |                     |                      | 将任务加入内部队列   |
       |                     |                      |--------------------->|
       |                     |                      |                      |
       |                     |                      | (发现空闲) 分配任务  |
       |                     |                      |--------------------->|
       |                     |                      |                      |
       |                     |                      |                      | 执行 pool.callback()
       |                     |                      |                      |-------------------->|
       |                     |                      |                      |
       |                     |                      | 通知任务完成         |
       |                     |                      |<---------------------|
       |                     |                      |                      |
       |                     |                      | (变为空闲)           |
       |                     |                      |--------------------->|
```

---

## API 概览

### 主线程 API

#### `pool.init(file, bus, topics, [count], [maxsize])`

(仅主线程可用) 初始化并启动线程池。这是使用线程池的第一步，且只能调用一次。

- `file` string: Worker 脚本的**绝对路径**。
- `bus` object: `dxEventBus` 的实例，线程池将用它来监听任务。
- `topics` `string[]`: 一个字符串数组，定义了线程池需要监听的所有 `dxEventBus` 主题。任何发送到这些主题的事件都将被视为任务。
- `count` number: (可选) 线程池中的 `Worker` 数量，默认为 2。
- `maxsize` number: (可选) 内部任务队列的最大长度，默认为 100。如果队列已满，新任务会顶掉最老的任务。

### Worker 线程 API

#### `pool.callback(handlerFn)`

(仅 Worker 线程可用) 在 Worker 脚本中注册用于处理任务的回调函数。

- `handlerFn` Function: 处理函数。当 `Worker` 从线程池接收到一个任务时，该函数会被调用。它接收一个 `task` 对象作为参数，其结构为 `{ topic: string, data: any }`。

#### `pool.getWorkerId()`

(主线程和 Worker 线程均可用) 获取当前线程的 ID。在主线程中返回 `'main'`，在 Worker 线程中返回由线程池分配的唯一 ID (例如 `'pool__id0'`)。

---

## 使用示例

以下示例展示了如何初始化一个线程池来处理来自两个不同主题的任务。

**`worker.js` (任务处理器)**

```javascript
import pool from "../dxmodules/dxWorkerPool.js";
import log from "../dxmodules/dxLogger.js";
import std from "../dxmodules/dxStd.js";

// 1. 注册一个回调函数来处理所有被分配到这个 Worker 的任务
pool.callback(function (task) {
  const workerId = pool.getWorkerId();
  log.info(`[${workerId}] 开始处理来自 '${task.topic}' 的任务`);
  log.info(`[${workerId}] 任务数据: ${JSON.stringify(task.data)}`);

  // 2. 模拟耗时操作
  const workTime = Math.floor(Math.random() * 200) + 50; // 50-250ms
  std.sleep(workTime);

  log.info(`[${workerId}] 任务处理完毕，耗时 ${workTime}ms.`);
});

log.info(`Worker ${pool.getWorkerId()} 已就绪，等待任务...`);
```

**`main.js` (任务发布者)**

```javascript
import pool from "../dxmodules/dxWorkerPool.js";
import eventBus from "../dxmodules/dxEventBus.js";
import log from "../dxmodules/dxLogger.js";
import std from "../dxmodules/dxStd.js";

log.info("----------- dxWorkerPool 示例 -----------");

// 1. 定义线程池配置
const workerFile = "/app/code/src/worker.js";
const topicsToProcess = ["image.resize", "log.upload"];
const workerCount = 3;
const queueSize = 10;

// 2. 初始化线程池
log.info(
  `初始化 ${workerCount} 个 Worker 来处理 [${topicsToProcess.join(
    ", "
  )}] 主题的任务`
);
pool.init(workerFile, eventBus, topicsToProcess, workerCount, queueSize);
log.info("线程池初始化成功.");

// 3. 通过 dxEventBus 触发一系列事件，这些事件将由线程池自动处理
const taskCount = 8;
log.info(`\n--- 派发 ${taskCount} 个任务到事件总线... ---`);
for (let i = 1; i <= taskCount; i++) {
  // 轮流向不同主题发送任务
  const topic = i % 2 === 0 ? topicsToProcess[0] : topicsToProcess[1];
  const payload = { taskId: i, message: `任务详情 #${i}` };

  log.info(`-> [Main] 触发事件到 '${topic}'`);
  eventBus.fire(topic, payload);
  std.sleep(50); // 短暂休眠，让日志更清晰
}

log.info(
  `\n--- ${taskCount} 个任务已全部派发。请观察 Worker 日志查看任务分配情况。---`
);
```
