# dxHttpServer

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于启动 HTTP Web 服务，监听端口，并允许客户端通过 HTTP 协议访问设备。它通常用于通过局域网内的计算机浏览器控制设备，前提是已知设备的 IP 地址。
包含常见的 HTTP Web 服务功能：

- 静态 Web 服务
- 服务监听和启动
- 路由注册
- 支持文件上传，支持原始二进制流 (如 'application/octet-stream') 和表单数据 ('multipart/form-data') 两种方式。
- 支持文件下载
- **不支持**多线程，所有函数应在单线程中运行。对于跨线程通信，使用 dxEventbus 传递数据

## 2. 文件

- dxHttpServer.js
- libvbar-m-dxhttpcserver.so（嵌入式 mongoose）

> - 确保这 2 个文件包含在项目根目录下的 dxmodules 子目录中

## 3. 依赖项

- 无

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备

## 5. API 参考

### 核心生命周期与服务控制

- **`httpserver.init()`**: 初始化服务实例。此函数会被其他函数自动调用，因此通常无需显式调用。
- **`httpserver.deinit()`**: 反初始化服务并释放资源。
- **`httpserver.listen(port)`**: 启动 HTTP 服务并监听指定端口上的连接。
- **`httpserver.loop()`**: 处理传入的请求和事件。此函数必须在循环中（例如 `setInterval`）周期性地调用。

### 路由

- **`httpserver.route(path, callback)`**: 为特定的 URL 路径注册一个处理器。

  - `path` (String): URL 路径。支持精确匹配 (如 `'/hello'`) 和通配符匹配 (如 `'/api/*'`)。
  - `callback` (Function): 一个 `(req, res)` 函数，用于处理请求。
    - `req`: 请求对象。
    - `res`: 响应对象。

- **`httpserver.serveStatic(pathPrefix, directory)`**: 提供来自本地目录的静态文件服务。
  - `pathPrefix` (String): 映射到静态目录的 URL 前缀 (如 `/static`)。
  - `directory` (String): 包含文件的本地绝对路径 (如 `/app/code/web`)。

### 请求对象 (`req`)

传递给路由回调的 `req` 对象包含：

- `req.method`: (String) HTTP 方法 (如 'GET', 'POST')。
- `req.url`: (String) 完整的请求 URL。
- `req.query`: (String) URL 的查询字符串部分。
- `req.headers`: (Object) 包含请求头的对象。
- `req.body`: (String|ArrayBuffer) 原始上传的请求体。
- `req.saveFile(path)`: (Function) 将原始请求体 (如来自 'application/octet-stream') 保存到指定的文件路径。成功时返回 `true`。
- `req.saveMultipartFile(path)`: (Function) 处理 'multipart/form-data' 上传。它会将**第一个文件部分**保存到指定的 `path`，并返回一个包含其他表单字段的对象。

### 响应对象 (`res`)

传递给路由回调的 `res` 对象用于发送响应：

- `res.send(body, headers)`: 向客户端发送响应。
  - `body` (String|ArrayBuffer): 响应体。
  - `headers` (Object, 可选): HTTP 头对象。
- `res.sendFile(path)`: 将文件内容作为响应发送。

### 示例

**处理 multipart/form-data 表单上传:**

```javascript
// 使用 curl 的示例:
// curl -X POST -F "file1=@/path/to/your/file.bin" \
//   -F "user=JohnDoe" -F "timestamp=1678886400" \
//   http://<device-ip>:8080/form-upload

httpserver.route("/form-upload", function (req, res) {
  try {
    const fields = req.saveMultipartFile("/app/code/data/uploaded_file.bin");
    // fields 将是: { user: "JohnDoe", timestamp: "1678886400" }
    res.send(`文件已保存。用户是 ${fields.user}`);
  } catch (e) {
    res.send(`保存文件时出错: ${e}`, { "Content-Type": "text/plain" });
  }
});
```

更详细的使用方法，请参考演示：demo/test_server.js,demo/web
截图如下：192.168.50.212 是设备 IP
![](https://dxiot-autobackup.oss-cn-hangzhou.aliyuncs.com/mydiagram/rdmsAdmin/ec5636b0f035bc8c.png)

## 6. 相关模块

与另一个模块 dxWebserver 相关，功能相似。dxHttpServer 是 dxWebserver 的替代品，dxWebserver 正在逐渐被弃用

## 7. 示例

[源代码](https://github.com/DejaOS/DejaOS/tree/main/demos/modules/dxHttpServer)
