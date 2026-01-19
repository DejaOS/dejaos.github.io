# Smart Locker System (Offline Version)

A complete smart locker management system built for embedded devices using the DejaOS platform. This application provides a user-friendly interface for storing and retrieving items from lockers, along with comprehensive administrative controls.

:::info Production-Ready Application
Unlike demo examples in the Features section, this is a **fully functional application** ready for deployment. Simply customize UI elements and configurations to match your branding, and it's ready to go live.
:::

:::tip Offline Version
This is the **offline version** of the Smart Locker System. It operates completely independently without any network connection or centralized management - all operations are performed directly on the device. An **online version** with cloud connectivity and **facial recognition** support is planned for future release.
:::

## Application Screenshots

:::note
The screenshots below are from the Chinese version of the UI. However, the source code has been fully updated with **English fonts, English interface text, and English comments**.
:::

| Interface | Preview |
| :--- | :--- |
| **Main Interface** | ![Main Interface](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/offline/screenshot/home_19700101_090355.png) <br /> _Home screen displays available lockers and provides quick access to Store and Pick functions._ |
| **Admin Home** | ![Admin Home](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/offline/screenshot/adminHome_19700101_104017.png) <br /> _Admin panel with comprehensive management tools._ |
| **Group Config** | ![Group Config](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/offline/screenshot/adminGroupConfig_19700101_104028.png) <br /> _Configure multiple locker groups with custom cabinet ranges._ |
| **Group Edit** | ![Group Edit](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/offline/screenshot/adminGroupEdit_19700101_104040.png) <br /> _Edit locker group settings and cabinet assignments._ |
| **Open All Cabinets** | ![Open All](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/offline/screenshot/adminOpenAll_19700101_104100.png) <br /> _Batch operation to open all cabinets at once._ |
| **Access Records** | ![Records](https://raw.githubusercontent.com/DejaOS/DejaOS/refs/heads/main/apps/solutions/smartlocker/offline/screenshot/adminRecords_19700101_104123.png) <br /> _View paginated history of all store/pickup operations._ |

---

## Project Overview

This Smart Locker application is a fully functional embedded system designed for the **DW200_V20** device. It features:

- **User Interface**: Intuitive touchscreen interface for storing and picking up items
- **Administrative Panel**: Complete management system for locker configuration, records, and settings
- **Hardware Integration**: Direct communication with lock control boards via RS-485
- **Data Persistence**: SQLite database for storing locker status, records, and configurations
- **Multi-worker Architecture**: Separated UI, business logic, and hardware communication workers

## AI-Generated Application

**This entire application was generated through AI-assisted development.**

This project was created through **100+ conversations** with AI assistants, demonstrating the power of AI in full-stack embedded application development. The AI primarily referenced the development guide in `.prompt/main.md` and the JS component source code in the `dxmodules` directory.

The AI was able to generate:

- Complete UI pages with proper layout and event handling
- Business logic for locker operations (store, pickup, admin functions)
- Database schema and data access layer
- Hardware communication protocols (RS-485 lock board protocol)
- Multi-worker architecture with event-based communication
- Error handling and user feedback systems

---

## Main Features

### User Features

- **Store Items**: Select an available locker, set a 6-digit password, and store items
- **Pick Items**: Enter cabinet number and password to retrieve stored items
- **Real-time Status**: View available locker count on the home screen
- **Countdown Timers**: Automatic timeout for user operations

### Administrative Features

- **Locker Group Management**: Configure multiple locker groups with custom ranges
- **Manual Cabinet Control**: Open individual cabinets or all cabinets at once
- **Access Records**: View paginated history of all store/pickup operations
- **Time Settings**: Manual system time configuration
- **Password Management**: Set and change administrator password
- **Super Admin Access**: UUID-based super admin password for emergency access

---

## Project Structure

The complete source code for this application can be found here: [GitHub Source Code](https://github.com/DejaOS/DejaOS/tree/main/apps/solutions/smartlocker/offline)

The application adopts a multi-worker architecture for separation of concerns:

```
smart_locker_offline/
├── app.dxproj                 # Project configuration
├── dxmodules/                  # dejaOS modules (auto-downloaded)
├── resource/                   # Application resources
│   ├── font/                   # Font files for UI text
│   └── image/                  # UI icons and images
├── src/
│   ├── main.js                # Application entry point
│   ├── uiWorker.js            # UI worker entry
│   ├── lock/                   # Lock control module
│   │   ├── lockWorker.js      # Lock hardware worker
│   │   ├── LockBoardProtocol.js  # RS-485 protocol
│   │   ├── LockerDB.js        # Database layer
│   │   └── LockerService.js   # Business logic
│   └── pages/                  # UI pages
│       ├── UIManager.js       # Page stack manager
│       ├── HomePage.js        # Main interface
│       ├── admin/             # Admin pages
│       └── user/              # User pages
└── .prompt/
    └── main.md                # Development guide (AI reference)
```

### Worker Architecture

1. **Main Thread** (`main.js`): Hardware initialization (PWM, GPIO), database initialization, worker creation and coordination
2. **UI Worker** (`uiWorker.js`): All UI rendering, user interaction, page navigation and lifecycle management
3. **Lock Worker** (`lockWorker.js`): RS-485 serial communication, lock board protocol handling, hardware command execution

---

## Core Technologies

- **DejaOS UI System**: Build native smooth interfaces using the `dxUi` series of components
- **EventBus & RPC**: Cross-worker messaging and communication
- **dxSqliteDB**: SQLite database for persistent storage
- **dxUart**: Serial communication (RS-485) for lock control
- **PWM Driver**: Audio feedback via buzzer
- **dxMap**: Shared memory across workers

## Database Schema

The application uses three main tables:

1. **config**: System configuration (admin password, etc.)
2. **cabinet_status**: Current status of each locker (occupied, password, timestamps)
3. **records**: Historical records of all store/pickup operations

---

## Hardware Requirements

- **Device**: DW200_V20
- **Display**: Touchscreen (480×320 resolution)
- **Serial**: RS-485 interface for lock control board
- **Audio**: PWM buzzer for user feedback

## Getting Started

1. Open the project in VSCode with DejaOS extension
2. Ensure `app.dxproj` is configured correctly
3. Click "Install" in the DejaOS extension to download required modules
4. Deploy to target device

### Initial Configuration

1. **Locker Groups**: Configure locker groups via Admin Panel → Groups
2. **Admin Password**: Set administrator password via Admin Panel → Admin PIN
3. **System Time**: Configure time via Admin Panel → Time Settings

---

**Tip**: This application is designed for the **DW200_V20** device with a screen resolution of **480×320**. Most interface layouts and image resources are optimized for this resolution. While the core business logic is cross-device compatible, UI adaptation is required for devices with different resolutions.

This project demonstrates the feasibility of AI-assisted development for embedded systems. The entire codebase, architecture, and implementation were generated through iterative AI conversations, showcasing the potential of AI in complex software development scenarios.
