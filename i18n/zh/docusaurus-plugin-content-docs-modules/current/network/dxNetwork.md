# dxNetwork

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于管理设备网络连接，支持以太网、WiFi 和 4G 移动网络。它提供网络初始化、连接管理、状态查询、WiFi 扫描等功能，支持多线程使用。

主要功能包括：

- 网络模块初始化和反初始化
- 以太网/WiFi/4G 网络连接管理
- 网络状态监控和查询
- WiFi 热点扫描
- 网络事件回调处理
- 支持 DHCP 和静态 IP 配置

> 注意
>
> - 物联网设备资源有限，通常一次只运行一个应用程序，没有独立的操作系统应用程序，因此开发者需要在自己的应用程序中显式管理网络
> - 并非所有设备都支持所有三种网络类型，但无论设备类型如何，在任何给定时间只能支持一种网络模式，不支持自动网络切换 - 需要手动显式切换

## 2. 文件

- dxNetwork.js
- libvbar-m-dxnetwork.so

> - 确保这 2 个文件包含在项目根目录下的 dxmodules 子目录中
> - JS 文件在不同设备间统一，而 .so 文件是设备特定的

## 3. 依赖项

- 无

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 且支持网络的设备。

## 5. 使用方法

### 初始化

```javascript
// 初始化网络模块
dxnetwork.init();

// 反初始化网络模块
dxnetwork.deinit();
```

### 网络连接

#### 以太网连接

```javascript
// 使用 DHCP 模式连接以太网
dxnetwork.connectEthWithDHCP();

// 使用静态 IP 模式连接以太网
dxnetwork.connectEth({
  ip: "192.168.1.100",
  gateway: "192.168.1.1",
  netmask: "255.255.255.0",
  dns: "8.8.8.8",
});
```

#### WiFi 连接

```javascript
// 使用 DHCP 模式连接 WiFi
dxnetwork.connectWifiWithDHCP("MyWiFi", "MyPassword");

// 使用静态 IP 模式连接 WiFi
dxnetwork.connectWifi("MyWiFi", "MyPassword", {
  ip: "192.168.1.101",
  gateway: "192.168.1.1",
  netmask: "255.255.255.0",
  dns: "8.8.8.8",
});
```

#### 4G 连接

```javascript
// 连接 4G 移动网络
dxnetwork.connect4G();
```

#### 通用连接方法

```javascript
// 使用通用连接方法
dxnetwork.connect({
  netType: 2, // 2 = WiFi
  ipMode: 0, // 0 = DHCP, 1 = Static
  ssid: "MyWiFi",
  psk: "MyPassword",
});
```

### 网络状态查询

```javascript
// 获取网络状态
let status = dxnetwork.getStatus();

// 获取网络类型
let type = dxnetwork.getType();

// 检查是否已连接
let connected = dxnetwork.isConnected();

// 获取网络参数（IP、网关、子网掩码、DNS）
let params = dxnetwork.getNetParam();

// 获取信号强度（RSSI）
let rssi = dxnetwork.getRSSI();
```

### WiFi 扫描

```javascript
// 扫描 WiFi 热点
let hotspots = dxnetwork.scanWifi(2500, 100); // 2500ms 超时，100ms 间隔
logger.info("发现的热点:", hotspots);
// 返回格式：
// [
//   {
//     ssid: "WiFi 名称",
//     bssid: "MAC 地址",
//     flags: "加密类型",
//     freq: 2412,
//     level: -45
//   }
// ]
```

### 事件处理

```javascript
// 设置事件回调
dxnetwork.setCallbacks({
  onStatusChange: function (netType, status) {
    logger.info("网络状态已更改:", netType, status);
    // netType: 1=以太网, 2=WiFi, 4=4G
    // status: 网络状态代码，4 表示网络完全连接
  },
});

// 定期处理事件（必须在循环中调用）
setInterval(() => {
  try {
    dxnetwork.loop();
  } catch (e) {
    logger.error("网络循环中的错误:", e);
  }
}, 50); // 每 50ms 处理一次事件
```

### 断开连接

```javascript
// 断开当前网络连接
dxnetwork.disconnect();
```

## 6. 常量定义

### 网络类型

```javascript
dxnetwork.NET_TYPE = {
  ETH: 1, // 以太网
  WIFI: 2, // WiFi
  MODEM: 4, // 4G 移动网络
};
```

### IP 模式

```javascript
dxnetwork.IP_MODE = {
  DHCP: 0, // 动态 IP
  STATIC: 1, // 静态 IP
};
```

## 7. 多线程支持

- 支持多线程使用，但 `setCallbacks` 和 `loop` 函数必须在同一线程中调用
- 网络事件通过队列机制在线程间安全传递
- 所有网络操作都有线程安全保护

## 8. 重要注意事项

1. 必须首先调用 `init()` 来初始化网络模块
2. 事件回调必须在调用 `loop()` 的同一线程中设置
3. WiFi 扫描需要 WiFi 模块已初始化（可以传递空的 ssid 和 pwd）
4. 4G 连接需要插入有效的 SIM 卡
5. 静态 IP 配置需要确保 IP 地址不冲突

## 9. 相关模块

此模块是 `dxNet` 模块的新版本，正在逐渐被弃用
此模块是网络管理的基础，通常与以下模块一起使用：

- dxHttpServer：提供 HTTP 服务
- dxMqttClient：MQTT 消息通信
- dxHttpClient：HTTP 请求
- ......

## 10. 示例

![示例截图](https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_test_network/screenshot.png)
[源代码](https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_test_network)
