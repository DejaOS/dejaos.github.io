# UI 动画演示

本示例展示 DejaOS 上的多种 UI 动画效果，包括加载动画、人物与星星动效、以及 GIF 播放场景。

:::info 特别说明
本示例重点用于动画表现与交互节奏验证，适合做视觉效果确认与动画性能调优。
:::

## 视频演示

<iframe
  width="315"
  height="560"
  src="https://www.youtube.com/embed/dBSj-O9scw0"
  title="UI 动画演示"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>

## 功能特性

- **多场景轮播**：在 `page1`、`page2`、`page3` 之间每 10 秒循环切换。
- **丰富动画类型**：包含 Loader 组合动画、云朵漂移、星星闪烁、人物表情切换。
- **GIF 渲染演示**：展示原生 GIF 的挂载、暂停与恢复播放流程。
- **单屏多视图架构**：通过自定义 `UIManager` 实现页面懒加载、显示隐藏与返回栈管理。

## 源码结构说明

参考源码：[DejaOS 仓库 · `apps/features/ui_animation_demo`](https://github.com/DejaOS/DejaOS/tree/main/apps/features/ui_animation_demo)

- `src/main.js`：应用入口、UI 初始化、页面注册与定时轮播。
- `src/UIManager.js`：全局根视图管理与页面生命周期路由。
- `src/pages/page1.js`：Loader 风格动画页面。
- `src/pages/page2.js`：人物与星星动画页面。
- `src/pages/page3.js`：GIF 展示页面。

---

**提示**：本示例在 `app.dxproj` 中配置的目标机型为 **VF203_V12**。若迁移到不同分辨率设备，建议同步调整布局尺寸与动画偏移参数。
