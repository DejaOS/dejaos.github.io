# DejaOS Devices

---

## Overview

Before understanding **DejaOS**, we first need to distinguish between the concepts of "development boards" and "production-grade devices."

In traditional embedded development, developers often use development boards provided by chip manufacturers. These boards come with built-in chips, pre-designed circuits, operating systems, and support for connecting common modules (such as Bluetooth, Wi-Fi, etc.). While development boards are convenient for testing functionality, turning them into truly deployable products requires additional circuit board design, custom enclosures, and hardware integration. This process typically requires a professional team and extended timelines, and ultimately it's difficult to guarantee product stability and consistency.

In contrast, **DejaOS** is developed based on strictly tested industrial-grade devices, similar to "developing apps on smartphones." These devices feature waterproof, dustproof, and high/low temperature resistance capabilities, meeting industrial application standards and suitable for deployment in harsh environments. Therefore, developers can directly develop applications based on these devices, and the final products can be put into actual use, reducing the workload of hardware adaptation and validation.

> 💡 **Note:** 
> - DejaOS is a JavaScript runtime environment, with the underlying layer implemented in C/C++, supporting cross-SoC compilation and execution. However, adaptation is still required for different chips, systems, and modules.

---

## Differences Between Development and Production Devices

The development devices and production devices supported by DejaOS are almost identical in hardware specifications, with only two main differences:

1. **Debug Interface**  
   Some models of development devices are equipped with an additional independent USB debug cable for connecting to VS Code, enabling real-time code synchronization and debugging.

2. **Pre-installed Applications**
   - **Production Devices**: Usually come with built-in specific apps that automatically run on startup and directly enter the business interface.
   - **Development Devices**: No pre-installed apps, entering a blank interface after startup, making it convenient for developers to load their own applications.

---

## Application Model

DejaOS devices adopt a "single application mode," meaning that devices typically **run only one application**, with no task switching, and no system settings interface similar to Android. This model better fits the characteristics of resource-constrained IoT devices and also improves system stability.

---

## Supported Microprocessor Architectures

DejaOS is currently adapted to the following two mainstream embedded chip architectures:

1. **MIPS Architecture** — Such as processors provided by [Ingenic](https://www.ingenic.com.cn/)
2. **ARM Architecture** — Such as processors provided by [EEasyTech](https://www.eeasytech.com/)

For devices from other manufacturers using the above architectures, DejaOS's porting and adaptation work is also relatively easy.

---

## Device Types and Applications

DejaOS has been deployed on various IoT devices, which can be roughly categorized into the following types based on functionality and hardware configuration:

### 1. Control Boards (e.g., CC104)

- **Features**: No screen, communicates with backend systems via network, controls multiple peripherals through serial ports, supports GPIO input/output.
- **Applications**: Access control main controller, IoT controller, backend communication node.

![CC104](/img/devices/CC104.png)

### 2. Reader Devices (e.g., M350)

- **Features**: Used for identifying cards, QR codes, and other identification information. Can work with control boards or directly communicate with systems via network. Generally no screen included.
- **Applications**: Access control card reading, QR code door opening, identity recognition.

![M350](/img/devices/M350.png)

### 3. Face Recognition Devices (e.g., VF105)

- **Features**: Integrated face recognition related software and hardware, equipped with 6-inch or larger screens, network connectivity capability, automatically enters face recognition application after startup.
- **Applications**: Smart access control, face clock-in, visitor recognition.

![VF105](/img/devices/VF105.png)

### 4. Multi-function Panel Devices (e.g., DW200)

- **Features**: Provides comprehensive communication and control interfaces (network, NFC, Bluetooth, serial port, GPIO, QR code recognition, etc.), equipped with small-sized touch screens.
- **Applications**: Smart panels, device control terminals, scene linkage hub.

![DW200](/img/devices/DW200.png)

---

## Device Type Comparison Table

| Device Type             | Has Screen  | Communication Method      | Typical Functions                         | Example Models |
| ----------------------- | ----------- | ------------------------- | ----------------------------------------- | -------------- |
| Control Board           | No          | Network + Serial          | Peripheral Control, GPIO                  | CC104          |
| Reader                  | No          | Network / Serial          | Card Recognition, QR Code Scanning        | M350           |
| Face Recognition Device | Yes         | Network + Multi-interface | Face Recognition, Camera                  | VF105          |
| Multi-function Panel    | Yes (Touch) | Network + Multi-interface | Comprehensive Control, NFC, QR Code, etc. | DW200          |
