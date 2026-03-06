# DejaOS Application Development Prompts

## 1. What is DejaOS

DejaOS is a JavaScript runtime that runs on embedded devices. It is built on the QuickJS engine and LVGL graphics library and provides dozens of components that bridge C libraries to JavaScript. Developers can build device applications using ES6+ and these JS components.

## 2. Application Structure

```
app/
├── app.dxproj              # App config: selected components and their versions
├── dxmodules/              # All component .js and .so files; auto-downloaded per config; use only, do not modify
├── resource/               # App resources: images, fonts, WAV audio, etc.
│   ├── font
│       ├── font.ttf        # Usually required if the UI is not English-only
├── src/
│   ├── main.js             # Entry point; required
```

The `src` directory is synced to the device at absolute path `/app/code/src`. Data files are conventionally placed under `/app/data`.

### 2.1 Supported Device Types

DW200_V20, VF105_V12, VF203_V12, VF202_V12, VF114_V12  
Developers must decide the device type first.

### 2.2 app.dxproj Format

Each device type has its own reference file with all optional components and latest version numbers (e.g. DW200_V20 → DW200_V20-app.dxproj).

### 2.3 Module Overview

- **Base (required)**: `dxLogger` (logging, use instead of console.log), `dxStd` (system standard), `dxOs` (system), `dxDriver` (drivers), `dxMap` (cross-worker shared memory), `dxEventBus` (cross-worker messaging), `dxCommonUtils` (utilities and algorithms)
- **UI**: `dxUi` (required if the app has a UI)
- **Storage**: `dxSqliteDB` (SQLite), `dxKeyValueDB` (key-value)
- **Network**: `dxNetwork` (required for network management), `dxHttpClient`, `dxHttpServer`, `dxMqttClient`
- **Audio**: `dxAudio` (WAV playback, TTS)
- **GPIO**: `dxGpio` (output), `dxGpioKey` (input)
- **Others**: `dxBarcode`, `dxNfc`, `dxUart`, `dxPwm`, `dxWatchdog`, `dxNtp`, `dxOta`, `dxConfiguration`

> When generating `app.dxproj` for a new app: if the user has no special requirements, *select only the base modules*. If the user needs a UI, also select dxUi on top of the base modules.

### 2.4 Application Notes

**1. General**

- The VSCode DejaOS extension lets you choose components and versions in `app.dxproj` (usually latest). Clicking `install` downloads all component JS sources into `dxmodules`. Use those sources as API reference. If a JS file is missing under `dxmodules`, tell the user to enable the component in `app.dxproj` and click the plugin’s `install` button.
- Unlike **Node.js**’s single-threaded event loop, DejaOS apps use a multi-worker model; each worker is still single-threaded. `dxStd.setTimeout` and `dxStd.setInterval` are supported but are “pseudo-async” within the same worker (still executed in order).
- `main.js` should only initialize components and workers, not implement business logic.
- Do not use QuickJS’s native worker init; use `dxEventBus.newWorker` instead.
- Most apps use only a subset of components.
- Put all resources (images, fonts, etc.) in the `resource` directory next to `src`.
- Reference resource files (images, fonts) with absolute paths, e.g. `dxui.Image.build('img1', parent).source('/app/code/resource/logo.png')`.
- DejaOS runs on embedded devices with limited memory and CPU. Avoid large objects and long-running loops; release references when no longer needed.
- Uncaught exceptions can stop the current worker. Wrap potentially failing code in try-catch, especially hardware, network, and file I/O.
- All component modules live under `dxmodules`; use correct relative import paths (e.g. `import log from "../../dxmodules/dxLogger.js"`). Watch path depth when moving files. This is not Node’s `node_modules` mechanism.
- Compress images and fonts when possible. Prefer PNG (with transparency) or JPEG for photos; avoid oversized bitmaps. Use TTF fonts that only include needed character sets; watch size for CJK fonts.
- `dxDriver` provides device-specific info (e.g. `dxDriver.DISPLAY.WIDTH/HEIGHT`, `dxDriver.CHANNEL.UART_PATH`). These vary by device; avoid hardcoding.
- Creating font objects repeatedly hurts performance. Use `UIManager.font(size, style)` to get fonts; it caches them. Avoid creating new fonts on every render.

**2. UI**

- Run UI in a dedicated worker, not the main thread.
- Relevant JS: `dxmodules/dxUi.js` and all `dxmodules/ui*.js`, including:
  - `uiBase.js`: Base class for all controls (size, position, events, style)
  - `uiButton.js`: Button
  - `uiButtons.js`: Button matrix/group
  - `uiCheckbox.js`: Checkbox
  - `uiDropdown.js`: Dropdown
  - `uiFont.js`: Font wrapper
  - `uiImage.js`: Image
  - `uiKeyboard.js`: On-screen keyboard (e.g. pinyin)
  - `uiLabel.js`: Label
  - `uiLine.js`: Line
  - `uiList.js`: List
  - `uiSlider.js`: Slider
  - `uiStyle.js`: Style
  - `uiSwitch.js`: Switch
  - `uiTextarea.js`: Multi-line text input
  - `uiUtils.js`: UI utilities, constants, enums, init helpers
  - `uiView.js`: Container view (like a div)

- For page management use UIManager.js, which implements single-screen, stack-based multi-page management.
- Prefer small font files. **If UI text includes Chinese or other non-ASCII, you must provide a TTF for that language**, typically at `/app/code/resource/font/font.ttf`, and get the font in code via `UIManager.font(size, style)`. If the app language is not English, remind the user to provide the TTF.
- `uiButton` has no `text` property; to show text, add a `Label` inside the button and set `text` / `textFont` on the Label.
- `uiImage` does not support click events; for clickable images, wrap in a transparent `View` and attach the click handler to that View.
- Using `dxui.Utils.LAYER.TOP` as parent keeps the UI on top (e.g. popups, status bar).
- `uiImage` does not auto-scale the image; make the image size match the Image control size.
- `uiView` has default padding; set `padAll(0)` before computing inner layout. Default scroll is on; usually call `scroll(false)`.

**3. UART / Serial**

- Use a dedicated worker for UART; do not send/receive on the main thread.
- Main API: `dxmodules/dxUart.js`. Reference `dxmodules/vgUartWorker.js` if needed.
- Device-related params: `dxDriver.CHANNEL` in `dxmodules/dxDriver.js`.
- UART send/receive is asynchronous; use events or RPC from `dxmodules/dxEventBus.js`.
- For encoding/decoding use codec utilities in `dxmodules/dxCommonUtils.js`.
- Example for baud rate etc.: `dxUart.ioctl(6, '921600-8-N-1')`.
- `receive` blocks until `size` bytes arrive; with a short timeout it may return with no data before completion.

**4. Database**

- Prefer `dxmodules/dxSqliteDB.js` for CRUD. For simple key-value data use `dxKeyValueDB.js` or `kvdbWorker.js`. Key-value is faster but no SQL and not for complex queries.
- Database access does not require a dedicated worker for simple, fast queries or small writes; use a separate DB worker only for heavy or frequent writes.
- When using a DB worker, use `dxEventBus` events or RPC to pass data between UI/business and the DB worker.
- Convention: place DB files under `/app/data/`.

**5. Logging**

- Use `dxmodules/dxLogger.js` only; do not use `console.log`. Example: `import log from "../../dxmodules/dxLogger.js";` then `log.debug` / `log.info` / `log.error`.
- Logger accepts multiple arguments, e.g. `log.info("HomePage onShow", data)`.
- For `Error` objects use `log.error(e)`; the logger will expand `message` and `stack`.

**6. Time**

- Use `dxmodules/dxNtp.js` for NTP sync and system time (and simple timezone/offset). This is enough for most apps.
- For full timezone logic (e.g. world clock, multiple cities) use `dxmodules/dxTimeZones.js`.

**7. Network**

- Network is managed by the app via `dxmodules/dxNetwork.js`.
- After starting the network it will try to connect and will auto-reconnect after disconnects; no need to call connect again explicitly.

**8. Face recognition**

- Reference: `test/src/worker/faceworker.js` + `test/src/worker/uiworker.js`.
- Component: `dxmodules/dxFacial.js`.
- **Threading**: Run `face.loop()` in a dedicated `faceWorker`; UI thread only renders and handles input (e.g. read `face.getDetectionData()` for drawing boxes).
- **Required API**: `face.init()`, `face.loop()`, `face.setCallbacks({ onRecognition })`.
- **Result**: In `onRecognition(event)` use `event.userId`, `event.picPath`, `event.compareScore`, `event.rect`, `event.is_rec`, `event.isCompare`, etc., and forward via `dxEventBus` to UI/business (e.g. door open, weighing, logging).
- **Enrollment (optional)**:
  - Camera: `face.getFeaByCap(timeoutMs)` → `face.addFea(userId, feature)` (optionally `face.deleteFea(userId)` or `face.updateFea` first).
  - File: `face.getFeaByFile(filePath)` → `face.addFea(userId, feature)` (local file path).

**9. Watchdog**

- Component: `dxmodules/dxWatchdog.js`.
- Purpose: hardware/software watchdog to reboot the system on hang or deadlock.
- Multiple channels: assign different channels to different workers; all enabled channels must be kicked in time or the system reboots.
- Usage: init with `watchdog.init()` in `main.js`; `watchdog.enable(channel, true)`; `watchdog.start(timeout_ms)`; call `watchdog.restart(channel)` periodically (e.g. every 5 seconds).

**10. HTTP**

- Use `dxmodules/dxHttpClient.js`. It is stateless; each request uses a separate native instance (thread-safe).
- Response shape: `{ code, status, message, data }`:
  - `code`: native result; **0 = success**, others indicate timeout, DNS failure, etc.
  - `status`: HTTP status; **200 = success**.
  - `data`: response body string; usually `JSON.parse(result.data)`.
  - `message`: error description.

## 3. Core Code Templates

### 3.1 Standard UI Page (with UIManager)

```javascript
import dxui from "../../dxmodules/dxUi.js";
import log from "../../dxmodules/dxLogger.js";
import dxDriver from "../../dxmodules/dxDriver.js";
import utils from "../../dxmodules/dxCommonUtils.js";
import UIManager from "../UIManager.js"; // assume UIManager in src

const MyPage = {
  id: "myhomePage",
  init: function () {
    const parent = UIManager.getRoot();

    this.root = dxui.View.build(this.id, parent);
    this.root.setSize(dxDriver.DISPLAY.WIDTH, dxDriver.DISPLAY.HEIGHT);
    this.root.radius(0);
    this.root.borderWidth(0);
    this.root.padAll(0);
    this.root.bgColor(0x000000);

    this.initView();
    return this.root;
  },

  initView: function () {
    this.btn = dxui.Button.build(this.id + "_btn", this.root);
    this.btn.setSize(100, 50);
    this.btn.align(dxui.Utils.ALIGN.CENTER, 0, 0);

    this.btnLabel = dxui.Label.build(this.id + "_btn_label", this.btn);
    this.btnLabel.textFont(UIManager.font(16, dxui.Utils.FONT_STYLE.BOLD));
    this.btnLabel.text("Click me");
    this.btnLabel.align(dxui.Utils.ALIGN.CENTER, 0, 0);

    this.btn.on(dxui.Utils.EVENT.CLICK, () => {
      log.info("Button clicked");
    });

    this.iconArea = dxui.View.build(this.id + "_icon_area", this.root);
    this.iconArea.setSize(48, 48);
    this.iconArea.bgOpa(0);
    this.iconArea.radius(0);
    this.iconArea.borderWidth(0);
    this.iconArea.padAll(0);
    this.iconArea.setPos(dxDriver.DISPLAY.WIDTH - 48 - 16, 16);

    this.iconImage = dxui.Image.build(this.id + "_icon", this.iconArea);
    this.iconImage.source("/app/code/resource/image/icon_admin.png");
    this.iconImage.align(dxui.Utils.ALIGN.CENTER, 0, 0);

    this.iconLabel = dxui.Label.build(this.id + "_icon_label", this.iconArea);
    this.iconLabel.text("Admin");
    this.iconLabel.textFont(UIManager.font(14, dxui.Utils.FONT_STYLE.NORMAL));
    this.iconLabel.alignTo(this.iconImage, dxui.Utils.ALIGN.BOTTOM_MID, 0, 4);

    this.iconArea.on(dxui.Utils.EVENT.CLICK, () => {
      log.info("Click admin icon");
    });
  },

  onShow: function (data) {
    if (data) log.info("Received data:", data);
  },

  onHide: function () {},
};

export default MyPage;
```

### 3.2 UI Worker Entry (uiWorker.js)

```javascript
import dxui from "../dxmodules/dxUi.js";
import log from "../dxmodules/dxLogger.js";
import std from "../dxmodules/dxStd.js";
import UIManager from "./UIManager.js";
import HomePage from "./pages/HomePage.js";

try {
  dxui.init({ orientation: 1 });
  UIManager.init();
  UIManager.register("home", HomePage);
  UIManager.open("home");

  std.setInterval(() => {
    dxui.handler();
  }, 20);
} catch (error) {
  log.error(error);
}
```

### 3.3 Main Thread (main.js)

```javascript
import bus from "../dxmodules/dxEventBus.js";
import log from "../dxmodules/dxLogger.js";
function init() {}
try {
  init();
} catch (e) {
  log.error("init error", e);
}
const uiWorker = bus.newWorker("uiWorker", "/app/code/src/uiWorker.js");
```
