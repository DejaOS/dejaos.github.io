# dxGpio

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于 **GPIO 输出**控制。

**作用是什么：** GPIO 引脚只能输出两种电平状态——**高电平（1）** 或 **低电平（0）**。常见用途包括驱动继电器（门锁 / 电锁）、指示灯等开关量外设。若外接继电器，通常 **高电平表示吸合（开门）**、**低电平表示断开（关门）**，具体以硬件原理图为准。

**与 dxGpioKey 的区别：** `dxGpio` 负责 **输出**（由应用主动控制引脚电平）；`dxGpioKey` 负责 **输入**（监听外部数字量输入的状态变化）。二者可配合使用：输入模块感知外设状态，输出模块驱动继电器等执行器。

主要能力：

- GPIO 资源初始化与释放
- 申请 / 释放单个 GPIO 引脚
- 设置与读取输出电平（0 / 1）
- 配置引脚功能、上下拉状态、驱动能力（与具体设备相关）

## 2. 文件

- dxGpio.js
- libvbar-b-dxgpio.so

> 确保这 2 个文件包含在您项目根目录下的 `dxmodules` 子目录中。

## 3. 依赖项

- 无

## 4. 兼容设备

兼容运行 dejaOS v2.0+ 且具备可编程 GPIO 输出的设备。**GPIO 编号与功能码因设备而异**，应使用 `dxDriver` 中的常量（如 `dxDriver.GPIO.RELAY0`），不要硬编码引脚号。

## 5. 使用方法

### 基本用法

```javascript
import gpio from "./dxmodules/dxGpio.js";
import dxDriver from "./dxmodules/dxDriver.js";

// 初始化（全局只需一次）
gpio.init();

// 申请继电器引脚并配置为输出（request 内部会调用 setFunc(gpio_, 0x04)）
gpio.request(dxDriver.GPIO.RELAY0);

// 输出高电平（继电器吸合 / 开门）
gpio.setValue(dxDriver.GPIO.RELAY0, 1);

// 输出低电平（继电器断开 / 关门）
gpio.setValue(dxDriver.GPIO.RELAY0, 0);

// 读取当前输出电平
let level = gpio.getValue(dxDriver.GPIO.RELAY0);

// 使用完毕后释放（可选）
gpio.free(dxDriver.GPIO.RELAY0);
gpio.deinit();
```

### 定时脉冲输出

驱动继电器时，常见做法是先输出高电平，经过一定时间后再恢复低电平：

```javascript
import gpio from "./dxmodules/dxGpio.js";
import dxDriver from "./dxmodules/dxDriver.js";
import std from "./dxmodules/dxStd.js";

const relayPin = dxDriver.GPIO.RELAY0;
const holdMs = 3000;

gpio.init();
gpio.request(relayPin);

gpio.setValue(relayPin, 1);
std.setTimeout(() => {
  gpio.setValue(relayPin, 0);
}, holdMs);
```

## 6. API 参考

### `gpio.init()`

初始化 GPIO 子系统，必须在其它操作之前调用。

**返回值：** `boolean` — 成功为 `true`

### `gpio.deinit()`

释放 GPIO 资源。

**返回值：** `boolean`

### `gpio.request(gpio_)`

申请 GPIO 并配置为输出模式（内部调用 `setFunc(gpio_, 0x04)`）。

**参数：**

- `gpio_` (number): 设备上的 GPIO 标识，必填

**返回值：** `boolean`

### `gpio.free(gpio_)`

释放已申请的 GPIO。

**参数：**

- `gpio_` (number): GPIO 标识，必填

**返回值：** `boolean`

### `gpio.setValue(gpio_, value)`

设置输出电平。

**参数：**

- `gpio_` (number): GPIO 标识，必填
- `value` (number): `1` 高电平，`0` 低电平，必填

**返回值：** `boolean`

### `gpio.getValue(gpio_)`

获取当前输出电平。

**参数：**

- `gpio_` (number): GPIO 标识，必填

**返回值：** `number` — `1` 或 `0`

### `gpio.requestGpio(gpio_)`

仅申请 GPIO，不设置功能属性。需配合 `setFuncGpio` 自定义引脚配置。

**返回值：** `boolean`

### `gpio.setFuncGpio(gpio_, func)`

设置 GPIO 功能属性（设备相关，参见 `dxDriver.GPIO_FUNC`）。

**返回值：** `boolean`

### `gpio.setPullState(gpio_, state)` / `gpio.getPullState(gpio_)`

设置 / 获取上拉状态。

### `gpio.setDriveStrength(gpio_, strength)` / `gpio.getDriveStrength(gpio_)`

设置 / 获取驱动能力。

## 7. 常量

GPIO 功能值在 `dxDriver.GPIO_FUNC` 中按设备定义，例如：

```javascript
dxDriver.GPIO_FUNC = {
  GPIO_FUNC_3:  0x03,
  GPIO_OUTPUT0: 0x04, // 输出，默认低电平
  GPIO_OUTPUT1: 0x05, // 输出，默认高电平
};
```

继电器引脚在 `dxDriver.GPIO` 中定义，VF203 示例：

```javascript
dxDriver.GPIO = {
  RELAY0: 44,
  RELAY1: 84,
};
```

## 8. 相关模块

- **dxGpioKey：** GPIO **输入**监测（门磁、火警、防拆等）
- **dxDriver：** 设备相关的 GPIO / 继电器引脚常量

## 9. 示例

无。
