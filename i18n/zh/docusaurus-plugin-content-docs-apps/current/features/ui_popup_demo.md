# UI 弹窗演示

本示例展示 DejaOS 上常见弹窗交互样式，包括确认弹窗、权限提示、团队邀请卡片、验证码风格弹窗等。

:::info 特别说明
本示例主要用于弹窗 UI 风格与过渡交互验证，适合做交互原型评审与视觉迭代。
:::

## 视频演示

<iframe
  width="315"
  height="560"
  src="https://www.youtube.com/embed/QCcSDIJiXno"
  title="UI 弹窗演示"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>

## 功能特性

- **弹窗场景覆盖**：包含确认/取消、权限提示、邀请协作、验证码输入等典型弹窗。
- **页面自动轮播**：`page1` 与 `page2` 每 10 秒循环切换。
- **定时显隐效果**：弹窗按时间间隔自动隐藏/显示，演示动态交互状态。
- **可复用页面管理**：使用 `UIManager` 统一处理页面注册、懒初始化与视图栈。

## 源码结构说明

参考源码：[DejaOS 仓库 · `apps/features/ui_popup_demo`](https://github.com/DejaOS/DejaOS/tree/main/apps/features/ui_popup_demo)

- `src/main.js`：应用入口、页面注册与定时切换。
- `src/UIManager.js`：根屏幕与页面生命周期管理。
- `src/pages/page1.js`：弹窗展示页（第一组）。
- `src/pages/page2.js`：弹窗展示页（第二组）。

---

**提示**：本示例在 `app.dxproj` 中配置的目标机型为 **VF203_V12**。若部署到不同屏幕分辨率设备，需调整组件尺寸、间距与文本换行策略。
