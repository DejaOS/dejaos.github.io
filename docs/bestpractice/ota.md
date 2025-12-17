# OTA (Over-The-Air) Best Practices

In the full lifecycle management of embedded devices, OTA (Over-The-Air) updates are a critical mechanism for ensuring device stability, patching vulnerabilities, and releasing new features.

This document details DejaOS's OTA design philosophy, implementation strategies, and how to handle exceptions during the update process.

---

## Core Design Philosophy: App-Driven

The design philosophy of DejaOS is to maximize system resources for business applications. Since CPU and memory resources on embedded devices are relatively limited, DejaOS **does not include** a resource-consuming system-level background OTA service.

**All OTA logic—including update checks, downloading, verification, installation, and failure handling—is the responsibility of the developer's business application itself.**

This design pattern offers high flexibility:

- You can customize update strategies based on business needs (e.g., update only during idle hours).
- You have full control over UI interactions (e.g., displaying custom progress bars or prompts).
- You can integrate any backend protocol (HTTP, MQTT, WebSocket, etc.).

To simplify development, DejaOS provides a encapsulated `dxOta` component, which you can use directly or as a reference implementation.

For a basic explanation of the OTA upgrade process flow, please refer to [App Packaging, Installation, and Upgrade](../basics/app.md).

---

## Standard Update Flow

Whether it's a scheduled update or an on-demand update, a robust OTA flow typically includes the following four steps:

```text
+----------+                   +------------+                   +----------+
| Device   |                   | Backend    |                   | File     |
| App      |                   | Server     |                   | System   |
+----------+                   +------------+                   +----------+
     |                               |                               |
     | 1. Check for updates          |                               |
     | (Report version)              |                               |
     |------------------------------>|                               |
     |                               |                               |
     | 2. Return new version info    |                               |
     | (URL, MD5)                    |                               |
     |<------------------------------|                               |
     |                               |                               |
     | (Decide to update)            |                               |
     |                               |                               |
     | 3. Download firmware (.dpk)   |                               |
     |------------------------------>|                               |
     |                               |                               |
     | 4. Return file stream         |                               |
     |<------------------------------|                               |
     |                               |                               |
     | 5. Save temp file             |                               |
     |-------------------------------------------------------------->|
     |                               |                               |
     | 6. Verify MD5                 |                               |
     |                               |                               |
     |       [Verification Pass]     |                               |
     |           |                   |                               |
     |           +-------------------------------------------------->| 7a. Move to install dir
     |           |                   |                               |
     |           +------------------>| 8a. Restart device            |
     |                               | (Trigger system install)      |
     |                               |                               |
     |       [Verification Fail]     |                               |
     |           |                   |                               |
     |           +-------------------------------------------------->| 7b. Delete temp file
     |           |                   |                               |
     |           +------------------>| 8b. Report verification fail  |
     |                               |                               |
```

### 1. Check for Updates

The app sends a request to the server carrying the current version number.

### 2. Download Firmware

The app downloads the firmware package in `.dpk` format based on the URL returned by the server.

### 3. Integrity Verification (Critical)

**This is the first line of defense against bricking the device.** After the download is complete, the app **must** calculate the MD5 value of the file locally and compare it with the MD5 value provided by the server.

- **Match**: Indicates the file is complete and can be installed.
- **Mismatch**: Indicates the file download is incomplete or corrupted. In this case, **the update must be aborted**, the temporary file deleted, and an error can optionally be reported.

### 4. Installation and Restart

After verification passes, place the firmware package in the system-specified update directory, then call the system restart interface. The DejaOS bootloader will automatically decompress and overwrite the old app upon startup.

---

## Common Update Strategies

### 1. Scheduled Update (Background Silent Check)

Suitable for most routine business scenarios.

- **Implementation**: Start a timer within the app (setInterval polling).
- **Strategy**: For example, trigger a check process every day at 2:00 AM.
- **Logic**:
  1.  The app periodically accesses the backend via HTTP(S).
  2.  The backend determines if an upgrade is needed based on the version number.
  3.  If download succeeds and verifies, restart the device during business idle periods.

### 2. On-Demand Update (Real-Time Push)

Suitable for urgent fixes or targeted upgrades for specific devices.

- **Implementation**: Use MQTT long connection or QR code scanning.
- **Strategy**:
  - **MQTT**: The backend publishes an upgrade command to a specific `Topic`, and the device immediately starts the download process upon receiving the message.
  - **QR Code**: Operations personnel scan a QR code containing upgrade information on-site, triggering the upgrade logic within the app.

---

## Progress Monitoring and File Limits

### Progress Tracking

Although the `dxOTA` component encapsulates most of the logic, you can still achieve fine-grained progress monitoring through the underlying `dxHttpClient`.

- Use the `onProgress` callback to get download progress.
- Combine key events ("Download Started", "Verification Success", "Ready to Restart") to report status to the backend via MQTT or HTTP in real-time.

### File Size Limits

The DejaOS system itself has no hard limit on OTA package size, mainly limited by hardware specifications:

- **Flash Space**: There must be enough space to store the current app, the downloaded installation package, and the decompressed temporary files simultaneously.
- **RAM Space**: The decompression process consumes memory.
- **Experience Value**: Small screen device apps are typically < 5MB, large screen device apps are typically < 50MB.

---

## Failure Recovery Mechanisms

DejaOS uses a "seamless replacement" mechanism. It does not have the dual-partition automatic rollback function of traditional operating systems, but provides multiple protection mechanisms.

### 1. Verification Phase Protection

As mentioned earlier, MD5 verification failure will directly terminate the update, the old version app is unaffected, and the device continues to run normally.

### 2. Installation Phase Protection

The file overwrite process is atomic. Unless power is forcibly cut during the upgrade process, the probability of failure is extremely low.

### 3. Disaster Recovery: Safe Mode

This is the ultimate resort for **application-level failures** (e.g., new version code logic errors causing immediate crash on startup, device unable to connect to network).

- **What is Safe Mode**: A micro system management interface independent of business apps, built into DejaOS firmware.
- **Mechanism**: Safe Mode is **not** a resident background system app. It only starts briefly when the device restarts (if not triggered, it enters the business app directly). After exiting Safe Mode, the system automatically loads and runs your business app.
- **How to Enter**:
  1.  Device starts (power on again).
  2.  Within the first **2 seconds** of startup (screen usually shows a gray background), **long press the screen**.
  3.  The system will enter the Safe Mode interface (password protected).
- **How to Recover**:
  1.  Configure network (Wi-Fi or Wired) in the Safe Mode interface.
  2.  The interface will display the device's IP address.
  3.  Access this IP via a computer browser within the LAN.
  4.  Input the correct firmware package URL on the web page and manually execute app installation.

:::tip Summary
**Safe Mode** is a manual "last resort" for disaster recovery, ensuring that even if the app completely crashes, the device can still be repaired over the network without returning to the factory.
:::
