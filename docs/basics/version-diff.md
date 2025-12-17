---
sidebar_label: Version Differences
---

# DejaOS Version Differences

This document details the evolution and key differences of major DejaOS versions (2.1.0, 2.0.0, 1.0.0).

> **Note**: In addition to the functional differences listed below, each new version typically includes stability improvements and fixes for known bugs.

---

## DejaOS 2.1.0 (Latest Recommended)

**DejaOS 2.1.0 is the currently recommended version.** Compared to 2.0.0, it focuses on improving system management convenience and the development experience. We strongly recommend all 2.0.0 users upgrade to this version for the best experience.

### 1. System Management: Visual Upgrade

This version introduces the all-new **System Manager App**, completely replacing the Safe Mode in 2.0.0.

- **2.0.0 (Old Way)**: Relied on **Safe Mode**, requiring RS485 serial connection, which was cumbersome and slow.
- **2.1.0 (New Way)**: Supports **Visual On-Screen Operation** and **Web Remote Management**. No special cables needed; you can complete app installation, mode switching, and other operations directly on the device screen or via a computer browser.

### 2. Development Experience: Speed Optimization

- **Optimized USB Data Transfer Protocol**: Solved the slow code synchronization issue in 2.0.0 development mode, significantly improving debugging efficiency.

---

## DejaOS 2.0.0

DejaOS 2.0.0 was a milestone version that established the standard for modern DejaOS application architecture. Compared to 1.0.0, it made significant improvements in standardization and low-level management.

> **Upgrade Advice**: Although version 2.0.0 is fully functional, due to the relatively outdated development experience and management methods, it is recommended to upgrade to version 2.1.0 as soon as possible.

### 1. Maintenance Mechanism: Added Safe Mode

- **1.0.0**: Lacked a low-level emergency management mechanism.
- **2.0.0**: Added **Safe Mode**, allowing system maintenance and app installation via serial tools.

### 2. App Standards: Comprehensive Upgrade

- **Package Format**: Upgraded from `.zip` to `.dpk` (DejaOS Package).
  - _Note: Supports one-click packaging via VSCode plugin (default full package), replacing the manual compression of 1.0.0._
- **Directory Structure**: Introduced a more standardized hierarchy, adding the `/app/code` prefix to source paths (e.g., `/app/code/src/main.js`).
- **OTA Path**: Simplified the upgrade package path to `/upgrades.zip` (1.0.0 was `/app/data/upgrades/APP_1_0.zip`).

---

## DejaOS 1.0.0 (Discontinued)

The early initial version of DejaOS, **which has basically exited the market**, and official maintenance has largely ceased.

- **Key Features**:
  - No Safe Mode.
  - Used standard `.zip` package format, requiring manual packaging.
  - Flatter app directory structure (directly under root).
