# dxMqttClient

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于基于 Eclipse Paho MQTT C 库的 MQTT 客户端功能。
它为 MQTT 客户端提供单例接口，具有全面的功能：

- 连接/断开 MQTT 代理
- 发布消息和订阅主题
- 支持 MQTTS（基于 SSL/TLS 的 MQTT）
- 处理连接丢失和消息传递回调
- 不支持跨线程 MQTT 操作支持

## 2. 文件

- dxMqttClient.js
- libvbar-m-dxmqttclient.so

> - 确保这 2 个文件包含在您项目根目录下的 dxmodules 子目录中

## 3. 依赖项

- dxLogger

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备。设备必须具有网络连接支持。

## 5. 使用方法

### 基本用法

```javascript
import mqtt from "../dxmodules/dxMqttClient.js";

// 初始化 MQTT 客户端
mqtt.init("tcp://test.mosquitto.org:1883", "my-device-123");

// 设置回调处理器
mqtt.setCallbacks({
  onConnectSuccess: () => {
    logger.info("已连接到 MQTT 代理");
    // 订阅主题
    mqtt.subscribe("commands/light", { qos: 1 });
  },
  onMessage: (topic, payload, qos, retained) => {
    logger.info(`收到消息: ${topic} = ${payload}`);
  },
  onConnectionLost: (reason) => {
    logger.info("连接丢失:", reason);
  },
});

// 连接到代理
mqtt.connect({
  username: "user",
  password: "password",
  keepAlive: 60,
  cleanSession: true,
});

// 发布消息
mqtt.publish("device/status", "online", { qos: 1, retained: true });

// 在主循环中处理事件
setInterval(() => {
  mqtt.loop();
}, 50);

// 完成后断开连接
mqtt.disconnect();
```

## 6. API 参考

### `mqtt.init(serverURI, clientId)`

初始化 MQTT 客户端。必须在任何其他操作之前调用一次。

**参数：**

- `serverURI` (string): MQTT 代理的 URI。示例："tcp://localhost:1883"、"ssl://test.mosquitto.org:8883"
- `clientId` (string): 此客户端的唯一标识符

**支持的协议：**

- `tcp://` - 基于 TCP 的标准 MQTT
- `ssl://` - 基于 SSL/TLS 的 MQTT
- `mqtt://` - 基于 TCP 的标准 MQTT
- `mqtts://` - 基于 SSL/TLS 的 MQTT

**返回值：** `void`

**抛出：** 如果初始化失败或参数无效则抛出 `Error`

### `mqtt.connect(options)`

将客户端连接到 MQTT 代理。

**参数：**

- `options` (object, 可选): 连接选项
  - `username` (string, 可选): 认证用户名
  - `password` (string, 可选): 认证密码
  - `keepAlive` (number, 可选): 保持活动间隔（秒）（默认：60）
  - `cleanSession` (boolean, 可选): 是否建立干净会话（默认：true）
  - `will` (object, 可选): 遗嘱消息
    - `topic` (string, 必需): 遗嘱消息的主题
    - `payload` (string, 可选): 遗嘱消息的有效负载
    - `qos` (number, 可选): 遗嘱消息的 QoS 级别（默认：0）
    - `retained` (boolean, 可选): 遗嘱消息是否应被保留（默认：false）
  - `ssl` (object, 可选): 安全连接的 SSL/TLS 选项
    - `caFile` (string, 可选): CA 证书文件路径
    - `certFile` (string, 可选): 客户端证书文件路径
    - `keyFile` (string, 可选): 客户端私钥文件路径
    - `keyPassword` (string, 可选): 客户端私钥密码
    - `enableServerCertAuth` (boolean, 可选): 启用服务器证书认证

**返回值：** `void`

**抛出：** 如果客户端未初始化或选项无效则抛出 `Error`

### `mqtt.disconnect(timeout)`

从 MQTT 代理断开客户端。

**参数：**

- `timeout` (number, 可选): 等待断开连接的超时时间（毫秒）（默认：1000）

**返回值：** `void`

**抛出：** 如果客户端未初始化或超时无效则抛出 `Error`

### `mqtt.publish(topic, payload, options)`

向主题发布消息。

**参数：**

- `topic` (string): 要发布消息的主题
- `payload` (string|ArrayBuffer): 消息有效负载
- `options` (object, 可选): 发布选项
  - `qos` (number, 可选): 服务质量级别（0、1 或 2，默认：0）
  - `retained` (boolean, 可选): 消息是否应由代理保留（默认：false）

**返回值：** `number` - 用于跟踪消息传递的传递令牌（对于 QoS > 0）

**抛出：** 如果客户端未初始化、主题无效或有效负载无效则抛出 `Error`

### `mqtt.subscribe(topic, options)`

订阅主题。

**参数：**

- `topic` (string): 要订阅的主题过滤器
- `options` (object, 可选): 订阅选项
  - `qos` (number, 可选): 接收消息的最大 QoS 级别（默认：0）

**返回值：** `void`

**抛出：** 如果客户端未初始化或主题无效则抛出 `Error`

### `mqtt.unsubscribe(topic)`

取消订阅主题。

**参数：**

- `topic` (string): 要取消订阅的主题过滤器

**返回值：** `void`

**抛出：** 如果客户端未初始化或主题无效则抛出 `Error`

### `mqtt.setCallbacks(callbacks)`

设置 MQTT 事件的回调处理器。

**参数：**

- `callbacks` (object): 包含回调函数的对象
  - `onConnectSuccess` (function, 可选): 当客户端成功连接到代理时触发
  - `onMessage` (function, 可选): 当收到消息时触发
    - 参数：`(topic, payload, qos, retained)`
  - `onDelivery` (function, 可选): 当发布的消息已传递时触发（对于 QoS > 0）
    - 参数：`(token)`
  - `onConnectionLost` (function, 可选): 当与代理的连接丢失时触发
    - 参数：`(reason)`

**返回值：** `void`

**抛出：** 如果客户端未初始化或回调无效则抛出 `Error`

### `mqtt.loop()`

处理来自 MQTT 事件队列的事件。应定期调用此函数来处理消息到达、传递确认和连接丢失事件。

**返回值：** `void`

**抛出：** 如果客户端未初始化则抛出 `Error`

**注意：** 建议在主应用程序循环中使用 `setInterval` 调用此函数。

### `mqtt.isConnected()`

检查客户端是否当前已连接到代理。

**返回值：** `boolean` - 如果已连接则为 `true`，否则为 `false`

**抛出：** 如果客户端未初始化则抛出 `Error`

### `mqtt.deinit()`

反初始化客户端实例，允许重新初始化。

**返回值：** `void`

**注意：** 此函数将内部客户端设置为 null，允许垃圾收集器回收资源。C++ 终结器处理断开连接和资源清理。

### `mqtt.getNative()`

获取原生客户端对象。

**返回值：** `Object|null` - 原生客户端对象，如果未初始化则为 null

## 7. 相关模块

- **dxMqtt:** 已弃用，被 dxMqttClient 替代

## 8. 示例

### 完整的 MQTT 客户端应用程序

```javascript
const url = "tcp://192.168.50.36:1883";
net.init();
mqttclient.init(url, "my-device-12345");

net.connectWifiWithDHCP("xxxx", "xxxxxx");
mqttclient.setCallbacks({
  onConnectSuccess: () => {
    logger.info("MQTT 已连接");
    mqttclient.subscribe("testmqttclient/test1", { qos: 1 });
    mqttclient.subscribe("testmqttclient/test2");
  },
  onMessage: (topic, message, qos, retained) => {
    logger.info(`收到 MQTT 消息: topic=${topic}, message=${message}`);
  },
  onDelivery: (messageId) => {
    logger.info(`MQTT 消息已传递: messageId=${messageId}`);
  },
  onConnectionLost: (reason) => {
    logger.info(`MQTT 连接丢失: reason=${reason}`);
    autoconnect();
  },
});
function autoconnect() {
  std.setTimeout(() => {
    connectMqtt();
  }, 5000);
}
autoconnect();
function connectMqtt() {
  try {
    mqttclient.connect();
  } catch (e) {
    logger.error(`MQTT 连接错误:`, e);
    std.setTimeout(() => {
      connectMqtt();
    }, 5000);
  }
}
bus.on("mqtt_publish", (data) => {
  logger.info(`MQTT 发布: topic=${data.topic}, payload=${data.payload}`);
  mqttclient.publish(data.topic, data.payload, { qos: 1 });
});
std.setInterval(() => {
  try {
    net.loop();
    mqttclient.loop();
  } catch (e) {
    logger.error(`循环错误: ${e}`);
  }
}, 100);
```

[源代码](https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_test_mqttclient)
