# 可删除文件和目录清单

## 🟢 安全删除（构建输出和缓存）

- `build/` - Docusaurus 构建输出目录，可以随时重新生成
- `.docusaurus/` - Docusaurus 缓存目录，可以随时重新生成
- `node_modules/` - npm 依赖目录（如果需要可以通过 npm install 重新安装）

## 🟡 可能删除（unused/legacy 内容）

### Forms 相关（当前配置中已注释掉）

- `forms/` - 整个 forms 目录，配置中已注释掉 forms 插件
- `sidebars-forms.js` - forms 相关的侧边栏配置

### UI Components（包含大量 Eightshift 相关内容）

- `ui-components/` - 包含 Eightshift 相关的 UI 组件，与 DejaOS 项目无关
- `sidebars-components.js` - components 相关的侧边栏配置

### 包管理器文件冲突

- `bun.lock` - 项目使用 npm（有 package-lock.json），bun.lock 可能不需要

### 可能的模板残留文件

- `videos.json` - 可能是模板残留，检查是否在项目中使用
- `.nojekyll` - GitHub Pages 相关，如果不部署到 GitHub Pages 可以删除

## 🟠 需要检查后删除（可能有依赖）

### 插件目录

- `plugins/es-text-loader/` - 自定义插件，需要确认是否在使用

### 工具目录

- `utils/` - 只有一个 shared.jsx 文件，检查是否被引用

## ⚠️ 需要清理的内容（不是删除文件，而是清理内容）

### 文档中的 Eightshift 引用

需要清理以下文件中的 Eightshift 相关内容：

- `forms/` 目录下的所有 `.md` 文件
- `docs/` 目录下包含 eightshift 引用的文件
- `ui-components/welcome.md`

### 配置文件中的注释代码

- `docusaurus.config.js` - 清理被注释掉的 hardware、gui、forms 相关配置
- `sidebars.js` - 清理被注释掉的硬件和其他模块配置
- `sidebars-modules.js` - 清理被注释掉的硬件相关配置

## 🔴 不要删除

### 核心文件

- `package.json` 和 `package-lock.json`
- `docusaurus.config.js`
- `sidebars.js` 和 `sidebars-modules.js`
- `docs/` 和 `modules/` 目录
- `i18n/` 目录
- `src/` 目录
- `static/` 目录
- `blog/` 目录

## 建议删除顺序

1. **第一步（最安全）**：删除构建输出

   ```
   build/
   .docusaurus/
   ```

2. **第二步**：删除冲突的包管理器文件

   ```
   bun.lock
   ```

3. **第三步**：删除未使用的 Forms 相关文件

   ```
   forms/
   sidebars-forms.js
   ```

4. **第四步**：删除 Eightshift 相关的 UI 组件

   ```
   ui-components/
   sidebars-components.js
   ```

5. **第五步**：检查并可能删除
   ```
   videos.json（检查是否被引用）
   .nojekyll（如果不用GitHub Pages）
   utils/（检查shared.jsx是否被使用）
   plugins/es-text-loader/（检查配置文件中的引用）
   ```

## 注意事项

- 删除前请备份重要数据
- 每删除一个目录后，运行 `npm start` 检查是否有错误
- 如果出现错误，可以从 git 恢复
- 建议一次删除一个目录，而不是批量删除
