# dxTcp

## 1. Overview

This module family is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS). It provides **TCP socket** functionality through two singleton-style JavaScript modules—**dxTcpClient** and **dxTcpServer**—built on the native TCP C library and exposed via `libvbar-m-dxTcp.so`.

Main features include:

**dxTcpClient**

- Initialize/deinitialize the TCP client
- Connect to and disconnect from a remote server (`host`, `port`)
- Send string or binary (`ArrayBuffer`) data
- Query connection state and remote address
- Event-driven model: connect, disconnect, received data, errors
- Event processing through a periodic `loop()` call

**dxTcpServer**

- Initialize/deinitialize the TCP server
- Listen on a port, accept multiple concurrent clients
- Send string or binary data to a specific client or broadcast to all
- Forcibly disconnect a client
- Query listen state, client count, and client list
- Event-driven model: listening, new client, disconnect, data, errors
- Event processing through a periodic `loop()` call

> Note
>
> - Both modules are **singletons** in script usage (one native client / one native server instance per process as wrapped).
> - `send` / `sendBuffer` may **throw** when not connected (client) or when used in invalid states; guard with `try/catch` in production code.
> - Applications usually need **dxNetwork** (or equivalent) to bring up IP connectivity before a client can reach a remote host or before a server is reachable on the LAN.

## 2. Files

- dxTcpClient.js
- dxTcpServer.js
- libvbar-m-dxTcp.so

> - Ensure these files are included in the `dxmodules` subdirectory under the project root directory.
> - JS files are unified across different devices, while `.so` files are device-specific.

## 3. Dependencies

- None

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+ that support networking.

## 5. Usage

### Import

```javascript
import dxTcpClient from "../dxmodules/dxTcpClient.js";
import dxTcpServer from "../dxmodules/dxTcpServer.js";
```

### dxTcpClient — lifecycle

```javascript
// Initialize once; returns true on first success, false if already initialized
const ok = dxTcpClient.init();

// Deinitialize and release resources
dxTcpClient.deinit();
```

### dxTcpClient — connect and send

```javascript
// Connect to a remote server (CONNECTED event is delivered via loop())
dxTcpClient.connect("192.168.1.100", 8080);

// Send UTF-8 string (returns byte count; throws if not connected)
let n = dxTcpClient.send("hello");

// Send binary
const buf = new Uint8Array([0x01, 0x02, 0x03]).buffer;
n = dxTcpClient.sendBuffer(buf);

// Disconnect (DISCONNECTED event is processed in loop())
dxTcpClient.disconnect();
```

### dxTcpClient — query state

```javascript
if (dxTcpClient.isConnected()) {
  dxTcpClient.send("ping");
}

const addr = dxTcpClient.getRemoteAddress();
// { ip: string, port: number } or null if not connected
```

### dxTcpClient — callbacks and event loop

```javascript
dxTcpClient.setCallbacks({
  onConnected: () => {
    logger.info("TCP client connected");
  },
  onDisconnected: () => {
    logger.info("TCP client disconnected");
  },
  onData: (ev) => {
    // ev: { data, dataLen }
    logger.info("recv:", ev.data);
  },
  onError: (ev) => {
    // ev: { errCode, errMsg }
    logger.error("TCP client error:", ev.errMsg);
  },
});

// Must be called periodically (same thread as setCallbacks)
setInterval(() => {
  try {
    dxTcpClient.loop();
  } catch (e) {
    logger.error("TCP client loop error:", e);
  }
}, 50);
```

### dxTcpServer — lifecycle

```javascript
const ok = dxTcpServer.init();

// Start listening; LISTENING event is delivered via loop()
dxTcpServer.listen(8881);

// Stop accepting new connections (existing clients are not closed)
dxTcpServer.stop();

dxTcpServer.deinit();
```

### dxTcpServer — send and clients

```javascript
dxTcpServer.setCallbacks({
  onListening: () => logger.info("server listening"),
  onConnect: (ev) => {
    // ev: { clientId, ip, port }
    logger.info(`client ${ev.clientId} from ${ev.ip}:${ev.port}`);
  },
  onDisconnect: (ev) => {
    // ev: { clientId }
    logger.info("client disconnected", ev.clientId);
  },
  onData: (ev) => {
    // ev: { clientId, data, dataLen }
    dxTcpServer.send(ev.clientId, "echo:" + ev.data);
  },
  onError: (ev) => {
    // ev: { clientId, errCode, errMsg }
    logger.error("server error:", ev.errMsg);
  },
});

setInterval(() => {
  try {
    dxTcpServer.loop();
  } catch (e) {
    logger.error("TCP server loop error:", e);
  }
}, 50);

// Per-client string / binary send
dxTcpServer.send(clientId, "hello client");
dxTcpServer.sendBuffer(clientId, new Uint8Array([0xaa, 0xbb]).buffer);

// Broadcast string to all connected clients
dxTcpServer.broadcast("system: notify all");

// Force disconnect one client
dxTcpServer.disconnect(clientId);

// Introspection
const listening = dxTcpServer.isListening();
const count = dxTcpServer.getClientCount();
const clients = dxTcpServer.getClientList();
// [{ clientId, ip, port }, ...]
```

### dxTcpClient / dxTcpServer — native handle

```javascript
const clientNative = dxTcpClient.getNative();
const serverNative = dxTcpServer.getNative();
// Advanced / debugging: underlying native class instance
```

## 6. Constant Definitions

### dxTcpClient.EVENT_TYPE

Used internally as `ev.type` for events consumed by `loop()`.

```javascript
dxTcpClient.EVENT_TYPE = {
  CONNECTED: 0,
  DISCONNECTED: 1,
  DATA: 2,
  ERROR: 3,
};
```

### dxTcpServer.EVENT_TYPE

```javascript
dxTcpServer.EVENT_TYPE = {
  LISTENING: 0,
  CONNECT: 1,
  DISCONNECT: 2,
  DATA: 3,
  ERROR: 4,
};
```

## 7. Multi-threading Support

- The modules may be instantiated for use from multiple threads at the C/native level, but **`setCallbacks` and `loop` must be used in the same thread** (same as the dxTcpClient/dxTcpServer header comments).
- Process pending events only through `loop()` so callbacks run in that thread.

## 8. Important Notes

1. Call **`init()`** before `connect()` / `listen()`; repeated `init()` returns `false` (already initialized).
2. **`loop()`** must run periodically; without it, queued connect/data/error events will not reach your callbacks.
3. **`send` / `sendBuffer`** on the client throw when not connected; wrap calls in `try/catch` where appropriate.
4. **`listen(port)`** returns `false` if the server is already listening; use **`isListening()`** to inspect state.
5. For real devices, configure **network** (e.g. **dxNetwork**) so the stack has a valid IP before relying on TCP for WAN/LAN traffic.

## 9. Related modules

- **dxNetwork**: Ethernet / WiFi / 4G management; typically required before outbound TCP or reachable listening ports on the device.
- **dxHttpClient**, **dxHttpServer**, **dxMqttClient**: higher-level protocols that also depend on a working IP configuration.

## 10. Examples and test scripts

![Example Screenshot](https://github.com/DejaOS/DejaOS/raw/main/demos/dw200_v20/dw200_test_tcp/image.png)
[Source Code](https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_test_tcp)
