# 设备部分

---

本文提供基于 DejaOS 设备与平台实现可视对讲的最小可运行方案，面向二次开发场景。  
内容覆盖：模块职责、关键参数、线程协作、会话流程、H5 联调方法与多端互通约束。

---

## 1. 目标与范围

本示例用于验证以下能力：

1. 设备侧基础工程结构（UI 主线程 + 对讲 Worker 线程）。
2. 最小对讲调用链路（初始化 -> 联网 -> 来电 -> 接听/挂断）。
3. 与平台 WebRTC 服务的联调路径。

---

## 2. 设备侧模块职责

示例涉及的核心模块如下：

- `dxCapture`：从摄像头持续采集图像帧。
- `dxIvcore`：对原始图像数据进行处理。
- `dxAudio`：处理音频采集与播放。
- `dxDisplay`：将图像输出到设备屏幕。
- `dxIntercom`：处理可视对讲音视频流（当前能力：**视频单向，音频双向**）。
- `dxNetwork`：处理网络接入与网络状态回调。

可视对讲依赖稳定网络。部署实践中：

- `eth`（有线）通常具备更好的时延与稳定性表现。
- `wifi` 可用，但在复杂无线环境下可能出现抖动增大。

---

## 3. 线程架构

示例采用双线程模型：

- `main.js`（主线程）：负责 UI 绘制与用户交互。
- `intercomWorker.js`（Worker 线程）：负责网络、媒体、对讲模块初始化与回调处理。


---

## 4. 主线程关键调用

主线程通过事件总线触发 Worker 初始化：

```js
const WEBRTC_SERNO = "KDZN-00-1K4V-HBNJ-00000004";
const WEBRTC_URL = "webrtc.dxiot.com:6699";

bus.fire("worker.connect", {
  webrtcSerno: WEBRTC_SERNO,
  webrtcUrl: WEBRTC_URL,
});
```

参数说明：

- `webrtcSerno`：设备在平台侧的唯一标识（呼叫目标 ID），每台设备对应唯一一个 `serno`。
- `webrtcUrl`：设备接入对讲服务的地址（示例格式：`host:port`）。服务端相关配置在后续文档单独说明。当前默认部署模式为信令服务与 WebRTC 服务统一安装部署，因此通常只使用一个 URL。

---

## 5. Worker 初始化流程

Worker 推荐初始化顺序如下：

```js
dxNet.init();
dxIvcore.init();
dxCapture.init();
dxAudio.init();
dxDisplay.init();

dxIntercom.init({
  webrtc: {
    serno: webrtcSerno,
    servers: webrtcUrl,
  },
});
```

初始化后注册回调并启动网络连接：

```js
dxIntercom.setCallbacks({
  onIncoming(sessionId, action) { /* 来电开始/结束 */ },
  onCallStart(sessionId) { /* 通话开始 */ },
  onCallEnd(sessionId) { /* 通话结束 */ },
  onCallFail(sessionId, reason) { /* 通话失败 */ },
});

dxNet.connectEthWithDHCP();
```

---

## 6. 循环驱动与会话控制

示例采用 30ms 周期驱动网络与对讲事件循环：

```js
std.setInterval(() => {
  dxNet.loop();
  dxIntercom.loop();
}, 30);
```

`sessionId` 作为一次会话的唯一标识，用于接听与挂断：

```js
dxIntercom.answer(sessionId);
dxIntercom.hangup(sessionId);
```

自动接听、超时挂断、忙线拒接等策略均基于 `sessionId` 状态机实现。

---

## 7. 多端互通现状

当前支持的 WebRTC 客户端包括：

- DejaOS 设备
- Android 客户端
- H5 页面客户端

当前限制：

- DejaOS 设备暂不支持直接主动呼叫 Android 或 H5 客户端。

常见业务链路：

1. DejaOS 设备通过网络接口（如 HTTP）通知后台服务。
2. 后台服务通知 Android 客户端。
3. Android 客户端反向呼叫 DejaOS 设备。

本示例使用 H5 呼叫 DejaOS 设备进行联调验证。

---

## 8. H5 联调地址

测试站点：

- `https://webrtc.dxiot.com:8443/`

示例设备呼叫地址：

- `https://webrtc.dxiot.com:8443/videocall/KDZN-00-1K4V-HBNJ-00000004`

使用时将 URL 末尾替换为目标设备 `serno`。该地址仅用于调试验证，不可直接用于生产环境。

---

## 9. H5 示例代码（简要）

H5 示例目录：`demos/vf105_v12/vf105_v12_intercom/h5`

`index.html` 入口调用：

```js
var toclientid = "KDZN-00-1K4V-HBNJ-00000004";
var host = "webrtc.dxiot.com:8443";
RHRTCStart(host, toclientid, remoteVideoview, "live", "MainStream", true, true);
```

`rhrtc.js` 主要实现：

1. 建立 WebSocket 信令连接（`__connectto`、`__call`、`__answer`、`__ice_candidate`）。
2. 按标准 WebRTC 流程完成协商（Offer/Answer/ICE）。
3. 远端媒体绑定到 `<video>` 并处理基础重连。
4. 与私有 WebSocket 协议及私有信令服务进行通信。

WebSocket 协议细节将在 Android 相关文档中单独说明。

---

## 10. 调试步骤与运行效果（设备 + H5）

![DejaOS 设备与 H5 可视对讲联调效果](/img/intercom.png)

参考示例代码，建议按以下步骤调试：

1. 在设备端点击 `Network` 按钮。  
   主线程发送 `worker.connect`，Worker 依次初始化 `dxNetwork`、`dxIvcore`、`dxCapture`、`dxAudio`、`dxDisplay`、`dxIntercom`。  
   其中 `dxCapture`、`dxAudio`、`dxDisplay` 通常可使用默认参数，`dxIntercom` 初始化至少需要 `serno` 与 `servers` 两个关键参数。

2. `dxIntercom.init` 执行后，设备与信令服务建立连接并完成注册，进入可呼叫状态。

3. 在浏览器访问：  
   `https://webrtc.dxiot.com:8443/videocall/KDZN-00-1K4V-HBNJ-00000004`。  
   该过程本质为：H5 通过 WebSocket 接入信令服务，再按 WebRTC 标准流程与设备侧建立会话连接。

4. 设备屏幕日志出现 `Incoming`（来电）后，点击 `Answer` 按钮。  
   Worker 调用 `dxIntercom.answer(sessionId)`，并打开音视频链路（`setAudio` / `setVideo`）。  
   此时 H5 页面可看到设备摄像头画面，并可进行双向音频对话。调试时应避免终端与设备距离过近，以减少声学回响。

5. 点击 `Hangup` 按钮。  
   Worker 调用 `dxIntercom.hangup(sessionId)`，结束会话并停止当前音视频链路。

---

## 11. 源码链接

设备侧示例源码：

- [https://github.com/DejaOS/DejaOS/tree/main/demos/vf105_v12/vf105_v12_intercom/device/intercom_demo/src](https://github.com/DejaOS/DejaOS/tree/main/demos/vf105_v12/vf105_v12_intercom/device/intercom_demo/src)

H5 示例源码：

- [https://github.com/DejaOS/DejaOS/tree/main/demos/vf105_v12/vf105_v12_intercom/h5](https://github.com/DejaOS/DejaOS/tree/main/demos/vf105_v12/vf105_v12_intercom/h5)
