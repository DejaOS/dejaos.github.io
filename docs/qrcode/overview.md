# QR Code Recognition Overview

DejaOS devices are equipped with different QR code recognition hardware depending on the device model. This guide provides an overview of the three types of QR code recognition implementations across our product line.

## Device Type Comparison

| Type | Hardware Configuration | Implementation Components | Performance | Device Examples |
| :--- | :--- | :--- | :--- | :--- |
| **Type 1** | Built-in QR Camera + SPI Bus | `dxCode` + `dxBarcode` | ⭐⭐⭐ High | DW200 |
| **Type 2** | Built-in QR Camera + UART Bus | `dxUart` + `dxChannel` | ⭐⭐⭐ High | VF114, VF105 |
| **Type 3** | Face Camera (Shared) | `dxFacial` | ⭐⭐ Medium | VF202, VF203 |

---

## Type 1: Built-in QR Code Camera + SPI Bus

### Representative Devices
- **DW200**

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

---

## Type 2: Built-in QR Code Camera + UART Bus

### Representative Devices
- **VF114**
- **VF105**

### Hardware Configuration
- Dedicated QR code scanning camera module
- Communication via UART (Universal Asynchronous Receiver-Transmitter) bus

### Implementation Components
- **dxUart**: UART serial communication driver
- **dxChannel**: Data channel management for device communication

### Characteristics
- High-speed scanning capability comparable to Type 1
- Serial communication interface
- Dedicated hardware ensures stable performance

---

## Type 3: QR Recognition via Face Recognition Camera

### Representative Devices
- **VF202**
- **VF203**

### Hardware Configuration
- No dedicated QR code camera
- Shares the face recognition camera hardware

### Implementation Components
- **dxFacial**: Face recognition module with built-in QR code detection capability

### Characteristics
- Cost-effective design
- Camera is optimized for face recognition, QR code scanning is a secondary function
- Recognition performance is relatively lower compared to Type 1 and Type 2

:::info Note
Type 1 and Type 2 devices are equipped with dedicated QR code cameras, offering comparable high-performance recognition. Type 3 devices share the face recognition camera for QR scanning, which results in relatively lower recognition performance but provides a cost-effective solution.
:::

---

## Identifying Your Device Type

To determine which QR code recognition type your device uses:

1. Check your device model number (e.g., DW200, VF105, VF202)
2. Refer to the comparison table above
3. Use the corresponding implementation components in your application
