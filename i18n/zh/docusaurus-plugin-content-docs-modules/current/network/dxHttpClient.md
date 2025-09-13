# dxHttpClient

## 1. 概述

`dxHttpClient` 模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于通过 HTTP/HTTPS 协议访问 HTTP 服务器。

此模块提供**无状态、基于函数的 API**。每个请求调用（如 `get`、`post`）都是独立、隔离的操作，确保代码简洁性和线程安全性，避免旧 API 可能出现的配置状态混乱问题。

**主要特性：**

- 发送 GET/POST/PUT/PATCH/DELETE 请求
- 文件上传和下载，支持进度回调
- HTTPS 支持，具有证书验证选项
- 通过统一的 `options` 对象为每个请求完全可配置
- 对象体的自动 JSON 字符串化
- 强大的错误处理和参数验证

## 2. 文件

- `dxHttpClient.js` - JavaScript 模块包装器
- `libvbar-m-dxhttpclient.so` - 底层 C 语言实现

> 确保这两个文件都包含在您项目根目录下的 `dxmodules` 子目录中。

## 3. 依赖项

- **libcurl**: curl 库

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备

## 5. API 参考

### `httpclient.request(options)`

这是模块的核心函数。所有其他便利函数（如 `get`、`post`）都是此函数的包装器。

- `options` `{object}`: 包含所有请求配置的对象。
  - `url` `{string}`: **（必需）** 请求 URL。
  - `method` `{string}`: 请求方法（例如，'GET'、'POST'、'PUT' 等）。**默认为 'GET'**。
  - `headers` `{object}`: 键值对头对象，例如 `{ 'Content-Type': 'application/json' }`。
  - `body` `{string|object}`: 请求体。如果提供 JS 对象，它将**自动转换**为 JSON 字符串，并自动添加 `'Content-Type: application/json'` 头。
  - `timeout` `{number}`: 超时时间（毫秒）。**默认为 5000**。
  - `onProgress` `{Function}`: 进度回调函数，接收参数 `(dltotal, dlnow, ultotal, ulnow)`。
  - `verifyPeer` `{number}`: 是否验证对等证书（0：禁用，1：启用）。**默认为 0**。
  - `verifyHost` `{number}`: 是否验证主机名（0：禁用，2：启用）。**默认为 0**。
  - `caFile` `{string}`: CA 证书文件路径。

### 便利函数

- `httpclient.get(url, [timeout=5000], [options={}])`
- `httpclient.post(url, body, [timeout=5000], [options={}])`
- `httpclient.put(url, body, [timeout=5000], [options={}])`
- `httpclient.patch(url, body, [timeout=5000], [options={}])`
- `httpclient.delete(url, [timeout=5000], [options={}])`
- `httpclient.download(url, localPath, [timeout=30000], [options={}])`
- `httpclient.upload(url, localPath, [timeout=30000], [options={}])`

**注意：** 便利函数通过接受 `timeout` 作为第二个参数，然后 `options` 作为第三个参数来保持向后兼容性。

## 6. 使用示例

```javascript
import httpclient from "dxmodules/dxHttpClient.js";
import * as std from "std";
import * as log from "dxmodules/dxLogger.js";

// 替换为您的服务器地址
const urlroot = "http://192.168.50.36:3000";

// 1. 简单 GET 请求
log.info("\n=== GET ===");
let res_get = httpclient.get(urlroot + "/get?name=quickjs&age=1", 5000);
log.info(res_get);
// 输出: {"code":0,"status":200,"data":"{\"method\":\"GET\",..."}}

// 2. 带对象的 POST（自动转换为 JSON 字符串）
log.info("\n=== POST ===");
let res_post = httpclient.post(
  urlroot + "/post",
  { foo: "bar", num: 42 },
  5000
);
log.info(res_post);
// 输出: {"code":0,"status":200,"data":"{\"method\":\"POST\",\"body\":{\"foo\":\"bar\"...}}"}

// 3. 带自定义头的 PUT 请求
log.info("\n=== PUT ===");
let res_put = httpclient.put(
  urlroot + "/put",
  { id: 123, name: "Updated User" },
  5000,
  { headers: { "X-Custom-Header": "MyValue" } }
);
log.info(res_put);

// 4. 下载文件
log.info("\n=== Download ===");
let res_download = httpclient.download(
  urlroot + "/download",
  "/tmp/bigfile.txt",
  30000
);
if (res_download.code === 0) {
  log.info("下载成功，文件大小:", std.loadFile("/tmp/bigfile.txt").length);
} else {
  log.error("下载失败:", res_download.message);
}

// 5. 带进度回调的文件上传
log.info("\n=== Upload with Progress ===");
let res_upload = httpclient.upload(
  urlroot + "/upload",
  "/app/code/dxmodules/libvbar-m-dxhttpclient.so",
  30000,
  {
    onProgress: function (dTotal, dLoaded, uTotal, uLoaded) {
      if (uTotal > 0) {
        log.info(`上传进度: ${Math.round((uLoaded / uTotal) * 100)}%`);
      }
    },
  }
);
log.info(res_upload);

// 6. HTTPS 请求（禁用证书验证）
log.info("\n=== HTTPS GET ===");
let res_https = httpclient.get("https://reqres.in/api/users?page=2", 5000, {
  headers: { "x-api-key": "reqres-free-v1" },
  verifyPeer: 0,
  verifyHost: 0,
});
log.info(res_https);

// 7. PATCH 请求
log.info("\n=== PATCH ===");
let res_patch = httpclient.patch(urlroot + "/patch", 5000, {
  email: "patched@example.com",
  status: "active",
});
log.info(res_patch);

// 8. DELETE 请求（无请求体）
log.info("\n=== DELETE ===");
let res_delete = httpclient.delete(urlroot + "/delete/123", 5000);
log.info(res_delete);
```

## 7. 响应格式

所有 HTTP 请求函数都返回具有以下结构的响应对象：

```javascript
{
    "code": 0,           // CURL 错误代码（0 = 成功）
    "status": 200,       // HTTP 状态代码
    "data": "...",       // 响应体（字符串）
    "message": "..."     // 错误消息（仅在错误时存在）
}
```

**注意：** `download` 函数返回的响应对象没有 `data` 字段，因为响应体直接写入本地文件。

## 8. 已弃用的 API

旧的有状态 API（`init`、`deinit`、`setOpt`、`reset`、`request()`）现在**已弃用**，不应在新项目中使用。为了向后兼容，这些函数可能仍然存在但会抛出错误或执行无操作。

**始终使用新的无状态函数 API** - 它更安全、更简单、更可靠。

## 9. 相关模块

`dxHttpClient` 是 `dxHttp` 模块的替代品。`dxHttp` 正在逐渐被淘汰 - 请在新项目中使用 `dxHttpClient`。

## 10. 技术改进

最新版本包括几个重要改进：

- **强大的参数处理**：所有可选参数在处理前都经过适当验证
- **内存安全**：增强的整数溢出保护和内存管理
- **错误处理**：更好的错误消息和异常处理
- **线程安全**：每个请求完全隔离且无状态
- **性能**：优化的内存分配和清理例程

## 11. 演示

[源代码](https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_test_httpclient)
