# dxTcp

## 1. 概述

本模块族是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，通过两个 **单例风格** 的 JavaScript 模块 **dxTcpClient** 与 **dxTcpServer** 提供 **TCP 套接字** 能力；底层基于原生 TCP C 库，经 `libvbar-m-dxTcp.so` 暴露给脚本。

主要功能包括：

### dxTcpClient

- TCP 客户端初始化与反初始化
- 连接/断开远程服务器（`host`、`port`）
- 发送字符串或二进制（`ArrayBuffer`）数据
- 查询连接状态与对端地址
- 事件驱动：连接成功、断开、收到数据、错误
- 通过周期性调用 `loop()` 处理事件

### dxTcpServer

- TCP 服务端初始化与反初始化
- 监听端口，接受多个并发客户端
- 向指定客户端发送字符串或二进制数据，或向全部客户端广播
- 主动断开指定客户端
- 查询监听状态、连接数量与客户端列表
- 事件驱动：开始监听、新连接、断开、数据、错误
- 通过周期性调用 `loop()` 处理事件

> 注意
>
> - 两个模块在脚本层面均为 **单例**（封装后为每个进程各一个原生客户端 / 服务端实例）。
> - 客户端未连接或处于非法状态时，`send` / `sendBuffer` 可能 **抛出异常**；正式业务中请用 `try/catch` 防护。
> - 实际应用中通常需要先通过 **dxNetwork**（或等价方式）把 IP 链路拉起来，客户端才能访问远端，局域网内才能访问本机监听端口。

## 2. 文件

- dxTcpClient.js
- dxTcpServer.js
- libvbar-m-dxTcp.so

> - 确保上述文件包含在项目根目录下的 `dxmodules` 子目录中。
> - JS 文件在不同设备间统一，而 `.so` 文件是设备特定的。

## 3. 依赖项

- 无

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 且支持网络的设备。

## 5. 使用方法

### 引用模块

```javascript
import dxTcpClient from "../dxmodules/dxTcpClient.js";
import dxTcpServer from "../dxmodules/dxTcpServer.js";
```

### dxTcpClient — 生命周期

```javascript
// 初始化一次；首次成功返回 true，已初始化则返回 false
const ok = dxTcpClient.init();

// 反初始化并释放资源
dxTcpClient.deinit();
```

### dxTcpClient — 连接与发送

```javascript
// 连接远程服务器（CONNECTED 事件由 loop() 投递）
dxTcpClient.connect("192.168.1.100", 8080);

// 发送 UTF-8 字符串（返回已发送字节数；未连接时会抛错）
let n = dxTcpClient.send("hello");

// 发送二进制
const buf = new Uint8Array([0x01, 0x02, 0x03]).buffer;
n = dxTcpClient.sendBuffer(buf);

// 断开（DISCONNECTED 事件在 loop() 中处理）
dxTcpClient.disconnect();
```

### dxTcpClient — 状态查询

```javascript
if (dxTcpClient.isConnected()) {
  dxTcpClient.send("ping");
}

const addr = dxTcpClient.getRemoteAddress();
// 未连接时为 null；已连接时为 { ip: string, port: number }
```

### dxTcpClient — 回调与事件循环

```javascript
dxTcpClient.setCallbacks({
  onConnected: () => {
    logger.info("TCP 客户端已连接");
  },
  onDisconnected: () => {
    logger.info("TCP 客户端已断开");
  },
  onData: (ev) => {
    // ev: { data, dataLen }
    logger.info("收到数据:", ev.data);
  },
  onError: (ev) => {
    // ev: { errCode, errMsg }
    logger.error("TCP 客户端错误:", ev.errMsg);
  },
});

// 必须周期性调用（与 setCallbacks 在同一线程）
setInterval(() => {
  try {
    dxTcpClient.loop();
  } catch (e) {
    logger.error("TCP 客户端 loop 错误:", e);
  }
}, 50);
```

### dxTcpServer — 生命周期

```javascript
const ok = dxTcpServer.init();

// 开始监听；LISTENING 事件由 loop() 投递
dxTcpServer.listen(8881);

// 停止接受新连接（不会主动断开已有客户端）
dxTcpServer.stop();

dxTcpServer.deinit();
```

### dxTcpServer — 发送与客户端管理

```javascript
dxTcpServer.setCallbacks({
  onListening: () => logger.info("服务端已开始监听"),
  onConnect: (ev) => {
    // ev: { clientId, ip, port }
    logger.info(`客户端 ${ev.clientId} 自 ${ev.ip}:${ev.port} 接入`);
  },
  onDisconnect: (ev) => {
    // ev: { clientId }
    logger.info("客户端已断开", ev.clientId);
  },
  onData: (ev) => {
    // ev: { clientId, data, dataLen }
    dxTcpServer.send(ev.clientId, "echo:" + ev.data);
  },
  onError: (ev) => {
    // ev: { clientId, errCode, errMsg }
    logger.error("服务端错误:", ev.errMsg);
  },
});

setInterval(() => {
  try {
    dxTcpServer.loop();
  } catch (e) {
    logger.error("TCP 服务端 loop 错误:", e);
  }
}, 50);

// 向指定客户端发送字符串 / 二进制
dxTcpServer.send(clientId, "hello client");
dxTcpServer.sendBuffer(clientId, new Uint8Array([0xaa, 0xbb]).buffer);

// 向所有已连接客户端广播字符串
dxTcpServer.broadcast("system: notify all");

// 强制断开某一客户端
dxTcpServer.disconnect(clientId);

// 状态与列表
const listening = dxTcpServer.isListening();
const count = dxTcpServer.getClientCount();
const clients = dxTcpServer.getClientList();
// [{ clientId, ip, port }, ...]
```

### dxTcpClient / dxTcpServer — 原生对象

```javascript
const clientNative = dxTcpClient.getNative();
const serverNative = dxTcpServer.getNative();
// 高级用法 / 调试：底层原生类实例
```

## 6. 常量定义

### dxTcpClient.EVENT_TYPE

由 `loop()` 消费的内部事件中，`ev.type` 取值如下。

```javascript
dxTcpClient.EVENT_TYPE = {
  CONNECTED: 0, // 连接成功
  DISCONNECTED: 1, // 连接断开
  DATA: 2, // 收到数据
  ERROR: 3, // 发生错误
};
```

### dxTcpServer.EVENT_TYPE

```javascript
dxTcpServer.EVENT_TYPE = {
  LISTENING: 0, // 开始监听
  CONNECT: 1, // 新客户端接入
  DISCONNECT: 2, // 客户端断开
  DATA: 3, // 收到客户端数据
  ERROR: 4, // 发生错误
};
```

## 7. 多线程支持

- 在 C/原生层可能涉及多线程，但 `**setCallbacks` 与 `loop` 必须在同一线程中调用**（与 dxTcpClient/dxTcpServer 源码注释一致）。
- 仅通过 `loop()` 处理挂起事件，以保证回调在该线程执行。

## 8. 重要注意事项

1. 在调用 `connect()` / `listen()` 之前须先调用 `**init()`**；重复 `init()` 会返回 `false`（表示已初始化）。
2. `**loop()**` 必须周期性执行；若不调用，已排队的连接、数据、错误等事件无法进入你的回调。
3. 客户端在 **未连接** 时调用 `**send` / `sendBuffer`** 会抛错；请在合适位置使用 `try/catch`。
4. 服务端 `**listen(port)**` 在已在监听时会返回 `false`；可用 `**isListening()**` 查询当前是否处于监听状态。
5. 在真实设备上，请先配置好 **网络**（例如 **dxNetwork**），保证协议栈已获得有效 IP，再依赖 TCP 进行广域网/局域网通信。

## 9. 相关模块

- **dxNetwork**：以太网 / WiFi / 4G 管理；出站 TCP 或设备侧可访问的监听端口，通常都需要先有可用 IP 配置。
- **dxHttpClient**、**dxHttpServer**、**dxMqttClient**：更高层协议，同样依赖可用的 IP 与路由环境。

## 10. 示例与测试脚本

![示例截图](https://github.com/DejaOS/DejaOS/blob/main/demos/dw200_v20/dw200_test_tcp/image.png)
[源代码](https://github.com/DejaOS/DejaOS/blob/main/demos/dw200_v20/dw200_test_tcp)