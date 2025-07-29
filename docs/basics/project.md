# App Project Structure

## Project Structure Overview

The dejaOS app project structure is concise and clear, containing several fixed directories and files, some of which are required. Below is a typical project structure diagram:

![Project Structure Diagram](/img/project-1.png)

### Directory and File Descriptions:

1. **`.temp/` Directory**

   - Automatically generated temporary directory by the plugin, can be ignored.
   - Contains cached files such as `.dpk` installation packages generated during build.
   - Will be regenerated if deleted, **will not be synced to device**.

2. **`dxmodules/` Directory**

   - Stores dependency modules (modules) downloaded via the `Install` button.
   - Contains multiple `.js` script files and `.so` dynamic link library files.
   - All modules start with `dx`, such as `dxLogger.js`.
   - Plugin supports `Ctrl+click` to quickly jump to module source code in this directory and view comments.

3. **`src/` Directory**

   - **Must exist**, used to store all source code files.
   - Can contain JS files, images, fonts, and other resource files.
   - Content in this directory will be completely synced to the device.

4. **`main.js` File**

   - The main entry file of the app, **must exist** and be placed in the `src/` directory.
   - Responsible for initializing the program and starting app logic.

5. **`app.dxproj` File**

   - Project configuration file, **must exist**.
   - Essentially a JSON format file, but managed through the plugin's visual editing interface.
   - Diagram as follows:

     ![Project Configuration File Editing Interface](/img/project-2.png)

#### `app.dxproj` Configuration Item Descriptions:

- **Project Name**: Can be filled in arbitrarily for easy identification.
- **Device Type**: **Must be correctly selected**, different devices may have different `.so` libraries and module dependencies.
- **Ignore Directories**: Default ignores `.temp/`, can be customized with multiple entries separated by English commas. Ignored directories will not be synced to the device.
- **Ignore Files**: Similar to above, customize a list of filenames that don't need to be synced.
- **Dependency Module List**: Select modules and their versions by clicking the `Add Module` button in the interface.
- **Version** To identify project configuration versions, facilitating compatibility and upgrade management.

---

## Basic Required Component Descriptions

Most projects will depend on the following basic modules, which are usually indispensable:

| Module Name | Function Description                                                |
| ----------- | ------------------------------------------------------------------- |
| `dxLogger`  | Logging module, supports outputting debug information               |
| `dxCommon`  | System common operations module, `dxLogger` depends on this         |
| `dxDriver`  | Driver layer support module, no API but required                    |
| `dxStd`     | Standard IO module, provides basic input/output support             |
| `dxMap`     | Shared memory module, often used as underlying dependency component |

---

## Device-Side Directory Structure Mapping

The file structure during device-side runtime is as follows:

- **`/app/code/`**

  - app code sync directory. Content from development project directories such as `src/`, `dxmodules/`, etc. will be copied here.
  - This directory is usually cleared and written with the latest files during app upgrades.

- **`/app/data/`**

  - User data, cache, etc. generated during app runtime are stored in this directory by default.
  - Although not mandatory, it's recommended that developers write all dynamically generated data to this directory for easy unified cleanup by the system during reset.

- **Other Directories**
  - Except for the above directories, other system directories cannot be accessed or modified by apps to avoid causing system stability issues.

---

## Summary

The dejaOS project structure design aims to maintain simplicity, clarity, and ease of maintenance. Through standardized directory layouts, module management mechanisms, and configuration methods, developers can more efficiently organize and deploy embedded apps. In the future, we will continue to optimize modularization and deployment processes to provide developers with more comprehensive tool support.
