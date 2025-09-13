# dxMqttClient

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used for MQTT client functionality based on the Eclipse Paho MQTT C library.
It provides a singleton interface to an MQTT client with comprehensive features:

- Connect/disconnect to MQTT brokers
- Publish messages and subscribe to topics
- Support for MQTTS (MQTT over SSL/TLS)
- Handle connection loss and message delivery callbacks
- Not support cross-thread MQTT operations support

## 2. Files

- dxMqttClient.js
- libvbar-m-dxmqttclient.so

> - Ensure these 2 files are included in the dxmodules subdirectory under your project root directory

## 3. Dependencies

- dxLogger

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+. Device must have network connectivity support.

## 5. Usage

### Basic Usage

```javascript
import mqtt from "../dxmodules/dxMqttClient.js";

// Initialize the MQTT client
mqtt.init("tcp://test.mosquitto.org:1883", "my-device-123");

// Set up callback handlers
mqtt.setCallbacks({
  onConnectSuccess: () => {
    logger.info("Connected to MQTT broker");
    // Subscribe to topics
    mqtt.subscribe("commands/light", { qos: 1 });
  },
  onMessage: (topic, payload, qos, retained) => {
    logger.info(`Message received: ${topic} = ${payload}`);
  },
  onConnectionLost: (reason) => {
    logger.info("Connection lost:", reason);
  },
});

// Connect to the broker
mqtt.connect({
  username: "user",
  password: "password",
  keepAlive: 60,
  cleanSession: true,
});

// Publish messages
mqtt.publish("device/status", "online", { qos: 1, retained: true });

// Process events in your main loop
setInterval(() => {
  mqtt.loop();
}, 50);

// Disconnect when done
mqtt.disconnect();
```

## 6. API Reference

### `mqtt.init(serverURI, clientId)`

Initializes the MQTT client. Must be called once before any other operation.

**Parameters:**

- `serverURI` (string): The URI of the MQTT broker. Examples: "tcp://localhost:1883", "ssl://test.mosquitto.org:8883"
- `clientId` (string): A unique identifier for this client

**Supported Protocols:**

- `tcp://` - Standard MQTT over TCP
- `ssl://` - MQTT over SSL/TLS
- `mqtt://` - Standard MQTT over TCP
- `mqtts://` - MQTT over SSL/TLS

**Returns:** `void`

**Throws:** `Error` if initialization fails or parameters are invalid

### `mqtt.connect(options)`

Connects the client to the MQTT broker.

**Parameters:**

- `options` (object, optional): Connection options
  - `username` (string, optional): Username for authentication
  - `password` (string, optional): Password for authentication
  - `keepAlive` (number, optional): Keep-alive interval in seconds (default: 60)
  - `cleanSession` (boolean, optional): Whether to establish a clean session (default: true)
  - `will` (object, optional): Last will and testament message
    - `topic` (string, required): Topic for the will message
    - `payload` (string, optional): Payload of the will message
    - `qos` (number, optional): QoS level for the will message (default: 0)
    - `retained` (boolean, optional): Whether the will message should be retained (default: false)
  - `ssl` (object, optional): SSL/TLS options for secure connections
    - `caFile` (string, optional): Path to CA certificate file
    - `certFile` (string, optional): Path to client certificate file
    - `keyFile` (string, optional): Path to client private key file
    - `keyPassword` (string, optional): Password for client private key
    - `enableServerCertAuth` (boolean, optional): Enable server certificate authentication

**Returns:** `void`

**Throws:** `Error` if client not initialized or options are invalid

### `mqtt.disconnect(timeout)`

Disconnects the client from the MQTT broker.

**Parameters:**

- `timeout` (number, optional): Timeout in milliseconds to wait for disconnection (default: 1000)

**Returns:** `void`

**Throws:** `Error` if client not initialized or timeout is invalid

### `mqtt.publish(topic, payload, options)`

Publishes a message to a topic.

**Parameters:**

- `topic` (string): The topic to publish the message to
- `payload` (string|ArrayBuffer): The message payload
- `options` (object, optional): Publishing options
  - `qos` (number, optional): Quality of Service level (0, 1, or 2, default: 0)
  - `retained` (boolean, optional): Whether the message should be retained by the broker (default: false)

**Returns:** `number` - The delivery token for tracking message delivery (for QoS > 0)

**Throws:** `Error` if client not initialized, topic is invalid, or payload is invalid

### `mqtt.subscribe(topic, options)`

Subscribes to a topic.

**Parameters:**

- `topic` (string): The topic filter to subscribe to
- `options` (object, optional): Subscription options
  - `qos` (number, optional): The maximum QoS level at which to receive messages (default: 0)

**Returns:** `void`

**Throws:** `Error` if client not initialized or topic is invalid

### `mqtt.unsubscribe(topic)`

Unsubscribes from a topic.

**Parameters:**

- `topic` (string): The topic filter to unsubscribe from

**Returns:** `void`

**Throws:** `Error` if client not initialized or topic is invalid

### `mqtt.setCallbacks(callbacks)`

Sets the callback handlers for MQTT events.

**Parameters:**

- `callbacks` (object): An object containing the callback functions
  - `onConnectSuccess` (function, optional): Fired when the client successfully connects to the broker
  - `onMessage` (function, optional): Fired when a message is received
    - Parameters: `(topic, payload, qos, retained)`
  - `onDelivery` (function, optional): Fired when a published message has been delivered (for QoS > 0)
    - Parameters: `(token)`
  - `onConnectionLost` (function, optional): Fired when the connection to the broker is lost
    - Parameters: `(reason)`

**Returns:** `void`

**Throws:** `Error` if client not initialized or callbacks are invalid

### `mqtt.loop()`

Processes events from the MQTT event queue. This should be called periodically to handle message arrivals, delivery confirmations, and connection loss events.

**Returns:** `void`

**Throws:** `Error` if client not initialized

**Note:** It's recommended to call this function with `setInterval` in your main application loop.

### `mqtt.isConnected()`

Checks if the client is currently connected to the broker.

**Returns:** `boolean` - `true` if connected, `false` otherwise

**Throws:** `Error` if client not initialized

### `mqtt.deinit()`

Deinitializes the client instance, allowing for re-initialization.

**Returns:** `void`

**Note:** This function sets the internal client to null, allowing the garbage collector to reclaim resources. The C++ finalizer handles disconnection and resource cleanup.

### `mqtt.getNative()`

Gets the native client object.

**Returns:** `Object|null` - The native client object, or null if not initialized

## 7. Related Modules

- **dxMqtt:** Deprecated,Replaced by dxMqttClient

## 8. Example

### Complete MQTT Client Application

```javascript
const url = "tcp://192.168.50.36:1883";
net.init();
mqttclient.init(url, "my-device-12345");

net.connectWifiWithDHCP("xxxx", "xxxxxx");
mqttclient.setCallbacks({
  onConnectSuccess: () => {
    logger.info("MQTT connected");
    mqttclient.subscribe("testmqttclient/test1", { qos: 1 });
    mqttclient.subscribe("testmqttclient/test2");
  },
  onMessage: (topic, message, qos, retained) => {
    logger.info(`MQTT message received: topic=${topic}, message=${message}`);
  },
  onDelivery: (messageId) => {
    logger.info(`MQTT message delivered: messageId=${messageId}`);
  },
  onConnectionLost: (reason) => {
    logger.info(`MQTT connection lost: reason=${reason}`);
    autoconnect();
  },
});
function autoconnect() {
  std.setTimeout(() => {
    connectMqtt();
  }, 5000);
}
autoconnect();
function connectMqtt() {
  try {
    mqttclient.connect();
  } catch (e) {
    logger.error(`MQTT connect error:`, e);
    std.setTimeout(() => {
      connectMqtt();
    }, 5000);
  }
}
bus.on("mqtt_publish", (data) => {
  logger.info(`MQTT publish: topic=${data.topic}, payload=${data.payload}`);
  mqttclient.publish(data.topic, data.payload, { qos: 1 });
});
std.setInterval(() => {
  try {
    net.loop();
    mqttclient.loop();
  } catch (e) {
    logger.error(`loop error: ${e}`);
  }
}, 100);
```

[Source Code](https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_test_mqttclient)
