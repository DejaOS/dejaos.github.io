# DejaOS Host Demo

DejaOS Host Demo 是一个面向 DejaOS 设备的轻量级可视化基座应用。它提供类似简化版移动操作系统的应用入口：设备可以配置网络和后台服务、发现微应用、运行时安装或卸载微应用，并从首页直接启动，无需重启 Host 应用。

:::info 由 Codex 与 DejaOS Skill 共同实现
整个 Demo——包括设备应用、微应用运行机制、Node.js 后台、浏览器管理页面、示例微应用和配套文档——均由 **Codex** 配合 DejaOS [`dejaos-app-dev-sdk2-0` Skill](https://github.com/DejaOS/DejaOS/tree/main/skills/dejaos-app-dev-sdk2-0) 完成。

该 Skill 提供了 DejaOS SDK 2.0 的 Worker 边界、`dxUi`、`dxEventBus`、`dxHttpClient`、运行时资源和嵌入式设备约束等开发指导，Codex 则基于这些规则完成了整条业务链路的设计、实现和验证。
:::

## Demo 截图

### 设备首页与应用管理

| Host 首页 | 服务端可安装应用 |
| :---: | :---: |
| ![DejaOS Host 首页](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/home_20260111_015015_01.png) | ![可安装微应用](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/app_manager_20260111_015052_02.png) |

| 已安装应用首页 | 已安装应用管理 |
| :---: | :---: |
| ![Host 首页已安装应用](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/home_20260111_015117_04.png) | ![已安装微应用列表](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/app_manager_20260111_015108_03.png) |

### 网络配置

| Ethernet | Wi-Fi |
| :---: | :---: |
| ![Ethernet 配置](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/network_20260111_015127_05.png) | ![Wi-Fi 配置](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/network_20260111_015133_06.png) |

Ethernet 和 Wi-Fi 均支持 DHCP 与静态 IP；静态配置包括 IP 地址、子网掩码、网关和 DNS。

### 运行时微应用

| HTTP 天气 | 快速记事 | 日历 |
| :---: | :---: | :---: |
| ![HTTP 天气微应用](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/micro_app_host_20260111_020759_07.png) | ![记事微应用](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/micro_app_host_20260111_020813_08.png) | ![日历微应用](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/micro_app_host_20260111_020826_10.png) |

### 浏览器管理与在线开发

![DejaOS Host 微应用管理页面](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/website.png)

管理页面可以创建和发布微应用、管理草稿与发布版本，并下载应用包。

![微应用在线代码编辑器](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/editcode.png)

原型编辑器支持 `app.js`、`manifest.json`、应用元数据、可见范围、版本管理和自定义 40×40 PNG 图标。

全部设备端与管理端截图可在[截图目录](https://github.com/DejaOS/DejaOS/tree/main/apps/features/dejaos_host/screenshot)中查看。

## 完整业务流程

1. 在浏览器管理页面新建微应用。
2. 编辑 JavaScript、manifest、应用信息和图标，然后发布版本。
3. 在 DejaOS Host 设备上配置应用服务地址。
4. 设备通过 `dxHttpClient` 获取已发布应用目录。
5. 点击“Install”，将应用包下载到 `/app/data/dejaos_host/apps/`。
6. Host 使用 `dxStd.loadScript` 动态加载入口脚本，不需要静态 `import`，也无需重启 Host。
7. 从首页打开新增图标；可在应用管理中卸载，或长按首页图标删除。

这条链路完整验证了从在线开发、发布，到设备下载、动态加载、运行和卸载的原型流程。

## 主要功能

- **Host 风格首页**：适配 480×854 屏幕，系统功能与动态安装的微应用共同显示。
- **网络配置**：支持 Ethernet、Wi-Fi、DHCP、静态 IP 和 60 秒连接超时流程。
- **应用服务配置**：可以填写后台 IP、域名、端口或完整 URL。
- **运行时安装和卸载**：无需重启设备或 Host，即可安装、加载、卸载和删除微应用。
- **自定义应用图标**：管理页面可上传任意 PNG，并裁剪缩放为要求的 40×40 格式。
- **在线开发**：编辑代码和应用信息、保存草稿、发布版本并下载应用包。
- **示例微应用**：通过后台 Open-Meteo 代理获取真实天气，以及本地记事和日历页面。
- **时间同步**：网络连接成功后，通过后台时间接口更新设备状态栏时间。
- **截图上传**：双击页面状态栏中间空白区域，截取当前画面并将 PNG 上传到后台。

## 系统架构

Demo 由三个相互配合的部分组成：

- **设备应用（`app/`）**：DejaOS SDK 2.0 项目。主 Worker 启动独立 UI Worker 和网络 Worker，页面由 `UIManager` 管理，跨 Worker 消息通过 `dxEventBus` 传递。
- **管理页面（`web/`）**：不依赖前端框架的 HTML、CSS 和 JavaScript 应用，用于创建、编辑、发布和下载微应用。
- **后台服务（`webapi/`）**：仅使用 Node.js 20+ 内置模块，提供管理页面、应用目录与下载、时间、天气代理和截图上传接口。

### 设备端关键文件

- `app/src/main.js`：启动 Host 各 Worker。
- `app/src/uiWorker.js`：初始化 `dxUi`、页面路由、浮层和 UI 事件循环。
- `app/src/networkWorker.js`：负责设备网络、HTTP 应用目录与下载、时间同步、微应用服务请求和截图上传。
- `app/src/UIManager.js`：管理单屏页面栈和共享字体。
- `app/src/services/MicroAppLoader.js`：动态加载与卸载已安装的微应用脚本。
- `app/src/services/AppRegistry.js`：维护远端目录与本地已安装应用信息。
- `app/src/pages/`：首页、系统设置、网络、应用服务、应用管理和微应用宿主页。

## 源代码

完整源码：[DejaOS 仓库 · `apps/features/dejaos_host`](https://github.com/DejaOS/DejaOS/tree/main/apps/features/dejaos_host)

实现整个 Demo 所使用的 DejaOS Skill：[DejaOS 仓库 · `skills/dejaos-app-dev-sdk2-0`](https://github.com/DejaOS/DejaOS/tree/main/skills/dejaos-app-dev-sdk2-0)

## 运行原型

1. 在 `webapi/` 下执行 `npm start`，启动 Node.js 20+ 后台。
2. 访问 `http://localhost:8080/` 打开管理页面。
3. 将 `app/` 项目部署到兼容的 DejaOS SDK 2.0 设备。
4. 配置设备网络，并将应用服务地址设置为后台 URL。
5. 在浏览器发布微应用，在设备端刷新目录并完成安装。

---

**原型说明**：本 Demo 的重点是验证从开发到设备运行的完整链路。生产环境所需的身份认证、设备归属、应用包签名、应用隔离、调试能力和正式微应用 SDK 暂不在当前范围内。
