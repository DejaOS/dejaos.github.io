# App Packaging, Installation, and Upgrade

## Overview

After development is complete, dejaOS apps need to be packaged and deployed to target devices. Taking DW200 as an example, the typical process is as follows:

1. Purchase a small number of development devices for debugging and complete JavaScript app development;
2. Package the app;
3. Install or upgrade the packaged app to multiple production devices.

dejaOS currently has two main versions: DejaOS1.0 and DejaOS2.0, which differ in packaging, installation, and upgrade methods. The following content will explain them separately.

> **How to check DejaOS version?**
>
> - Use the `dejaos_configuation tools` to connect to the device. If connection is successful and information can be queried, it's DejaOS2.0. If connection fails or there's no response, it's DejaOS1.0.

---

## DejaOS 2.0

### app Packaging

You can package with one click through the DejaOS plugin in VSCode, generating `.dpk` files:

![app Packaging Diagram](/img/app_dpk.png)

---

### app Installation

DejaOS2.0 provides native app installation support, usable for both development and production devices:

- Use RS485 to USB + dejaos_tools for installation
- Click to download tools: [tools.zip](https://github.com/DejaOS/DejaOS/blob/main/tools/tools.zip)
- Basic interface as follows:
![Configuration Tool](/img/app_install2.png)
---

### app Upgrade

app upgrades are implemented by the app itself, suitable for devices with existing apps, providing flexibility and customization.

It's recommended to add upgrade logic in the app using the built-in dxOta component. You can refer to:

- dxOta.updateHttp: Download and upgrade via HTTP
- dxOta.updateFile: Upgrade via local file path

For more references:  
GitHub example: [dw200 app upgrade sample](https://github.com/DejaOS/DejaOS/tree/main/demos/dw200/dw200_update_new)

---

### Differences Between Installation and Upgrade

| Comparison Item | app Installation                                                 | app Upgrade                                              |
| --------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------- |
| Trigger Method  | System capability, suitable for first installation or exception recovery | Implemented by app itself, suitable for running devices  |
| Implementation  | No code writing required                                                 | app needs to integrate upgrade logic and call interfaces |
| Package Format  | `.dpk`                                                                   | `.dpk`                                                           |

---

### Several Solutions for Development to Production Devices

#### ✅ Solution 1: Use Standard Product apps with Built-in Upgrade Capability

Purchase production devices (with official standard apps pre-installed by default), then use the following features for remote upgrades:

- By standard product type:
  - Access control standard products support MQTT upgrades
- By device capability:
  - QR code scanning devices support scan-to-upgrade (such as scanning QR codes containing upgrade links)

QR code access control devices will have dual upgrade capabilities: QR code scanning + MQTT.

#### ✅ Solution 2: Official Pre-installed apps

Provide the completed `.dpk` app package to DejaOS official. The official will assign a version ID (e.g., `vf205_v12_dejaxxx_2.0.0`) and pre-install it on devices during factory production.

> Note: The official only ensures the app can start, and does not perform detailed business logic testing by default.

#### ✅ Solution 3: Manual Installation

Use RS485 + dejaos_tools to install `.dpk` app packages, suitable for small batch or multiple iteration project scenarios.

#### 🔜 Solution 4: Batch Installation Tools (Coming Soon)

The planned new version of dejaos_tools will support batch device installation, currently in development phase with specific release date to be determined.

![Production Deployment Comparison](/img/app_prod_en.png)

> It's recommended to choose appropriate methods based on project scale and scenarios. For special requirements, contact the official support team for customization.

---

## DejaOS 1.0

### app Packaging

Does not support one-click packaging via plugin. You need to manually package `dxmodules/`, `src/`, and other directories in the project into `.zip` files:

![DejaOS1.0 Packaging Structure](/img/app_zip1.png)

---

### app Installation

DejaOS1.0 **does not support system installation mechanisms** and can only implement upgrades through app logic.

---

### app Upgrade

DejaOS1.0 supports two upgrade methods:

- Download the zip upgrade package to `/ota/download.zip`, and call the upgrade method during app runtime to trigger decompression and installation
- Or place the upgrade package in `/app/data/upgrades/APP_1_0.zip`, and it will automatically decompress and upgrade after device restart

---

> **Important Notes:**
>
> - DejaOS1.0 is no longer recommended for use. It's suggested that existing users contact the official team to upgrade to DejaOS2.0 as soon as possible for better development experience and long-term technical support.

---

## Summary Comparison

| Feature              | DejaOS1.0                             | DejaOS2.0                                               |
| -------------------- | ------------------------------------- | ------------------------------------------------------- |
| Package Format       | `.zip`                                | `.dpk`                                                  |
| Installation Support | No system installation support        | Supports system-level installation                      |
| Upgrade Method       | Implemented through app logic | Supports system installation + app self-upgrade |
| Recommended Use      | ❌ (Gradually discontinuing support)  | ✅ Recommended for use                                  |

---

For further information on advanced features such as automatic deployment scripts, device registration, upgrade rollback mechanisms, etc., please contact the DejaOS official team.
