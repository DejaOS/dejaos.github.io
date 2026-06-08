# 快速部署指南

---

本指南帮助你把随包提供的 WebRTC 服务从我方测试环境，迁移部署到**你自己的服务器**。你只需要修改**一个**文件：`conf/app.conf`。下面列出的每一项改动都对应该文件中的一个真实配置项，没有提到的项请**保持默认、不要改动**。

相关文档：

- [可视对讲概述](./overview.md)
- [设备](./device.md)
- [Android](./android.md)
- [服务端](./server.md)

---

## 1. 开始之前

改配置前，先备齐这四样东西：

1. 一台拥有**公网 IP** 的服务器（记下公网 IP 和内网 IP）。
2. 一个解析到该公网 IP 的**域名**，例如 `webrtc.your-domain.com`。
3. 该域名的 **SSL 证书**：`.crt` 和 `.key` 两个文件。
4. 服务器的**网卡名称**（Linux 用 `ip addr` 查看，如 `eth0`、`ens33`、`vmbr0`）。

安装包内附带 `app_new.conf`，这是我方一套已部署好的真实示例（域名 `webrtc.dxiot.com`）。把它和 `app.conf` 对照打开，即可看清每一项该填的格式。

---

## 2. 第一步 —— 修改 `app.conf` 中的配置项

### 2.1 服务端口（文件最上方）

| 配置项 | 示例值（`app_new.conf`） | 说明 |
|--------|--------------------------|------|
| `httpport` | `8098` | HTTP 端口。若服务器 `80` 未被占用，也可保持 `80`。 |
| `httpsport` | `8443` | HTTPS 端口。若 `443` 未被占用，可用 `443`。 |
| `httpscertfile` | `conf/webrtc.crt` | 你的 SSL 证书，放到 `conf/` 目录下，这里填相对路径。 |
| `httpskeyfile` | `conf/webrtc.key` | 你的 SSL 私钥，放到 `conf/` 目录下。 |
| `initstring` | *（一长串密文）* | 授权字符串，由我方按你的部署环境生成。拿到后整段替换，不要自行改动。 |

把端口改成非 `80`/`443`，是为了避开需要特权的系统端口，部署更省事。无论用哪个端口，都记得在防火墙放行（见第二步）。

### 2.2 网络绑定（`[network]`）

| 配置项 | 示例值 | 你要填的内容 |
|--------|--------|---------------|
| `external-ip` | `218.4.173.194/192.168.10.2` | `公网IP/内网IP`（用 `/` 隔开）。若无内网 IP，两段都填公网 IP。 |
| `domainname` | `webrtc.dxiot.com` | 你解析好的域名。 |
| `netname` | `vmbr0` | 服务器网卡名（`ip addr` 查看）。 |

### 2.3 信令服务（`[signal]`）

| 配置项 | 示例值 | 你要填的内容 |
|--------|--------|---------------|
| `router` | `webrtc.dxiot.com:1688` | `你的域名:1688`（端口 `1688` 保持不变）。 |

### 2.4 服务地址（`[servers]`）

| 配置项 | 示例值 | 你要填的内容 |
|--------|--------|---------------|
| `self_url` | `https://webrtc.dxiot.com` | `https://` + 你的域名 |
| `master_server_url` | `https://webrtc.dxiot.com` | `https://` + 你的域名 |

### 2.5 STUN/TURN 穿透服务（`[stun]`，文件最下方）

| 配置项 | 示例值 | 你要填的内容 |
|--------|--------|---------------|
| `user` | `dxiot` | 自定义一个用户名。 |
| `password` | `dxl12138` | 自定义一个密码。 |
| `stun_port_size` | `5` | STUN 端口数量，一般 `5` 即可。 |
| `stun_servers` | *（见下方）* | 把里面的 IP / 用户名 / 密码换成你自己的。 |

`stun_servers` 完整格式（把内网 IP、用户名、密码换成你的）：

```
{"stuns":[{"stun":"192.168.10.2:3478","user":"dxiot","password":"dxl12138"}]}
```

其中 IP 填**内网 IP**，端口保持 `3478`。这里的 `user` 和 `password` **必须**与上面的 `user`、`password` 配置项**保持一致**——三处用同一组凭据。

---

## 3. 第二步 —— 防火墙 / 安全组放行端口

在服务器防火墙以及云厂商控制台的安全组中，放行以下端口：

| 协议 | 端口 |
|------|------|
| TCP | `8443`、`8098`、`8099`、`6699` |
| UDP | `3478-3482` |

若你把 `httpport` / `httpsport` 保持为 `80` / `443`，则对应放行 `80` / `443`，而非 `8098` / `8443`。

---

## 4. 第三步 —— 放置证书、启动、验证

1. 把你的 SSL `.crt` 和 `.key` 放进程序的 `conf/` 目录，文件名与 `httpscertfile` / `httpskeyfile` 中填写的一致。
2. 确认域名已正确解析到服务器公网 IP。
3. 启动服务，浏览器访问 `https://你的域名:8443`。后台管理访问 `https://你的域名:8099`。
4. 能正常打开页面、并完成一次音视频通话，即部署成功。

---

## 5. 速查 —— 本次示例改了哪几处

`dxiot.com` 示例（`app_new.conf`）相比原始文件（`app.conf`）只在以下几处不同：

| 配置区 | 改动 |
|--------|------|
| `[server]` | `httpport` `80`→`8098`、`httpsport` `443`→`8443`、证书名 → `webrtc.*`、`initstring` 重新生成 |
| `[network]` | `external-ip` → `218.4.173.194/192.168.10.2`、`domainname` → `webrtc.dxiot.com`、`netname` `ens33`→`vmbr0` |
| `[signal]` | `router` → `webrtc.dxiot.com:1688` |
| `[servers]` | `self_url` / `master_server_url` → `https://webrtc.dxiot.com` |
| `[stun]` | `user`→`dxiot`、`password`→`dxl12138`、`stun_port_size` `10`→`5`、`stun_servers` 同步更新 |

其余配置项均保持默认。拿不准时，把 `app.conf`（原始）和 `app_new.conf`（已部署示例）逐项对照即可。

---

## 6. 获取服务端安装包

服务端安装包不通过 GitHub 分发。请**联系我们**获取你的交付包，其中包含为你的环境生成的 `initstring`。
