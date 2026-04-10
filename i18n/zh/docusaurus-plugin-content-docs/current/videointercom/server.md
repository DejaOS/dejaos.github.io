# 服务端部分

---

本页说明可视对讲**服务端**的作用、软件包内常见内容，以及部署与排错时的要点。完整配置项请以随包文件为准。

相关文档：

- [可视对讲概述](./overview.md)
- [设备部分](./device.md)
- [Android 部分](./android.md)

---

## 1. 服务端做什么

服务端负责协调可视对讲全流程，主要包括：

- **信令与会话**：呼叫建立、媒体协商（SDP/ICE）转发、挂断等。
- **媒体与网络穿透**：WebRTC 相关能力及 STUN/TURN 等（是否启用、如何开启以实际配置为准）。
- **网页与管理**：H5 呼叫页面、管理后台、日志等。

随包提供的 `webrtc-services` 将上述能力集成在同一套服务中。

---

## 2. 软件包里有什么

| 内容 | 说明 |
|------|------|
| `webrtc-services` | 主服务程序 |
| `webrtc-protect` | 守护相关进程，一般与主服务一起通过脚本启动 |
| `conf/` | 运行配置，核心是 `app.conf` |
| `doc/` | 安装说明、配置样例、版本说明、对接说明等 |
| `static/`、`views/` | 网页静态资源与页面模板 |
| `run.sh` | 启动、停止服务 |
| `install-ubuntu.sh`、`install-centos.sh` | 常见 Linux 发行版下的安装辅助脚本（以包内实际文件为准） |

配置字段的逐项说明见 `doc/app.conf`（注释样例）及 `doc/readme.txt`。

---

## 3. 部署前要准备什么

### 3.1 依赖

- **MySQL**：创建业务库（常见库名为 `webrtc`），在 `app.conf` 的 `[mysql]` 中填写连接信息。
- **Redis**：在 `[cache]` 中配置地址等信息。

### 3.2 网络端口

请在防火墙、安全组中放行实际使用的端口。**具体端口以安装后 `conf/app.conf` 为准**。下表汇总随包 `doc/readme.txt` 与样例 `app.conf` 中常出现的端口，部署时请对照您的实际配置勾选放行。

### 3.3 常见端口一览

| 用途 | 协议 | 随包常见端口或范围 | 配置项 / 说明 |
|------|------|-------------------|---------------|
| HTTP 网页访问 | TCP | 样例常为 **8089**；也可改为 **80** 等 | `httpport` |
| HTTPS 网页与 H5（含 WebSocket） | TCP | 样例常为 **8443**；也可改为 **443** 等 | `httpsport`；手机 / 浏览器侧一般走此端口 |
| 管理后台 | TCP | 样例 **8099** | `adminport` |
| 设备信令（DejaOS 等设备 TCP 接入） | TCP | 样例 **6699** | `wakeupport`；须与设备 `servers` 中端口一致 |
| 唤醒服务 | TCP | **6677** | `[lowpowerwakeup]` 中 `port` |
| 旧版设备 WebSocket 信令（可选） | TCP | **6688** | `websocketport`；新方案可不再使用 |
| STUN | UDP | 约 **3478–3578**（与 `stun_port`、`stun_port_size` 相关） | `[stun]` |
| TURN / 媒体中继 | UDP | **12355–65535**（可在配置中缩小范围） | `readme.txt` 与 `[rtmp]` 等段落中的端口范围 |
| 集群信令（MQTT 等，启用集群时） | TCP | **1883**、**1993**、**1888**、**1688** 等 | `[signal]` 与 `readme.txt` 说明 |

**说明：** MySQL（默认 **3306**）、Redis（默认 **6379**）若与主程序同机部署，通常只需本机访问；若分机器部署，请在数据库服务器上放行对应端口并限制来源 IP。

---

## 4. 安装与日常操作

典型步骤如下（细节以 `doc/readme.txt` 为准）：

1. 安装并配置 **MySQL、Redis**，创建数据库与用户权限。
2. 将发布包解压到目标目录（例如 `/opt/webrtc-services`）。
3. 若使用 **HTTPS**：将证书放到 `conf/`，在 `app.conf` 中设置 `httpskeyfile`、`httpscertfile`。
4. 编辑 **`conf/app.conf`**：
   - 数据库连接必须正确，否则服务无法启动
   - 按规划设置 `httpport`、`httpsport`、`adminport`
   - 配置 `[network]`：`domainname`（无域名时可填公网或内网 IP）；`external-ip` 按说明填写（常见为 `公网IP/内网IP`，无公网时可用内网/内网）
   - 按合同或交付材料配置 **initstring** 等授权相关项，并妥善保管，勿对外泄露
5. 需要开机自启时，执行包内对应系统的安装脚本（如 `install-ubuntu.sh` 或 `install-centos.sh`），并按说明完成配置。
6. **启动 / 停止**：在程序目录执行 `./run.sh start` 或 `./run.sh stop`。
7. **日志**：查看安装目录下 `logs/`（如 `webrtc-services.log`）。启动失败多见于证书路径错误、数据库无法连接或 `app.conf` 关键项缺失。

验证：浏览器访问已配置的 HTTPS 地址。H5 呼叫地址一般为：

`https://域名或IP:HTTPS端口/videocall/设备序列号`

（与 [设备部分](./device.md) 中的联调方式一致。）

---

## 5. 配置要点（`app.conf`）

随包 `doc/app.conf` 中带注释，部署时通常需要关注：

- **运行与授权**：`initstring`、`runmode`、`area` 等
- **Web 与管理**：`enablehttp`、`enablehttps`、`httpport`、`httpsport`、`adminport`、`webmediaurl`（是否开放内置网页能力；生产环境可按安全策略关闭，改用自有站点）
- **设备接入**：`wakeupport`（设备侧 TCP 信令端口，修改后须与所有设备配置一致）
- **对外网络**：`[network]` 中的 `domainname`、`external-ip`
- **缓存**：`[cache]` 中的 Redis
- **STUN/TURN**：`[stun]` 及中继端口相关配置
- **集群 / 路由**（如使用）：`[signal]` 等段落

启用录制、会议室、多播等扩展能力时，可能需在 `app.conf` 中增加对应段落，说明见 `doc/version.txt`。

---

## 6. 设备与手机、浏览器如何连上同一套服务

| 终端 | 配置方式 | 说明 |
|------|----------|------|
| DejaOS 设备 | `dxIntercom` 中 `webrtc.servers` 填写 `IP:wakeupport` | 设备侧为 TCP 信令，不使用 WebSocket |
| Android / H5 | 通过 `wss://` 连接站点上的 WebSocket 信令 | 端口通常与 HTTPS 一致；与设备 TCP 端口不同 |

请保证：**设备序列号（serno）在平台侧唯一**、**终端填写的服务器地址与端口可达**、**防火墙已放行对应端口**。

---

## 7. 与业务平台对接（可选）

若需在设备上线、下线或事件发生时通知自有平台，可在 `app.conf` 中配置 `[push]`，将 HTTP 地址指向您的回调服务。服务会以 POST 方式推送 JSON 消息（事件类型与字段见 `doc/publish.txt`）。对接时请做好鉴权与安全校验。

---

## 8. 健康检查

请求路径 **`/api/keepalive`**，返回 JSON。`state` 为 **200** 表示服务正常，**500** 表示不可用。可用于负载均衡或监控探测（说明见 `doc/webrtc-streamer-keepalive.txt`）。

---

## 9. 常见问题

- 提示缺少 **libnuma.so.1**：按 `doc/readme.txt` 在 Ubuntu 或 CentOS 上安装 `libnuma` / `numactl` 等依赖。
- 网页能打开但**设备连不上**：检查 **wakeupport** 是否放行、设备 **servers** 是否指向正确 **IP:端口**、`[network]` 是否与实际网络出口一致。
- **能建会话但没有画面**：检查 STUN/TURN 与 UDP 是否放行，以及手机 / 浏览器侧网络与 ICE 是否正常。

---

## 10. 如何获取服务端软件

服务端安装包不在 GitHub 上分发。请**联系我们**获取交付物。
