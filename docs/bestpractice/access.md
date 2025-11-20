# Access Control Best Practices

This document details the key data models, business processes, and architectural patterns required to build an efficient and stable access control system, based on the design experience of the DejaOS standard access control application.

---

## 1. Core Data Models

A typical access control system is built around the following four core entities:

### 1.1 Credentials

Physical or digital media used to verify identity. DejaOS supports multiple credential types, each stored in a different format in the database:

| Credential Type | Stored Content        | Data Scale (Est.) | Notes                                                                            |
| :-------------- | :-------------------- | :---------------- | :------------------------------------------------------------------------------- |
| **Face**        | Feature Vector        | ~1024 Bytes       | Original photos are not stored; only extracted mathematical features are stored. |
| **Fingerprint** | Feature Template      | ~1024 Bytes       | Similarly, only feature templates are stored.                                    |
| **QR Code**     | String Content        | ~32 - 64 Bytes    | Content of dynamic or static QR codes.                                           |
| **PIN Code**    | Hash or Plaintext     | ~6 Bytes          | Usually a 4-6 digit numeric password.                                            |
| **NFC Card**    | Card UID              | ~4 - 32 Bytes     | Serial number of IC/ID cards.                                                    |
| **Bluetooth**   | Bluetooth Data Packet | ~32 Bytes         | Typically used for mobile Bluetooth unlocking.                                   |

> **Note**: Not all hardware devices support all the above credentials; this depends on the specific hardware selection.

### 1.2 Personnel (Subject)

The subject passing through access control.

- **Core Field**: `PersonID` (Unique Identifier).
- **Extended Fields**: Name, Department, Employee ID, Validity Period, etc.

### 1.3 Permission

Defines the rules for "Who" can enter "Where" at "What Time". Common permission policies include:

- **Always Mode**: No time limit, permanently valid.
- **Time Slot Mode**: Valid only between a specific start date and end date.
- **Daily/Weekly Cycle Mode**: Valid, for example, only on working days (Mon-Fri) from 9:00 to 18:00.

### 1.4 Access Log

A complete audit record of every access attempt. Regardless of success or failure, the following should be recorded:

- **Timestamp**
- **Credential Type**
- **Credential Value**
- **Access Result** (Success/Failure and Reason)
- **Person ID** (Only on success)
- **Snapshot** (Face access usually includes a snapshot of the scene)

---

## 2. Enrollment Process

Enrollment is the process of associating "Personnel", "Credentials", and "Permissions" and writing them into the device database. There are three main implementation modes:

### 2.1 Device Side Enrollment (Offline)

Completed directly on the device, no network required.

- **Scenarios**: Standalone use, temporary visitors, no network environment.
- **Operation**:
  - **UI Entry**: Enter Person ID directly via the device screen.
  - **Hardware Collection**: The device acts as a collector to read NFC card UIDs, enroll fingerprints, or capture faces.
  - **Permission Limit**: Usually supports only default permissions (e.g., "Permanently Valid").

### 2.2 Local Web Management

Managed using the device's built-in Web Server.

- **Scenarios**: Small-scale deployment, LAN environment.
- **Operation**: After the device is connected to the network, the administrator accesses the device IP via a PC browser to visually manage personnel and permissions on the web interface.

### 2.3 Cloud Dispatch (Cloud/MQTT) - **Recommended**

The device acts as a client connecting to a backend management system.

- **Scenarios**: Large-scale deployment, centralized management.
- **Implementation Recommendations**:
  - **Protocol**: Recommended to use **MQTT** long connection, which is more real-time and efficient than HTTP polling.
  - **Process**: Administrators enter data into the backend system, which pushes update commands to specific devices via MQTT. Devices receive and write data to the local database.

```text
+------------+                  +------------+                  +----------+
| Backend Mgt|                  | MQTT Broker|                  | Device App |
+------------+                  +------------+                  +----------+
      |                              |                               |
      | 1. Admin enters Person/Perm  |                               |
      |----------------------------->|                               |
      |                              |                               |
      | 2. Publish Update Command    |                               |
      |----------------------------->|                               |
      |                              | 3. Push Message               |
      |                              |------------------------------>|
      |                              |                               |
      |                              |                   4. Parse msg & write DB |
      |                              |                               |
      |                              |                   5. Return Result (Ack) |
      |<-----------------------------+-------------------------------|
      |                              |                               |
```

:::danger Data Consistency Warning
**It is strongly recommended NOT to mix "Device Side Enrollment" and "Cloud Dispatch" modes.**
Offline enrollment data originates directly from the device, while cloud mode data originates from the server. Mixing them can easily lead to data conflicts (e.g., duplicate IDs) and synchronization difficulties. Once centralized cloud management is chosen, the device's local enrollment function should be disabled.
:::

---

## 3. Verification Process

The device concurrently listens to multiple input sources (camera, fingerprint scanner, card reader) via `Worker` threads. Once a credential is captured, the verification process is triggered.

### 3.1 Local Match (Offline) - **Most Common**

- **Mechanism**: Personnel, credential, and permission data are fully synchronized to the device locally. The verification process is completed entirely at the edge: `Credential -> Find Personnel -> Match Permission -> Open Door`.
- **Pros**: Extremely fast response (milliseconds), unaffected by network fluctuations, works offline.
- **Cons**: Device storage and computing power are limited; typically supports a database size of 2,000 - 50,000 people.
- **Applicability**: Most fixed personnel scenarios (company attendance, residential access control).

### 3.2 Server Match (Online)

- **Mechanism**: The device acts only as a "Collector". After capturing a credential, it reports it to the server via MQTT/HTTP in real-time. The server makes the judgment and returns an "Open Door" command.
- **Pros**: No limit on database size, easy to manage centrally.
- **Cons**: Highly dependent on network stability; network latency causes access delays, and network outages cause total paralysis.
- **Applicability**: Extremely large-scale personnel databases, or scenarios requiring high-security real-time authentication.

### 3.3 Hybrid Match

- **Mechanism**: Prioritize local offline verification; if no local match is found (e.g., new employee data not yet synchronized, or visitor), then initiate online verification.
- **Applicability**: Scenarios balancing user experience and flexibility.

```text
+----------+        +----------+                    +------------+
|   User   |        |  Device  |                    | Backend Svr|
+----------+        +----------+                    +------------+
     |                   |                                |
     | 1. Swipe/Face     |                                |
     |------------------>|                                |
     |                   |                                |
     |                   | 2. [Local] Find Cred & Perm    |
     |                   |                                |
     |                   |           (Match?)             |
     |                   |           /        \           |
     |                   |         Yes         No         |
     |                   |          |          |          |
     |                   |          |          v          |
     |                   |          |   3. [Online] Report|
     |                   |          |-------------------->|
     |                   |          |                     |
     |                   |          |     (Auth Logic)    |
     |                   |          |                     |
     |                   |          |   4. Return Command |
     |                   |          |<--------------------|
     |                   |          |                     |
     |                   |          v                     |
     | 5. Open Door      |<---------+                     |
     |<------------------|                                |
     |                   |                                |
     |                   | 6. Log Access (Async Report)   |
     |                   |------------------------------->|
     |                   |                                |
```

### 3.4 Log Reporting Strategy

All access logs should be prioritized for caching in the local database (recommended to set a limit, e.g., 2000 entries, with loop overwrite). When the device is online, the app automatically uploads cached logs to the server in batches.

---

## 4. Facial Recognition Special Topic

Face credentials are unique in that their core is the extraction and comparison of **Feature Vectors**.

### 4.1 Photos vs. Feature Vectors

The device compares feature vectors at the low level, not original photos. The enrollment process is essentially the conversion of "Photos" into "Feature Vectors".

### 4.2 Two Dispatch Modes

1.  **Photo Dispatch**:

    - The server sends original photos to the device.
    - The device uses CPU power to extract feature vectors and store them, then deletes the original photos.
    - **Pros**: Simple backend system development.
    - **Cons**: Photos are typically tens of KB in size, making bulk dispatch slow.

2.  **Feature Dispatch - Recommended**:
    - Set up a separate "Feature Extraction Service" (running on a standalone server).
    - Enrolled photos are converted to feature vectors on the server side first.
    - The server directly dispatches 1KB feature vector data to the device.
    - **Pros**: Greatly reduces edge-side pressure, extremely fast enrollment.
    - **Prerequisite**: The algorithm model used on the server must be **identical** to the one on the device; otherwise, feature vectors are not interchangeable.

For more details on facial technology, please refer to the [Face Recognition Overview](../face/overview).
