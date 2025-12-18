---
title: 启动屏幕背景
description: 设备可自定义的启动屏幕背景图片
slug: boot-screen
authors: voxer
tags: [dejaos, DW200]
hide_table_of_contents: false
---

通常有两种类型的启动屏幕背景：一种是设备重启（断电重启）时显示的，另一种是应用程序启动时显示的。更改应用程序背景很简单，但自定义设备重启背景以前是不可能的。经过大量努力，我们已经在 DW200 等设备上启用了启动屏幕切换功能，不过开发者仍然无法通过代码动态更改它。

<!--truncate-->

## 更改应用程序背景

应用程序启动背景只是一个分配给 `dxui.Image` 控件的图片，通常位于 `resource` 目录中。如果您想动态更新它，可以轻松地将新图片下载到设备并覆盖旧图片。

```js
let screen_img = dxui.Image.build("screen_img", screen_main);
mainView.screen_img = screen_img;
screen_img.source("/app/code/resource/image/bk_90.png");
```

## 替换设备启动背景

设备启动背景是由固件管理的系统级资源，无法通过 JavaScript 代码动态更改。目前，我们支持在固件镜像创建过程中自定义启动屏幕，可能需要一定的额外费用。

![DW200 启动屏幕](/img/blog/bootscreen.png)

如果您想自定义设备启动屏幕，请在订购设备时联系 DejaOS 团队并提供您想要使用的图片。我们将在固件构建过程中预安装您的自定义启动屏幕，这样开箱即用。

我们也在探索更灵活的解决方案，希望在未来支持基于代码的启动屏幕更改——敬请期待！
