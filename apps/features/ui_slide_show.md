# UI Slide Show Demo

This demo implements an image slideshow on DejaOS with smooth slide-in/slide-out transitions and preloading logic to reduce visible stutter.

:::info Note
This demo focuses on fullscreen image switching effects and timing control. It is useful for digital signage and idle-screen style scenarios.
:::

## Video Demo

<iframe
  width="315"
  height="560"
  src="https://www.youtube.com/embed/oOLv8cpxYec"
  title="UI Slide Show Demo"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>

## Main Features

- **Fullscreen slideshow**: Displays a sequence of local images in full-screen mode.
- **Smooth transition animation**: Uses dual image layers and horizontal slide transition.
- **Preload strategy**: Preloads the next image before transition to reduce decoding stalls.
- **Continuous playback loop**: Rotates over configured image list with fixed interval.

## Source Structure

Reference source: [DejaOS repository, `apps/features/ui_slide_show`](https://github.com/DejaOS/DejaOS/tree/main/apps/features/ui_slide_show)

- `src/main.js`: Screen init, dual-image transition logic, timed loop.
- `src/slideshowImages.js`: Image path list for slideshow sequence.

---

**Tip**: This demo targets the **VF203_V12** model (as defined in `app.dxproj`). For different displays, adjust image resolution and transition timing for best visual quality.
