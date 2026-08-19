# Windows UI 模拟器

**DejaOS Simulator** 是 VSCode DejaOS 插件 **v1.0.44** 内置的原生桌面 UI 运行环境。它使用 QuickJS 执行当前项目的 JavaScript，并通过 LVGL 的 Windows 驱动渲染 dxUi，使开发者可以在部署到真实设备前预览和操作设备界面。

![DejaOS Simulator 以 75% 比例运行 800 × 1280 项目](/img/ui/dejaos-simulator.png)

:::info 当前平台
首个版本仅支持本地 **Windows x64** VSCode 环境，暂不支持 Remote SSH、WSL、VSCode Web、macOS 和其他平台。
:::

## 模拟器支持的内容

- 原生 QuickJS 执行和 LVGL/dxUi 渲染
- SDK 2.0 UI Worker 项目和 SDK 4.0 单运行时项目
- 通过 `uiLoader` 加载 `.ui` 文件
- 项目图片与 TTF 字体，包括 `/app/code/...` 形式的资源路径
- 鼠标操作、按钮、文本输入控件、JavaScript UI 事件、动画和定时器
- 项目自身 `dxmodules/dxDriver.js` 中的显示配置
- 在 VSCode **DejaOS Simulator** 输出通道中查看运行日志

界面逻辑宽高、DPI 和板级常量来自项目的 `dxDriver.js`，旋转方向在应用初始化 dxUi 时生效。如果逻辑屏幕大于电脑桌面，模拟器启动时会在保持设备宽高比的前提下缩放窗口以适应当前显示器。拖动调整窗口或最大化窗口不会改变应用使用的逻辑布局坐标。

## 使用前准备

项目至少需要包含：

```text
app.dxproj
dxmodules/
  dxDriver.js
src/
  main.js
```

运行模拟器前：

1. 在本地且已信任的 VSCode 窗口中打开项目。
2. 在 DejaOS IDE 中执行 **Install**，确保已经生成 `dxmodules/dxDriver.js` 和项目所需的其他组件。
3. 确认 `src/main.js` 会按正常项目流程初始化 UI。
4. 将 `.ui` 文件、图片、字体和其他应用资源保存在项目目录内。

## 从 IDE 运行

点击 VSCode 状态栏中的 **Simulator**。

首次运行某个模拟器版本时，IDE 会询问是否下载并安装 Windows x64 运行时。确认后，IDE 会下载压缩包、校验 SHA-256，并将其安装到 VSCode 扩展存储目录，而不是 DejaOS 项目目录。模拟器升级后，新版本会安装在独立的版本目录中。

随后 IDE 会：

1. 优先选择当前活动文件所属的 DejaOS 项目；工作区包含多个项目时会要求选择。
2. 把项目根目录明确传给模拟器，并运行项目的 `src/main.js`。
3. 打开原生模拟器窗口和 **DejaOS Simulator** 输出通道。

再次点击 **Simulator** 会先停止上一次模拟器进程，再启动新的进程。关闭模拟器窗口也会结束对应进程。

## 项目路径与数据

模拟器会把设备路径映射到桌面项目：

| 应用路径 | Windows 模拟器位置 |
| --- | --- |
| `/app/code/...` | 当前 DejaOS 项目目录 |
| `/app/data/...` | `<project>/.simulator-data/...` |

因此，`/app/code/src/pages/settings.ui`、`/app/code/resource/image/icon.png` 和 `/app/code/resource/font/font.ttf` 等现有路径无需为了 Windows 单独修改。

`dxDriver.js` 始终从当前项目加载。其他已知 DejaOS 组件通常优先从模拟器运行时加载，避免在 Windows 中加载面向 Linux 的动态库封装；自定义组件和兼容的纯 JavaScript 组件仍可回退到项目中的版本。

## 运行边界

模拟器面向开发初期的 UI 调试，并不是完整的设备仿真环境。

- dxUi/LVGL 渲染、`uiLoader`、项目显示配置和常见 UI 交互属于真实的模拟器行为。
- 大多数硬件、网络、数据库、摄像头、人脸识别、NFC、GPIO 和设备服务组件采用 mock 或尽力而为的实现。
- mock 函数可能只返回占位值，使应用尽量继续运行；这并不保证业务分支、时序、事件和错误处理与真实设备一致。
- 设备性能、摄像头预览、硬件输入输出、系统集成、最终字体效果和触摸体验仍需在目标设备上验证。

如果项目启动过程强依赖硬件，可将 UI 初始化与硬件初始化分离，或在模拟器开发阶段从应用边界注入自己的 mock 数据。生产运行路径仍应使用项目生成的真实 DejaOS 组件。

## 推荐开发流程

1. 使用[可视化 UI Editor](./editor.md) 或普通 dxUi 代码构建控件树。
2. 在模拟器中运行页面，迭代布局、图片、字体、导航、输入和事件。
3. 当 UI 需要记录或设备状态时，在应用边界使用 mock 数据。
4. 部署到目标设备，验证硬件行为、组件 API、时序、资源和性能。

## 常见问题

- **Simulator 提示缺少项目文件**：确认所选项目包含 `app.dxproj`、`src/main.js` 和 `dxmodules/dxDriver.js`。
- **无法下载运行时**：检查网络后重试；每个压缩包在安装前都会进行 SHA-256 校验。
- **图片或字体没有显示**：确保资源位于项目内并使用 `/app/code/...` 运行时路径，同时查看 **DejaOS Simulator** 输出通道中的实际路径或加载错误。
- **应用可以启动，但设备业务逻辑不正确**：确认相关组件是否为模拟器 mock，再隔离该依赖或转到真实设备验证。
