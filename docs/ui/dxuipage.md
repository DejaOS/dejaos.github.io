# dxUi Page Loading and Switching

This section explains how to switch between pages.

## Screen Layers

LVGL divides the screen into three layers from bottom to top: the Main layer, the TOP layer, and the Sys layer. These three layers overlap, and a lower layer is only visible if the layer above it is transparent.

We usually use two of these layers:

- **Main Layer**: Primarily used for drawing the main page content. Pages are loaded using the `loadMain` function, and page navigation is achieved by switching pages with `loadMain`.
- **TOP Layer**: Mainly used for elements that should always be visible on top, such as a status bar showing the time. No matter how the Main layer switches pages, the TOP layer remains visible. The TOP layer can also be used to draw a full page; in that case, other pages can only be shown by hiding the current top page.

Note: To ensure a smooth UI, it's best to hide any elements that are not visible. For example, if a page on the TOP layer is opaque and completely covers the Main layer, you should hide the View on the Main layer. Hidden widgets do not consume rendering resources.

Let's look at an example:

```javascript
import dxui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";
import logger from "../dxmodules/dxLogger.js";

dxui.init({ orientation: 1 });

const page1 = dxui.View.build("page1", dxui.Utils.LAYER.MAIN);
const button1 = dxui.Button.build("page1button", page1);
button1.setPos(100, 100);
button1.setSize(200, 200);

const buttonLabel1 = dxui.Label.build("page1label", button1);
buttonLabel1.text("Open Page2");
buttonLabel1.setPos(10, 20);

const page2 = dxui.View.build("page2", dxui.Utils.LAYER.MAIN);
const button2 = dxui.Button.build("page2button", page2);
button2.setPos(100, 100);
button2.setSize(200, 200);
button2.bgColor(0xff0000);

const buttonLabel2 = dxui.Label.build("page2label", button2);
buttonLabel2.text("Back Page1");
buttonLabel2.setPos(10, 20);

button1.on(dxui.Utils.EVENT.CLICK, () => {
  dxui.loadMain(page2);
});
button2.on(dxui.Utils.EVENT.CLICK, () => {
  dxui.loadMain(page1);
});
page1.on(dxui.Utils.ENUM.LV_EVENT_SCREEN_LOADED, () => {
  logger.info("page1 loaded");
});
page1.on(dxui.Utils.ENUM.LV_EVENT_SCREEN_UNLOADED, () => {
  logger.info("page1 unloaded");
});
page2.on(dxui.Utils.ENUM.LV_EVENT_SCREEN_LOADED, () => {
  logger.info("page2 loaded");
});
page2.on(dxui.Utils.ENUM.LV_EVENT_SCREEN_UNLOADED, () => {
  logger.info("page2 unloaded");
});
const topview = dxui.View.build("topview", dxui.Utils.LAYER.TOP);
topview.setPos(0, 0);
topview.setSize(200, 30);
topview.bgColor(0xcccccc);
const topviewlabel = dxui.Label.build("topviewlabel", topview);
topviewlabel.text("time");
dxui.loadMain(page1);

std.setInterval(() => {
  topviewlabel.text(new Date().toLocaleTimeString());
}, 1000);
std.setInterval(() => {
  dxui.handler();
}, 10);
```

## How it Works

![page1](/img/ui/page1.png)
![page2](/img/ui/page2.png)

## Code Analysis

This example code creates two pages, `page1` and `page2`, on the Main layer, and a `topview` on the TOP layer that is always visible. Clicking the buttons switches between the two pages.

- **Creating Pages**:

  - `page1` and `page2` are both `dxui.View` objects with `dxui.Utils.LAYER.MAIN` as their parent.
  - A button and a label are created on each page for navigation and display.

- **Creating the Top Bar**:

  - The parent of `topview` is `dxui.Utils.LAYER.TOP`, so it is displayed above the `MAIN` layer.
  - The `TOP` layer remains visible regardless of which page is loaded in the `MAIN` layer.
  - We use `setInterval` to update the time on `topview` every second.

- **Page Switching**:
  - The key function is `dxui.loadMain()`, which loads a new page onto the `MAIN` layer. When a new page is loaded, the previous page on the `MAIN` layer is automatically unloaded.
  - The `click` event on `button1` calls `dxui.loadMain(page2)` to display `page2`.
  - The `click` event on `button2` calls `dxui.loadMain(page1)` to display `page1`.

## `load` and `unload` Events

`dxui` provides page lifecycle events for loading and unloading, which are useful for initialization and cleanup during page transitions.

- `dxui.Utils.ENUM.LV_EVENT_SCREEN_LOADED`: Triggered when a page is loaded by `loadMain`.
- `dxui.Utils.ENUM.LV_EVENT_SCREEN_UNLOADED`: Triggered when a page is unloaded (i.e., when another page is loaded).

In the example code:

- We listen for these two events on both `page1` and `page2`.
- When switching from `page1` to `page2`, the log will print the following in order:
  - `page1 unloaded`
  - `page2 loaded`
- Conversely, when switching back from `page2` to `page1`, the log will print:
  - `page2 unloaded`
  - `page1 loaded`

Using these events, we can initialize resources (like starting timers or fetching network data) when a page is loaded, and release resources (like destroying timers) when a page is unloaded. This helps to better manage the application's state and memory.
