# Android 部分

目标读者：进行二次开发、需要打通 Android 设备与 DejaOS 设备可视对讲的工程师。

---

## 1. 背景与上下文

本方案是“以 DejaOS 设备为中心”的跨端对讲模型，Android demo 的定位是配套端：

- DejaOS 设备作为被呼叫目标，使用固定序列号（serial no）标识设备身份。
- Android 设备作为移动端/室内端入口，通过私有信令服务与 DejaOS 设备建立会话。
- 音视频链路由 WebRTC 承载，信令链路由私有 WebSocket 协议承载。

从实现本质看，Android demo 就是：

- 使用 Google WebRTC 库（`org.webrtc.*`）处理 Offer/Answer/ICE 和媒体传输。
- 使用私有 WebSocket 协议连接私有信令服务，完成会话创建、呼叫、断开、透传。

这意味着对讲过程可拆成两条链路：

- 信令链路：谁呼叫谁、会话状态、参数协商（通过 WebSocket）。
- 媒体链路：音视频与 DataChannel 数据（通过 PeerConnection）。

---

## 2. 方案价值与 Android Demo 作用

Android Demo 主要用于三件事：

- 演示 Android 与 DejaOS 设备可视对讲的完整最小流程。
- 提供“信令 + WebRTC”的可运行参考实现，缩短二次开发接入周期。
- 提供多业务场景入口（实时、回放、下载、MJpeg）用于能力验证与联调。

其基本架构如下：

- 应用层（`com.rhrtc.webrtcsdk`）：页面交互、业务参数组装、信令消息收发。
- 核心层（`com.rhrtc.webrtc`）：WebRTC 连接、音视频轨道、ICE 处理、录制与工具能力。
- 全局连接层（`APPAplication`）：维护 WebSocket 客户端与全局消息分发。

---

## 3. 代码结构与模块职责

Java 包在 `app/src/main/java/com/rhrtc` 下，主要分两层。

### 3.1 `com.rhrtc.webrtcsdk`（业务/UI 层）

- `APPAplication`
  - 全局 Application，负责：
    - 生成本端 ID（`ownid`）
    - 持有目标设备 ID（`peerid`）
    - 生成 WebSocket 地址：`ws://<host>/wswebclient/<ownid>`
    - 管理 `JWebSocketClient` 生命周期
    - 维护回调列表 `WebSocketMsgCallback`，向各 Activity 分发信令
- `MainActivity`
  - 功能入口页：Real video / Remote Play / Download / MJpeg video
- `RealVideoActivity`、`RemotePlayActivity`、`MjpegVideoActivity`、`DownLoadActivity`
  - 各场景对讲页面，包含：
    - 发起 `__connectto` / `__call`
    - 处理 `_create` / `_offer` / `_ice_candidate` 等回包
    - 触发 `PeerConnectionClient` 的 offer/answer/candidate 逻辑
- `WebSocketMsgCallback`
  - WebSocket 消息回调接口，解耦全局连接与页面逻辑

### 3.2 `com.rhrtc.webrtc`（媒体与网络核心层）

- `PeerConnectionClient`
  - WebRTC 核心封装：PeerConnectionFactory、轨道管理、Offer/Answer、ICE、统计、录制挂接
- `JWebSocketClient`
  - 基于 `org.java_websocket` 的客户端封装
- `record/*`
  - 录制链路：音频拦截、视频帧落盘、录制器实现
- `utils/*`
  - 音频路由、蓝牙、权限、EGL、约束参数等工具

---

## 4. 运行流程（Android 端）

## 4.1 启动阶段

1. `APPAplication.onCreate()` 初始化 `ownid`、`peerid`、`wsurl`。
2. 创建 WebSocket 客户端并连接信令服务。
3. Activity 注册 `WebSocketMsgCallback`，接收全局信令回调。

## 4.2 呼叫建立阶段（典型实时视频）

1. 页面发起 `__connectto`，请求创建会话。
2. 服务端返回 `_create`，携带在线状态与 `iceServers`。
3. 页面发送 `__call`，声明模式（live/play）、音视频/DataChannel参数。
4. 双方交换 `_offer` / `__answer`（或 `__offer` / `_answer`，视发起方而定）。
5. 双方持续交换 `__ice_candidate` / `_ice_candidate`，完成连通。
6. 媒体链路稳定后进入通话态。

## 4.3 结束阶段

- 任一侧发送断开事件（`__disconnected` 或 `_session_disconnected`）。
- 页面清理 PeerConnection、渲染器与会话状态。

---

## 5. 关键参数

### 5.1 身份与目标参数

- `ownid`
  - Android 端自身 ID，当前实现用随机 UUID。
  - 这样设计的原因是：Android/H5 端不要求像 DejaOS 设备那样使用固定硬件序列号注册，可用会话级随机身份。
- `peerid`
  - 目标 DejaOS 设备 ID，本质是设备 serial no。
  - 该值必须与实际目标设备序列号一致，否则会出现“能连信令但无法正确呼叫设备”的情况。
- `sessionId`
  - 单次会话唯一标识，贯穿创建、呼叫、ICE、断开全过程。

### 5.2 信令服务地址参数

- `wsurl`
  - 示例工程默认使用我们提供的测试服务地址。
  - Android/H5 通过 WebSocket 连接信令服务，对应 WebSocket 端口。
  - DejaOS 设备端使用的是更底层协议栈，不走 WebSocket，所以端口与 Android/H5 不一致是正常设计。

### 5.3 媒体与业务参数（`__call`）

- `mode`：`live`（实时）或 `play`（回放）
- `source`：
  - `live` 时一般为 `MainStream` / `SubStream`
  - `play` 时一般为回放文件名
- `audio` / `video` / `datachannel`：
  - 协议层支持多形态表达（例如方向字符串或布尔语义映射）；
  - Android demo 当前常见取值为 `audio="sendrecv"`、`video="recvonly"`、`datachannel="true"`；
  - 接入时以服务端兼容规则为准。
- `iceservers`：服务器下发或业务侧注入的 ICE 列表

---

## 6. 设备主导场景下的呼叫关系说明

在实际业务里，即使是“DejaOS 设备主动找 Android”，常见落地也不是设备直接呼叫 Android 建链，而是：

1. DejaOS 设备通过既有通道通知业务后台（来电/告警/门铃事件）。
2. 后台再通知 Android 客户端。
3. Android 客户端收到通知后，反向以 `peerid=设备serialno` 发起 WebRTC 呼叫。

因此从信令实现上看，Android 往往是“实际发起连接的一侧”，而设备是“稳定标识、被呼叫目标的一侧”。

---

## 7. 联调建议（Android）

- 优先确认 WebSocket 已连接且 `peerid` 可达（在线状态来自 `_create.state`）。
- 先打通 `live + MainStream + audio/video=true` 的最小链路，再叠加 DataChannel、回放等特性。
- 若出现“有信令无画面”：
  - 先检查 ICE 是否持续交换；
  - 再检查 `iceServers` 是否有效、网络是否限制 UDP；
  - 最后核查编解码和渲染面配置。
- 若出现“页面收到消息但状态不推进”，优先检查事件名下划线方向（`__xxx` vs `_xxx`）是否发送反了。

---

## 8. 示例源码与 APK

- Android 示例源码（GitHub）：
  - [https://github.com/DejaOS/DejaOS/tree/main/demos/vf105_v12/vf105_v12_intercom/android/src](https://github.com/DejaOS/DejaOS/tree/main/demos/vf105_v12/vf105_v12_intercom/android/src)
- 已构建 APK 下载地址（GitHub）：
  - [https://github.com/DejaOS/DejaOS/blob/main/demos/vf105_v12/vf105_v12_intercom/android/app-debug.apk](https://github.com/DejaOS/DejaOS/blob/main/demos/vf105_v12/vf105_v12_intercom/android/app-debug.apk)

---

## 9. 联调截图（Android + DejaOS）

![Android 与 DejaOS 可视对讲联调效果](/img/webrtc_android.jpg)

---

## 附录 A：WebSocket 信令协议

约定：

- 以下为厂商提供的私有 WebSocket 协议事件名，属于除 DejaOS 设备外各客户端（Android/H5 等）共用的接入协议。
- 双下划线前缀 `__` 一般表示“客户端主动发送到服务端”；
- 单下划线前缀 `_` 一般表示“服务端/对端回推到客户端”。
- 字段命名以现网兼容为主（如 `label`、`sdpMLineIndex` 并存场景），接入时按服务端实际为准。
- 本附录为协议层说明；Android/H5 在字段取值上可存在实现差异，均以服务端兼容规则为准。

### A.1 公共数据结构

多数事件 `data` 内包含：

- `sessionId`：会话 ID
- `sessionType`：会话类型，按客户端类型与服务端约定取值（如 `app`、`IE`）
- `messageId`：消息唯一 ID（建议 UUID）
- `from`：发送方 ID
- `to`：目标方 ID

---

### A.2 建链主流程（设备发 Offer 的常见流程）

#### 1）创建会话请求：`__connectto`

```json
{
  "eventName": "__connectto",
  "data": {
    "sessionId": "xxx",
    "sessionType": "IE",
    "messageId": "xxx",
    "from": "meid",
    "to": "peerid"
  }
}
```

#### 2）服务端回创建结果：`_create`

```json
{
  "eventName": "_create",
  "data": {
    "sessionId": "xxx",
    "sessionType": "IE",
    "messageId": "xxx",
    "from": "meid",
    "to": "peerid",
    "state": "online",
    "iceServers": []
  }
}
```

- `state`：`online` / `offline`
- `iceServers`：后续建 PeerConnection 使用

#### 3）发起呼叫参数：`__call`

```json
{
  "eventName": "__call",
  "data": {
    "sessionId": "xxx",
    "sessionType": "IE",
    "messageId": "xxx",
    "from": "meid",
    "to": "peerid",
    "mode": "live",
    "source": "MainStream",
    "datachannel": true,
    "audio": true,
    "video": true,
    "user": "admin",
    "pwd": "123456",
    "iceservers": "[]"
  }
}
```

#### 4）接收 Offer：`_offer`

```json
{
  "eventName": "_offer",
  "data": {
    "sessionId": "xxx",
    "sessionType": "IE",
    "messageId": "xxx",
    "from": "meid",
    "to": "peerid",
    "type": "offer",
    "sdp": "v=0...",
    "state": "optional"
  }
}
```

#### 5）回 Answer：`__answer`

```json
{
  "eventName": "__answer",
  "data": {
    "sessionId": "xxx",
    "sessionType": "IE",
    "messageId": "xxx",
    "from": "meid",
    "to": "peerid",
    "type": "answer",
    "sdp": "v=0..."
  }
}
```

#### 6）交换 ICE Candidate

客户端发：

```json
{
  "eventName": "__ice_candidate",
  "data": {
    "sessionId": "xxx",
    "sessionType": "IE",
    "messageId": "xxx",
    "to": "peerid",
    "from": "meid",
    "label": 0,
    "candidate": "candidate:..."
  }
}
```

客户端收：

```json
{
  "eventName": "_ice_candidate",
  "data": {
    "sessionId": "xxx",
    "sessionType": "IE",
    "messageId": "xxx",
    "to": "peerid",
    "from": "meid",
    "sdpMLineIndex": 0,
    "candidate": "candidate:..."
  }
}
```

---

### A.3 反向 Offer 场景（客户端发 Offer）

该协议支持“客户端先发 Offer”路径，核心差异是：

- 客户端先创建本地 Offer 后再发起协商；
- 另一侧回 Answer；
- ICE 交换逻辑不变；
- 仍沿用同一套 `sessionId` / `messageId` 机制。

Android 客户端实现中保留了 `__offer` 分支，用于兼容不同发起方流程。

---

### A.4 信令透传消息（非 SDP/ICE）

说明：以下事件属于协议能力，Android demo 中不一定全部走主流程。

#### 设备 -> 客户端：`_equipment_message`

```json
{
  "eventName": "_equipment_message",
  "data": {
    "sessionId": "xxx",
    "sessionType": "IE",
    "messageId": "xxx",
    "to": "peerid",
    "from": "meid",
    "message": {}
  }
}
```

#### 客户端 -> 设备：`__post_message`

```json
{
  "eventName": "__post_message",
  "data": {
    "sessionId": "xxx",
    "sessionType": "IE",
    "messageId": "xxx",
    "to": "peerid",
    "from": "meid",
    "message": {}
  }
}
```

回执：`_post_message`（包含 `result` 字段，字段细节以服务端实际返回为准）。

---

### A.5 DataChannel 消息

文档中 DataChannel 双向载荷示例统一为：

```json
{
  "type": "xxx",
  "data": {}
}
```

建议：

- `type` 作为业务动作名（如 `ptz`、`unlock`、`heartbeat`）
- `data` 放具体参数
- 业务层自行加时间戳与签名字段（如需要）

---

### A.6 断开流程

#### 设备侧触发断开：`_session_disconnected`

```json
{
  "eventName": "_session_disconnected",
  "data": {
    "sessionId": "xxx",
    "sessionType": "IE",
    "messageId": "xxx",
    "to": "peerid",
    "from": "meid",
    "message": {}
  }
}
```

#### 客户端触发断开：`__disconnected`

```json
{
  "eventName": "__disconnected",
  "data": {
    "sessionId": "xxx",
    "sessionType": "IE",
    "messageId": "xxx",
    "to": "peerid",
    "from": "meid"
  }
}
```

---

### A.7 当前 Android 代码已使用的核心事件名

- 主动发送：`__connectto`、`__call`、`__offer`、`__answer`、`__ice_candidate`、`__disconnected`
- 被动接收：`_create`、`_offer`、`_ice_candidate`、`_session_disconnected`、`_post_message`

与附录协议可直接对应，用于接口联调与抓包核对。

### A.8 Android demo 中的业务扩展事件（非核心 RTC）

- 主动发送：`__subscribe`、`__play`、`__download`
- 说明：这些事件用于业务场景扩展（订阅、回放、下载），不影响核心 RTC 建链主流程。
