# dxWatchdog

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，封装原生看门狗 C 库，提供基于句柄的**软件 / 硬件看门狗**操作接口。

**作用是什么：** 看门狗在应用未在设定时间内「喂狗」时会触发系统复位，用于在生产环境中从死锁、卡死或异常逻辑中恢复。

**典型用法：**

- 启动时调用一次 `watchdog.init()`。
- 用 `watchdog.start(timeout_ms)` 设置全局超时时间。
- 用 `watchdog.enable(chan, true)` 启用通道。
- 在主循环或定时器中周期性调用 `watchdog.restart(chan)`（例如每 5 秒一次）。
- 正常退出时调用 `watchdog.stop()` 和 `watchdog.deinit()`。

模块面向多线程环境设计，不同看门狗通道可并行操作。

## 2. 文件

- dxWatchdog.js
- libvbar-m-dxwatchdog.so

> 确保这 2 个文件包含在您项目根目录下的 `dxmodules` 子目录中。

## 3. 依赖项

- 无

## 4. 兼容设备

兼容运行 dejaOS v2.0+ 且具备看门狗（软件或硬件）能力的设备。超时行为与通道数量因设备而异，请以产品文档为准。

## 5. 使用方法

### 基本用法

```javascript
import watchdog from "./dxmodules/dxWatchdog.js";
import logger from "./dxmodules/dxLogger.js";
import std from "./dxmodules/dxStd.js";

try {
  watchdog.init();
} catch (e) {
  logger.error("看门狗初始化失败:", e);
}

try {
  const started = watchdog.start(5000);
  logger.info("看门狗已启动:", started);

  const isPoweron = watchdog.isPoweron();
  logger.info("看门狗是否上电:", isPoweron);

  const enabled = watchdog.enable(0, true);
  logger.info("通道已启用:", enabled);

  const restarted = watchdog.restart(0);
  logger.info("喂狗成功:", restarted);

  std.setInterval(() => {
    watchdog.restart(0);
  }, 5000);
} catch (e) {
  logger.error("看门狗操作失败:", e);
}

// 正常退出时
watchdog.stop();
watchdog.deinit();
```

### 生产环境建议

生产应用中，应在稳定代码路径（主循环或专用定时器）中持续喂狗。调试时若频繁重启，可暂时注释看门狗逻辑——参见 [FAQ](/docs/faq/devfaq)。

## 6. API 参考

### `watchdog.TYPE`

只读枚举，看门狗类型：

| 常量 | 值 | 说明 |
| :--- | :--- | :--- |
| `SOFTWARE` | `1` | 软件看门狗 |
| `HARDWARE` | `2` | 硬件看门狗 |

### `watchdog.init()`

初始化看门狗设备。

**返回值：** 无

**异常：** 初始化失败时抛出 `Error`。

### `watchdog.deinit()`

释放看门狗设备。

**返回值：** `boolean` — 成功为 `true`

### `watchdog.isPoweron()`

查询看门狗设备是否已上电。

**返回值：** `boolean`

### `watchdog.start(timeout_ms)`

启动看门狗计时。

**参数：**

- `timeout_ms`（number）：超时时间（毫秒），必须大于 0，必填

**返回值：** `boolean` — 成功为 `true`，失败为 `false`

**异常：** `timeout_ms` 缺失或不大于 0 时抛出 `Error`

### `watchdog.stop()`

停止看门狗计时。

**返回值：** 无

### `watchdog.enable(chan, toset)`

启用或禁用指定通道。

**参数：**

- `chan`（number）：通道号，默认 `0`
- `toset`（boolean）：`true` 启用，`false` 禁用，默认 `true`

**返回值：** `boolean`

**异常：** `chan` 缺失时抛出 `Error`

### `watchdog.restart(chan)`

对指定通道喂狗（重启计时）。

**参数：**

- `chan`（number）：通道号，默认 `0`

**返回值：** `boolean`

**异常：** `chan` 缺失时抛出 `Error`

## 7. 相关模块

- **dxStd：** 定时器（`setInterval`）用于周期性 `restart()` 喂狗
- **dxLogger：** 调试时记录看门狗初始化与喂狗失败

## 8. 示例

无。
