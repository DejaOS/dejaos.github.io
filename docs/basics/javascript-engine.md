# Introduction to DejaOS JavaScript Engine

---

## Overview

**DejaOS** uses [QuickJS](https://bellard.org/quickjs/) — a compact, efficient, and easily embeddable JavaScript engine. It was developed by the renowned French programmer Fabrice Bellard (who is also the author of projects like FFmpeg and QEMU), supporting the complete **ES2023** standard, including modern language features such as modules, async generators, proxies, and more.

Compared to the V8 engine used by Node.js, QuickJS is more suitable for running on resource-constrained embedded devices. It has a small footprint, fast startup, and low memory usage, making it an ideal choice for embedded and IoT environments.

---

## Core Advantages of QuickJS

### ✅ Compact and Efficient

QuickJS has an extremely small codebase with very low memory usage, capable of running smoothly in environments with just a few hundred KB. It's perfectly suited for devices with limited RAM and storage space.

### ✅ Full ES2023 Standard Support

QuickJS provides comprehensive JavaScript feature support, including:

- Module system (`import/export`)
- Async functions and generators
- Proxy, BigInt, Intl, regex extensions, and more

This means DejaOS developers can use almost all modern JavaScript syntax, improving development efficiency and readability.

### ✅ Strong Embedding Capabilities

QuickJS is natively designed for embedded integration, using simple C interfaces to embed the JS engine into existing C/C++ applications, making it extremely easy to extend and integrate.

### ✅ High Performance

While not pursuing extreme JIT performance (unlike V8), QuickJS's interpretive execution performance is excellent in embedded scenarios, with fast startup and responsive behavior, meeting the needs of the vast majority of IoT applications.

### ✅ Support for Extensions and Bindings

Developers can customize C-level modules and objects, exposing underlying hardware capabilities to the JavaScript layer through built-in interfaces, achieving flexible functional encapsulation.

---

## Application Scenarios in DejaOS

DejaOS combines QuickJS with its device driver module system (such as dxCode, dxNfc, etc.) to build a lightweight, highly extensible embedded JavaScript platform, suitable for:

- Industrial control devices (such as control boards, readers, etc.)
- Human-machine interaction devices (devices with screens, panels)
- Smart access control, recognition terminals, face recognition devices
- Various IoT gateways/nodes requiring script orchestration logic

Additionally, QuickJS's excellent support for asynchronous programming makes it possible to build high-performance, responsive network devices.

---

## Why Choose QuickJS?

| Comparison Item                   | QuickJS                  | V8 (Node.js)                               |
| --------------------------------- | ------------------------ | ------------------------------------------ |
| Startup Speed                     | Fast (millisecond level) | Slow (second level)                        |
| Resource Usage                    | Very Low (RAM < 2MB)     | High (RAM > 100MB)                         |
| Compatibility                     | Supports complete ES2023 | Supports mainstream JS standards           |
| Embeddability                     | Very Strong              | Complex embedding, heavy dependencies      |
| Suitable for Embedded Development | ✅                       | ❌                                         |
| Multi-platform Support            | ✅                       | ✅ (but not friendly to limited resources) |

---

## Summary

DejaOS chose QuickJS as its core JS engine based on considerations of high adaptation to embedded environments and performance balance. QuickJS provides a modern JavaScript development experience while maintaining extremely low resource consumption, enabling stable operation and efficient development even on performance-limited devices.

This not only lowers the threshold for embedded development but also opens new doors for JavaScript developers to enter the IoT field.
