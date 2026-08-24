# 智能储物柜系统（人脸识别在线版）

这是一个基于 DejaOS SDK 2.0、面向 **FCV5005** 和 **FCV5003** 的智能储物柜终端应用。终端在本地完成人脸识别，并通过 MQTT 对接兼容 FitLock 协议的管理服务，实现用户、人脸、柜门分配、配置、事件和告警的集中管理。

:::info 在线版方案参考实现
本仓库同时提供嵌入式终端应用和配套的智能柜管理系统。部署所需的账号、基础设施及生产环境配置仍需由集成方提供。
:::

## 应用截图

| 界面 | 预览 |
| :--- | :--- |
| **首页** | <img src="https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_online/screenshot/home_20260514_114648.png" alt="首页" width="320" /> <br /> _首页提供人脸识别入口，并显示临时柜余量、网络状态和设备信息。_ |
| **人脸识别** | <img src="https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_online/screenshot/faceMask_20260514_130420.png" alt="人脸识别" width="320" /> <br /> _本地摄像头预览与人脸识别引导。_ |
| **临时柜确认** | <img src="https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_online/screenshot/tip_20260514_130449.png" alt="临时柜确认" width="320" /> <br /> _向识别成功的用户确认本次分配的临时柜。_ |
| **管理员登录** | <img src="https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_online/screenshot/adminLogin_20260514_130537.png" alt="管理员登录" width="320" /> <br /> _本地管理支持人脸或密码两种登录方式。_ |
| **管理员控制台** | <img src="https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_online/screenshot/adminHome_20260514_130638.png" alt="管理员控制台" width="320" /> <br /> _提供开柜、系统信息和网络配置等本地维护入口。_ |
| **开指定柜** | <img src="https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_online/screenshot/adminOpenSpecificCabinet_20260514_130647.png" alt="开指定柜" width="320" /> <br /> _授权管理员可选择指定柜门进行维护开锁。_ |
| **开所有柜** | <img src="https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_online/screenshot/adminOpenAllCabinet_20260514_130658.png" alt="开所有柜" width="320" /> <br /> _按顺序打开全部柜门，并在操作前提示确认现场安全。_ |

## 在线版与离线版

两个版本都在终端本地完成人脸识别和柜门控制，主要区别在管理边界：

| 能力 | 在线版 | 人脸识别离线版 |
| :--- | :--- | :--- |
| 用户与人脸数据 | 由管理服务同步 | 在终端本地管理 |
| 柜门分配 | 云端集中下发并缓存到本地 | 在终端本地配置 |
| 操作记录 | 本地排队并上报服务端 | 仅本地保存 |
| 网络中断 | 使用缓存数据，恢复后重试待上报事件 | 不依赖网络 |
| 集中运维 | 支持 MQTT 指令、状态、告警及可选远程维护 | 不包含 |

在线版并不等同于“纯云端运行”。人脸识别、基于缓存数据的权限判断和柜锁控制仍在设备本地完成，服务端负责数据与运营的集中管理。

## 主要功能

### 用户与柜门业务

- 本地人脸识别开柜。
- 支持固定柜和临时柜两种业务模式。
- 临时柜自动分配与用户确认。
- 使用本地 SQLite 缓存用户、人脸元数据、柜门状态、配置和待上报事件。
- 通过 RS-485/UART 控制锁板，并区分开锁命令与真实门状态。

### 在线管理

- 使用 `fitlock/v1/cmd/{deviceSn}/#` 接收设备级 MQTT 指令。
- 同步用户和人脸图片，并在本地完成人脸特征录入。
- 同步柜门列表与分配关系。
- 提供远程配置、控制和 OTA 指令处理器。
- 上报存取事件、人脸同步结果和告警。
- 本地事件队列采用业务应答确认：只有收到匹配回复后才删除待上报事件。

### 本地管理

- 管理员可通过人脸或密码登录。
- 打开指定柜，或按顺序打开所有柜门。
- 配置以太网/Wi-Fi 和 MQTT，并测试连接。
- 查看系统与诊断信息。

## 系统架构

```text
UI Worker         人脸 Worker        锁控 Worker        网络 Worker
    \                 |                  |                    /
     \----------------+---- EventBus ----+-------------------/
                              |
                         MQTT Worker
                              |
                    兼容 FitLock 协议的管理服务
```

SDK 2.0 应用将 UI、人脸处理、锁板通信、网络状态和 MQTT 分别放在独立 Worker 中，通过 `dxEventBus` 交换小型消息；SQLite 用于持久化设备状态和待上报事件队列。

## 智能柜管理系统

仓库同时包含与设备终端配套使用的管理端代码：

- 基于 Java 17 和 Spring Boot 的后台服务。
- 内置基于 Netty 的 MQTT 服务，用于设备指令、数据同步、事件上报和业务应答。
- 默认使用 SQLite，也可配置为 MySQL。
- 提供用户、用户组、授权组、设备、设备配置、柜格、存取记录、事件记录和 MQTT 日志等 Web 管理页面。
- 支持远程开柜/释放、配置下发、升级任务以及人脸图片/文件上传等管理操作。

[在 GitHub 查看智能柜管理系统源码](https://github.com/DejaOS/DejaOS/tree/main/apps/solutions/smartlocker/face_online/smart_cabinet_management_system)

## 源代码

- [设备应用源码](https://github.com/DejaOS/DejaOS/tree/main/apps/solutions/smartlocker/face_online/source)
- [管理系统源码](https://github.com/DejaOS/DejaOS/tree/main/apps/solutions/smartlocker/face_online/smart_cabinet_management_system)
- 仓库路径：`apps/solutions/smartlocker/face_online/`
- 支持产品：**FCV5005** 和 **FCV5003**
- 仓库内分别提供 FCV5005 和 FCV5003 的项目配置。

```text
face_online/
├── screenshot/
├── smart_cabinet_management_system/
│   ├── config/
│   ├── sql/
│   ├── src/
│   └── build.gradle
└── source/
    ├── .temp/
    ├── app.dxproj
    ├── doc/
    ├── dxmodules/
    ├── resource/
    ├── test/
    └── src/
        ├── db/
        ├── lock/
        ├── pages/
        ├── worker/
        ├── faceWorker.js
        ├── uiWorker.js
        └── main.js
```

设备源码目录原样镜像当前应用工作区，仅排除 `.git` 仓库元数据。安装或部署组件前，请选择与产品对应的项目配置。

## MQTT 协议文档

完整的 **《Fit Lock Pro MQTT 协议文档（对外版）V1.0》** 与源码一起维护在 GitHub：

- [中文 MQTT 协议文档](https://github.com/DejaOS/DejaOS/blob/main/apps/solutions/smartlocker/face_online/source/doc/fitlock%20mqtt%E5%8D%8F%E8%AE%AE%E6%96%87%E6%A1%A3.md)
- [英文 MQTT 协议文档](https://github.com/DejaOS/DejaOS/blob/main/apps/solutions/smartlocker/face_online/source/doc/fitlock%20mqtt%20protocol.en.md)

协议文档详细定义了消息外壳、Topic 规则、配置、控制与 OTA 指令、人员和柜格同步、存取事件、人脸同步事件、告警、业务应答、结果码及数据对象。

## AI 辅助开发与多语言

设备应用和管理系统均通过 AI 辅助生成并持续迭代，默认界面、示例数据和操作文字以中文为主。如果项目需要其它语言，可以使用 AI 帮助翻译和调整界面文字、资源及文档。完成转换后，仍应在目标屏幕上检查字体字形、文字长度、页面布局和业务术语。

## 开始使用

1. 确认目标产品是 FCV5005 还是 FCV5003，并选择对应的项目配置。
2. 安装组件前，将对应产品的项目配置复制为 `app.dxproj`。
3. 使用 DejaOS 扩展或 `dejaos install --project .` 安装 `app.dxproj` 声明的组件。
4. 将源码部署到已确认的设备，并检查设备日志。
5. 在本地管理员控制台配置以太网或 Wi-Fi，以及 MQTT 账号。
6. 部署或按项目需求调整仓库内的管理系统，并验证数据同步、业务应答、断线重放、柜门状态、人脸录入和异常恢复。

## 部署边界

- 仓库中的管理系统属于参考源码，仍需结合实际环境完成部署与验收。
- 静态检查和此前开发测试不能替代真实柜体硬件及生产服务端环境下的验收。
