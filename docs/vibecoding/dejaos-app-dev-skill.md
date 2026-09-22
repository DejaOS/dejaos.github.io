# Using the DejaOS App Development Skill

`dejaos-app-dev-sdk2-0` is an AI coding Skill for DejaOS SDK 2.0 app developers. After installing it into a Skill-capable tool such as **Cursor** or **Codex**, you can create, modify, run, and review DejaOS apps through natural-language requests.

## Get the Skill

Open the DejaOS GitHub repository's [`skills` directory](https://github.com/DejaOS/DejaOS/tree/main/skills) and download the complete `dejaos-app-dev-sdk2-0` folder. Do not copy only `SKILL.md`.

On Windows, common installation locations are:

```text
Codex:     %USERPROFILE%\.codex\skills\dejaos-app-dev-sdk2-0
Cursor:    %USERPROFILE%\.cursor\skills\dejaos-app-dev-sdk2-0
WorkBuddy: %USERPROFILE%\.workbuddy\skills\dejaos-app-dev-sdk2-0
```

Restart the AI coding tool or begin a new conversation after copying the folder.

## Use the Skill

Name the Skill directly in your request:

```text
Use $dejaos-app-dev-sdk2-0 to create a DejaOS SDK 2.0 access-control app
for FCV5002. Confirm the device capabilities first, then create the project.
When the USB device is connected, run the app and check its logs.
```

For an existing app, provide its path, exact device model, actual SKU options, and requested change:

```text
Use $dejaos-app-dev-sdk2-0 to modify C:\projects\access-control.
The device is FCV4914. Add a scan-success page and an audio prompt.
Check every component API against this project's dxmodules.
```

## What to Expect

The AI will normally:

1. Check whether the DejaOS CLI is installed and ask before helping install it.
2. Confirm the exact device model and any optional hardware used by the app.
3. Create a complete project with `dejaos new`, or inspect the existing project.
4. Add the appropriate UI font when needed.
5. Validate component names and API calls against the project's generated `dxmodules/*.js`.
6. Ask whether the correct USB device is connected.
7. After confirmation, synchronize and run the app, then inspect device logs.
8. Repeat the run-and-log check after material code or resource changes while the device remains available.

Be precise about the model and installed options. A feature supported as an option by a model is not necessarily installed on a particular unit. When no device is available, the AI can still perform static checks, but real-device validation remains pending.

See [DejaOS CLI](../basics/cli.md) for CLI basics.
