# dxNtp

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于通过 NTP（网络时间协议）自动同步设备时间。它提供自动重试、时区管理和硬件时钟同步等功能，确保设备时间准确。

主要功能包括：

- 从 NTP 服务器自动时间同步。
- 可配置的同步间隔和失败重试间隔。
- 成功同步后自动将系统时间写入硬件时钟（RTC）。
- 支持更新系统时区。
- 使用非阻塞定时器机制，不干扰主要业务逻辑。

> 注意
>
> - NTP 时间同步依赖于网络连接，应在网络成功连接后启动。
> - 建议在 `dxNetwork` 模块报告网络连接成功后启动此模块。

## 2. 文件

- dxNtp.js

## 3. 依赖项

- dxLogger（用于日志输出）
- dxCommon（用于执行系统命令）

## 4. 兼容设备

兼容所有运行 `dejaOS v2.0+` 且支持网络的设备。

## 5. 使用方法

### 启动和停止同步

```javascript
// 使用默认设置启动 NTP 同步
// 默认服务器：'182.92.12.11'，成功间隔：24 小时，重试间隔：5 分钟
dxNtp.startSync();

// 使用自定义参数启动同步
// NTP 服务器：'time.nist.gov'，成功间隔：60 分钟，重试间隔：10 分钟
dxNtp.startSync("time.nist.gov", 60, 10);

// 停止 NTP 同步
dxNtp.stopSync();
```

### 查询状态

```javascript
// 获取 NTP 同步状态
let status = dxNtp.getSyncStatus();
logger.info("NTP 状态:", status);

/*
返回格式：
{
  "isRunning": true,          // 是否正在运行
  "server": "182.92.12.11",   // 当前 NTP 服务器地址
  "interval": 1440,           // 正常同步间隔（分钟）
  "retryInterval": 5,         // 失败重试间隔（分钟）
  "hasTimer": true,           // 是否有活动定时器
  "lastSyncTime": 1677610000000 // 上次成功同步的时间戳（毫秒）
}
*/
```

### 时区管理

```javascript
// 更新 GMT 时区，例如设置为北京时间（GMT+8）。有效范围是 0-24。
// 注意：设备必须重启才能使更改生效。
dxNtp.updateGmt(8);
```

### 已弃用的方法

`dxNtp.loop()` 和 `dxNtp.beforeLoop()` 方法已弃用。请使用 `dxNtp.startSync()` 代替，它提供更完整的自动管理机制。

## 6. 多线程支持

- **不支持多线程**。所有方法，包括 `startSync`、`stopSync`、`getSyncStatus` 和 `updateGmt`，必须从同一线程调用。此模块的内部状态不是线程安全的。

## 7. 相关模块

此模块是系统时间管理的基础，通常与网络模块一起使用：

- dxNetwork：建议在 `dxNetwork` 模块报告网络连接成功后启动此模块。

## 8. 示例

无
