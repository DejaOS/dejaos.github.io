# UI Animation Demo

This demo showcases multiple UI animation styles on DejaOS, including loader animations, character/star motion, and GIF playback scenes.

:::info Note
This demo focuses on UI animation presentation and interaction rhythm. It is intended for visual effect verification and animation performance tuning.
:::

## Video Demo

<iframe
  width="315"
  height="560"
  src="https://www.youtube.com/embed/dBSj-O9scw0"
  title="UI Animation Demo"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>

## Main Features

- **Multi-scene switching**: Switches between `page1`, `page2`, and `page3` every 10 seconds in a loop.
- **Animation-rich UI**: Includes loader animation combinations, cloud drift, star twinkle, and dynamic character expression changes.
- **GIF rendering support**: Demonstrates native GIF mount/pause/resume for full-screen visual playback.
- **Single-screen multi-view architecture**: Uses a custom `UIManager` to handle lazy init, page show/hide, and back stack management.

## Source Structure

Reference source: [DejaOS repository, `apps/features/ui_animation_demo`](https://github.com/DejaOS/DejaOS/tree/main/apps/features/ui_animation_demo)

- `src/main.js`: App entry, UI init, page registration, timed page rotation.
- `src/UIManager.js`: Global root view manager and page lifecycle/router.
- `src/pages/page1.js`: Loader-style animation page.
- `src/pages/page2.js`: Character and stars animation page.
- `src/pages/page3.js`: GIF showcase page.

---

**Tip**: This demo targets the **VF203_V12** model (as defined in `app.dxproj`). If you run it on devices with different display resolutions, adjust layout sizes and animation offsets accordingly.
