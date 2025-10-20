# Calling Native LVGL Functions

As mentioned in the [UI Build Overview](./overview.md), dxUi is a JavaScript wrapper for the LVGL C library. While dxUi simplifies many common functions, you may need to call native LVGL functions that haven't been wrapped when developing complex interfaces.

This article will use an example to explain the rules for how dxUi wraps LVGL functions and how to call native LVGL functions through the dxUi object.

## Example: Image Transformation

Let's learn how to call native LVGL functions through an image rotation and scaling example.

### Complete Code

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

### Running Effect

![ui lvgl function call](/img/ui/lvglfunc.png)

### Code Analysis

The code above creates three image controls on the screen:

- **image1**: The original image, located in the upper-left corner.
- **image2**: The image rotated by 90 degrees.
- **image3**: The image magnified by 2 times.

We notice that the transformation operations for `image2` and `image3` are called through the `.obj` property:

```javascript
image2.obj.lvImgSetAngle(900);
image3.obj.lvImgSetZoom(512);
```

This is precisely how you call native LVGL functions. Next, we will explain the principle behind it in detail.

---

## dxUi Wrapper Levels

To balance ease of use and flexibility, dxUi provides two levels of function wrappers.

### 1. High-level Wrappers

For the most common functions (like setting position and size), dxUi provides very concise wrappers that better fit JavaScript development habits.

For example, `setPos(x, y)` is a high-level wrapper that ultimately corresponds to the LVGL `lv_obj_set_pos(obj, x, y)` function.

### 2. Native Function Mapping

LVGL is feature-rich with a vast number of functions. To allow developers to use all LVGL features, dxUi maps all C functions starting with `lv_` one-to-one to the `.obj` property of dxUi objects, following camelCase naming conventions.

**Mapping Rule:** The C function's snake_case naming `lv_obj_set_size` is converted to the JavaScript camelCase naming `lvObjSetSize`.

`lvImgSetAngle` and `lvImgSetZoom` in the example are native function mappings.

| Scenario         | C Function (LVGL)  | JS Call (dxUi)                 | Wrapper Level           |
| :--------------- | :----------------- | :----------------------------- | :---------------------- |
| **Set Position** | `lv_obj_set_pos`   | `image.setPos(10, 10)`         | High-level Wrapper      |
| **Set Angle**    | `lv_img_set_angle` | `image.obj.lvImgSetAngle(900)` | Native Function Mapping |
| **Set Zoom**     | `lv_img_set_zoom`  | `image.obj.lvImgSetZoom(512)`  | Native Function Mapping |

:::tip When to use native functions?
When you find that a feature is not available in the high-level wrappers (e.g., advanced features like image rotation, color matrix transformations), you can consult the [LVGL Official Documentation](https://docs.lvgl.io/8.3/widgets/core/img.html), find the corresponding C function name, convert it to camelCase according to the rule, and then call it through the `.obj` property.
:::

---

## Comparison with LVGL C Code

To more clearly show the correspondence, here is the LVGL C code that is functionally equivalent to the JavaScript code above:

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

As you can see, dxUi's calling convention is highly consistent with the LVGL C API, significantly reducing the learning curve for developers familiar with LVGL.

---

## Summary

- ✅ **Dual-layer Wrapping** - dxUi provides both concise high-level wrappers and complete native function mappings.
- ✅ **High-level Wrappers** - Used for common functions, with simpler syntax, like `setSize`, `setPos`.
- ✅ **Native Functions** - Called via the `.obj` property, allowing access to all of LVGL's features.
- ✅ **Naming Convention** - C's `lv_snake_case` corresponds to JS's `lvCamelCase`.
- ✅ **Official Documentation** - You can refer to the LVGL [Official Documentation](https://docs.lvgl.io/8.3/) at any time during development for a seamless transition to dxUi.
