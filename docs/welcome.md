# What is DejaOS

## Overview

**DejaOS** is a JavaScript runtime environment purpose-built for embedded devices, enabling low-cost, resource-constrained smart hardware to run JavaScript code efficiently. By adopting JavaScript as the primary development language, DejaOS dramatically lowers the barrier and cost for embedded development, making the process simpler and more productive.

DejaOS has been successfully deployed in various IoT scenarios, demonstrating excellent performance and development efficiency.

---

## Architecture

DejaOS is built on the following core components:

- **Mip / ARM Linux**: Provides system-level process, thread, and resource management
- **QuickJS**: A lightweight, fast JavaScript engine supporting the ES2020 standard
- **LVGL**: A popular open-source embedded graphics library, supporting rich UI development in both C and JavaScript

---

## Features

DejaOS offers a comprehensive set of JavaScript APIs and system capabilities:

### Hardware Interface Libraries

- GPIO, PWM, UART, RS-485, RS-232, USB, Wiegand, Watchdog
- Capturer, ALSA, NFC, QRCode, BLE, Face Recognition, and more

### Networking & Communication Protocols

- Net, TCP, TCP Server, MQTT, UDP, HTTP, Web Server, OSDP, etc.

### Graphics Library

- Build GUIs in JavaScript, fully compatible with native LVGL features

### Utility Libraries

- Threads, encryption/decryption, logging, EventBus, NTP, SQLite, and more

### Third-Party Libraries

- Supports importing ESM-format third-party JavaScript libraries via `import`

### Native C Library Integration

- Integrate native C libraries and expose them to JavaScript

---

## Development Workflow

### Environment Setup

- Install [Node.js (v20+)](https://nodejs.org)
- Install [Visual Studio Code](https://code.visualstudio.com)
- Install the [DejaOS IDE extension](https://marketplace.visualstudio.com/items?itemName=dxide.dxide)

### Device Preparation

1. Acquire a development device
2. Connect the device to your computer (VSCode) via USB

### Quick Start

- Use JavaScript in VSCode to [build your first application](./basics/quick-start.md)
- Instantly sync code to your device and view real-time logs

### Build & Deploy

1. Acquire production devices
2. Use VSCode to package your project as a `.dpk` installer
3. Deploy via OTA or use the [DPK installer tool](https://github.com/DejaOS/DejaOS/tree/main/tools) for serial installation

---

## Support

If you have any questions, feel free to contact us:

📧 Email: **service@dxiot.com**

We are happy to assist you!
