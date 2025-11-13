# dxHttpServer

## 1. Overview

This module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used to start an HTTP Web service, listen on ports, and allow clients to access the device through the HTTP protocol. It is typically used to control devices through a computer browser within a local area network, provided that the device's IP address is known.
Includes common HTTP Web service features:

- Static Web Service
- Service Listening and Startup
- Route Registration
- Supports file upload via both raw body (e.g., 'application/octet-stream') and multipart form data ('multipart/form-data').
- Supports file download
- Multi-threading **not** supported, all functions should run in a single thread. For cross-thread communication, use dxEventbus to pass data

## 2. Files

- dxHttpServer.js
- libvbar-m-dxhttpcserver.so (embedded mongoose)

> - Ensure these 2 files are included in the dxmodules subdirectory under the project root directory

## 3. Dependencies

- None

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+

## 5. API Reference

### Core Lifecycle & Server Control

- **`httpserver.init()`**: Initializes the server instance. Called automatically by other functions, so explicit calls are often unnecessary.
- **`httpserver.deinit()`**: Deinitializes the server and releases resources.
- **`httpserver.listen(port)`**: Starts the HTTP server and makes it listen for connections on the specified port.
- **`httpserver.loop()`**: Processes incoming requests and events. This function must be called periodically in a loop (e.g., `setInterval`).

### Routing

- **`httpserver.route(path, callback)`**: Registers a handler for a specific URL path.

  - `path` (String): The URL path. Supports exact matches (e.g., `'/hello'`) and wildcard matches (e.g., `'/api/*'`).
  - `callback` (Function): A function `(req, res)` that handles the request.
    - `req`: The request object.
    - `res`: The response object.

- **`httpserver.serveStatic(pathPrefix, directory)`**: Serves static files from a local directory.
  - `pathPrefix` (String): The URL prefix to map to the static directory (e.g., `/static`).
  - `directory` (String): The absolute path to the local directory containing the files (e.g., `/app/code/web`).

### Request Object (`req`)

The `req` object passed to the route callback contains:

- `req.method`: (String) The HTTP method (e.g., 'GET', 'POST').
- `req.url`: (String) The full request URL.
- `req.query`: (String) The query string part of the URL.
- `req.headers`: (Object) An object containing request headers.
- `req.body`: (String|ArrayBuffer) The request body for raw uploads.
- `req.saveFile(path)`: (Function) Saves a raw request body (e.g., from 'application/octet-stream') to the specified file path. Returns `true` on success.
- `req.saveMultipartFile(path)`: (Function) Handles a 'multipart/form-data' upload. It saves the **first file part** to the specified `path` and returns an object containing the other form fields.

### Response Object (`res`)

The `res` object passed to the route callback has methods to send a response:

- `res.send(body, headers)`: Sends a response to the client.
  - `body` (String|ArrayBuffer): The response body.
  - `headers` (Object, Optional): An object of HTTP headers.
- `res.sendFile(path)`: Sends the content of a file as the response.

### Examples

**Handling a multipart/form-data upload:**

```javascript
// Example with curl:
// curl -X POST -F "file1=@/path/to/your/file.bin" \
//   -F "user=JohnDoe" -F "timestamp=1678886400" \
//   http://<device-ip>:8080/form-upload

httpserver.route("/form-upload", function (req, res) {
  try {
    const fields = req.saveMultipartFile("/app/code/data/uploaded_file.bin");
    // fields will be: { user: "JohnDoe", timestamp: "1678886400" }
    res.send(`File saved. User was ${fields.user}`);
  } catch (e) {
    res.send(`Error saving file: ${e}`, { "Content-Type": "text/plain" });
  }
});
```

For more detailed usage, refer to Demo: demo/test_server.js,demo/web
scrrenshot as below: 192.168.50.212 is the device IP
![](https://dxiot-autobackup.oss-cn-hangzhou.aliyuncs.com/mydiagram/rdmsAdmin/ec5636b0f035bc8c.png)

## 6. Related Modules

Related to another module dxWebserver, with similar functionality. dxHttpServer is a replacement for dxWebserver, and dxWebserver is being gradually deprecated

## 7. Example

[Source Code](https://github.com/DejaOS/DejaOS/tree/main/demos/modules/dxHttpServer)
