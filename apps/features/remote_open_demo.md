# Remote Open Demo

This is a remote door control demo application built on DejaOS. It demonstrates how to implement device UI, network configuration, HTTP server, and relay-based door control in a multi-threaded environment. Users can log in via a web page on the local network and trigger the door to open remotely.

## Application Screenshots

| Interface          | Preview                                                                                                                                                                                                                                                   |
| :----------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Home**           | ![Home](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/features/remote_open_demo/screenshot/home.png) <br /> _Main interface showing network status, device IP, web access URL, and local open-door button._                        |
| **Network Config** | ![Network Config](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/features/remote_open_demo/screenshot/config.png) <br /> _Configure Ethernet or WiFi with DHCP; settings are persisted locally._                                    |
| **Keyboard Input** | ![Keyboard Input](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/features/remote_open_demo/screenshot/input.png) <br /> _WiFi password and other input screens._                                                                    |
| **Open Animation** | ![Open Animation](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/features/remote_open_demo/screenshot/animation.png) <br /> _Door state and animation feedback on the device UI._                                                   |
| **Web Login**      | ![Web Login](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/features/remote_open_demo/screenshot/login.png) <br /> _Access device IP:8080 in a browser; log in with credentials to open the door remotely._                         |
| **Remote Open**    | ![Remote Open](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/features/remote_open_demo/screenshot/opendoor.png) <br /> _After login, call the open-door API; relay activates and the door opens, then closes after a few seconds._ |

---

## Main Features

- **Local Open**: The main screen provides an "Open Door" button; tapping it drives the relay via GPIO to unlock the door, then automatically closes after a delay.
- **Remote Open**: The device runs an HTTP server on port 8080 with login and open-door APIs. Browsers on the same LAN can open `http://<device-IP>:8080`, log in, and trigger the door to open.
- **Network Config**: Supports Ethernet (DHCP) and WiFi (SSID/password). Configuration is saved locally and re-applied on reboot.
- **Multi-Worker Architecture**: UI, network monitoring, HTTP server, and door relay run in separate workers, sharing state via EventBus and dxMap without blocking each other.

## Project Structure

The complete source code for this example can be found here: [GitHub Source Code](https://github.com/DejaOS/DejaOS/tree/main/apps/features/remote_open_demo)

The application uses a multi-worker architecture for smooth UI and independent hardware/network handling:

- `src/main.js`: **Main entry**. Starts the UI, network, door, and HTTP workers in sequence.
- `src/uiWorker.js`: **UI worker**. Handles rendering, page navigation, and the event loop.
- `src/worker/networkWorker.js`: **Network worker**. Initializes dxNetwork, connects, polls status; writes network state and HTTP URL to dxMap; responds to `NETWORK_CONFIG_UPDATE` to apply config and reconnect.
- `src/worker/doorWorker.js`: **Door worker**. Initializes GPIO relay, listens for `DOOR_OPEN_REQUEST`, opens the door and auto-closes after a delay.
- `src/worker/httpWorker.js`: **HTTP worker**. Serves static pages and `/api/login`, `/api/open-door` on port 8080; forwards open-door requests to doorWorker via EventBus.
- `src/pages/`: `HomePage.js` (main), `NetworkConfigPage.js` (network config), `KeyboardInputPage.js` (keyboard input).
- `src/constants.js`: Global constants, dxMap shared config, and reading/writing `config.json`.
- `src/web/`: Built-in web assets (e.g. `index.html`, `admin.html`) served by the HTTP worker for login and open-door pages.

## Core Technologies

- **DejaOS UI**: `dxUi` components for the main screen, config page, and keyboard input.
- **EventBus**: Cross-worker events such as `DOOR_OPEN_REQUEST`, `NETWORK_STATUS_CHANGED`, `NETWORK_CONFIG_UPDATE`.
- **dxMap**: Shared network status, HTTP URL, and network config across workers.
- **dxNetwork**: Wired/WiFi connection and DHCP, network status polling.
- **dxHttpServer**: HTTP server, static files, login and open-door APIs.
- **dxGpio**: Relay control for opening and auto-closing the door.

## Instructions

1. Deploy the app to a DejaOS device with GPIO relay and network support.
2. On first use, open "Network Config" on the device, set Ethernet or WiFi, and save; the device will connect and show its IP.
3. The main screen shows the "Web Access" URL (e.g. `http://192.168.1.100:8080`). Open this URL in a browser on a computer or phone on the same LAN.
4. Log in on the web page with the default credentials (e.g. admin / admin123). After login, use the "Open Door" button; the relay will activate and the door will open, then close after the configured delay.
5. You can also tap "Open Door" on the device main screen for a local test.

---

> **Tip**: This example is designed for the **DW200** device with a screen resolution of **480×320**. Most layout and image resources are optimized for this resolution. While the core logic is cross-device compatible, UI adaptation is required for other resolutions.
>
> This demo uses GPIO relay, network, and HTTP server; configure the correct GPIO pin and network parameters in `dxDriver` for your device. The web login credentials are for demo only; use proper authentication in production.
