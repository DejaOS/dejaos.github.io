---
title: DejaOS VSCode Extension Now Supports macOS
description: The DejaOS VSCode extension has been updated to natively support macOS via the HID protocol, bringing a seamless development experience to Mac users.
slug: macos-supported
authors: voxer
tags: [dejaos, VSCode, macOS]
hide_table_of_contents: false
---

# DejaOS VSCode Extension Now Supports macOS

As an excellent cross-platform editor, VSCode has always run smoothly on Windows, macOS, and Linux. However, older versions of the DejaOS extension couldn't function properly on Mac due to stricter USB device permission management in macOS.

We are now excited to announce that the latest version of the extension has resolved this issue by using the **HID (Human Interface Device) protocol**, enabling native support for macOS!


<!--truncate-->

### Usage Notes

Our devices use the standard HID protocol, which means you **don't need to install any extra drivers** when you plug the device into your Mac. The system will automatically recognize it. You can refer to the image below to see it in the Windows system information, and on macOS, you can see the inserted device via the command line:

![Windows HID Device](/img/blog/devicemanage.png)

On some macOS systems, you might see a prompt when connecting the device for the first time: "HID Device Not Ready. Please retry after about 30 seconds.".

This is normal. The HID service within the device firmware needs some time to initialize upon the first connection. The initialization process starts when you click "Connect" for the first time and typically takes less than 30 seconds. Clicking "Connect" again after that will establish a successful connection.
