# dxEventBus-RPC: Cross-Thread Remote Procedure Call

---

## Introduction

On top of `dxEventBus`, DejaOS provides an elegant **RPC (Remote Procedure Call)** mechanism. It allows one thread (the main thread or a Worker) to call a pre-registered function in another thread as if it were a local function, and to asynchronously receive a return value.

### Why is it called RPC?

As you may already know, `Worker`s are essentially threads. However, in DejaOS, each `Worker` is a completely isolated JavaScript Virtual Machine (VM) with its own memory and context, unable to share any data (except via `dxMap`/`dxQueue`). This isolated nature makes them **behave more like independent processes**.

Therefore, when we need to call a function in one thread from another, this pattern is conceptually highly consistent with "Remote Procedure Call (RPC)" in distributed systems. We use the term RPC precisely to emphasize the nature of this **function call across isolated environments**.

RPC is a higher-level abstraction built on top of the `dxEventBus` messaging mechanism. It abstracts the underlying `bus.fire`/`bus.on` event sending and receiving into a more intuitive function call syntax, allowing developers to focus more on business logic rather than tedious message format definitions and state management.

---

## Core Concepts

- **Caller**: The thread that initiates the function call.
- **Callee**: The thread that owns and executes the function.
- **Register**: For a function to be called remotely, the callee **must** first "register" the function with the RPC system, giving it a globally unique name.
- **Addressing**: All RPC calls must specify the ID of the target thread (e.g., `'__main'` or `'my_worker'`). The RPC system will route the request to the correct target via `dxEventBus`.

---

## Call Types and API

The RPC functionality of `dxEventBus` is provided by the `bus.rpc` object, which is automatically initialized in each thread. It mainly includes three operations: `register`, `call`, and `notify`.

### 1. `rpc.register(name, handlerFn)` - Register a Function

Used on the **callee** side to expose a function to other threads.

- `name` String: The registered name of the function. The caller will use this name to make the call.
- `handlerFn` Function: The function to be executed. This function receives an object as an argument and can return a value or a `Promise`.

### 2. `rpc.call(targetId, name, args, [timeout])` - Request/Response Call

Used on the **caller** side to make an asynchronous call that requires a return value.

- `targetId` String: The ID of the target thread.
- `name` String: The name of the registered function to call.
- `args` Object: The arguments to pass to the remote function, which must be an object.
- `timeout` Number: (Optional) The timeout in milliseconds, default is 5000.
- **Returns**: A `Promise`. You can use `.then().catch()` or `async/await` to handle the result. The Promise will resolve with the result if the remote function executes successfully; it will reject with an `Error` if there is an execution error or a timeout.

### 3. `rpc.notify(targetId, name, args)` - One-Way Notification Call

Used on the **caller** side to make a "fire-and-forget" one-way call.

- This method only sends the call request and does not care whether the other party successfully executes it. It **will not have any return value**.
- Suitable for scenarios like logging or triggering background tasks that do not require feedback.

---

## Usage Example

Here is a complete example: the main thread (caller) requests a Worker (callee) to perform a simulated time-consuming calculation and get the result.

**`worker.js` (Callee)**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import log from "./dxmodules/dxLogger.js";

log.info(`[Worker ${bus.id}] started.`);

// 1. Define a function to be exposed
function performCalculation(params) {
  log.info("[Worker] Received calculation task:", params);
  // Simulate a time-consuming operation
  let sum = 0;
  for (let i = 0; i < params.count; i++) {
    sum += i;
  }
  return { result: sum, workerId: bus.id };
}

// 2. Register the function with the RPC system
bus.rpc.register("calculate", performCalculation);

// Register a function for notify
bus.rpc.register("logMessage", (msg) => {
  log.info(`[Worker] Received log notification: ${msg.text}`);
});

log.info('[Worker] RPC functions "calculate" and "logMessage" are registered.');
```

**`main.js` (Caller)**

```javascript
import bus from "./dxmodules/dxEventBus.js";
import log from "./dxmodules/dxLogger.js";

const WORKER_ID = "calculator";

// Start the Worker
bus.newWorker(WORKER_ID, "/app/code/worker.js");

async function runRpcDemo() {
  log.info("[Main] ---- Running RPC Demo ----");

  // Demonstrate notify (fire-and-forget)
  log.info('[Main] Sending a "notify" call to worker...');
  bus.rpc.notify(WORKER_ID, "logMessage", { text: "Hello from main!" });

  // Demonstrate call (request/response) using async/await
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

// Delay execution to ensure the Worker has enough time to start up and register its functions
setTimeout(runRpcDemo, 500);
```

### Inter-Worker RPC

RPC calls between `Worker`s are exactly the same as in the example above. For instance, `worker-A` can call a function registered in `worker-B` via `bus.rpc.call('worker-B', 'someFunction')`. `dxEventBus` will automatically handle the message routing through the main thread.
