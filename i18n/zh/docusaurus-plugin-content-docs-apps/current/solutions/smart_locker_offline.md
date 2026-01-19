# 智能储物柜系统（离线版）

一个基于 DejaOS 平台为嵌入式设备构建的完整智能储物柜管理系统。该应用提供了友好的用户界面，用于存取物品，并具备全面的管理控制功能。

:::info 生产就绪的应用
与 Features 部分的示例不同，这是一个**功能完整的应用程序**，可直接部署使用。只需自定义 UI 元素和配置以匹配您的品牌，即可上线运行。
:::

:::tip 离线版本
这是智能储物柜系统的**离线版本**。完全独立运行，无需任何网络连接或统一的后台管理——所有操作都在设备上本地完成。后续将推出支持云端连接和**人脸识别**功能的**在线版本**。
:::

## 应用截图

:::note 说明
以下截图来自中文版本的 UI 界面。但源代码已全部更新为**英文字体、英文界面和英文注释**。
:::

| 界面 | 预览 |
| :--- | :--- |
| **主界面** | ![主界面](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/offline/screenshot/home_19700101_090355.png) <br /> _主页显示可用储物柜数量，并提供快速访问存物和取物功能。_ |
| **管理首页** | ![管理首页](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/offline/screenshot/adminHome_19700101_104017.png) <br /> _管理面板，包含全面的管理工具。_ |
| **柜组配置** | ![柜组配置](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/offline/screenshot/adminGroupConfig_19700101_104028.png) <br /> _配置多个储物柜组，自定义柜号范围。_ |
| **柜组编辑** | ![柜组编辑](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/offline/screenshot/adminGroupEdit_19700101_104040.png) <br /> _编辑储物柜组设置和柜门分配。_ |
| **一键开柜** | ![一键开柜](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/offline/screenshot/adminOpenAll_19700101_104100.png) <br /> _批量操作，一次性开启所有柜门。_ |
| **存取记录** | ![存取记录](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/offline/screenshot/adminRecords_19700101_104123.png) <br /> _分页查看所有存取操作的历史记录。_ |

---

## 项目概述

这款智能储物柜应用是为 **DW200_V20** 设备设计的功能完整的嵌入式系统。主要特点：

- **用户界面**：直观的触摸屏界面，用于存取物品
- **管理面板**：完整的管理系统，用于储物柜配置、记录查询和系统设置
- **硬件集成**：通过 RS-485 与锁控板直接通信
- **数据持久化**：SQLite 数据库存储储物柜状态、记录和配置
- **多线程架构**：UI、业务逻辑和硬件通信分离的 Worker 架构

## AI 生成的应用

**整个应用程序均通过 AI 辅助开发生成。**

该项目通过与 AI 助手进行 **100+ 次对话**创建完成，展示了 AI 在全栈嵌入式应用开发中的强大能力。AI 主要参考了 `.prompt/main.md` 中的开发指南及 `dxmodules` 目录下的 JS 组件源码。

AI 能够生成：

- 具有完整布局和事件处理的 UI 页面
- 储物柜操作的业务逻辑（存物、取物、管理功能）
- 数据库架构和数据访问层
- 硬件通信协议（RS-485 锁控板协议）
- 基于事件的多 Worker 通信架构
- 错误处理和用户反馈系统

---

## 主要功能

### 用户功能

- **存物**：选择可用储物柜，设置 6 位密码，存放物品
- **取物**：输入柜号和密码取回已存物品
- **实时状态**：在主页查看可用储物柜数量
- **倒计时**：用户操作自动超时保护

### 管理功能

- **柜组管理**：配置多个储物柜组，自定义柜号范围
- **手动开柜**：单独开启某个柜门或一键开启所有柜门
- **存取记录**：分页查看所有存取操作的历史记录
- **时间设置**：手动配置系统时间
- **密码管理**：设置和修改管理员密码
- **超级管理员**：基于 UUID 的超级管理员密码，用于紧急访问

---

## 项目结构

该应用的完整源代码请参考：[GitHub 源码地址](https://github.com/DejaOS/DejaOS/tree/main/apps/solutions/smartlocker/offline)

应用采用多 Worker 架构实现关注点分离：

```
smart_locker_offline/
├── app.dxproj                 # 项目配置
├── dxmodules/                  # DejaOS 模块（自动下载）
├── resource/                   # 应用资源
│   ├── font/                   # UI 字体文件
│   └── image/                  # UI 图标和图片
├── src/
│   ├── main.js                # 应用入口
│   ├── uiWorker.js            # UI Worker 入口
│   ├── lock/                   # 锁控模块
│   │   ├── lockWorker.js      # 锁控硬件 Worker
│   │   ├── LockBoardProtocol.js  # RS-485 协议
│   │   ├── LockerDB.js        # 数据库层
│   │   └── LockerService.js   # 业务逻辑
│   └── pages/                  # UI 页面
│       ├── UIManager.js       # 页面栈管理器
│       ├── HomePage.js        # 主界面
│       ├── admin/             # 管理页面
│       └── user/              # 用户页面
└── .prompt/
    └── main.md                # 开发指南（AI 参考）
```

### Worker 架构

1. **主线程** (`main.js`)：硬件初始化（PWM、GPIO）、数据库初始化、Worker 创建与协调
2. **UI Worker** (`uiWorker.js`)：所有 UI 渲染、用户交互、页面导航和生命周期管理
3. **锁控 Worker** (`lockWorker.js`)：RS-485 串口通信、锁控板协议处理、硬件命令执行

---

## 核心技术

- **DejaOS UI 系统**：使用 `dxUi` 系列组件构建原生流畅界面
- **EventBus & RPC**：跨 Worker 消息传递和通信
- **dxSqliteDB**：SQLite 数据库实现持久化存储
- **dxUart**：串口通信（RS-485）控制锁控板
- **PWM 驱动**：通过蜂鸣器实现音频反馈
- **dxMap**：跨 Worker 共享内存

## 数据库架构

应用使用三个主要数据表：

1. **config**：系统配置（管理员密码等）
2. **cabinet_status**：每个储物柜的当前状态（占用、密码、时间戳）
3. **records**：所有存取操作的历史记录

---

## 硬件要求

- **设备**：DW200_V20
- **显示屏**：触摸屏（480×320 分辨率）
- **串口**：RS-485 接口连接锁控板
- **音频**：PWM 蜂鸣器用于用户反馈

## 快速开始

1. 使用安装了 DejaOS 扩展的 VSCode 打开项目
2. 确保 `app.dxproj` 配置正确
3. 在 DejaOS 扩展中点击"安装"下载所需模块
4. 部署到目标设备

### 初始配置

1. **柜组配置**：通过管理面板 → 柜组进行配置
2. **管理员密码**：通过管理面板 → 管理员密码进行设置
3. **系统时间**：通过管理面板 → 时间设置进行配置

---

**提示**：本应用是针对 **DW200_V20** 设备设计的，屏幕分辨率为 **480×320**。大部分界面布局和图片资源均基于此分辨率优化。虽然核心业务逻辑具有跨设备通用性，但若需在其他不同分辨率的设备上运行，则需要进行相应的 UI 适配工作。

该项目展示了 AI 辅助开发在嵌入式系统中的可行性。整个代码库、架构和实现都是通过与 AI 的迭代对话生成的，展现了 AI 在复杂软件开发场景中的潜力。
