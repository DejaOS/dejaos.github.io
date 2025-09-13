# dxOs

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，提供与底层操作系统和硬件交互的基本功能。它被设计为系统级信息和控制的主要接口。

它包含一系列核心功能：

- **系统信息**：访问运行时间、总/可用内存、总/可用磁盘空间、CPU ID、设备 UUID 和序列号。
- **Shell 命令**：执行 shell 命令，支持阻塞/非阻塞执行和捕获输出。
- **设备管理**：控制设备状态，包括设置操作模式和重启。
- **同步**：用于协调异步操作的简单机制（`dxOs.sync`）。

## 2. 文件

- `dxOs.js`
- `libvbar-m-dxos.so`

> - 确保这 2 个文件包含在您项目根目录下的 dxmodules 子目录中。

## 3. 依赖项

- `dxMap.js`（由 `dxOs.sync` 功能使用）

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备。

## 5. 使用方法

### 基本用法

```javascript
import dxOs from "./dxmodules/dxOs.js";
import log from "./dxmodules/dxLogger.js";

// 1. 获取系统信息
const uptime = dxOs.getUptime();
log.info("系统运行时间 (秒):", uptime);

const cpuId = dxOs.getCpuid();
log.info("CPU ID:", cpuId);

// 2. 执行 shell 命令
const result = dxOs.systemWithRes("ls -l /", 256);
log.info('"ls -l /" 的结果:', result);

// 3. 获取当前设备模式
const currentMode = dxOs.getMode();
log.info("当前设备模式:", currentMode); // 例如："prod"、"dev" 或 null
```

## 6. API 参考

### `dxOs.getUptime()`

获取系统启动的运行时间。

- **返回值：** `number` - 运行时间（秒）。

### `dxOs.getTotalmem()`

获取系统的总内存。

- **返回值：** `number` - 总内存（字节）。

### `dxOs.getFreemem()`

检索系统的剩余内存。

- **返回值：** `number` - 剩余内存（字节）。

### `dxOs.getTotaldisk(path)`

获取分区的总磁盘空间。

- **参数：**
  - `path` (string): 磁盘分区名称（例如，"/"）。（可选，默认为"/"）
- **返回值：** `number` - 总磁盘空间（字节）。

### `dxOs.getFreedisk(path)`

检索分区的剩余可用磁盘空间。

- **参数：**
  - `path` (string): 磁盘分区名称（例如，"/"）。（可选，默认为"/"）
- **返回值：** `number` - 可用磁盘空间（字节）。

### `dxOs.getCpuid()`

获取 CPU ID。

- **返回值：** `string` - CPU ID。

### `dxOs.getUuid()`

获取设备的唯一标识符（UUID）。

- **返回值：** `string` - 设备 UUID。

### `dxOs.getSn()`

获取设备的序列号（SN）。它首先尝试从 SN 文件读取；如果失败，则回退到设备 UUID。

- **返回值：** `string` - 设备的序列号。

### `dxOs.getUuid2mac()`

获取从 UUID 计算出的 MAC 地址。

- **返回值：** `string` - 格式为 `b2:a1:63:3f:99:b6` 的 MAC 地址。

### `dxOs.getFreecpu()`

获取当前 CPU 使用率。

- **返回值：** `number` - 不大于 100 的数字。

### `dxOs.system(cmd)`

执行 shell 命令而不将结果打印到终端。

- **参数：**
  - `cmd` (string): 要执行的命令。（必需）
- **返回值：** `number` - 命令的退出代码。

### `dxOs.systemBrief(cmd)`

执行 shell 命令并将结果打印到终端。

- **参数：**
  - `cmd` (string): 要执行的命令。（必需）
- **返回值：** `number` - 命令的退出代码。

### `dxOs.systemWithRes(cmd, resLen)`

执行 shell 命令并将结果作为字符串返回。

- **参数：**
  - `cmd` (string): 要执行的命令。（必需）
  - `resLen` (number): 要接收的结果的最大长度。（必需）
- **返回值：** `string` - 命令的 stdout 结果。

### `dxOs.systemBlocked(cmd)`

执行 shell 命令并等待其完成（阻塞）。

- **参数：**
  - `cmd` (string): 要执行的命令。（必需）
- **返回值：** `number` - 命令的退出代码。

### `dxOs.asyncReboot(delay_s)`

延迟后异步重启设备。

- **参数：**
  - `delay_s` (number): 重启前的延迟（秒）。（必需）
- **返回值：** `number` - 操作的结果。

### `dxOs.setMode(mode)`

切换设备的操作模式。切换后设备将重启。如果设备已经在目标模式中，它将不执行任何操作并返回 `true`。

- **参数：**
  - `mode` (string): 目标模式。必须是 `"dev"`、`"test"`、`"prod"`、`"safe"` 之一。（必需）
- **返回值：** `boolean` - 如果模式切换已启动或设备已在目标模式中则为 `true`，否则为 `false`。

### `dxOs.getMode()`

查询当前设备模式。

- **返回值：** `string | null`
  - `string`: 当前模式名称（例如，"dev"、"prod"）。
  - `null`: 如果未找到模式文件或为空。

### Sync 命名空间（`dxOs.sync`）

提供应用程序异步部分之间类似同步通信的简单机制。

#### `sync.request(topic, timeout)`

等待特定主题的响应。

- **参数：**
  - `topic` (string): 要等待的主题。（必需）
  - `timeout` (number): 超时时间（毫秒）。（必需）
- **返回值：** `*` - 在主题上接收的数据，如果超时则为 `undefined`。

#### `sync.response(topic, data)`

向特定主题发送响应。

- **参数：**
  - `topic` (string): 要响应的主题。（必需）
  - `data` (\*): 要发送的数据。（必需）

## 7. 相关模块

- **dxCommon:** 已弃用。被 dxOs 和 dxCommonUtils 替代。

## 8. 示例

```javascript
import log from "../dxmodules/dxLogger.js";
import dxOs from "../../js/dxOs.js";

function assert(actual, expected, message) {
  if (arguments.length == 1) {
    expected = true;
  }
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  if (a === e) {
    log.info(`[通过] ${message}`);
    return;
  } else {
    log.error(`[失败] ${message}`);
    throw Error(`断言失败: 得到 |${a}|，期望 |${e}|`);
  }
}

log.info("--- 开始 dxOs 示例 ---");

// --- 系统信息 ---
log.info("--- 测试系统信息 ---");
let time = dxOs.getUptime();
log.info("系统运行时间:", time);
assert(typeof time, "number", "getUptime 应该返回一个数字");

let totalmem = dxOs.getTotalmem();
log.info("系统总内存:", totalmem);
assert(typeof totalmem, "number", "getTotalmem 应该返回一个数字");

let sn = dxOs.getSn();
log.info("序列号:", sn);
assert(typeof sn, "string", "getSn 应该返回一个字符串");

// --- Shell 命令 ---
log.info("--- 测试 Shell 命令 ---");
const PWD_RESULT = dxOs.systemWithRes("pwd", 128);
log.info("systemWithRes('pwd') 结果:", PWD_RESULT);
assert(PWD_RESULT.includes("/"), true, "systemWithRes('pwd') 应该包含 '/'");

let exitCode = dxOs.system("ls /");
log.info("system('ls /') 退出代码:", exitCode);
assert(exitCode, 0, "system('ls /') 应该返回退出代码 0");

// --- 模式管理 ---
log.info("--- 测试模式管理 ---");
let mode = dxOs.getMode();
log.info("当前模式:", mode);
assert(
  typeof mode === "string" || mode === null,
  true,
  "getMode 应该返回字符串或 null"
);

/*
// --- setMode 示例 ---
// 以下将更改设备的模式并触发重启。
// 只有在您想明确测试此功能时才取消注释。

log.info("尝试将模式设置为 'test'...");
const setResult = dxOs.setMode('test');
log.info("dxOs.setMode('test') 返回:", setResult, "(设备应该很快重启)");
assert(setResult, true, "setMode('test') 应该返回 true");
*/

log.info("--- dxOs 示例成功完成 ---");
```
