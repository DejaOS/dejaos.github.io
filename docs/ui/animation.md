---
sidebar_position: 7
---

# UI Animation

DejaOS provides powerful UI animation support. You can easily create various animation effects using the `dxui.Utils.anime` function.

## Core Function

### dxui.Utils.anime

Provides animation capabilities.

**Parameters:**

| Parameter    | Type     | Description                                                                                                                  |
| :----------- | :------- | :--------------------------------------------------------------------------------------------------------------------------- |
| obj          | object   | The object to animate. Can be any object, accessed in the callback.                                                          |
| start        | number   | Start value of the range. Usually used with `end`. Accessed in the callback. Changes from `start` to `end` during animation. |
| end          | number   | End value of the range.                                                                                                      |
| cb           | function | Callback function `(obj, v) => {}`. `obj` is the animation object, `v` is the current value in the range (start-end).        |
| duration     | number   | Animation duration in milliseconds.                                                                                          |
| backDuration | number   | (Optional) Animation playback (reverse) duration in milliseconds. Default is no playback.                                    |
| repeat       | number   | (Optional) Number of repetitions. Default is 1.                                                                              |
| mode         | string   | (Optional) Easing curve. Default is `linear`.                                                                                |

**Easing Modes:**

- `linear`: Linear animation
- `step`: Change at the last step
- `ease_in`: Slow at the beginning
- `ease_out`: Slow at the end
- `ease_in_out`: Slow at both beginning and end
- `overshoot`: Exceeds the final value
- `bounce`: Bounces back a bit from the final value (like hitting a wall)

**Returns:**

- Animation instance (Must be saved to a global variable to prevent garbage collection).

## Animation Examples

The following example demonstrates three different types of loaders: Simple Loader, Creative Loader, and Advanced Loader.

<iframe
  width="315"
  height="560"
  src="https://www.youtube.com/embed/IEkC9R3rwpw"
  title="UI Animation Demo"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>

### 1. Simple Loader

Uses two circles and rotating masks to create an eclipse/wobble effect.

```javascript
// --- Components for Simple Loader (Orbiting Masks) ---
// Two circles (cir1, cir2) with rotating masks (mask1, mask2) to create an eclipse/wobble effect.
let cir1 = v
  .create(box1)
  .hide()
  .center()
  .bgColor(0xb1f5ff)
  .borderWidth(0)
  .scroll(false);

let mask1 = v
  .create(cir1)
  .hide()
  .setSize(144, 144)
  .radius(72)
  .bgColor(0x616990)
  .center(-5)
  .borderWidth(0);

let cir2 = v
  .create(box1)
  .hide()
  .center()
  .bgColor(0xe16e7a)
  .borderWidth(0)
  .scroll(false);

let mask2 = v
  .create(cir2)
  .hide()
  .setSize(114, 114)
  .radius(57)
  .bgColor(0x616990)
  .center(3)
  .borderWidth(0);

// ...

// --- Animation Loop 1: Simple Loader ---
std.setInterval(
  () => {
    if (!anime1) {
      return;
    }
    // Rotate mask1 counter-clockwise (0 -> 360)
    context.anime1 = dxui.Utils.anime(
      mask1,
      0,
      360,
      (obj, v) => {
        let { x, y } = calculateCircleCoordinate(v, 5);
        x *= -1;
        y *= -1;
        obj.center(Math.floor(x), Math.floor(y));
      },
      500,
      null,
      null,
      "ease_in_out"
    );

    // Rotate mask2 clockwise (360 -> 0)
    context.anime2 = dxui.Utils.anime(
      mask2,
      360,
      0,
      (obj, v) => {
        let { x, y } = calculateCircleCoordinate(v, 5);
        obj.center(Math.floor(x), Math.floor(y));
      },
      500,
      null,
      null,
      "ease_in_out"
    );
  },
  500,
  true
);
```

### 2. Creative Loader

Uses 5 dots that "jump" in a wave pattern driven by a mathematical function.

```javascript
// --- Components for Creative Loader (Wave Dots) ---
// 5 dots that will "jump" in a wave pattern driven by a mathematical function.
let size = 30;
let side = 40;
let offset = 20;
function dot(parent) {
  let _d = v.create(parent).clearStyle().bgColor(0xffffff).borderWidth(0);
  return _d;
}
// ... (dot1 to dot5 creation) ...

// Helper function for Creative Loader wave effect
// Calculates the position and style of a dot based on the current animation progress 'x'.
function getValue(x, startValue = side * 2, mask) {
  // ... (See full code for implementation)
}

// --- Animation Loop 2: Creative Loader ---
std.setInterval(
  () => {
    if (!anime2) {
      return;
    }
    // Move a virtual wave across the dots
    context.anime3 = dxui.Utils.anime(
      null,
      0,
      side * 5 + offset,
      (obj, v) => {
        let move1 = getValue(v, -side * 2, dot1Mask);
        dot1.center(move1.x, move1.y);
        let move2 = getValue(v, -side, dot2Mask);
        dot2.center(move2.x, move2.y);
        let move3 = getValue(v, 0, dot3Mask);
        dot3.center(move3.x, move3.y);
        let move4 = getValue(v, side, dot4Mask);
        dot4.center(move4.x, move4.y);
        let move5 = getValue(v, side * 2, dot5Mask);
        dot5.center(move5.x, move5.y);
      },
      2000,
      null,
      null,
      "linear"
    );
  },
  2000,
  true
);
```

### 3. Advanced Loader

5 rectangles that change size and position in a choreographed sequence to create a morphing effect.

```javascript
// --- Components for Advanced Loader (Morphing Rects) ---
// 5 rectangles that change size and position in a choreographed sequence.
let rect1 = v
  .create(box3)
  .hide()
  .clearStyle()
  .center()
  .bgColor(0x8c839e)
  .setBorderColor(0xffffff)
  .setSize(45, 120);
// ... (rect2 to rect5 creation) ...

// --- Animation Loop 3 Part A: Advanced Loader Floating ---
std.setInterval(
  () => {
    if (!anime3) {
      return;
    }
    // Floating/Breathing effect using Sine wave
    context.anime4 = dxui.Utils.anime(
      null,
      0,
      360,
      (obj, v) => {
        let sin = Math.sin((Math.PI / 180) * v);
        rect1.center(0, sin * 20);
        // ...
      },
      1000,
      null,
      null,
      "linear"
    );
  },
  1000,
  true
);

// --- Animation Loop 3 Part B: Advanced Loader Morphing Sequence ---
std.setInterval(
  () => {
    if (!anime3) {
      return;
    }

    // Step 1: Initial expansion/adjustment
    context.anime5 = dxui.Utils.anime(
      null,
      0,
      100,
      (obj, v) => {
        // ...
      },
      1000,
      null,
      null,
      "ease_in_out"
    );

    // Step 2: Contraction after 1s
    std.setTimeout(() => {
      // ...
    }, 1000);

    // Step 3: Morphing head (rect2) after 2s
    std.setTimeout(() => {
      // ...
    }, 2000);

    // Step 4: Reset/Transition back after 3s
    std.setTimeout(() => {
      // ...
    }, 3000);
  },
  4000,
  true
);
```

### Full Code

You can find the complete code on GitHub: [Link](https://github.com/DejaOS/DejaOS/tree/main/demos/vf203_v12/vf203_v12_animation_demo)
