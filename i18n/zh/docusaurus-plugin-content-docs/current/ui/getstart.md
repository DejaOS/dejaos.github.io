# UI 的 Hello World

让我们从一个最简单的 Hello World 示例开始，通过它来理解 dxUi 的基本概念。

## 完整代码

```javascript
import dxui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";
import logger from "../dxmodules/dxLogger.js";

dxui.init({ orientation: 1 });

const screenMain = dxui.View.build("mainid", dxui.Utils.LAYER.MAIN);
const button = dxui.Button.build("buttonid", screenMain);
button.setPos(100, 400);
button.setSize(400, 400);

const buttonLabel = dxui.Label.build("buttonLabelid", button);
buttonLabel.text("Click me");
buttonLabel.setPos(150, 200);

button.on(dxui.Utils.EVENT.CLICK, () => {
  logger.info("Button clicked");
});

dxui.loadMain(screenMain);

std.setInterval(() => {
  dxui.handler();
}, 10);
```

## 运行效果

![ui helloworld](/img/ui/helloworld.png)

## UI 结构分析

虽然这是一个最简单的示例，但它展示了 LVGL 的树状 UI 结构：

```
screenMain (View)
  └── button (Button)
        └── buttonLabel (Label)
```

简单来说，我们在屏幕上创建了一个按钮，并在按钮内添加了文字标签。

---

## 代码详解

接下来我们逐行分析代码的含义。

### 1. 导入模块

```javascript
import dxui from "../dxmodules/dxUi.js";
```

引入 dxUi 模块。dxUi 由多个 JavaScript 文件组成，在 `dxmodules` 目录下可以看到：

- `dxUi.js` - 主入口文件
- `uiBase.js` - 基础类
- `uiButton.js` - 按钮控件
- `uiUtils.js` - 工具函数
- 等等...

虽然 dxUi 内部包含多个文件，但我们只需要导入 `dxUi.js` 即可，它会自动加载其他依赖文件。

### 2. 初始化 UI

```javascript
dxui.init({ orientation: 1 });
```

初始化 dxUi，**必须在所有 UI 操作之前执行，且只需执行一次**。

参数说明：

- `orientation`：屏幕方向
  - `0`、`1`、`2`、`3` 分别表示设备屏幕的 4 个方向
  - 默认值为 `1`

### 3. UI 刷新循环

```javascript
std.setInterval(() => {
  dxui.handler();
}, 10);
```

LVGL 的图形绘制流程分为两步：

1. 在内存中绘制控件
2. 轮询将内存中的图像更新到屏幕

这是所有图形引擎的基本流程，只是大部分图形引擎将这一步隐藏了。

上面的代码每隔 **10 毫秒**刷新一次屏幕。刷新间隔建议设置在 `5~50` 毫秒之间：

- **太小（< 5ms）**：会过度占用 CPU 资源
- **太大（> 50ms）**：图形刷新太慢，导致界面卡顿

:::warning 注意
不能在 UI 线程中执行耗时操作，否则会阻塞界面刷新，导致界面卡顿或无响应。
:::

### 4. 构建 UI 控件

```javascript
const screenMain = dxui.View.build("mainid", dxui.Utils.LAYER.MAIN);
const button = dxui.Button.build("buttonid", screenMain);
const buttonLabel = dxui.Label.build("buttonLabelid", button);
```

#### 创建 View（视图容器）

```javascript
const screenMain = dxui.View.build("mainid", dxui.Utils.LAYER.MAIN);
```

创建一个 ID 为 `'mainid'` 的 View 控件。View 是最基本的矩形容器，通常作为其他控件的父节点。

它的父节点是 `dxui.Utils.LAYER.MAIN`，这是 LVGL 定义的基础图层之一。LVGL 将屏幕从下到上分为 3 个图层：

| 图层   | 说明                   |
| ------ | ---------------------- |
| `MAIN` | 主图层，最常用         |
| `TOP`  | 顶层，永远在主图层之上 |
| `SYS`  | 系统层                 |

`dxui.View.build('mainid', dxui.Utils.LAYER.MAIN)` 在主图层上创建一个 View 对象，**默认占满整个屏幕**。

#### 创建 Button（按钮）

```javascript
const button = dxui.Button.build("buttonid", screenMain);
```

在 `screenMain` 上创建一个 ID 为 `'buttonid'` 的按钮控件。

:::tip ID 命名规则
每个控件对象的 ID 必须唯一，它是对象的唯一标识符。通过 ID 可以在任何地方获取到该对象。如果不需要获取该对象，可以使用随机值来确保 ID 唯一性。
:::

#### 创建 Label（文本标签）

```javascript
const buttonLabel = dxui.Label.build("buttonLabelid", button);
```

在 `button` 上创建一个 ID 为 `'buttonLabelid'` 的 Label 控件。

:::info LVGL 特性
在 LVGL 中，Button 不能直接设置文本，需要在其内部添加一个 Label 控件来显示文字。
:::

### 5. 设置控件属性

```javascript
button.setPos(100, 400);
button.setSize(400, 400);

buttonLabel.text("Click me");
buttonLabel.setPos(150, 200);
```

我们可以看到 `button` 和 `buttonLabel` 都可以调用 `setPos()` 和 `setSize()` 方法。这是因为所有 UI 对象都继承自同一个基类，基类包含了所有公共属性和方法（如坐标、大小等）。

**公共方法**（所有控件都有）：

- `setPos(x, y)` - 设置位置
- `setSize(width, height)` - 设置尺寸
- 更多方法可查看 `dxmodules/uiBase.js`

**特有方法**（Label 专有）：

- `text('Click me')` - 设置文本内容
- 更多方法可查看 `dxmodules/uiLabel.js`

### 6. 绑定事件

```javascript
button.on(dxui.Utils.EVENT.CLICK, () => {
  logger.info("Button clicked");
});
```

使用 `on()` 方法为按钮绑定事件处理函数。LVGL 支持多种事件类型：

- `CLICK` - 点击事件
- `LONG_PRESS` - 长按事件
- `PRESSED` - 按下事件
- `RELEASED` - 释放事件
- 更多事件类型可查看 `dxmodules/uiUtils.js`

上面的代码表示：当用户点击按钮时，会在日志中输出 `'Button clicked'`。

### 7. 加载并显示界面

```javascript
dxui.loadMain(screenMain);
```

前面构建的所有控件都只是在内存中创建，并未显示到屏幕上。**只有调用 `loadMain()` 后，才会将内存中的 UI 对象真正渲染到屏幕上**。

这种机制的优势：

- 可以提前在内存中构建多个界面
- 根据需求动态切换显示不同的界面
- 这也是实现**页面跳转**的基本原理

:::info 生命周期
`loadMain()` 加载新对象和卸载旧对象时，会触发相应的生命周期函数，这部分内容将在后续章节详细介绍。
:::

---

## 总结

虽然这是一个简单的示例，但它包含了 LVGL/dxUi 开发的核心概念：

- ✅ **模块导入** - 引入必要的模块
- ✅ **初始化** - 配置屏幕方向等参数
- ✅ **UI 刷新循环** - 定期更新屏幕显示
- ✅ **控件层级** - 树状父子结构
- ✅ **属性设置** - 位置、尺寸、文本等
- ✅ **事件处理** - 响应用户交互
- ✅ **界面加载** - 将 UI 渲染到屏幕

掌握这些基础概念后，你就可以开始构建更复杂的图形界面了！
