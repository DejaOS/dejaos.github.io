# UI Management Best Practices

This document details how to use the **"Single Screen, Multiple Views"** design philosophy to organize complex DejaOS applications, preventing logic chaos and achieving efficient page navigation and state management. To implement this design, we provide `UIManager.js` as a reference implementation.

---

## 1. Background & Design Philosophy

In DejaOS application development, as business requirements grow, the number of pages can easily increase from a few to dozens. Without a unified management mechanism, developers often fall into "Page Hell":

- **Chaotic Navigation**: Page A opens B, B opens C, and C needs to go back to A, leading to unclear hierarchy.
- **State Management Chaos**: With multiple pages coexisting, lack of unified management can lead to duplicate UI creation or confusion about which page is currently active.
- **Data Passing Issues**: Passing parameters forward and returning results backward (e.g., picking a contact and returning) is complex.
- **Logical Dead Loops**: A -> B -> C -> A jumps create a closed loop in the navigation chain. When users click "Back", they get trapped in an infinite loop and cannot return to the upper level.

`UIManager` draws inspiration from Android's `Activity` stack management and Web routing, adopting a **"Single Screen, Multiple Views"** pattern to provide a lightweight lifecycle and navigation solution. Although keeping all pages in memory increases memory usage, for DejaOS applications with a controllable number of pages, this **"Space for Structural Clarity"** strategy significantly improves development efficiency and simplifies logic.

---

## 2. Core Concepts & Lifecycle

In the `UIManager` system, every "Page" is a **Singleton** JS object.

### 2.1 Standard View Structure

A standard View object must implement the following lifecycle methods:

| Lifecycle Method | Description | Trigger Timing | Notes |
| :--- | :--- | :--- | :--- |
| **init()** | **Initialize** | Called when the page is opened **for the first time** | Must return the UI Root Node. Used to create UI structures. Executed only once (Lazy Load). |
| **onShow(data)** | **Show/Resume** | Called when the page is actively opened via `open()` | Receives `data`. Used to refresh data. Note: Returning from a child page (close/backTo) does **NOT** trigger this by default. |
| **onHide()** | **Hide/Pause** | Called before opening a new page or closing the current one | Used to pause animations, unbind high-frequency events, etc. |
| **onClose(id, res)**| **Result Callback**| Called when a child page closes and returns data | Used to receive data returned by `child.close(result)`. |

### 2.2 Registration

Before use, View objects must be registered with the manager. `UIManager` uses **Mixin** technology to automatically inject capabilities like `open`, `close`, and `backTo` into the View object, and initializes its internal state (e.g., `id`, `parent`).

```javascript
import uiManager from './UIManager.js';
import HomeView from './HomeView.js';

// Register: Bind object to a string ID
uiManager.register('home', HomeView);
```

---

## 3. Stack Management & Circular Prevention

This is the core feature of `UIManager`. It maintains an implicit "Page Linked List" using `parent` pointers to track navigation history.

### 3.1 Standard Flow (A -> B -> C)

When A opens B, and B opens C, the chain is:

```text
[Root] <--> [A] <--> [B] <--> [C] (Current)
```

- **Open**: `B` opens `C` with parameters. `C` shows (triggers `onShow(data)`), `B` hides (triggers `onHide`).
- **Close**: `C` closes and returns result. `C` hides (triggers `onHide`), `B` resumes (**no** `onShow` triggered), but `B.onClose('C', result)` receives the data.

### 3.2 Direct Rewind (BackTo)

After a series of operations, you may need to return directly to an upper-level page (e.g., `Home -> List -> Detail -> Result -> Home`). Using `this.backTo('Home')` achieves this in one step.

**Process:**

1.  Hide the current page.
2.  Search for the target page `Home` in the history stack.
3.  **Prune intermediate nodes**: All pages between the current page and the target page (e.g., `List`, `Detail`) are directly removed from the stack (references broken). Their `onClose` or `onHide` methods are **NOT** triggered.
4.  Show the target page `Home` (**no** `onShow` triggered).
5.  If result data is passed in `backTo`, `Home.onClose(sourceId, result)` is triggered.

### 3.3 Cycle Prevention (Clear Top)

`UIManager` has built-in cycle detection to prevent infinite navigation loops like `A -> B -> C -> A`.

**Strategy**:
If you try to `open` a page that is already in the history chain (e.g., opening `A` from `C`), the manager treats it as a **"Rewind and Refresh"** operation:
1.  Automatically closes the current page and all intermediate pages (executes `backTo` logic).
2.  Reuses the existing instance of `A`.
3.  Calls `A.onShow(data)` with new parameters.

This mechanism mirrors Android's `FLAG_ACTIVITY_CLEAR_TOP`, ensuring a flat and stable navigation structure.

---

## 4. Implementation Logic

To support the above features, `UIManager.js` implements the following key logic:

### 4.1 Lazy Initialization
View objects are just plain JS objects upon registration. `init()` is only called on the first `open`. This mechanism avoids creating all pages at startup, distributing CPU load and speeding up application launch.

### 4.2 Single Screen Container
`UIManager` creates a global `RootScreen` (Activity) during initialization. All Views are essentially child containers under this Screen.
- **Show**: Sets View's root node to visible and moves it to the foreground.
- **Hide**: Hides the View's root node.

### 4.3 Chained Pointers (Linked List as Stack)
Although logically referred to as a "Page Stack", `UIManager` does not maintain an array stack. When a View is opened, `UIManager` automatically points its `parent` property to the caller View.
- `this._currentView`: Points to the top of the stack (current page).
- `View.parent`: Points to the previous page in the stack.

Traversing the singly linked list formed by `parent` pointers implements a virtual stack structure, enabling `backTo` lookups and cycle detection.

---

## 5. Best Practices Summary

1.  **Always use String IDs**: Decouple views using `register`.
2.  **Rely on onShow for Data**: Don't assume `init` runs every time. Pages might be resumed from the background (via BackTo or Close).
3.  **Use Close for Results**: `this.close({ status: 'ok' })` is the most elegant way to pass data back to parent views (handled in `onClose`).
4.  **Delegate UI Visibility**: Let `UIManager` handle show/hide to ensure lifecycle integrity.

---

## 6. Code Examples

### 6.1 Defining a View Component

```javascript
import v from './viewUtils.js'; // Hypothetical UI utility
import log from '../../dxmodules/dxLogger.js';

const HomeView = {
    // [Required] Initialize UI, executed only once
    init: function () {
        const screen = v.create('View'); // Create root node
        // ... Build UI children ...
        const btn = v.create(screen, 'Button');
        btn.click(() => {
            // Navigate using mixed-in open method
            this.open('detail', { id: 101 });
        });
        return screen; // Return root node
    },

    // [Optional] Triggered when page is shown
    onShow: function (data) {
        log.info('Home Shown with data:', data);
    },

    // [Optional] Receive data returned from child page
    onClose: function (viewId, result) {
        if (viewId === 'detail') {
            log.info('Detail closed with result:', result);
        }
    }
};

export default HomeView;
```

### 6.2 Registration & Launch

```javascript
import uiManager from './ui/UIManager.js';
import HomeView from './ui/HomeView.js';
import DetailView from './ui/DetailView.js';

// 1. Register Pages
uiManager.register('home', HomeView);
uiManager.register('detail', DetailView);

// 2. Launch Home
uiManager.open('home');
```

---

## 7. Complete Example

You can download the full example project code from the following GitHub repository:

[https://github.com/DejaOS/DejaOS/tree/main/demos/vf203_v12/vf203_uimanager](https://github.com/DejaOS/DejaOS/tree/main/demos/vf203_v12/vf203_uimanager)

> **Note**: Although this example is located in the `vf203` directory, `UIManager.js` and its design pattern are generic and **compatible with all DejaOS devices equipped with a screen**, not limited to specific models.
