# dxTemp

## 1. 概述

本模块是 **dxmodules** 库的组成部分，通过 UART 提供 **HM 红外测温**功能：单帧峰值温度（`getTemp`）、**多帧统计**（`measure`）、完整 **32×32 热成像图**（`getThermalMap`）以及 **ROI / 人脸关联**额温测量（`getRectTemp`），并支持可选的 **`setCompensation`** 校准。

主要功能包括：

- **UART 生命周期**：`init` / `deinit` 用于串口通道初始化（底层使用 `dxUart`）。
- **多帧统计**：`measure(frames)` — 在全视野内连续读取峰值温度（每帧间隔约 125 ms），返回 `max` / `min` / `avg` 及每帧 `samples`（已应用补偿）。
- **简单测温**：`getTemp()` — 全 32×32 视野内单帧峰值温度。
- **热成像图**：`getThermalMap()` — 原始网格数据 + `getPixel(col, row)` 辅助方法。
- **人脸 ROI 测温**：`getRectTemp(rect)` — 将可见光摄像头矩形映射到 HM 网格；发热判断路径与 C 驱动行为一致。
- **校准**：`setCompensation({ offset, envSlop, envStandard })` 应用于所有对外温度输出。

设备侧协议概要：

- **CalcT**：`{0xA5, 0x55, 0x01, 0xFB}` → 7 字节响应（峰值 + 网格）。
- **QueryT**：`"QueryT\r\n"` → 2054 字节热图数据 + CRC。
- **SetRect**：`{0xA9, 0xEE, 0x01, 0xFB, x, y, w, h}` → 4 字节 ACK。

> 注意
>
> - **`measure()`** 在每帧之间执行多次 **`CalcT`** 读取，间隔 **`os.sleep(125)`**；默认 **8 帧** 是推荐值，但会增加延迟（8 帧约 1 秒）。
> - **`getThermalMap`** / **`getRectTemp`** 在 UART 超时或 CRC/头部错误时可能返回 **`null`**；访问 `.map` 或 `.value` 前务必做判空检查。
> - **`init({ timeout })`** 中的硬件速率和超时参数会影响高负载下的可靠性。

## 2. 文件

- dxTemp.js

> - 将 **dxTemp.js** 放置在项目的 **`dxmodules`** 目录下（与其他 dx\* 模块同级）。
> - 串口访问依赖 **dxUart** 及设备 **`/dev/tty*`**（或已配置的路径）。

## 3. 依赖

- **dxUart** — 为温度模块 UART 提供 open/send/receive/flush/ioctl 操作。
- **dxLogger** — 日志记录。
- **os** — `measure` 中帧间延迟使用 `sleep`。

## 4. 兼容设备

运行 **DejaOS**（或相同 QuickJS + dxUart 技术栈）、并在已配置 UART 上连接了 **HM 红外测温模块**的设备（默认 **115200-8-N-1**）。

## 5. 使用方法

### 引入

```javascript
import temper from "../dxmodules/dxTemp.js";
```

### 生命周期

```javascript
// 可选：覆盖 id/path/baudrate/timeout 参数
temper.init({
  id: "tempUart",
  path: "/dev/ttySLB3",
  type: "3",
  baudrate: "115200-8-N-1",
  timeout: 200,
});

temper.deinit();
```

### 补偿校准

```javascript
temper.setCompensation({
  offset: 0.3,
  envSlop: 0,
  envStandard: 0,
});
// 最终温度 = 原始值 * (1 + envSlop * (原始值 - envStandard)) + offset
```

### 多帧测量（`measure`）

```javascript
const stats = temper.measure(8);
// stats: { max, min, avg, samples } 或 null
if (stats) {
  logger.info("max:", stats.max, "min:", stats.min, "avg:", stats.avg);
  logger.info("每帧峰值:", stats.samples);
}
```

### 单帧全视野峰值（`getTemp`）

```javascript
const t = temper.getTemp(); // 数值 °C 或 null
```

### 热成像图（`getThermalMap`）

```javascript
const tm = temper.getThermalMap();
if (tm) {
  const c = tm.getPixel(16, 16);
  logger.info("中心点 °C:", c, "原始字节数:", tm.map.length);
}
```

### 人脸关联 ROI 测温（`getRectTemp`）

```javascript
// rect: [x0, y0, x1, y1]，使用可见光摄像头坐标系（与人脸 SDK 的 rect 一致）
const r = temper.getRectTemp(event.rect);
if (r) {
  logger.info("value:", r.value, "fever:", r.fever, "grid:", r.grid);
}
```

## 6. 常量定义

热成像网格及帧相关常量均为 **dxTemp.js 内部常量**（如 **32×32** 网格、**QUERY_T_TOTAL** 2054）。公开 API 不导出常量对象；时序参数请通过 **`init({ timeout })`** 和 **`measure(frames)`** 配置。

## 7. 多线程支持

- UART 的 **`receive`** / **`send`** 在 JS 层为同步调用；除非运行时对同一 **`dxUart`** 通道 ID 的访问做了串行化处理，否则应避免多线程/Worker 并发调用。

## 8. 注意事项

1. 任何读取 API 调用前须先执行 **`init()`**；**`deinit()`** 会关闭 UART。
2. **`measure(n)`** 内部会设置全屏 ROI；**`frames`** 最小值截断为 **1**；若部分 **`CalcT`** 读取失败，**`samples`** 长度可能小于 **`frames`**。
3. **`getRectTemp`** 会依次触发 **SetRect**、**QueryT**、**CalcT**，开销大于单独调用 **`getTemp`**。
4. 若响应偶发截断，请调整 **`timeout`**（单位 ms）。
5. **`getThermalMap()`** 在 CRC 不匹配时返回 **`null`**——不可不加检查就假定成功。

## 9. 相关模块

- **dxUart**：**dxTemp** 使用的串口抽象层。
- **dxFacial** / 人脸 Worker 示例：为 **`getRectTemp`** 提供 **`event.rect`**。

## 10. 示例与测试脚本

[源代码](https://github.com/DejaOS/DejaOS/tree/main/demos/vf105_v12/vf105_v12_temper)