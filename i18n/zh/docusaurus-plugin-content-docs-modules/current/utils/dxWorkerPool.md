# dxWorkerPool

## 1. 概述

`dxWorkerPool` 模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于管理工作线程池来处理并发任务，防止多线程应用程序中的性能瓶颈。

该模块提供**线程安全的工作线程任务队列系统**。它监听来自 `dxEventBus` 的指定主题事件，并将任务分发给可用工作线程池进行处理。

**主要特性：**
- 管理工作线程池来处理并发任务。
- 自动将共享队列中的任务分发给可用工作线程。
- 当所有工作线程都忙碌时，在队列中缓冲传入任务。
- 设计为全局单例；应仅初始化一次。
- 事件驱动的任务分派，高效且低空闲 CPU 使用率。
- 简单直观的 API，适用于主线程初始化和工作线程实现。

## 2. 文件

- `dxWorkerPool.js` - JavaScript 模块包装器和实现。

> 确保此文件包含在项目根目录下的 `dxmodules` 子目录中。

## 3. 依赖

- `dxStd.js`
- `dxLogger.js`
- `dxEventBus.js`（初始化时必须传递）

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备

## 5. API 参考

### `pool.init(file, bus, topics, count, maxsize)`
初始化工作线程池。这是模块的核心函数，必须在主线程中调用一次，然后才能处理任何任务。

- `file` `{string}`: **（必需）** 工作线程脚本文件的绝对路径（例如 '/app/code/src/worker.js'）。
- `bus` `{Object}`: **（必需）** 用于任务分发的 `dxEventBus` 实例。
- `topics` `{string[]}`: **（必需）** 要订阅的事件总线主题数组。来自这些主题的任务将由池处理。不能为空数组。
- `count` `{number}`: *[可选]* 池中工作线程的数量。默认为 `2`。必须为正数。
- `maxsize` `{number}`: *[可选]* 任务队列的最大大小。如果队列已满，最旧的任务将被丢弃。默认为 `100`。
- **抛出**: 如果从工作线程调用、多次初始化或参数无效，则抛出 `Error`。

### `pool.callback(callbackFunction)`
为工作线程注册任务处理函数。必须从工作线程脚本中调用。

- `callbackFunction` `{function(Object): void}`: **（必需）** 为每个任务执行的回调函数。传递给函数的任务对象包含 `{ topic: string, data: * }`。
- **抛出**: 如果回调不是函数，或从主线程调用此方法，则抛出 `Error`。

### `pool.getWorkerId()`
返回当前工作线程的唯一 ID，如果从主线程调用则返回 'main'。这对于工作线程脚本中的日志记录和调试很有用。

- **返回**: `{string}` 工作线程的唯一 ID（例如 'pool__id0'）或 'main'。

## 6. 使用示例

### 主线程 (`main.js`)
```javascript
import pool from 'dxmodules/dxWorkerPool.js';
import eventBus from 'dxmodules/dxEventBus.js';
import log from 'dxmodules/dxLogger.js';
import std from 'dxmodules/dxStd.js';

// 1. 初始化工作线程池
const workerFile = '/app/code/src/worker.js';
const topics = ['image.process', 'data.upload'];
const workerCount = 4; // 使用 4 个工作线程
const queueSize = 50;

log.info(`Initializing pool with ${workerCount} workers...`);
pool.init(workerFile, eventBus, topics, workerCount, queueSize);
log.info("Worker pool initialized.");

// 2. 触发事件由池处理
log.info("Firing 10 tasks to the pool...");
for (let i = 1; i <= 10; i++) {
    const topic = i % 2 === 0 ? topics[0] : topics[1];
    const payload = { taskId: i, timestamp: Date.now() };
    eventBus.fire(topic, payload);
}
log.info("All tasks fired. Workers will process them concurrently.");
```

### 工作线程脚本 (`worker.js`)
```javascript
import pool from 'dxmodules/dxWorkerPool.js';
import log from 'dxmodules/dxLogger.js';
import std from 'dxmodules/dxStd.js';

// 1. 注册回调函数来处理任务。
pool.callback(function(task) {
    const workerId = pool.getWorkerId();
    log.info(`[${workerId}] Started task on topic '${task.topic}'.`);
    log.info(`[${workerId}] Data: ${JSON.stringify(task.data)}`);

    // 2. 模拟长时间运行的任务。
    const workTime = Math.floor(Math.random() * 500) + 100; // 100-600ms
    std.sleep(workTime);

    log.info(`[${workerId}] Finished task in ${workTime}ms.`);
});
```

## 7. 线程安全和任务分发

该模块设计为线程安全并自动管理任务分发。

- `init` 函数只能从主线程调用。
- `callback` 函数只能从工作线程调用。
- 当在订阅主题上触发事件时，任务被添加到内部队列。
- 模块的事件驱动分派器将队列中的任务分配给下一个可用（空闲）的工作线程。
- 这确保任务在池中的最大工作线程数内并发处理，后续任务高效排队，无需忙等待或轮询。

## 8. 演示
无