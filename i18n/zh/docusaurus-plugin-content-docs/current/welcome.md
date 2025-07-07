---
id: welcome
title: 欢迎使用 DejaOS
---

DejaOS 是一个专为嵌入式设备设计的 JavaScript 运行时环境，使低成本、低配置的智能设备能够运行 JavaScript 代码。它使用 JavaScript 作为开发语言，降低成本并简化开发过程。

### 🚀 核心特性

DejaOS 为嵌入式开发提供了一套全面的 JavaScript 模块：

- **硬件接口模块** - GPIO、PWM、UART、RS-485、RS-232、USB、Wiegand、Watchdog、Capturer、ALSA、NFC、QRCode、BLE、人脸识别等
- **网络和通信协议模块** - Net、TCP、TCP Server、MQTT、UDP、HTTP、Web Server、OSDP 等
- **图形模块** - 支持使用 JavaScript 绘制 GUI 界面，兼容所有 LVGL 原生功能
- **工具模块** - 线程、加密/解密、日志、EventBus、NTP、SQLite 等
- **第三方模块** - 支持使用 import (ESM) 导入纯 JavaScript 第三方模块
- **原生 C 库支持** - 允许通过 JavaScript 包装的嵌入式原生 C 库进行开发

### 🛠 技术基础

DejaOS 基于 Mip/ARMLinux、QuickJS 和 LVGL 构建：

- **Mip/ARMLinux** - 具有系统进程、线程和资源调度功能的嵌入式 Linux
- **QuickJS** - 支持 ES2020 标准的紧凑快速 JavaScript 引擎
- **LVGL** - 最受欢迎的开源嵌入式图形库，允许使用 JavaScript 轻松创建美观的 UI

### 📱 开发流程

DejaOS 应用的开发流程简单直接：

1. **准备开发环境** - 安装 Node.js (20+)、VSCode 和 DXIDE (VSCode 插件)
2. **连接设备** - 使用 USB 将开发设备连接到 VSCode
3. **编写代码** - 在 VSCode 中编写 JavaScript 应用程序，实时同步
4. **构建和部署** - 构建 DPK 安装包并部署到生产设备

### 🎯 为什么选择 DejaOS？

- **JavaScript 无处不在** - 前端和后端开发都使用 JavaScript
- **丰富的硬件支持** - 全面的硬件接口模块
- **现代 GUI** - 与 LVGL 集成的美观 UI 开发
- **实时开发** - 实时代码同步和调试
- **生产就绪** - 简单的打包和部署系统
- **开源** - MIT 许可，社区驱动开发

### 🏗 项目结构

典型的 DejaOS 项目包含：

| 文件       | 必需 | 功能         |
| ---------- | ---- | ------------ |
| .temp      | 否   | 存储临时文件 |
| dxmodules  | 否   | 存储依赖文件 |
| src        | 是   | 项目逻辑     |
| main.js    | 是   | 项目入口文件 |
| app.dxproj | 是   | 项目配置文件 |

### �� 快速开始

准备开始了吗？查看我们的相关文档，了解如何创建您的第一个 DejaOS 应用程序！

有关支持的设备和设置说明的更多信息，请查看我们的[系统要求](requirements)文档。
