# dxBarcode

## 1. 概述

此模块是 [dejaOS](https://github.com/DejaOS/DejaOS) 官方系统模块库的一部分，用于条形码扫描和解码功能。
它包含全面的条形码扫描功能：

- 初始化/反初始化条形码扫描器
- 实时条形码检测和解码
- 支持各种条形码格式（QR、Code128、Code39 等）
- 事件驱动的回调系统
- 系统级条形码扫描的单例模式

## 2. 文件

- dxBarcode.js
- libvbar-m-dxbarcode.so

> - 确保这 2 个文件包含在您项目根目录下的 dxmodules 子目录中

## 3. 依赖项

- dxLogger

## 4. 兼容设备

兼容所有运行 dejaOS v2.0+ 的设备。设备必须具有扫描摄像头。

## 5. 使用方法

### 基本用法

```javascript
import dxbarcode from "./dxmodules/dxBarcode.js";

// 初始化条形码扫描器
dxbarcode.init();

// 设置条形码检测回调
dxbarcode.setCallbacks({
  onBarcodeDetected: function (data, type, quality, timestamp) {
    // data 是包含条形码数据的 ArrayBuffer
    let str = common.utf8HexToStr(common.arrayBufferToHexString(data));
    log.info("条形码数据 :", str);
    log.info("条形码类型:", type);
    log.info("质量:", quality);
    log.info("时间戳:", timestamp);
  },
});

// 开始处理条形码事件（定期调用）
setInterval(() => {
  dxbarcode.loop();
}, 50); // 每 50ms 处理一次事件
```

## 6. API 参考

### `dxbarcode.init()`

初始化条形码扫描器。必须在任何其他操作之前调用。

**返回值：** `void`

### `dxbarcode.deinit()`

反初始化条形码扫描器并释放资源。

**返回值：** `void`

### `dxbarcode.setCallbacks(callbacks)`

设置条形码检测事件的回调函数。

**参数：**

- `callbacks` (Object): 回调函数对象
  - `onBarcodeDetected` (Function): 处理条形码检测的回调函数
    - `data` (ArrayBuffer): 作为 ArrayBuffer 的条形码数据。这保留了二进制数据完整性并防止编码问题。
    - `type` (Number): 条形码类型标识符。请参考[支持的格式和类型值]
    - `quality` (Number): 解码条形码的质量分数。
    - `timestamp` (Number): 检测到条形码时的时间戳。

**返回值：** `void`

### `dxbarcode.loop()`

处理来自条形码事件队列的事件。应该定期调用（例如在 setInterval 中）。

**返回值：** `void`

### `dxbarcode.getNative()`

获取原生条形码客户端对象。

**返回值：** `Object|null` - 原生客户端对象，如果未初始化则为 null。

## 7. 相关模块

- **dxCode:** 已弃用，被 dxBarcode 替代
- **dxCapturer:** 图像捕获功能
- **dxDecoder:** 条形码解码功能

## 8. 示例

[源代码](https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_barcode_demo)

有关完整的工作示例，请参考源代码仓库中的演示文件。

## 9. 支持的格式和类型值

### 1D 条形码标准：

- **UPC-A**（通用产品代码 A）：类型 2
  ![UPC-A](/img/barcode/UPC-A.gif)

- **UPC-E**（通用产品代码 E）：类型 2
  ![UPC-E](/img/barcode/UPC-E.gif)

- **CODE128**（代码 128）：类型 7
  ![CODE128](/img/barcode/Code-128.gif)

- **CODE93**（代码 93）：类型 6
  ![CODE93](/img/barcode/Code-93.gif)

- **CODE39**（代码 39）：类型 5
  ![CODE39](/img/barcode/Code-39.gif)

- **EAN-8**（欧洲商品编号 8 位）：类型 2
  ![EAN-8](/img/barcode/EAN-8.gif)

- **EAN-13**（欧洲商品编号 13 位）：类型 2
  ![EAN-13](/img/barcode/EAN-13.gif)

### 2D 条形码标准：

- **QR Code**（快速响应代码）：类型 1
  ![QR Code](/img/barcode/QRCode.gif)

- **PDF417**（便携式数据文件 417）：类型 10
  ![PDF417](/img/barcode/PDF417.gif)

- **AZTEC**（阿兹特克代码）：类型 16
  ![AZTEC](/img/barcode/Aztec.gif)

- **Micro QR Code**：类型 1
  ![Micro QR Code](/img/barcode/MicroQRCode.gif)

## 10. 长文本二维码示例

![长二维码](/img/barcode/complexqrcode.png)
