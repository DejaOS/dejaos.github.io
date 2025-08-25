---
title: DejaOS Module Evolution Enhancing the Developer Experience
description: To improve the quality, standardization, and ease of use of DejaOS, we have recently iterated on all official modules, introducing more powerful new modules with unified interfaces and updating all related documentation.
slug: modules-update
authors: voxer
tags: [dejaos, Module, Update]
hide_table_of_contents: false
---

# DejaOS Module Evolution: Enhancing the Developer Experience

DejaOS modules are the cornerstone of our entire ecosystem. To unify interface specifications, improve code quality, and enhance ease of use, we have recently launched a long-term module iteration plan to comprehensively review and optimize all existing official modules.

<!--truncate-->

### Brand-New Modules for a Smooth Transition

Some modules have undergone significant refactoring, with rewrites from the underlying C/C++ implementation to the high-level JavaScript APIs. To ensure a smooth transition, we have introduced more powerful **new modules** with unified interfaces to replace the old ones. The old modules will be marked as "deprecated" but will remain available for a long time to ensure backward compatibility.

The main module replacements are as follows:

- `dxHttpClient` &rarr; `dxHttp`
- `dxHttpServer` &rarr; `dxWebserver`
- `dxMqttClient` &rarr; `dxMqtt`
- `dxNetwork` &rarr; `dxNet`
- `dxBarcode` &rarr; `dxCode`
- `dxConfiguration` &rarr; `dxConfig`
- `dxAudio` &rarr; `dxAlsa`, `dxAlsaplay`
- `dxOs`, `dxCommonUtils` &rarr; `dxCommon`

### Seamless Upgrades with Backward Compatibility

For the remaining modules that were not replaced, we have implemented functional upgrades and optimizations. The core usage of these modules remains largely unchanged, with only minor adjustments to a few functions. When such changes occur, we will provide clear deprecation notices in the logs and guide you to use the new alternative functions.

### Documentation Has Been Updated

All updated modules are now accompanied by brand-new documentation. You can find detailed API references and usage examples in the **[Official DejaOS Modules Documentation](https://dejaos.com/modules/)**.

We believe this comprehensive module upgrade will bring you a more stable, efficient, and enjoyable development experience.
