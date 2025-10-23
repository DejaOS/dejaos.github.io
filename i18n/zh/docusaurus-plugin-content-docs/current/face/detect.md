# 示例：人脸检测与跟踪框

---

## 简介

本章节将通过一个完整的示例，详细讲解如何实现最基础的人脸检测功能：在摄像头实时画面上动态绘制跟踪人脸的矩形框。这是所有人脸识别应用的起点。

我们将采用**双线程（Worker）模型**来构建此应用，将**人脸处理**与**UI 渲染**分离，这是确保复杂应用流畅运行的最佳实践。基本流程如下：

1.  **主线程 (`main.js`)**: 启动两个工作线程：一个用于人脸处理，一个用于 UI。
2.  **人脸线程 (`faceworker.js`)**: 独立负责初始化 `dxFacial` 组件并驱动其内部循环。
3.  **UI 线程 (`uiworker.js`)**: 负责 UI 初始化，并周期性地从 `dxFacial` 获取人脸位置数据，然后绘制跟踪框。

---

## 代码实现

### main.js：启动入口

```javascript
import log from "../dxmodules/dxLogger.js";
import bus from "../dxmodules/dxEventBus.js";

function init() {
  bus.newWorker("screen", "/app/code/src/worker/uiworker.js");
  bus.newWorker("face", "/app/code/src/worker/faceworker.js");
}
try {
  init();
} catch (error) {
  log.error(error);
}
```

#### 代码解析

入口文件 `main.js` 的逻辑非常简单，它只做一件事：创建并启动两个独立的 Worker 线程，分别用于处理 UI (`uiworker.js`) 和人脸识别 (`faceworker.js`)。这种分离可以防止耗时的人脸算法阻塞 UI 刷新，保证界面的流畅性。

### faceworker.js：人脸引擎处理线程

```javascript
import face from "../../dxmodules/dxFacial.js";
import log from "../../dxmodules/dxLogger.js";
import std from "../../dxmodules/dxStd.js";
try {
  face.init();
} catch (error) {
  log.error(error);
}
std.setInterval(() => {
  try {
    face.loop();
  } catch (error) {
    log.error(error);
  }
}, 20);
```

#### 代码解析

人脸处理线程 (`faceworker.js`) 的职责非常专一：

1.  **初始化 `dxFacial` 组件**：调用 `face.init()` 来启动人脸识别引擎。
2.  **周期性驱动引擎**：通过 `std.setInterval` 定时调用 `face.loop()`。这个函数是 `dxFacial` 组件的“心跳”，它驱动引擎内部处理摄像头数据、执行检测/识别算法，并管理事件队列。**即使当前示例不处理识别事件，这个轮询也必须存在**，否则引擎将不会工作。

### uiworker.js：UI 渲染与交互线程

```javascript
import log from "../../dxmodules/dxLogger.js";
import std from "../../dxmodules/dxStd.js";
import dxui from "../../dxmodules/dxUi.js";
import face from "../../dxmodules/dxFacial.js";

let faceview = null;
try {
  dxui.init({ orientation: 1 });
  let mainview = dxui.View.build("mainview", dxui.Utils.LAYER.MAIN);
  mainview.bgOpa(0); // background opacity
  mainview.scroll(false);

  faceview = dxui.View.build("faceview", mainview);
  faceview.bgOpa(0);
  faceview.radius(0);
  faceview.padAll(0);
  faceview.setSize(200, 200);
  faceview.borderWidth(5);
  faceview.setBorderColor(0xff0000);
  faceview.hide();

  dxui.loadMain(mainview);
} catch (error) {
  log.error(error);
}
function showFaceView() {
  // [{"id":4,"status":1,"rect":[8,224,360,668],"qualityScore":26,"livingScore":41}]
  let detectionData = face.getDetectionData();
  if (faceview && detectionData && detectionData.length > 0) {
    faceview.show();
    faceview.setPos(detectionData[0].rect[0], detectionData[0].rect[1]);
    faceview.setSize(
      detectionData[0].rect[2] - detectionData[0].rect[0],
      detectionData[0].rect[3] - detectionData[0].rect[1]
    );
  } else if (faceview) {
    faceview.hide();
  }
}
std.setInterval(() => {
  try {
    showFaceView();
    dxui.handler();
  } catch (error) {
    log.error(error);
  }
}, 15);
```

---

## 核心逻辑详解

### 1. 透明 UI 与摄像头画面叠加

这是实现该功能最关键的一点。摄像头的实时视频流默认渲染在屏幕的最底层。为了能在视频上叠加 UI（如人脸框），我们的 UI 主容器 (`mainview`) 背景必须设置为**完全透明** (`mainview.bgOpa(0)`)。否则，UI 将会完全遮挡住摄像头画面，导致无法看到人脸。

同时，用于绘制人脸框的 `faceview` 也设置了透明背景和红色边框，这样它就表现为一个中空的矩形。

### 2. 实时获取与解析人脸数据

UI 线程通过高频的 `setInterval` 循环（15ms）来不断刷新界面。在每次循环中：

- `face.getDetectionData()`: 此函数**高频、低耗时**地从 `dxFacial` 引擎获取最新一帧的人脸检测结果。
- **解析数据**：如果返回的 `detectionData` 数组不为空，说明检测到了人脸。程序会取出第一个人脸的数据，根据其 `rect` 坐标来更新 `faceview` 的位置和大小。
- **UI 更新**：`dxui.handler()` 负责将 `faceview` 的位置和大小变化渲染到屏幕上。

如果 `detectionData` 为空，则隐藏 `faceview`。这一系列操作最终实现了人脸框实时跟随人脸移动的效果。

---

## 数据结构解析：`getDetectionData`

`getDetectionData()` 返回一个数组，每个元素代表一个检测到的人脸对象。其结构如下：

```json
[
  {
    "id": 4,
    "status": 1,
    "rect": [8, 224, 360, 668],
    "qualityScore": 26,
    "livingScore": 41
  }
]
```

- **`id`**: 当前帧中人脸的唯一标识。用于区分多张人脸。注意：同一个人离开画面后再次进入，`id` 可能会改变。
- **`rect`**: 一个包含四个值的数组 `[x1, y1, x2, y2]`，分别代表矩形框左上角的 `(x1, y1)` 坐标和右下角的 `(x2, y2)` 坐标。
- **`qualityScore`**: 人脸质量得分。
- **`livingScore`**: 活体检测得分（如果开启）。

---

## 运行效果

![detect](/img/ui/facedetect.png)

---

## 总结

以上示例完整地演示了如何使用 `dxFacial` 和 `dxUi` 实现一个基本的人脸检测与跟踪应用。

核心要点在于：

- **线程分离**：使用 Worker 将耗时的 `dxFacial` 操作与 `dxUi` 渲染分离，避免互相阻塞。
- **UI 透明叠加**：通过设置 UI 背景透明，实现在摄像头实时画面上绘制自定义内容。
- **高/低频分离**：使用低频的 `face.loop()` 处理引擎事件，高频的 `face.getDetectionData()` 更新 UI，实现高效渲染。

这个简单的示例构成了所有人脸识别应用的基础。在后续章节中，我们将在此基础上构建更复杂的人脸注册和识别功能。

[源码](https://github.com/DejaOS/DejaOS/tree/main/demos/vf203_v12/vf203_v12_face_detect)