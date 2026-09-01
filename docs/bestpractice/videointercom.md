# Video Intercom Best Practices

This document is for developers building stable, maintainable video intercom systems. It covers core concepts, basic logic, interaction patterns across endpoints, and design principles. For WebRTC fundamentals, DejaOS device SDK integration, and server deployment, see [Video Intercom Overview](../videointercom/overview.md) and the related topic docs in the same section.

---

## 1. Core Concepts

### 1.1 What Is Video Intercom?

Video intercom enables real-time **video + voice** communication between **door devices**, **mobile apps** (or indoor stations), and optional access-control actions such as **remote door unlock** during a call.

From a system perspective, a complete intercom session has three phases:

1. **Call setup** — One party initiates a request; the other receives notification and decides whether to answer
2. **Live call** — Both parties exchange audio/video over WebRTC
3. **Session end** — Hang up, log the session, optionally unlock the door remotely

One-sentence division of labor:

- **Signaling** handles “ringing someone” (coordinating both sides into the same session)
- **RTC** handles “talking” (transporting audio/video)
- **Business platform** handles “people management” (permissions, logs, push, unlock)

### 1.2 Four Roles in the System

| Role | Responsibilities | Does not handle |
| :--- | :--- | :--- |
| **Door device** | Capture video/audio, play remote audio, trigger calls, receive remote unlock commands | Push notifications, permission management |
| **Mobile app** | Receive incoming calls, place calls, display device video, remote unlock | Direct business communication with the device (goes through platform or RTC service) |
| **RTC service** | Signaling relay, SDP/ICE negotiation, STUN/TURN media relay | Business permissions, call records |
| **Business platform** | Device–user binding, call permissions, push notifications, call logs, remote unlock authorization | Audio/video transport |

:::info Why a business platform?
The RTC service answers “how to connect and talk,” not “who may call whom, who answered, or whether the door was opened.” Those business rules belong in your own platform.
:::

### 1.3 Two Critical Identifiers

Two identifiers are easy to confuse and must be defined clearly at design time:

| Identifier | Purpose | Created by | Lifecycle |
| :--- | :--- | :--- | :--- |
| **Device RTC ID** | Unique identity of the device on the RTC service; used for WebRTC call routing | Device firmware / assigned at RTC registration | Bound to device, long-lived |
| **Business device ID** | Unique identity in your access-control platform | Business platform | Bound to device, long-lived |
| **Session ID** | End-to-end unique ID for one call attempt | Call initiator (business layer) | Per call; archived after the session ends |

**Best practices:**

- When the app initiates WebRTC, the call target must be the **device RTC ID**, not the business device ID
- After the device comes online, sync its RTC ID to the business platform for app lookup
- Session ID must stay consistent across device, app, and platform — for logs, push, and unlock

### 1.4 Media Constraints (DejaOS Devices)

DejaOS devices differ from Android devices in media capabilities; design accordingly:

| Capability | DejaOS device | Android device / mobile app |
| :--- | :--- | :--- |
| Video | **One-way** (device → app; app receives only) | Two-way |
| Audio | **Two-way** | Two-way |
| Direct call to app | **Not supported** (requires business platform relay) | Supported |

When a door device “actively looks for someone,” the actual path is **device notifies platform → platform pushes app → app initiates WebRTC toward the device**, not a direct device-to-app RTC call. See [3.4 Business Caller vs Technical Callee](#34-business-caller-vs-technical-callee).

---

## 2. Core Data Models

### 2.1 Call Permission (Allowlist)

Video intercom is not “any user can call any device.” Use a **device–user allowlist**:

| Field | Description |
| :--- | :--- |
| Device ID | Device identifier in the business platform |
| User ID | User allowed to be called from that device |
| Tenant / organization | Multi-tenant isolation |

**Design principles:**

- Callable contacts on the device should be **fetched live** from the platform, not hard-coded on the device
- Admin changes take effect on the device’s next query
- Before the device calls a user, the platform must verify the user is on the allowlist

### 2.2 Call Records

Every call attempt (success or failure) should be audited:

| Field | Description |
| :--- | :--- |
| Session ID | End-to-end unique identifier |
| Device RTC ID | Device identity on the RTC service |
| Device ID / name | Business device info |
| Called user ID / name | User snapshot at call time |
| Call direction | Device → app or app → device |
| Call result | See table below |
| Start / answer / end time | Timestamps |
| Talk duration | Seconds after connect |
| Remote unlock | Whether unlock was performed in this session |

**Suggested call result states:**

| State | Meaning |
| :--- | :--- |
| Calling | Initiated, waiting for answer |
| Connected | Audio/video session established |
| Not answered | Timeout or no user action |
| Timeout | Exceeded wait limit |
| Rejected | User declined |
| Busy | Device or user in another call |
| Cancelled | Initiator cancelled before answer |
| Error | Network or other abnormal termination |

### 2.3 Syncing Device RTC ID

After the device comes online, report its RTC ID to the business platform:

```text
Device boot → Register with RTC service (obtain/confirm RTC ID)
            → Report to business platform via device channel (e.g. MQTT)
            → Platform stores it for app lookup
```

Before placing a call, the app should read the target device’s RTC ID from the platform — not invent one or substitute the business device ID.

---

## 3. Cross-Endpoint Architecture

### 3.1 Overall Architecture

```text
                    ┌─────────────────────────────┐
                    │        RTC service           │
                    │ Signaling / SDP·ICE / STUN   │
                    └──────┬──────────────┬───────┘
                           │              │
              Device       │              │  App
              signaling    │              │  signaling
              (TCP)        │              │  (WebSocket)
                           │              │
                 ┌─────────▼──┐    ┌──────▼──────┐
                 │ Door device│    │ Mobile app  │
                 │ (DejaOS)   │    │ (WebRTC)    │
                 └──────┬─────┘    └──────┬──────┘
                        │ Device channel   │ HTTP
                        │ (MQTT, etc.)     │ + push
                 ┌──────▼──────────────────▼──────┐
                 │       Business platform         │
                 │ Allowlist / logs / push / unlock│
                 └─────────────────────────────────┘
```

**Clear boundaries:**

- Audio/video between device and app goes **only through the RTC service**, not the business platform
- Business data (who called whom, results) goes **only through the business platform**, not the RTC service
- Push is sent by the platform; the app connects to the RTC service after receiving push

### 3.2 Two Signaling Paths

The RTC service typically exposes two signaling entry points:

| Terminal | Signaling | Typical port | Notes |
| :--- | :--- | :--- | :--- |
| DejaOS device | TCP (private protocol) | e.g. 6699 | Built into device SDK |
| App / H5 / Android | WebSocket (private protocol) | e.g. 8443 | Implement per protocol docs |

Both attach to the **same RTC service**; device RTC ID is the key for cross-path routing.

### 3.3 Device Business Channel

A separate channel between device and platform (MQTT recommended) handles:

- Reporting RTC ID
- Querying callable contact list
- Initiating / cancelling call requests
- Remote unlock and other commands

This channel is **independent** from RTC signaling.

### 3.4 Business Caller vs Technical Callee

On DejaOS and many embedded door phones, you often see this pattern: **business-wise the device is calling the app, but on the WebRTC path the app is calling the device.**

Separate two layers:

| Layer | Initiator | Action |
| :--- | :--- | :--- |
| **Business** | Door device | Report “I want to call user X” (session ID, target user, etc.) |
| **Media** | Mobile app | Start WebRTC toward the device RTC ID on the RTC service |

```text
Business view:  Device ──calls──→ App
Technical view: Device ←──WebRTC── App (app is connect initiator; device is callee)
```

**Why this is consistent:**

- The device “call” declares session intent to the platform and triggers incoming notification on the app
- The actual media path is still opened by the app over RTC
- The device usually registers on the RTC service with a **fixed RTC ID** as a stable callee

**Design alignment:**

1. **Call log direction** — Record by business intent (device → app), not by who sent the WebRTC offer
2. **Push payload** — Must include session ID and device RTC ID so the app can reverse-connect
3. **Device UI** — May show “Calling Zhang San” without dialing the app directly at RTC layer
4. **App UI** — Shows “incoming call”; WebRTC starts after the user answers

:::tip Other hardware
Android door phones or indoor stations often support direct two-way WebRTC with the app and may not need reverse-call mode. Confirm RTC capabilities before choosing the flow.
:::

---

## 4. Basic Flows

### 4.1 Device Calls App (Primary Flow)

Most common for door intercom; core DejaOS pattern.

> **Participants:** Visitor · Door device · Platform · Push service · Mobile app · RTC service

```text
Visitor                         DoorDev                         Platform                        PushSvc                         MobileApp                       RTC
     |                               |                               |                               |                               |                               |                               
     | ring / select                 |                               |                               |                               |                               |                               
     |------------------------------>|                               |                               |                               |                               |                               
     |                               |                               |                               |                               |                               |                               
     |                               | get contacts                  |                               |                               |                               |                               
     |                               |------------------------------>|                               |                               |                               |                               
     |                               |                               |<------------------------------|                               |                               |                               
     |                               |                               |                               |                               |                               |                               
     |                               | init call                     |                               |                               |                               |                               
     |                               |------------------------------>|                               |                               |                               |                               
     |                               |                               |                               |                               |                               |                               
     |                               |                               | validate allowlist            |                               |                               |                               
     |                               |                               | log + push                    |                               |                               |                               
     |                               |                               |------------------------------>|                               |                               |                               
     |                               |                               |                               |<------------------------------|                               |                               
     |                               |                               |                               |                               |                               |                               
     |                               |                               |                               | push arrives                  |                               |                               
     |                               |                               |                               |------------------------------>|                               |                               
     |                               |                               |                               |                               |                               |                               
     |                               |                               |                               |                               | check session                 |                               
     |                               |                               |                               |-------------------------------|<------------------------------|                               
     |                               |                               |-------------------------------|------------------------------>|                               |                               
     |                               |                               |                               |                               |                               |                               
     |                               |                               |                               |                               | user answers                  |                               
     |                               |                               |                               |                               | reverse RTC                   |                               
     |                               |                               |                               |                               |------------------------------>|                               
     |                               |                               |                               |                               |                               |                               
     |                               |<==============================|===============================|===============================|===============================|==============================>
     |                               |                               |                               |                               |                               |                               
     |                               | media session                 |                               |                               |                               |                               
     |                               |                               |                               |                               | report connected              |                               
     |                               |                               |                               |-------------------------------|<------------------------------|                               
     |                               |                               |                               |                               |                               |                               
     |                               |                               |                               |                               | in call...                    |                               
     |                               |                               |                               |                               | report end                    |                               
     |                               |                               |                               |-------------------------------|<------------------------------|                               
```

**Key points:**

1. Device does not RTC-dial the app directly — only requests call via platform; platform pushes app
2. App reverse WebRTC — After push, app connects to RTC service using device RTC ID
3. Same session ID end-to-end — From device through push, logs, RTC, unlock
4. Validate before ring — App should confirm session is still “calling” before ringing / routing UI

### 4.2 App Calls Device (Active View)

For admins remotely viewing the door camera:

> **Participants:** Mobile app · Platform · RTC service · Door device

```text
MobileApp                       Platform                        RTC                             DoorDev
     |                               |                               |                               |                               
     | new session ID                |                               |                               |                               
     | report call                   |                               |                               |                               
     |------------------------------>|                               |                               |                               
     |                               |                               |                               |                               
     | WebRTC call                   |                               |                               |                               
     |-------------------------------|------------------------------>|                               |                               
     |                               |                               |------------------------------>|                               
     |                               |                               |                               |                               
     |<==============================|===============================|===============================|==============================>
     |                               |                               |                               |                               
     | media session                 |                               |                               |                               
     | report connected              |                               |                               |                               
     |------------------------------>|                               |                               |                               
     |                               |                               |                               |                               
     | report end                    |                               |                               |                               
     |------------------------------>|                               |                               |                               
```

**Vs device-initiated flow:**

- App is WebRTC initiator; no push needed
- Platform logs only; does not carry media
- Device handles incoming RTC (auto-answer or UI)

### 4.3 Remote Unlock

Most sensitive intercom action; bind strictly to session state:

> **Participants:** Mobile app · Platform · Door device

```text
MobileApp                       Platform                        DoorDev
     |                               |                               |                               
     | remote unlock                 |                               |                               
     | (session ID)                  |                               |                               
     |------------------------------>|                               |                               
     |                               |                               |                               
     |                               | validate session              |                               
     |                               | unlock command                |                               
     |                               |------------------------------>|                               
     |                               |                               |                               
     |                               | audit log                     |                               
     |                               |<------------------------------|                               
```

**Security rules:**

- Only **connected** sessions may unlock
- Request user must match session user
- Request device must match session device
- Write unlock result to call log for audit

### 4.4 Cancel Call

When either side cancels before answer:

> **Participants:** Initiator · Platform · Push service · Receiver app

```text
Initiator                       Platform                        PushSvc                         Receiver
     |                               |                               |                               |                               
     | cancel call                   |                               |                               |                               
     | (session ID)                  |                               |                               |                               
     |------------------------------>|                               |                               |                               
     |                               |                               |                               |                               
     |                               | update log                    |                               |                               
     |                               | silent push                   |                               |                               
     |                               |------------------------------>|                               |                               
     |                               |                               |                               |                               
     |                               |                               | cancel arrives                |                               
     |                               |                               |------------------------------>|                               
     |                               |                               |                               |                               
     |                               |                               |                               | stop ringing                  
     |                               |                               |                               | close UI                      
```

**Best practices:**

- Cancel should use **silent custom message**, not notification bar push
- Update to “cancelled” only if state is still “calling”
- App must stop vibration, close incoming UI, tear down pre-built connections

---

## 5. Session Lifecycle

```text
                    ┌──────────┐
                    │ Not started│
                    └────┬─────┘
                         │ Initiate
                         ▼
                    ┌──────────┐   timeout/cancel   ┌─────────────┐
              ┌────│ Calling  │───────────────────→│ Cancelled / │
              │    └────┬─────┘                    │   timeout   │
              │         │ Answer                   └─────────────┘
              │         ▼
              │    ┌──────────┐   hangup/error     ┌──────────┐
              │    │ Connected│───────────────────→│  Ended   │
              │    └────┬─────┘                    └──────────┘
              │         │ Remote unlock (optional)
              │         ▼
              │    ┌──────────┐
              │    │ Unlocked │ → continue or hang up
              │    └──────────┘
              │
              │ reject/busy
              ▼
         ┌──────────┐
         │ Rejected │
         │  / busy  │
         └──────────┘
```

| Transition | Trigger | Recorded by |
| :--- | :--- | :--- |
| → Calling | Initiator | Business platform |
| → Connected | Answer party | Business platform |
| → Ended | Either hangup | Platform + duration |
| → Cancelled | Initiator cancel | Platform + notify receiver |
| → Rejected / busy / timeout | Receiver or timer | Business platform |

---

## 6. Push Notification Design

Push is how you “ring” the app when it cannot keep a live connection to your platform (especially after process kill). Use a **third-party push service** (e.g. JPush, Firebase) to deliver incoming-call events.

### 6.1 Why Third-Party Push

| Issue | Explanation |
| :--- | :--- |
| App process killed | No WebSocket / long poll; platform cannot reach app directly |
| OS power policies | Android / iOS restrict background work |
| Latency | Door calls must reach users within seconds |

Push vendors use OEM channels (Huawei, Xiaomi, OPPO, etc.) or system channels (APNs, FCM) to deliver messages even when the app is fully closed.

**Integration notes:**

- After login, bind **user ID as push alias**; platform pushes by user ID
- On logout, unbind or ignore push so logged-out users do not ring
- Use **short TTL** (e.g. 60s) for incoming call notifications

### 6.2 Two App Runtime States

The same incoming push is handled differently depending on app state:

#### State A: Foreground or background (process alive)

```text
Push arrives → Vendor SDK callback (arrived / opened)
            → App business layer receives event
            → Verify session → Ring / open incoming UI
```

- Process alive: SDK can callback app code immediately
- **Foreground**: Ring and show incoming UI at once
- **Background**: Notification bar + optional vibration; tap opens incoming UI

#### State B: App fully closed (cold start)

```text
Push arrives → System notification
            → User taps → App starts
            → Recover pending push from SDK queue
            → Verify session → Route to incoming UI
```

- No process: SDK cannot reach JS/business layer immediately
- User must **tap notification** to launch app
- On start, app must read **pending message queue** from push SDK or lose call context
- If user never taps, only notification + vibration apply; incoming UI cannot auto-open

```text
┌─────────────────────────────────────────────────────────┐
│                    Push arrives                          │
└────────────────────┬────────────────────────────────────┘
                     │
          ┌──────────▼──────────┐
          │  App process alive?  │
          └──────────┬──────────┘
                     │
         ┌───────────┴───────────┐
         │ Yes                   │ No
         ▼                       ▼
  SDK callback to app      System notification
  Ring / route immediately User tap → cold start
                             Restore from cache/queue
```

**Best practices:**

- Both paths must handle incoming calls; do not assume app is always running
- On cold start, persist push payload locally as backup to SDK queue
- On return to foreground, check for unhandled pending push

### 6.3 Two Push Message Types

| Type | Use | Form | Show in notification bar |
| :--- | :--- | :--- | :--- |
| **Notification** | Incoming call from device | Notification push | Yes |
| **Custom / silent** | Device cancelled call | Custom message | No |

**Why cancel must be silent:**

- Cancel is a **control command**, not user-facing content
- Notification-style cancel may display without invoking app logic → ring continues
- Silent message reaches app code directly to stop vibration and close UI

### 6.4 Incoming Push Payload

| Element | Recommendation |
| :--- | :--- |
| Target | Called user ID (bound to app login) |
| Payload | Session ID, device RTC ID, business device ID, device name |
| TTL | Short (e.g. 60s) |
| On receive | Verify session still “calling” before ring / route |

### 6.5 Cancel Push Payload

| Element | Recommendation |
| :--- | :--- |
| Type | Silent custom message, not notification |
| Payload | Session ID + cancel flag |
| On receive | Match active incoming session; stop ring and close UI |

### 6.6 App Push Handling Principles

- **Verify before ring** — Confirm session still “calling”; drop stale push
- **Dedupe** — Same session: do not route incoming UI repeatedly
- **Retry route** — If user not on incoming page, notification tap or duplicate push should route once
- **Cold-start fallback** — SDK queue + local persistence
- **Logout guard** — Ignore intercom push when not logged in
- **Cancel priority** — Cancel must work in background: clear ring and notifications

---

## 7. Design Principles and Best Practices

### 7.1 Architecture

1. **Three-layer separation** — RTC for media, platform for permissions/audit, terminals for UX
2. **Independent channels** — Device business channel (MQTT) vs RTC signaling (TCP/WebSocket)
3. **Identifier separation** — RTC ID, business device ID, session ID never interchangeable

### 7.2 Device Side

1. **Live contact list** from platform, not hard-coded
2. **Report RTC ID** on online
3. **Prefer wired network** for latency/stability
4. **Worker thread** for network/media/intercom loop; UI thread for interaction
5. **Per-session state machine** — timeout, busy, reject

### 7.3 Business Platform

1. **Pre-call checks** — allowlist + user online
2. **Full audit** — log every attempt
3. **Unlock bound to connected session** — user/device/session match
4. **Silent cancel push**
5. **Idempotent end report** — one final result per session

### 7.4 App Side

1. **Verify session before ring**
2. **Support hot and cold start** for push
3. **Paired teardown** — close WebRTC + report result + stop vibration on every exit path
4. **Timeouts** — e.g. 20–30s for caller/callee
5. **Mic permission early** — degrade to receive-only audio if denied
6. **Two-phase incoming** — optional pre-connect signaling during ring; full media after user answers

### 7.5 DejaOS-Specific

1. **Business caller, technical callee** — see [Section 3.4](#34-business-caller-vs-technical-callee)
2. **One-way video** — app recvonly video, sendrecv audio
3. **Minimal path first** — live + main stream + audio; then DataChannel, snapshot, etc.

---

## 8. Common Issues

| Symptom | Possible cause | What to check |
| :--- | :--- | :--- |
| Signaling OK, no video | STUN/TURN / UDP blocked | Firewall, ICE |
| App call, device silent | Used business device ID instead of RTC ID | Peer ID |
| Device call, no push | User offline / alias not set | Login, push config |
| Push OK, cannot answer | Wrong WebSocket URL/port | App signaling config |
| Remote unlock fails | Session not connected | Answer reporting order |
| Empty contact list on device | Allowlist empty | Device–user binding |
| No end log | End report not sent | App teardown path |
| Ring after cancel | Cancel sent as notification | Use silent message |
| Tap notification, no UI after kill | Cold start queue not restored | SDK queue + local cache |
| Echo | Handsets too close | Distance, AEC |

---

## 9. Best Practices Summary

1. **Three-layer separation**: RTC, platform, terminals
2. **Separate identifiers**: RTC ID, business device ID, session ID
3. **Business caller vs technical callee**: device initiates business call; app initiates WebRTC
4. **Allowlist-driven** callable users
5. **Push for hot and cold start**; notification for ring-in, silent for cancel
6. **Remote unlock only when connected**, with audit log
7. **Every exit path**: release connection + report + stop vibration
8. **Sync RTC ID** when device online
9. **Minimal media path first**, then extensions
10. **Audit every call**, success or failure

---

## 10. Further Reading

- [Video Intercom Overview](../videointercom/overview.md) — Roles and WebRTC basics
- [Device Integration](../videointercom/device.md) — DejaOS SDK and samples
- [Android Client](../videointercom/android.md) — WebRTC signaling on Android
- [Server Deployment](../videointercom/server.md) — RTC service setup
- [Quick Deploy Guide](../videointercom/quickdeploy.md) — Migrating RTC service to your server
