# dejaOS CLI

## Overview

**DejaOS CLI** is the official command-line development tool for DejaOS. It provides project management, device control, and code synchronization capabilities corresponding to the commonly used buttons in the VSCode extension. It is suitable for terminal-based development, automation scripts, and AI-assisted programming workflows.

The CLI does not require the VSCode extension, but Node.js 18 or later must be installed on the computer.

## Installation

```bash
npm install -g dejaos-cli
```

Verify the installation:

```bash
dejaos --help
```

All project commands operate on the current directory by default. Before running a command, ensure that the current project root contains an `app.dxproj` file.

## Commands

| Command | Description |
| --- | --- |
| `dejaos edit` | Edit `app.dxproj` in a terminal UI |
| `dejaos install` | Download project components defined in `app.dxproj` to `dxmodules/` |
| `dejaos build` | Build the project as a `.dpk` application package |
| `dejaos connect` | Check and connect to a USB device |
| `dejaos start` | Start the application on the device |
| `dejaos stop` | Stop the application on the device |
| `dejaos reboot` | Reboot the device |
| `dejaos sync` | Synchronize only changed files |
| `dejaos sync --all` | Synchronize all project files |
| `dejaos run` | Stop the application, perform an incremental sync, and restart it |
| `dejaos logs` | Stream real-time device logs; press `Ctrl+C` to exit |

## Recommended Development Workflow

After obtaining a project for the first time or changing its component configuration:

```bash
dejaos install
dejaos sync --all
dejaos start
```

During daily development, after modifying code, run:

```bash
dejaos run
```

`dejaos run` automatically connects to the device, stops the current application, synchronizes changed files, and restarts the application.

## Editing Project Configuration

Run the following command to open the terminal project configuration editor:

```bash
dejaos edit
```

The editor supports changing the project name, device model, SDK version, application version, ignore rules, and component versions. Press `s` to save and `q` to exit.

The `app.dxproj` file stores the internal SDK ID, while the editor displays the corresponding SDK name, such as `2.0` or `3.0`.

## Incremental and Full Synchronization

`dejaos sync` compares current project files with the MD5 information saved after the previous successful synchronization. It packages and sends only files that have changed.

A full synchronization is recommended in the following situations:

- Synchronizing the project to a device for the first time;
- Changing many components or resource files;
- The code state on the device no longer matches the local project;
- Files are missing after an incremental synchronization.

```bash
dejaos sync --all
```

## AI-Assisted Development

The CLI can be called directly by AI programming tools or automation scripts. For example, after an AI tool modifies the code, it can run:

```bash
dejaos run
```

This removes the need to manually click VSCode buttons and completes code synchronization and device execution automatically. To continuously inspect runtime output, run:

```bash
dejaos logs
```

## VSCode Extension and CLI

The VSCode extension and CLI can be used independently:

- Use the VSCode extension if you prefer a graphical interface, visual project configuration, and the GUI editor;
- Use DejaOS CLI if you prefer terminal workflows, automation scripts, or AI-assisted development;
- Both tools use the same `app.dxproj` project format.
