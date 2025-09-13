# dxOta

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于空中升级（OTA）功能。
它为 dejaOS 应用程序提供全面的升级功能：

- 从远程服务器的 HTTP 在线升级
- 从本地存储的本地文件升级
- 自动 MD5 完整性验证
- 升级前磁盘空间验证
- 升级后自动设备重启
- 支持 .dpk 包格式（基于 zip）

## 2. 文件

- dxOta.js

> - 确保此文件包含在您项目根目录下的 dxmodules 子目录中

## 3. 依赖项

- dxLogger
- dxCommon
- dxHttpClient
- os（内置模块）

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备。设备必须有足够的存储空间用于升级包。

## 5. 使用方法

### 基本用法

```javascript
import ota from "./dxmodules/dxOta.js";

// HTTP 升级示例
try {
  // 从 HTTP URL 下载并升级
  ota.updateHttp(
    "https://example.com/upgrade.dpk",
    "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    120, // 2 分钟超时
    1024 // 1MB 包大小用于磁盘空间检查
  );

  // 重启设备以应用升级
  ota.reboot();
} catch (error) {
  console.error("升级失败:", error.message);
}

// 本地文件升级示例
try {
  // 从本地文件升级
  ota.updateFile(
    "/app/code/upgrade.dpk",
    "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
    2048 // 2MB 包大小用于磁盘空间检查
  );

  // 重启设备以应用升级
  ota.reboot();
} catch (error) {
  console.error("升级失败:", error.message);
}
```

## 6. API 参考

### `ota.updateHttp(url, md5, timeout, size, httpOpts)`

从 HTTP URL 下载并准备升级包。此函数处理完整的升级过程，包括下载、验证和准备。

**参数：**

- `url` (string, 必需): 下载升级包的 HTTP URL
- `md5` (string, 必需): 完整性验证的 MD5 哈希（32 字符小写十六进制）
- `timeout` (number, 可选): 下载超时时间（秒）（默认：60）
- `size` (number, 可选): 用于磁盘空间验证的包大小（KB）
- `httpOpts` (object, 可选): 传递给 dxHttpClient 的额外 HTTP 请求选项

**返回值：** `void`

**抛出：** 如果以下情况则抛出 `Error`：

- URL 或 MD5 参数缺失
- Size 参数不是数字
- 磁盘空间不足
- 下载失败
- MD5 验证失败

**处理流程：**

1. **磁盘空间检查**：验证可用存储（需要 3 倍包大小）
2. **清理**：删除现有升级文件
3. **下载**：将包下载到临时位置
4. **验证**：验证文件存在和 MD5 校验和
5. **准备**：将验证的包移动到升级目录

**示例：**

```javascript
ota.updateHttp(
  "https://server.com/app_v2.0.dpk",
  "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  180, // 3 分钟超时
  512 // 512KB 包
);
```

> - 假如需要从 https 下载文件，需要增加 httpOpts 的参数，具体参考 [dxHttpClient](/modules/network/dxHttpClient)。

### `ota.updateFile(path, md5, size)`

从已下载或放置在设备上的本地文件升级。当您已经通过自定义方法获得升级包时使用此方法。

**参数：**

- `path` (string, 必需): 升级包文件路径
- `md5` (string, 必需): 完整性验证的 MD5 哈希（32 字符小写十六进制）
- `size` (number, 可选): 用于磁盘空间验证的包大小（KB）

**返回值：** `void`

**抛出：** 如果以下情况则抛出 `Error`：

- Path 或 MD5 参数缺失
- Size 参数不是数字
- 指定路径未找到文件
- 磁盘空间不足
- MD5 验证失败

**处理流程：**

1. **文件检查**：验证文件在指定路径存在
2. **磁盘空间检查**：验证可用存储（需要 3 倍包大小）
3. **验证**：验证 MD5 校验和
4. **准备**：将验证的包移动到升级目录

**示例：**

```javascript
ota.updateFile(
  "/app/code/upgrade.dpk",
  "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  1024 // 1MB 包
);
```

### `ota.reboot()`

触发设备重启以应用升级。此函数应在成功升级操作后调用。

**参数：** 无

**返回值：** `void`

**注意：** 此函数启动异步重启，延迟 2 秒以确保所有操作完成。

**示例：**

```javascript
// 检查消息是否为升级命令
if (msg.topic == 'upgrade_demo/v1/cmd/' + sn + '/upgrade') {
    log.info('收到升级命令')
    let payload = JSON.parse(msg.payload)
    log.info('升级 URL:', payload.url)
    log.info('升级 MD5:', payload.md5)

    // 使用提供的 URL 和 MD5 哈希执行 OTA 更新
    ota.updateHttp(payload.url, payload.md5)
    mqtt.send('upgrade_demo/v1/cmd/upgrade_reply', JSON.stringify({ uuid: sn, timestamp: timestamp() }), options.id)
    ota.reboot()
}
```

[源代码](https://github.com/DejaOS/DejaOS/blob/main/demos/dw200_v10/dw200_mqtt_upgrade/client/src/mqttworker.js)