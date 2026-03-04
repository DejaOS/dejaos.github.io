# 智能储物柜系统（人脸识别离线版）

这是一个基于 DejaOS 平台的人脸识别智能储物柜管理系统。它在整体架构和业务逻辑上复用了密码版 **智能储物柜系统（离线版）**，但将 UI 从小屏迁移到大屏，并将用户开柜方式从**密码开柜**升级为**人脸识别开柜**。

:::info 生产就绪的应用
这是一个**功能完整、可直接部署**的应用程序。它基于 `smart_locker_offline` 的核心实现，在此基础上将人脸识别作为储物柜开闭的主要身份凭证。
:::

:::tip 离线版本
这是人脸识别智能储物柜系统的**离线版本**。完全独立运行，无需任何网络连接或统一的后台管理——所有识别、存储与开柜逻辑均在设备本地完成。
:::

## 应用截图

| 界面 | 预览 |
| :--- | :--- |
| **主界面** | ![主界面](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/home_20260304_145316.png) <br /> _主界面展示人脸识别入口、可用储物柜数量以及存取功能入口。_ |
| **用户取柜** | ![用户取柜](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/userPickCabinet_20260304_145251.png) <br /> _用户选择柜号并通过人脸识别进行存取的流程。_ |
| **管理员登录** | ![管理员登录](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/adminLogin_20260304_145326.png) <br /> _大屏上的管理员登录界面。_ |
| **管理首页** | ![管理首页](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/adminHome_20260304_145404.png) <br /> _管理面板入口，包含柜组配置、开柜、记录、时间设置等功能。_ |
| **柜组配置** | ![柜组配置](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/adminGroupConfig_20260304_145418.png) <br /> _在大屏上配置多个储物柜组及柜号范围。_ |
| **单柜开门** | ![单柜开门](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/adminOpenCabinet_20260304_145437.png) <br /> _管理员为某个柜门执行手动开门操作。_ |
| **存取记录** | ![存取记录](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/adminRecords_20260304_145527.png) <br /> _分页查看所有存/取操作记录（包含基于人脸的访问记录）。_ |
| **人脸提示界面** | ![人脸提示界面](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/faceMask_20260304_145836.png) <br /> _显示人脸识别提示与引导的大屏 UI。_ |

---

## 项目概述

这款人脸识别智能储物柜应用是为 **smartlocker 系列大屏设备**设计的功能完整嵌入式系统，其核心特点为：

- **架构复用**：整体结构、Worker 设计和业务逻辑继承自密码版 `smart_locker_offline` 工程。
- **人脸识别开柜**：将原来的 6 位密码输入改为**人脸识别**作为用户身份凭证，用于开柜存取。
- **大屏 UI 适配**：UI 从小屏迁移到大屏，重新设计布局，更好地展示摄像头取景、人脸提示和管理入口。
- **完全离线**：所有识别、存储和锁控逻辑均在本地设备上执行，无需依赖云端。

### 与 `smart_locker_offline` 的关系

与 `smart_locker_offline` 相同或高度相似的部分包括：

- 柜组与柜号的配置和管理规则
- 存物、取物的业务流程与状态流转
- 管理功能（柜组管理、手动开柜、记录查询、时间设置等）
- 多 Worker 架构以及通过 RS-485 与锁控板的通信机制

主要差异在于：

- **身份方式**：从“密码身份”切换为“人脸身份”。
- **用户流程**：
  - 当用户站在设备前时，摄像头自动执行人脸识别。
  - 如果系统检测到该人脸**尚未注册**，会根据业务规则自动完成注册，并与后续的存取操作关联。
  - 注册完成后，用户即可通过**刷脸开柜**的方式进行存物与取物。
- **去除密码开柜**：移除了用户侧的“设置/输入密码”流程（如存物密码、取物密码等），仅保留系统级的管理员密码。
- **界面布局变化**：针对大屏重新布局，扩大摄像区域与提示信息，优化人脸识别交互体验。

---

## AI 生成的应用

与密码版离线应用类似，这个人脸识别变体同样是通过 **AI 辅助开发**生成的。

该项目在以下基础之上，通过多轮与 AI 助手的对话迭代完成：

- `.prompt/main.md` 中的开发指南
- `dxmodules` 目录下的 JS 组件源码
- 现有的 `smart_locker_offline` 代码库（作为结构与架构参考）

AI 主要完成了：

- 在原有储物柜逻辑之上扩展人脸识别相关业务流程
- 针对大屏和摄像头预览重新设计 UI 页面
- 集成人脸识别模块，实现采集、校验与自动注册
- 扩展记录层，支持基于人脸的访问记录

---

## 主要功能（相对于密码版的差异）

### 用户功能

在继承 `smart_locker_offline` 业务流程的基础上，用户侧变化包括：

- **人脸开柜**：用户通过人脸识别而非输入 6 位密码完成开柜操作。
- **自动人脸注册**：对于未注册的人脸，系统可在操作过程中按规则自动完成录入与绑定。
- **刷脸存取**：每个用户都可以通过人脸作为唯一标识完成存物与取物。
- **实时状态**：主页仍然显示可用柜数和系统状态，只是 UI 针对大屏重新优化。

### 管理功能

管理员侧功能与密码版基本一致：

- **柜组管理**：配置多个柜组与柜号范围。
- **手动开柜**：按需单柜开门或维护使用。
- **存取记录**：分页查看所有操作记录，并包含人脸识别相关信息。
- **时间设置**：配置系统时间。
- **管理员密码**：仅保留系统级管理员密码，人脸识别仅用于用户开柜，不替代系统管理入口密码。

---

## 项目结构

该应用的完整源代码请参考：[GitHub 源码地址](https://github.com/DejaOS/DejaOS/tree/main/apps/solutions/smartlocker/face_offline/source)

项目目录结构与 `smart_locker_offline` 非常相似，只是在 UI 与人脸模块上做了扩展与调整：

```text
smart_locker_face_offline/
├── app.dxproj                 # 项目配置
├── dxmodules/                 # DejaOS 模块（自动下载）
├── resource/                  # 应用资源（字体、图片、人脸界面素材）
├── src/
│   ├── main.js               # 应用入口
│   ├── uiWorker.js           # UI Worker 入口（大屏布局）
│   ├── lock/                 # 锁控与业务逻辑（复用离线版逻辑）
│   ├── face/                 # 人脸识别相关模块（采集、校验、注册）
│   └── pages/                # UI 页面（用户流程、管理页面等）
└── .prompt/                  # 开发指南（AI 参考）
```

Worker 架构（主线程、UI、锁控、人脸/摄像头）整体遵循密码版离线应用的设计，只是额外加入了人脸识别的专用 Worker 或模块。

---

## 核心技术

- **DejaOS UI 系统**：使用 `dxUi` 在大屏上构建人脸识别与管理 UI。
- **人脸识别模块**：集成 DejaOS 的人脸识别能力，实现人脸采集、特征提取、比对与注册。
- **EventBus & RPC**：UI、锁控、人脸识别之间的跨 Worker 事件通信。
- **dxSqliteDB**：使用 SQLite 持久化储物柜状态、操作记录与人脸相关元数据。
- **dxUart / RS-485**：通过串口与锁控板通信（与离线版一致）。
- **dxMap**：在各个 Worker 之间共享储物柜状态、人脸识别状态等数据。

---

## 硬件要求

- **主要设备型号**：优先针对 **FCV5003** 设备进行设计与适配。
- **设备系列**：也可以适配其它支持大屏和摄像头的人脸识别 smartlocker 机型，一般只需做少量 UI 适配即可。
- **显示屏**：大尺寸触摸屏（具体分辨率与比例依赖目标硬件，UI 针对宽屏场景设计）。
- **摄像头**：内置摄像头用于人脸识别，位置需适合用户站立/靠近时的取景。
- **串口**：RS-485（或同类）接口用于连接锁控板。
- **音频**：PWM 蜂鸣器或扬声器用于提示音反馈。

---

## 快速开始

1. 使用安装了 DejaOS 扩展的 VSCode 打开项目。
2. 确保 `app.dxproj` 正确配置为目标人脸识别 smartlocker 设备型号。
3. 在 DejaOS 扩展中点击“安装”下载所需模块（包含人脸识别相关模块）。
4. 部署到目标设备，并进行初次人脸录入与流程验证。

### 初始配置

1. **柜组配置**：在管理面板中配置柜组与柜号范围。
2. **管理员密码**：设置系统管理员密码，用于进入管理界面。
3. **人脸识别策略**：根据实际业务需求调节识别阈值、自动注册策略与提示文案。

---

**提示**：本应用在代码结构与业务逻辑上与密码版 `smart_locker_offline` 高度一致。进行二次开发或功能扩展时，可以复用原有的服务层、Worker 和页面结构，把主要精力集中在人脸识别相关的行为与体验上。

