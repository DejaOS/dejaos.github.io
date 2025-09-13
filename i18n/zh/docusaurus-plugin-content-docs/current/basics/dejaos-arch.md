# 架构

---

## 概述

**DejaOS** 是一个专为嵌入式设备设计的 JavaScript 运行时环境，基于 QuickJS 引擎，能够在资源受限的设备上高效运行。此外，它集成了 LVGL 图形引擎，适用于带屏幕的设备。开发者可以通过 `import` 不同的 JavaScript 模块来实现各种业务逻辑。DejaOS 还提供了 VS Code 插件，方便开发、调试和部署。

DejaOS 的核心目标是简化嵌入式开发过程，让更多应用开发者（甚至没有硬件背景的开发者）能够轻松进入嵌入式开发领域。相比传统的 C/C++ 嵌入式开发，JavaScript 更加友好，开发门槛更低。考虑到应用开发者的数量远超嵌入式工程师，DejaOS 希望通过更现代化的开发体验来加速物联网设备的普及和创新。

---

## 操作系统与应用程序的关系

DejaOS 是一个基于嵌入式 Linux 的系统平台，扩展了 JavaScript 应用程序的运行时能力。其开发体验和机制与 Android 或 iOS 非常相似。

### 与移动系统的相似之处

1. 在 VS Code 中编写代码，通过 USB 实时同步到设备执行。
2. 构建成应用程序安装包（`.dpk`），类似于 Android 的 `.apk`。
3. 应用程序可以通过安装工具或网络进行部署和升级，未来计划支持应用商店。

### 与移动系统的主要区别

- 可以在极低配置的设备上运行（约 5MB 存储 / 2MB 内存）。
- 目前仅支持单应用程序运行（未来可能扩展为多应用程序）。
- 无统一系统界面（无"桌面"或"设置"UI）。
- 每个设备型号需要专门定制的系统镜像来匹配硬件驱动。
- 使用 JavaScript 开发，支持热更新，无需编译即可运行。

---

## 系统架构（运行时）

![DejaOS 运行时架构](/img/intro1.png)

运行时架构分为四层：

### 1. 操作系统层（OS）

嵌入式 Linux 系统，提供内存管理、进程调度、文件系统等基础服务。

### 2. 模块层（Modules）

每个模块封装特定功能，通常包括：

- `.js` 文件：暴露统一的 JavaScript API
- `.so` 文件：实际的底层驱动实现（C/C++），部分模块可能不需要 `.so` 文件

不同设备对应不同的 `.so` 文件，但 `.js` 层接口保持一致，从而屏蔽设备差异。

目前，所有模块均由官方团队提供和维护。未来将开放模块商店，允许开发者开发自己的模块并发布到模块商店。

### 3. 引擎层（Engines）

- JavaScript 引擎（基于 QuickJS）：解析和执行 JavaScript 代码。
- 图形引擎（基于 LVGL）：提供 GUI 渲染能力，支持触摸和交互。

### 4. 应用程序层（App）

开发者使用 JavaScript 编写的业务逻辑，在运行时调用模块 API 与硬件交互。

跨设备运行：同一套 JavaScript 应用程序可以在各种设备上运行，只需选择适配的模块库。

---

## 系统架构（开发）

![DejaOS 开发架构](/img/intro2.png)

开发者通过 VS Code 连接设备，实现高效的本地开发体验：

- 实时源代码同步到设备
- 控制应用程序启动和停止
- 实时接收设备日志在 IDE 中显示
- 快速调试硬件行为

---

## 示例代码：二维码识别

以下是一个典型场景：扫描二维码并打印其内容。

```js
import log from "../dxmodules/dxLogger.js";
import std from "../dxmodules/dxStd.js";
import bus from "../dxmodules/dxEventBus.js";
import code from "../dxmodules/dxCode.js";
import common from "../dxmodules/dxCommon.js";

// 1. 初始化二维码扫描模块
code.worker.beforeLoop(
  { id: "capturer1", path: "/dev/video11" },
  { id: "decoder1", name: "decoder v4", width: 800, height: 600 }
);

// 2. 订阅二维码识别事件
bus.on(code.RECEIVE_MSG, function (data) {
  let str = common.utf8HexToStr(common.arrayBufferToHexString(data));
  log.info(str); // 打印二维码内容
});

// 3. 每 50ms 轮询扫描结果
std.setInterval(() => {
  try {
    code.worker.loop();
  } catch (error) {
    log.error(error);
  }
}, 50);
```

示例整体非常简单：

1. `import` 标准库，这里使用了 4 个库：
   - dxLogger.js：用于打印日志
   - dxStd.js：基础系统库，本例中用于轮询
   - dxEventBus.js：事件库，本例中用于订阅二维码扫描成功事件
   - dxCode.js：摄像头库，用于识别和解析二维码，该库也支持条形码
2. 初始化设备的摄像头进行二维码识别，初始化参数值可能因不同设备而异
3. 订阅二维码识别成功事件并注册回调函数
4. 在回调函数中处理二维码内容，本例中简单地打印二维码内容
5. 轮询尝试从摄像头获取二维码识别结果

如果您期望在设备上运行此代码，只需通过 USB 线将设备连接到您的计算机，然后使用 VSCode 中的插件将代码同步到设备并运行。

---

## 总结

DejaOS 使用 JavaScript 作为核心语言，大幅降低了嵌入式开发的门槛。通过标准化的模块、高效的开发工具链和轻量级的运行时架构，使设备开发变得像 Web 开发一样简单高效。它正在逐渐成为下一代物联网应用程序的理想平台。
