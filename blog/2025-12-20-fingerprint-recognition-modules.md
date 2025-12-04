---
slug: fingerprint-recognition-modules-release
title: "Fingerprint Recognition Modules: Complete Solutions for Identity Verification"
authors: voxer
tags:
  [
    dejaos,
    fingerprint,
    recognition,
    security,
    dxFingerZaz,
    dxFingerMz,
    biometric,
  ]
---

DejaOS now provides comprehensive fingerprint recognition capabilities through two powerful modules: **dxFingerZaz** and **dxFingerMz**. Both modules enable developers to implement secure, reliable fingerprint-based authentication systems with ease.

<!--truncate-->

## Overview

Fingerprint recognition is one of the most widely used biometric authentication methods, offering a perfect balance between security and convenience. DejaOS's fingerprint recognition modules provide complete solutions for identity verification, from fingerprint enrollment to real-time recognition.

Both modules communicate with fingerprint recognition hardware via UART serial port, suitable for several DejaOS devices with fingerprint modules.

## Two Powerful Modules

### dxFingerZaz Module

The **dxFingerZaz** module uses **ID-based identification** (range 1-5000) and provides 3 RAM buffers for flexible fingerprint processing. Key features include:

- **Independent Finger Detection**: Dedicated `fingerDetect()` function for detecting finger placement
- **Flexible Feature Merging**: Supports merging 2-3 fingerprint captures for improved accuracy
- **Universal Image Capture**: Single `getImage()` function for all use cases
- **Complete Management**: Full template storage, loading, upload, and download capabilities

### dxFingerMz Module

The **dxFingerMz** module uses **Page Index-based identification** (range 0-65535) and provides 2 character buffers. It offers advanced automation features:

- **Auto Registration**: One-click complete fingerprint registration process
- **Auto Identification**: Automatically completes image capture, feature extraction, and library search
- **Dual Capture Modes**: Separate functions for verification (`getImage()`) and enrollment (`getEnrollImage()`)
- **Large Capacity**: Supports up to 65,535 fingerprint templates

## Use Cases

Fingerprint recognition modules are ideal for:

- **Access Control Systems**: Secure entry management for buildings and restricted areas
- **Time & Attendance**: Employee attendance tracking and verification
- **Device Authentication**: Secure login and device unlocking
- **Identity Verification**: Personal identification in various applications
- **Smart Lock Systems**: Biometric door locks and security systems

## Getting Started

To get started with fingerprint recognition in DejaOS:

1. **Choose Your Module**: Select `dxFingerZaz` or `dxFingerMz` based on your hardware and requirements
2. **Initialize the Module**: Configure UART connection parameters
3. **Test Connection**: Verify communication with the fingerprint hardware
4. **Implement Core Processes**: Build fingerprint detection, registration, and recognition workflows

For detailed API documentation, code examples, and best practices, please refer to our comprehensive [Fingerprint Recognition Development Overview](https://dejaos.com/docs/finger/overview/).

The documentation includes:

- Complete API reference for both modules
- Step-by-step code examples
- Detailed explanations of core concepts
- Comparison between the two modules
- Best practices for implementation

## Summary

DejaOS's fingerprint recognition modules provide developers with powerful, easy-to-use tools for implementing biometric authentication. Whether you're building access control systems, attendance solutions, or secure device authentication, these modules offer the flexibility and reliability you need.

With comprehensive documentation and clear examples, you can quickly integrate fingerprint recognition into your DejaOS applications and deliver secure, user-friendly authentication experiences.
