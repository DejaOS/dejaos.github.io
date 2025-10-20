# A Deep Dive into the dxUi Module

In previous documents, we've learned how to use the `dxUi` module to build user interfaces. Now, let's take a closer look at the internal structure of the `dxUi` module to see what files it consists of and the role each file plays.

---

## Module File Structure

`dxUi` is not a single, monolithic file but a collection of JavaScript modules with clear functions that work together. This modular design makes the code easier to maintain and extend.

Although we usually only need to import the main entry file during development:

```javascript
import dxui from "../dxmodules/dxUi.js";
```

`dxUi.js` internally loads all other related UI components and utility files automatically.

Here are the core files included in the `dxUi` module and their functional descriptions:

| File Name         | Description                                                                                                                                                                 |
| :---------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Core Files**    |                                                                                                                                                                             |
| `dxUi.js`         | The main entry file of the module, responsible for initializing the UI system (`dxui.init`), loading the main screen (`dxui.loadMain`), and managing all other sub-modules. |
| `uiBase.js`       | The **base class** for all UI controls. It defines common properties and methods shared by all controls, such as `setPos()`, `setSize()`, `on()`, etc.                      |
| `uiUtils.js`      | A **utility library** containing a series of constants and helper functions, such as event types (`EVENT`), layers (`LAYER`), color conversions, etc.                       |
| `uiStyle.js`      | The **style engine**, used to create and manage control styles, such as background color, borders, shadows, etc.                                                            |
| `uiFont.js`       | The **font manager**, used to load and apply custom fonts.                                                                                                                  |
| **Control Files** |                                                                                                                                                                             |
| `uiView.js`       | **View/Container** (`View`), the most basic rectangular container that can serve as a parent node for other controls.                                                       |
| `uiLabel.js`      | **Text Label** (`Label`), used to display static text.                                                                                                                      |
| `uiButton.js`     | **Button**, a basic control that responds to click events.                                                                                                                  |
| `uiImage.js`      | **Image**, used to display pictures.                                                                                                                                        |
| `uiCheckbox.js`   | **Checkbox**.                                                                                                                                                               |
| `uiDropdown.js`   | **Dropdown** list.                                                                                                                                                          |
| `uiKeyboard.js`   | **Virtual Keyboard** (`Keyboard`), for text input.                                                                                                                          |
| `uiLine.js`       | **Line**, used to draw lines.                                                                                                                                               |
| `uiList.js`       | **List**.                                                                                                                                                                   |
| `uiSlider.js`     | **Slider**.                                                                                                                                                                 |
| `uiSwitch.js`     | **Switch**.                                                                                                                                                                 |
| `uiTextarea.js`   | **Text Area** (`Textarea`).                                                                                                                                                 |
| `uiButtons.js`    | **Button Matrix** (`ButtonMatrix`), used to create grid layouts containing multiple buttons.                                                                                |

---

## How It Works

1. **Unified Entry Point**: `dxUi.js` acts as the facade for the entire module, gathering the functionality of all other files and providing it uniformly in forms like `dxui.Button` and `dxui.Label`.
2. **Inheritance**: Except for utility files like `uiUtils.js`, `uiStyle.js`, and `uiFont.js`, all control files (e.g., `uiButton.js`) inherit from `uiBase.js`. This is why different control instances can call the same methods like `setPos()` and `setSize()`.
3. **Use as Needed**: After understanding the role of each file, when you need to deeply customize the behavior or style of a control, you can directly consult the corresponding source file (e.g., `dxmodules/uiButton.js`) to learn about its specific methods and properties.

---

## Summary

- ✅ **Modular Design** - `dxUi` is composed of multiple JS files, each with a specific role, resulting in a clear structure.
- ✅ **Unified Entry Point** - You only need to import `dxUi.js` to use all UI features.
- ✅ **Base Class Inheritance** - All controls inherit from `uiBase.js`, sharing common methods.
- ✅ **Clear Functionality** - Each control and utility has a corresponding file, making them easy to find and learn.

Understanding the file structure of `dxUi` helps you to master UI development more deeply and to locate and solve problems more quickly when they arise.
