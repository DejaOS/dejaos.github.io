# dxTimeZones

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于提供全面的时区管理功能，支持多语言。该模块包含全球 45 个主要时区的精选列表，每个时区都包含 UTC 偏移信息和 9 种语言的本地化名称（中文、英文、日文、韩文、西班牙文、法文、德文、俄文、阿拉伯文）。此外，它还支持更新到 zoneinfo 目录中存在的任何时区文件，即使该时区不在预定义列表中。

主要功能包括：

- **多语言支持**：每个时区都包含 9 种语言的翻译，用于 UI 显示。
- **UTC 偏移信息**：为每个时区提供标准化的 UTC 偏移。
- **系统时区更新**：允许通过复制 zoneinfo 文件来更新系统时区。
- **自定义时区支持**：可以更新到 zoneinfo 目录中的任何时区文件，不限于 45 个预定义的时区。
- **语言验证**：确保在过滤时区时只使用支持的语言。
- **设备重启**：提供安全的重启功能以应用时区更改。

> 注意
>
> 对于仅使用 GMT 偏移的简单时区更新（例如，GMT+8、GMT-5），可以考虑使用 **dxNtp** 模块的 `updateGmt()` 函数，它提供了更简单的接口，用于基于 GMT 偏移的基本时区配置，无需完整的 zoneinfo 文件。

## 2. 文件

- `dxTimeZones.js`
- `zoneinfo/` 目录（包含时区数据文件）

> - 确保 `dxTimeZones.js` 文件包含在项目根目录下的 dxmodules 子目录中。
> - zoneinfo 目录应位于 `/app/code/dxmodules/zoneinfo/`。

## 3. 依赖项

- `dxOs`（用于系统命令）
- `dxStd`（用于文件系统操作）
- `dxLogger`（用于日志输出）

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备。

## 5. 使用方法

### 获取时区

```javascript
import tz from "./dxmodules/dxTimeZones.js";
import logger from "./dxmodules/dxLogger.js";

// --- 获取所有时区的完整多语言数据 ---
const allTimezones = tz.getTimeZones();
// 返回: { "Pacific/Midway": { utc_offset: "-11:00", name: { zh: "...", en: "...", ... } }, ... }

// --- 按语言过滤获取时区 ---
const chineseTimezones = tz.getTimeZones("zh");
// 返回: { "Pacific/Midway": { utc_offset: "-11:00", name: "萨摩亚标准时间（中途岛）" }, ... }

const englishTimezones = tz.getTimeZones("en");
// 返回: { "Pacific/Midway": { utc_offset: "-11:00", name: "Samoa Standard Time (Midway)" }, ... }
```

### 更新系统时区

```javascript
// --- 更新系统时区（从预定义列表） ---
try {
  tz.updateTimeZone("Asia/Shanghai");
  // 时区文件已复制到 /etc/localtime
  // 现在重启以应用更改
  tz.reboot();
} catch (e) {
  logger.error("更新时区失败:", e.message);
}

// --- 更新到自定义时区（zoneinfo 目录中的任何文件） ---
try {
  tz.updateTimeZone("Europe/Kyiv"); // 不在预定义列表中，但文件存在
  // 只要文件存在于 /app/code/dxmodules/zoneinfo/Europe/Kyiv 即可工作
  tz.reboot();
} catch (e) {
  logger.error("时区文件未找到:", e.message);
}
```

### 语言验证

```javascript
// --- 验证语言支持 ---
try {
  tz.getTimeZones("invalid"); // 抛出错误
} catch (e) {
  // 错误: Language invalid not supported
  logger.error(e);
}
```

## 6. API 参考

### `tz.getTimeZones(language)`

获取时区信息，可选择按语言过滤。

- **参数：**
  - `language` (string, 可选): 用于过滤时区名称的语言代码。如果未提供，则返回所有时区的完整多语言数据。支持的语言：`zh`、`en`、`ja`、`ko`、`es`、`fr`、`de`、`ru`、`ar`。
- **返回：** `object` - 包含时区数据的对象：
  - 如果提供了 `language`：`{ "timezone_key": { utc_offset: "...", name: "..." }, ... }`
  - 如果未提供 `language`：`{ "timezone_key": { utc_offset: "...", name: { zh: "...", en: "...", ... } }, ... }`
- **抛出：** `Error` - 如果语言不受支持。

### `tz.updateTimeZone(timezoneKey)`

通过将相应的 zoneinfo 文件复制到 `/etc/localtime` 来更新系统时区。

- **参数：**
  - `timezoneKey` (string, 必需): 时区标识符（例如，`"Asia/Shanghai"`、`"America/New_York"`）。可以来自预定义列表或 zoneinfo 目录中的任何文件。
- **返回：** `void`
- **抛出：** `Error` - 如果未提供时区键或找不到时区文件。
- **注意：** 设备必须重启才能使更改生效。更新后使用 `tz.reboot()`。

### `tz.reboot()`

安全地重启设备以应用时区更改。此函数同步文件系统，然后在 2 秒后触发异步重启。

- **参数：** 无
- **返回：** `void`
- **注意：** 这是一个非阻塞操作。设备将在短暂延迟后重启。

### 常量

#### `tz.root`

zoneinfo 目录的根路径。默认值：`"/app/code/dxmodules/zoneinfo/"`

#### `tz.languages`

支持的语言代码数组：`["zh", "en", "ja", "ko", "es", "fr", "de", "ru", "ar"]`

## 7. 支持的时区

该模块包含 45 个时区，涵盖全球主要城市和地区：

- **美洲**：从 Pacific/Midway (UTC-11) 到 America/Argentina/Buenos_Aires (UTC-3)
- **欧洲和非洲**：从 Atlantic/Azores (UTC-1) 到 Europe/Istanbul (UTC+3)
- **亚洲和太平洋**：从 Asia/Dubai (UTC+4) 到 Pacific/Tongatapu (UTC+13)

### 支持的语言

- `zh`: 中文
- `en`: 英文
- `ja`: 日文（日本語）
- `ko`: 韩文（한국어）
- `es`: 西班牙文（Español）
- `fr`: 法文（Français）
- `de`: 德文（Deutsch）
- `ru`: 俄文（Русский）
- `ar`: 阿拉伯文（العربية）

## 8. 相关模块

此模块与系统时间管理相关：

- **dxNtp**：对于简单的基于 GMT 偏移的时区更新（例如，GMT+8），请使用 `dxNtp.updateGmt()`。对于使用 zoneinfo 文件的完整时区支持，请使用此模块。

## 9. 示例

### 示例 1：在 UI 中显示时区

```javascript
import tz from "./dxmodules/dxTimeZones.js";
import logger from "./dxmodules/dxLogger.js";

// 获取中文时区用于 UI 显示
const timezones = tz.getTimeZones("zh");

// 在列表中显示
for (const [key, data] of Object.entries(timezones)) {
  logger.info(`${key}: ${data.name} (${data.utc_offset})`);
}
```

### 示例 2：根据用户选择更新时区

```javascript
import tz from "./dxmodules/dxTimeZones.js";
import logger from "./dxmodules/dxLogger.js";

function updateUserTimezone(timezoneKey) {
  try {
    logger.info(`正在更新时区到 ${timezoneKey}...`);
    tz.updateTimeZone(timezoneKey);
    logger.info("时区更新成功。正在重启设备...");
    tz.reboot();
  } catch (e) {
    logger.error(`更新时区失败: ${e.message}`);
  }
}

// 使用示例
updateUserTimezone("Asia/Shanghai");
```

### 示例 3：获取不同语言的时区列表

```javascript
import tz from "./dxmodules/dxTimeZones.js";
import logger from "./dxmodules/dxLogger.js";

// 获取不同语言的时区
const timezonesZh = tz.getTimeZones("zh");
const timezonesEn = tz.getTimeZones("en");
const timezonesJa = tz.getTimeZones("ja");

// 示例：获取北京时区的不同语言名称
logger.info("北京时区:");
logger.info(`  中文: ${timezonesZh["Asia/Shanghai"].name}`);
logger.info(`  英文: ${timezonesEn["Asia/Shanghai"].name}`);
logger.info(`  日文: ${timezonesJa["Asia/Shanghai"].name}`);
```

### 示例 4：完整的时区设置演示

此示例演示了一个完整的时区设置界面，包含时间显示和时区选择功能。

![时区设置演示](/img/timezone_demo.png)

[源代码](https://github.com/DejaOS/DejaOS/tree/main/demos/vf203_v12/vf203_v12_timezone_demo)
