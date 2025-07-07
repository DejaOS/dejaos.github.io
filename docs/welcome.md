---
id: welcome
title: Welcome to DejaOS
---

DejaOS is a JavaScript runtime environment designed for embedded devices, enabling low-cost, low-spec smart devices to run JavaScript code. It uses JavaScript as the development language, reducing costs and simplifying development.

### 🚀 Core Features

DejaOS provides a comprehensive set of JavaScript modules for embedded development:

- **Hardware Interface Module** - GPIO, PWM, UART, RS-485, RS-232, USB, Wiegand, Watchdog, Capturer, ALSA, NFC, QRCode, BLE, Face Recognition, etc.
- **Networking and Communication Protocol Module** - Net, TCP, TCP Server, MQTT, UDP, HTTP, Web Server, OSDP, etc.
- **Graphics Module** - Supports drawing GUI screens using JavaScript, compatible with all LVGL native capabilities.
- **Utility Module** - Threads, encryption/decryption, logging, EventBus, NTP, SQLite, etc.
- **Third-Party Module** - Supports using pure JavaScript third-party modules with import (ESM).
- **Native C Library Support** - Allows development through embedded native C libraries wrapped in JavaScript.

### 🛠 Technical Foundation

DejaOS is built on the foundations of Mip/ARMLinux, QuickJS, and LVGL:

- **Mip/ARMLinux** - Embedded Linux with system processes, threads, and resource scheduling capabilities.
- **QuickJS** - A compact and fast JavaScript engine that supports the ES2020 standard.
- **LVGL** - The most popular free open-source embedded graphics library, allowing easy creation of beautiful UIs using JavaScript.

### 📱 Development Process

The development process for DejaOS apps is straightforward:

1. **Prepare Development Environment** - Install Node.js (20+), VSCode, and DXIDE (VSCode plugin)
2. **Connect Device** - Connect your development device to VSCode using USB
3. **Write Code** - Write JavaScript applications in VSCode with real-time sync
4. **Build & Deploy** - Build DPK installation packages and deploy to production devices

### 🎯 Why Choose DejaOS?

- **JavaScript Everywhere** - Use JavaScript for both frontend and backend development
- **Rich Hardware Support** - Comprehensive hardware interface modules
- **Modern GUI** - Beautiful UI development with LVGL integration
- **Real-time Development** - Live code sync and debugging
- **Production Ready** - Easy packaging and deployment system
- **Open Source** - MIT licensed, community-driven development

### 🏗 Project Structure

A typical DejaOS project consists of:

| File       | Required | Function                   |
| ---------- | -------- | -------------------------- |
| .temp      | NO       | Store temporary files      |
| dxmodules  | NO       | Store dependent files      |
| src        | YES      | Project logic              |
| main.js    | YES      | Project entry file         |
| app.dxproj | YES      | Project configuration file |

### 🚀 Quick Start

Ready to get started? Check out our [Quick Start Guide](basics/quick-start) to create your first DejaOS application in minutes!

For more information about supported devices and setup instructions, visit our [Installation Guide](basics/installation).
