# dxEventBus-RPC: 跨线程远程过程调用

---

## 简介

在 `dxEventBus` 的基础上，DejaOS 提供了一套优雅的 **RPC (Remote Procedure Call)** 机制。它允许一个线程（主线程或 Worker）像调用本地函数一样，调用另一个线程中预先注册好的函数，并异步地获取返回值。

### 为什么称之为 RPC？

您可能已经知道，`Worker` 本质上是线程。但在 DejaOS 中，每个 `Worker` 都是一个完全隔离的 JavaScript 虚拟机（VM），拥有独立的内存和上下文，无法共享任何数据（`dxMap`/`dxQueue` 除外）。这种隔离的特性使它们**在行为上更像独立的进程**。

因此，当我们需要在一个线程中调用另一个线程的函数时，这种模式与分布式系统中的“远程过程调用 (RPC)” 在概念上高度一致。我们使用 RPC 这个术语，正是为了强调这种**跨越隔离环境的函数调用**的本质。

RPC 是对 `dxEventBus` 消息传递机制的更高层封装。它将底层的 `bus.fire`/`bus.on` 事件收发，抽象成了更符合直觉的函数调用语法，让开发者可以更专注于业务逻辑，而不是烦琐的消息格式定义和状态管理。

---

## 核心概念

- **调用方 (Caller)**: 发起函数调用的线程。
- **被调用方 (Callee)**: 拥有并执行函数的线程。
- **注册 (Register)**: 为了让一个函数能被远程调用，被调用方**必须**预先将该函数“注册”到 RPC 系统中，给它一个全局唯一的名称。
- **寻址 (Addressing)**: 所有 RPC 调用都必须指定目标线程的 ID（例如 `'__main'` 或 `'my_worker'`)，RPC 系统会通过 `dxEventBus` 将请求路由到正确的目标。

---

## 调用类型与 API

`dxEventBus` 的 RPC 功能由每个线程中自动初始化的 `bus.rpc` 对象提供。它主要包含三种操作：`register`, `call`, 和 `notify`。

### 1. `rpc.register(name, handlerFn)` - 注册函数

在**被调用方**使用，用于将一个函数暴露给其他线程。

- `name` string: 注册的函数名，调用方将通过此名称发起调用。
- `handlerFn` Function: 要执行的函数。该函数接收一个对象作为参数，并可以返回一个值或一个 `Promise`。

### 2. `rpc.call(targetId, name, args, [timeout])` - 请求/响应调用

在**调用方**使用，用于发起一个需要返回值的异步调用。

- `targetId` string: 目标线程的 ID。
- `name` string: 要调用的已注册的函数名。
- `args` object: 传递给远程函数的参数，必须是一个对象。
- `timeout` number: (可选) 超时时间，默认为 5000 毫秒。
- **返回值**: `Promise`。你可以使用 `.then().catch()` 或 `async/await` 来处理返回结果。如果远程函数执行成功，Promise 会 resolve 结果；如果执行出错或超时，Promise 会 reject 一个 `Error`。

### 3. `rpc.notify(targetId, name, args)` - 单向通知调用

在**调用方**使用，用于发起一个“发后不理”(Fire-and-Forget) 的单向调用。

- 该方法只负责将调用请求发送出去，不关心对方是否成功执行，也**不会有任何返回值**。
- 适用于日志记录、触发无需反馈的后台任务等场景。

---

## 使用示例

下面是一个完整的示例：主线程 (调用方) 请求 Worker (被调用方) 执行一个模拟的耗时计算，并获取结果。

**`worker.js` (被调用方 Callee)**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import log from "./dxmodules/dxLogger.js";

log.info(`[Worker ${bus.id}] started.`);

// 1. 定义一个要暴露的函数
function performCalculation(params) {
  log.info("[Worker] Received calculation task:", params);
  // 模拟耗时操作
  let sum = 0;
  for (let i = 0; i < params.count; i++) {
    sum += i;
  }
  return { result: sum, workerId: bus.id };
}

// 2. 将函数注册到 RPC 系统
bus.rpc.register("calculate", performCalculation);

  // 注册一个用于 notify 的函数
  bus.rpc.register("logMessage", (msg) => {
    log.info(`[Worker] Received log notification: ${msg.text}`);
  });

  log.info(
    '[Worker] RPC functions "calculate" and "logMessage" are registered.'
  );
}, 1000);
```

**`main.js` (调用方 Caller)**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import log from "./dxmodules/dxLogger.js";

const WORKER_ID = "calculator";

// 启动 Worker
bus.newWorker(WORKER_ID, "/app/code/worker.js");

async function runRpcDemo() {
  log.info("[Main] ---- Running RPC Demo ----");

  // 演示 notify (发后不理)
  log.info('[Main] Sending a "notify" call to worker...');
  bus.rpc.notify(WORKER_ID, "logMessage", { text: "Hello from main!" });

  // 演示 call (请求/响应)，使用 async/await
  try {
    log.info('[Main] Sending a "call" request to worker...');
    const response = await bus.rpc.call(WORKER_ID, "calculate", {
      count: 100000,
    });

    log.info("---------------------------------");
    log.info("[Main] ✅ RPC call successful!");
    log.info("[Main] Response from worker:", response);
    log.info("---------------------------------");
  } catch (error) {
    log.error("---------------------------------");
    log.error("[Main] ❌ RPC call failed:", error.message);
    log.info("---------------------------------");
  }

  log.info("[Main] ---- RPC Demo Finished ----");
}

setTimeout(runRpcDemo, 2500);
```

### Worker 间 RPC

`Worker` 之间的 RPC 调用与上述示例完全一样。例如，`worker-A` 可以通过 `bus.rpc.call('worker-B', 'someFunction')` 来调用 `worker-B` 中注册的函数。`dxEventBus` 会自动处理通过主线程的消息路由。
