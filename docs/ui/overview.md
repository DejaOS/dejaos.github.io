# UI Development Overview

---

## Introduction

As introduced in the [GUI Engine](../basics/gui-engine.md) chapter, dejaOS's graphics engine is based on the open-source graphics library [LVGL](https://lvgl.io/). The **dxUi** module is our JavaScript wrapper for the LVGL C API, enabling developers to quickly build graphical interfaces using JavaScript.

All GUI development for dejaOS devices with screens is based on the dxUi module.

---

## About the dxUi Module

**dxUi** is the UI building module provided by dejaOS, featuring:

- **One-to-One Mapping**: dxUi provides a one-to-one JavaScript wrapper for LVGL C functions, maintaining LVGL's native characteristics
- **Simple and Easy**: Using JavaScript syntax with further encapsulation and simplification of common functions, as original LVGL function names are very long
- **Complete Functionality**: Supports all core LVGL features including widgets, styles, animations, events, etc.
- **Zero Learning Curve Migration**: If you're familiar with LVGL, you can quickly get started with dxUi

:::tip Important Note
dejaOS does not create new UI concepts or paradigms. All concepts come directly from LVGL. Therefore, if you're already familiar with LVGL, you can get started with dxUi development very quickly.
:::

---

## Documentation Goals

This series of documentation will help you through multiple examples and detailed explanations:

- Learn how to build graphical interfaces from simple to complex in dejaOS
- Understand core LVGL/dxUi concepts (objects, styles, events, layouts, etc.)
- Master the usage of common UI components
- Learn UI development best practices

---

## Learning Path Recommendations

### If You're New to LVGL

We recommend learning in the following order:

1. First, quickly browse the [LVGL 8.3 Official Documentation](https://docs.lvgl.io/8.3/) to understand basic concepts
2. Return to this documentation to see specific implementations and examples in dejaOS
3. Practice and consolidate knowledge through actual projects

### If You're Already Familiar with LVGL

You can:

1. Quickly browse this documentation to understand JavaScript API calling methods
2. Review code examples to understand dxUi usage patterns
3. Start developing your application directly

---

## Leveraging AI

Since most UI construction has similarities, we can use AI tools to quickly generate complex graphical interfaces. This has been well validated in actual projects.

Let's begin exploring the UI development journey with dejaOS!
