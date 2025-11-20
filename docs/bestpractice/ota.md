# Best Practices for OTA (Over-The-Air) Updates

In the lifecycle management of embedded devices, OTA (Over-The-Air) updates are a critical mechanism for ensuring device stability, patching vulnerabilities, and deploying new features.

This document details DejaOS's OTA design philosophy, implementation strategies, and handling of exceptions during the update process.

---

## Core Design Philosophy: Application-Driven

DejaOS is designed to maximize system resources for business applications. Given the limited CPU and memory resources of embedded devices, DejaOS **does not include** a resource-intensive system-level background OTA service.

**All OTA logic—including update checks, downloading, verification, installation, and failure handling—is the responsibility of the developer's business application.**

This design pattern offers high flexibility:

- You can customize update strategies based on business needs (e.g., updating only during idle hours).
- You have full control over UI interactions (e.g., displaying custom progress bars or prompts).
- You can integrate any backend protocol (HTTP, MQTT, WebSocket, etc.).

To simplify development, DejaOS provides a pre-packaged `dxOTA` component that you can use directly or as a reference implementation.

---

## Standard Update Workflow

Whether it's a scheduled update or an on-demand update, a robust OTA process typically involves the following four steps:

```text
+----------+                   +------------+                   +----------+
| Device App |                 | Backend Server |               | File System |
+----------+                   +------------+                   +----------+
     |                               |                               |
     | 1. Check Update (Report Ver)  |                               |
     |------------------------------>|                               |
     |                               |                               |
     | 2. Return New Version Info    |                               |
     |    (URL, MD5)                 |                               |
     |<------------------------------|                               |
     |                               |                               |
     | (Evaluate Update Need)        |                               |
     |                               |                               |
     | 3. Download Firmware (.zip)   |                               |
     |------------------------------>|                               |
     |                               |                               |
     | 4. Return File Stream         |                               |
     |<------------------------------|                               |
     |                               |                               |
     | 5. Save Temporary File        |                               |
     |-------------------------------------------------------------->|
     |                               |                               |
     | 6. Verify MD5                 |                               |
     |                               |                               |
     |       [Verification Passed]   |                               |
     |           |                   |                               |
     |           +-------------------------------------------------->| 7a. Move to Install Dir
     |           |                   |                               |
     |           +------------------>| 8a. Reboot (Trigger Install)  |
     |                               |                               |
     |       [Verification Failed]   |                               |
     |           |                   |                               |
     |           +-------------------------------------------------->| 7b. Delete Temp File
     |           |                   |                               |
     |           +------------------>| 8b. Report Verification Failure|
     |                               |                               |
```

### 1. Check Update

The application sends a request to the server carrying the current version number.

### 2. Download Firmware

The application downloads the firmware package in `.zip` format based on the URL returned by the server.

### 3. Integrity Verification (Critical)

**This is the first line of defense against "bricking" the device.** After the download is complete, the application **must** calculate the MD5 value of the file locally and compare it with the MD5 value provided by the server.

- **Match**: Indicates the file is complete and ready for installation.
- **Mismatch**: Indicates the file is incomplete or corrupted. In this case, you **must abort the update**, delete the temporary file, and optionally report the error.

### 4. Installation and Reboot

After successful verification, place the firmware package in the system-specified update directory and call the system reboot interface. The DejaOS bootloader will automatically unzip and overwrite the old application upon startup.

---

## Common Update Strategies

### 1. Scheduled Update (Background Silent Check)

Suitable for most routine business scenarios.

- **Implementation**: Start a timer (setInterval polling) within the application.
- **Strategy**: For example, trigger a check process once every day at 2:00 AM.
- **Logic**:
  1. The application periodically accesses the backend via HTTP(S).
  2. The backend determines if an upgrade is needed based on the version number.
  3. If the download is successful and verified, reboot the device during business idle time.

### 2. On-Demand Update (Real-time Push)

Suitable for urgent patches or targeted upgrades for specific devices.

- **Implementation**: Use MQTT long connections or scan a QR code.
- **Strategy**:
  - **MQTT**: The backend publishes an upgrade command to a specific `Topic`, and the device immediately starts the download process upon receiving the message.
  - **QR Code**: Operations personnel scan a QR code containing upgrade information on-site to trigger the upgrade logic within the application.

---

## Progress Monitoring and File Limits

### Progress Tracking

Although the `dxOTA` component encapsulates most of the logic, you can still achieve fine-grained progress monitoring through the underlying `dxHttpClient`.

- Use the `onProgress` callback to get download progress.
- Combine key events ("Start Download", "Verification Success", "Ready to Reboot") to report status to the backend in real-time via MQTT or HTTP.

### File Size Limits

DejaOS itself does not impose hard limits on OTA package sizes; they are mainly limited by hardware specifications:

- **Flash Space**: Must have enough space to store the current application, the downloaded installation package, and the unzipped temporary files simultaneously.
- **RAM Space**: The decompression process consumes memory.
- **Rule of Thumb**: Small screen device applications are typically < 5MB, large screen device applications are typically < 50MB.

---

## Disaster Recovery Mechanism

DejaOS uses a "seamless replacement" mechanism. It does not have the dual-partition automatic rollback feature of traditional operating systems but provides multiple layers of protection.

### 1. Verification Phase Protection

As mentioned earlier, MD5 verification failure will directly terminate the update. The old version of the application is unaffected, and the device continues to run normally.

### 2. Installation Phase Protection

The file overwriting process is atomic. Unless power is forcibly cut during the upgrade, the probability of failure is extremely low.

### 3. Disaster Recovery: Safe Mode

This is the ultimate resort for **application-level failures** (e.g., a bug in the new version causes an immediate crash on startup, preventing network access).

- **What is Safe Mode**: A minimal system management interface independent of the business application, built into the DejaOS firmware.
- **Mechanism**: Safe Mode is **not** a resident background application. It only starts briefly upon device reboot (if not triggered, it proceeds directly to the business application). After exiting Safe Mode, the system will automatically load and run your business application.
- **How to Enter**:
  1. Power on the device (restart).
  2. Within the first **2 seconds** of startup (when the screen typically displays a gray background), **long-press the screen**.
  3. The system will enter the Safe Mode interface (password protected).
- **How to Recover**:
  1. Configure the network (Wi-Fi or Ethernet) in the Safe Mode interface.
  2. The interface will display the device's IP address.
  3. Access this IP address via a computer browser on the same LAN.
  4. Enter the correct firmware package URL on the web page and manually execute the application installation.

:::tip Summary
**Safe Mode** is a manual "last resort" for disaster recovery, ensuring that the device can still be repaired over the network without returning to the factory, even if the application crashes completely.
:::
