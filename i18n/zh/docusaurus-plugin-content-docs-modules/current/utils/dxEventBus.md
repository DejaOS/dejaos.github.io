# dxEventBus

## 1. 概述

该模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于主线程和 Worker 子线程之间的多线程事件通信。
它使用主线程作为消息中继，实现跨所有线程的全双工事件通知机制。

- 支持通过主线程在 Worker 线程之间进行通信。
- 支持主线程到 Worker、Worker 到主线程以及主线程内部通信。
- 支持动态创建和终止事件感知的 Worker。

## 2. 文件

- dxEventBus.js

> - 确保此文件位于项目根目录下的 dxmodules 子目录中。

## 3. 依赖

- dxStd

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 且支持 Worker 的设备。

## 5. 使用方法

### 主线程 (`main.js`)

```javascript
import bus from "../dxmodules/dxEventBus.js";
import log from "../dxmodules/dxLogger.js";

// 1. 创建一个新的 Worker
bus.newWorker("my_worker_1", "/app/code/src/worker.js");

// 2. 监听来自任何 Worker 的 'worker_to_main' 事件
bus.on("worker_to_main", (data) => {
  log.info(`[Main] Received from worker:`, data);
});

// 3. 向所有订阅者（包括 Worker）触发事件
log.info("[Main] Firing 'main_to_worker' event...");
bus.fire("main_to_worker", { message: "Hello from main thread!" });
```

### Worker 线程 (`/app/code/src/worker.js`)

```javascript
import bus from "../dxmodules/dxEventBus.js";
import log from "../dxmodules/dxLogger.js";

// 1. 监听来自主线程的 'main_to_worker' 事件
bus.on("main_to_worker", (data) => {
  log.info(`[Worker ${bus.getId()}] Received from main:`, data);

  // 2. 收到消息后，向主线程回复事件
  bus.fire("worker_to_main", { reply: "Hi, main! I got your message." });
});
```

## 6. API 参考

### `bus.newWorker(id, file)`

在主线程中创建一个新的 Worker 并在事件总线中注册它。**此函数必须从主线程调用。**

**参数：**

- `id` (string): Worker 的唯一标识符。不能为空或重复。
- `file` (string): Worker 脚本文件的绝对路径。

**返回：** `void`

**抛出：** 如果 id 无效、文件不存在或从非主线程调用，则抛出 `Error`。

### `bus.delWorker(id)`

终止一个 Worker 并从事件总线中清理其所有资源，包括移除其所有事件订阅。

**参数：**

- `id` (string): 要终止的 Worker 的唯一标识符。

**返回：** `void`

### `bus.fire(topic, data)`

触发事件以通知给定主题的所有订阅者。这是一个"触发即忘"操作。

- 在主线程中，订阅者回调函数**同步**执行。
- 对于 Worker 中的订阅者，事件通过 `postMessage` **异步**发送。

**参数：**

- `topic` (string): 要触发的事件主题。
- `data` (\*): 要传递给事件订阅者的数据。

**返回：** `void`

### `bus.on(topic, callback)`

订阅事件主题。当该主题的事件被触发时，回调函数会被执行。

**参数：**

- `topic` (string): 要订阅的事件主题。
- `callback` (function): 事件触发时要执行的回调函数。它接收事件数据作为唯一参数。

**返回：** `void`

### `bus.getId()`

返回当前线程的 ID。在主线程中，它总是返回 `__main`。

**返回：** `string|null` - 当前线程的 ID。

**注意：** 在 Worker 中，如果此函数在脚本的顶层调用（在事件总线完全初始化之前），它可能返回 `null`。在事件处理程序回调中调用此函数是可靠的。

## 7. 示例

无。
