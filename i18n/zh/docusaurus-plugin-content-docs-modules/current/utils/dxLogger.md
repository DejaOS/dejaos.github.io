# dxLogger

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于提供简单可靠的日志记录功能。
它被设计为标准 `console.log` 的替代品，在 DejaOS 环境中具有增强的调试功能。

- 简单的静态 API，具有三个日志级别：`DEBUG`、`INFO`、`ERROR`。
- 所有日志级别始终启用。
- 支持记录各种数据类型，包括字符串、数字、对象、数组和 Error 对象。
- 设计上跨线程安全，因为它是一个无状态工具。

## 2. 文件

- `dxLogger.js`

> - 确保此文件包含在您项目根目录下的 dxmodules 子目录中。

## 3. 依赖项

- 无

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备。

## 5. 使用方法

### 基本用法

```javascript
import log from "./dxmodules/dxLogger.js";

// 在不同级别记录消息
log.debug("这是用于详细跟踪的调试消息。");
log.info("应用程序已成功启动。");
log.error("处理请求时发生错误。");

// 记录不同的数据类型
log.info("用户详情:", { id: 101, name: "Deja" });
log.info("处理队列:", [1, 2, 3]);

try {
  throw new Error("出了什么问题！");
} catch (e) {
  log.error("捕获到异常:", e);
}
```

## 6. API 参考

### `logger.debug(...data)`

在 `DEBUG` 级别记录消息。用于开发期间的详细诊断信息。

**参数：**

- `...data` (any): 要记录的任何类型参数列表。它们将被转换为字符串并连接。

**返回值：** `void`

**示例：**

```javascript
logger.debug("组件状态:", { visible: true, value: "test" });
// 输出: [DEBUG 2023-10-27 10:30:00.123]: 组件状态: {"visible":true,"value":"test"}
```

### `logger.info(...data)`

在 `INFO` 级别记录消息。用于突出显示应用程序进度的信息性消息。

**参数：**

- `...data` (any): 要记录的任何类型参数列表。

**返回值：** `void`

**示例：**

```javascript
const port = 8080;
logger.info("服务器正在端口", port, "上运行");
// 输出: [INFO 2023-10-27 10:31:00.456]: 服务器正在端口 8080 上运行
```

### `logger.error(...data)`

在 `ERROR` 级别记录消息。用于记录已发生的错误，包括将打印其堆栈跟踪的 Error 对象。

**参数：**

- `...data` (any): 要记录的任何类型参数列表。

**返回值：** `void`

**示例：**

```javascript
try {
  // 一些失败的操作
  throw new Error("文件未找到");
} catch (e) {
  logger.error("读取文件失败:", e);
  // 输出将包括错误消息和堆栈跟踪。
}
```
