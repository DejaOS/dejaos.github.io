# 远程开门 Demo

这是一个基于 DejaOS 构建的远程开门演示应用。它展示了如何在多线程环境下实现设备端 UI、网络配置、HTTP 服务与继电器开门控制的一体化方案，用户可通过局域网内的网页远程登录并触发开门。

## 应用截图

| 界面         | 预览图                                                                                                                                                                                                          |
| :----------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **主界面**   | ![主界面](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/features/remote_open_demo/screenshot/home.png) <br /> _应用主界面，显示网络状态、设备 IP、Web 访问地址及本地开门按钮。_          |
| **网络配置** | ![网络配置](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/features/remote_open_demo/screenshot/config.png) <br /> _配置有线/无线网络，支持 DHCP，配置持久化到本地。_                     |
| **键盘输入** | ![键盘输入](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/features/remote_open_demo/screenshot/input.png) <br /> _WiFi 密码等输入界面。_                                                 |
| **开门动画** | ![开门动画](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/features/remote_open_demo/screenshot/animation.png) <br /> _设备端 UI 上的开门状态与动画反馈。_                                |
| **网页登录** | ![网页登录](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/features/remote_open_demo/screenshot/login.png) <br /> _在浏览器中访问设备 IP:8080，使用账号密码登录后即可远程开门。_          |
| **远程开门** | ![远程开门](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/features/remote_open_demo/screenshot/opendoor.png) <br /> _登录成功后调用开门接口，设备继电器动作，门自动打开并在数秒后关闭。_ |

---

## 主要功能

- **本地开门**：设备主界面提供“开门”按钮，点击后通过 GPIO 继电器控制门锁，开门后自动延时关闭。
- **远程开门**：设备内置 HTTP 服务（默认 8080 端口），提供登录接口与开门接口；同一局域网内的电脑或手机浏览器访问 `http://设备IP:8080`，登录后即可远程触发开门。
- **网络配置**：支持以太网（DHCP）与 WiFi（SSID/密码）；配置可保存到本地，重启后自动连接。
- **多 Worker 架构**：UI、网络监测、HTTP 服务、门控继电器分别运行在独立 Worker 中，通过 EventBus 与 dxMap 共享状态，互不阻塞。

## 项目结构

该示例的完整源代码请参考：[GitHub 源码地址](https://github.com/DejaOS/DejaOS/tree/main/apps/features/remote_open_demo)

应用采用多 Worker 架构，保证 UI 流畅与硬件/网络操作的独立性：

- `src/main.js`：**主线程入口**。依次启动 UI、网络、门控、HTTP 四个 Worker。
- `src/uiWorker.js`：**UI 线程**。负责界面渲染、页面切换及事件循环。
- `src/worker/networkWorker.js`：**网络线程**。负责 dxNetwork 初始化、连接、状态轮询；将网络状态与 HTTP 访问地址写入 dxMap；响应 `NETWORK_CONFIG_UPDATE` 更新配置并重连。
- `src/worker/doorWorker.js`：**门控线程**。负责 GPIO 继电器初始化，监听 `DOOR_OPEN_REQUEST`，执行开门并延时自动关门。
- `src/worker/httpWorker.js`：**HTTP 服务线程**。在 8080 端口提供静态页面与 `/api/login`、`/api/open-door` 接口；开门请求通过 EventBus 转发给 doorWorker。
- `src/pages/`：`HomePage.js`（主界面）、`NetworkConfigPage.js`（网络配置）、`KeyboardInputPage.js`（键盘输入）。
- `src/constants.js`：全局常量、dxMap 共享配置及 `config.json` 的读写。
- `src/web/`：内置网页资源（如 `index.html`、`admin.html`），供 HTTP 服务对外提供登录与开门页面。

## 核心技术

- **DejaOS UI 系统**：使用 `dxUi` 系列组件构建主界面、配置页与键盘输入页。
- **EventBus**：Worker 间事件通信（如 `DOOR_OPEN_REQUEST`、`NETWORK_STATUS_CHANGED`、`NETWORK_CONFIG_UPDATE`）。
- **dxMap**：跨 Worker 共享网络状态、HTTP 地址、网络配置等。
- **dxNetwork**：有线/无线连接与 DHCP，网络状态轮询。
- **dxHttpServer**：HTTP 服务、静态文件、登录与开门 API。
- **dxGpio**：继电器控制，实现开门与自动关门。

## 使用说明

1. 将应用部署到支持 GPIO 继电器与网络的 DejaOS 设备上。
2. 首次使用可在设备端进入“网络配置”，配置以太网或 WiFi，保存后设备会连接网络并显示 IP。
3. 主界面会显示“Web 访问地址”（如 `http://192.168.1.100:8080`）。在同一局域网的电脑或手机浏览器中打开该地址。
4. 在网页中使用默认账号登录（如 admin / admin123），登录成功后即可点击“开门”等按钮，设备继电器动作，门打开并在设定时间后自动关闭。
5. 设备端主界面也可直接点击“开门”进行本地开门测试。

---

> **提示**：本示例是针对 **DW200** 设备设计的，屏幕分辨率为 **480\*320**。大部分界面布局和图片资源均基于此分辨率优化。虽然核心业务逻辑具有跨设备通用性，但若需在其他不同分辨率的设备上运行，则需要进行相应的 UI 适配工作。
>
> 本示例涉及 GPIO 继电器、网络与 HTTP 服务，不同设备需在 `dxDriver` 中配置正确的 GPIO 引脚及网络参数。网页端账号密码为演示用，实际部署请修改为安全认证方式。
