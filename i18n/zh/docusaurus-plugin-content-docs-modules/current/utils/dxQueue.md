# dxQueue

## 1. 概述

`dxQueue` 模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于创建线程安全、基于主题的内存 FIFO（先进先出）队列。

该模块提供**线程安全、基于主题的内存队列系统**。每个主题（或队列名称）都是一个独立的队列，允许多个 JavaScript 线程安全地推送和弹出数据而不会发生冲突。

**主要特性：**

- 基于主题的 FIFO 队列，具有自动命名空间隔离
- 多线程环境的线程安全操作
- 各种数据类型的自动序列化/反序列化
- 支持字符串、数字、布尔值、对象和数组数据类型
- 固定大小队列以防止不受控制的内存增长并管理背压
- 显式初始化和生命周期管理（`init`、`getInstance`、`destroy`、`clearAll`）

## 2. 文件

- `dxQueue.js` - JavaScript 模块包装器
- `libvbar-m-dxqueue.so` - 底层 C 语言实现

> - 确保所有文件都包含在项目根目录下的 `dxmodules` 子目录中。

## 3. 依赖

- `dxMap.js`

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备

## 5. API 参考

### `queue.init(name, maxSize)`

使用特定名称和最大大小初始化新队列。在使用队列之前必须调用此方法。

- `name` `{string}`: **（必需）** 队列的唯一名称。不能为 null 或空。
- `maxSize` `{number}`: **（必需）** 队列可以容纳的最大项目数。必须是非负整数。使用 `0` 表示无限制大小。
- **返回**: `{DxQueueInstance}` 一个对象，具有与新创建的队列交互的方法。
- **抛出**: 如果名称或 `maxSize` 无效，或已存在同名队列，则抛出 `Error`。

### `queue.getInstance(name)`

获取先前初始化的队列实例。这是在初始化后从任何线程访问队列的标准方法。

- `name` `{string}`: **（必需）** 要检索的队列名称。
- **返回**: `{DxQueueInstance}` 一个对象，具有与指定队列交互的方法。
- **抛出**: 如果名称无效或队列未使用 `init()` 初始化，则抛出 `Error`。

### `queue.clearAll()`

清除所有队列，从每个队列中移除所有元素并释放其关联的内存。队列模块本身保持初始化状态，调用此方法后可以创建新队列。

- **警告**: 这是一个全局操作，影响所有队列。要销毁单个队列，请在实例上使用 `.destroy()` 方法。

### 队列实例方法

由 `queue.init()` 或 `queue.getInstance()` 返回的每个队列实例提供以下方法：

#### `instance.push(value)`

将项目添加到队列末尾。

- `value` `{*}`: 要添加的值。支持的类型：字符串、数字、布尔值、对象、数组。不支持函数、`null` 和 `undefined`。
- **返回**: `{boolean}` 成功时返回 `true`。
- **抛出**: 如果队列已满或值是不支持的类型，则抛出 `Error`。

#### `instance.pop()`

移除并返回队列开头的项目。

- **返回**: `{*}` 队列开头的项目，如果队列为空则返回 `null`。
- **注意**: 返回值会自动反序列化为原始类型。

#### `instance.size()`

返回队列中当前项目数。

- **返回**: `{number}` 队列中的项目数。

#### `instance.getMaxSize()`

返回队列的最大大小。

- **返回**: `{number}` 队列可以容纳的最大项目数。

#### `instance.isFull()`

检查队列是否已达到其最大大小。

- **返回**: `{boolean}` 如果队列已满则返回 `true`，否则返回 `false`。

#### `instance.destroy()`

销毁此特定队列，删除其所有项目并释放关联的内存。

- **返回**: `{boolean}` 成功时返回 `true`，如果队列已被销毁或未找到则返回 `false`。
- **警告**: 调用 destroy 后，不应再使用此实例。

## 6. 使用示例

```javascript
import queue from "dxmodules/dxQueue.js";
import * as log from "dxmodules/dxLogger.js";

// 1. 为用户事件初始化一个最大大小为 5 的队列
log.info("\n=== Event Queue ===");
const eventQueue = queue.init("user_events", 5);

// 2. 推送各种数据类型
eventQueue.push({ event: "login", userId: 123 });
eventQueue.push("user interaction");
eventQueue.push(true);
log.info("Current size:", eventQueue.size()); // 3
log.info("Is full:", eventQueue.isFull()); // false

// 3. 按 FIFO 顺序弹出数据
log.info("Popped item 1:", eventQueue.pop()); // { event: 'login', userId: 123 }
log.info("Popped item 2:", eventQueue.pop()); // "user interaction"

// 4. 为后台任务创建另一个队列
log.info("\n=== Task Queue ===");
const taskQueue = queue.init("bg_tasks", 10);
taskQueue.push({ task: "send_report", priority: "high" });

log.info("Event queue size:", eventQueue.size()); // 1
log.info("Task queue size:", taskQueue.size()); // 1

// 5. 填满队列并处理错误
const q = queue.init("temp_q", 1);
q.push(1);
try {
  q.push(2); // 这会失败
} catch (e) {
  log.error("Caught expected error:", e.message);
}

// 6. 完成后清理单个队列
eventQueue.destroy();
log.info("Event queue destroyed.");
try {
  queue.getInstance("user_events");
} catch (e) {
  log.error("Caught expected error:", e.message);
}

// 7. 在退出前全局清除所有剩余队列
queue.clearAll();
log.info("All queues cleared.");
```

## 7. 数据类型支持

该模块自动处理以下数据类型的序列化和反序列化：

### 支持的类型：

- **String**: 按原样存储
- **Number**: 使用 `#n#` 前缀存储（例如 `#n#42`、`#n#3.14`）
- **Boolean**: 使用 `#b#` 前缀存储（例如 `#b#true`、`#b#false`）
- **Array**: 使用 `#a#` 前缀和 JSON 序列化存储（例如 `#a#["item1","item2"]`）
- **Object**: 使用 `#o#` 前缀和 JSON 序列化存储（例如 `#o#{"key":"value"}`）

### 不支持的类型：

- **Function**: 如果尝试推送则抛出错误。
- **null/undefined**: 如果尝试推送则抛出错误。

## 8. 线程安全

该模块设计为完全线程安全。`init`/`getInstance` 模式是此设计的核心。

- **`queue.init()`** 应调用一次以创建和定义队列。
- **`queue.getInstance()`** 然后可以从任何线程调用以获取对同一底层本机队列的安全本地句柄。
- 所有实例方法（`push`、`pop`、`size` 等）在底层 C 实现中受互斥锁保护，允许从多个线程同时安全地调用同一队列上的这些方法。

此模型确保应用程序的不同部分（在不同线程中运行）可以通过公共队列可靠地通信和共享数据。

## 9. 演示

无
