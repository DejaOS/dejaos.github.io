---
title: Boot Screen Background
description: Customizable Boot Screen Background Images for Devices
slug: boot-screen
authors: voxer
tags: [dejaos, DW200]
hide_table_of_contents: false
---

There are generally two types of boot screen backgrounds: one for when the device is rebooted (power-cycled), and another for when an application starts. Changing the application background is straightforward, but customizing the device reboot background was previously not possible. After significant effort, we’ve enabled boot screen switching on devices like the DW200, though developers still cannot dynamically change it via code.

<!--truncate-->

## Changing the Application Background

The application boot background is simply an image assigned to a `dxui.Image` control, typically located in the `resource` directory. If you want to update it dynamically, you can easily download a new image to the device and overwrite the old one.

```js
let screen_img = dxui.Image.build("screen_img", screen_main);
mainView.screen_img = screen_img;
screen_img.source("/app/code/resource/image/bk_90.png");
```

## Replacing the Device Boot Background

The device boot background is a system-level resource managed by the firmware, and cannot be changed dynamically via JavaScript code. Currently, we support customizing the boot screen during firmware image creation, which may involve additional costs depending on your requirements.

![DW200 Boot Screen](/img/blog/bootscreen.png)

If you’d like to customize the device boot screen, please contact the DejaOS team when ordering your device and provide the image you want to use. We’ll pre-install your custom boot screen during the firmware build process, so it’s ready to go out of the box.

We’re also exploring more flexible solutions, and hope to support code-based boot screen changes in the future—stay tuned!
