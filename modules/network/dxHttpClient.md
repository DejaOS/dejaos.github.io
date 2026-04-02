# dxHttpClient

## 1. Overview

`dxHttpClient` module is part of the official system module library of [dejaOS](https://github.com/DejaOS/DejaOS), used for accessing HTTP servers via the HTTP/HTTPS protocol.

This module provides a **stateless, function-based API**. Each call (`get`, `post`, `request`, etc.) uses an **isolated, short-lived native client**, which keeps requests thread-safe and avoids the state conflicts of the old stateful API.

**Key Features:**
- Send GET/POST/PUT/PATCH/DELETE requests
- Multipart `multipart/form-data` upload via `formSubmit` (files + text fields)
- File upload and download with progress callback support
- HTTPS with certificate verification options (**peer/host verification default to off** for typical IoT convenience)
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
  - `headers` `{object<string, string>|string[]}`: Request headers as a **key-value object** (recommended), e.g. `{ 'Content-Type': 'application/json' }`, or an **array of `"Name: value"` strings** for backward compatibility with older callers.
  - `body` `{string|object}`: Request body. If a JS object is provided, it will be **automatically converted** to a JSON string, and the `'Content-Type: application/json'` header will be automatically added (unless a `Content-Type` header already exists).
  - `timeout` `{number}`: Timeout in milliseconds. **Defaults to 5000**.
  - `onProgress` `{Function}`: Progress callback function, receiving parameters `(dltotal, dlnow, ultotal, ulnow)`.
  - `verifyPeer` `{number}`: Whether to verify peer certificate (0: disable, 1: enable). **Defaults to 0**.
  - `verifyHost` `{number}`: Whether to verify hostname (0: disable, 2: enable). **Defaults to 0**.
  - `caFile` `{string}`: Path to CA certificate file.

Throws `Error` if `options` is missing/invalid or `options.url` is omitted.

**Returns:** `{ code, status, message, headers, data }`. **`headers`** is an **object** whose keys are **lowercase** header names.

### Convenience Functions

- `httpclient.get(url, [timeout=5000], [options={}])`
- `httpclient.post(url, body, [timeout=5000], [options={}])`
- `httpclient.put(url, body, [timeout=5000], [options={}])`
- `httpclient.patch(url, body, [timeout=5000], [options={}])`
- `httpclient.delete(url, [timeout=5000], [options={}])`
- `httpclient.download(url, localPath, [timeout=30000], [options={}])`
- `httpclient.upload(url, localPath, [timeout=30000], [options={}])`
- `httpclient.formSubmit(url, form, [timeoutOrOptions], [options])`

**Note:** Positional `timeout` / `options` match the implementations above: for **`get`** / **`delete`**, argument 2 is `timeout` and argument 3 is `options`. For **`post`** / **`put`** / **`patch`**, argument 3 is `timeout` and argument 4 is `options`. For **`download`** / **`upload`**, argument 3 is `timeout` and argument 4 is `options`. **`formSubmit`** is special: see below.

**Timeout must be a number** in those positions (e.g. `get(url, 3000)` or `get(url, 3000, { headers: {} })`). Passing an object where `timeout` is expected **does not** set timeout — use **`httpclient.request({ url, method: 'GET', timeout: 3000, ... })`** for a fully object-based call.

### `httpclient.formSubmit(url, form, [timeoutOrOptions], [options])`

Uploads **`multipart/form-data`**: one or more files plus optional text fields in a single request. Use this when the server expects a HTML-style form POST; use `upload` when the server expects a raw file body.

- `url` `{string}`: **(Required)** Request URL.
- `form` `{object}`: **(Required)** Multipart form descriptor. After building the part list, it must be **non-empty**; otherwise an `Error` is thrown.
  - `file` `{object}`: Single file part.
    - `path` `{string}`: **(Required)** Local path of the file.
    - `fieldName` `{string}`: Multipart field name. **Defaults to `'file'`.**
    - `filename` `{string}`: Optional filename in `Content-Disposition`.
    - `contentType` `{string}`: Optional `Content-Type` for this part.
  - `files` `{object[]}`: Multiple file parts; each element uses the same shape as `file`. Non-object entries are **skipped**; each kept item must have a string `path`.
  - `fields` `{object}`: Text fields; keys are field names; values use `String(value)` (`null` / `undefined` become `''`).
- **`timeoutOrOptions`** (third argument):
  - If a **`number`**: timeout in milliseconds. **Default overall timeout is 30000** when you omit this slot (see below).
  - If an **`object`**: treated as **`options`** only; timeout remains **30000**. Example: `httpclient.formSubmit(url, form, { headers: { 'X-Id': '1' } })`.
- **`options`** `{object}` (fourth argument): Only when the third argument is a **`number`**; same fields as `httpclient.request` (`headers`, `onProgress`, `verifyPeer`, `verifyHost`, `caFile`, etc.).

Throws `Error` on missing `url`, invalid `form`, missing `form.file.path`, invalid `files[]` items, or an empty multipart payload.

**Returns:** `{ code, status, message, headers, data }` with **`headers`** as an **object** (lowercase keys), same style as `request`.

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
let res_patch = httpclient.patch(
    urlroot + "/patch",
    { email: "patched@example.com", status: "active" },
    5000
);
log.info(res_patch);

// 8. DELETE request (without body)
log.info("\n=== DELETE ===");
let res_delete = httpclient.delete(urlroot + "/delete/123", 5000);
log.info(res_delete);

// 9. Multipart form upload (file + text fields)
log.info("\n=== formSubmit ===");
let res_form = httpclient.formSubmit(
    urlroot + "/upload",
    {
        file: {
            fieldName: "file",
            path: "/app/code/dxmodules/libvbar-m-dxhttpclient.so",
            // filename: "custom-name.so",       // optional
            // contentType: "application/octet-stream", // optional
        },
        fields: {
            token: "demo-token",
            faceId: "demo-faceid",
            similarity: "0.68",
        },
    },
    30000
);
log.info(res_form);

// Same as above but third argument is options only (timeout stays default 30000 ms)
// httpclient.formSubmit(urlroot + "/upload", { file: { path: "/tmp/a.bin" }, fields: { id: "1" } }, {
//     headers: { "X-Request-Id": "device-001" },
// });

// Multiple files (each part can use its own fieldName)
// httpclient.formSubmit(urlroot + "/upload-multi", {
//     files: [
//         { path: "/tmp/a.jpg", fieldName: "photo" },
//         { path: "/tmp/b.jpg", fieldName: "attachment", filename: "scan.jpg" },
//     ],
//     fields: { albumId: "42" },
// }, 30000, { headers: { "X-Request-Id": "device-001" } });
```

## 7. Response Format

### `request`, `get`, `post`, `put`, `patch`, `delete`, `formSubmit`

```javascript
{
    "code": 0,           // CURL error code (0 = success)
    "status": 200,       // HTTP status code
    "data": "...",       // Response body (string)
    "headers": { },      // Object; header names as lowercase keys
    "message": "..."     // Error message (when applicable)
}
```

### `download`, `upload`

```javascript
{
    "code": 0,
    "status": 200,
    "headers": { },      // Always an empty object (response headers are not captured)
    "message": "..."
}
```

There is **no `data` field** — the payload is written to disk or sent from disk.

## 8. Deprecated APIs

The legacy **stateful** helpers **`init`**, **`deinit`**, **`setOpt`**, and **`reset`** are **deprecated**. **`init`** and **`deinit`** are **no-ops** (they do not throw). **`setOpt`** and **`reset`** throw an `Error` directing you to the stateless API.

**`request` and all stateless methods above are the supported API** — use them for new code.

**Always use the new stateless functional API** — it is safer, simpler, and more reliable.

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