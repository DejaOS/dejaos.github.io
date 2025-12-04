# UI 管理最佳实践

本文档基于 **“单 Screen 多 View”** 的设计理念，详细阐述在开发复杂 DejaOS 应用时，如何通过标准化的页面管理机制来避免逻辑混乱，实现高效的页面导航和状态管理。为实现这一设计，我们提供了 `UIManager.js` 作为参考实现。

---

## 1. 背景与设计初衷

在 DejaOS 应用开发中，随着业务增长，页面数量很容易从几个增加到几十个。如果没有统一的管理机制，开发者往往会陷入以下“页面地狱”：

- **导航混乱**：页面 A 打开 B，B 打开 C，C 又要回 A，导致层级不清。
- **状态管理混乱**：多个页面共存时，若缺乏统一管理，容易出现重复创建 UI、不知道当前哪个页面处于激活状态等问题。
- **数据传递困难**：页面间参数传递和结果回传（如选择联系人后返回）逻辑复杂。

`UIManager` 借鉴了 Android 的 `Activity` 栈管理和 Web 的路由思想，采用 **“单 Screen 多 View”** 模式，提供了一套轻量级的生命周期和导航管理方案。虽然所有页面常驻内存会增加一定的内存开销，但在页面数量可控的 DejaOS 应用中，这种 **“空间换架构复杂度”** 的策略带来了显著的结构清晰度和开发效率。

---

## 2. 核心概念与生命周期

在 `UIManager` 体系中，每一个“页面”都是一个 **单例 (Singleton)** 的 JS 对象。

### 2.1 View 对象的标准结构

一个标准的 View 对象必须包含以下生命周期方法：

| 生命周期方法 | 说明 | 触发时机 | 备注 |
| :--- | :--- | :--- | :--- |
| **init()** | **初始化** | 页面**首次**被打开时调用 | 必须返回 UI 根节点。用于创建 UI 结构，仅执行一次（懒加载）。 |
| **onShow(data)** | **显示/激活** | 页面被 `open` 主动打开时调用 | 接收参数 `data`。用于刷新数据、绑定事件监听。注：从子页面返回（close/backTo）默认**不触发**此方法。 |
| **onHide()** | **隐藏/挂起** | 打开新页面、或当前页面被关闭前调用 | 用于暂停动画、解绑高频事件等。 |
| **onClose(id, res)**| **结果回调** | 子页面关闭并返回数据时调用 | 用于接收子页面 `close(result)` 传回的数据。 |

### 2.2 注册机制 (Registration)

在使用前，必须将 View 对象注册到管理器中。`UIManager` 会通过 **Mixin (混入)** 技术，自动给 View 对象注入 `open`, `close`, `backTo` 等导航能力，并初始化其内部状态（如 `id`, `parent`）。

```javascript
import uiManager from './UIManager.js';
import HomeView from './HomeView.js';

// 注册：将对象绑定到字符串 ID
uiManager.register('home', HomeView);
```

---

## 3. 页面栈管理与防循环机制

这是 `UIManager` 最核心的特性。它维护了一个隐式的“页面链表”，通过 `parent` 指针追踪导航历史。

### 3.1 标准导航流程 (A -> B -> C)

当 A 打开 B，B 打开 C 时，形成如下链表：

```text
[Root] <--> [A] <--> [B] <--> [C] (Current)
```

- **Open**: `B` 打开 `C` 携带参数。`C` 显示（触发 `onShow(data)`），`B` 隐藏（触发 `onHide`）。
- **Close**: `C` 关闭并返回结果。`C` 隐藏（触发 `onHide`），`B` 恢复显示（**不触发** `onShow`），但会触发 `B.onClose('C', result)` 接收数据。

### 3.2 定向回退 (BackTo)

当用户完成一连串操作后，可能需要直接返回到某个上层页面（例如：`Home -> List -> Detail -> Result -> Home`）。使用 `this.backTo('Home')` 可以一步到位。

**处理流程：**

1.  隐藏当前页面。
2.  在历史栈中查找目标页面 `Home`。
3.  **剪除中间节点**：当前页面与目标页面之间的所有页面（如 `List`, `Detail`）将直接从栈中移除（断开引用），**不会**触发这些中间页面的 `onClose` 或 `onHide`。
4.  显示目标页面 `Home`（**不触发** `onShow`）。
5.  如果在 `backTo` 中传递了结果数据，`Home.onClose(sourceId, result)` 会被触发。

### 3.3 防循环引用 (Clear Top)

`UIManager` 内置了自动循环检测机制，防止出现 `A -> B -> C -> A` 这种无限递归的导航结构。

**策略**：
如果尝试 `open` 一个已经在历史导航链中的页面（例如在 `C` 页面打开 `A`），管理器会将其视为一次 **"回退并刷新"** 操作：
1.  自动关闭当前页面及中间所有页面（执行 `backTo` 逻辑）。
2.  复用已存在的 `A` 页面实例。
3.  调用 `A.onShow(data)` 传入新参数，完成跳转。

这一机制类似于 Android 的 `FLAG_ACTIVITY_CLEAR_TOP`，确保了应用导航结构的扁平化和稳定性。

---

## 4. UIManager 实现原理简述

为了支撑上述功能，`UIManager.js` 内部实现了以下关键逻辑：

### 4.1 懒加载 (Lazy Initialization)
页面对象在注册时仅仅是一个普通的 JS 对象。只有在第一次 `open` 时，才会调用其 `init()` 方法创建 UI 控件。这种机制避免了启动时一次性创建所有页面，分散了 CPU 压力，加快了应用启动速度。

### 4.2 单 Screen 容器
`UIManager` 在初始化时创建一个全局的 `RootScreen` (Activity)。所有的 View 实际上都是这个 Screen 下的子容器。
- **Show**: 将 View 的根节点设为可见，并置顶。
- **Hide**: 将 View 的根节点隐藏。

### 4.3 链式指针 (Linked List as Stack)
虽然逻辑上我们称之为“页面栈”，但 `UIManager` 并没有维护一个数组栈。每个 View 实例在被打开时，`UIManager` 会自动将其 `parent` 属性指向发起打开的 View。
- `this._currentView`: 指向栈顶（当前显示的页面）。
- `View.parent`: 指向栈中的前一个页面。

通过遍历 `parent` 指针形成的单向链表，实现了虚拟的栈结构，从而支持 `backTo` 查找和循环检测。

---

## 5. Best Practices Summary

1.  **始终使用字符串 ID 导航**：不要直接引用对象，利用 `register` 解耦。
2.  **依赖 onShow 刷新数据**：不要假设 `init` 每次都会执行。页面可能只是从后台被唤醒（BackTo 或 Close 触发）。
3.  **善用 Close 返回数据**：子页面 `this.close({ status: 'ok' })` 是传递结果给父页面的最优雅方式，父页面在 `onClose` 中处理。
4.  **不要手动管理 UI 显隐**：交给 `UIManager` 的 `open/close` 处理，确保生命周期完整。

---

## 6. 代码示例

### 6.1 定义 View 组件

```javascript
import v from './viewUtils.js'; // 假设的 UI 工具库
import log from '../../dxmodules/dxLogger.js';

const HomeView = {
    // [必须] 初始化 UI，只执行一次
    init: function () {
        const screen = v.create('View'); // 创建根节点
        // ... 构建 UI 子节点 ...
        const btn = v.create(screen, 'Button');
        btn.click(() => {
            // 使用 Mixin 注入的 open 方法跳转
            this.open('detail', { id: 101 });
        });
        return screen; // 返回根节点
    },

    // [可选] 页面显示时触发
    onShow: function (data) {
        log.info('Home Shown with data:', data);
    },

    // [可选] 接收子页面返回的数据
    onClose: function (viewId, result) {
        if (viewId === 'detail') {
            log.info('Detail closed with result:', result);
        }
    }
};

export default HomeView;
```

### 6.2 注册与启动

```javascript
import uiManager from './ui/UIManager.js';
import HomeView from './ui/HomeView.js';
import DetailView from './ui/DetailView.js';

// 1. 注册页面
uiManager.register('home', HomeView);
uiManager.register('detail', DetailView);

// 2. 启动首页
uiManager.open('home');
```

---

## 7. 完整示例与源码

您可以从以下 GitHub 仓库下载完整的示例工程代码：

[https://github.com/DejaOS/DejaOS/tree/main/demos/vf203_v12/vf203_uimanager](https://github.com/DejaOS/DejaOS/tree/main/demos/vf203_v12/vf203_uimanager)

> **注**：虽然该示例放置在 `vf203` 目录下，但 `UIManager.js` 及其设计模式是通用的，**适用于所有带有屏幕的 DejaOS 设备**，不局限于特定型号。
