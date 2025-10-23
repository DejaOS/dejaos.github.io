# Facial Recognition Development Overview

---

## Introduction

We provide several devices that support facial recognition. Since developing facial recognition applications can be complex, we have created this dedicated topic to explain the relevant concepts and processes in detail. It also provides multiple examples, from simple to complex, to guide users in developing their own facial recognition applications.

---

## Basic Concepts

- **RGB & Camera**: Refers to a standard color camera that captures images within the visible light spectrum (Red, Green, Blue). It's used to obtain color photos of faces and is the most common type of camera in daily life. Users can see their own dynamic face on the screen, like looking in a mirror.
- **NIR & Camera**: NIR (Near-Infrared) refers to a near-infrared camera. It captures images in the near-infrared spectrum, which is invisible to the human eye. NIR cameras perform exceptionally well in low-light or no-light conditions and can resist spoofing attacks from photos or videos, making them a key technology for liveness detection.
- **IR Fill Light**: Refers to an Infrared fill light. It emits infrared light, which is invisible to the human eye, to illuminate faces in dark environments, allowing the NIR camera to capture clear facial images.
- **Feature Vector**: Also known as a facial feature vector. This is a vector composed of a series of numbers, which extracts key information from a facial image that uniquely identifies an individual (e.g., distance between eyes, width of the nose bridge). The feature vector is the core basis for face comparison. Our devices can perform facial recognition without storing photos by only saving the corresponding feature vectors. These vectors are typically much smaller than images and have a fixed length; most of our facial feature vectors are 1024 bytes long.
- **Face Feature Database**: A database specifically for storing the facial feature vectors of registered users. During recognition, the system compares the feature vector captured in real-time with the data in this database.
- **Liveness Detection**: Used to determine if the face in front of the camera is a real, live person and not a photo, video, or mask. This is a crucial step to prevent malicious attacks and ensure system security. High-accuracy liveness detection often requires a combination of RGB and NIR cameras.
- **Face Detection**: The process of locating and drawing a bounding box around all faces in an image or video stream. It is the first step in the subsequent recognition process.
- **Face Detection Threshold**: This is a confidence score. After detecting a region that might be a face, the system assigns a score. Only if the score is above a set threshold will the system confirm it as a valid face. Adjusting this threshold can balance the accuracy and recall rate of detection. We typically don't expose this value to developers; instead, we hardcode an optimized value.
- **Face Comparison**: The process of comparing two different facial feature vectors to calculate a similarity score between them. It is divided into two types:
  - **1:1 Comparison**: Determines if two faces belong to the same person. Commonly used for identity verification (e.g., face login).
  - **1:N Comparison**: Compares one face against N feature vectors in the database to find the best match. Commonly used for identity recognition (e.g., access control systems).
- **Face Comparison Threshold**: This is a similarity score. After a 1:1 or 1:N comparison, the system will only consider it a successful match if the similarity score is above the set threshold. This is a key parameter that determines recognition accuracy.
- **Face Recognition**: A complete process that includes real-time face detection, liveness detection, feature extraction from a video stream, and comparison against a face feature database to ultimately identify a person's identity.
- **Face Registration**: Also known as face enrollment. It is the process of capturing a user's facial information for the first time and storing it in the face feature database. This often requires the user to cooperate with some actions in front of the camera to ensure high-quality facial images are captured for extracting stable and reliable feature vectors. Registration can also be done from a photo.

---

## Basic Flows

A complete facial recognition application typically includes three core flows: **Face Detection**, **Face Registration**, and **Face Recognition**.

### 1. Face Detection Flow

1.  **Capture Image**: The camera (RGB/NIR) starts capturing a video stream.
2.  **Detect Face**: A stable and clear face is detected from the video stream, and its coordinates on the screen are returned.
3.  **Display Face**: The developer draws a bounding box on the screen based on the coordinates. As the face moves, the bounding box moves with it.

### 2. Face Registration Flow

1.  **Trigger Registration**: The application starts the user registration process.
2.  **Capture Image**: The camera (RGB/NIR) starts capturing a video stream.
3.  **Detect Face**: A stable and clear face is detected from the video stream.
4.  **Quality Assessment**: The quality of the facial image is evaluated (e.g., lighting, pose, clarity).
5.  **Extract Feature**: A feature vector is extracted from the high-quality facial image.
6.  **Save to Database**: The user's identity information (usually a user ID) is stored along with the extracted feature vector in the face feature database.

:::tip Registration from Photo
The process for registering from a photo is simpler, requiring only steps 5 and 6. Developers can send a photo to the device (e.g., over the network), the device extracts the feature vector directly from the photo and saves it to the database. The original photo can then be deleted.
:::

### 3. Face Recognition Flow

1.  **Start Recognition**: The application begins the face recognition process.
2.  **Capture Image**: The camera (RGB/NIR) captures a real-time video stream.
3.  **Detect Face**: A face is detected from the video stream.
4.  **Liveness Detection**: Determines if the detected face is a real person to prevent attacks from photos, videos, etc.
5.  **Extract Feature**: If liveness detection passes, the real-time feature vector of the face is extracted.
6.  **Compare Feature**: The real-time feature vector is compared against the data in the face feature database (1:N comparison).
7.  **Output Result**: If the comparison similarity score exceeds a preset threshold, the recognition is successful, and the corresponding user information (usually the user ID) is returned; otherwise, it fails.

---

## Basic Components

The DejaOS facial recognition component is `dxFacial`, which replaces the older `dxFace` and `dxCapture` components. `dxFacial` encapsulates complex underlying logic and provides a simplified API for developers. Its core features are as follows:

### 1. Core Lifecycle

- **Initialization**: `dxFacial.init(config)`
  This is the first step to using the component. It initializes the facial recognition engine and cameras by passing a configuration object. Configuration options include camera parameters, database path and capacity, detection distance, recognition timeout, liveness detection, and comparison thresholds.
- **Deinitialization**: `dxFacial.deinit()`
  Called when exiting the application to release all resources.

### 2. Event Handling and Main Loop

`dxFacial` uses an asynchronous, event-driven model. Developers need to periodically call the `loop` function to process events.

- **Set Callbacks**: `dxFacial.setCallbacks({ onRecognition: (event) => { ... } })`
  Sets an `onRecognition` callback function to receive and handle important recognition results, such as success, failure, or timeout.
- **Loop Processing**: `dxFacial.loop()`
  This function should be called periodically in a `setInterval` (a 50ms interval is recommended). It drives the engine to process its internal event queue and triggers the `onRecognition` callback when a result is available.
- **Get Real-time Detection Data**: `dxFacial.getDetectionData()`
  This function is used for high-frequency retrieval of real-time face detection information (like bounding box coordinates). It should be called in the UI refresh loop to draw face tracking boxes on the screen, separating it from the low-frequency event handling of `loop`.

### 3. Face Database Management

- **Register from Camera**: `dxFacial.getFeaByCap(timeout)`
  Starts the camera to capture a face within a specified timeout and returns a high-quality facial feature vector. This is the core function for live, on-site registration.
- **Add Feature**: `dxFacial.addFea(userId, featureBase64)`
  Associates a user ID with a base64-encoded feature vector and stores it in the database.
- **Update Feature**: `dxFacial.updateFea(userId, featureBase64)`
  Updates an existing feature vector in the database based on the user ID.
- **Delete Feature**: `dxFacial.deleteFea(userId)`
  Deletes face data for a specific user ID.
- **Clear Database**: `dxFacial.cleanFea()`
  Deletes all data from the face database.

### 4. Engine Control and Configuration

- **Set Run Status**: `dxFacial.setStatus(isRunning)`
  Dynamically controls the engine's running state. Pass `true` to start recognition, `false` to pause.
- **Dynamic Configuration**: `dxFacial.getConfig()` / `dxFacial.setConfig(config)`
  Provides high flexibility by allowing dynamic retrieval or updating of engine configuration parameters at runtime.

### 5. Utility Functions

- **Get Environment Brightness**: `dxFacial.getEnvBrightness()`
  Gets the current environment brightness level, which can be used to prompt the user if the lighting is too dim or too bright.

### 6. Display Control Helper (dxDisplay)

DejaOS provides a helper component, `dxDisplay`, which encapsulates low-level operations for the screen hardware, allowing developers to easily control the screen's backlight, on/off status, and power mode. This is very useful in facial recognition applications, for example, to dim the backlight or turn off the screen to save power when no one is present.

#### Main Functions:

- **Screen Backlight Control**
  - `dxDisplay.getBacklight()`: Gets the current screen backlight brightness (range 0-100).
  - `dxDisplay.setBacklight(brightness)`: Sets the screen backlight brightness.
- **Screen Enable Control**
  - `dxDisplay.getEnableStatus()`: Gets the screen's enable status (1 for on, 0 for off).
  - `dxDisplay.setEnableStatus(enable)`: Sets the screen's enable status. Pass `true` or `1` to turn on, `false` or `0` to turn off.
- **Screen Power Mode**
  - `dxDisplay.getPowerMode()`: Gets the screen's current power mode (0 for Normal, 1 for Standby).
  - `dxDisplay.setPowerMode(mode)`: Sets the screen's power mode.

## Summary:
This document serves as an introductory guide to facial recognition development, providing a comprehensive overview from core concepts to practical application. We first clarified the definitions of key terms like RGB/NIR cameras, feature vectors, and liveness detection. Then, we detailed the three core business flows: face detection, face registration, and face recognition. Finally, we provided an in-depth look at the core API usage of the `dxFacial` component and the functionality of the `dxDisplay` helper component.

Mastering the content of this document will lay a solid foundation for your subsequent in-depth learning. Future documentation will focus on these three basic flows, providing multiple code examples from simple to complex to detail specific development aspects.
