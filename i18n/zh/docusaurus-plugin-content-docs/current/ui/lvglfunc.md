# 调用原生 LVGL 函数

我们在 [UI 构建概述](./overview.md) 中提到，dxUi 是 LVGL C 库的一层 JavaScript 封装。虽然 dxUi 简化了许多常用功能，但在开发复杂界面时，您可能需要调用一些未被二次封装的 LVGL 原生函数。

本文将通过一个实例，说明 dxUi 对 LVGL 函数的封装规则，以及如何通过 dxUi 对象调用 LVGL 原生函数。

## 示例：图像变换

让我们通过一个图像旋转和缩放的例子，来学习如何调用 LVGL 原生函数。

### 完整代码

```javascript
import dxui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";
import logger from "../dxmodules/dxLogger.js";

dxui.init({ orientation: 1 });

const screenMain = dxui.View.build("pwdView", dxui.Utils.LAYER.MAIN);
const image1 = dxui.Image.build("image1", screenMain);
image1.source("/app/code/src/logo.png");
image1.setPos(10, 10);

const image2 = dxui.Image.build("image2", screenMain);
image2.source("/app/code/src/logo.png");
image2.setPos(300, 10);
image2.obj.lvImgSetAngle(900); // 900 = 90 degrees

const image3 = dxui.Image.build("image3", screenMain);
image3.source("/app/code/src/logo.png");
image3.setPos(100, 400);
image3.obj.lvImgSetZoom(512); // 256=100%, 512=200%

dxui.loadMain(screenMain);

std.setInterval(() => {
  dxui.handler();
}, 10);
```

### 运行效果

![ui lvgl function call](/img/ui/lvglfunc.png)

### 代码分析

上面的代码在屏幕上创建了三个图像控件：

- **image1**: 原图，位于左上角。
- **image2**: 旋转 90 度的图像。
- **image3**:放大 2 倍的图像。

我们注意到，`image2` 和 `image3` 的变换操作是通过 `.obj` 属性调用的：

```javascript
image2.obj.lvImgSetAngle(900);
image3.obj.lvImgSetZoom(512);
```

这正是调用 LVGL 原生函数的方式。接下来我们将详细解释其背后的原理。

---

## dxUi 封装层级

为了兼顾易用性和灵活性，dxUi 提供了两个层级的函数封装。

### 1. 便捷封装 (High-level Wrappers)

对于最常用的功能（如设置位置、尺寸），dxUi 提供了非常简洁的封装，使其更符合 JavaScript 的开发习惯。

例如，`setPos(x, y)` 就是一个便捷封装，它最终对应到 LVGL 的 `lv_obj_set_pos(obj, x, y)` 函数。

### 2. 原生函数映射 (Native Function Mapping)

LVGL 功能非常丰富，函数数量庞大。为了让开发者能使用所有 LVGL 功能，dxUi 将所有 `lv_` 开头的 C 函数，按照驼峰命名规则，一对一地映射到了 dxUi 对象的 `.obj` 属性下。

**映射规则：** C 函数的下划线命名 `lv_obj_set_size` 转换为 JavaScript 的驼峰命名 `lvObjSetSize`。

示例中的 `lvImgSetAngle` 和 `lvImgSetZoom` 就是原生函数映射。

| 场景         | C 函数 (LVGL)      | JS 调用 (dxUi)                 | 封装层级     |
| :----------- | :----------------- | :----------------------------- | :----------- |
| **设置位置** | `lv_obj_set_pos`   | `image.setPos(10, 10)`         | 便捷封装     |
| **设置角度** | `lv_img_set_angle` | `image.obj.lvImgSetAngle(900)` | 原生函数映射 |
| **设置缩放** | `lv_img_set_zoom`  | `image.obj.lvImgSetZoom(512)`  | 原生函数映射 |

:::tip 何时使用原生函数？
当您发现某个功能在便捷封装中找不到时（例如图像旋转、颜色矩阵变换等高级功能），可以查阅 [LVGL 官方文档](https://docs.lvgl.io/8.3/widgets/core/img.html)，找到对应的 C 函数名，然后按照驼峰规则转换后，通过 `.obj` 属性来调用。
:::

---

## 与 LVGL C 代码对比

为了更清晰地展示对应关系，以下是与上述 JavaScript 功能完全等价的 LVGL C 语言代码：

```c
void lv_example_image_transform(void)
{
    lv_obj_t * scr = lv_scr_act();

    // Image 1: Original
    lv_obj_t * img1 = lv_img_create(scr);
    lv_img_set_src(img1, "/app/code/src/logo.png");
    lv_obj_set_pos(img1, 10, 10);

    // Image 2: Rotated
    lv_obj_t * img2 = lv_img_create(scr);
    lv_img_set_src(img2, "/app/code/src/logo.png");
    lv_obj_set_pos(img2, 300, 10);
    lv_img_set_angle(img2, 900); // 90.0 degrees

    // Image 3: Zoomed
    lv_obj_t * img3 = lv_img_create(scr);
    lv_img_set_src(img3, "/app/code/src/logo.png");
    lv_obj_set_pos(img3, 100, 400);
    lv_img_set_zoom(img3, 512); // 256 = 100%, 512 = 200%
}
```

可以看到，dxUi 的调用方式与 LVGL C API 高度一致，极大地降低了熟悉 LVGL 的开发者的学习成本。

---

## 总结

- ✅ **双层封装** - dxUi 同时提供了简洁的便捷封装和完整的原生函数映射。
- ✅ **便捷封装** - 用于常用功能，写法更简洁，如 `setSize`, `setPos`。
- ✅ **原生函数** - 通过 `.obj` 属性调用，可访问 LVGL 的全部功能。
- ✅ **命名规则** - C 的 `lv_snake_case` 对应 JS 的 `lvCamelCase`。
- ✅ **官方文档** - 开发时可随时查阅 LVGL [官方文档](https://docs.lvgl.io/8.3/)，无缝迁移至 dxUi 开发。
