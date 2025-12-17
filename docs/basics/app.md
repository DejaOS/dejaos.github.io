# App Packaging, Installation, and Upgrade

## Overview

After development is complete, DejaOS apps need to be packaged and deployed to target devices. Taking DW200 as an example, the typical process is as follows:

1.  Purchase a small number of development devices for debugging and complete JavaScript app development.
2.  Package the app.
3.  Install or upgrade the packaged app to multiple production devices.

---

## App Packaging

You can package with one click through the DejaOS plugin in VSCode, generating `.dpk` files:

![App Packaging](/img/app_dpk.png)

---

## App Installation

### Solution 1: Use Standard Product Apps with Built-in Upgrade Capability

Purchase production devices (default official standard apps pre-installed), then use the following features for remote upgrades:

- **By Standard Product Type**:
  - Access control standard products support MQTT upgrades.
- **By Device Capability**:
  - QR code scanning devices support scan-to-upgrade (e.g., scanning a QR code containing an upgrade link).
  - _Note: QR code access control devices will have dual upgrade capabilities (QR code scanning + MQTT)._

### Solution 2: Official Production Pre-installed Apps

Provide the completed `.dpk` app package to DejaOS official. The official will assign a version ID (e.g., `vf205_v12_dejaxxx_2.0.0`) and pre-install it on devices during factory production. This solution is suitable for large-scale deployments.

> **Note**: The official only ensures the app can start and does not perform detailed business logic testing by default. Additional customization fees may apply.

### Solution 3: Manual Installation

- **DejaOS 2.1.0+**: Use Device Manager Mode, please refer to [Manager App Doc](./managerapp.md). Suitable for small batch or multiple iteration project scenarios.
- **DejaOS 2.0.0**: Use RS485 + [dejaos_tools](https://github.com/DejaOS/DejaOS/blob/main/tools/tools.zip) to install `.dpk` app packages. Suitable for small batch or multiple iteration project scenarios.

---

## App OTA Upgrade

App upgrades are implemented by the app itself, offering high flexibility and customization capabilities.

### Basic Principle of OTA Upgrade

1.  Deploy the `.dpk` file to a Web service and calculate the MD5 value of the file (for integrity verification).
2.  Push the HTTP URL corresponding to the `.dpk` file to the device (usually notifying the device via QR code or network message).
3.  The device downloads the `.dpk` file based on the URL and places it in a specific system directory.
4.  After the device restarts, the system will automatically detect and install the `.dpk` file, overwriting the old version.

### Implementation Suggestions

It is recommended to use the built-in `dxOta` component in the app to add upgrade logic. `dxOta` encapsulates the above download and installation process; you only need to prepare the `.dpk` file and deploy the service.

- `dxOta.updateHttp`: Download and upgrade via HTTP URL.
- `dxOta.updateFile`: Upgrade directly via local file path.

### References

- **GitHub Example Code**: [dw200 App QR Code Upgrade Example](https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_update_new)
- **GitHub Example Code**: [dw200 App Network Batch Upgrade Example](https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_base_upgrade)
- **OTA Detailed Description**: Please refer to [OTA Best Practice](../bestpractice/ota.md).
