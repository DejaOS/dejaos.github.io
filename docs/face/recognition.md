# Example: Face Registration and Recognition

---

## Introduction

This chapter builds upon the code from the previous [Example: Face Detection and Tracking Box](./detect.md) by adding a small amount of code to implement a complete face registration and recognition application.

We will focus on the following two points:

1.  **In `faceworker.js`**:
    - Set up a callback function to receive **recognition** results.
    - Listen for events from the UI thread to execute the **registration** process.
2.  **In `uiworker.js`**:
    - Add a "Register" button.
    - Send a registration request to `faceworker.js` via the event bus (`dxEventBus`).

---

## Code Changes

### faceworker.js: Adding Recognition Callback and Registration Logic

Add the following code before the `std.setInterval` in `faceworker.js`:

```javascript
// ... import statements ...
// try { face.init() } catch ...

// Set the recognition event callback
face.setCallbacks({
  onRecognition: (event) => {
    // This callback is triggered when a registered face is recognized
    if (event.isRecognition) {
      log.info("Recognition successful, User ID:", event.userId);
      // Business logic can be added here, e.g., sending the userId to the UI thread via bus
    }
  },
});

// Listen for the registration event from the UI thread
bus.on("register_facial_recognition", () => {
  log.info("Starting the face registration process");
  try {
    const userId = "testuser"; // Example: hardcode a userId
    const timeout = 5000; // 5-second timeout

    // To prevent duplicate registration, first try to delete the user
    // (in a real application, this should be determined by business logic)
    face.deleteFea(userId);

    // 1. Capture face from camera and extract feature vector (this is a synchronous blocking operation)
    const res = face.getFeaByCap(timeout);

    if (res && res.feature) {
      log.info("Feature extraction successful");
      // 2. Add the feature vector and userId to the face database
      face.addFea(userId, res.feature);
      log.info("Feature has been successfully added to the face database");
    } else {
      log.warn(
        "Registration failed: Could not extract a valid feature within the timeout"
      );
    }
  } catch (ex) {
    log.error("Exception in registration process", ex);
  }
});

// std.setInterval(() => { ... });
```

### uiworker.js: Adding a Register Button and Event Firing

Add the following code before `dxui.loadMain(mainview)` in `uiworker.js`:

```javascript
// ...
// faceview = dxui.View.build(...)
// ...

// Create a register button
let register = dxui.Button.build("register", mainview);
register.setSize(200, 50);
register.align(dxui.Utils.ALIGN.BOTTOM_MID, 0, -20);
let label = dxui.Label.build("registerlabel", register);
label.align(dxui.Utils.ALIGN.CENTER, 0, 0);
label.text("Register");

// Listen for the button click event
register.on(dxui.Utils.EVENT.CLICK, () => {
  log.info(
    "Register button clicked, firing 'register_facial_recognition' event"
  );
  // Send registration request to faceworker via bus
  bus.fire("register_facial_recognition");
});

// dxui.loadMain(mainview);
// ...
```

---

## Core Logic Explained

### 1. Event-Driven Recognition Flow

- **`face.setCallbacks({ onRecognition: ... })`**: This function registers a callback. When `face.loop()` in `faceworker.js` detects a face in front of the camera and successfully matches it with a registered feature in the face database, the `onRecognition` callback is **asynchronously triggered**.
- **The `event` Object**: The `event` object received by the callback contains rich recognition information. A typical structure is as follows:
  ```json
  {
    "id": 4,
    "rect": [255, 436, 298, 378],
    "is_rec": true,
    "picPath": "/data/user/temp/22541180370.jpg",
    "isCompare": true,
    "compareScore": 0.85,
    "userId": "testuser",
    "feature": "base64..."
  }
  ```
  The `isRecognition` (or `is_rec`) field indicates whether the recognition was successful, and `userId` is the key piece of business data we are interested in.

### 2. Synchronous Blocking Registration Flow

- **`face.getFeaByCap(timeout)`**: This is the core function for the **from-camera** registration process. It is a **synchronous blocking** call, which means the program will pause at this point until it either successfully captures a high-quality face from the camera and extracts its feature vector, or the timeout is reached (5 seconds in this example).
- **`face.getFeaByFile(picPath)`** (Additional Note): Similar to the above, this is the core function for registration **from an image file**. It is also a **synchronous blocking** call that directly extracts the facial feature vector from the specified image path (`picPath`). This makes batch registration by sending photos over the network possible.
- **Must Be Executed in a Worker**: Because both of these functions are blocking, they **must absolutely not be called in the UI thread (`uiworker.js`)**, as doing so would freeze the entire interface. Placing them in `faceworker.js` and triggering them via events is the correct approach.
- **Return Value**: Upon success, both `getFeaByCap` and `getFeaByFile` return an object containing the feature vector (`feature`), which can then be used in the subsequent `face.addFea` operation.
  ```json
  {
    "quality_score": 33,
    "picPath": "/data/user/temp/1761815859308.jpg",
    "rect": [78, 211, 456, 593],
    "feature": "IegcIOXnUAtG4ksc4d76Ig+1BUM..."
  }
  ```

### 3. Inter-Thread Communication

The UI thread and the face processing thread communicate in a decoupled manner via `dxEventBus`. The UI thread is only responsible for sending an intent (`bus.fire('register_facial_recognition')`), while the face thread is responsible for listening for this intent (`bus.on(...)`) and executing the specific, time-consuming business logic.

---

## Summary

This example successfully integrates the core functionalities of **registration** and **recognition** on top of the face detection foundation. Through this chapter, we have learned:

- How to **asynchronously handle** successful face recognition events by setting a callback.
- How to execute **synchronous blocking** registration operations in a Worker thread to avoid UI freezes.
- How to use the `dxEventBus` to achieve **safe communication** between the UI thread and the business logic thread.

Although a commercial-grade facial recognition application would require more polished UI interactions and error handling, this example has fully demonstrated the core technical logic.

[Source Code](https://github.com/DejaOS/DejaOS/tree/main/demos/vf203_v12/vf203_v12_face_registe_recognition)
