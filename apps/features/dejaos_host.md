# DejaOS Host Demo

DejaOS Host Demo is a lightweight, visual host application for DejaOS devices. It presents an app-launcher experience similar to a simplified mobile operating system: the device can configure its network and backend service, discover micro apps, install or remove them at runtime, and launch them from the home screen without restarting the Host application.

:::info Built with Codex and the DejaOS Skill
The entire demo—including the device application, micro-app runtime, Node.js backend, browser management UI, sample micro apps, and supporting documentation—was implemented with **Codex** together with the DejaOS [`dejaos-app-dev-sdk2-0` Skill](https://github.com/DejaOS/DejaOS/tree/main/skills/dejaos-app-dev-sdk2-0).

The Skill supplied DejaOS SDK 2.0 development guidance for worker boundaries, `dxUi`, `dxEventBus`, `dxHttpClient`, runtime resources, and embedded-device constraints, while Codex applied that guidance to build and validate the complete workflow.
:::

## Demo Screenshots

### Device Host and App Management

| Home Screen | Apps Available from the Server |
| :---: | :---: |
| ![DejaOS Host home screen](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/home_20260111_015015_01.png) | ![Available micro apps](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/app_manager_20260111_015052_02.png) |

| Installed Apps on the Home Screen | Installed App Management |
| :---: | :---: |
| ![Installed apps on the Host home screen](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/home_20260111_015117_04.png) | ![Installed micro-app list](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/app_manager_20260111_015108_03.png) |

### Network Configuration

| Ethernet | Wi-Fi |
| :---: | :---: |
| ![Ethernet configuration](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/network_20260111_015127_05.png) | ![Wi-Fi configuration](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/network_20260111_015133_06.png) |

Both Ethernet and Wi-Fi support DHCP and static IP settings. Static configuration includes IP address, subnet mask, gateway, and DNS.

### Runtime Micro Apps

| HTTP Weather | Quick Notes | Calendar |
| :---: | :---: | :---: |
| ![HTTP Weather micro app](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/micro_app_host_20260111_020759_07.png) | ![Notes micro app](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/micro_app_host_20260111_020813_08.png) | ![Calendar micro app](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/micro_app_host_20260111_020826_10.png) |

### Browser Management and Online Development

![DejaOS Host micro-app management page](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/website.png)

The management page creates and publishes micro apps, tracks draft and published versions, and provides package downloads.

![Online micro-app code editor](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/dejaos_host/screenshot/editcode.png)

The prototype editor supports `app.js`, `manifest.json`, app metadata, visibility, version management, and custom 40×40 PNG icons.

Browse every device and management screenshot in the [screenshot directory](https://github.com/DejaOS/DejaOS/tree/main/apps/features/dejaos_host/screenshot).

## End-to-End Workflow

1. Create a micro app in the browser management UI.
2. Edit its JavaScript, manifest, metadata, and icon, then publish a version.
3. Configure the App Service address on the DejaOS Host device.
4. The device obtains the published catalog through `dxHttpClient`.
5. Select **Install** to download the package into `/app/data/dejaos_host/apps/`.
6. The Host loads the entry script dynamically with `dxStd.loadScript`; no static `import` or Host restart is required.
7. Open the new icon from the home screen. Remove it from App Manager or by pressing and holding its home-screen icon.

This validates the complete prototype path from online development and publication to device download, dynamic loading, execution, and removal.

## Main Features

- **Host-style launcher**: A 480×854 device home screen with system tools and dynamically installed micro-app icons.
- **Network setup**: Ethernet and Wi-Fi, with DHCP or static IP configuration and a connection timeout flow.
- **App Service configuration**: Configure the backend by IP address, domain name, port, or complete URL.
- **Runtime installation and removal**: Install, load, unload, and remove micro apps without restarting the device or Host application.
- **Custom app icons**: Upload any PNG in the management UI and crop/resize it to the required 40×40 format.
- **Online development**: Edit application code and metadata, save drafts, publish versions, and download packages.
- **Sample micro apps**: Live weather through the backend's Open-Meteo proxy, local notes, and calendar views.
- **Time synchronization**: Update the device status-bar time through the backend time API after networking succeeds.
- **Screenshot upload**: Double-tap the blank center of a page's status bar to capture the screen and upload the PNG to the backend.

## Architecture

The demo contains three cooperating parts:

- **Device application (`app/`)**: A DejaOS SDK 2.0 project. The main worker starts a dedicated UI worker and network worker. Pages are managed by `UIManager`; cross-worker messages use `dxEventBus`.
- **Management UI (`web/`)**: A framework-free HTML, CSS, and JavaScript application for creating, editing, publishing, and downloading micro apps.
- **Backend (`webapi/`)**: A Node.js 20+ service using built-in modules only. It serves the management UI, app catalog and packages, time and weather APIs, and screenshot uploads.

### Important Device Files

- `app/src/main.js`: Starts the Host workers.
- `app/src/uiWorker.js`: Initializes `dxUi`, page routing, overlays, and the UI event loop.
- `app/src/networkWorker.js`: Owns device networking, HTTP catalog/package operations, time sync, micro-app service requests, and screenshot uploads.
- `app/src/UIManager.js`: Manages the single-screen page stack and shared fonts.
- `app/src/services/MicroAppLoader.js`: Loads and unloads installed micro-app scripts dynamically.
- `app/src/services/AppRegistry.js`: Maintains remote and installed app metadata.
- `app/src/pages/`: Home, settings, network, App Service, App Manager, and micro-app host pages.

## Source Code

The complete source code is available here: [DejaOS repository · `apps/features/dejaos_host`](https://github.com/DejaOS/DejaOS/tree/main/apps/features/dejaos_host)

The DejaOS development Skill used to build the entire demo is available here: [DejaOS repository · `skills/dejaos-app-dev-sdk2-0`](https://github.com/DejaOS/DejaOS/tree/main/skills/dejaos-app-dev-sdk2-0)

## Running the Prototype

1. Start the backend from `webapi/` with `npm start` (Node.js 20 or later).
2. Open `http://localhost:8080/` to access the management UI.
3. Deploy the `app/` project to a compatible DejaOS SDK 2.0 device.
4. Configure network access and set the device's App Service address to the backend URL.
5. Publish a micro app in the browser, refresh the device catalog, and install it.

---

**Prototype note**: This demo focuses on validating the complete development-to-device workflow. Production authentication, device ownership, package signing, application isolation, debugging, and a formal micro-app SDK are intentionally outside its current scope.
