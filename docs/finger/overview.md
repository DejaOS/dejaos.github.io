# Fingerprint Recognition Development Overview

---

## Introduction

We provide multiple fingerprint recognition modules. Fingerprint recognition development is relatively complex, so we have created a dedicated topic to carefully explain fingerprint recognition concepts and processes, and provide multiple examples from simple to complex to guide users in developing fingerprint recognition applications.

We support two fingerprint modules: **dxFingerZaz** (Zaz module) and **dxFingerMz** (MZ module), both of which communicate with fingerprint recognition hardware via UART serial port.

---

## Basic Concepts

- **Fingerprint Sensor**: A hardware device used to capture fingerprint images. Users place their fingers on the sensor, and the sensor captures the detailed features of the fingerprint.

- **Fingerprint Image**: The raw fingerprint image data captured by the sensor. This is the foundation for subsequent processing.

- **Feature Value**: Also known as fingerprint template or feature file. This is digital feature data extracted from fingerprint images, containing key information that can uniquely identify the fingerprint (such as minutiae points, ridge directions, etc.). Feature values are the core basis for fingerprint matching. Our modules can achieve fingerprint recognition by saving only feature values without saving the original images. These values are typically much smaller than images and have a fixed length.

- **Fingerprint Library**: A database specifically used to store registered users' fingerprint feature values. When performing fingerprint recognition, the system compares the real-time captured fingerprint feature values with the data in the library. Different modules use different identification methods:
  - **Zaz Module**: Uses **ID** (numeric identifier, range 1-5000)
  - **MZ Module**: Uses **Page Index** (page index, range 0-65535)

- **Buffer**: A temporary storage area in the module's RAM, used to temporarily store fingerprint images and feature values during processing.
  - **Zaz Module**: Provides 3 RAM buffers (Buffer 0, 1, 2)
  - **MZ Module**: Provides 2 character buffers (Buffer 1, 2)

- **Feature Generation**: The process of extracting feature values from fingerprint images. The captured fingerprint image goes through preprocessing, feature extraction, and other steps to generate fingerprint feature values that can be used for matching.

- **Feature Merging**: Merging multiple captured fingerprint feature values into a more complete and accurate template. Usually, 2-3 fingerprint captures need to be collected and merged during enrollment to improve recognition accuracy.

- **Fingerprint Detection**: Detecting whether a finger is placed on the sensor. This is a prerequisite for subsequent fingerprint recognition.

- **Fingerprint Matching**: Comparing two different fingerprint feature values and calculating the similarity score between them. This is divided into two types:
  - **1:1 Matching**: Determining whether two fingerprints belong to the same finger, commonly used for identity verification (such as fingerprint login).
  - **1:N Matching**: Comparing one fingerprint with N feature values in the fingerprint library to find the best match, commonly used for identity identification (such as access control systems).

- **Security Level**: Controls the strictness of fingerprint matching. The higher the level, the stricter the matching requirements, the lower the false acceptance rate, but the false rejection rate may increase. The typical range is 1-5, with level 3 being a balanced choice for most application scenarios.

- **Fingerprint Recognition**: This is a complete process that includes capturing fingerprint images from the sensor, extracting feature values, comparing with the fingerprint library, and finally identifying the person's identity.

- **Fingerprint Registration**: Also called fingerprint enrollment. Refers to the process of first capturing and storing a user's fingerprint information into the fingerprint library. Usually requires users to press their fingers multiple times to ensure high-quality fingerprint images are captured and stable, reliable feature values are extracted.

---

## Basic Processes

A complete fingerprint recognition application typically includes three core processes: **Fingerprint Detection**, **Fingerprint Registration**, and **Fingerprint Recognition**.

### 1. Fingerprint Detection Process

1. **Detect Finger**: Detect whether a finger is placed on the sensor.
2. **Capture Image**: If a finger is detected, capture the fingerprint image.
3. **Quality Assessment**: Evaluate the quality of the fingerprint image (such as clarity, completeness).

### 2. Fingerprint Registration Process

1. **Trigger Registration**: The application initiates the user registration process.
2. **First Capture**: Prompt the user to place their finger and capture the first fingerprint image.
3. **Generate Feature**: Extract feature values from the first image and store them in buffer 1.
4. **Second Capture**: Prompt the user to place their finger again and capture the second fingerprint image.
5. **Generate Feature**: Extract feature values from the second image and store them in buffer 2.
6. **Merge Features**: Merge the feature values from the two buffers into a more complete template.
7. **Save to Library**: Store the user's identity information (usually the user's ID) together with the merged feature values into the fingerprint library.

:::tip Multiple Captures
It is usually recommended to capture 2-3 fingerprints and merge them, which can improve the accuracy and success rate of subsequent recognition. Different capture angles and pressures may capture different feature points, and merging can supplement missing feature points.
:::

### 3. Fingerprint Recognition Process

1. **Start Recognition**: The application begins fingerprint recognition.
2. **Detect Finger**: Detect whether a finger is placed on the sensor.
3. **Capture Image**: If a finger is detected, capture the fingerprint image.
4. **Generate Feature**: Extract real-time feature values from the fingerprint image.
5. **Feature Matching**: Compare the real-time feature values with the data in the fingerprint library for 1:N matching.
6. **Output Result**: If the similarity score exceeds the preset threshold, recognition is successful and returns the corresponding person's information (usually the person's ID); otherwise, recognition fails.

---

## Main Differences Between the Two Modules

| Feature | Zaz Module | MZ Module |
|---------|------------|-----------|
| **Identification Method** | ID (1-5000) | Page Index (0-65535) |
| **Number of Buffers** | 3 (0, 1, 2) | 2 (1, 2) |
| **Feature Merging** | Supports merging 2-3 | Fixed to merge 2 |
| **Auto Functions** | None | Supports auto registration and auto recognition |
| **Finger Detection** | `fingerDetect()` | No independent interface |
| **Image Capture** | `getImage()` universal | `getImage()` for verification, `getEnrollImage()` for registration |

---

## Summary

This document serves as an introductory guide to fingerprint recognition development, systematically introducing a comprehensive view from core concepts to practical applications. We first clarify the definitions of key terms such as fingerprint sensor, feature values, fingerprint library, and buffers; then, we detail the three core business processes of fingerprint detection, fingerprint registration, and fingerprint recognition; finally, we compare the main differences between the two modules.

Mastering the content of this document will lay a solid foundation for your subsequent in-depth learning. Subsequent documents will focus on these three basic processes, providing multiple code examples from simple to complex, and elaborating on specific development details.

