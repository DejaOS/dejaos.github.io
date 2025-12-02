---
title: DejaOS VSCode 扩展 v1.0.32 发布
description: DejaOS VSCode 扩展 v1.0.32 发布
slug: ide-new-version-release
authors: voxer
tags: [dejaos, IDE]
hide_table_of_contents: false
---

# DejaOS VSCode 插件 v1.0.32 发布

DejaOS VSCode 插件发布 **v1.0.32**，此次更新专注于改善开发体验，包括错误提示优化、默认同步行为调整和错误修复。

<!--truncate-->

## 📁 忽略所有以 `.` 开头的目录

以前，当使用 `SynAll` 功能时，IDE 会将整个项目目录打包并同步到设备，默认只忽略 `.temp` 文件夹。但是，像 `.git`、`.vscode` 等目录通常体积很大，对设备没有实际意义。

如果不忽略这些目录，会导致生成的压缩包（zip）过大，不仅会降低同步速度，还可能因设备存储空间不足而导致部署失败。

为了提高稳定性和效率，**从 v1.0.32 开始，默认忽略所有以 `.` 开头的目录**。

---

## 🧩 .so 文件加载失败的详细提示

在开发过程中，一个常见的错误是：`ReferenceError: could not load module filename '/app/code/dxmodules/xxx.so' as shared library.`

这个错误可能由两个原因引起：

1. **组件未安装**：项目中未下载对应的组件，导致对应的 `.so` 文件未同步到设备。
2. **设备型号不匹配**：`app.dxproj` 中配置的设备型号与实际设备不一致，导致同步了错误型号的 `.so` 文件。
   > - 注意：DejaOS `.so` 文件与设备型号强绑定，无法跨设备使用。

👉 正确的做法是：

- 检查 `app.dxproj` 中的设备型号配置；
- 在组件面板中重新选择目标型号的组件版本；
- 重新安装并同步。

原来的提示对初学者来说不够直观，所以此次更新为这个错误消息添加了更友好的解释和截图：

![so not found](/img/blog/sonotfound.png)  
_原始错误消息_

![so not found desc](/img/blog/sonotfounddesc.png)  
_新的提示描述，帮助开发者快速定位问题_

---

## 🐞 错误修复

- 修复：**组件下载失败时没有错误提示，界面持续显示"组件安装中"**，现在正确显示错误提示。

---

## ✅ 总结

DejaOS IDE 持续迭代，目标是为开发者提供更直观、高效的嵌入式开发体验。此次更新进一步解决了常见的易错点。欢迎升级体验 v1.0.32！

如果您有建议或问题，欢迎通过 [GitHub Issues](https://github.com/DejaOS/DejaOS/issues) 提交反馈 🙌
