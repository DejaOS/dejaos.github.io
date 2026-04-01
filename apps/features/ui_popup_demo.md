# UI Popup Demo

This demo presents common popup interaction patterns on DejaOS, including confirmation dialogs, permission prompts, team invite cards, and verification code style popups.

:::info Note
This demo focuses on popup UI design and transition behavior. It is suitable for interaction prototype validation and visual style iteration.
:::

## Video Demo

<iframe
  width="315"
  height="560"
  src="https://www.youtube.com/embed/QCcSDIJiXno"
  title="UI Popup Demo"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
></iframe>

## Main Features

- **Popup scenario coverage**: Includes confirm/cancel dialogs, permission style popups, invite dialogs, and code input popups.
- **Auto page rotation**: Loops between `page1` and `page2` every 10 seconds.
- **Timed show/hide effects**: Popups hide/show in intervals to demonstrate dynamic interaction states.
- **Reusable UI routing**: Uses `UIManager` for page registration, lazy initialization, and view stack control.

## Source Structure

Reference source: [DejaOS repository, `apps/features/ui_popup_demo`](https://github.com/DejaOS/DejaOS/tree/main/apps/features/ui_popup_demo)

- `src/main.js`: App entry, page registration, timed page switching.
- `src/UIManager.js`: Root screen and view lifecycle manager.
- `src/pages/page1.js`: Popup showcase page (set 1).
- `src/pages/page2.js`: Popup showcase page (set 2).

---

**Tip**: This demo targets the **VF203_V12** model (as defined in `app.dxproj`). For other screen sizes, tune component dimensions, spacing, and text wrapping.
