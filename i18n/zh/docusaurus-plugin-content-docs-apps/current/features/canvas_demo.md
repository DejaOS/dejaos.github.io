# Canvas 示例

本示例基于 DejaOS SDK 4.0，演示 dxUi 2.0.6 新增的公开 `dxui.Canvas` 组件。页面在同一屏幕中安排了六组测试区域，便于开发者对照 API 调用与实际绘制结果。

:::info 示例范围
本项目主要用于验证 Canvas API 和介绍基本用法。界面设计侧重清晰展示函数覆盖情况，而不是作为正式产品页面使用。
:::

## 界面预览

![dxUi Canvas API 验证示例](https://raw.githubusercontent.com/DejaOS/DejaOS/main/apps/features/canvas_demo/screenshot/canvas-api-validation.png)

:::note 预览图说明
以上图片是依据已实现界面生成的 800 × 1280 模拟设备截图，并不是从物理设备屏幕拍摄或导出的真实截图。
:::

## 示例内容

- **基础图形绘制**：绘制矩形、连续线段、凸多边形、圆弧和文字。
- **像素与调色板操作**：逐像素设置颜色与透明度、设置索引色调色板以及读取像素值。
- **缓冲区与图片**：演示 Canvas 之间复制、原始像素缓冲区、图片描述符以及图片文件绘制。
- **图像变换**：演示旋转、缩放、旋转中心、目标偏移和抗锯齿。
- **模糊滤镜**：对指定区域或整个 Canvas 执行水平与垂直模糊。
- **Canvas 信息**：重新设置缓冲区尺寸，并读取当前 LVGL 图片描述信息。

## 主要 Canvas 函数

| 函数 | 作用 |
| --- | --- |
| `dxui.Canvas.build(id, parent)` | 在指定父组件下创建一个 Canvas 组件。 |
| `setBuffer(width, height, colorFormat)` | 分配 Canvas 像素缓冲区并指定 LVGL 颜色格式。 |
| `fillBg(color, opacity)` | 使用指定颜色和可选透明度填充整个 Canvas。 |
| `drawRect(x, y, width, height, drawDsc)` | 使用原生矩形描述符绘制矩形，可设置圆角、边框、渐变和阴影。 |
| `drawLine(points, drawDsc)` | 按照给定的有序坐标数组绘制连续线段。 |
| `drawPolygon(points, drawDsc)` | 绘制凸多边形，坐标点必须按照多边形边界顺序排列。 |
| `drawArc(x, y, radius, startAngle, endAngle, drawDsc)` | 使用圆弧描述符，在指定起止角度之间绘制圆弧。 |
| `drawText(x, y, maxWidth, drawDsc, text)` | 在指定最大宽度内绘制文字。 |
| `drawImg(x, y, source, drawDsc)` | 使用图片描述符绘制另一个 Canvas 或运行时图片文件。 |
| `setPxColor(x, y, color)` / `setPxOpa(x, y, opacity)` | 设置单个像素的颜色或透明度。 |
| `setPalette(index, color)` | 设置索引色 Canvas 的调色板条目。 |
| `getPx(x, y)` / `getImg()` | 读取像素值，或获取当前 Canvas 的图片描述信息。 |
| `copyBuf(source, x, y, width, height)` | 将 Canvas 或原始像素缓冲区复制到目标区域。 |
| `transform(source, angle, zoom, offsetX, offsetY, pivotX, pivotY, antialias)` | 对源图片进行旋转和缩放。角度单位为 0.1 度，缩放值 `256` 表示 100%。 |
| `blurHor(...)` / `blurVer(...)` | 对整个 Canvas 或指定矩形区域执行水平、垂直模糊。 |

Canvas 同时继承 `uiBase` 的通用组件方法，例如 `setPos()`、`setSize()` 和 `invalidate()`。

## 最小使用示例

```javascript
const canvas = dxui.Canvas.build('canvas', root)
canvas.setBuffer(320, 200, dxui.Utils.ENUM.LV_IMG_CF_TRUE_COLOR)
canvas.setPos(20, 80)
canvas.fillBg(0x091725)

canvas.drawLine(
  [[20, 120], [80, 60], [150, 130]],
  lineDescriptor
)
canvas.invalidate()
```

`lineDescriptor` 等绘制描述符需要通过 `dxui.Utils.GG.NativeDraw` 创建。创建 Canvas 之前应先初始化 `dxUi`，并保持正常运行 `dxui.handler()` 定时器。

## 使用注意事项

- `drawPolygon()` 只支持凸多边形，不应传入凹多边形或自相交的坐标点。
- 使用 `copyBuf()` 从另一个 Canvas 复制数据时，源 Canvas 与目标 Canvas 的颜色格式必须一致。
- 运行时图片路径应使用 `/app/code/resource/...` 格式。
- Canvas 缓冲区会占用设备内存，大面积高频重绘也会消耗较多 CPU。建议缩小动态区域并复用绘制描述符。

## 源码

完整源码：[DejaOS 仓库 · `apps/features/canvas_demo`](https://github.com/DejaOS/DejaOS/tree/main/apps/features/canvas_demo)

## 构建与运行

```bash
dejaos install
dejaos run
```

---

**提示**：本示例使用 **dxUi 2.0.6** 和 **DejaOS SDK 4.0**，界面按照 **800 × 1280** 竖屏分辨率设计。迁移到其他分辨率时，需要调整 Canvas 尺寸和坐标。
