# dxHttpClient

## 1. 概述

`dxHttpClient` 模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于通过 HTTP/HTTPS 协议访问 HTTP 服务器。

此模块提供**无状态、基于函数的 API**。每次调用（`get`、`post`、`request` 等）都会使用**独立的短时原生客户端**，保证线程安全，并避免旧版有状态 API 的配置冲突。

**主要特性：**

- 发送 GET/POST/PUT/PATCH/DELETE 请求
- 通过 `formSubmit` 上传 `multipart/form-data`（文件 + 文本字段）
- 文件上传和下载，支持进度回调
- HTTPS 与证书校验选项（**对等/主机名校验默认关闭**，便于典型 IoT 场景）
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
  - `headers` `{object<string, string>|string[]}`: 请求头，推荐使用**键值对象**（如 `{ 'Content-Type': 'application/json' }`），也可使用 **`"Name: value"` 字符串数组** 以兼容旧调用方式。
  - `body` `{string|object}`: 请求体。若传入 JS 对象，会**自动序列化为 JSON**，并自动添加 `Content-Type: application/json`（若尚未设置 `Content-Type`）。
  - `timeout` `{number}`: 超时时间（毫秒）。**默认为 5000**。
  - `onProgress` `{Function}`: 进度回调函数，接收参数 `(dltotal, dlnow, ultotal, ulnow)`。
  - `verifyPeer` `{number}`: 是否验证对等证书（0：禁用，1：启用）。**默认为 0**。
  - `verifyHost` `{number}`: 是否验证主机名（0：禁用，2：启用）。**默认为 0**。
  - `caFile` `{string}`: CA 证书文件路径。

若 `options` 无效或缺少 `options.url`，将抛出 **`Error`**。

**返回值：** `{ code, status, message, headers, data }`。其中 **`headers`** 为**对象**，键名为**小写**的响应头名称。

### 便利函数

- `httpclient.get(url, [timeout=5000], [options={}])`
- `httpclient.post(url, body, [timeout=5000], [options={}])`
- `httpclient.put(url, body, [timeout=5000], [options={}])`
- `httpclient.patch(url, body, [timeout=5000], [options={}])`
- `httpclient.delete(url, [timeout=5000], [options={}])`
- `httpclient.download(url, localPath, [timeout=30000], [options={}])`
- `httpclient.upload(url, localPath, [timeout=30000], [options={}])`
- `httpclient.formSubmit(url, form, [timeoutOrOptions], [options])`

**注意：** 位置参数与实现对齐：**`get` / `delete`** 的第 2 个参数为 `timeout`，第 3 个为 `options`；**`post` / `put` / `patch`** 的第 3 个为 `timeout`，第 4 个为 `options`；**`download` / `upload`** 的第 3 个为 `timeout`，第 4 个为 `options`。**`formSubmit`** 的第三参较特殊，见下文。

**超时时间须为数值**（如 `get(url, 3000)` 或 `get(url, 3000, { headers: {} })`）。在需要传 `timeout` 的位置传入对象**不会**按预期设置超时 —— 请改用 **`httpclient.request({ url, method: 'GET', timeout: 3000, ... })`** 做纯对象式调用。

### `httpclient.formSubmit(url, form, [timeoutOrOptions], [options])`

上传 **`multipart/form-data`**：在一次请求中携带一个或多个文件以及可选的文本字段。适用于服务端按 HTML 表单方式接收的场景；若服务端期望**原始文件体**，请使用 `upload`。

- `url` `{string}`：**（必需）** 请求 URL。
- `form` `{object}`：**（必需）** 多段表单描述。合并后的表单项列表必须**非空**，否则抛出 **`Error`**。
  - `file` `{object}`：单个文件表单项。
    - `path` `{string}`：**（必需）** 本地文件路径。
    - `fieldName` `{string}`：multipart 字段名。**默认为 `'file'`。**
    - `filename` `{string}`：可选，`Content-Disposition` 中的文件名。
    - `contentType` `{string}`：可选，该部分的 `Content-Type`。
  - `files` `{object[]}`：多个文件；每项与 `file` 字段相同。非对象项会被**跳过**；保留项须含字符串 `path`。
  - `fields` `{object}`：文本字段；值为 `String(value)`（`null` / `undefined` 转为 `''`）。
- **第三参数 `timeoutOrOptions`**：
  - 若为 **`number`**：超时毫秒数；若整体省略第三、四参，**默认超时为 30000**。
  - 若为 **`object`**：视为 **`options`**，超时固定为 **30000**。例如：`httpclient.formSubmit(url, form, { headers: { 'X-Id': '1' } })`。
- **第四参数 `options` `{object}`**：仅当第三参数为 **`number`** 时使用；字段与 `httpclient.request` 相同。

缺少 `url`、`form` 无效、`form.file.path` 缺失、`files` 项非法或表单项为空时会 **`throw Error`**。

**返回值：** `{ code, status, message, headers, data }`，**`headers`** 为**对象**（小写键名），与 `request` 一致。

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
let res_patch = httpclient.patch(
  urlroot + "/patch",
  { email: "patched@example.com", status: "active" },
  5000
);
log.info(res_patch);

// 8. DELETE 请求（无请求体）
log.info("\n=== DELETE ===");
let res_delete = httpclient.delete(urlroot + "/delete/123", 5000);
log.info(res_delete);

// 9. multipart 表单上传（文件 + 文本字段）
log.info("\n=== formSubmit ===");
let res_form = httpclient.formSubmit(
  urlroot + "/upload",
  {
    file: {
      fieldName: "file",
      path: "/app/code/dxmodules/libvbar-m-dxhttpclient.so",
      // filename: "custom-name.so",       // 可选
      // contentType: "application/octet-stream", // 可选
    },
    fields: {
      token: "demo-token",
      faceId: "demo-faceid",
      similarity: "0.68",
    },
  },
  30000
);
log.info(res_form);

// 第三参直接传 options（超时仍为默认 30000 ms）
// httpclient.formSubmit(urlroot + "/upload", { file: { path: "/tmp/a.bin" }, fields: { id: "1" } }, {
//   headers: { "X-Request-Id": "device-001" },
// });

// 多文件（每段可单独指定 fieldName）
// httpclient.formSubmit(urlroot + "/upload-multi", {
//     files: [
//         { path: "/tmp/a.jpg", fieldName: "photo" },
//         { path: "/tmp/b.jpg", fieldName: "attachment", filename: "scan.jpg" },
//     ],
//     fields: { albumId: "42" },
// }, 30000, { headers: { "X-Request-Id": "device-001" } });
```

## 7. 响应格式

### `request`、`get`、`post`、`put`、`patch`、`delete`、`formSubmit`

```javascript
{
    "code": 0,           // CURL 错误代码（0 = 成功）
    "status": 200,       // HTTP 状态代码
    "data": "...",       // 响应体（字符串）
    "headers": { },      // 对象；键名为小写响应头
    "message": "..."     // 错误信息（视情况存在）
}
```

### `download`、`upload`

```javascript
{
    "code": 0,
    "status": 200,
    "headers": { },      // 始终为空对象（不采集响应头）
    "message": "..."
}
```

**无 `data` 字段** —— 内容直接写入或从本地文件读写。

## 8. 已弃用的 API

旧版**有状态**接口 **`init`**、**`deinit`**、**`setOpt`**、**`reset`** 已**弃用**。其中 **`init`**、**`deinit`** 为**空实现**（不抛错）。**`setOpt`**、**`reset`** 会抛出 **`Error`**，提示改用无状态 API。

**`request` 及上文无状态方法均为正式 API**，新代码请使用它们。

**始终使用新的无状态函数 API** —— 更安全、更简单、更可靠。

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
