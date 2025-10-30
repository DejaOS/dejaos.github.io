# 示例：人脸注册与识别

---

## 简介

本章节将基于上一个[《示例：人脸检测与跟踪框》](./detect.md)的代码，通过增加少量代码，实现一个完整的人脸注册与识别应用。

我们将重点关注以下两点：

1.  **在 `faceworker.js` 中**:
    - 设置回调函数以接收**识别**结果。
    - 监听来自 UI 线程的事件，执行**注册**流程。
2.  **在 `uiworker.js` 中**:
    - 添加一个“注册”按钮。
    - 通过事件总线 (`dxEventBus`) 向 `faceworker.js` 发送注册请求。

---

## 代码变更

### faceworker.js：增加识别回调与注册逻辑

在 `faceworker.js` 的 `std.setInterval` 前，添加以下代码：

```javascript
// ... import anweisungen ...
// try { face.init() } catch ...

// 设置识别事件回调
face.setCallbacks({
  onRecognition: (event) => {
    // 当识别到已注册人脸时，此回调会被触发
    if (event.isRecognition) {
      log.info("识别成功，用户ID:", event.userId);
      // 此处可以添加业务逻辑，例如通过 bus 将 userId 发送给 UI 线程显示
    }
  },
});

// 监听从 UI 线程发来的注册事件
bus.on("register_facial_recognition", () => {
  log.info("开始执行人脸注册流程");
  try {
    const userId = "testuser"; // 示例：写死一个 userId
    const timeout = 5000; // 5秒超时

    // 为防止重复注册，先尝试删除该用户（在实际应用中，应由业务逻辑决定）
    face.deleteFea(userId);

    // 1. 从摄像头捕获人脸并提取特征值（这是一个同步阻塞操作）
    const res = face.getFeaByCap(timeout);

    if (res && res.feature) {
      log.info("特征值提取成功");
      // 2. 将特征值和 userId 添加到人脸库
      face.addFea(userId, res.feature);
      log.info("特征已成功添加到人脸库");
    } else {
      log.warn("注册失败：未能在超时时间内提取到有效特征");
    }
  } catch (ex) {
    log.error("注册流程异常", ex);
  }
});

// std.setInterval(() => { ... });
```

### uiworker.js：增加注册按钮与事件发送

在 `uiworker.js` 的 `dxui.loadMain(mainview)` 前，添加以下代码：

```javascript
// ...
// faceview = dxui.View.build(...)
// ...

// 创建一个注册按钮
let register = dxui.Button.build("register", mainview);
register.setSize(200, 50);
register.align(dxui.Utils.ALIGN.BOTTOM_MID, 0, -20);
let label = dxui.Label.build("registerlabel", register);
label.align(dxui.Utils.ALIGN.CENTER, 0, 0);
label.text("注册");

// 监听按钮点击事件
register.on(dxui.Utils.EVENT.CLICK, () => {
  log.info("注册按钮被点击, 发送 'register_facial_recognition' 事件");
  // 通过 bus 向 faceworker 发送注册请求
  bus.fire("register_facial_recognition");
});

// dxui.loadMain(mainview);
// ...
```

---

## 核心逻辑详解

### 1. 事件驱动的识别流程

- **`face.setCallbacks({ onRecognition: ... })`**: 此函数用于注册一个回调。当 `faceworker.js` 中的 `face.loop()` 检测到摄像头前的人脸，并成功在人脸库中匹配到已注册的特征时，`onRecognition` 回调函数就会被**异步触发**。
- **`event` 对象**: 回调函数接收的 `event` 对象包含了丰富的识别信息，其典型结构如下：
  ```json
  {
    "id": 4,
    "rect": [255, 436, 298, 378],
    "is_rec": true,
    "picPath": "/data/user/temp/22541180370.jpg",
    "isCompare": true,
    "compareScore": 0.85,
    "userId": "testuser",
    "feature": "base64..."
  }
  ```
  其中，`isRecognition` (或 `is_rec`) 字段标识是否识别成功，`userId` 是我们最关心的业务数据。

### 2. 同步阻塞的注册流程

- **`face.getFeaByCap(timeout)`**: 这是**从摄像头**注册流程的核心函数。它是一个**同步阻塞**调用，意味着程序会在此处暂停，直到成功从摄像头捕捉到高质量的人脸并提取出特征值，或者超时（本例中为 5 秒）。
- **`face.getFeaByFile(picPath)`** (补充说明): 与前者类似，这是**从图片文件**注册的核心函数。它也是一个**同步阻塞**调用，会直接从指定的图片路径 (`picPath`) 中提取人脸特征值。这为通过网络下发照片进行批量注册提供了可能。
- **必须在 Worker 中执行**: 正因为这两个函数都会阻塞，所以**绝对不能在 UI 线程 (`uiworker.js`) 中调用它们**，否则会冻结整个界面。将其放在 `faceworker.js` 中并通过事件触发，是正确的处理方式。
- **返回值**: `getFeaByCap` 或 `getFeaByFile` 成功后都会返回一个包含特征值 (`feature`) 的对象，可用于后续的 `face.addFea` 操作。
  ```json
  {
    "quality_score": 33,
    "picPath": "/data/user/temp/1761815859308.jpg",
    "rect": [78, 211, 456, 593],
    "feature": "IegcIOXnUAtG4ksc4d76Ig+1BUM..."
  }
  ```

### 3. 线程间通信

UI 线程和人脸处理线程通过 `dxEventBus` 进行解耦通信。UI 线程只负责发送一个意图（`bus.fire('register_facial_recognition')`），而人脸线程则负责监听这个意图（`bus.on(...)`）并执行具体的、耗时的业务逻辑。

---

## 总结

本示例在人脸检测的基础上，成功集成了**注册**和**识别**两大核心功能。通过本章，我们学习到了：

- 如何通过设置回调函数来**异步处理**人脸识别成功事件。
- 如何将**同步阻塞**的注册操作放在 Worker 线程中执行，以避免 UI 卡顿。
- 如何利用事件总线 `dxEventBus` 实现 UI 线程与业务线程之间的**安全通信**。

虽然一个商业级的人脸识别应用还需要更完善的 UI 交互和错误处理，但本示例已经完整地演示了其核心技术逻辑。

[源码](https://github.com/DejaOS/DejaOS/tree/main/demos/vf203_v12/vf203_v12_face_registe_recognition)
