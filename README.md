# DejaOS Documentation Website

这是 DejaOS 的官方文档网站，基于 Docusaurus 构建。

## 新功能

### 🌙 白天黑夜切换

- 已启用 Docusaurus 自带的白天黑夜切换功能
- 在导航栏右侧可以看到切换按钮
- 支持自动跟随系统主题设置

### 🌍 国际化支持

- 支持中文和英文两种语言
- 在导航栏右侧可以看到语言切换按钮
- 已创建中文版本的文档内容

## 功能说明

### Docusaurus 自带功能

是的，这两个功能都是 Docusaurus 自带的：

1. **白天黑夜切换** - 通过`colorMode`配置启用
2. **国际化** - 通过`i18n`配置启用

### 当前支持的语言

- **英文** (默认) - `/`
- **中文** - `/zh/`

### 已翻译的内容

- 导航栏标签
- 页面标题和描述
- 文档内容 (welcome.md, requirements.md)
- 模块文档 (modules/welcome.md)
- 侧边栏配置
- Footer 内容

## 开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build
```

## 部署

本网站使用 GitHub Pages 自动部署：

- **网站地址**: https://dejaos.github.io/
- **自动部署**: 推送到 `main` 分支时自动构建和部署
- **构建状态**: 可在 [Actions](https://github.com/DejaOS/dejaos.github.io/actions) 页面查看

### 本地预览构建结果

```bash
# 构建后预览
npm run build
npm run serve
```

### baseUrl 说明

如果你用的是用户主页（仓库名为 dejaos.github.io），请确保 `docusaurus.config.js` 配置如下：

```js
url: 'https://dejaos.github.io',
baseUrl: '/',
```

## 文件结构

```
i18n/
├── zh/
│   ├── docusaurus-plugin-content-docs/
│   │   └── current/
│   │       ├── welcome.md          # 中文版欢迎页面
│   │       └── requirements.md     # 中文版系统要求
│   ├── docusaurus-plugin-content-docs-modules/
│   │   └── current/
│   │       └── welcome.md          # 中文版模块欢迎页面
│   ├── sidebars.js                 # 中文版侧边栏配置
│   └── sidebars-modules.js         # 中文版模块侧边栏配置
```

## 技术栈

- Docusaurus 3.x
- React 18
- @infinum/docusaurus-theme

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个文档网站。
