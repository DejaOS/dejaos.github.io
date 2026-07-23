# System Management App

## Overview

The System Manager App is a special application in the dejaOS system used for performing low-level maintenance tasks. It is primarily used for application installation, system information queries, and switching system operating modes.

As system versions have evolved, the System Manager App has upgraded from an interface-less PC tool management mode to an interface-based device-side management mode. The current recommended release is **2.1.5**, which builds on **2.1.0** with several UX improvements, a clearer exit experience, passive entry under crash protection, and application runtime log download for production devices.

## 1. New Version (2.1.0+): Device-Side Management Mode

The new version provides a visualized System Manager App, supporting management and configuration directly on the device screen, as well as remote management via a local network.

<iframe
  width="315"
  height="560"
  src="https://www.youtube.com/embed/htXnU668ifs"
  title="System Manager App Demo"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>

### 1.1 How to Enter

When the device starts up, a solid gray / transition background is displayed for a short window (about 2 seconds). During this period, **long-press anywhere on the screen** to enter the System Manager App. **Start long-pressing only after you see that background, not as soon as the device powers on.**

Detailed steps:

**Step 1: Power on and wait for the startup screen**

After power-on, the screen first shows the startup view with “Starting up…”.

<img src="/img/sysapp_v215_boot.jpg" alt="Startup screen" width="50%" />

**Step 2: Wait for the transition (gray) screen, then long-press in time**

After a few seconds the device enters the transition / gray screen. You **must long-press the screen here** to enter System Manager. If you wait too long without long-pressing, reboot the device and try again.

<img src="/img/sysapp_v215_entry.jpg" alt="Transition screen — long-press here" width="50%" />

**Step 3: Enter the administrator password**

On the DejaOS Manager password page, enter the administrator password (default `314159`) and tap **CONFIRM**. You can change this password later in system configuration.

<img src="/img/sysapp_v215_password.jpg" alt="Password page" width="50%" />

**Step 4: Open the main menu and connect to the network**

On the DejaOS Manager main menu, plug in the Ethernet cable (or connect Wi-Fi), complete the corresponding network settings, tap the **Connect** button, wait about half a minute for the connection to finish, then return to the home page. The bottom of the screen shows the device address, for example:

```
The web portal is now available at: http://192.168.10.113:8080
```

Note the device IP (use the value shown on your device). You can then use on-device menus or open the Web console from a PC on the same LAN.

<img src="/img/sysapp_v215_main.jpg" alt="DejaOS Manager main menu with web portal URL" width="50%" />

### 1.2 Main Function Interface

The main interface includes four core functional modules:

1.  **Network Config**: Configure Wi-Fi or Ethernet connections.
2.  **Sys Info**: View basic information such as DejaOS system versions and installed application version/size.
3.  **System Config**: Change the system password and switch system operating modes (refer to [System Mode](./mode.md)).
4.  **Install App**: Support installing DPK application packages via network download or local import.

![Main Interface](/img/sysapp_main.png)

### 1.3 System Configuration & Mode Switching

In the system configuration page, you can intuitively modify the system operating mode (Development, Production, Test; see [System Mode](./mode.md)) and change the administrator password.

![System Configuration](/img/sysapp_config.png)

### 1.4 Remote Web Management

In addition to operating on the device screen, the System Manager App also has a built-in Web server. You can connect your computer and the device to the same local network, access the device's IP address via a computer browser, and enter the Web console for remote management. This method is more flexible and simple.

![Web Management Interface](/img/sysapp_web.png)

Through the Web management page, you can also upgrade and install application packages, change the operating mode, and perform other operations.

### 1.5 Version 2.1.5 Enhancements

**2.1.5** is based on **2.1.0**. It keeps the same entry flow, password, and core modules, and adds the improvements below.

#### Clearer UI when exiting an app

Previously, after an application exited, the screen often kept showing the **last page** of that app, so users sometimes thought it was still running.

In 2.1.5, exiting an app switches to a clear status page (for example, the production-mode hint page), so it is obvious that the previous application has stopped.

<img src="/img/sysapp_v215_prod_timeout.jpg" alt="Clear UI after exiting an app" width="50%" />

#### Passive entry (watchdog circuit breaker)

In addition to the normal **long-press on the gray screen** entry, 2.1.5 supports **passive entry**:

If the main application repeatedly crashes because of unexpected bugs or bad configuration, and the watchdog detects **6 consecutive restarts** without a successful run, the system triggers **circuit-breaker protection**. The device then **stops trying to launch the main app**, safely falls back, and **stays permanently in System Manager mode**.

This keeps the device reachable in extreme failures so technicians can enter System Manager, collect logs, and diagnose the issue.

#### Application runtime log download

In **development** mode, runtime logs can be viewed in real time in VS Code. In **production**, live logs are hard to access. Starting with **2.1.5**, you can download application runtime logs from the Web console while in System Manager.

First enter System Manager as described in [1.1 How to Enter](#11-how-to-enter) and note the device IP shown on the main menu. Then:

**Step 1: Open the Web console on a PC**

1. Make sure the PC and the device are on the same LAN.
2. In a browser, open `http://<device-IP>:8080` (default port **8080**).
3. In the left menu, select **Maintenance & Logs**.
4. Click **Download All Logs (.tar.gz)** to download the logs.

<img src="/img/sysapp_v215_web_logs.png" alt="Web console — Download All Logs" width="50%" />

**Step 2: Confirm the download**

You get `device_log.tar.gz`. After extraction it usually contains `dejaos.log`.

<img src="/img/sysapp_v215_log_archive.png" alt="Downloaded archive example" width="50%" />

If you need logs in a more real-time way, you can upload the log file from your own application to your server using networking modules such as `dxHttpClient`. The log file path is `/data/var/log/dejaos.log`.

## 2. Old Version (2.0.0): PC Tool Management Mode

In older versions of the dejaOS system, system management functionality is implemented through a special state known as **Safe Mode**. This mode is similar to the BIOS mode of a PC, where the device itself does not provide a graphical interface and relies on [PC-side tools](https://github.com/DejaOS/DejaOS/blob/main/tools/tools.zip) for operations.

### 2.1 How to Enter

When the device starts up, there is a 2-second delay window. During this period, you can enter this mode by connecting to PC tools via a serial cable.

### 2.2 Main Functions

- **Install DPK Applications**: This is the core function, used to install packaged applications onto the device.
- **Switch System Modes**: Tools can be used to switch the device to Development, Production, or Test mode.
- **Get System Information**: You can view basic information such as system version, hardware details, and installed applications.

![Application Installation](/img/app_install2.png)

### 2.3 Limitations

- Requires extra hardware connection (Serial-to-USB cable).
- Slower data transfer rates (limited by serial baud rate), making application installations time-consuming.
