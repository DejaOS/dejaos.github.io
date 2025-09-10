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

![Windows HID Device](https://private-user-images.githubusercontent.com/114376014/484870901-209cdd7c-a88b-43a1-8ea8-8d5788aece08.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NTc0NzU5ODcsIm5iZiI6MTc1NzQ3NTY4NywicGF0aCI6Ii8xMTQzNzYwMTQvNDg0ODcwOTAxLTIwOWNkZDdjLWE4OGItNDNhMS04ZWE4LThkNTc4OGFlY2UwOC5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjUwOTEwJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI1MDkxMFQwMzQxMjdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT02ZTRkNTZhM2Q3YTU5ZWQ2NzdlNmNjMjA4OGIyMWUwNGNlYzhlNjI3YjkzODA1OGU3M2VhYWFlNzc2MDljMGJlJlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.kDQz7qyaVzrPlqOFQaRXEj_geJUCjxU1H0FYLTA1Yds)

On some macOS systems, you might see a prompt when connecting the device for the first time: "HID Device Not Ready. Please retry after about 30 seconds.".

This is normal. The HID service within the device firmware needs some time to initialize upon the first connection. The initialization process starts when you click "Connect" for the first time and typically takes less than 30 seconds. Clicking "Connect" again after that will establish a successful connection.
