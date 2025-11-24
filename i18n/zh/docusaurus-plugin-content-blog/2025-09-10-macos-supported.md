---
title: DejaOS VSCode 扩展现已支持 macOS
description: DejaOS VSCode 扩展已更新，通过 HID 协议原生支持 macOS，为 Mac 用户带来无缝的开发体验。
slug: macos-supported
authors: voxer
tags: [dejaos, VSCode, macOS]
hide_table_of_contents: false
---

# DejaOS VSCode 扩展现已支持 macOS

作为一款优秀的跨平台编辑器，VSCode 在 Windows、macOS 和 Linux 上一直运行流畅。然而，由于 macOS 中更严格的 USB 设备权限管理，旧版本的 DejaOS 扩展无法在 Mac 上正常工作。

我们现在很高兴地宣布，最新版本的扩展通过使用 **HID（人机接口设备）协议** 解决了这个问题，实现了对 macOS 的原生支持！

<!--truncate-->

### 使用说明

我们的设备使用标准的 HID 协议，这意味着当您将设备插入 Mac 时，**无需安装任何额外的驱动程序**。系统会自动识别它。您可以参考下图在 Windows 系统信息中查看，在 macOS 上，您可以通过命令行查看插入的设备：

![Windows HID 设备](/img/blog/devicemanage.png)

在某些 macOS 系统上，首次连接设备时您可能会看到提示："HID 设备未就绪。请在大约 30 秒后重试。"。

这是正常的。设备固件内的 HID 服务在首次连接时需要一些时间来初始化。当您第一次点击"连接"时，初始化过程开始，通常需要不到 30 秒的时间。之后再次点击"连接"将建立成功的连接。
