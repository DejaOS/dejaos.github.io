# dxHttpServer

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于启动 HTTP Web 服务，监听端口，并允许客户端通过 HTTP 协议访问设备。它通常用于通过局域网内的计算机浏览器控制设备，前提是已知设备的 IP 地址。
包含常见的 HTTP Web 服务功能：

- 静态 Web 服务
- 服务监听和启动
- 路由注册
- 支持文件上传，Content-Type 应为 'application/octet-stream' 或 'text/plain' 等，**不支持** 'multipart/form-data'
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

## 5. 使用方法

### 初始化

- `httpserver.init()`
- `httpserver.deinit()`

### 路由注册

- `httpserver.route(path, callback)`

path支持全局匹配，也支持通配符匹配，比如 '/app/*' 就能匹配所有'/app/'开头的path

### 响应对象

- `res.send(body, headers)`
- `res.sendFile(path)`

### 请求对象

- `req.method`、`req.url`、`req.query`、`req.headers`、`req.body`
- `req.saveFile(path)`

### 启动服务

- `httpserver.listen(port)`
- `setInterval(() => httpserver.loop(), 20)`

### 静态服务

- `httpserver.serveStatic(pathPrefix, directory)`

更详细的使用方法，请参考演示：demo/test_server.js,demo/web
截图如下：192.168.50.212 是设备 IP
![](https://dxiot-autobackup.oss-cn-hangzhou.aliyuncs.com/mydiagram/rdmsAdmin/ec5636b0f035bc8c.png)

## 6. 相关模块

与另一个模块 dxWebserver 相关，功能相似。dxHttpServer 是 dxWebserver 的替代品，dxWebserver 正在逐渐被弃用

## 7. 示例

[源代码](https://github.com/DejaOS/DejaOS/tree/main/demos/modules/dxHttpServer)
