# HTTP 门禁应用

基于 DejaOS 的**门禁一体机**应用：触摸屏上支持 **NFC 刷卡、PIN 密码、QR 扫码**三种通行方式；设备在提供 **HTTP API（v1）** 的同时，还内置 **Web 管理后台**，可用电脑或**手机浏览器**登录管理，适用于 **FC6820** 门禁一体机。

:::info 生产就绪的应用
这是面向实际部署的完整应用。可简单调整后直接上线。
:::

## Web 管理界面

设备联网后，本机 **HTTP 服务**除 JSON API 外，还提供可在浏览器中使用的管理端。在局域网内访问：

`http://<设备IP>:8080`

即可查看设备信息、远程开门、同步时间，并管理用户、通行记录与系统事件，**无需单独安装软件**。界面已**适配手机浏览器**，现场用手机即可运维。

| 界面 | 预览 |
| :--- | :--- |
| **管理后台（浏览器）** | ![Web 管理后台](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/access/http_access/screenshot/admin.png) <br /> _Access Control Admin：侧栏可进入设备信息、配置、用户、通行记录、事件、通行码（NFC / PIN / QR）及帮助。_ |

---

## 设备触摸屏界面截图

:::note 说明
下列截图为设备本机触摸屏界面预览；实际文案以设备为准。
:::

| 界面 | 预览 |
| :--- | :--- |
| **首页** | ![首页](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/access/http_access/screenshot/home_page.png) <br /> _设备主页，进入通行与设置入口。_ |
| **密码开门** | ![密码开门](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/access/http_access/screenshot/pin_unlock_page.png) <br /> _用户使用 PIN 在本地开门。_ |
| **管理登录** | ![管理登录](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/access/http_access/screenshot/admin_login_page.png) <br /> _进入管理功能前的身份校验。_ |
| **网络配置** | ![网络配置](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/access/http_access/screenshot/network_config_page.png) <br /> _配置有线/无线网络参数。_ |
| **设置** | ![设置](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/access/http_access/screenshot/settings_page.png) <br /> _设备与业务相关设置项。_ |
| **系统信息** | ![系统信息](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/access/http_access/screenshot/system_info_page.png) <br /> _查看序列号、固件版本、IP、MAC、运行时长、剩余内存与存储。_ |

---

## 配网与远程管理

触摸屏除 **PIN 开门**外，**管理菜单**里最关键的是**网络配置**：**有线（ETH）与 Wi‑Fi**均支持 **DHCP** 自动获取地址。若需**静态 IP**，建议先用 **DHCP 接入局域网**，再通过 **`http://<设备IP>:8080`** 的 Web 管理或 **HTTP API** 改为固定地址。

**Wi‑Fi** 支持扫描 **标准 Wi‑Fi 分享二维码**（`WIFI:` 分项格式，含 SSID 与密码）；**Android**、**电脑（Windows）** 以及 **iPhone 17 及以上** 系统生成的 Wi‑Fi 分享码通常可直接使用。

设备可在屏幕上**一键生成二维码**，手机扫码打开 **`http://<设备IP>:8080`**，无需手输 URL。**网络就绪后**，即可使用 Web 管理界面，并通过 **`/api/v1/`** 接口对接业务系统。

---

## 项目概述

- **本地交互**：触摸屏 UI，通行方式固定为 **NFC、PIN、QR** 三种。
- **Web 管理**：浏览器访问 **`http://<设备IP>:8080`**（与 API 同端口），支持桌面与手机。
- **HTTP API**：REST 风格 JSON 接口，供门禁平台、访客系统或脚本对接。
- **多 Worker 架构**：主线程负责启动与协调；**硬件**、**UI**、**网络**、**HTTP** 分 Worker 运行，职责清晰。
- **数据持久化**：使用 SQLite（如 `AccessDB`）保存配置、用户凭证、通行记录。

完整源码目录：[GitHub — http_access/source/src](https://github.com/DejaOS/DejaOS/tree/main/apps/solutions/access/http_access/source/src)

---

## 通行二维码（通行码）

二维码里编码的是 **JSON 文本**（UTF-8）。其中 **`value`** 须与该用户在设备上的 **`qr` 凭证 `value`** 一致。

设备会校验 **签名**（若已配置 **`barcodeConfig.key`**）以及 **时间戳**：**签名不匹配**会失败；**`timestamp` 与设备当前时间的偏差**超过允许范围（**默认 ±10 秒**，具体以设备配置为准）也会**通行失败**。

**生成 `sign`**：将 `String(value) + String(timestamp) + String(key)` **三段直接拼接**（无分隔符），做 **MD5**，得到 **32 位小写十六进制** 字符串；**`key`** 与设备 **`barcodeConfig.key`** 相同。未启用签名密钥时，载荷可不写 **`sign`**，仅含 **`value`** 与毫秒级 **`timestamp`**，时间戳仍须在上述时间窗口内有效。

有签名时载荷示例：

```json
{
  "value": "QR0001A",
  "timestamp": 1741234567890,
  "sign": "小写十六进制 MD5 共 32 位"
}
```

用户是否允许通行，还可受 HTTP API 中 **`period`** 约束（见下文附录 B）。

**Web 管理界面** 内带有 **通行码生成** 页面，可用它生成二维码并扫码试用。

![Web 管理 — 通行码生成](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/access/http_access/screenshot/qrcode.png)

_示意：在通行码生成页填写 **凭证值**、**签名密钥**（未启用可不填）与 **过期时间（秒）** 后生成二维码。_

---

## 项目结构（概要）

应用仓库路径：`apps/solutions/access/http_access/`。`source/src` 下大致分工如下：

```
http_access/source/
├── app.dxproj
├── src/
│   ├── main.js           # 入口：数据库初始化、创建各 Worker
│   ├── uiWorker.js       # UI Worker 入口
│   ├── UIManager.js      # 界面调度
│   ├── constants.js
│   ├── components/       # UI 组件
│   ├── pages/            # 各业务页面
│   ├── service/          # 数据与业务服务（如 AccessDB）
│   ├── web/              # 与 Web/HTTP 相关资源
│   └── worker/
│       ├── hardwareWorker.js   # 门锁、读头与硬件侧逻辑
│       ├── networkWorker.js    # 网络相关
│       └── httpWorker.js       # HTTP API 服务
└── screenshot/
```

---

## 门禁设备 HTTP API 参考（v1）

以下说明如何通过 HTTP 与**单台**门禁设备对接。

### 1. 概述与约定

- **协议**：HTTP；请求/响应体为 JSON（`Content-Type: application/json`）。
- **方法**：仅使用 `GET`、`POST`。
- **路径前缀**：`/api/v1/`。
- **设备地址**：`http://<设备IP>:8080`（端口以实际配置为准）。

### 2. 调用建议

- 对**同一台设备**建议**串行**调用，避免并发压满设备。
- 多台设备可并行访问不同 IP，每台设备内部仍建议串行。

### 3. 认证

除 **`GET /api/v1/test`** 外，均需在请求头携带：

```http
X-API-Key: <YOUR_API_KEY>
```

未携带或错误时示例：

```json
{ "code": 2, "message": "未授权" }
```

出厂默认密钥一般为 `password`（可在设备上修改，修改后使用新密钥）。配置项中的 **`apiKey`** 与 Web 管理登录密码一致。

### 4. 通用响应结构

成功示例：

```json
{
  "code": 0,
  "message": "ok",
  "data": {}
}
```

| code | 含义     |
| ---- | -------- |
| 0    | 成功     |
| 1    | 参数错误 |
| 2    | 未授权   |
| 3    | 设备错误 |

部分接口成功时 `data` 可能为 `null`。

### 5. 基础接口

**5.1 连通性测试（无需认证）**

```http
GET /api/v1/test
```

响应示例：

```json
{
  "code": 0,
  "data": {
    "sn": "AC10001",
    "model": "FC6820",
    "timestamp": 1741234567890
  }
}
```

**5.2 获取设备信息**

```http
GET /api/v1/device/info
```

响应 `data` 常见字段：

| 字段        | 类型   | 说明           |
| ----------- | ------ | -------------- |
| sn          | string | 序列号         |
| model       | string | 型号           |
| firmware    | string | 固件版本       |
| ip          | string | 当前 IP        |
| mac         | string | MAC            |
| uptime      | number | 运行时间（秒） |
| freeMem     | number | 剩余内存（KB） |
| freeStorage | number | 剩余存储（MB） |

### 6. 设备配置

**6.1 读取配置**

```http
GET /api/v1/device/config
```

说明：`apiKey`、`adminPassword` **不会**出现在 GET 响应中；`networkConfig` 为 JSON **字符串**。

**6.2 修改配置**

```http
POST /api/v1/device/config
Content-Type: application/json
```

```json
{
  "config": {
    "apiKey": "new-api-key",
    "screenTitle": "主入口",
    "webhookUrl": "https://example.com/webhook",
    "networkConfig": "{\"netType\":\"ETH\",\"dhcp\":true}"
  }
}
```

只传需要修改的字段；未出现字段保持不变。

### 7. 设备控制

| 说明     | 方法与路径                      |
| -------- | ------------------------------- |
| 远程开门 | `POST /api/v1/device/opendoor`  |
| 重启     | `POST /api/v1/device/reboot`    |
| 清空数据 | `POST /api/v1/device/cleardata` |

**同步时间**

```http
POST /api/v1/device/time
Content-Type: application/json
```

```json
{ "time": "2025-03-19 14:30:00" }
```

**更新首页背景图**

```http
POST /api/v1/device/background
Content-Type: application/json
```

请求体为 PNG 的 **Base64**（**不要**含 `data:image/png;base64,` 前缀）。约束：**PNG**，分辨率 **480×320**；成功后设备可能短暂延迟后重启。

**固件升级**

```http
POST /api/v1/device/upgrade
Content-Type: application/json
```

```json
{
  "url": "https://example.com/package.dpk",
  "md5": "d41d8cd98f00b204e9800998ecf8427e"
}
```

| 字段 | 说明                                |
| ---- | ----------------------------------- |
| url  | 升级包地址（`http` 或 `https`）     |
| md5  | 32 位**小写**十六进制               |

校验通过后立即返回 `code: 0`；下载、校验与升级在设备端**异步**执行。

### 8. 用户与凭证

以 **`userId` + `type` + `value`** 标识一条凭证；相同三元组再次提交视为更新。

**凭证对象字段**

| 字段   | 类型   | 说明                         |
| ------ | ------ | ---------------------------- |
| id     | number | 记录 ID；可按 id 删除        |
| userId | string | 用户 ID                      |
| name   | string | 显示名称                     |
| type   | string | 见附录 A                     |
| value  | string | 凭证值：NFC 为卡号；PIN 为密码串；QR 为与二维码 JSON 中 `value` 一致的字符串 |
| period | object | 有效期，见附录 B             |

**批量添加或更新**（单次最多 **100** 条）

```http
POST /api/v1/users/add
Content-Type: application/json
```

```json
{
  "users": [
    {
      "userId": "1001",
      "name": "张三",
      "type": "nfc",
      "value": "AABBCCDD",
      "period": { "type": 0 }
    }
  ]
}
```

**删除用户或凭证**

```http
POST /api/v1/users/delete
Content-Type: application/json
```

按用户删全部凭证：`{ "userIds": ["1001"] }`  
按凭证 id：`{ "ids": [12, 13] }`  
若同时提供，**以 `ids` 优先**。兼容单个 `userId` 字符串。

**查询用户列表**

```http
GET /api/v1/users/list?page=1&size=50&userId=&name=&type=&value=
```

**清空全部用户**

```http
POST /api/v1/users/clear
```

### 9. 通行记录

设备侧可缓存**最近约 10000 条**（以实际为准）。

| 字段   | 类型   | 说明                                |
| ------ | ------ | ----------------------------------- |
| id     | number | 记录 ID                             |
| userId | string | 用户 ID                             |
| name   | string | 姓名                                |
| type   | string | 刷卡/密码/扫码成功时为 `nfc`、`pin`、`qr`；通过接口远程开门时为 `remote` |
| value  | string | 凭证值                              |
| result | number | `1` 成功，`0` 失败                  |
| time   | number | Unix 时间戳（**秒**）               |

**查询**

```http
GET /api/v1/access?page=1&size=100&userId=&name=&type=&value=&result=
```

可选查询参数 `type` 精确匹配时，取值为 **`nfc`**、**`pin`**、**`qr`** 或 **`remote`**（远程开门）。

**按 ID 删除 / 清空**

```http
POST /api/v1/access/delete
```
```json
{ "ids": [42, 43] }
```

```http
POST /api/v1/access/clear
```

### 10. 告警记录

| 字段    | 类型   | 说明           |
| ------- | ------ | -------------- |
| id      | number | 记录 ID        |
| type    | string | 常见为 `warning`、`error` |
| event   | string | 事件代码       |
| message | string | 描述           |
| time    | number | Unix 时间戳（秒） |

**查询**

```http
GET /api/v1/events?page=1&size=100&type=&message=
```

**删除 / 清空**：`POST /api/v1/events/delete`（body `{"ids":[5,6]}`）、`POST /api/v1/events/clear`。

### 11. Webhook（设备主动上报）

可选。若不配置 **`webhookUrl`**，仍可通过上述查询接口**主动拉取**记录。

配置 `webhookUrl` 后，设备向该地址 **POST** JSON；接收方返回 **HTTP 2xx** 且 JSON 中 **`code` 为 `0`** 视为成功。

**通行记录批量上报** 示例：

```json
{
  "sn": "AC10001",
  "type": "access",
  "records": [
    {
      "id": 42,
      "userId": "1001",
      "name": "张三",
      "type": "nfc",
      "value": "AABBCCDD",
      "result": 1,
      "time": 1710000000
    }
  ]
}
```

建议单次 **1～100** 条。

**单条告警类上报** 示例：

```json
{
  "sn": "AC10001",
  "type": "warning",
  "event": "door_forced_open",
  "message": "检测到强制开门",
  "time": 1710000000
}
```

### 12. 附录 A：凭证类型（type）

本应用**仅**支持以下三种（写入用户凭证时 `type` 取其一）：

| type | 说明   |
| ---- | ------ |
| nfc  | 刷卡   |
| pin  | 密码   |
| qr   | 二维码 |

### 13. 附录 B：周期模型（period）

**type = 0**（不限制）

```json
{ "type": 0 }
```

**type = 1**（固定时间段，`beginTime`～`endTime` 为 Unix **秒**）

```json
{
  "type": 1,
  "range": {
    "beginTime": 1640917147,
    "endTime": 1690917147
  }
}
```

### 14. 附录 C：配置项（device/config）

| key           | 说明                               | GET 是否返回 |
| ------------- | ---------------------------------- | ------------ |
| apiKey        | API 密钥；与 Web 管理登录密码一致 | 否（仅可写） |
| adminPassword | 本地管理员密码（如 6 位数字）      | 否（仅可写） |
| screenTitle   | 屏幕标题                           | 是           |
| webhookUrl    | Webhook 地址                       | 是           |
| networkConfig | 网络配置 JSON 字符串               | 是           |

---

**提示**：界面与资源多按 **480×320** 设计；若移植到其他分辨率需做 UI 适配。HTTP API 与多台设备对接时，请为每台设备单独维护 **API Key** 与网络地址。
