# highlight-keywords

一个功能强大的关键词高亮油猴脚本，支持自定义样式、智能导航和多站点配置。

## 功能特性

- 🎯 **智能高亮**：支持多关键词同时高亮，自动匹配网站规则
- 🎨 **自定义样式**：提供多种预设主题，支持自定义高亮样式
- 🧭 **便捷导航**：右侧悬浮面板，快速跳转到上一个/下一个匹配项
- ⚙️ **灵活配置**：JSON 格式配置，支持正则表达式匹配网站
- 💾 **本地存储**：配置信息保存在浏览器本地，跨页面保持
- 🔧 **现代技术栈**：基于 Vue 3 + TypeScript + Tailwind CSS 开发

## 安装方法

### 方法一：从脚本发布页安装（推荐）

访问 [Greasy Fork 发布页](https://greasyfork.org/zh-CN/scripts/461411-highlight-keywords) 直接安装

### 方法二：本地构建安装

```shell
# 安装依赖
pnpm i
# 打包脚本
pnpm build
```

构建完成后，将 `dist/highlight-keywords.user.js` 文件拖拽到 Tampermonkey 扩展中安装。

## 使用方法

### 基本使用

1. **安装脚本**：按照上述安装方法安装脚本
2. **打开配置**：在任意网页上，点击 Tampermonkey 图标，选择「高亮配置面板」
3. **配置规则**：在配置面板中设置关键词和匹配网站
4. **保存配置**：点击「更新配置」按钮保存设置
5. **查看效果**：刷新页面，匹配的关键词将被高亮显示

### 配置格式

配置文件使用 JSON 格式，支持多个规则配置：

```json
[
  {
    "keywords": ["Vue", "React", "Angular"],
    "matchUrl": "github.com"
  },
  {
    "keywords": ["JavaScript", "TypeScript"],
    "matchUrl": "stackoverflow.com"
  },
  {
    "keywords": ["前端", "后端"],
    "matchUrl": "juejin.cn|zhihu.com"
  }
]
```

### 配置说明

- **keywords**：要高亮的关键词数组，支持中英文
- **matchUrl**：匹配的网站规则，支持正则表达式
  - 简单匹配：`"github.com"` 匹配包含 github.com 的网址
  - 多站点：`"site1.com|site2.com"` 使用 | 分隔多个站点
  - 正则表达式：`".*\.com$"` 匹配所有 .com 域名

### 样式自定义

脚本提供了多种预设主题：

- **默认主题**：黄色背景，黑色文字
- **深色主题**：深色背景，白色文字
- **现代主题**：渐变背景，圆角边框
- **简约主题**：淡色背景，下划线强调

也可以自定义 CSS 样式：

```css
/* 高亮样式 */
background: linear-gradient(135deg, #667eea, #764ba2); 
color: white; 
border-radius: 3px; 
padding: 1px 3px;

/* 当前选中样式 */
background: orange; 
color: white; 
outline: 2px solid #ff5722;
```

### 导航功能

当页面中存在匹配的关键词时，右侧会出现导航面板：

- **悬浮显示**：鼠标悬停在右侧边缘触发区域时展开面板
- **固定面板**：点击📍图标可以固定面板，避免自动收起
- **快速导航**：使用⬆️⬇️按钮在匹配项之间跳转
- **清除高亮**：点击🗑️按钮清除所有高亮效果
- **关闭面板**：点击✕按钮关闭面板1小时

## 技术栈

- **前端框架**：Vue 3 (Composition API)
- **开发语言**：TypeScript
- **样式框架**：Tailwind CSS
- **UI 组件**：Element Plus
- **构建工具**：Vite + vite-plugin-monkey
- **代码规范**：ESLint + Prettier
- **包管理器**：pnpm

## 开发说明

### 项目结构

```
src/
├── main.ts          # 入口文件
├── App.vue          # 根组件
├── style.css        # Tailwind CSS 样式
├── views/
│   └── app/
│       └── index.vue # 主要功能组件
└── util/
    ├── tools.ts     # 高亮工具函数
    └── util.ts      # 通用工具函数
```

### 开发命令

```shell
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建生产版本
pnpm build

# 代码检查
pnpm lint

# 代码格式化
pnpm format
```

### 构建配置

项目使用 `vite-plugin-monkey` 插件构建油猴脚本：

- Vue 和 Element Plus 通过 CDN 引入，减少打包体积
- Tailwind CSS 样式被内联到脚本中
- 支持 TypeScript 和现代 ES 语法
- 自动生成油猴脚本元数据

## 贡献指南

1. Fork 本仓库
2. 创建功能分支：`git checkout -b feature/new-feature`
3. 提交更改：`git commit -am 'Add new feature'`
4. 推送分支：`git push origin feature/new-feature`
5. 提交 Pull Request

## 许可证

MIT License

## 更新日志

### v2.0.4
- 重构为 Tailwind CSS 样式系统
- 优化右侧导航面板交互体验
- 增加面板固定和关闭功能
- 改进样式预设和自定义功能

### v2.0.0
- 使用 Vue 3 + TypeScript 重写
- 新增右侧悬浮导航面板
- 支持多主题样式预设
- 优化高亮算法和性能

