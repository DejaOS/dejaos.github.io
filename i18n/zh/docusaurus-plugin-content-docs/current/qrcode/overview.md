# 二维码识别概述

DejaOS 设备根据型号不同，配备了不同的二维码识别硬件。本指南概述了我们产品线中三种类型的二维码识别实现方式。

## 设备类型对比

| 类型 | 硬件配置 | 实现组件 | 性能 | 设备示例 |
| :--- | :--- | :--- | :--- | :--- |
| **类型一** | 内置二维码摄像头 + SPI 总线 | `dxCode` + `dxBarcode` | ⭐⭐⭐ 高 | [FC6820](https://www.feocey.com/product/fc6820/) |
| **类型二** | 内置二维码摄像头 + UART 总线 | `dxUart` + `dxChannel` | ⭐⭐⭐ 高 | [FCV4914](https://www.feocey.com/product/fcv4914/)、[FCV4905](https://www.feocey.com/product/fcv4905/) |
| **类型三** | 人脸摄像头（共用） | `dxFacial` | ⭐⭐ 中 | [FCV5002](https://www.feocey.com/store/fcv5002/)、[FCV5003](https://www.feocey.com/store/fcv5003/) |

---

## 类型一：内置二维码摄像头 + SPI 总线

### 代表设备
- **[FC6820](https://www.feocey.com/product/fc6820/)**

### 硬件配置
- 专用二维码扫描摄像头模块
- 通过 SPI（串行外设接口）总线通信

### 实现组件
- **dxCode**：核心二维码解码引擎
- **dxBarcode**：条形码和二维码扫描接口

### 特点
- 高速扫描能力
- 工业级条形码/二维码识别
- 专用硬件确保稳定性能

### 对应示例
- [dw200_barcode_demo](https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_barcode_demo)

---

## 类型二：内置二维码摄像头 + UART 总线（独立扫码模块）

### 代表设备
- **[FCV4914](https://www.feocey.com/product/fcv4914/)**
- **[FCV4905](https://www.feocey.com/product/fcv4905/)**

### 硬件配置
- 专用二维码扫描摄像头模块（独立扫码引擎 / external scan engine）
- 通过 UART（通用异步收发传输器）总线通信

### 实现组件
- **dxUart**：UART 串口通信驱动
- **dxChannel**：设备通信的数据通道管理

### 特点
- 高速扫描能力，与类型一相当
- 串口通信接口
- 专用硬件确保稳定性能
- DejaOS 仅通过 `dxChannel` **读取**扫码模块输出的数据。扫码间隔、蜂鸣等行为由**扫码模块内部固件**控制，不属于 DejaOS 应用逻辑，因此无法在应用中直接改。如需调整，请扫描模块专用的配置二维码。详见下文 [配置独立扫码模块](#配置独立扫码模块)。

### 对应示例
- [vf105_v12_barcode_demo](https://github.com/DejaOS/DejaOS/tree/main/demos/vf105_v12/vf105_v12_barcode_demo)

---

## 类型三：通过人脸识别摄像头识别二维码

### 代表设备
- **[FCV5002](https://www.feocey.com/store/fcv5002/)**
- **[FCV5003](https://www.feocey.com/store/fcv5003/)**

### 硬件配置
- 无专用二维码摄像头
- 与人脸识别摄像头共用硬件

### 实现组件
- **dxFacial**：具有内置二维码检测能力的人脸识别模块

### 特点
- 成本优化设计
- 摄像头针对人脸识别优化，二维码扫描为附加功能
- 识别性能相对类型一和类型二较低

### 对应示例
- [vf202_v12_barcode](https://github.com/DejaOS/DejaOS/tree/main/demos/vf202_v12/vf202_v12_barcode)

:::info 说明
类型一和类型二的设备配备了专用二维码摄像头，提供相当的高性能识别。类型三的设备共用人脸识别摄像头进行二维码扫描，识别性能相对较低，但提供了更具成本效益的解决方案。
:::

---

## 确认您的设备类型

要确定您的设备使用哪种二维码识别类型：

1. 查看您的设备型号（如 [FC6820](https://www.feocey.com/product/fc6820/)、[FCV4905](https://www.feocey.com/product/fcv4905/)、[FCV5002](https://www.feocey.com/store/fcv5002/)）
2. 参考上方的对比表格
3. 在应用程序中使用对应的实现组件

后续我们会想办法把这 3 种方案统一到 `dxBarcode` 组件上，屏蔽设备的差异性。

---

## 配置独立扫码模块

本节仅适用于 **类型二** 设备。

类型二使用的是**独立扫码模块**（external scan engine）。模块内部有自己的固件逻辑，与 DejaOS 应用相互独立。DejaOS 通过 UART + `dxChannel` 接收解码结果，但无法直接控制：

- 同一个码能否连续再扫、再扫的时间间隔
- 扫码读头的蜂鸣等反馈

这些规则在扫码模块内部。要修改时，用读头扫描下方对应的**配置二维码**（打印或屏显均可，扫描一次即可），配置成功后对新规则立即生效。

### 模式说明（针对同一个码连续扫描）

两种模式都是针对**同一个**条码/二维码内容连续出现时的行为。扫到**不同**的码时，不受下方间隔限制。

| 模式 | 行为 |
| :--- | :--- |
| **单次模式** | 同一个码不能连续扫描。成功读到一次后，在相同内容离开视野（或换成别的码）之前，不会再次上报。 |
| **间隔模式** | 同一个码再次可扫的最短间隔为配置的毫秒数。不同的码之间没有额外间隔要求。 |

### 配置二维码

按需扫描对应配置码：

**单次模式**

![单次模式](/img/barcode/single.png)

**间隔模式**

| 间隔 | 配置二维码 |
| :--- | :--- |
| 300 ms | ![间隔 300 ms](/img/barcode/interval300.png) |
| 500 ms | ![间隔 500 ms](/img/barcode/interval500.png) |
| 1000 ms | ![间隔 1000 ms](/img/barcode/interval1000.png) |
| 2000 ms | ![间隔 2000 ms](/img/barcode/interval2000.png) |
| 3000 ms | ![间隔 3000 ms](/img/barcode/interval3000.png) |

:::tip
请按业务场景选择间隔。间隔越短，同一码可越快再次读到；间隔越长，用户长时间对准同一码时越不容易重复上报。
:::
