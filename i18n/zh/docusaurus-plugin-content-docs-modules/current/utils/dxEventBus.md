# dxEventBus

## 1. 概述

该模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于主线程和 Worker 子线程之间的多线程事件通信。
它使用主线程作为消息中继，实现跨所有线程的全双工事件通知机制。此外，它还内置了基于事件总线的 RPC（远程过程调用）机制，支持跨线程的安全函数调用。

- 支持通过主线程在 Worker 线程之间进行通信。
- 支持主线程到 Worker、Worker 到主线程以及主线程内部通信。
- 支持动态创建和终止事件感知的 Worker。
- **[新增]** 内置 RPC 模块，支持跨线程的请求/响应调用和异步通知。

## 2. 文件

- dxEventBus.js

> - 确保此文件位于项目根目录下的 dxmodules 子目录中。

## 3. 依赖

- dxStd

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 且支持 Worker 的设备。

## 5. 使用方法

### 5.1 基础事件总线 (`bus.on` / `bus.fire`)

**主线程 (`main.js`)**

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

**Worker 线程 (`/app/code/src/worker.js`)**

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

### 5.2 RPC 远程调用 (`bus.rpc`)

**被调用方 (Callee) - 例如 Worker**

```javascript
import bus from "../dxmodules/dxEventBus.js";
import std from "../dxmodules/dxStd.js";

// 注意：建议在 setTimeout 中注册，确保 RPC 模块已完全初始化
std.setTimeout(() => {
  // 注册一个名为 'add' 的函数供外部调用
  bus.rpc.register("add", ({ a, b }) => {
    return a + b;
  });
}, 1000);
```

**调用方 (Caller) - 例如 主线程**

```javascript
import bus from "../dxmodules/dxEventBus.js";
import log from "../dxmodules/dxLogger.js";

async function callWorker() {
  try {
    // 调用 'my_worker_1' 中注册的 'add' 函数
    const result = await bus.rpc.call("my_worker_1", "add", { a: 5, b: 10 });
    log.info("RPC Result:", result); // 输出: 15
  } catch (e) {
    log.error("RPC Error:", e.message);
  }
}

// 确保 Worker 已启动并注册了函数后再调用
setTimeout(callWorker, 2000);
```

## 6. API 参考

### 核心管理 API

#### `bus.newWorker(id, file)`

在主线程中创建一个新的 Worker 并在事件总线中注册它。**此函数必须从主线程调用。** Worker 创建后会自动初始化 RPC 模块。

**参数：**

- `id` (string): Worker 的唯一标识符。不能为空或重复。
- `file` (string): Worker 脚本文件的绝对路径。

**抛出：** 如果 id 无效、文件不存在或从非主线程调用，则抛出 `Error`。

#### `bus.delWorker(id)`

终止一个 Worker 并从事件总线中清理其所有资源，包括移除其所有事件订阅。

**参数：**

- `id` (string): 要终止的 Worker 的唯一标识符。

#### `bus.listWorkers()`

列出所有当前活跃的 Worker ID。

**返回：** `string[]` - Worker ID 数组。

#### `bus.getId()`

返回当前线程的 ID。在主线程中，它总是返回 `__main`。

**返回：** `string|null` - 当前线程的 ID。

---

### 事件总线 API

#### `bus.on(topic, callback)`

订阅事件主题。当该主题的事件被触发时，回调函数会被执行。

**参数：**

- `topic` (string): 要订阅的事件主题。
- `callback` (function): 事件触发时要执行的回调函数。它接收事件数据作为唯一参数。

#### `bus.fire(topic, data)`

触发事件以通知给定主题的所有订阅者。这是一个"触发即忘"操作。

- 在主线程中，订阅者回调函数**同步**执行。
- 对于 Worker 中的订阅者，事件通过 `postMessage` **异步**发送。

**参数：**

- `topic` (string): 要触发的事件主题。
- `data` (\*): 要传递给事件订阅者的数据。

#### `bus.off(topic)`

取消订阅指定的事件主题。该主题下的所有回调函数都将被移除。

**参数：**

- `topic` (string): 要取消订阅的事件主题。

---

### RPC API (`bus.rpc`)

`dxEventBus` 内置了 RPC 模块，可通过 `bus.rpc` 对象访问。

#### `bus.rpc.register(name, handlerFn)`

注册一个函数，使其可被其他线程调用。

**参数：**

- `name` (string): 函数的唯一名称。
- `handlerFn` (function): 处理函数。接收一个参数对象，并返回结果（支持 Promise）。

#### `bus.rpc.call(targetId, name, args, [timeout])`

调用另一个线程中已注册的函数，并等待结果（Request/Response）。

**参数：**

- `targetId` (string): 目标线程 ID（如 `'__main'` 或 Worker ID）。
- `name` (string): 要调用的函数名称。
- `args` (object): 传递给函数的参数对象。默认为 `{}`。
- `timeout` (number): [可选] 超时时间（毫秒）。默认为 5000ms。

**返回：** `Promise<any>` - 解析为远程函数的返回值。

#### `bus.rpc.notify(targetId, name, args)`

发送一个单向通知调用（Fire-and-Forget）。不等待结果，也不返回 Promise。

**参数：**

- `targetId` (string): 目标线程 ID。
- `name` (string): 要调用的函数名称。
- `args` (object): 传递给函数的参数对象。

## 7. 示例

无。
