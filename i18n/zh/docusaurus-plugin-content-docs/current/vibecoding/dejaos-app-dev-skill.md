# 使用 DejaOS App 开发 Skill

`dejaos-app-dev-sdk2-0` 是面向 DejaOS SDK 2.0 App 开发者的 AI 编程 Skill。安装到支持 Skill 的工具（例如 **Cursor**、**Codex**）后，你可以直接用自然语言创建、修改、运行和检查 DejaOS App。

它尤其适合以下场景：

- 从零创建指定设备型号的 DejaOS App；
- 为现有 App 增加 UI、网络、串口、刷卡、扫码、人脸识别等功能；
- 检查代码调用的组件 API 是否真实存在；
- 将代码同步到 USB 设备，在设备上运行并查看日志；
- 按目标设备型号和实际 SKU 配置，避免开发设备不支持的功能。

## 1. 获取 Skill

Skill 位于 DejaOS GitHub 仓库的 [`skills` 目录](https://github.com/DejaOS/DejaOS/tree/main/skills) 中，目录名为：

```text
dejaos-app-dev-sdk2-0
```

可以下载整个 DejaOS 仓库的 ZIP，也可以克隆仓库：

```bash
git clone https://github.com/DejaOS/DejaOS.git
```

下载后，将完整的 `dejaos-app-dev-sdk2-0` 目录复制到所使用 AI 编程工具的 Skill 目录。不要只复制其中的 `SKILL.md`。

Windows 下常见的安装位置如下：

```text
Codex:     %USERPROFILE%\.codex\skills\dejaos-app-dev-sdk2-0
Cursor:    %USERPROFILE%\.cursor\skills\dejaos-app-dev-sdk2-0
WorkBuddy: %USERPROFILE%\.workbuddy\skills\dejaos-app-dev-sdk2-0
```

复制完成后，重新打开 AI 编程工具或开始一个新对话，使工具重新加载 Skill。

## 2. 如何调用

最明确的方式是在需求中直接写出 Skill 名称：

```text
使用 $dejaos-app-dev-sdk2-0，帮我开发一个 FCV5002 的门禁应用。
```

也可以直接描述 DejaOS App 开发任务。工具识别到任务后，通常会自动启用这个 Skill。

## 3. 从零创建一个 App

首次开发时，可以这样描述需求：

```text
使用 $dejaos-app-dev-sdk2-0 创建一个 DejaOS SDK 2.0 应用。
设备型号是 FCV4905，需要中文 UI、刷卡开门和人脸识别。
请先确认这台设备的 SKU 配置，再创建项目。
设备连接后，把应用同步到设备运行并检查日志。
```

接下来，AI 会引导你完成这些必要信息：

1. 检查电脑是否已安装 DejaOS CLI；未安装时先征求你的同意，再协助安装。
2. 确认设备型号以及指纹、扫码、4G、刷卡、麦克风等实际选配。
3. 使用 `dejaos new` 创建与设备匹配的完整项目。
4. 如果有 UI，根据对话和界面语言准备字体。
5. 编写代码，并根据项目中的 `dxmodules` 检查组件和函数调用。
6. 询问正确的设备是否已通过 USB 连接。
7. 在你确认后同步并运行 App，再读取设备日志检查明显错误。

设备型号和 SKU 信息应尽量准确。例如，`FCV5002` 不支持 Wi-Fi，就不应该要求 AI 为它开发 Wi-Fi 配置功能；某项硬件即使是该型号的可选项，也需要确认当前设备是否实际安装。

## 4. 修改现有 App

让 AI 打开现有项目时，请提供项目路径、设备型号和修改目标：

```text
使用 $dejaos-app-dev-sdk2-0 修改这个现有项目：
C:\projects\access-control

设备型号是 FCV4914。请增加扫码成功页面和语音提示。
改完后检查 dxmodules API；如果 USB 设备已连接，就同步运行并查看日志。
```

AI 会先查看项目自己的 `app.dxproj`、`dxmodules`、源码和资源，再进行修改。这样可以避免套用其他设备或其他组件版本的 API。

## 5. 让 Skill 帮你检查代码

如果代码已经写完，也可以只要求检查：

```text
使用 $dejaos-app-dev-sdk2-0 检查当前 DejaOS App。
重点确认：
1. 使用的功能是否符合设备型号和 SKU；
2. 所有组件是否已安装；
3. 每个 dxmodules 函数名和参数是否正确；
4. UI、Worker、资源路径和日志用法是否正确；
5. 如果设备已连接，运行并检查启动日志。
```

项目中实际生成的 `dxmodules/*.js` 是组件 API 的直接依据。组件版本不同，可用函数也可能不同，因此这一步可以减少“代码调用了组件中不存在的函数”这类问题。

## 6. 连接真实设备

Skill 不会在未经确认时操作设备。当 AI 询问 USB 连接情况时，请确认：

- 连接的是本项目对应型号的设备；
- USB 数据连接正常；
- 当前允许同步代码并启动 App。

确认后，AI 会使用 DejaOS CLI 完成同步、运行和日志检查。之后每次有实质性代码或资源修改，只要设备仍然可用，它都会再次尝试运行并检查日志。

如果暂时没有设备，可以继续完成代码和静态检查，但真实设备验证仍处于待完成状态。

## 7. 使用建议

- 一开始就告诉 AI 准确的设备型号，不要只说“人脸机”或“门禁机”。
- 涉及选配硬件时，明确当前设备实际安装了什么。
- 描述 UI 使用的语言，便于选择覆盖对应字符的字体。
- 人脸识别应用通常应显示实时摄像头画面；如需局部显示，请同时说明希望显示的区域。
- 修改现有项目时，始终让 AI 以该项目自己的 `dxmodules` 为准。
- 设备已连接时，明确允许 AI 同步、运行和查看日志，才能形成完整的开发验证闭环。

更多基础工具说明可参阅 [DejaOS CLI](../basics/cli.md)。
