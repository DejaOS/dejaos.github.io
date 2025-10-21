# dxUi 页面加载和切换

## 我们在这部分来解释页面的切换

## 屏幕分层

LVGL 把屏幕从上到下分成 3 层，Main 层，TOP 层，Sys 层面，这 3 层互相覆盖，不过如果上层设置了透明，才可以看到下层
我们通常用 2 层：

- Main 层: 主要用于绘制主要页面，通过 loadMain 函数来加载，多个页面跳转本质上是通过 loadMain 函数来切换，
- TOP 层: 主要用来绘制一些永远显示在最上层的部分，比如顶部的显示时间的区域，不管 loadMain 如何切换页面，永远可以看到顶部时间都能看到。不过 TOP 层也可以用来绘制完整的页面，如果想要显示其它页面，只能通过隐藏当前页面的方式来实现。

注意：为了让 UI 更流畅，任何看不到的部分尽量隐藏，比如 TOP 层页面完整盖住了底部的 Main 层，而且也是不透明，那么尽量让 Main 层的 View 隐藏，隐藏的控件是不会消耗绘制资源。

我们来看一个示例：

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

## 运行效果

![page1](/img/ui/page1.png)
![page2](/img/ui/page2.png)

## 代码解析

这个示例代码创建了两个绘制在Main层的页面`page1`和`page2`，一个绘制在TOP层始终在顶部的`topview`，并通过点击按钮来回切换两个页面。

- **创建页面**:
  - `page1` 和 `page2` 都是 `dxui.View` 对象，并且他们的父节点都是 `dxui.Utils.LAYER.MAIN`。
  - 在各自页面上都创建了一个按钮和标签，用于切换页面和显示。
- **创建顶部栏**:
  - `topview` 的父节点是 `dxui.Utils.LAYER.TOP`，它会显示在 `MAIN` 层的上方。
  - 不管 `MAIN` 层如何通过 `loadMain` 切换，`TOP` 层始终可见。
  - 我们通过 `setInterval` 每秒更新一次 `topview` 上的时间。
- **页面切换**:
  - 关键函数是 `dxui.loadMain()`，它负责加载一个新的页面到 `MAIN` 层。当加载新页面时，`MAIN` 层上原有的页面会被自动卸载。
  - `button1` 的点击事件调用 `dxui.loadMain(page2)` 来显示 `page2`。
  - `button2` 的点击事件调用 `dxui.loadMain(page1)` 来显示 `page1`。

## load 和 unload 事件

`dxui` 为页面提供了加载和卸载的生命周期事件，方便我们在页面切换时进行一些初始化和清理工作。

- `dxui.Utils.ENUM.LV_EVENT_SCREEN_LOADED`: 当页面被 `loadMain` 加载时触发。
- `dxui.Utils.ENUM.LV_EVENT_SCREEN_UNLOADED`: 当页面被卸载（即另一个页面被加载）时触发。

在示例代码中：

- 我们为 `page1` 和 `page2` 都监听了这两个事件。
- 当点击按钮从 `page1` 切换到 `page2` 时，日志会依次打印：
  - `page1 unloaded`
  - `page2 loaded`
- 反之，从 `page2` 切换回 `page1` 时，日志会打印：
  - `page2 unloaded`
  - `page1 loaded`

利用这两个事件，我们可以在进入页面时初始化资源（如启动定时器、请求网络数据），在离开页面时释放资源（如销毁定时器），从而更好地管理应用的状态和内存。
