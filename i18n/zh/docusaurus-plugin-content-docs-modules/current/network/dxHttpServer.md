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

**大文件分片上传（小内存设备）:**

服务端在调用路由处理器之前会把**整个请求体缓冲进内存**，且内部接收缓冲区上限为 **3 MB**，单次请求超过这个大小就会失败。要在内存受限的设备上传大文件（如固件/升级包），需要在客户端把文件切成小于 3 MB 的分片，逐片以原始二进制流上传，服务端把每个分片追加到目标文件。这样无论文件总大小如何，峰值内存都只占大约一个分片。

服务端 —— 逐片追加，最后统一校验：

```javascript
import server from "../../dxmodules/dxHttpServer.js";
import dxos from "../../dxmodules/dxOs.js";
import dxCommonUtils from "../../dxmodules/dxCommonUtils.js";

const CHUNK_TMP = "/upgrades.chunk"; // 单个分片的临时落脚文件（复用）
const TARGET = "/upgrades.zip"; // 合并后的完整文件

// 把 "index=0&total=8&md5=..." 解析为对象
function parseQuery(query) {
  const out = {};
  if (!query) return out;
  query.split("&").forEach((kv) => {
    const i = kv.indexOf("=");
    if (i > 0) out[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1));
  });
  return out;
}

server.route("/uploadChunk", function (req, res) {
  const send = (code, message) =>
    res.send(JSON.stringify({ code, message }), { "Content-Type": "application/json" });
  try {
    const q = parseQuery(req.query);
    const index = parseInt(q.index, 10);
    const total = parseInt(q.total, 10);
    const md5 = q.md5;
    if (isNaN(index) || isNaN(total) || index < 0 || index >= total) {
      return send(400, "invalid chunk params");
    }

    // 第一片：清理上一次（可能中断的）上传残留
    if (index === 0) dxos.system(`rm -f ${TARGET} ${CHUNK_TMP}`);

    // 把本片的原始 body 写入临时文件（每片 < 3MB）
    if (!req.saveFile(CHUNK_TMP)) return send(400, "save chunk failed");

    // 用 shell 追加到目标文件 —— 不会把整个文件读入内存
    if (dxos.system(`cat ${CHUNK_TMP} >> ${TARGET}`) !== 0) return send(400, "append failed");
    dxos.system(`rm -f ${CHUNK_TMP}`);

    // 非最后一片：返回成功，等待下一片
    if (index < total - 1) return send(200, "chunk received");

    // 最后一片：校验整个文件的 MD5
    const actual = dxCommonUtils.fs.fileMd5(TARGET); // 返回十六进制字符串
    if (typeof actual === "string" && actual.toLowerCase() === String(md5).toLowerCase()) {
      send(200, "upload success");
      // 这里可以触发升级 / 重启
    } else {
      dxos.system(`rm -f ${TARGET}`);
      send(400, "md5 verification failed");
    }
  } catch (e) {
    dxos.system(`rm -f ${TARGET} ${CHUNK_TMP}`);
    send(400, "upload chunk failed");
  }
});
```

客户端（浏览器）—— 用 `File.slice` 切片并按顺序逐片上传：

```javascript
async function uploadInChunks(file, md5, token) {
  const CHUNK_SIZE = 1 * 1024 * 1024; // 1MB，安全地低于 3MB 接收上限
  const total = Math.ceil(file.size / CHUNK_SIZE) || 1;
  for (let index = 0; index < total; index++) {
    const start = index * CHUNK_SIZE;
    const chunk = file.slice(start, Math.min(start + CHUNK_SIZE, file.size));
    const url = `http://<device-ip>:8080/uploadChunk?index=${index}&total=${total}&md5=${encodeURIComponent(md5)}`;
    // 严格按顺序上传（await 每一片）—— 服务端按序追加
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/octet-stream", Authorization: token },
      body: chunk,
    });
    const result = await resp.json();
    if (result.code !== 200) throw new Error(result.message);
    console.log(`分片 ${index + 1}/${total} 完成`);
  }
}
```

> 注意事项：
>
> - `CHUNK_SIZE` 必须低于 3 MB，推荐默认 1 MB（服务端还会对 body 做一次内部拷贝，所以峰值内存约为分片大小的 2 倍）。
> - 分片**必须按顺序到达** —— 串行上传（`await` 每一片），服务端的 `cat >>` 才能正确拼接。
> - 上传失败或用户取消时，让客户端调用一个清理路由（例如 `rm -f` 目标文件），避免半成品包残留。从 `index=0` 重新上传也会自动清理。

更详细的使用方法，请参考演示：demo/test_server.js,demo/web
截图如下：192.168.50.212 是设备 IP
![](https://dxiot-autobackup.oss-cn-hangzhou.aliyuncs.com/mydiagram/rdmsAdmin/ec5636b0f035bc8c.png)

## 6. 相关模块

与另一个模块 dxWebserver 相关，功能相似。dxHttpServer 是 dxWebserver 的替代品，dxWebserver 正在逐渐被弃用

## 7. 示例

[源代码](https://github.com/DejaOS/DejaOS/tree/main/demos/modules/dxHttpServer)
