# dxNetwork

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used for managing device network connections, supporting Ethernet, WiFi, and 4G mobile networks. It provides network initialization, connection management, status querying, WiFi scanning, and other functions, supporting multi-threaded usage.

Main features include:

- Network module initialization and deinitialization
- Ethernet/WiFi/4G network connection management
- Network status monitoring and querying
- WiFi hotspot scanning
- Network event callback processing
- Support for DHCP and static IP configuration

> Note
>
> - IoT devices have limited resources and typically only run one application at a time without independent operating system applications, so developers need to explicitly manage networks in their own applications
> - Not all devices support all three network types, but regardless of device type, only one network mode can be supported at any given time, and automatic network switching is not supported - manual explicit switching is required

## 2. Files

- dxNetwork.js
- libvbar-m-dxnetwork.so

> - Ensure these 2 files are included in the dxmodules subdirectory under the project root directory
> - JS files are unified across different devices, while .so files are device-specific

## 3. Dependencies

- None

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+ that support networking.

## 5. Usage

### Initialization

```javascript
// Initialize network module
dxnetwork.init();

// Deinitialize network module
dxnetwork.deinit();
```

### Network Connection

#### Ethernet Connection

```javascript
// Connect to Ethernet with DHCP mode
dxnetwork.connectEthWithDHCP();

// Connect to Ethernet with static IP mode
dxnetwork.connectEth({
  ip: "192.168.1.100",
  gateway: "192.168.1.1",
  netmask: "255.255.255.0",
  dns: "8.8.8.8",
});
```

#### WiFi Connection

```javascript
// Connect to WiFi with DHCP mode
dxnetwork.connectWifiWithDHCP("MyWiFi", "MyPassword");

// Connect to WiFi with static IP mode
dxnetwork.connectWifi("MyWiFi", "MyPassword", {
  ip: "192.168.1.101",
  gateway: "192.168.1.1",
  netmask: "255.255.255.0",
  dns: "8.8.8.8",
});
```

#### 4G Connection

```javascript
// Connect to 4G mobile network
dxnetwork.connect4G();
```

#### Universal Connection Method

```javascript
// Use universal connect method
dxnetwork.connect({
  netType: 2, // 2 = WiFi
  ipMode: 0, // 0 = DHCP, 1 = Static
  ssid: "MyWiFi",
  psk: "MyPassword",
});
```

### Network Status Query

```javascript
// Get network status
let status = dxnetwork.getStatus();

// Get network type
let type = dxnetwork.getType();

// Check if connected
let connected = dxnetwork.isConnected();

// Get network parameters (IP, gateway, netmask, DNS)
let params = dxnetwork.getNetParam();

// Get signal strength (RSSI)
let rssi = dxnetwork.getRSSI();
```

### WiFi Scanning

```javascript
// Scan WiFi hotspots
let hotspots = dxnetwork.scanWifi(2500, 100); // 2500ms timeout, 100ms interval
logger.info("Found hotspots:", hotspots);
// Return format:
// [
//   {
//     ssid: "WiFi Name",
//     bssid: "MAC Address",
//     flags: "Encryption Type",
//     freq: 2412,
//     level: -45
//   }
// ]
```

### Event Handling

```javascript
// Set event callbacks
dxnetwork.setCallbacks({
  onStatusChange: function (netType, status) {
    logger.info("Network status changed:", netType, status);
    // netType: 1=Ethernet, 2=WiFi, 4=4G
    // status: network status code, 4 means network is fully connected
  },
});

// Process events periodically (must be called in a loop)
setInterval(() => {
  try {
    dxnetwork.loop();
  } catch (e) {
    logger.error("Error in network loop:", e);
  }
}, 50); // Process events every 50ms
```

### Disconnect

```javascript
// Disconnect current network connection
dxnetwork.disconnect();
```

## 6. Constant Definitions

### Network Types

```javascript
dxnetwork.NET_TYPE = {
  ETH: 1, // Ethernet
  WIFI: 2, // WiFi
  MODEM: 4, // 4G Mobile Network
};
```

### IP Modes

```javascript
dxnetwork.IP_MODE = {
  DHCP: 0, // Dynamic IP
  STATIC: 1, // Static IP
};
```

## 7. Multi-threading Support

- Supports multi-threaded usage, but `setCallbacks` and `loop` functions must be called in the same thread
- Network events are safely passed between threads through queue mechanism
- All network operations have thread safety protection

## 8. Important Notes

1. Must call `init()` first to initialize the network module
2. Event callbacks must be set in the same thread that calls `loop()`
3. WiFi scanning requires WiFi module to be initialized (can pass empty ssid and pwd)
4. 4G connection requires a valid SIM card to be inserted
5. Static IP configuration needs to ensure IP address doesn't conflict

## 9. Related modules

This module is the new version of the `dxNet` module, which is gradually being deprecated
This module is the foundation for network management and is typically used with the following modules:

- dxHttpServer: Provides HTTP services
- dxMqttClient: MQTT message communication
- dxHttpClient: HTTP requests
- ......

## 10. Examples

![Example Screenshot](https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_test_network/screenshot.png)
[Source Code](https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_test_network)
