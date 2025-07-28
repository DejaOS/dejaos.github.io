# DejaOS Architecture

---

## Overview

**DejaOS** is a JavaScript runtime environment designed for embedded devices, based on the QuickJS engine, capable of running efficiently on resource-limited devices. Additionally, it integrates the LVGL graphics engine, suitable for devices with screens. Developers can implement various business logic by `import`ing different JavaScript modules. DejaOS also provides a VS Code plugin for convenient development, debugging, and deployment.

The core goal of DejaOS is to simplify the embedded development process, allowing more application developers (even those without hardware backgrounds) to easily enter the embedded development field. Compared to traditional C/C++ embedded development, JavaScript is more user-friendly with a lower development threshold. Considering that application developers far outnumber embedded engineers, DejaOS hopes to accelerate the popularization and innovation of IoT devices through a more modern development experience.

---

## Relationship Between OS and Apps

DejaOS is a system platform based on embedded Linux that extends the runtime capabilities of JavaScript applications. Its development experience and mechanisms are very similar to Android or iOS.

### Similarities to Mobile Systems

1. Develop code in VS Code and synchronize to devices in real-time via USB for execution.
2. Build into application installation packages (`.dpk`), similar to Android's `.apk`.
3. Applications can be deployed and upgraded through installation tools or networks, with app store support planned for the future.

### Key Differences from Mobile Systems

- Can run on extremely low-configuration devices (approximately 5MB storage / 2MB memory).
- Currently only supports single application operation (may expand to multi-application in the future).
- No unified system interface (no "desktop" or "settings" UI).
- Each device model requires a specially customized system image to match hardware drivers.
- Uses JavaScript for development, supports hot updates, and runs without compilation.

---

## System Architecture (Runtime)

![DejaOS Runtime Architecture](/img/intro1.png)

The runtime architecture is divided into four layers:

### 1. Operating System Layer (OS)

Embedded Linux system providing basic services such as memory management, process scheduling, and file systems.

### 2. Module Layer (Modules)

Each module encapsulates specific functionality, typically including:

- `.js` files: Expose unified JavaScript APIs
- `.so` files: Actual underlying driver implementations (C/C++), some modules may not require `.so` files

Different devices correspond to different `.so` files, but the `.js` layer interfaces remain consistent, thus shielding device differences.

Currently, all modules are provided and maintained by the official team. In the future, a module store will be opened, allowing developers to develop their own modules and publish them to the module store.

### 3. Engine Layer (Engines)

- JavaScript Engine (based on QuickJS): Parses and executes JavaScript code.
- Graphics Engine (based on LVGL): Provides GUI rendering capabilities, supporting touch and interaction.

### 4. Application Layer (App)

Business logic written by developers using JavaScript, which calls module APIs to interact with hardware at runtime.

Cross-device operation: The same set of JavaScript applications can run on various devices, requiring only select adapted module libraries.

---

## System Architecture (Development)

![DejaOS Development Architecture](/img/intro2.png)

Developers connect to devices through VS Code, achieving an efficient local development experience:

- Real-time source code synchronization to devices
- Control application start and stop
- Real-time reception of device logs displayed in the IDE
- Fast debugging of hardware behavior

---

## Example Code: QR Code Recognition

The following is a typical scenario: scanning QR codes and printing their content.

```js
import log from "../dxmodules/dxLogger.js";
import std from "../dxmodules/dxStd.js";
import bus from "../dxmodules/dxEventBus.js";
import code from "../dxmodules/dxCode.js";
import common from "../dxmodules/dxCommon.js";

// 1. Initialize QR code scanning module
code.worker.beforeLoop(
  { id: "capturer1", path: "/dev/video11" },
  { id: "decoder1", name: "decoder v4", width: 800, height: 600 }
);

// 2. Subscribe to QR code recognition events
bus.on(code.RECEIVE_MSG, function (data) {
  let str = common.utf8HexToStr(common.arrayBufferToHexString(data));
  log.info(str); // Print QR code content
});

// 3. Poll scan results every 50ms
std.setInterval(() => {
  try {
    code.worker.loop();
  } catch (error) {
    log.error(error);
  }
}, 50);
```

The example is overall very simple:

1. `import` standard libraries, using 4 libraries here:
   - dxLogger.js: For printing logs
   - dxStd.js: Basic system library, used for polling in this example
   - dxEventBus.js: Event library, used for subscribing to QR code scan success events in this example
   - dxCode.js: Camera library for recognizing and parsing QR codes, this library also supports barcodes
2. Initialize the device's camera for QR code recognition, initialization parameter values may vary for different devices
3. Subscribe to QR code recognition success events and register a callback function
4. Process QR code content in the callback function, this example simply prints the QR code content
5. Poll to attempt to get QR code recognition results from the camera

If you expect to run this code on a device, simply connect the device to your computer via USB cable, then use the plugin in VSCode to sync the code to the device and run it.

---

## Summary

DejaOS uses JavaScript as its core language, greatly reducing the threshold for embedded development. Through standardized modules, efficient development toolchains, and lightweight runtime architecture, it makes device development as simple and efficient as web development. It is gradually becoming an ideal platform for the next generation of IoT applications.
