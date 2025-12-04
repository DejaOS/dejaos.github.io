---
sidebar_position: 7
---

# UI 动画

DejaOS 提供了强大的 UI 动画支持，可以通过 `dxui.Utils.anime` 函数轻松创建各种动画效果。

## 核心函数

### dxui.Utils.anime

提供动画功能。

**参数：**

| 参数名 | 类型 | 描述 |
| :--- | :--- | :--- |
| obj | object | 动画操作对象，可以是任意对象，在回调参数中获取 |
| start | number | 区间开始值，一般和 end 搭配使用，在回调参数中获取，start 在动画过程变化到 end |
| end | number | 区间结束值 |
| cb | function | 回调函数 `(obj, v) => {}`，obj 即动画操作对象，v 为当前区间值（start-end） |
| duration | number | 动画持续时间，毫秒 |
| backDuration | number | (可选) 动画回放时间，毫秒，缺省不回放 |
| repeat | number | (可选) 动画重复次数，缺省 1 次 |
| mode | string | (可选) 速率曲线，缺省 linear |

**速率曲线模式 (mode)：**

*   `linear`: 线性动画
*   `step`: 在最后一步更改
*   `ease_in`: 开始缓慢
*   `ease_out`: 最后缓慢
*   `ease_in_out`: 在开始和结束时都很缓慢
*   `overshoot`: 超出最终值
*   `bounce`: 从最终值反弹一点（比如撞到墙）

**返回值：**

*   动画实例 (需保存到全局以免被垃圾回收)

## 动画示例

以下示例展示了三种不同类型的加载动画：简单加载器 (Simple Loader)、创意加载器 (Creative Loader) 和高级加载器 (Advanced Loader)。

<iframe
  width="315"
  height="560"
  src="https://www.youtube.com/embed/IEkC9R3rwpw"
  title="UI Animation Demo"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>

### 1. 简单加载器 (Simple Loader)

使用两个圆圈和旋转遮罩创建日食/摆动效果。

```javascript
    // --- Components for Simple Loader (Orbiting Masks) ---
    // Two circles (cir1, cir2) with rotating masks (mask1, mask2) to create an eclipse/wobble effect.
    let cir1 = v.create(box1)
        .hide()
        .center()
        .bgColor(0xb1f5ff)
        .borderWidth(0)
        .scroll(false)

    let mask1 = v.create(cir1)
        .hide()
        .setSize(144, 144)
        .radius(72)
        .bgColor(0x616990)
        .center(-5)
        .borderWidth(0)

    let cir2 = v.create(box1)
        .hide()
        .center()
        .bgColor(0xe16e7a)
        .borderWidth(0)
        .scroll(false)

    let mask2 = v.create(cir2)
        .hide()
        .setSize(114, 114)
        .radius(57)
        .bgColor(0x616990)
        .center(3)
        .borderWidth(0)

    // ...

    // --- Animation Loop 1: Simple Loader ---
    std.setInterval(() => {
        if (!anime1) {
            return
        }
        // Rotate mask1 counter-clockwise (0 -> 360)
        context.anime1 = dxui.Utils.anime(mask1, 0, 360, (obj, v) => {
            let { x, y } = calculateCircleCoordinate(v, 5)
            x *= -1
            y *= -1
            obj.center(Math.floor(x), Math.floor(y))
        }, 500, null, null, "ease_in_out")

        // Rotate mask2 clockwise (360 -> 0)
        context.anime2 = dxui.Utils.anime(mask2, 360, 0, (obj, v) => {
            let { x, y } = calculateCircleCoordinate(v, 5)
            obj.center(Math.floor(x), Math.floor(y))
        }, 500, null, null, "ease_in_out")
    }, 500, true)
```

### 2. 创意加载器 (Creative Loader)

使用 5 个点，通过数学函数驱动波浪模式跳动。

```javascript
    // --- Components for Creative Loader (Wave Dots) ---
    // 5 dots that will "jump" in a wave pattern driven by a mathematical function.
    let size = 30
    let side = 40
    let offset = 20
    function dot(parent) {
        let _d = v.create(parent)
            .clearStyle()
            .bgColor(0xffffff)
            .borderWidth(0)
        return _d
    }
    // ... (dot1 to dot5 creation) ...

    // Helper function for Creative Loader wave effect
    // Calculates the position and style of a dot based on the current animation progress 'x'.
    function getValue(x, startValue = side * 2, mask) {
        // ... (See full code for implementation)
    }

    // --- Animation Loop 2: Creative Loader ---
    std.setInterval(() => {
        if (!anime2) {
            return
        }
        // Move a virtual wave across the dots
        context.anime3 = dxui.Utils.anime(null, 0, side * 5 + offset, (obj, v) => {
            let move1 = getValue(v, -side * 2, dot1Mask)
            dot1.center(move1.x, move1.y)
            let move2 = getValue(v, -side, dot2Mask)
            dot2.center(move2.x, move2.y)
            let move3 = getValue(v, 0, dot3Mask)
            dot3.center(move3.x, move3.y)
            let move4 = getValue(v, side, dot4Mask)
            dot4.center(move4.x, move4.y)
            let move5 = getValue(v, side * 2, dot5Mask)
            dot5.center(move5.x, move5.y)
        }, 2000, null, null, "linear")
    }, 2000, true)
```

### 3. 高级加载器 (Advanced Loader)

5 个矩形按照编排的顺序改变大小和位置，实现变形效果。

```javascript
    // --- Components for Advanced Loader (Morphing Rects) ---
    // 5 rectangles that change size and position in a choreographed sequence.
    let rect1 = v.create(box3).hide().clearStyle().center().bgColor(0x8c839e).setBorderColor(0xffffff).setSize(45, 120)
    // ... (rect2 to rect5 creation) ...

    // --- Animation Loop 3 Part A: Advanced Loader Floating ---
    std.setInterval(() => {
        if (!anime3) { return }
        // Floating/Breathing effect using Sine wave
        context.anime4 = dxui.Utils.anime(null, 0, 360, (obj, v) => {
            let sin = Math.sin(Math.PI / 180 * v)
            rect1.center(0, sin * 20)
            // ...
        }, 1000, null, null, "linear")
    }, 1000, true)

    // --- Animation Loop 3 Part B: Advanced Loader Morphing Sequence ---
    std.setInterval(() => {
        if (!anime3) { return }
        
        // Step 1: Initial expansion/adjustment
        context.anime5 = dxui.Utils.anime(null, 0, 100, (obj, v) => {
             // ...
        }, 1000, null, null, "ease_in_out")

        // Step 2: Contraction after 1s
        std.setTimeout(() => {
             // ...
        }, 1000)

        // Step 3: Morphing head (rect2) after 2s
        std.setTimeout(() => {
             // ...
        }, 2000)

        // Step 4: Reset/Transition back after 3s
        std.setTimeout(() => {
             // ...
        }, 3000)
    }, 4000, true)
```

### 完整代码

完整的代码可以在 GitHub 上找到：[链接](https://github.com/DejaOS/DejaOS/tree/main/demos/vf203_v12/vf203_v12_animation_demo)
