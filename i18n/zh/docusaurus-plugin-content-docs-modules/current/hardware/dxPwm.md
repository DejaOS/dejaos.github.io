# dxPwm

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于 PWM（脉冲宽度调制）控制功能。
它包含全面的 PWM 控制功能：

- PWM 通道初始化和管理
- 功率级别控制（0-100 范围）
- 具有可自定义参数的蜂鸣声生成
- 针对不同场景的预定义蜂鸣模式（按键、成功、失败、警告）
- 跨线程 PWM 控制支持

## 2. 文件

- dxPwm.js
- libvbar-b-dxpwm.so

> - 确保这 2 个文件包含在您项目根目录下的 dxmodules 子目录中

## 3. 依赖项

- 无

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 且具有 PWM 硬件支持的设备。

## 5. 使用方法

### 基本用法

```javascript
import pwm from "../dxmodules/dxPwm_new.js";
import logger from "../dxmodules/dxLogger.js";
import std from "../dxmodules/dxStd.js";
import * as os from "os";

// 初始化 PWM 通道
pwm.init(); // 通道 0

// 设置功率级别
let power = 0;
pwm.setPower(power);
os.sleep(500);

power = 50;
pwm.setPower(power);
os.sleep(300);

power = 0;
pwm.setPower(power);
os.sleep(500);

// 生成简单蜂鸣
pwm.beep({
  delay: 50,
  interval: 50,
  count: 2,
});

// 使用预定义蜂鸣模式
pwm.pressBeep(); // 按键短蜂鸣
pwm.successBeep(); // 成功双短蜂鸣
pwm.failBeep(); // 失败长蜂鸣
pwm.warningBeep(); // 标准警告蜂鸣
```

## 6. API 参考

### `pwm.init(channel)`

初始化指定的 PWM 通道。必须在该通道的任何其他 PWM 操作之前调用。

**参数：**

- `channel` (number): 要初始化的 PWM 通道号，默认 0

**返回值：** `object` - 初始化结果对象

**注意：** 在使用指定通道的任何其他 PWM 函数之前必须调用此函数。

### `pwm.deinit(channel)`

释放并清理指定的 PWM 通道。

**参数：**

- `channel` (number): 要反初始化的 PWM 通道号，默认 0

**返回值：** `boolean` - 如果反初始化成功则为 true，否则为 false

**抛出：** 如果通道参数无效则抛出 `Error`

### `pwm.setPower(power, channel)`

设置指定 PWM 通道的功率级别。

**参数：**

- `power` (number): 功率级别（0-100），必需
- `channel` (number): 要使用的 PWM 通道号，默认 0

**返回值：** `boolean` - 如果功率设置成功则为 true，否则为 false

**抛出：** 如果功率或通道参数无效则抛出 `Error`

**功率范围：**

- 0: 无功率输出
- 1-99: 可变功率级别
- 100: 最大功率输出

### `pwm.beep(options, channel)`

生成具有可自定义参数的蜂鸣声。

**参数：**

- `options` (object): 蜂鸣配置参数，可选
  - `count` (number): 蜂鸣次数，默认 1
  - `time` (number): 每次蜂鸣的持续时间（毫秒），默认 50
  - `interval` (number): 蜂鸣之间的间隔（毫秒），默认 50
  - `volume` (number): 蜂鸣音量（0-100），默认 50
- `channel` (number): 要使用的 PWM 通道，默认 0

**返回值：** `void`

**注意：** 此函数立即返回并在后台执行蜂鸣。在使用此函数之前必须使用 `pwm.init()` 初始化 PWM 通道。

**示例：**

```javascript
// 自定义蜂鸣模式
pwm.beep(
  {
    count: 3, // 3 次蜂鸣
    time: 200, // 每次蜂鸣持续 200ms
    interval: 100, // 蜂鸣之间暂停 100ms
    volume: 80, // 80% 音量
  },
  0
);
```

### `pwm.pressBeep(volume, channel)`

播放短蜂鸣，通常用于按键反馈。

**参数：**

- `volume` (number): 蜂鸣音量（0-100），默认 50
- `channel` (number): 要使用的 PWM 通道，默认 0

**返回值：** `void`

**配置：** 单次蜂鸣，30ms 持续时间

### `pwm.successBeep(volume, channel)`

播放两次短蜂鸣，通常用于表示操作成功。

**参数：**

- `volume` (number): 蜂鸣音量（0-100），默认 50
- `channel` (number): 要使用的 PWM 通道，默认 0

**返回值：** `void`

**配置：** 两次蜂鸣，每次 30ms 持续时间

### `pwm.failBeep(volume, channel)`

播放长蜂鸣，通常用于表示失败或错误条件。

**参数：**

- `volume` (number): 蜂鸣音量（0-100），默认 50
- `channel` (number): 要使用的 PWM 通道，默认 0

**返回值：** `void`

**配置：** 单次蜂鸣，500ms 持续时间

### `pwm.warningBeep(volume, channel)`

播放标准蜂鸣，通常用作警告信号。

**参数：**

- `volume` (number): 蜂鸣音量（0-100），默认 50
- `channel` (number): 要使用的 PWM 通道，默认 0

**返回值：** `void`

**配置：** 单次蜂鸣，50ms 持续时间

## 7. 常量

此模块中未定义特定常量。但是，使用以下范围：

- **通道范围：** 0 及以上（取决于设备）
- **功率范围：** 0-100（0 = 无功率，100 = 最大功率）
- **音量范围：** 0-100（0 = 无声音，100 = 最大音量）

## 8. 相关模块

## 9. 示例

无。
