# Apps & Demos

Welcome to the DejaOS Apps showcase. Here you can find various examples ranging from basic components to full-scale industry solutions.

## What's Inside?

### ⚙️ Features

Combined demos that showcase how multiple modules work together to achieve specific functionalities.

### 🚀 Solutions

Complete, production-ready application scenarios that demonstrate the full power of DejaOS in real-world use cases.

## Key Information

### 📖 Scenario & Source Code

Each example includes detailed explanations of the application scenario and usage instructions. All **source code is hosted on GitHub** for easy download and reference.

### 🖥️ Visual UI Experience

To make demonstrations more intuitive, for devices equipped with screens, we provide UI interfaces whenever possible to visualize functional interactions.

### 🔄 Cross-Device Compatibility

DejaOS JavaScript code is designed to be **fully cross-device**. This means:

- **Seamless Migration**: Code running on Device A can often be run directly on Device B.
- **How to Switch**: Simply open the `app.dxproj` file in your IDE and change the target Device Model.
- **Dependency Management (dxmodules)**:
  - Example source code does not include the actual component implementations (`.js` and `.so` files), similar to `node_modules` in web development.
  - After switching devices, you only need to select the appropriate component version for the new device (APIs remain consistent across devices even if version numbers differ) and download them into the `dxmodules` directory.
  - This architecture ensures the decoupling of application logic from hardware-specific implementations.

### ⚠️ Caveats

- **UI Adaptation**: If devices have different screen sizes or resolutions, minor UI layout adjustments may be required.
- **Hardware Limitations**: Cross-device execution depends on the target device's hardware capabilities. For instance, if Device A supports BLE but Device B does not, BLE-related code will not function on Device B.

---

Choose a category from the sidebar to get started!
