---
title: DejaOS 模块演进 提升开发者体验
description: 为了提高 DejaOS 的质量、标准化和易用性，我们最近对所有官方模块进行了迭代，引入了更强大的新模块，统一了接口，并更新了所有相关文档。
slug: modules-update
authors: voxer
tags: [dejaos, Module, Update]
hide_table_of_contents: false
---

# DejaOS 模块演进：提升开发者体验

DejaOS 模块是我们整个生态系统的基石。为了统一接口规范、提高代码质量、增强易用性，我们最近启动了一个长期的模块迭代计划，全面审查和优化所有现有的官方模块。

<!--truncate-->

### 全新模块实现平滑过渡

一些模块经历了重大重构，从底层的 C/C++ 实现重写为高级 JavaScript API。为了确保平滑过渡，我们引入了更强大的**新模块**，具有统一的接口来替代旧模块。旧模块将被标记为"已弃用"，但将长期保持可用以确保向后兼容性。

主要模块替换如下：

- `dxHttpClient` &rarr; `dxHttp`
- `dxHttpServer` &rarr; `dxWebserver`
- `dxMqttClient` &rarr; `dxMqtt`
- `dxNetwork` &rarr; `dxNet`
- `dxBarcode` &rarr; `dxCode`
- `dxConfiguration` &rarr; `dxConfig`
- `dxAudio` &rarr; `dxAlsa`, `dxAlsaplay`
- `dxOs`, `dxCommonUtils` &rarr; `dxCommon`

### 向后兼容的无缝升级

对于未被替换的其余模块，我们实现了功能升级和优化。这些模块的核心用法基本保持不变，只对少数函数进行了微调。当发生此类更改时，我们将在日志中提供清晰的弃用通知，并指导您使用新的替代函数。

### 文档已更新

所有更新的模块现在都配有全新的文档。您可以在 **[DejaOS 官方模块文档](https://dejaos.com/modules/)** 中找到详细的 API 参考和使用示例。

我们相信这次全面的模块升级将为您带来更稳定、高效、愉快的开发体验。
