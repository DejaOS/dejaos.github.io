# dxDriver

## 1. 概述

`dxDriver` 是 DejaOS 中最核心的**基础模块之一**。  
它通过一个 JavaScript 配置文件（`dxDriver.js`）加上一组原生驱动 `.so` 库，统一管理设备上的**所有硬件驱动入口和资源映射**。

- 定义当前设备型号所用的 **GPIO 引脚、串口路径、摄像头设备、PWM 通道等硬件资源**。
- 对应的多个 `.so` 文件提供真实的底层驱动实现。
- 在绝大多数真实设备项目中都是**必须选择的组件**，推荐在新建项目时默认勾选。

## 2. 文件

- `dxDriver.js`
- 多个 `*.so` 文件

> 请确保上述所有文件都放在项目根目录下的 `dxmodules` 子目录中。

## 3. 依赖关系

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备。

## 5. 配置结构示例

下面是来自 **DW200** 设备的一个简化示例（片段）：

```javascript
const dxDriver = {};

// 1）GPIO 引脚
dxDriver.GPIO = {
  // 继电器控制
  RELAY: 35,
};

// 2）通讯通道
dxDriver.CHANNEL = {
  // 485 串口
  UART_PATH: "/dev/ttyS3",
  // USB HID 虚拟设备
  USBHID_PATH: "/dev/hidg1",
};

// 3）摄像头参数
dxDriver.CAPTURER = {
  WIDTH: 800,
  HEIGHT: 600,
  PATH: "/dev/video11",
};

// 4）蜂鸣器使用的 PWM 通道
dxDriver.PWM = {
  BEEP_CHANNEL: 4,
  BEEP_GPIO: 130,
  BEEP_PERIOD_NS: 366166,
  BEEP_DUTY: (366166 * 50) / 255,
};

export default dxDriver;
```

实际项目中，`dxDriver.js` 中可以根据硬件设计自由扩展不同的 section（如 `GPIO`、`CHANNEL`、`CAPTURER`、`PWM` 等），但建议保持结构清晰、注释完整。

## 6. 使用方式

### 6.1 在业务代码中引用 `dxDriver`

```javascript
import dxDriver from "./dxmodules/dxDriver.js";

// 示例：使用 GPIO 资源控制继电器
const relayPin = dxDriver.GPIO.RELAY;
// 将 relayPin 传给 GPIO 模块（例如 dxGpio）进行实际的开关控制
```

常见用法：

- 使用 `dxDriver.GPIO` 中的常量来配置 `dxGpio` / `dxGpioKey`；
- 使用 `dxDriver.CHANNEL.UART_PATH` 来配置串口通信模块；
- 使用 `dxDriver.CAPTURER` 初始化摄像头相关模块；
- 使用 `dxDriver.PWM` 配置蜂鸣器或灯光的 PWM 通道与参数。

## 7. 最佳实践

- 将 `dxDriver` 视为项目中所有硬件资源定义的**唯一可信来源（Single Source of Truth）**；
- 避免在业务代码中直接硬编码 GPIO 编号或 `/dev/...` 路径，而是统一通过 `dxDriver` 读取；
