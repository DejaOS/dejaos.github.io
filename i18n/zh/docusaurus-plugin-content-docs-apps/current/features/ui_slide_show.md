# UI 轮播图演示

本示例实现 DejaOS 上的全屏图片轮播，包含平滑滑入滑出动画与预加载逻辑，用于降低切图时的卡顿感。

:::info 特别说明
本示例重点验证全屏图像切换的动画与时序控制，适合信息发布屏与待机展示场景。
:::

## 视频演示

<iframe
  width="315"
  height="560"
  src="https://www.youtube.com/embed/oOLv8cpxYec"
  title="UI 轮播图演示"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>

## 功能特性

- **全屏图片轮播**：按顺序播放本地图片列表。
- **平滑过渡动画**：双图层配合横向滑动实现切换效果。
- **预加载机制**：切换前预加载下一张图片，减少解码阻塞。
- **循环连续播放**：按固定间隔对配置图片列表持续轮播。

## 源码结构说明

参考源码：[DejaOS 仓库 · `apps/features/ui_slide_show`](https://github.com/DejaOS/DejaOS/tree/main/apps/features/ui_slide_show)

- `src/main.js`：屏幕初始化、双图层切换逻辑与定时轮播。
- `src/slideshowImages.js`：轮播图片路径列表配置。

---

**提示**：本示例在 `app.dxproj` 中配置的目标机型为 **VF203_V12**。在不同显示设备上建议按实际分辨率调整图片资源与动画参数。
