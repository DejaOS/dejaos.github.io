---
title: DejaOS VSCode Extension v1.0.32 Released
description: DejaOS VSCode Extension v1.0.32 Released
slug: ide-new-version-release
authors: voxer
tags: [dejaos, IDE]
hide_table_of_contents: false
---

# DejaOS VSCode Plugin v1.0.32 Released

DejaOS VSCode plugin releases **v1.0.32**, with this update focusing on improving the development experience, including error prompt optimization, default sync behavior adjustments, and bug fixes.

<!--truncate-->

## 📁 Ignore All Directories Starting with `.`

Previously, when using the `SynAll` function, the IDE would package and sync the entire project directory to the device, only ignoring the `.temp` folder by default. However, directories such as `.git`, `.vscode`, etc., are often large in size and have no practical significance for the device.

If such directories are not ignored, they will cause the generated compressed package (zip) to be too large, not only slowing down sync speed but also potentially causing deployment failures due to insufficient device storage.

To improve stability and efficiency, **starting from v1.0.32, all directories starting with `.` are ignored by default**.

---

## 🧩 Detailed Prompts for .so File Loading Failures

During development, one common error is: `ReferenceError: could not load module filename '/app/code/dxmodules/xxx.so' as shared library.`

This error can be caused by two reasons:

1. **Component Not Installed**: The corresponding component is not downloaded in the project, causing the corresponding `.so` file to not be synced to the device.
2. **Device Model Mismatch**: The device model configured in `app.dxproj` is inconsistent with the actual device, causing `.so` files of the wrong model to be synced.
   > - Note: DejaOS `.so` files are strongly bound to device models and cannot be used across devices.

👉 The correct approach is:

- Check the device model configuration in `app.dxproj`;
- Re-select the component version for the target model in the component panel;
- Install and sync again.

The original prompt was not intuitive enough for beginners, so this update adds more friendly explanations and screenshots for this error message:

![so not found](/img/blog/sonotfound.png)  
_Original error message_

![so not found desc](/img/blog/sonotfounddesc.png)  
_New prompt description, helping developers quickly locate the issue_

---

## 🐞 Bug Fixes

- Fixed: **No error prompt when component download fails, interface continuously displays "component installing"**, now correctly displays error prompts.

---

## ✅ Summary

DejaOS IDE is continuously iterating, with the goal of providing developers with a more intuitive and efficient embedded development experience. This update further addresses common error-prone points. Welcome to upgrade and experience v1.0.32!

If you have suggestions or issues, feel free to submit feedback through [GitHub Issues](https://github.com/DejaOS/DejaOS/issues) 🙌
