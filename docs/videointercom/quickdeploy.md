# Quick Deployment Guide

---

This guide walks you through migrating the bundled WebRTC service from our test environment to **your own server**. You only need to edit **one** file: `conf/app.conf`. Every change below maps to a real key in that file. Anything not listed here should be **left at its default**.

Related documentation:

- [Video intercom overview](./overview.md)
- [Device](./device.md)
- [Android](./android.md)
- [Server](./server.md)

---

## 1. Before you start

Have these four things ready before editing the config:

1. A server with a **public IP** (note both the public and the private IP).
2. A **domain name** resolved to that public IP, for example `webrtc.your-domain.com`.
3. The domain's **SSL certificate**: the `.crt` and `.key` files.
4. The server's **network interface name** (run `ip addr` on Linux, e.g. `eth0`, `ens33`, `vmbr0`).

The package ships with `app_new.conf`, a real working sample (domain `webrtc.dxiot.com`). Open it side by side with `app.conf` to see the exact format every field expects.

---

## 2. Step 1 — Edit the keys in `app.conf`

### 2.1 Service ports (top of the file)

| Key | Sample (`app_new.conf`) | Notes |
|-----|-------------------------|-------|
| `httpport` | `8098` | HTTP port. Keep `80` if it is free on your server. |
| `httpsport` | `8443` | HTTPS port. Keep `443` if it is free. |
| `httpscertfile` | `conf/webrtc.crt` | Your SSL cert, placed under `conf/`. Enter its relative path. |
| `httpskeyfile` | `conf/webrtc.key` | Your SSL key, placed under `conf/`. |
| `initstring` | *(a long ciphertext)* | License string. We generate it for your deployment — replace the whole value, do not edit it by hand. |

Using non-`80`/`443` ports avoids privileged system ports and makes deployment simpler. Whatever ports you pick, remember to open them in the firewall (Step 2).

### 2.2 Network binding (`[network]`)

| Key | Sample | What to enter |
|-----|--------|---------------|
| `external-ip` | `218.4.173.194/192.168.10.2` | `public-IP/private-IP` (separated by `/`). If there is no private IP, put the public IP in both halves. |
| `domainname` | `webrtc.dxiot.com` | Your resolved domain. |
| `netname` | `vmbr0` | Server interface name (`ip addr`). |

### 2.3 Signaling (`[signal]`)

| Key | Sample | What to enter |
|-----|--------|---------------|
| `router` | `webrtc.dxiot.com:1688` | `your-domain:1688` (keep port `1688`). |

### 2.4 Server URLs (`[servers]`)

| Key | Sample | What to enter |
|-----|--------|---------------|
| `self_url` | `https://webrtc.dxiot.com` | `https://` + your domain |
| `master_server_url` | `https://webrtc.dxiot.com` | `https://` + your domain |

### 2.5 STUN / TURN traversal (`[stun]`, bottom of the file)

| Key | Sample | What to enter |
|-----|--------|---------------|
| `user` | `dxiot` | A username you choose. |
| `password` | `dxl12138` | A password you choose. |
| `stun_port_size` | `5` | Number of STUN ports; `5` is usually enough. |
| `stun_servers` | *(see below)* | Replace IP / user / password with your own. |

Full `stun_servers` format (swap in your private IP, username, password):

```
{"stuns":[{"stun":"192.168.10.2:3478","user":"dxiot","password":"dxl12138"}]}
```

The IP is your **private IP**, the port stays `3478`. The `user` and `password` here **must match** the `user` and `password` keys above — all three places use the same credentials.

---

## 3. Step 2 — Open firewall / security-group ports

Open these ports in the server firewall and in your cloud provider's security group:

| Protocol | Ports |
|----------|-------|
| TCP | `8443`, `8098`, `8099`, `6699` |
| UDP | `3478-3482` |

If you kept `httpport` / `httpsport` at `80` / `443`, open `80` / `443` instead of `8098` / `8443`.

---

## 4. Step 3 — Place certificates, start, and verify

1. Copy your SSL `.crt` and `.key` into the program's `conf/` directory, with the same file names you set in `httpscertfile` / `httpskeyfile`.
2. Confirm the domain resolves to the server's public IP.
3. Start the service and open `https://your-domain:8443` in a browser. The admin console is at `https://your-domain:8099`.
4. If the pages load and you can complete a video call, deployment succeeded.

---

## 5. Quick reference — what the sample changed

The `dxiot.com` sample (`app_new.conf`) differs from the original (`app.conf`) in exactly these places:

| Section | Changes |
|---------|---------|
| `[server]` | `httpport` `80`→`8098`, `httpsport` `443`→`8443`, cert names → `webrtc.*`, `initstring` regenerated |
| `[network]` | `external-ip` → `218.4.173.194/192.168.10.2`, `domainname` → `webrtc.dxiot.com`, `netname` `ens33`→`vmbr0` |
| `[signal]` | `router` → `webrtc.dxiot.com:1688` |
| `[servers]` | `self_url` / `master_server_url` → `https://webrtc.dxiot.com` |
| `[stun]` | `user`→`dxiot`, `password`→`dxl12138`, `stun_port_size` `10`→`5`, `stun_servers` updated to match |

Everything else stays at its default. When in doubt, compare `app.conf` (original) against `app_new.conf` (deployed sample) field by field.

---

## 6. Obtaining the server package

The server package is not distributed via GitHub. **Contact us** to receive your delivery, including the `initstring` generated for your environment.
