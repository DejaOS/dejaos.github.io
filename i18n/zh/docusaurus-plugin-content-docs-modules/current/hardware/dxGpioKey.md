# dxGpioKey

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于 **GPIO 输入（按键 / 开关量）事件**监测。

**作用是什么：** 监听设备上接入的数字量输入接口的状态变化，例如 **门磁**、**火警输入**、**防拆（tamper）开关** 等。事件模型与 Linux input 子系统一致（`type` / `code` / `value`）。`value` 通常为 `1`（触发 / 断开）或 `0`（恢复 / 闭合），具体含义取决于外设接线方式。

**与 dxGpio 的区别：** `dxGpioKey` 负责 **输入**（被动接收外部传感器信号）；`dxGpio` 负责 **输出**（主动驱动继电器等执行器）。典型场景中，输入事件触发业务逻辑，输出模块执行对应的开关量动作。

主要能力：

- 初始化 / 反初始化 GPIO 输入监测
- 按 `code` 查询当前状态
- 注册 `onKeyEvent` 回调
- 通过周期性调用 `loop()` 处理事件队列

> 回调注册与 `loop()` 应在 **同一线程** 中调用。模块可跨线程使用，但事件分发依赖调用 `loop()` 的线程。

## 2. 文件

- dxGpioKey.js
- libvbar-m-dxkey.so

> 确保这 2 个文件包含在您项目根目录下的 `dxmodules` 子目录中。

## 3. 依赖项

- dxLogger（建议在 `loop()` 中记录异常）

## 4. 兼容设备

兼容运行 dejaOS v2.0+ 且具备 GPIO 按键 / 数字量输入硬件的设备。输入路数及各 `code`（0、1、2…）的含义 **因设备型号与接线而异**。

## 5. 使用方法

### 基本用法

```javascript
import dxGpioKey from "./dxmodules/dxGpioKey.js";
import std from "./dxmodules/dxStd.js";

dxGpioKey.init();

dxGpioKey.setCallbacks({
  onKeyEvent: function (event) {
    // event: { code, srcCode, type, value }
    log.info("GPIO 输入事件:", JSON.stringify(event));
  },
});

std.setInterval(() => {
  dxGpioKey.loop();
}, 50);
```

### 查询状态

```javascript
const status = dxGpioKey.getStatus(1);
// 示例: { code: 1, srcCode: 33, type: 1, value: 1 }
```

在 `onKeyEvent` 中可根据 `code` 区分不同输入通道，根据 `value` 判断触发或恢复：

```javascript
dxGpioKey.setCallbacks({
  onKeyEvent: function (event) {
    if (event.type !== dxGpioKey.GPIO_KEY_TYPE.KEY) {
      return;
    }
    if (event.code === 0 && event.value === 1) {
      // 输入通道 0 触发
    }
  },
});
```

## 6. API 参考

### `dxGpioKey.init()`

初始化 GPIO 输入监测。

**返回值：** `boolean`

### `dxGpioKey.deinit()`

反初始化并释放资源。

**返回值：** `boolean`

### `dxGpioKey.getStatus(code)`

按逻辑 `code` 查询当前状态。

**参数：**

- `code` (number): 按键索引 `0` … `n-1`（`n` 为设备 GPIO 输入接口数量）

**返回值：** `KeyEvent` 对象：

| 字段 | 类型 | 说明 |
| :--- | :--- | :--- |
| `code` | number | 逻辑按键编号 |
| `srcCode` | number | 硬件源编号 |
| `type` | number | 事件类型（见 `GPIO_KEY_TYPE`） |
| `value` | number | `1` 触发，`0` 恢复 |

### `dxGpioKey.setCallbacks(callbacks)`

注册事件回调。

**参数：**

- `callbacks.onKeyEvent` (function): 输入变化时调用，参数为 `KeyEvent`

### `dxGpioKey.loop()`

轮询原生事件队列并触发回调。应周期性调用（如 `setInterval` 每 20–50 ms）。

### `dxGpioKey.getNative()`

获取原生 GPIO key 对象；未初始化时返回 `null`。

## 7. 常量

### `dxGpioKey.GPIO_KEY_TYPE`

Linux input 事件类型（节选）：

```javascript
dxGpioKey.GPIO_KEY_TYPE = {
  SYN: 0x00, // 同步事件
  KEY: 0x01, // 按键 / GPIO 输入
  REL: 0x02, // 相对位移
  ABS: 0x03, // 绝对坐标
  MSC: 0x04, // 杂项
  SW:  0x05, // 开关
  LED: 0x11,
  SND: 0x12,
};
```

GPIO 输入事件通常 `type === dxGpioKey.GPIO_KEY_TYPE.KEY`。

## 8. 相关模块

- **dxGpio：** GPIO **输出**（继电器 / 开关量控制）
- **dxDriver：** 设备配置常量

## 9. 示例

无。
