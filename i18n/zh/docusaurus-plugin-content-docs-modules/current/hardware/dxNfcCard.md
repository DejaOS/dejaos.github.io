# dxNfcCard

## 1. 概述

本模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于与 NFC（近场通信）卡进行交互。它提供了一个全面的单例接口，用于检测、读取和写入多种类型的 NFC 卡。

主要特性：

- **多卡支持**: 处理各种基础 NFC 卡类型，包括 M1 卡、CPU 卡和 NTAG 卡。
- **eID 功能**: 集成了读取中国第二代身份证（eID）的功能。**注意**：此功能需要网络连接。
- **事件驱动**: 使用异步、事件驱动的模型来处理卡片检测。
- **配置**: 允许对底层 NFC 硬件参数进行详细配置。

## 2. 文件

- `dxNfcCard.js`
- `libvbar-m-dxnfccard.so`

> 请确保这两个文件包含在您项目根目录下的 `dxmodules` 子目录中。

## 3. 依赖

- `dxLogger` (用于日志记录，可选)

## 4. 兼容设备

兼容所有配备了 NFC 硬件并运行 dejaOS 2.0+ 的设备。

## 5. 用法

### 基本用法 (标准 NFC 卡)

```javascript
import { dxNfcCard } from "./dxmodules/dxNfcCard.js";
import logger from "./dxmodules/dxLogger.js";

// 1. 初始化模块
dxNfcCard.init();

// 2. 设置卡片检测回调
dxNfcCard.setCallbacks({
  onCardDetected: (cardInfo) => {
    logger.info("检测到 NFC 卡:", cardInfo);
    // cardInfo 包含 { card_type, id, id_len, type, sak, ... }
  },
});

// 3. 在定时器中轮询事件
setInterval(() => {
  try {
    dxNfcCard.loop();
  } catch (e) {
    logger.error("NFC 循环出错:", e);
  }
}, 100); // 每 100 毫秒处理一次事件
```

### eID (身份证) 读取用法

```javascript
import { dxNfcCard } from "./dxmodules/dxNfcCard.js";
import logger from "./dxmodules/dxLogger.js";

// 1. 初始化模块
dxNfcCard.init();

// 2. 使用您的凭证初始化 eID 功能
dxNfcCard.eidInit({
  config: {
    appid: "your_app_id",
    sn: "your_device_sn",
    device_model: "your_device_model",
  },
});

// 3. 为标准卡和 eID 设置回调
dxNfcCard.setCallbacks({
  onCardDetected: (cardInfo) => {
    logger.info("NFC 卡:", cardInfo);
  },
  onEidDetected: (eidInfo) => {
    logger.info("检测到 eID 卡:", eidInfo);
    // eidInfo 包含 { name, sex, idCardNo, address, picture, ... }
  },
});

// 4. 在定时器中轮询事件
setInterval(dxNfcCard.loop, 100);
```

## 6. API 参考

### 核心生命周期

#### `dxNfcCard.init()`

初始化 NFC 模块。必须在任何其他操作之前调用。
**返回**: `void`

#### `dxNfcCard.deinit()`

反初始化 NFC 模块并释放所有资源。
**返回**: `void`

#### `dxNfcCard.loop()`

处理来自 NFC 事件队列的事件。应周期性地调用（例如，在 `setInterval` 中）。此函数会触发 `onCardDetected` 和 `onEidDetected` 回调。
**返回**: `void`

### 回调

#### `dxNfcCard.setCallbacks(callbacks)`

设置 NFC 事件的回调处理器。

- `callbacks` (Object): 包含回调函数的对象。
  - `onCardDetected` (Function): 当检测到标准 NFC 卡时调用。接收一个 `CardInfo` 对象作为参数。
  - `onEidDetected` (Function): 当成功读取 eID（身份证）时调用。接收一个 `EidInfo` 对象作为参数。

**`CardInfo` 对象结构:**

- `card_type` (Number): 卡片类型 (参见 `dxNfcCard.CARD_TYPE`)。
- `id` (String): 卡片的唯一标识符（十六进制字符串）。
- `id_len` (Number): 卡片 ID 的字节长度。
- `type` (Number): 详细的卡片类型。
- `sak` (Number): SAK 值 (Select Acknowledge)。
- `timestamp` (Number): 事件的系统时间戳。
- `monotonic_timestamp` (Number): 事件的单调时间戳。

**`EidInfo` 对象结构:**

- `name` (String): 姓名。
- `sex` (String): 性别。
- `nation` (String): 民族。
- `birthday` (String): 出生日期 (格式: YYYYMMDD)。
- `address` (String): 住址。
- `idCardNo` (String): 公民身份号码。
- `grantDept` (String): 签发机关。
- `userLifeBegin` (String): 有效期起始日期 (格式: YYYYMMDD)。
- `userLifeEnd` (String): 有效期截止日期 (格式: YYYYMMDD 或 "长期")。
- `picture` (String): 身份证照片的 Base64 编码字符串。

### 配置

#### `dxNfcCard.getConfig()`

检索当前的 NFC 硬件配置。
**返回**: `Object` - 当前的配置对象。

#### `dxNfcCard.updateConfig(config)`

更新 NFC 配置。除非有特殊要求，否则请使用默认值。

- `config` (Object): 包含要更新属性的配置对象。
  **返回**: `void`

### 通用卡片操作

#### `dxNfcCard.isCardIn()`

检查当前是否有卡片在 NFC 场内。
**返回**: `boolean` - 如果有卡片，则为 `true`，否则为 `false`。

#### `dxNfcCard.iso14443Apdu(command, [taskFlag=0])`

向卡片发送 ISO14443-A APDU 命令。

- `command` (ArrayBuffer): 要发送的 APDU 命令。
- `taskFlag` (Number, 可选): 用于选卡的任务标志。
  **返回**: `ArrayBuffer` - 包含卡片 APDU 响应的 ArrayBuffer。

### M1 卡操作

#### `dxNfcCard.m1ReadBlock(blockNumber, key, keyType, [taskFlag=0])`

从 M1 卡读取一个 16 字节的块。

- `blockNumber` (Number): 要读取的块编号。
- `key` (ArrayBuffer): 6 字节的密钥 (A 或 B) ArrayBuffer。
- `keyType` (Number): `0x60` 代表密钥 A, `0x61` 代表密钥 B。
  **返回**: `ArrayBuffer` - 包含块数据的 16 字节 ArrayBuffer。

#### `dxNfcCard.m1WriteBlock(blockNumber, data, key, keyType, [taskFlag=0])`

向 M1 卡写入一个 16 字节的块。

- `blockNumber` (Number): 要写入的块编号。
- `data` (ArrayBuffer): 要写入的 16 字节数据 ArrayBuffer。
- `key` (ArrayBuffer): 6 字节的密钥 (A 或 B) ArrayBuffer。
- `keyType` (Number): `0x60` 代表密钥 A, `0x61` 代表密钥 B。
  **返回**: `Number` - 成功时返回 `0`。

### NTAG 卡操作

#### `dxNfcCard.ntagReadPage(pageNum)`

从 NTAG 卡读取 4 页（16 字节）。

- `pageNum` (Number): 要读取的起始页码。
  **返回**: `ArrayBuffer` - 包含数据的 16 字节 ArrayBuffer。

#### `dxNfcCard.ntagWritePage(pageNum, data)`

向 NTAG 卡写入一页（4 字节）。

- `pageNum` (Number): 要写入的页码。
- `data` (ArrayBuffer): 要写入的 4 字节数据 ArrayBuffer。
  **返回**: `void`

### eID (身份证) 操作

#### `dxNfcCard.eidInit(options)`

初始化 eID（电子身份证）读取功能。需要有效的网络连接。

- `options` (Object): eID 服务的配置。
  - `ip` (String, 可选): eID 服务器 IP 地址。默认为 `"deviceid.dxiot.com"`。
  - `port` (Number, 可选): eID 服务器端口。默认为 `9889`。
  - `config` (Object): **必需**。高级参数。 - `appid` (String): **必需**。平台分配的 App ID。 - `sn` (String): **必需**。设备序列号。 - `device_model` (String): **必需**。设备型号。 - `...` (其他可选字段)
    **返回**: `void`
    **Throws**: `Error` 如果缺少必需的配置属性。

#### `dxNfcCard.eidActive(options)`

使用激活码激活 eID 模块。通常只需执行一次。需要有效的网络连接。

- `options` (Object): 激活选项。
  - `codeMsg` (String): **必需**。激活码消息。
  - `sn` (String): **必需**。设备序列号。
  - `version` (String): **必需**。固件版本。
  - `macAddr` (String): **必需**。设备 MAC 地址。
    **返回**: `Number` - 成功时返回 `0`，失败时返回负值。
    **Throws**: `Error` 如果缺少必需的选项。

#### `dxNfcCard.eidDeinit()`

反初始化 eID 功能。
**返回**: `void`

## 7. 卡片类型常量

`onCardDetected` 回调返回一个 `card_type` 字段。您可以将其与 `dxNfcCard.CARD_TYPE` 中的常量进行比较。

```javascript
import { dxNfcCard } from "./dxmodules/dxNfcCard.js";

// 示例:
if (cardInfo.card_type === dxNfcCard.CARD_TYPE.MIFARE_CLASSIC_1K_4B) {
  logger.info("检测到 Mifare Classic 1K 卡!");
}
```

- `TYPE_A`: 64
- `MIFARE_ULTRALIGHT`: 65
- `MIFARE_CLASSIC_1K_4B`: 66
- `MIFARE_CLASSIC_4K`: 67
- `CPU_A`: 68
- `MIFARE_DESFIRE`: 69
- `IDENTITY_CARD`: 70
- `ISO15693`: 71
- `TYPE_B`: 74
- `CPU_B`: 75
- `M1`: 76
- `FELICA`: 77
- `MIFARE_PLUS`: 78
- `IDCARD`: 97
- `NOT_SUPPORT`: 127

## 8. 相关模块

- **dxNfc:** 已弃用, 由 dxNfcCard 替代
- **dxEid:** 已弃用, 由 dxNfcCard 替代
