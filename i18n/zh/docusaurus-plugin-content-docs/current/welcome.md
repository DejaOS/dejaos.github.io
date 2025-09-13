# 什么是 DejaOS

## 🌐 概述

**DejaOS** 是一个专为嵌入式设备构建的 JavaScript 运行时环境，使低成本、资源受限的智能硬件能够高效运行 JavaScript 代码。通过采用 JavaScript 作为主要开发语言，DejaOS 大幅降低了嵌入式开发的门槛和成本，使开发过程更简单、更高效。

DejaOS 已成功部署在各种物联网场景中，展现出卓越的性能和开发效率。

---

## ⚙️ 架构

DejaOS 基于以下核心组件构建：

- **Mip / ARM Linux**：提供系统级进程、线程和资源管理
- **QuickJS**：一个轻量级、快速的 JavaScript 引擎，支持 ES2020 标准
- **LVGL**：一个流行的开源嵌入式图形库，支持 C 和 JavaScript 的丰富 UI 开发

---

## 📚 特性

DejaOS 提供全面的 JavaScript API 和系统功能：

### 🔌 硬件接口库

- GPIO、PWM、UART、RS-485、RS-232、USB、Wiegand、看门狗
- 摄像头、ALSA、NFC、二维码、BLE、人脸识别等

### 🌐 网络和通信协议

- Net、TCP、TCP 服务器、MQTT、UDP、HTTP、Web 服务器、OSDP 等

### 🖼️ 图形库

- 使用 JavaScript 构建 GUI，完全兼容原生 LVGL 功能

### 🛠️ 工具库

- 线程、加密/解密、日志记录、EventBus、NTP、SQLite 等

### 📦 第三方库

- 支持通过 `import` 导入 ESM 格式的第三方 JavaScript 库

### ⚙️ 原生 C 库集成

- 集成原生 C 库并将其暴露给 JavaScript

---

## 🚀 开发工作流

### 📥 环境设置

- 安装 [Node.js (v20+)](https://nodejs.org)
- 安装 [Visual Studio Code](https://code.visualstudio.com)
- 安装 [DejaOS IDE 扩展](https://marketplace.visualstudio.com/items?itemName=dxide.dxide)

### 🔧 设备准备

1. 获取开发设备
2. 通过 USB 将设备连接到您的计算机（VSCode）

### 🧪 快速开始

- 在 VSCode 中使用 JavaScript [构建您的第一个应用程序](./basics/quick-start.md)
- 即时同步代码到您的设备并查看实时日志

### 📦 构建和部署

1. 获取生产设备
2. 使用 VSCode 将您的项目打包为 `.dpk` 安装程序
3. 通过 OTA 部署或使用 [DPK 安装程序工具](https://github.com/DejaOS/DejaOS/tree/main/tools) 进行串行安装

---

## 🤝 支持

如果您有任何问题，请随时联系我们：

📧 邮箱：**service@dxiot.com**

我们很乐意为您提供帮助！
