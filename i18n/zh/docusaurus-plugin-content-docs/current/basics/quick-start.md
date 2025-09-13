# Hello World 快速开始

---

## 📁 创建新项目

1. 启动 VSCode 并点击侧边栏中的 `DejaOS` 图标
2. 选择 `Create Project`，输入项目名称，并选择存储路径
3. 点击 `Submit` 创建项目

![项目创建演示](/img/demo-2.gif)

4. 在您的项目目录中，点击 `app.dxproj` 文件打开可视化配置界面
5. 编辑配置后，点击 `Add Module` 添加所需模块并保存

![模块配置演示](/img/demo-4.gif)

> ⚠️ **注意：**
>
> - 确保选择的设备型号与您的实际硬件匹配
> - 如果您更改设备型号，请重新配置所有模块版本
> - 不同设备型号之间的模块版本不兼容

---

## 📂 导入现有项目

DejaOS 提供各种 [GitHub 示例](https://github.com/DejaOS/DejaOS)。您可以下载任何示例并将其导入到 VSCode 中：

1. 下载后，在 VSCode 中打开代码目录
2. 确保目录根目录包含 `app.dxproj` 文件——这是激活扩展所必需的

![导入示例项目演示](/img/demo-12.gif)

---

## 🔌 连接设备并同步代码

1. 点击 VSCode 底部的 `Not Connected` 按钮并选择您的设备
2. 连接后，点击 `syncAll` 进行初始完整同步（这可能需要一些时间）

![设备同步演示](/img/demo-6.gif)
> ⚠️ **注意：**
> - 请选择与您连接的设备型号匹配的示例。如果不匹配，您可以手动修改 app.dxproj 中的设备型号并重新选择模块版本
> - **第一次同步必须使用 `syncAll`**。对于后续开发，使用 `sync` 进行更快的增量更新。

---

## ✍️ 编码示例：控制继电器

将以下代码添加到您项目的 `main.js` 中，通过按钮按下控制继电器：

```js
import logger from "../dxmodules/dxLogger.js";
import dxui from "../dxmodules/dxUi.js";
import std from "../dxmodules/dxStd.js";
import gpio from "../dxmodules/dxGpio.js";
import * as os from "os";

// ui 上下文
let context = {};

function initScreen() {
  // ui 初始化
  dxui.init({ orientation: 1 }, context);
  // 创建屏幕
  let mainView = dxui.View.build("mainView", dxui.Utils.LAYER.MAIN);
  // 创建按钮控件
  let button = dxui.Button.build(mainView.id + "button", mainView);
  // 设置按钮大小
  button.setSize(130, 50);
  // 创建标签控件
  let label = dxui.Label.build(mainView.id + "label", button);
  // 设置文本内容
  label.text("点击");
  // 设置文本颜色
  label.textColor(0x000000);
  // 设置文本在按钮中的位置
  label.align(dxui.Utils.ALIGN.CENTER, 0, 0);
  // 监听按钮点击事件
  button.on(dxui.Utils.EVENT.CLICK, handleGpio);
  // 加载屏幕
  dxui.loadMain(mainView);
}

(function () {
  initScreen();
})();

function handleGpio() {
  const gpio_id_dw200 = 44;
  // 初始化 gpio
  let res = gpio.init();
  logger.info("初始化 gpio", res);
  // 请求 gpio
  res = gpio.request(gpio_id_dw200);
  logger.info("请求 gpio", res);
  // 输出高电平打开继电器
  res = gpio.setValue(gpio_id_dw200, 1);
  logger.info("输出高电平", res);
  // 获取当前电平是高还是低
  res = gpio.getValue(gpio_id_dw200);
  logger.info("当前电平是", res);
  // 等待 3 秒
  os.sleep(3000);
  // 输出低电平关闭继电器
  res = gpio.setValue(gpio_id_dw200, 0);
  logger.info("输出低电平", res);
  res = gpio.getValue(gpio_id_dw200);
  logger.info("当前电平是", res);
}

std.setInterval(() => {
  dxui.handler();
}, 5);
```

---

## ▶️ 运行项目

1. 编码完成后，点击 `sync` 按钮将更改上传到您的设备
2. 同步后，点击 `start` 启动应用程序
3. 在 VSCode 控制台中查看日志输出并观察设备屏幕

## ![alt text](/img/demo-8.gif)

## 📦 打包项目

开发完成后，您可以将项目打包为 `.dpk` 安装程序进行部署：

1. 点击 `package` 按钮开始打包  
   ![alt text](/img/demo-10.gif)
2. 安装程序将保存在您项目目录中的 `.temp/` 文件夹内

> `.dpk` 文件是 DejaOS 特定的安装程序，适用于 OTA 或串行部署

---

## 📘 下一步

- 📦 要在设备上安装或升级您的 `.dpk` 应用程序，请参阅：[应用程序打包、安装和升级](./app.md)
- 🧪 更多 JavaScript 应用程序项目，请参阅：[示例项目](https://github.com/DejaOS/DejaOS/tree/main/demos)