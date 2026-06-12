# dejaOS CLI

## 概述

**DejaOS CLI** 是 DejaOS 官方命令行开发工具。它提供与 VSCode 插件常用按钮对应的项目管理、设备控制和代码同步能力，适用于终端开发、自动化脚本以及 AI 辅助编程场景。

使用 CLI 时无需安装 VSCode 插件，但计算机需要安装 Node.js 18 或更高版本。

## 安装

```bash
npm install -g dejaos-cli
```

安装完成后，可以在终端中验证：

```bash
dejaos --help
```

所有项目命令默认操作当前目录。执行命令前，请确保当前目录根目录包含 `app.dxproj` 文件。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `dejaos edit` | 在终端界面中编辑 `app.dxproj` |
| `dejaos install` | 根据 `app.dxproj` 下载项目依赖组件到 `dxmodules/` |
| `dejaos build` | 将项目构建为 `.dpk` 应用包 |
| `dejaos connect` | 检查并连接 USB 设备 |
| `dejaos start` | 启动设备上的应用程序 |
| `dejaos stop` | 停止设备上的应用程序 |
| `dejaos reboot` | 重启设备 |
| `dejaos sync` | 仅同步发生变化的文件 |
| `dejaos sync --all` | 完整同步项目全部文件 |
| `dejaos run` | 停止应用、增量同步并重新启动 |
| `dejaos logs` | 持续查看设备实时日志，按 `Ctrl+C` 退出 |

## 推荐开发流程

首次获取项目或修改组件配置后：

```bash
dejaos install
dejaos sync --all
dejaos start
```

日常修改代码后，可以使用：

```bash
dejaos run
```

`dejaos run` 会自动连接设备，停止当前应用，增量同步发生变化的文件，然后重新启动应用。

## 编辑项目配置

执行以下命令打开终端项目配置编辑器：

```bash
dejaos edit
```

编辑器支持修改项目名称、设备型号、SDK 版本、应用版本、忽略规则和组件版本。按 `s` 保存，按 `q` 退出。

`app.dxproj` 中保存的是 SDK 的内部 ID，编辑器界面显示对应的 SDK 名称，例如 `2.0` 或 `3.0`。

## 增量同步与完整同步

`dejaos sync` 会比较当前项目文件与上一次成功同步时保存的 MD5 信息，只打包并发送发生变化的文件。

以下情况建议使用完整同步：

- 第一次将项目同步到设备；
- 修改了大量组件或资源文件；
- 设备中的代码状态与本地项目不一致；
- 增量同步后应用出现文件缺失。

```bash
dejaos sync --all
```

## 在 AI 辅助开发中使用

CLI 可以被 AI 编程工具或自动化脚本直接调用。例如，AI 完成代码修改后，可以执行：

```bash
dejaos run
```

这样无需人工点击 VSCode 按钮，即可完成代码同步和设备运行验证。需要持续观察运行日志时，执行：

```bash
dejaos logs
```

## VSCode 插件与 CLI

VSCode 插件和 CLI 可以独立使用：

- 喜欢图形界面、可视化项目配置和 GUI 编辑器时，可以使用 VSCode 插件；
- 偏好终端、自动化脚本或 AI 辅助开发时，可以使用 DejaOS CLI；
- 两种工具使用相同的 `app.dxproj` 项目格式。
