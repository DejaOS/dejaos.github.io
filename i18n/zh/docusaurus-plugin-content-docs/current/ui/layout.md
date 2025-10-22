# 布局管理

UI 布局是构建用户界面的核心环节，它决定了各个控件在屏幕上的位置和尺寸。DejaOS 提供了多种布局方式，以满足不同场景下的开发需求。本章节将详细介绍绝对布局、相对布局和 Flex 弹性布局，帮助您灵活高效地构建美观且实用的用户界面。

## 绝对布局

这是最基础的布局方式，我们前面的示例都是绝对布局，就是通过 `setPos` 和 `setSize` 来设置控件的绝对位置和大小. 绝对布局能满足绝大部分情况，和手机应用相比，我们的应用需要实现跨平台跨设备跨屏幕的场景很小。
另外我们的应用通常也没有手机应用的 UI 那么复杂。
最后一点是绝对布局是效率最高的布局方式，如果太多相对布局在性能低的设备上会降低显示的效果。

## 相对布局

相对布局主要是依靠函数`align` 和 `alignTo`,这二个函数的区别就是一个相对于对象自身的父对象的相对位置，另外一个函数是相对于另外一个指定对象的相对位置，相对的方位参考枚举：

```javascript
utils.ALIGN = {
  //相对参照对象的位置，带 OUT 的在参照对象的边界外
  OUT_TOP_LEFT: utils.ENUM.LV_ALIGN_OUT_TOP_LEFT,
  OUT_TOP_MID: utils.ENUM.LV_ALIGN_OUT_TOP_MID,
  OUT_TOP_RIGHT: utils.ENUM.LV_ALIGN_OUT_TOP_RIGHT,
  OUT_BOTTOM_LEFT: utils.ENUM.LV_ALIGN_OUT_BOTTOM_LEFT,
  OUT_BOTTOM_MID: utils.ENUM.LV_ALIGN_OUT_BOTTOM_MID,
  OUT_BOTTOM_RIGHT: utils.ENUM.LV_ALIGN_OUT_BOTTOM_RIGHT,
  OUT_LEFT_TOP: utils.ENUM.LV_ALIGN_OUT_LEFT_TOP,
  OUT_LEFT_MID: utils.ENUM.LV_ALIGN_OUT_LEFT_MID,
  OUT_LEFT_BOTTOM: utils.ENUM.LV_ALIGN_OUT_LEFT_BOTTOM,
  OUT_RIGHT_TOP: utils.ENUM.LV_ALIGN_OUT_RIGHT_TOP,
  OUT_RIGHT_MID: utils.ENUM.LV_ALIGN_OUT_RIGHT_MID,
  OUT_RIGHT_BOTTOM: utils.ENUM.LV_ALIGN_OUT_RIGHT_BOTTOM,
  TOP_LEFT: utils.ENUM.LV_ALIGN_TOP_LEFT,
  TOP_MID: utils.ENUM.LV_ALIGN_TOP_MID,
  TOP_RIGHT: utils.ENUM.LV_ALIGN_TOP_RIGHT,
  BOTTOM_LEFT: utils.ENUM.LV_ALIGN_BOTTOM_LEFT,
  BOTTOM_MID: utils.ENUM.LV_ALIGN_BOTTOM_MID,
  BOTTOM_RIGHT: utils.ENUM.LV_ALIGN_BOTTOM_RIGHT,
  LEFT_MID: utils.ENUM.LV_ALIGN_LEFT_MID,
  RIGHT_MID: utils.ENUM.LV_ALIGN_RIGHT_MID,
  CENTER: utils.ENUM.LV_ALIGN_CENTER,
  DEFAULT: utils.ENUM.LV_ALIGN_DEFAULT,
};
```

我们来看一个示例：

```javascript
import dxui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";
import logger from "../dxmodules/dxLogger.js";

dxui.init({ orientation: 1 });

const page1 = dxui.View.build("page1", dxui.Utils.LAYER.MAIN);
const button1 = dxui.Button.build("page1button", page1);
button1.align(dxui.Utils.ALIGN.CENTER, 0, 0);
button1.setSize(200, 200);

// 所有对齐枚举
const aligns = {
  OUT_TOP_LEFT: dxui.Utils.ALIGN.OUT_TOP_LEFT,
  OUT_TOP_MID: dxui.Utils.ALIGN.OUT_TOP_MID,
  OUT_TOP_RIGHT: dxui.Utils.ALIGN.OUT_TOP_RIGHT,
  OUT_BOTTOM_LEFT: dxui.Utils.ALIGN.OUT_BOTTOM_LEFT,
  OUT_BOTTOM_MID: dxui.Utils.ALIGN.OUT_BOTTOM_MID,
  OUT_BOTTOM_RIGHT: dxui.Utils.ALIGN.OUT_BOTTOM_RIGHT,
  OUT_LEFT_TOP: dxui.Utils.ALIGN.OUT_LEFT_TOP,
  OUT_LEFT_MID: dxui.Utils.ALIGN.OUT_LEFT_MID,
  OUT_LEFT_BOTTOM: dxui.Utils.ALIGN.OUT_LEFT_BOTTOM,
  OUT_RIGHT_TOP: dxui.Utils.ALIGN.OUT_RIGHT_TOP,
  OUT_RIGHT_MID: dxui.Utils.ALIGN.OUT_RIGHT_MID,
  OUT_RIGHT_BOTTOM: dxui.Utils.ALIGN.OUT_RIGHT_BOTTOM,
  TOP_LEFT: dxui.Utils.ALIGN.TOP_LEFT,
  TOP_MID: dxui.Utils.ALIGN.TOP_MID,
  TOP_RIGHT: dxui.Utils.ALIGN.TOP_RIGHT,
  BOTTOM_LEFT: dxui.Utils.ALIGN.BOTTOM_LEFT,
  BOTTOM_MID: dxui.Utils.ALIGN.BOTTOM_MID,
  BOTTOM_RIGHT: dxui.Utils.ALIGN.BOTTOM_RIGHT,
  LEFT_MID: dxui.Utils.ALIGN.LEFT_MID,
  RIGHT_MID: dxui.Utils.ALIGN.RIGHT_MID,
  CENTER: dxui.Utils.ALIGN.CENTER,
  DEFAULT: dxui.Utils.ALIGN.DEFAULT,
};
// 把名称转为首字母组合，如 OUT_RIGHT_TOP → ORT
function getShortName(name) {
  return name
    .split("_")
    .map((word) => word[0])
    .join("");
}
// 依次创建 label 并围绕 button1 排布
let idx = 0;
for (const [name, align] of Object.entries(aligns)) {
  const label = dxui.Label.build(`label_${idx++}`, page1);
  label.text(getShortName(name));
  // “OUT_” 的放在外侧，其它正常贴在内部或边缘
  label.alignTo(button1, align, 0, 0);
}
dxui.loadMain(page1);

std.setInterval(() => {
  dxui.handler();
}, 10);
```

## 运行效果

![align](/img/ui/alignlayout.png)

## 代码解析

这个示例演示相对布局，比如 button 相对于 page1 是居中显示`align(dxui.Utils.ALIGN.CENTER, 0, 0)`，这个按钮就在屏幕的正中间,如果这里用绝对布局，就得要仔细的计算屏幕的大小，button 的大小才能完美居中。
剩下的绘制了 18 个 Label，围绕着 button，显示 18 种相对布局的位置，大家可以直观的看到效果。

## FLEX 布局

主要类似 web 的 flexbox 布局。用到的函数包含`flexFlow`和`flexAlign`，枚举包括

```javascript
utils.FLEX_ALIGN = {
  //flex布局，对齐方式
  START: utils.ENUM.LV_FLEX_ALIGN_START,
  END: utils.ENUM.LV_FLEX_ALIGN_END,
  CENTER: utils.ENUM.LV_FLEX_ALIGN_CENTER,
  SPACE_EVENLY: utils.ENUM.LV_FLEX_ALIGN_SPACE_EVENLY,
  SPACE_AROUND: utils.ENUM.LV_FLEX_ALIGN_SPACE_AROUND,
  SPACE_BETWEEN: utils.ENUM.LV_FLEX_ALIGN_SPACE_BETWEEN,
};
utils.FLEX_FLOW = {
  //flex布局，主侧轴
  ROW: utils.ENUM.LV_FLEX_FLOW_ROW,
  COLUMN: utils.ENUM.LV_FLEX_FLOW_COLUMN,
  ROW_WRAP: utils.ENUM.LV_FLEX_FLOW_ROW_WRAP,
  ROW_REVERSE: utils.ENUM.LV_FLEX_FLOW_ROW_REVERSE,
  ROW_WRAP_REVERSE: utils.ENUM.LV_FLEX_FLOW_ROW_WRAP_REVERSE,
  COLUMN_WRAP: utils.ENUM.LV_FLEX_FLOW_COLUMN_WRAP,
  COLUMN_REVERSE: utils.ENUM.LV_FLEX_FLOW_COLUMN_REVERSE,
  COLUMN_WRAP_REVERSE: utils.ENUM.LV_FLEX_FLOW_COLUMN_WRAP_REVERSE,
};
```

我们来看一个示例：

```javascript
import dxui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";
import logger from "../dxmodules/dxLogger.js";

dxui.init({ orientation: 1 });

const page = dxui.View.build("page", dxui.Utils.LAYER.MAIN);

/**
 * 示例1：横向排列 + 自动换行 + 居中对齐
 */
const flexRow = dxui.View.build("flexRow", page);
flexRow.setSize(200, 320);
flexRow.setPos(220, 20);

// 设置主轴：水平排列 + 自动换行
flexRow.flexFlow(dxui.Utils.FLEX_FLOW.ROW_WRAP);

// 主轴、侧轴、整体对齐方式都设为居中
flexRow.flexAlign(
  dxui.Utils.FLEX_ALIGN.CENTER, // 主轴方向对齐（水平）
  dxui.Utils.FLEX_ALIGN.CENTER, // 侧轴方向对齐（垂直）
  dxui.Utils.FLEX_ALIGN.CENTER // 整体容器对齐
);

// 添加一些子项
for (let i = 0; i < 10; i++) {
  const item = dxui.Label.build(`row_item_${i}`, flexRow);
  item.text(`R${i}`);
  item.setSize(60, 40);
  item.bgColor(0x99ccff);
  item.radius(6);
  item.padAll(4);
}

/**
 * 示例2：纵向排列 + 均匀分布
 */
const flexCol = dxui.View.build("flexCol", page);
flexCol.setSize(200, 400);
flexCol.align(dxui.Utils.ALIGN.OUT_BOTTOM_MID, 0, 20);

// 设置主轴：纵向排列
flexCol.flexFlow(dxui.Utils.FLEX_FLOW.COLUMN);

// 对齐方式：主轴均匀分布，侧轴居中
flexCol.flexAlign(
  dxui.Utils.FLEX_ALIGN.SPACE_EVENLY, // 主轴：上下均匀分布
  dxui.Utils.FLEX_ALIGN.CENTER, // 侧轴：水平居中
  dxui.Utils.FLEX_ALIGN.CENTER
);

// 添加子项
["A", "B", "C", "D", "E"].forEach((ch, i) => {
  const lbl = dxui.Label.build(`col_item_${i}`, flexCol);
  lbl.text(`C${ch}`);
  lbl.setSize(100, 40);
  lbl.bgColor(0xffcc99);
  lbl.radius(6);
  lbl.padAll(4);
});

dxui.loadMain(page);

std.setInterval(() => {
  dxui.handler();
}, 10);
```

## 运行效果

![align](/img/ui/flexlayout.png)

## 代码解析

这段代码演示了 Flex 布局的两种常见场景：横向换行排列和纵向均匀分布。

- **示例 1：横向排列 (`flexRow`)**

  - 我们创建了一个 `200x320` 的容器 `flexRow`。
  - `flexRow.flexFlow(dxui.Utils.FLEX_FLOW.ROW_WRAP)` 设置了主轴为水平方向 (`ROW`)，并且允许子项自动换行 (`WRAP`)。
  - `flexRow.flexAlign(...)` 将主轴、侧轴和整体对齐方式都设置为居中 (`CENTER`)。这使得子项在水平和垂直方向上都保持居中对齐。
  - 循环创建了 10 个 `Label` (R0-R9)，它们会自动在容器内从左到右排列，空间不足时会自动换到下一行。

- **示例 2：纵向排列 (`flexCol`)**
  - 我们创建了一个 `200x400` 的容器 `flexCol`。
  - `flexCol.flexFlow(dxui.Utils.FLEX_FLOW.COLUMN)` 设置主轴为垂直方向 (`COLUMN`)。
  - `flexCol.flexAlign(dxui.Utils.FLEX_ALIGN.SPACE_EVENLY, dxui.Utils.FLEX_ALIGN.CENTER, ...)` 设置了主轴（垂直）对齐为 `SPACE_EVENLY`，这意味着子项会在垂直方向上均匀分布，它们之间的间距相等。侧轴（水平）对齐方式为 `CENTER`，使得子项在容器内水平居中。
  - 创建了 5 个 `Label` (CA-CE)，它们在容器内从上到下垂直排列，并且间距相等。

Flex 布局非常适合需要动态、自适应调整子项位置的场景，能够用更少、更简洁的代码实现复杂的布局效果。
