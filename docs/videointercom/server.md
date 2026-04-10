# Server

---

This page describes the role of the video intercom **server**, what is typically included in the package, and key points for deployment and troubleshooting. For every configuration key, follow the files shipped with your package.

Related documentation:

- [Video intercom overview](./overview.md)
- [Device](./device.md)
- [Android](./android.md)

---

## 1. What the server does

The server coordinates the full video intercom flow, mainly:

- **Signaling and sessions**: call setup, forwarding media negotiation (SDP/ICE), hang up, and related control.
- **Media and NAT traversal**: WebRTC-related functions and STUN/TURN (what is enabled and how depends on your configuration).
- **Web and operations**: H5 call pages, admin console, logs, and similar.

The bundled `webrtc-services` integrates these capabilities in one service stack. Whether production is split or clustered follows your product or delivery model.

---

## 2. What is in the package

| Item | Description |
|------|-------------|
| `webrtc-services` | Main service binary |
| `webrtc-protect` | Watchdog-related process; usually started together with the main service via scripts |
| `conf/` | Runtime configuration; primary file is `app.conf` |
| `doc/` | Install notes, configuration samples, version notes, integration notes, etc. |
| `static/`, `views/` | Web static assets and page templates |
| `run.sh` | Start and stop the service |
| `install-ubuntu.sh`, `install-centos.sh` | Helper install scripts for common Linux distros (use whatever files are actually in your package) |

Field-by-field configuration is documented in `doc/app.conf` (commented sample) and `doc/readme.txt`.

---

## 3. Before you deploy

### 3.1 Dependencies

- **MySQL**: create the application database (often named `webrtc`) and set connection details under `[mysql]` in `app.conf`.
- **Redis**: set host and related options under `[cache]` in `app.conf`.

### 3.2 Network ports

Open the ports you actually use in firewalls and security groups. **Always follow `conf/app.conf` after installation.** The table below lists ports commonly seen in bundled `doc/readme.txt` and sample `app.conf`; match it to your real config when opening rules.

### 3.3 Common ports

| Purpose | Protocol | Typical port or range in samples | Config key / notes |
|---------|----------|-----------------------------------|---------------------|
| HTTP | TCP | Often **8089**; may be changed to **80**, etc. | `httpport` |
| HTTPS and H5 (including WebSocket) | TCP | Often **8443**; may be changed to **443**, etc. | `httpsport`; phones and browsers usually use this port |
| Admin web UI | TCP | Sample **8099** | `adminport` |
| Device signaling (DejaOS TCP access) | TCP | Sample **6699** | `wakeupport`; must match the port in device `servers` |
| Wakeup service | TCP | **6677** | `port` in `[lowpowerwakeup]` |
| Legacy device WebSocket signaling (optional) | TCP | **6688** | `websocketport`; newer setups may omit |
| STUN | UDP | about **3478–3578** (depends on `stun_port`, `stun_port_size`) | `[stun]` |
| TURN / media relay | UDP | **12355–65535** (range can be narrowed in config) | Port ranges in `readme.txt` and sections such as `[rtmp]` |
| Cluster signaling (MQTT, etc., when clustering is enabled) | TCP | **1883**, **1993**, **1888**, **1688**, etc. | `[signal]` and `readme.txt` |

**Note:** If **MySQL** (default **3306**) and **Redis** (default **6379**) run on the same machine as the app, they are usually reachable only on localhost. If they run on separate hosts, open those ports on the database hosts and restrict source IPs.

---

## 4. Install and day-to-day operation

Typical steps (details in `doc/readme.txt`):

1. Install and configure **MySQL** and **Redis**; create the database and user permissions.
2. Extract the release package to the target directory (for example `/opt/webrtc-services`).
3. If you use **HTTPS**: place certificates under `conf/` and set `httpskeyfile` and `httpscertfile` in `app.conf`.
4. Edit **`conf/app.conf`**:
   - Database settings must be correct or the service will not start.
   - Set `httpport`, `httpsport`, and `adminport` to match your plan.
   - Configure `[network]`: `domainname` (use public or private IP if you have no DNS name); `external-ip` as documented (often `public IP/private IP`; if there is no public IP, use private/private).
   - Set **initstring** and other license-related values per your contract or delivery materials; keep them confidential.
5. For boot auto-start, run the install script for your OS (e.g. `install-ubuntu.sh` or `install-centos.sh`) and follow its instructions.
6. **Start / stop**: from the install directory run `./run.sh start` or `./run.sh stop`.
7. **Logs**: under `logs/` in the install directory (e.g. `webrtc-services.log`). Common startup failures: wrong certificate paths, database unreachable, or missing critical `app.conf` entries.

Verification: open the configured HTTPS URL in a browser. A typical H5 call URL is:

`https://your-domain-or-ip:https-port/videocall/device-serial`

(Same pattern as in [Device](./device.md).)

---

## 5. Important `app.conf` settings

The bundled `doc/app.conf` is commented. Operators usually need:

- **Runtime and license**: `initstring`, `runmode`, `area`, etc.
- **Web and admin**: `enablehttp`, `enablehttps`, `httpport`, `httpsport`, `adminport`, `webmediaurl` (whether built-in web features are exposed; you may disable in production and use your own site)
- **Device access**: `wakeupport` (device TCP signaling port; if changed, update every device)
- **Public network**: `domainname`, `external-ip` in `[network]`
- **Cache**: Redis in `[cache]`
- **STUN/TURN**: `[stun]` and relay port settings
- **Cluster / routing** (if used): `[signal]` and related sections

For recording, conference room, multicast, and other extensions, extra sections may be required; see `doc/version.txt`.

---

## 6. How devices, phones, and browsers use the same server

| Client | How to configure | Notes |
|--------|------------------|-------|
| DejaOS device | Set `webrtc.servers` in `dxIntercom` to `IP:wakeupport` | Device uses TCP signaling, not WebSocket |
| Android / H5 | WebSocket signaling over `wss://` to the site | Port usually matches HTTPS; differs from device TCP port |

Ensure: **device serial (`serno`) is unique on the platform**, **address and port are reachable from each client**, and **firewall rules allow those ports**.

---

## 7. Integration with your business platform (optional)

To notify your platform on device online/offline or events, configure `[push]` in `app.conf` with your callback HTTP URL. The service POSTs JSON messages (event types and fields in `doc/publish.txt`). Implement authentication and validation on your side.

---

## 8. Health check

HTTP **`/api/keepalive`** returns JSON. **`state` 200** means healthy; **500** means unavailable. Suitable for load balancers or monitoring (see `doc/webrtc-streamer-keepalive.txt`).

---

## 9. Common issues

- **Missing libnuma.so.1**: install `libnuma` / `numactl` per `doc/readme.txt` on Ubuntu or CentOS.
- **Web works but device cannot connect**: check **wakeupport** is open, device **servers** points to the correct **IP:port**, and `[network]` matches your real egress.
- **Signaling works but no video**: check STUN/TURN and UDP are allowed, and phone/browser networks and ICE are OK.

---

## 10. Obtaining the server package

The server package is not distributed via GitHub. **Contact us** to receive your delivery.
