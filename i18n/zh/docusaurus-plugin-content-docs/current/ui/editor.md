# 可视化 UI Editor

**DejaOS UI Editor** 是 VSCode DejaOS 插件内置的可视化所见即所得编辑器。`.ui` 文件是描述 dxUi 控件树的版本化 JSON 文档。编辑器直接修改这份 JSON，应用运行时再由 `uiLoader` 将它构建为真正的 dxUi 对象树。

:::info 职责划分
`.ui` 文件保存控件层级、唯一 ID、坐标尺寸和显示属性；事件与业务逻辑仍然写在 JavaScript 中，并在加载 `.ui` 后绑定。
:::

## 使用前准备

- 打开一个根目录包含 `app.dxproj` 的 DejaOS 项目。
- 在 IDE 中执行 **Install**，或使用对应 CLI 流程更新项目组件，并确认存在 `dxmodules/uiLoader.js`。
- `.ui` 文件、图片和 TTF 字体必须放在 `app.dxproj` 所在目录或其子目录中。
- 当前项目生成的 `dxmodules` 是组件 API 的最终依据。

## 创建和打开 `.ui` 文件

打开 VSCode 命令面板，执行 **DejaOS: Create UI File**，选择 DejaOS 项目并使用 `.ui` 扩展名保存。也可以手动创建一个空的 `.ui` 文件；首次打开时，编辑器会初始化一份版本 1 文档。

`.ui` 文件默认使用可视化编辑器打开。如果需要检查或修复 JSON，可使用 **Reopen Editor With → Text Editor** 切换为文本编辑器。

![DejaOS UI Editor](/img/ui/ui-editor.png)

编辑器主要分为四个区域：

1. **顶部工具栏**：设置画布宽高和缩放比例，并提供复制、粘贴、删除操作。
2. **Controls**：将控件拖到画布，或双击控件将其加入根节点。
3. **Layers**：显示真实的父子层级，也用于修改控件父节点。
4. **Properties**：编辑选中控件的基础属性和专有属性。

## 支持的控件

当前编辑器支持以下 dxUi 控件：

| 控件 | 用途 |
| --- | --- |
| `dxView` | 容器和矩形显示区域 |
| `dxButton` | 可点击的按钮容器 |
| `dxLabel` | 文本 |
| `dxImage` | 项目图片资源 |
| `dxButtons` | 按钮矩阵 |
| `dxCheckbox` | 复选框 |
| `dxDropdown` | 下拉选择 |
| `dxLine` | 多点连线 |
| `dxList` | 文本和按钮列表 |
| `dxSlider` | 数值滑块 |
| `dxSwitch` | 开关 |
| `dxTextarea` | 文本输入框 |

`dxButton` 本身没有文本属性。按钮需要显示文字时，应在按钮内部增加一个 `dxLabel` 子节点。

## 编辑界面

### 画布与坐标

默认画布为 `800 × 1280`，可在顶部工具栏修改宽高。当前编辑器使用绝对定位；控件的 `x`、`y` 坐标相对于它的直接父节点，并不一定相对于整个屏幕。

开始布局前应先把画布设置为目标设备分辨率。修改画布尺寸不会自动把已有控件适配到另一种分辨率。

### 选择、移动和对齐

- 在画布或 Layers 中单击控件即可选中。
- 按住 `Ctrl`、`Cmd` 或 `Shift` 可以增加或移除选中控件。
- 在画布空白区域拖出虚线框，可以框选多个控件。
- 可直接拖动或缩放已选中的一个或多个控件。
- 选中两个以上同级控件后，可在对齐面板中进行边缘对齐和中心对齐；选中三个以上同级控件后，还可以水平或垂直平均分布间距。

复制和粘贴既可以使用按钮，也可以使用 `Ctrl/Cmd+C` 和 `Ctrl/Cmd+V`。同一 DejaOS 项目中同时打开的两个 `.ui` 文件共享 UI 剪贴板，因此可以跨页面复制控件。不同 DejaOS 项目之间暂不支持粘贴，因为图片和字体的项目路径可能不同。

### 修改父节点

在 **Layers** 中将一个节点拖到 `root`、`dxView` 或 `dxButton` 上。确认后，该节点及其整棵子树会移动到新父节点下；原有子节点仍以被移动节点为父节点，而被移动节点本身的 `x`、`y` 会重新计算，使其靠近新父节点中心。

### 图片与字体

资源选择器只允许选择当前 DejaOS 项目中的文件：

- 图片：PNG、JPG/JPEG 或 BMP
- 字体：TTF

图片预览保留原始像素大小，超出 `dxImage` 控件的部分从左上角开始裁剪，不会自动拉伸，这与 dxUi/LVGL 的行为一致。建议让图片尺寸与 `dxImage` 控件匹配，也可以使用 **Match image size** 让控件匹配图片。

浏览器预览无法保证每种 TTF 都与设备完全一致。编辑器会正确保存 TTF 路径，但显示字体只是近似效果，最终文字布局仍需在目标设备上确认。

## 加载 `.ui` 文件

假设项目结构如下：

```text
app.dxproj
dxmodules/
  dxUi.js
  uiLoader.js
src/
  uiWorker.js
  pages/
    home.ui
resource/
  font/font.ttf
  image/logo.png
```

必须先初始化 dxUi，再调用 `uiLoader.loadUi()`：

```javascript
import dxui from '../dxmodules/dxUi.js';
import uiLoader from '../dxmodules/uiLoader.js';
import logger from '../dxmodules/dxLogger.js';
import std from '../dxmodules/dxStd.js';

dxui.init({ orientation: 1 });

const root = uiLoader.loadUi('/app/code/src/pages/home.ui');

root.loginButton.on(dxui.Utils.EVENT.CLICK, function handleLogin() {
  logger.info('Login button clicked');
});

dxui.loadMain(root);

std.setInterval(function refreshUi() {
  dxui.handler();
}, 20);
```

加载文件时使用 `/app/code/...` 形式的运行时绝对路径。`.ui` 文档中的图片和字体使用项目相对路径，`uiLoader` 会从 `/app/code` 解析这些资源。

SDK 2.0 应把这段代码放在专用 UI Worker 中；SDK 4.0 应在统一的主运行时中初始化和使用 UI。具体调用始终以当前项目生成的组件文件为准。

## 访问加载后的控件

每个控件 ID 必须是唯一且合法的 JavaScript 标识符。直接子节点会以属性形式挂到父节点上，因此可视化控件树同时也是 JavaScript 访问路径：

```text
root
└── contentView
    └── submitButton
        └── submitLabel
```

```javascript
root.contentView.submitButton.on(
  dxui.Utils.EVENT.CLICK,
  function submitForm() {
    root.contentView.submitLabel.text('已提交');
  }
);
```

点语法和方括号语法访问的是同一个直接子控件属性。控件 ID 固定时可以使用点语法；ID 保存在变量中或需要动态拼接时，应使用方括号语法：

```javascript
// 下面两种写法访问的是同一个控件。
root.contentView.submitButton;
root['contentView']['submitButton'];

const controlId = 'submitButton';
root.contentView[controlId].on(
  dxui.Utils.EVENT.CLICK,
  function submitForm() {
    root.contentView.submitLabel.text('已提交');
  }
);
```

两种写法都必须遵循实际的控件层级。`root[controlId]` 只查找 `root` 的直接子控件，并不会在所有后代控件中搜索。例如，动态命名的返回按钮是 `root` 的直接子控件时，可以使用 `root[prefix + 'BackButton']`；如果按钮位于 `contentView` 中，则应使用 `root.contentView[prefix + 'BackButton']`。

```javascript
const backButton = root[prefix + 'BackButton']; // 仅适用于 root 的直接子控件
const nestedBackButton = root.contentView[prefix + 'BackButton'];
```

ID 在单个 `.ui` 文件中必须唯一。如果多个 `.ui` 文件会同时加载到内存，其中的 ID 也应保持全局唯一。

:::tip 可点击的父容器
当父 `dxView` 负责处理点击时，内部仅用于显示的 View、Image 和 Label 可能拦截触摸命中。应对这些子对象调用 `clickable(false)`，让点击事件落到父容器。
:::

## 与 UIManager 配合使用

`uiLoader.loadUi()` 可以接收一个可选父节点。UIManager 页面可以把 `.ui` 根节点加载到管理器的公共根节点下，并从 `init()` 返回该根节点：

```javascript
import dxui from '../../dxmodules/dxUi.js';
import uiLoader from '../../dxmodules/uiLoader.js';
import UIManager from '../UIManager.js';

const SettingsPage = {
  init: function () {
    const root = uiLoader.loadUi(
      '/app/code/src/pages/settings.ui',
      UIManager.getRoot()
    );
    const self = this;
    root.backButton.on(dxui.Utils.EVENT.CLICK, function closeSettings() {
      self.close();
    });
    return root;
  }
};

export default SettingsPage;
```

启动时应先初始化 dxUi，再初始化 UIManager、注册页面并打开页面。UIManager 负责页面显示、隐藏和跳转，`.ui` 只负责界面控件树。

## 当前边界

- 编辑器当前使用绝对坐标，暂不提供响应式或相对布局编辑。
- `.ui` 文件不保存事件和业务逻辑。
- 图片和字体必须位于 DejaOS 项目目录内。
- 跨页面复制只支持同一项目中的 `.ui` 文件。
- 浏览器显示是设计预览；最终界面、字体、图片、触摸区域和性能需要在真实设备上验证。
