# Module System

---

## Module Import Mechanism

In DejaOS, modules use standard ES6 `import/export` syntax for importing and exporting, which is very intuitive for developers familiar with JavaScript. For more detailed usage, please refer to the [MDN documentation](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import).

> - All built-in module names start with `dx`, for example: `dxLogger.js`, `dxUI.js`, etc.

---

## Module Management Mechanism

DejaOS does not adopt the traditional JavaScript `npm` ecosystem, mainly for the following reasons:

- Embedded applications typically don't rely on large numbers of third-party libraries;
- Many modules involve underlying hardware and require cross-compilation for specific devices;
- Managing dependency packages on resource-limited devices is complex.

Therefore, DejaOS adopts a self-developed module management system, providing a set of built-in modules for accessing device functionalities such as image recognition, UI rendering, log printing, etc.

Additionally:

- Supports manual introduction of third-party pure JavaScript modules (only ES6 Module syntax supported);
- Future plans include integrating common third-party modules to enrich the ecosystem.

---

## Module Management Interface in VS Code

Through the **DejaOS IDE plugin**, users can select, install, and upgrade modules through a graphical interface in VS Code without manual configuration, greatly improving development efficiency.

- Module list page:

  ![](/img/module1.png)

- Module selection and version switching:

  ![](/img/module2.png)

> In DejaOS, "modules" are also commonly referred to as "components" (Module).

---

## Module Installation Methods

Similar to `npm install`, the DejaOS IDE plugin provides a one-click install button. Click `Install` to pull the corresponding files from the official module repository:

![](/img/module3.png)

- Module installation automatically handles dependency processing and platform adaptation;
- Requires internet access to download resources from official web services;
- For offline development environments, contact the official team to obtain offline installation packages.

---

## Module Composition

After successfully `install`ing a module, the module files will be downloaded to the `dxmodules` directory in the current project. Generally, there are 3 types of modules, each with different corresponding file types:

1. **Pure JavaScript Modules**: These modules contain only .js files, and the versions are consistent across different devices. Examples include `dxLogger` and `dxEventBus`
2. **SOC-based Modules**: These modules contain both .js and .so files. Versions are consistent for different device models under the same SOC. For example, `dxMqttClient` and `dxHttpClient` are consistent on devices DW200 and DW200_v20, as these two device types share the same SOC - their only difference is that V20 has an additional WiFi module
3. **Device Model-based Modules**: These modules contain both .js and .so files. The .js files are basically the same across different device models, but the .so files are definitely different. Examples include `dxCode` and `dxNfc`. These modules are typically related to underlying hardware.

---

## Summary

DejaOS provides a module system optimized for embedded devices with the following characteristics:

- **Standard Import Syntax**: Follows ES6 Module specifications, easy to understand and use;
- **Efficient Management Mechanism**: No complex dependency relationships, modules are selected as needed;
- **Visual Operation Interface**: Complete all module-related operations through the DejaOS IDE plugin;
- **Hardware Platform Adaptation**: Modules are bound to corresponding device architectures, ensuring stable operation.

In the future, we will continue to expand the module ecosystem, lower the threshold for embedded development, and enable more developers to enter the hardware world through web development approaches.
