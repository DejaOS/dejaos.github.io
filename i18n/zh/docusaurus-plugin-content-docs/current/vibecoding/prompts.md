# dejaos 应用开发提示词

## 1. dejaos 是运行在嵌入式设备上的 JavaScript 运行时，底层是 quickjs 引擎、lvgl 图形库，提供了几十个组件封装 c 库到 javascript 的桥架，开发者只需要使用 es6+几十个 js 组件就能开发设备上的应用。

## 2. 应用基本结构

```
app/
├── app.dxproj              # 应用配置，主要是要选择的组件和组件的版本
├── dxmodules/              # 所有组件的js和so文件，根据配置文件自动下载，只允许调用，不允许修改
├── resource/               # 应用用到的资源文件，比如图片，字体，音频wav等
│   ├── font
│       ├── font.ttf        # 如果不是纯英文，通常必须提供一个字体文件
├── src/
│   ├── main.js             # 入口，必须要有
```

其中 src 目录同步到设备上的绝对路径是/app/code/src ，数据文件约定都放在/app/data 目录下

### 2.1 支持设备类型

DW200_V20,VF105_V12,VF203_V12,VF202_V12,VF114_V12
开发者必须先确定好设备类型

### 2.2 app.dxproj 格式

不同的设备类型参考不同的示例文件，里面包含了所有可选的组件及最新版本号，比如 DW200_V20，参考 DW200_V20-app.dxproj

### 2.3 模块简单介绍：

- **基础模块（必选）**：`dxLogger`（打印日志，替代 console.log）, `dxStd`(系统标准组件), `dxOs`,(系统相关组件) `dxDriver`,（驱动组件） `dxMap`（跨 worker 共享内存）`dxEventBus`（跨 worker 消息通信）`dxCommonUtils`（通用算法和工具组件）
- **UI 界面**：`dxUi`（如需 UI 必须）
- **数据存储**：`dxSqliteDB`（sqlite 数据组件）`dxKeyValueDB`(k/v 格式的简单数据组件)
- **网络连接**：`dxNetwork`（网络管理必须），`dxHttpClient`（HTTP 客户端请求），`dxHttpServer`（HTTP 服务），`dxMqttClient`（MQTT 客户端通信）
- **音频播放**：`dxAudio` (WAV 播放，tts 语音)
- **GPIO 控制**：`dxGpio`,（GPIO 控制输出） `dxGpioKey`（GPIO 输入监控）
- **其他**：`dxBarcode`(二维码条形码识别),`dxNfc`（NFC 卡控制）, `dxUart`（串口通信）, `dxPwm`（PWM 控制，主要用于蜂鸣器和设置光）, `dxWatchdog`（看门狗） `dxNtp`（时间同步）, `dxOta`（OTA 升级）,`dxConfiguration` (配置项读写)

> 生成新应用的 `app.dxproj` 时：用户没有特殊需求的话，\*_只勾选基础模块 _,\*如果用户需要界面，则在基础模块的基础上再勾选 dxUi。

### 2.4 应用说明

1. 总体说明：

- VSCode 提供 dejaos 插件，根据需求在 `app.dxproj` 里选择好组件及版本（通常使用最新版本），手动点击 `install` 会自动下载所有组件 JS 源码到 `dxmodules` 目录下，可以参考这些源码的 API 来编写代码。如果在 `dxmodules` 下找不到对应的 JS 文件，提示用户在 `app.dxproj` 勾选对应组件，并点击插件里的 `install` 按钮。
- 不同于 **Node.js** 的单线程事件循环，dejaos 应用是多 worker 模式，单一 worker 内仍是单线程执行。虽然支持 `dxStd.setTimeout` 和 `dxStd.setInterval`，但在同一个 worker 中它们属于“伪异步”（依然按顺序执行）。
- main.js 只做各种组件及 worker 的初始化，而不做具体的业务
- 不用 quickjs 原生的初始化 worker 函数，使用 dxEventBus 的 newWorker 来替代
- 大部分应用用不到所有组件，只需要部分组件即可完成功能
- 所有资源包括图片，字体文件等约定放在和 src 同级的 resource 目录下。
- 代码中引用资源文件（图片、字体）时，请使用绝对路径，例如: `dxui.Image.build('img1', parent).source('/app/code/resource/logo.png')`
- dejaos运行在嵌入式设备上，内存和CPU资源有限。避免创建大型对象、长时间运行的循环，及时释放不再需要的引用。
- 未捕获的异常可能导致当前Worker完全停止运行。务必使用try-catch包裹可能出错的代码，尤其在硬件操作、网络请求、文件IO等边界操作中。
- 所有组件模块都位于`dxmodules`目录下，导入时需使用正确的相对路径（如`import log from "../../dxmodules/dxLogger.js"`）。注意文件位置深度，避免因文件移动导致导入失败。不同于Node.js的node_modules机制。
- 图片、字体等资源文件应尽量压缩以减少体积。图片格式建议使用PNG（带透明度）或JPEG（照片类），避免使用过大的位图。字体文件选择只包含必要字符集的TTF文件，中文字体尤其注意文件大小。
- `dxDriver`组件提供设备特定信息，如`dxDriver.DISPLAY.WIDTH/HEIGHT`获取屏幕尺寸，`dxDriver.CHANNEL.UART_PATH`获取串口设备路径。这些值因设备型号而异，避免硬编码。
- 频繁创建字体对象影响性能。推荐通过`UIManager.font(size, style)`获取字体，内部会缓存已创建的字体对象。避免在每次渲染时都创建新字体。

2. UI 相关

- ui 使用独立 worker，不放在主线程
- 包括的 js: `dxmodules\dxUi.js`以及所有的`dxmodules\ui*.js`，包含：

  - `uiBase.js`: UI 基类，所有控件继承自它，提供宽高、位置、事件、样式等通用方法
  - `uiButton.js`: 按钮控件
  - `uiButtons.js`: 按钮矩阵（组）控件
  - `uiCheckbox.js`: 复选框控件
  - `uiDropdown.js`: 下拉菜单控件
  - `uiFont.js`: 字体对象封装
  - `uiImage.js`: 图片显示控件
  - `uiKeyboard.js`: 屏幕键盘控件，支持拼音
  - `uiLabel.js`: 文本标签控件
  - `uiLine.js`: 线条绘制控件
  - `uiList.js`: 列表控件
  - `uiSlider.js`: 滑动条控件
  - `uiStyle.js`: 样式对象封装，用于设置控件样式
  - `uiSwitch.js`: 开关控件
  - `uiTextarea.js`: 多行文本输入控件
  - `uiUtils.js`: UI 工具类，包含常量、枚举、初始化及辅助函数
  - `uiView.js`: 基础容器视图，类似 div

- UI 页面的管理参考 UIManager.js，它实现了单屏多页面的栈式管理。
- 字体文件尽量选择小的文件，**如果 UI 文本包含中文或其他非英文字符，必须提供对应语言的 TTF 字体文件**，通常放在 `/app/code/resource/font/font.ttf`，并在代码中通过 `UIManager.font(size, style)` 显式获取字体对象，如果开发者使用的语言不是英文，回复时提醒用户准备对应的 TTF 文件
- `uiButton` 本身没有 `text` 属性，如需显示文字，必须在按钮内部再创建一个 `Label`，并在 `Label` 上设置 `text` / `textFont` 等属性
- `uiImage` 本身不支持点击事件，如需点击交互，必须在外层包裹一个透明的 `View`，然后在这个 `View` 上注册点击事件
- 如果初始化一个 UI 相关控件的父节点是 `dxui.Utils.LAYER.TOP`，就可以确保该 UI 永远显示在屏幕图层的最上层，一般用于弹出窗口或状态栏等
- `uiImage` 默认无法自动缩放里面的图片，需要让图标的大小和 Image 的大小一致
- `uiView` 默认带内边距，计算内部元素坐标前最后先设置 padAll(0),而且默认scrool是开的，通常需要调用scrool(false)

3. 串口相关

- 串口通信建议使用独立的 worker，不要在主线程中直接收发数据
- 串口通信主要使用 `dxmodules/dxUart.js`（串口主接口），必要时可以参考 `dxmodules/vgUartWorker.js` 的实现。
- 串口通信要用到的一些和设备相关的参数参考 `dxmodules/dxDriver.js`的 `dxDriver.CHANNEL`
- 串口通信发送和接收是异步的，可以使用 `dxmodules/dxEventBus.js` 里的 event 或 rpc 功能
- 串口通信的数据处理涉及到各种进制的处理，可以使用 `dxmodules/dxCommonUtils.js` 里的 codec 工具集合
- 串口如果需要设置波特率之类的，调用函数的示例是 `dxUart.ioctl(6, '921600-8-N-1')`
- 串口的 receive 函数比较特殊，如果接收到的数据没有达到 size 长度，会继续等待直到接收到 size 长度，但是如果 timeout 很短，就会有可能没收完就结束这一次操作，而且返回是空数据。

4. 数据库相关

- 一般优先使用 `dxmodules/dxSqliteDB.js` 做增删改查；一些非常简单、只按 key 存取的小数据，可以考虑使用 `dxmodules/dxKeyValueDB.js` 或 `dxmodules/kvdbWorker.js`。Key-Value 读写更快，但不支持 SQL，也不适合复杂查询。
- 数据库读写不一定要单独起 worker：简单、快速的查询或少量写入可以在任意 worker 中直接调用；只有耗时的批量操作或高频写入，才建议放到独立的数据库 worker。
- 如果数据库读写放在独立 worker 中，可以使用 `dxmodules/dxEventBus.js` 的 event 或 rpc 能力，在 UI / 业务 worker 和数据库 worker 之间传输数据。
- 我们约定 db 文件设置在 `/app/data/`下

5. 日志打印

- 统一使用 `dxmodules/dxLogger.js`，不要在业务代码里直接写 `console.log`。推荐写法：`import log from "../../dxmodules/dxLogger.js";` 然后用 `log.debug / log.info / log.error`。
- 日志函数支持多参数传入，例如：`log.info("HomePage onShow", data)`，无需手动拼接字符串。
- 对 `Error` 对象调用 `log.error(e)` 即可，logger 会自动展开 `message` 和 `stack`，不需要自己拼接。

6. 时间相关

- 时间同步和本机时间设置通常使用 `dxmodules/dxNtp.js`：负责和 NTP 服务器同步时间、设置系统时间，以及简单的时区/偏移配置（大多数应用只需要这个）。
- 全时区相关的计算和展示（比如世界时钟、多城市时间切换）可以使用 `dxmodules/dxTimeZones.js`，它内置了完整的时区数据和转换逻辑。

7. 网络管理

- 设备的网络连接需要由应用来管理控制，对应的组件是`dxmodules/dxNetwork.js`
- 正常情况下启动网络连接后，网络会自动尝试连接。即使断开后再恢复也会自动重连，无需显式的去再次调用连接函数

8. 人脸识别

- 推荐参考 demo：`test/src/worker/faceworker.js` + `test/src/worker/uiworker.js`
- 核心组件：`dxmodules/dxFacial.js`
- **线程原则**：`face.loop()` 放在独立 `faceWorker`；UI 线程只做渲染/交互（需要画框时读取 `face.getDetectionData()`）。
- **必用 API**：`face.init()`、`face.loop()`、`face.setCallbacks({ onRecognition })`。
- **识别结果处理**：在 `onRecognition(event)` 里拿到 `event.userId / event.picPath / event.compareScore / event.rect / event.is_rec / event.isCompare` 等字段，并通过 `dxEventBus` 转发给 UI/业务继续流程（例如开门/称重/记录）。
- **录入（可选，2 种方式）**：
  - **摄像头采集注册**：`face.getFeaByCap(timeoutMs)` -> `face.addFea(userId, feature)`（覆盖前可 `face.deleteFea(userId)` 或用 `face.updateFea`）。
  - **人脸照片注册**：`face.getFeaByFile(filePath)` -> `face.addFea(userId, feature)`（照片路径为本地文件路径）。

9. 看门狗

- 核心组件：`dxmodules/dxWatchdog.js`
- 职责：提供硬件和软件看门狗支持，用于在程序跑飞或死锁时自动重启系统。
- 多通道支持：支持多个独立通道（Channel），可为不同线程（Worker）分配独立通道，只有所有启用的通道都及时喂狗，系统才不会重启。
- 推荐用法：
  - 在主线程 `main.js` 中通过 `watchdog.init()` 初始化。
  - 使用 `watchdog.enable(channel, true)` 开启通道。
  - 使用 `watchdog.start(timeout_ms)` 设置全局重启超时时间。
  - 使用 `watchdog.restart(channel)` 定期（如每 5 秒）进行喂狗操作。

10. Http

- **核心组件**：使用 `dxmodules/dxHttpClient.js`。它是无状态的，每次请求都会创建独立的 Native 实例，确保线程安全。
- **返回结构**：`dxHttpClient` 的所有请求方法（get/post/request 等）返回对象格式为 `{ code, status, message, data }`：
    - `code`: Native 层执行结果，**0 表示成功**，其它值表示网络超时、DNS 失败等。
    - `status`: HTTP 状态码，如 **200 表示成功**。
    - `data`: 响应体字符串，通常需要 `JSON.parse(result.data)`。
    - `message`: 错误描述信息。


## 3. 核心代码模板

### 3.1 UI 页面标准写法 (配合 UIManager)

```javascript
import dxui from "../../dxmodules/dxUi.js";
import log from "../../dxmodules/dxLogger.js";
import dxDriver from "../../dxmodules/dxDriver.js";
import utils from "../../dxmodules/dxCommonUtils.js";
import UIManager from "../UIManager.js"; // 假设 UIManager 在 src 目录下

const MyPage = {
  id: "myhomePage",
  // 页面初始化，只执行一次
  init: function () {
    // 1. 获取 UIManager 的根节点作为父节点
    const parent = UIManager.getRoot();

    // 2. 创建页面的根 View (全屏)
    this.root = dxui.View.build(this.id, parent);
    this.root.setSize(dxDriver.DISPLAY.WIDTH, dxDriver.DISPLAY.HEIGHT);
    this.root.radius(0);
    this.root.borderWidth(0);
    this.root.padAll(0);

    this.root.bgColor(0x000000); // 背景色

    // 3. 创建子控件
    this.initView();

    // 4. 必须返回根节点
    return this.root;
  },

  initView: function () {
    // 示例：创建一个按钮（Button + 内部 Label）
    this.btn = dxui.Button.build(this.id + "_btn", this.root);
    this.btn.setSize(100, 50);
    this.btn.align(dxui.Utils.ALIGN.CENTER, 0, 0);

    // 按钮添加文本标签
    this.btnLabel = dxui.Label.build(this.id + "_btn_label", this.btn);
    this.btnLabel.textFont(UIManager.font(16, dxui.Utils.FONT_STYLE.BOLD));
    this.btnLabel.text("点击我");
    this.btnLabel.align(dxui.Utils.ALIGN.CENTER, 0, 0);

    // 按钮点击事件
    this.btn.on(dxui.Utils.EVENT.CLICK, () => {
      log.info("Button clicked");
    });

    // 示例：创建一个可点击的图标（Image + 外层透明 View）
    this.iconArea = dxui.View.build(this.id + "_icon_area", this.root);
    this.iconArea.setSize(48, 48);
    this.iconArea.bgOpa(0);
    this.iconArea.radius(0);
    this.iconArea.borderWidth(0);
    this.iconArea.padAll(0);
    // 使用绝对坐标放置在右上角，而不是 align 相对布局
    this.iconArea.setPos(dxDriver.DISPLAY.WIDTH - 48 - 16, 16);

    this.iconImage = dxui.Image.build(this.id + "_icon", this.iconArea);
    this.iconImage.source("/app/code/resource/image/icon_admin.png");
    this.iconImage.align(dxui.Utils.ALIGN.CENTER, 0, 0);

    // 使用 alignTo 示例：在图标下方放一个文字 Label
    this.iconLabel = dxui.Label.build(this.id + "_icon_label", this.iconArea);
    this.iconLabel.text("管理员");
    this.iconLabel.textFont(UIManager.font(14, dxui.Utils.FONT_STYLE.NORMAL));
    // 让文字相对于图标在下方居中对齐，向下偏移 4 像素
    this.iconLabel.alignTo(this.iconImage, dxui.Utils.ALIGN.BOTTOM_MID, 0, 4);

    this.iconArea.on(dxui.Utils.EVENT.CLICK, () => {
      log.info("Click admin icon");
    });
  },

  // 页面显示时触发，data 为传递过来的参数
  onShow: function (data) {
    if (data) {
      log.info("Received data:", data);
    }
  },

  // 页面隐藏时触发
  onHide: function () {},
};

export default MyPage;
```

### 3.2 UI Worker 入口 (uiWorker.js)

```javascript
import dxui from "../dxmodules/dxUi.js";
import log from "../dxmodules/dxLogger.js";
import std from "../dxmodules/dxStd.js";
import UIManager from "./UIManager.js"; // 假设 UIManager 在 src 目录下
import HomePage from "./pages/HomePage.js"; // 导入页面

try {
  // UI 初始化配置
  dxui.init({ orientation: 1 });

  // 1. 初始化 UIManager
  UIManager.init();

  // 2. 注册页面
  UIManager.register("home", HomePage);

  // 3. 打开首页
  UIManager.open("home");

  // 4. 开启 UI 事件循环
  std.setInterval(() => {
    dxui.handler();
  }, 20);
} catch (error) {
  log.error(error);
}
```

### 3.3 主线程 (main.js)

```javascript
import bus from "../dxmodules/dxEventBus.js";
import log from "../dxmodules/dxLogger.js";
function init() {}
// 1. 初始化一些硬件相关的，比如GPIO，PWM等等
try {
  init();
} catch (e) {
  log.error("init error", e);
}
// 2. 创建 Worker
const uiWorker = bus.newWorker("uiWorker", "/app/code/src/uiWorker.js");
```
