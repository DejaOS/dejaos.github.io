# Android 风格多媒体 UI 演示

本示例在 DejaOS 上呈现一个 Android 风格的系统桌面，并模拟多种常用应用。它主要用于产品宣传视频、展会演示，以及展示 DejaOS 的 UI、动画、音频、摄像头预览与交互能力。

:::info 示例范围
本项目**不是 Android 系统**，也没有复刻所模仿应用的真实在线服务。大部分内容来自本地示例数据，桌面上的部分应用图标仅用于占位。它应被视为 UI 与多媒体能力展示，而不是可投入业务使用的操作系统或正式应用。
:::

## 界面预览

| 系统桌面 | 音乐播放器 |
| :---: | :---: |
| ![Android 风格系统桌面](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/fake_android_demo/screenshot/desktop-preview.png) | ![WAV 音乐播放器](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/fake_android_demo/screenshot/music-preview.png) |

| 模拟导航 | 系统设置 |
| :---: | :---: |
| ![模拟导航页面](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/fake_android_demo/screenshot/map-preview.png) | ![Android 风格设置页面](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/fake_android_demo/screenshot/settings-preview.png) |

| 消息列表 | 中文输入与自动回复 |
| :---: | :---: |
| ![即时通讯消息列表](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/fake_android_demo/screenshot/chat-preview.png) | ![内置中文键盘聊天页面](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/fake_android_demo/screenshot/chat-keyboard-preview.png) |

| 图库 | 全屏图片浏览 |
| :---: | :---: |
| ![图库九宫格](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/fake_android_demo/screenshot/gallery-preview.png) | ![图库大图浏览](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/fake_android_demo/screenshot/gallery-viewer-preview.png) |

:::note 预览图说明
以上图片用于说明应用的页面布局和展示效果。部分文档图片依据已实现的 800×1280 UI 生成，并不是从设备屏幕拍摄或导出的真实截图。
:::

## 功能特性

- **Android 风格桌面**：包含状态区域、天气卡片、应用搜索栏、图标入场动画、底部 Dock 和多个占位应用。
- **WAV 音乐播放**：播放 PCM WAV 音频并同步滚动 LRC 字幕，同时展示旋转唱片和移动唱臂；播放与停止按钮可真实操作。
- **模拟地图导航**：在静态地图图片上叠加路线、车辆位置、转向提示、行程状态，并分阶段播放 WAV 语音提示。
- **摄像头视频页面**：初始化设备支持的摄像头与显示链路，以视频应用的形式展示实时预览。
- **即时通讯流程**：包含消息列表、二级聊天页、内置拼音键盘、消息提交，以及首个会话中的延迟自动回复。
- **图库与大图浏览**：以三列网格展示 5 张本地图片，点击后进入沉浸式浏览页面并支持上一张、下一张切换。
- **设置页面展示**：提供 Android 风格的设置分类、详情页、开关和滑块；页面使用示例值，不修改设备系统配置。

## 使用 Codex 与 DejaOS Skill 开发

本示例由 **Codex** 配合 **DejaOS 应用开发 Skill** 进行设计、实现和多轮迭代。开发流程在视觉调整之外还包含 DejaOS 专项约束：

- 确认目标型号为 `FCV5005`，项目使用 SDK 4.0。
- 在调用 UI、音频、摄像头、显示或人脸组件之前，先检查项目本地生成的 `dxmodules/` 封装。
- 通过 DejaOS CLI 构建和同步，并在重要改动后读取一段有界的设备日志。
- 依据真机反馈持续调整布局，同时明确区分生成的文档预览图与真实设备截图。

## 源码结构说明

完整源码：[DejaOS 仓库 · `apps/features/fake_android_demo`](https://github.com/DejaOS/DejaOS/tree/main/apps/features/fake_android_demo)

- `source/src/desktop.js`：桌面布局、应用网格、Dock 和入场动画。
- `source/src/musicPlayer.js` 与 `audioService.js`：WAV 播放、字幕、唱片动画和导航语音。
- `source/src/mapPage.js`：模拟路线与导航流程。
- `source/src/videoPage.js` 与 `cameraService.js`：实时摄像头预览生命周期。
- `source/src/chatApp.js` 与 `pinyinDict.js`：即时通讯页面和本地中文键盘。
- `source/src/settingsPage.js`：设置列表、详情页、开关与滑块。
- `source/src/galleryPage.js`：图片网格与全屏浏览页面。
- `source/resource/`：字体、图标、图片、音频、地图和动画资源。

## 构建与运行

进入 `source` 目录，通过 DejaOS CLI 安装项目组件并运行：

```bash
dejaos install
dejaos run
```

---

**提示**：本项目面向 **FCV5005**，使用 **DejaOS SDK 4.0**，界面按照 **800×1280** 竖屏分辨率设计。迁移到其他分辨率时，需要调整坐标与图片资源。
