# QR Code Recognition Overview

DejaOS devices are equipped with different QR code recognition hardware depending on the device model. This guide provides an overview of the three types of QR code recognition implementations across our product line.

## Device Type Comparison

| Type | Hardware Configuration | Implementation Components | Performance | Device Examples |
| :--- | :--- | :--- | :--- | :--- |
| **Type 1** | Built-in QR Camera + SPI Bus | `dxCode` + `dxBarcode` | ⭐⭐⭐ High | [FC6820](https://www.feocey.com/product/fc6820/) |
| **Type 2** | Built-in QR Camera + UART Bus | `dxUart` + `dxChannel` | ⭐⭐⭐ High | [FCV4914](https://www.feocey.com/product/fcv4914/), [FCV4905](https://www.feocey.com/product/fcv4905/) |
| **Type 3** | Face Camera (Shared) | `dxFacial` | ⭐⭐ Medium | [FCV5002](https://www.feocey.com/store/fcv5002/), [FCV5003](https://www.feocey.com/store/fcv5003/) |

---

## Type 1: Built-in QR Code Camera + SPI Bus

### Representative Devices
- **[FC6820](https://www.feocey.com/product/fc6820/)**

### Hardware Configuration
- Dedicated QR code scanning camera module
- Communication via SPI (Serial Peripheral Interface) bus

### Implementation Components
- **dxCode**: Core QR code decoding engine
- **dxBarcode**: Barcode and QR code scanning interface

### Characteristics
- High-speed scanning capability
- Industrial-grade barcode/QR code recognition
- Dedicated hardware ensures stable performance

### Corresponding Example
- [dw200_barcode_demo](https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_barcode_demo)

---

## Type 2: Built-in QR Code Camera + UART Bus (External Scan Engine)

### Representative Devices
- **[FCV4914](https://www.feocey.com/product/fcv4914/)**
- **[FCV4905](https://www.feocey.com/product/fcv4905/)**

### Hardware Configuration
- Dedicated QR code scanning camera module (independent external scan engine)
- Communication via UART (Universal Asynchronous Receiver-Transmitter) bus

### Implementation Components
- **dxUart**: UART serial communication driver
- **dxChannel**: Data channel management for device communication

### Characteristics
- High-speed scanning capability comparable to Type 1
- Serial communication interface
- Dedicated hardware ensures stable performance
- DejaOS only **reads** scan results from the module through `dxChannel`. Scan interval and beep behavior are controlled **inside the scan engine**, not by the DejaOS app. To change those settings, scan the module's configuration barcodes. See [Configuring the External Scan Engine](#configuring-the-external-scan-engine) below.

### Corresponding Example
- [vf105_v12_barcode_demo](https://github.com/DejaOS/DejaOS/tree/main/demos/vf105_v12/vf105_v12_barcode_demo)

---

## Type 3: QR Recognition via Face Recognition Camera

### Representative Devices
- **[FCV5002](https://www.feocey.com/store/fcv5002/)**
- **[FCV5003](https://www.feocey.com/store/fcv5003/)**

### Hardware Configuration
- No dedicated QR code camera
- Shares the face recognition camera hardware

### Implementation Components
- **dxFacial**: Face recognition module with built-in QR code detection capability

### Characteristics
- Cost-effective design
- Camera is optimized for face recognition, QR code scanning is a secondary function
- Recognition performance is relatively lower compared to Type 1 and Type 2

### Corresponding Example
- [vf202_v12_barcode](https://github.com/DejaOS/DejaOS/tree/main/demos/vf202_v12/vf202_v12_barcode)

:::info Note
Type 1 and Type 2 devices are equipped with dedicated QR code cameras, offering comparable high-performance recognition. Type 3 devices share the face recognition camera for QR scanning, which results in relatively lower recognition performance but provides a cost-effective solution.
:::

---

## Identifying Your Device Type

To determine which QR code recognition type your device uses:

1. Check your device model number (e.g., [FC6820](https://www.feocey.com/product/fc6820/), [FCV4905](https://www.feocey.com/product/fcv4905/), [FCV5002](https://www.feocey.com/store/fcv5002/))
2. Refer to the comparison table above
3. Use the corresponding implementation components in your application

In the future, we will work on unifying these three approaches into the `dxBarcode` component to hide device-level differences.

---

## Configuring the External Scan Engine

This section applies to **Type 2** devices only.

On Type 2 hardware, the QR module is an **independent external scan engine**. Its firmware runs separately from the DejaOS application. DejaOS receives decoded data over UART through `dxChannel`, but it cannot directly change:

- How often the same code can be scanned again
- Beep / feedback behavior of the scan head

Those rules live inside the scan engine. To update them, point the scanner at the configuration barcodes below (print or display them, then scan once). After a successful scan, the new mode takes effect on the module.

### Modes (same code scanned repeatedly)

Both modes describe what happens when the **same** barcode/QR content is presented continuously. Scanning a **different** code is not limited by the interval below.

| Mode | Behavior |
| :--- | :--- |
| **Single** | The same code cannot be scanned continuously. After one successful read, the same content is ignored until it leaves the field of view (or you switch to another code). |
| **Interval** | The same code can be scanned again only after the configured delay (milliseconds). Different codes have no extra delay. |

### Configuration barcodes

Scan the barcode that matches the mode you want:

**Single mode**

![Single mode](/img/barcode/single.png)

**Interval mode**

| Interval | Configuration barcode |
| :--- | :--- |
| 300 ms | ![Interval 300 ms](/img/barcode/interval300.png) |
| 500 ms | ![Interval 500 ms](/img/barcode/interval500.png) |
| 1000 ms | ![Interval 1000 ms](/img/barcode/interval1000.png) |
| 2000 ms | ![Interval 2000 ms](/img/barcode/interval2000.png) |
| 3000 ms | ![Interval 3000 ms](/img/barcode/interval3000.png) |

:::tip
Pick an interval that fits your product flow. Shorter intervals allow faster re-reads of the same code; longer intervals reduce duplicate reports when a user holds the same code in front of the scanner.
:::
