# 如何连接设备

---

## 🔌 设备连接类型

DejaOS 设备有两种连接类型：

### 类型一：直接 USB-A 接口线

部分设备自带 USB-A 公头连接线，直接将 USB-A 接口插入电脑的 USB 端口即可。

![带 USB-A 接口线的设备](/img/dw200usb.jpg)

---

### 类型二：USB Type-C 母座接口

部分设备采用 **USB Type-C 母座接口**（Type-C 母口）。对于这类设备，您需要使用 USB Type-C 转 USB-A 数据线连接到电脑。

![带 USB Type-C 母座接口的设备](/img/typec.jpg)

**数据线要求：**

- 您可以购买一根 USB Type-C 转 USB-A 数据线
- 或者直接使用普通的 Android 手机数据线（USB Type-C 转 USB-A）

![USB Type-C 转 USB-A 数据线](/img/usbdata.jpg)

> **注意：** 将数据线连接到设备的 Type-C 接口后，将 USB-A 端插入电脑的 USB 端口。

---

## ✅ 验证设备识别

DejaOS 设备是 **HID（人机接口设备）设备**。连接后，操作系统通常不会弹出提示。您需要手动验证设备是否已被识别。这不是必须的操作，但可以帮助您确认设备连接正常。

### Windows 系统

1. 打开 **设备管理器**（按 `Win + X`，选择"设备管理器"）
2. 展开 **"人体学输入设备"** 类别
3. 在列表中查找 **"HID-compliant device"**（符合 HID 标准的设备）

![Windows 设备管理器](/img/blog/devicemanage.png)

> 如果您看到 "HID-compliant device" 出现在列表中，而且ID是`0x0525`说明设备已成功识别。

---

### macOS 系统

1. 打开 **终端**（Terminal）
2. 执行以下命令：
   ```bash
   system_profiler SPUSBDataType
   ```
3. 查找具有以下信息的设备条目：
   - **Product ID:** `0xa4ac`
   - **Vendor ID:** `0x0525`

![macOS USB 设备检查](/img/mac_check.jpg)

> 如果您找到匹配这些 ID 的设备，说明您的 DejaOS 设备已成功识别。

---

## 🔍 故障排除

如果您的设备未被识别：

1. **检查 USB 数据线连接** - 确保数据线两端都已牢固连接
2. **尝试不同的 USB 端口** - 某些 USB 端口可能无法提供足够的电源
3. **尝试不同的数据线** - 如果使用 Type-C 设备，请确保数据线支持数据传输（不仅仅是充电）
4. **检查设备电源** - 确保设备已开机
5. **重启电脑** - 有时重启系统有助于设备识别

---

## 📘 下一步

设备连接并识别成功后：

- 📦 继续学习：[Hello World 快速开始](./quick-start.md)
- 🔧 了解更多：[DejaOS 设备](./dejaos-device.md)
