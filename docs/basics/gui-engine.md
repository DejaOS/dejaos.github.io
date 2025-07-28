# Introduction to DejaOS GUI Engine

---

## Overview

**DejaOS** is adapted for embedded devices with screens, therefore requiring graphical interface support. We chose the open-source graphics library [LVGL](https://lvgl.io/) (Light and Versatile Graphics Library) as the core GUI engine.

LVGL is a lightweight GUI framework specifically designed for resource-constrained devices, featuring rich graphical controls, flexible styling systems, and extremely low memory usage. It is widely used in embedded fields such as smart homes, industrial control, and consumer electronics.

![](/img/lvgl.png)

Although LVGL itself is developed in C, in **DejaOS**, we integrate it with the QuickJS engine, allowing developers to directly use JavaScript to build interfaces, greatly reducing the development threshold.

---

## Main Features of LVGL

- **Lightweight and Efficient**: Can run smoothly on devices with just a few hundred KB of memory, suitable for low-power embedded environments.
- **Rich Controls**: Built-in UI components such as buttons, labels, charts, sliders, lists, and more for quickly building complex interfaces.
- **Customizable Styling**: Supports theme systems and style customization, facilitating the creation of unified and beautiful visual experiences.
- **Cross-platform Portability**: Supports various MCUs and operating systems, adaptable to LCD, OLED, and other display interfaces.
- **Active Community Support**: Rich documentation, examples, and forums for developers to quickly get started and expand.

---

## Application Advantages in DejaOS

On the DejaOS platform, developers can call encapsulated LVGL interfaces through JavaScript scripts, such as creating buttons, setting text, responding to touch events, etc.:

```js
import dxui from "../dxmodules/dxUi.js";
let button1 = dxui.Button.build("button1", screen_main);
button1.setSize(120, 50);
button1.bgColor(0x000000);
button1.bgOpa(30);
button1.on(dxui.Utils.EVENT.CLICK, () => {
  //
});
```

This approach brings multiple advantages:

- **Rapid Development**: No compilation required, run immediately after modification
- **Lower Threshold**: No need to master C language
- **Hot Updates**: Can remotely deploy UI update packages

---

## Application Scenarios

LVGL is suitable for the following typical scenarios:

- **Smart Home Appliances** (such as touch panels, smart refrigerators, etc.)
- **Industrial Human-Machine Interfaces (HMI)**
- **Medical Devices** (such as diagnostic instrument display interfaces)
- **Automotive Center Console / Dashboards**
- **Smart Wearables** (such as watches, fitness devices)

Its powerful extensibility and excellent performance make it the preferred choice for embedded GUI development.
