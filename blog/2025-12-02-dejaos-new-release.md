---
slug: dejaos-new-version-release
title: "DejaOS 2.1.0 Released: Enhanced System Management, Faster Code Sync, and Improved Face Recognition"
authors: voxer
tags: [dejaos, release, update, 2.1.0, system management, code sync, facial recognition]
---

We are excited to announce the release of DejaOS 2.1.0! This version brings significant improvements in system management, development efficiency, and facial recognition performance. Let's take a look at the key updates.

<!--truncate-->

## 1. Upgraded System Management App

The System Management App has been completely redesigned, transitioning from a PC tool-based management mode to a modern device-side interface management mode.

### Old Version: PC Tool Management (No Interface)

In previous versions, system management relied on a special **Safe Mode** that required connecting to PC tools via a serial cable. This approach had several limitations:

- Required additional hardware (Serial-to-USB cable)
- Slower data transfer rates (limited by serial baud rate)
- Time-consuming application installations
- No visual interface on the device itself

### New Version: Device-Side Management (With Interface)

The new System Management App provides a fully visualized interface that can be accessed directly on the device screen:

- **Easy Access**: Long-press anywhere on the screen during the 2-second startup gray background to enter the System Manager
- **Intuitive Interface**: Four core modules including Network Config, Sys Info, System Config, and Install App
- **Remote Web Management**: Built-in Web server allows remote management via browser when connected to the same local network
- **Faster Operations**: Direct device-side operations eliminate serial cable bottlenecks

For more details, please refer to the [System Management App documentation](/docs/basics/managerapp).

## 2. Dramatically Improved Code Sync Speed

One of the most noticeable improvements in 2.1.0 is the significant boost in code synchronization speed. Compared to version 2.0.0, code sync speed has improved by approximately **10x**, making the development workflow much more efficient. When using the VSCode extension for development, you'll experience noticeably faster code deployment to your devices.

## 3. Updated Facial Recognition Base Library

The facial recognition foundation has been updated with enhanced stability and speed:

- **Improved Stability**: Better handling of edge cases and various lighting conditions
- **Faster Recognition**: Optimized algorithms reduce recognition time
- **Better Resource Management**: More efficient memory and CPU usage during face detection and matching operations

These improvements make facial recognition applications more reliable and responsive, especially in high-concurrency access control scenarios.

## Upgrade Recommendation

We strongly recommend upgrading to DejaOS 2.1.0 to take advantage of these improvements. The enhanced system management interface alone will significantly improve your device management experience, while the faster code sync will make your development workflow much more efficient.

For upgrade instructions and detailed changelog, please visit our [GitHub repository](https://github.com/DejaOS/DejaOS).

## Device Version Information

**New Devices:** All new VF series facial recognition devices and DW200 devices come pre-installed with the latest 2.1.0 version, ready to experience all new features out of the box.

**Legacy Device Upgrade:** If you are using older devices and wish to upgrade to version 2.1.0, please contact us. We will provide you with upgrade packages and detailed upgrade instructions to help you complete the system upgrade smoothly.

