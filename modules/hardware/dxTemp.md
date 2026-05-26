# dxTemp

## 1. Overview

This module is part of the project **dxmodules** library. It provides **HM infrared temperature measurement** over UART: single-frame peak temperature (`getTemp`), **multi-frame statistics** (`measure`), full **32×32 thermal map** (`getThermalMap`), and **ROI / face-linked** forehead temperature (`getRectTemp`), plus optional **`setCompensation`** calibration.

Main features include:

- **UART lifecycle**: `init` / `deinit` for serial channel setup (`dxUart` underneath).
- **Multi-frame stats**: `measure(frames)` — consecutive peak readings across full FOV (~125 ms between frames), returns `max` / `min` / `avg` and per-frame `samples` (compensation applied).
- **Simple temperature**: `getTemp()` — single-frame peak over full 32×32 FOV.
- **Thermal map**: `getThermalMap()` — raw grid + `getPixel(col, row)` helper.
- **Face ROI temperature**: `getRectTemp(rect)` — maps visible-camera rectangle to HM grid; fever-path refinement mirrors C driver behavior.
- **Calibration**: `setCompensation({ offset, envSlop, envStandard })` applied to all public temperature outputs.

Protocol highlights (device side):

- **CalcT**: `{0xA5, 0x55, 0x01, 0xFB}` → 7-byte response (peak + grid).
- **QueryT**: `"QueryT\r\n"` → 2054-byte thermal map payload + CRC.
- **SetRect**: `{0xA9, 0xEE, 0x01, 0xFB, x, y, w, h}` → 4-byte ACK.

> Note
>
> - **`measure()`** performs multiple **`CalcT`** reads with **`os.sleep(125)`** between frames; default **8 frames** is recommended but increases latency (~1 s for 8 frames).
> - **`getThermalMap`** / **`getRectTemp`** may return **`null`** on UART timeout or CRC/header errors; always guard before accessing `.map` or `.value`.
> - **Hardware rate** and **timeout** in `init({ timeout })` affect reliability under load.

## 2. Files

- dxTemp.js

> - Place **dxTemp.js** under the project **`dxmodules`** directory (same as other dx\* modules).
> - Serial access relies on **dxUart** and device **`/dev/tty*`** (or configured path).

## 3. Dependencies

- **dxUart** — open/send/receive/flush/ioctl for the temperature module UART.
- **dxLogger** — logging.
- **os** — `sleep` used between frames in `measure`.

## 4. Compatible Devices

Devices running **DejaOS** (or the same QuickJS + dxUart stack) with an **HM infrared temperature module** connected on the configured UART (**115200-8-N-1** by default).

## 5. Usage

### Import

```javascript
import temper from "../dxmodules/dxTemp.js";
```

### Lifecycle

```javascript
// Optional: override id/path/baudrate/timeout
temper.init({
  id: "tempUart",
  path: "/dev/ttySLB3",
  type: "3",
  baudrate: "115200-8-N-1",
  timeout: 200,
});

temper.deinit();
```

### Compensation

```javascript
temper.setCompensation({
  offset: 0.3,
  envSlop: 0,
  envStandard: 0,
});
// finalTemp = raw * (1 + envSlop * (raw - envStandard)) + offset
```

### Multi-frame measurement (`measure`)

```javascript
const stats = temper.measure(8);
// stats: { max, min, avg, samples } or null
if (stats) {
  logger.info("max:", stats.max, "min:", stats.min, "avg:", stats.avg);
  logger.info("per-frame peaks:", stats.samples);
}
```

### Single-frame full-FOV peak (`getTemp`)

```javascript
const t = temper.getTemp(); // number °C or null
```

### Thermal map (`getThermalMap`)

```javascript
const tm = temper.getThermalMap();
if (tm) {
  const c = tm.getPixel(16, 16);
  logger.info("center °C:", c, "raw bytes:", tm.map.length);
}
```

### Face-linked ROI (`getRectTemp`)

```javascript
// rect: [x0, y0, x1, y1] in visible camera coordinates (same as face SDK rect)
const r = temper.getRectTemp(event.rect);
if (r) {
  logger.info("value:", r.value, "fever:", r.fever, "grid:", r.grid);
}
```

## 6. Constant Definitions

Thermal grid and framing constants are **internal** to **dxTemp.js** (e.g. **32×32** grid, **QUERY_T_TOTAL** 2054). Public API does not export a constants object; configure timing via **`init({ timeout })`** and **`measure(frames)`**.

## 7. Multi-threading Support

- UART **`receive`** / **`send`** are synchronous from JS; avoid concurrent calls from multiple threads/workers unless your runtime serializes access to the same **`dxUart`** channel ID.

## 8. Important Notes

1. Call **`init()`** before any read API; **`deinit()`** closes the UART.
2. **`measure(n)`** sets full-screen ROI internally; **`frames`** is truncated with minimum **1**; **`samples`** may be shorter than **`frames`** if some **`CalcT`** reads fail.
3. **`getRectTemp`** triggers **SetRect**, **QueryT**, then **CalcT**; it is heavier than **`getTemp`** alone.
4. Tune **`timeout`** (ms) if responses are truncated intermittently.
5. **`getThermalMap()`** returns **`null`** on CRC mismatch — do not assume success without a check.

## 9. Related modules

- **dxUart**: serial port abstraction used by **dxTemp**.
- **dxFacial** / face worker demos: supply **`event.rect`** for **`getRectTemp`**.

## 10. Examples and test scripts

[Source Code](https://github.com/DejaOS/DejaOS/tree/main/demos/vf105_v12/vf105_v12_temper)
