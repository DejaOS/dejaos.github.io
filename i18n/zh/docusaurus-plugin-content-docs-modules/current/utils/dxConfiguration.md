# dxConfiguration

## 1. 概述

该模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，提供现代、基于实例且线程安全的配置管理解决方案。

它利用 `dxEventBus` 和专用的 Worker 来确保所有文件 I/O 操作都是线程安全的，防止竞态条件。它允许管理一个或多个配置文件，每个文件由一个对象实例表示，确保干净且强大的 API。

- **线程安全：** 所有文件写入操作都由单个专用 Worker 处理，确保它们按顺序执行。
- **基于实例：** 干净地管理多个配置文件（例如 `system.json`、`user.json`），每个文件由其自己的实例表示。
- **强大：** 通过回退到默认值并自我修复文件来自动处理损坏的 JSON 文件。
- **灵活的 API：** 支持立即（`autosave`）和批处理（`save()`）文件保存策略。

## 2. 文件

- `dxConfiguration.js`
- `configurationWorker.js`

> - 确保文件位于项目根目录下的 `dxmodules` 子目录中。

## 3. 依赖

- `dxStd`
- `dxMap`
- `dxEventBus`

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 且支持 Worker 的设备。

## 5. 使用方法

### 主线程 (`main.js`)

```javascript
import dxConfiguration from "../dxmodules/dxConfiguration.js";
import log from "../dxmodules/dxLogger.js";

// 1. 定义默认值。这些仅在配置文件不存在时使用。
const configPath = "/app/data/my_app_config.json";
const defaultValues = {
  "mqtt.ip": "127.0.0.1",
  "mqtt.port": 1883,
  version: "1.0.0",
};

// 2. 初始化配置。第一次调用 init() 也会创建后台 Worker。
const myConfig = dxConfiguration.init(configPath, defaultValues);
log.info("Initial config:", myConfig.getAll());

// 3. 设置值并立即保存。
myConfig.set("mqtt.ip", "192.168.1.100", true); // autosave = true
log.info("New IP:", myConfig.get("mqtt.ip"));

// 4. 执行多个更改并一次性保存它们以获得更好的性能。
myConfig.set("mqtt.port", 8883); // autosave = false (默认)
myConfig.set("user", "testuser");
myConfig.save(); // 将所有暂存的更改持久化到文件。
log.info("Batch changes saved. Current config:", myConfig.getAll());

// 5. 要删除键，将其值设置为 null。
myConfig.set("user", null, true); // autosave = true
log.info("Config after deleting user:", myConfig.getAll());
```

### Worker 线程 (`/app/code/src/my_worker.js`)

在 Worker 线程中，您**不得**调用 `init()`。相反，使用 `getInstance()` 获取已在主线程中初始化的配置的句柄。

```javascript
import dxConfiguration from "../dxmodules/dxConfiguration.js";
import log from "../dxmodules/dxLogger.js";

const configPath = "/app/data/my_app_config.json";

// 1. 获取主线程初始化的实例。
const myConfig = dxConfiguration.getInstance(configPath);

if (myConfig) {
  // 2. 读取值。
  const ip = myConfig.get("mqtt.ip");
  log.info(`[Worker] Read IP from config: ${ip}`);

  // 3. 修改值并保存。
  myConfig.set("version", "2.0.0", true); // autosave = true
  log.info("[Worker] Updated version to 2.0.0");
} else {
  log.error(
    "[Worker] Failed to get config instance. Was it initialized in the main thread?"
  );
}
```

## 6. API 参考

### `dxConfiguration.init(savePath, [defaultValues])`

创建并初始化配置实例。第一次在应用程序中的任何地方调用此函数时，它还将创建用于文件操作的单个共享后台 Worker。后续调用不会创建新的 Worker。

**参数：**

- `savePath` (string): 配置文件将存储的绝对路径。此路径也用作配置实例的唯一标识符。
- `defaultValues` (object, 可选): 包含默认键值对的对象。这些**仅**在配置文件不存在或现有文件损坏时使用。

**返回：** `object` - 配置实例。

### `dxConfiguration.getInstance(savePath)`

检索已初始化的配置实例。这是在主线程中初始化后从任何线程访问配置的标准方法。

**参数：**

- `savePath` (string): 在 `init()` 中使用的配置文件的绝对路径。

**返回：** `object|null` - 配置实例，如果尚未成功初始化则返回 `null`。

---

### `instance.get(key)`

从配置实例的内存存储中按键检索值。

- **返回：** `*` - 与键关联的值，如果键不存在则返回 `undefined`。

### `instance.getAll()`

检索此配置实例的所有键值对的浅拷贝。

- **返回：** `object` - 包含所有配置数据的对象。

### `instance.set(key, value, [autosave])`

在内存中设置键值对。如果 `value` 是 `null` 或 `undefined`，键将被移除。

- `key` (string): 配置键。必须是非空字符串。
- `value` (\*): 要设置的值。
- `autosave` (boolean, 可选): 如果为 `true`，立即将配置文件保存到磁盘。默认为 `false`。

### `instance.save()`

异步将当前内存中的配置保存到磁盘上的文件。对于批处理多个 `set()` 或 `clear()` 操作很有用。

### `instance.clear(key, [autosave])`

从配置实例的内存中移除单个键。

- `key` (string): 要移除的配置键。必须是非空字符串。
- `autosave` (boolean, 可选): 如果为 `true`，立即将配置文件保存到磁盘。默认为 `false`。

### `instance.clearAll()`

从内存中移除此实例的所有键值对，并异步从磁盘删除相应的配置文件。

## 7. 相关模块

与另一个名为 dxConfig 的模块相关，具有类似的功能。dxConfiguration 是 dxConfig 的替代品，dxConfig 正在逐渐被弃用。

## 8. 示例

无。
