# dejaOS IDE

## Overview

**dejaOS IDE** is a VSCode-based plugin (extension) for developing, debugging, and deploying dejaOS applications. After installing the plugin, you need to open a project directory that contains an `app.dxproj` file in the root directory for the plugin functionality to be properly enabled.

> - `app.dxproj` is the project description file for dejaOS applications, defining configuration information such as module dependencies and device models.

---

## Disconnected Device State

When no device is connected, you can write and manage code, but cannot run or debug. Currently, simulators are not supported.

Interface illustration:

![Disconnected Device Interface](/img/ide-1.png)

The bottom-left corner provides 3 basic operation buttons:

1. **Install**  
   Similar to `npm install`, downloads required modules based on dependency information in the `app.dxproj` file.

2. **Package**  
   Builds application packages (`.dpk` files). Since dejaOS uses JavaScript, no compilation is needed - it only packages and compresses code and resources.

3. **Connect**  
   After connecting the device to the computer via USB, click this button to establish a communication connection. Connection status is reported through a popup in the bottom-right corner indicating success or failure.

---

## Connected Device State

After successful connection, more operation buttons will appear in the bottom-left corner:

![Connected Device Interface](/img/ide-2.png)

Additional buttons include:

1. **Start**: Launch the application on the device
2. **Stop**: Stop the currently running application
3. **Sync**: Sync changed code files to the device
4. **SyncAll**: Full sync of all code to the device

> It's recommended to use `SyncAll` for complete project synchronization before running the application for the first time. This operation may take a while and supports viewing sync progress.  
> For subsequent operations, you only need to use `Sync` to quickly sync changed parts.

---

## Viewing Logs

You can view running logs in real-time in the **OUTPUT** panel at the bottom of VSCode:

![Log Output](/img/ide-3.png)

---

## Quick Operations

Improve development efficiency through VSCode's command palette or keyboard shortcuts:

![Quick Operations Interface](/img/ide-5.png)

Recommended keyboard shortcuts:

- **Ctrl + Shift + T**: Quickly execute the sequential operation of _sync code → stop application → start application_.

---

## Visual GUI Editor

The plugin also supports building GUI interfaces through visual drag-and-drop methods, as shown below:

![Visual Editor](/img/ide-4.png)

Usage:

- Use `.dxui` extension when creating files;
- Click on the file to open the visual GUI editor.

> ⚠️ 
> - The current visual functionality is still being continuously improved. It's recommended to still primarily build interfaces using JS code. Future versions will provide more complete component and interaction support.

---

## Summary

dejaOS IDE provides one-stop support for embedded application development, integrating module management, packaging and deployment, device connection and debugging, GUI visualization, and other features. It is the recommended tool for efficient dejaOS application development.
