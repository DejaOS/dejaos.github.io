# Smart Locker System (Face Recognition Offline Version)

A face-recognition-based smart locker management system built for embedded devices using the DejaOS platform. This application reuses the overall architecture and business logic of the password-based **Smart Locker (Offline Version)**, but moves from a small screen to a larger display and replaces password unlocking with **face recognition unlocking**.

:::info Production-Ready Application
This is a **fully functional application** ready for deployment. It is based on the same core as `smart_locker_offline`, but upgraded with face recognition as the primary identity for locker access.
:::

:::tip Offline Version
This is the **offline version** of the face-recognition smart locker system. It operates completely independently without any network connection or centralized management - all operations are performed directly on the device.
:::

## Application Screenshots

| Interface | Preview |
| :--- | :--- |
| **Home** | ![Home](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/home_20260304_145316.png) <br /> _Home screen showing face-recognition entry, available lockers, and quick access to store/pick functions._ |
| **User Pick Cabinet** | ![User Pick Cabinet](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/userPickCabinet_20260304_145251.png) <br /> _User flow for selecting a cabinet and interacting via face recognition._ |
| **Admin Login** | ![Admin Login](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/adminLogin_20260304_145326.png) <br /> _Administrator login screen on the larger display._ |
| **Admin Home** | ![Admin Home](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/adminHome_20260304_145404.png) <br /> _Admin dashboard with links to group config, open cabinet, records, etc._ |
| **Group Config** | ![Group Config](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/adminGroupConfig_20260304_145418.png) <br /> _Configure multiple locker groups and cabinet ranges, now on a larger-screen layout._ |
| **Open Cabinet** | ![Open Cabinet](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/adminOpenCabinet_20260304_145437.png) <br /> _Admin page to open a specific cabinet for maintenance or help._ |
| **Access Records** | ![Access Records](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/adminRecords_20260304_145527.png) <br /> _Paginated history of all store/pick operations, including face-based access logs._ |
| **Face Mask Prompt** | ![Face Mask Prompt](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/face_offline/screenshot/faceMask_20260304_145836.png) <br /> _Face recognition prompt and guidance UI on the large screen._ |

---

## Project Overview

This face-recognition Smart Locker application is a fully functional embedded system designed for larger-screen devices in the **smartlocker** series. Its core:

- **Shared Architecture**: Reuses the overall structure, worker design, and business logic from the password-based `smart_locker_offline` project.
- **Face Recognition Unlocking**: Replaces 6-digit password input with **face recognition** for user identification and locker access.
- **Larger Display**: Migrates from a small-screen layout to a larger screen, with redesigned UI for better visual space and interaction.
- **Offline Operation**: All recognition, storage, and locker control logic runs locally on the device without any cloud dependency.

### Relationship to `smart_locker_offline`

The following design aspects are very similar to `smart_locker_offline`:

- Locker grouping and numbering rules
- Business logic for storing and picking items
- Admin functions such as group management, manual open, records, and time settings
- Multi-worker architecture and RS-485 lock board communication

The main differences are:

- **Identity Method**: Password-based → face-recognition-based
- **User Flow**:
  - When a user approaches the locker, the camera performs face recognition.
  - If the face **has not been registered**, the system automatically registers this face (according to business rules) and associates it with a locker operation.
  - Once registered, users can **open cabinets and store/pick items using their face**.
- **Password Unlock Removed**: User-facing password input flows (store password, pick password, etc.) are removed. Administrative password is retained only for system-level access.
- **Screen Layout**: The UI is redesigned to leverage the larger display, improving face capture area, prompts, and admin navigation.

---

## AI-Generated Application

Like the password-based offline version, this face-recognition variant was also **generated through AI-assisted development**.

The project was created through **many iterative conversations** with AI assistants, building on:

- The development guide in `.prompt/main.md`
- The JS component source code in the `dxmodules` directory
- The existing `smart_locker_offline` codebase as a structural and architectural reference

The AI-generated work includes:

- New face-recognition user flows on top of the original locker logic
- Updated UI pages for larger screens and camera preview
- Integration with face recognition modules for capture, verification, and automatic registration
- Extended records layer to log face-based access

---

## Main Features (Compared to Password-Based Version)

### User Features

Most business flows are shared with `smart_locker_offline`, but with the following changes:

- **Face-Based Access**: Users open lockers via face recognition instead of entering a 6-digit password.
- **Automatic Face Registration**: If a user's face is not yet in the system, the application can automatically register the face during operation according to the configured rules.
- **Store & Pick with Face**: Each user can store and retrieve items using their face as the unique identifier.
- **Real-time Status**: The home screen continues to show the number of available lockers and system status, now optimized for a larger display.

### Administrative Features

Admin functions are largely the same as in `smart_locker_offline`:

- **Locker Group Management**: Configure multiple groups with custom ranges.
- **Manual Cabinet Control**: Open individual cabinets or all cabinets at once.
- **Access Records**: View paginated history of operations, now including face-based access records.
- **Time Settings**: Configure system time.
- **Admin Password**: Set and change the administrator password (system-level only; user-facing password flows are removed).

---

## Project Structure

The complete source code for this application can be found here: [GitHub Source Code](https://github.com/DejaOS/DejaOS/tree/main/apps/solutions/smartlocker/face_offline/source)

The project layout is very similar to `smart_locker_offline`, with additional modules for face recognition and large-screen UI:

```text
smart_locker_face_offline/
├── app.dxproj                 # Project configuration
├── dxmodules/                 # DejaOS modules (auto-downloaded)
├── resource/                  # Application resources (fonts, images, face UI assets)
├── src/
│   ├── main.js               # Application entry point
│   ├── uiWorker.js           # UI worker entry (large-screen layout)
│   ├── lock/                 # Lock control and service logic (inherits from offline version)
│   ├── face/                 # Face recognition-related modules (capture, verify, register)
│   └── pages/                # UI pages (home, user flows, admin pages)
└── .prompt/                  # Development guide (AI reference)
```

The worker architecture (Main, UI, Lock, Face/Camera) follows the same principles as the offline password-based version, with face recognition added as another specialized worker or module.

---

## Core Technologies

- **DejaOS UI System**: Large-screen UI built with `dxUi` components.
- **Face Recognition**: Integration with DejaOS facial modules for image capture, feature extraction, verification, and registration.
- **EventBus & RPC**: Cross-worker messaging between UI, lock control, and face recognition.
- **dxSqliteDB**: SQLite database for persistent storage of locker status, records, and face-related metadata.
- **dxUart / RS-485**: Serial communication with the lock control board (same as offline version).
- **dxMap**: Shared state across workers (locker status, face recognition state, etc.).

---

## Hardware Requirements

- **Device Model**: Primarily designed for the **FCV5003** device.
- **Device Family**: Other smartlocker face-recognition models with larger displays and camera modules can also be supported with minor UI adaptations.
- **Display**: Large touchscreen (resolution and aspect ratio depend on target hardware; UI is designed for a wide-format screen).
- **Camera**: Built-in camera for face recognition, positioned for comfortable user interaction.
- **Serial**: RS-485 (or similar) interface for lock control boards.
- **Audio**: PWM buzzer or speaker for user feedback.

---

## Getting Started

1. Open the project in VSCode with the DejaOS extension.
2. Ensure `app.dxproj` is configured for the target smartlocker face-recognition device model.
3. Click \"Install\" in the DejaOS extension to download required modules (including facial modules).
4. Deploy to the target device and perform initial face-enrollment tests.

### Initial Configuration

1. **Locker Groups**: Configure locker groups via the admin panel.
2. **Admin Password**: Set administrator password for system entry.
3. **Face Recognition Rules**: Adjust parameters such as recognition thresholds, auto-registration policy, and prompts according to deployment requirements.

---

**Tip**: This application shares most of its code structure and business logic with the password-based `smart_locker_offline` project. When customizing or extending functionality, you can reuse the same patterns (services, workers, pages) while focusing on face-recognition-specific behavior as the main difference.

