# Hello World Quick Start

---

## 📁 Create a New Project

1. Launch VSCode and click the `DejaOS` icon in the sidebar
2. Select `Create Project`, enter a project name, and choose a storage path
3. Click `Submit` to create the project

![Project Creation Demo](/img/demo-2.gif)

4. In your project directory, click the `app.dxproj` file to open the visual configuration interface
5. After editing the configuration, click `Add Module` to add required modules and save

![Module Configuration Demo](/img/demo-4.gif)

> ⚠️ **Note:**
>
> - Ensure the selected device model matches your actual hardware
> - If you change the device model, reconfigure all module versions
> - Module versions are not compatible across different device models

---

## 📂 Import an Existing Project

DejaOS offers a variety of [GitHub examples](https://github.com/DejaOS/DejaOS). You can download any example and import it into VSCode:

1. After downloading, open the code directory in VSCode
2. Make sure the directory contains an `app.dxproj` file at the root—this is required to activate the extension

![Import Example Project Demo](/img/demo-12.gif)

---

## 🔌 Connect Device & Sync Code

1. Click the `Not Connected` button at the bottom of VSCode and select your device
2. Once connected, click `syncAll` for the initial full sync (this may take a while)

![Device Sync Demo](/img/demo-6.gif)
> ⚠️ **Note:**
> - Please select an example that matches your connected device model. If they don't match, you can manually modify the device model in app.dxproj and reselect modules versions
> - **The first sync must use `syncAll`**. For subsequent development, use `sync` for faster incremental updates.

---

## ✍️ Coding Example: Controls Relay

Add the following code to your project's `main.js` to control a relay with a button press:

```js
import logger from "../dxmodules/dxLogger.js";
import dxui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";
import gpio from "../dxmodules/dxGpio.js";
import * as os from "os";

// ui context
let context = {};

function initScreen() {
  // ui init
  dxui.init({ orientation: 1 }, context);
  // Create screen
  let mainView = dxui.View.build("mainView", dxui.Utils.LAYER.MAIN);
  // Create a button control
  let button = dxui.Button.build(mainView.id + "button", mainView);
  // Set button size
  button.setSize(130, 50);
  // Create a label control
  let label = dxui.Label.build(mainView.id + "label", button);
  // Set text content
  label.text("Click");
  // Set text color
  label.textColor(0x000000);
  // Set the position of the text in the button
  label.align(dxui.Utils.ALIGN.CENTER, 0, 0);
  // Listen for button click event
  button.on(dxui.Utils.EVENT.CLICK, handleGpio);
  // Load screen
  dxui.loadMain(mainView);
}

(function () {
  initScreen();
})();

function handleGpio() {
  const gpio_id_dw200 = 44;
  // Init gpio
  let res = gpio.init();
  logger.info("init gpio", res);
  // Request gpio
  res = gpio.request(gpio_id_dw200);
  logger.info("request gpio", res);
  // Output high level to open the relay
  res = gpio.setValue(gpio_id_dw200, 1);
  logger.info("Output high level", res);
  // Get whether the current level is high or low
  res = gpio.getValue(gpio_id_dw200);
  logger.info("The level is now", res);
  // Wait 3 seconds
  os.sleep(3000);
  // Output low level to close the relay
  res = gpio.setValue(gpio_id_dw200, 0);
  logger.info("Output low level", res);
  res = gpio.getValue(gpio_id_dw200);
  logger.info("The level is now", res);
}

std.setInterval(() => {
  dxui.handler();
}, 5);
```

---

## ▶️ Run the Project

1. After coding, click the `sync` button to upload changes to your device
2. Once synced, click `start` to launch the application
3. View log output in the VSCode console and observe the device screen

## ![alt text](/img/demo-8.gif)

## 📦 Package the Project

When development is complete, you can package your project as a `.dpk` installer for deployment:

1. Click the `package` button to start packaging  
   ![alt text](/img/demo-10.gif)
2. The installer will be saved in the `.temp/` folder within your project directory

> `.dpk` files are DejaOS-specific installers, suitable for OTA or serial deployment

---

## 📘 Next Steps

- 📦 To install or upgrade your `.dpk` application on a device, see: [App Packaging, Installation, and Upgrade](./app.md)
- 🧪 For more JavaScript App projects, see: [Example Projects](https://github.com/DejaOS/DejaOS/tree/main/demos)
