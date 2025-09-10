---
id: basicfaq
title: FAQ1
sidebar_label: FAQ1
---

### 1. What is dejaOS in one sentence?

dejaOS is a complete development ecosystem for low-cost, low-configuration IoT devices, including a JavaScript runtime environment running on devices, VSCode-based development and debugging tools, extensive official JavaScript components, and open-source documentation and examples.

### 2. What was the original intention behind developing dejaOS?

Traditionally, IoT applications relied on manufacturers using C/C++ for low-level development, which had high barriers and long cycles. dejaOS aims to shield hardware differences, allowing more application developers to quickly build high-quality IoT applications using JavaScript and expand more implementation scenarios.

### 3. What costs were involved in developing dejaOS?

We spent approximately 3 years, transitioning from an initial Lua scripting solution to JavaScript. The core team consisted of 5 people with rich experience in both application and embedded development, and we received long-term support from embedded and hardware teams.

### 4. What problems can dejaOS solve?

It solves the challenges of rapid customization and implementation of IoT devices in different scenarios, allowing application developers to independently complete scenario-based App development without relying on manufacturer customization.

### 5. What functionalities can dejaOS implement?

Developers can write scenario applications using JavaScript, replacing or extending the basic Apps that come with devices, and leverage official examples to quickly generate customized applications that meet their specific needs.

### 6. What technical skills are required to develop dejaOS applications?

Only familiarity with JavaScript and basic technical stacks (such as threading, network communication protocols, GUI development, etc.) is needed. General application developers can quickly get started.

### 7. Is development supported on Mac or Linux?

Currently Windows and Mac is supported, but since VSCode is cross-platform, support for Linux will be available soon.

### 8. How is the security of dejaOS application source code ensured?

The development process can be completely offline, and application deployment can be completed through private networks. Once a device enters production mode, internal files and code cannot be read or modified.

### 9. What is the development workflow like?

The workflow is similar to Android App development:

- Prepare a development device with dejaOS installed and a USB cable (default development devices are already equipped)
- Install the official VSCode plugin on your computer
- Connect the device to the computer via USB for development and debugging in VSCode; control the App running on the device through VSCode to see the results
- Unlike Android, applications are JavaScript scripts that don't require compilation, resulting in higher debugging efficiency

### 10. Do all your devices support dejaOS?

The vast majority of devices support it, while some older or extremely low-configuration devices do not. Representative models can be found at https://dejaos.com/devices.
