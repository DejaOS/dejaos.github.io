---
id: welcome
title: 欢迎使用 DejaOS 模块
---

# DejaOS 模块

欢迎使用 DejaOS 模块文档！本部分包含 DejaOS 中所有可用模块的详细文档，并对常用模块做了简要分组整理，方便查找。通常一个 DejaOS 应用只会使用其中的一部分模块，开发者可以根据业务场景按需选择和组合。

## 可用模块

### 模块分组概览

- **基础模块（必选）**：

  - `dxLogger`（打印日志，替代 `console.log`）
  - `dxStd`（系统标准组件）
  - `dxOs`（操作系统组件）
  - `dxDriver`（驱动组件）
  - `dxMap`（跨 worker 共享内存）
  - `dxEventBus`（跨 worker 消息通信）
  - `dxCommonUtils`（通用算法和工具组件）

  > 说明：基础模块是绝大部分 DejaOS 应用都需要依赖的通用能力，**推荐在创建应用或选择模块时默认全部勾选**。

- **界面与交互**：

  - `dxUi`（UI 组件、布局与触摸/按键事件处理，如需界面功能时必选）

- **数据存储与配置**：

  - `dxSqlite`（SQLite 相关支持，兼容历史项目，deprecated）
  - `dxSqliteDB`（结构化数据存储，推荐使用的 SQLite 数据组件）
  - `dxKeyValueDB`（轻量 K/V 数据存储）
  - `dxConfiguration`（运行参数与业务配置的读写与持久化）
  - `dxConfig`（配置读写的兼容层与补充工具，deprecated）

- **网络与远程服务**：

  - `dxNetwork`（网络接入与管理）
  - `dxNet`（底层网络封装，deprecated）
  - `dxHttpClient`（HTTP 客户端）
  - `dxHttpServer`（HTTP 服务端）
  - `dxWebserver`（内置 Web 服务器封装，deprecated）
  - `dxHttp`（HTTP 能力的通用封装，deprecated）
  - `dxMqttClient`（MQTT 客户端）
  - `dxMqtt`（MQTT 能力的通用封装，deprecated）
  - `dxNtp`（网络时间同步）
  - `dxOta`（OTA 升级）

- **音频**：

  - `dxAudio`（WAV 播放、TTS 语音）
  - `dxAlsa`（底层音频设备控制，deprecated）
  - `dxAlsaplay`（基于 ALSA 的音频播放，deprecated）

- **外设与接口**：

  - `dxGpio`（GPIO 输出控制）
  - `dxGpioKey`（GPIO 按键输入监控）
  - `dxUart`（串口通信）
  - `dxPwm`（PWM 控制，常用于蜂鸣器与灯光调节）
  - `dxNfc`（NFC 读写与控制，deprecated）
  - `dxNfcCard`（NFC 卡片操作与管理）

- **识别与保护**：

  - `dxBarcode`（二维码/条形码识别）
  - `dxCode`（编码解析与扩展识别能力，deprecated）
  - `dxFace`（人脸识别组件，deprecated）
  - `dxFacial`（人脸识别与特征处理组件）
  - `dxFingerZaz`（指纹设备接入与识别——ZAZ 系列）
  - `dxFingerMz`（指纹设备接入与识别——MZ 系列）
  - `dxWatchdog`（看门狗保护，防止系统卡死）

- **系统工具与任务**：
  - `dxTimeZones`（时区与时间处理）
  - `dxIconv`（字符编码转换）
  - `dxCryptoES`（常用加解密与摘要算法）
  - `dxQueue`（任务队列管理）
  - `dxWorkerPool`（worker 池调度与并发任务管理）

## 开始使用

从侧边栏选择一个模块，了解更多关于其 API、使用示例和最佳实践。

## 模块开发

如果您正在为 DejaOS 开发自定义模块，后续推出相关文档。
