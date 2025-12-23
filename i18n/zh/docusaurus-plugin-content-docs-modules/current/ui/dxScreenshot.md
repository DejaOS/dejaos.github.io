# dxScreenshot

## 1. 概述

`dxScreenshot` 是一个为 DejaOS UI 应用程序开发的高级**截屏辅助模块**。
它提供了一种简单的方法来：

- 通过简单的初始化配置截屏上传行为。
- 自动启动后台进程处理文件上传。
- 手动截屏或将其绑定到 UI 交互（例如：**双击屏幕**）。
- 自动捕捉并上传运行设备上的 UI 截图，用于调试和远程诊断。

## 2. 相关文件

- `dxScreenshot.js` – UI 代码中使用的主要 JavaScript 辅助模块。
- `screenshotworker.js` – 处理扫描和上传的后台进程脚本。

> 确保这两个文件都放在项目根目录下的 `dxmodules` 子目录中（例如 `/app/code/dxmodules/`）。

## 3. 依赖项

`dxScreenshot` 要求在项目中启用以下 DejaOS 模块：

- `dxLogger`
- `dxStd`
- `dxMap`
- `dxNetwork`
- `dxHttpClient`

## 4. 兼容设备

兼容所有运行 **dejaOS v2.0+** 并启用了 DejaOS UI 引擎 (`dxUi`) 的设备。

## 5. 工作原理

`dxScreenshot` 模块在后台运行，以确保您的 UI 保持响应：

- **捕捉**：当您触发截屏（手动或通过双击）时，模块会捕捉当前的 UI 状态并将其保存到设备的本地存储中。
- **上传**：后台进程会自动监控本地存储，并在网络连接可用时将任何待处理的截图上传到您配置的服务器。
- **清理**：为了节省空间，截图在成功上传后会自动从设备中删除。

## 6. 配置与存储

- **本地存储**：截图临时存储在 `/app/data/snapshot/`。
- **上传设置**：所有上传行为（URL、网络设置）都在初始化期间通过 `DxScreenshot.init()` 配置一次。

## 7. API 参考

所有函数均通过默认导出对象 `DxScreenshot` 提供。

### 7.1 `DxScreenshot.init(options)`

初始化截屏工具并启动后台上传进程。这通常应该在主应用程序入口点调用一次。

**参数：**

- `options` `{Object}`:
  - `uploadUrl` `{string}` – 截图将上传到的 HTTP/HTTPS 端点。
  - `autoNet` `{boolean}` _(可选，默认：`false`)_ – 如果希望模块通过 `dxNetwork` 自动管理网络连接（以太网/Wi-Fi），请设置为 `true`。
  - `netType` `{"eth"|"wifi"}` _(可选)_ – 如果 `autoNet` 为 `true`，则为必填项。
  - `ssid` `{string}` _(可选)_ – Wi-Fi SSID（Wi-Fi 自动联网模式必填）。
  - `password` `{string}` _(可选)_ – Wi-Fi 密码（Wi-Fi 自动联网模式必填）。

### 7.2 `DxScreenshot.screenshot(view, fileName)`

手动捕捉指定的 UI 视图并将其保存到本地存储以供后续上传。

**参数：**

- `view` `{object}` – 要捕捉的 UI 视图对象（必须支持 `.snapshot()` 方法）。
- `fileName` `{string}` – 截屏文件的目标名称（例如：`"error_report.png"`）。

### 7.3 `DxScreenshot.buildFileName(prefix)`

根据当前系统时间戳生成唯一文件名的辅助工具。

**参数：**

- `prefix` `{string}` _(可选，默认：`"screenshot"`)_ – 文件名的前缀。
- **返回值**：形如 `prefix_20251223_101530.png` 的格式化字符串。

### 7.4 `DxScreenshot.bindDoubleClickScreenshot(view, options)`

一种方便的方法，用于将“双击捕捉”行为绑定到任何 UI 元素。这对于在背景或主容器中添加“隐形”诊断触发器非常有用。

**参数：**

- `view` `{object}` – 要绑定行为的 UI 组件（例如：View）。
- `options` `{object}` _(可选)_:
  - `interval` `{number}` – 检测双击的最大时间窗口（毫秒）。**默认：`400`。**
  - `prefix` `{string}` – 生成截图的文件名前缀。**默认：`"home"`。**

## 8. 使用示例

```javascript
import dxui from "./dxmodules/dxUi.js";
import std from "./dxmodules/dxStd.js";
import log from "./dxmodules/dxLogger.js";
import DxScreenshot from "./dxmodules/dxScreenshot.js";

// 1) 初始化 UI
dxui.init({ orientation: 1 });

// 2) 初始化 DxScreenshot 及其上传设置
DxScreenshot.init({
  uploadUrl: "http://your-server.com/upload",
  autoNet: true,
  netType: "wifi",
  ssid: "YourSSID",
  password: "YourPassword",
});

// 3) 构建 UI
const root = dxui.View.build("main_root", dxui.Utils.LAYER.MAIN);
root.setSize(480, 320);
root.bgColor(0x1c2331);
dxui.loadMain(root);

// 4) 将双击截屏绑定到根视图
// 现在，双击屏幕上的任何空白区域都将触发一次捕捉
DxScreenshot.bindDoubleClickScreenshot(root, { prefix: "diagnostic" });

// 5) UI 事件循环
std.setInterval(() => {
  dxui.handler();
}, 20);
```

### 8.1 示例 UI 截图

下图显示了参考测试 UI 布局：

![DxScreenshot 测试 UI](/img/ui/dxscreenshot.png)

## 9. 示例上传服务器 (Node.js)

出于测试目的，您可以使用简单的 Node.js 服务器来接收文件：

```javascript
const express = require("express");
const multer = require("multer");

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("file"), (req, res) => {
  console.log("收到文件:", req.file.originalname);
  res.json({ status: "ok" });
});

app.listen(3000, () => console.log("服务器运行在 3000 端口"));
```

## 10. 最佳实践与注意事项

- **网络管理**：如果您的应用程序已经管理了网络连接，请将 `autoNet` 设置为 `false` 以避免冲突。
- **隐私**：请仅在开发或特定诊断目的并在用户同意的情况下使用此模块，因为它会捕捉整个可见 UI。
- **清理**：模块会在成功上传后自动删除文件。如果上传重复失败，请手动检查 `/app/data/snapshot/` 以确保设备存储空间未满。
