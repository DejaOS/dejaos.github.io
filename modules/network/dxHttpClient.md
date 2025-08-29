# dxHttpClient

## 1. Overview

`dxHttpClient` module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used for accessing HTTP servers via the HTTP/HTTPS protocol.

This module provides a **stateless, function-based API**. Each request call (such as `get`, `post`) is an independent, isolated operation, ensuring code simplicity and thread safety, avoiding configuration state confusion issues that could occur in the old API.

**Key Features:**
- Send GET/POST/PUT/PATCH/DELETE requests
- File upload and download with progress callback support
- HTTPS support with certificate verification options
- Fully configurable via a unified `options` object for each request
- Automatic JSON stringification for object bodies
- Robust error handling and parameter validation

## 2. Files

- `dxHttpClient.js` - JavaScript module wrapper
- `libvbar-m-dxhttpclient.so` - Underlying C language implementation

> Ensure both files are included in the `dxmodules` subdirectory under your project root directory.

## 3. Dependencies

- **libcurl**: curl library

## 4. Compatible Devices

Compatible with all devices running dejaOS v2.0+

## 5. API Reference

### `httpclient.request(options)`

This is the core function of the module. All other convenience functions (such as `get`, `post`) are wrappers around this function.

- `options` `{object}`: An object containing all request configuration.
  - `url` `{string}`: **(Required)** The request URL.
  - `method` `{string}`: Request method (e.g., 'GET', 'POST', 'PUT', etc.). **Defaults to 'GET'**.
  - `headers` `{object}`: A key-value pair header object, e.g., `{ 'Content-Type': 'application/json' }`.
  - `body` `{string|object}`: Request body. If a JS object is provided, it will be **automatically converted** to a JSON string, and the `'Content-Type: application/json'` header will be automatically added.
  - `timeout` `{number}`: Timeout in milliseconds. **Defaults to 5000**.
  - `onProgress` `{Function}`: Progress callback function, receiving parameters `(dltotal, dlnow, ultotal, ulnow)`.
  - `verifyPeer` `{number}`: Whether to verify peer certificate (0: disable, 1: enable). **Defaults to 0**.
  - `verifyHost` `{number}`: Whether to verify hostname (0: disable, 2: enable). **Defaults to 0**.
  - `caFile` `{string}`: Path to CA certificate file.

### Convenience Functions

- `httpclient.get(url, [timeout=5000], [options={}])`
- `httpclient.post(url, body, [timeout=5000], [options={}])`
- `httpclient.put(url, body, [timeout=5000], [options={}])`
- `httpclient.patch(url, body, [timeout=5000], [options={}])`
- `httpclient.delete(url, [timeout=5000], [options={}])`
- `httpclient.download(url, localPath, [timeout=30000], [options={}])`
- `httpclient.upload(url, localPath, [timeout=30000], [options={}])`

**Note:** The convenience functions maintain backward compatibility by accepting `timeout` as the second parameter, followed by `options` as the third parameter.

## 6. Usage Examples

```javascript
import httpclient from 'dxmodules/dxHttpClient.js';
import * as std from 'std';
import * as log from 'dxmodules/dxLogger.js';

// Replace with your server address
const urlroot = "http://192.168.50.36:3000";

// 1. Simple GET request
log.info("\n=== GET ===");
let res_get = httpclient.get(urlroot + "/get?name=quickjs&age=1", 5000);
log.info(res_get);
// Output: {"code":0,"status":200,"data":"{\"method\":\"GET\",..."}}

// 2. POST with object (automatically converted to JSON string)
log.info("\n=== POST ===");
let res_post = httpclient.post(urlroot + "/post", { foo: "bar", num: 42 }, 5000);
log.info(res_post);
// Output: {"code":0,"status":200,"data":"{\"method\":\"POST\",\"body\":{\"foo\":\"bar\"...}}"}

// 3. PUT request with custom headers
log.info("\n=== PUT ===");
let res_put = httpclient.put(
    urlroot + "/put", 
    { id: 123, name: "Updated User" },
    5000,
    { headers: { 'X-Custom-Header': 'MyValue' } }
);
log.info(res_put);

// 4. Download file
log.info("\n=== Download ===");
let res_download = httpclient.download(urlroot + "/download", "/tmp/bigfile.txt", 30000);
if (res_download.code === 0) {
    log.info('Download successful, file size:', std.loadFile("/tmp/bigfile.txt").length);
} else {
    log.error('Download failed:', res_download.message);
}

// 5. File upload with progress callback
log.info("\n=== Upload with Progress ===");
let res_upload = httpclient.upload(
    urlroot + "/upload",
    "/app/code/dxmodules/libvbar-m-dxhttpclient.so",
    30000,
    {
        onProgress: function (dTotal, dLoaded, uTotal, uLoaded) {
            if (uTotal > 0) {
                log.info(`Upload progress: ${Math.round(uLoaded / uTotal * 100)}%`);
            }
        }
    }
);
log.info(res_upload);

// 6. HTTPS request (with certificate verification disabled)
log.info("\n=== HTTPS GET ===");
let res_https = httpclient.get("https://reqres.in/api/users?page=2", 5000, {
    headers: { "x-api-key": "reqres-free-v1" },
    verifyPeer: 0,
    verifyHost: 0
});
log.info(res_https);

// 7. PATCH request
log.info("\n=== PATCH ===");
let res_patch = httpclient.patch(urlroot + "/patch", 5000, { 
    email: "patched@example.com", 
    status: "active" 
});
log.info(res_patch);

// 8. DELETE request (without body)
log.info("\n=== DELETE ===");
let res_delete = httpclient.delete(urlroot + "/delete/123", 5000);
log.info(res_delete);
```

## 7. Response Format

All HTTP request functions return a response object with the following structure:

```javascript
{
    "code": 0,           // CURL error code (0 = success)
    "status": 200,       // HTTP status code
    "data": "...",       // Response body (string)
    "message": "..."     // Error message (only present on errors)
}
```

**Note:** The `download` function returns a response object without the `data` field, as the response body is written directly to the local file.

## 8. Deprecated APIs

The old stateful API (`init`, `deinit`, `setOpt`, `reset`, `request()`) is now **deprecated** and should not be used in new projects. For backward compatibility, these functions may still exist but will throw errors or perform no operations.

**Always use the new stateless functional API** - it's safer, simpler, and more reliable.

## 9. Related Modules

`dxHttpClient` is the replacement for the `dxHttp` module. `dxHttp` is being gradually phased out - please use `dxHttpClient` in new projects.

## 10. Technical Improvements

The latest version includes several important improvements:

- **Robust parameter handling**: All optional parameters are properly validated before processing
- **Memory safety**: Enhanced integer overflow protection and memory management
- **Error handling**: Better error messages and exception handling
- **Thread safety**: Each request is completely isolated and stateless
- **Performance**: Optimized memory allocation and cleanup routines

## 11. Demo

[Source Code](https://github.com/DejaOS/DejaOS/tree/main/demos/dw200_v20/dw200_test_httpclient)