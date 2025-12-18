---
id: welcome
title: Welcome to DejaOS Modules
---

# DejaOS Modules

Welcome to the DejaOS Modules documentation! This section contains detailed documentation for all modules available in DejaOS and provides a short grouped overview to make discovery easier. In most DejaOS applications you will only use a subset of these modules; pick and combine them as needed for your specific scenario.

## Available Modules

### Module Group Overview

- **Basic Modules (required)**:

  - `dxLogger` (logging, recommended replacement for `console.log`)
  - `dxStd` (standard system utilities)
  - `dxOs` (operating system abstraction)
  - `dxDriver` (device driver bundle)
  - `dxMap` (shared memory across workers)
  - `dxEventBus` (message bus across workers)
  - `dxCommonUtils` (common algorithms and utility helpers)

  > Note: Basic modules provide core capabilities that most DejaOS applications depend on. **We recommend selecting all of them by default when creating a project or choosing modules.**

- **UI & Interaction**:

  - `dxUi` (UI components, layout and touch/key event handling; required when your app has a UI)

- **Data Storage & Configuration**:

  - `dxSqlite` (SQLite support for legacy projects, deprecated)
  - `dxSqliteDB` (structured data storage, recommended SQLite data module)
  - `dxKeyValueDB` (lightweight key/value data storage)
  - `dxConfiguration` (read/write and persistence of runtime parameters and business configuration)
  - `dxConfig` (compatibility layer and helper utilities for configuration access, deprecated)

- **Network & Remote Services**:

  - `dxNetwork` (network access and management)
  - `dxNet` (low-level network wrapper, deprecated)
  - `dxHttpClient` (HTTP client)
  - `dxHttpServer` (HTTP server)
  - `dxWebserver` (built-in web server wrapper, deprecated)
  - `dxHttp` (generic HTTP helper wrapper, deprecated)
  - `dxMqttClient` (MQTT client)
  - `dxMqtt` (generic MQTT helper wrapper, deprecated)
  - `dxNtp` (network time synchronization)
  - `dxOta` (OTA update)

- **Audio**:

  - `dxAudio` (WAV playback and TTS)
  - `dxAlsa` (low-level audio device control, deprecated)
  - `dxAlsaplay` (ALSA-based audio playback, deprecated)

- **Peripherals & Interfaces**:

  - `dxGpio` (GPIO output control)
  - `dxGpioKey` (GPIO key input monitoring)
  - `dxUart` (serial communication)
  - `dxPwm` (PWM control, typically used for buzzers and lighting)
  - `dxNfc` (NFC read/write and control, deprecated)
  - `dxNfcCard` (NFC card operations and management)

- **Recognition & Protection**:

  - `dxBarcode` (QR/barcode recognition)
  - `dxCode` (encoding parsing and extended recognition, deprecated)
  - `dxFace` (face recognition module, deprecated)
  - `dxFacial` (face recognition and feature processing module)
  - `dxFingerZaz` (fingerprint device integration & recognition – ZAZ series)
  - `dxFingerMz` (fingerprint device integration & recognition – MZ series)
  - `dxWatchdog` (watchdog protection to prevent system hangs)

- **System Tools & Tasks**:

  - `dxTimeZones` (time zones and time handling)
  - `dxIconv` (character encoding conversion)
  - `dxCryptoES` (commonly used encryption/decryption and digest algorithms)
  - `dxQueue` (task queue management)
  - `dxWorkerPool` (worker pool scheduling and concurrent task management)

## Getting Started

Choose a module from the sidebar to learn more about its API, usage examples, and best practices.

## Module Development

If you're developing custom modules for DejaOS, documentation will be released later.
