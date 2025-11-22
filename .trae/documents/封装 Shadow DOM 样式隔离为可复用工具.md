## 目标
- 将 `src/main.ts` 中的 Shadow DOM + 样式隔离逻辑抽象为通用函数，便于在其他项目直接调用。
- 保持与当前实现一致的行为：在宿主页创建 `shadowRoot`，注入样式，再挂载 Vue 应用容器。

## 背景与现状
- 现有代码在 `src/main.ts:12-16` 通过 `host.attachShadow` 创建 Shadow DOM，并将 `style.css?style` 与 `element-plus/dist/index.css?style` 两个样式节点注入到 Shadow DOM，再追加一个带 `tailwind` 类名的容器用于挂载应用。
- 该模式已满足“样式隔离”和“Tailwind/Element Plus 独立作用域”的需求，但分散在 `main.ts` 不便复用。

## 设计要点
- 提供单一入口函数以完成：创建宿主元素、附加 ShadowRoot、注入样式、创建并返回容器。
- 兼容三种样式输入：`HTMLStyleElement`（如 `?style` 导入）、`CSSStyleSheet`（支持 `adoptedStyleSheets` 的浏览器）、`string`（原始 CSS 文本）。
- 可配置：`mode`、`hostTag`、`attachTo`、`containerClass`、`containerAttrs`、`styles`。
- 返回对象包含：`host`、`shadow`、`container`、`teardown()`，便于卸载与资源清理。

## API 设计
- `createShadowContainer(options?: ShadowContainerOptions): ShadowContainerResult`
- `ShadowContainerOptions`
  - `mode?: 'open' | 'closed'`，默认 `'open'`
  - `hostTag?: keyof HTMLElementTagNameMap`，默认 `'div'`
  - `attachTo?: Element`，默认 `document.documentElement`
  - `containerClass?: string`，默认 `'tailwind'`
  - `containerAttrs?: Record<string, string>`
  - `styles?: Array<HTMLStyleElement | CSSStyleSheet | string>`
- `ShadowContainerResult`
  - `host: HTMLElement`
  - `shadow: ShadowRoot`
  - `container: HTMLElement`
  - `teardown: () => void`

## 具体实现步骤
1. 新增工具文件 `src/utils/create-shadow-container.ts`，使用 TypeScript 实现上述 API。
2. 样式注入策略：
   - `CSSStyleSheet`：若浏览器支持 `adoptedStyleSheets`，则追加到 `shadow.adoptedStyleSheets`；否则降级为创建 `<style>` 并 `textContent` 注入。
   - `HTMLStyleElement`：直接 `shadow.appendChild(styleEl)`。
   - `string`：创建 `<style>`，设置 `textContent` 后追加到 `shadow`。
3. 创建容器并应用 `containerClass` 与 `containerAttrs`，将其追加到 `shadow` 并返回。
4. 提供 `teardown()` 用于卸载宿主元素，满足用户脚本的内存管理规范。

## main.ts 改造
- 替换现有匿名 IIFE，改为调用工具函数：
```ts
import { createApp } from 'vue'
import App from './App.vue'
import styleCss from './style.css?style'
import epCss from 'element-plus/dist/index.css?style'
import ElementPlus from 'element-plus'
import { createShadowContainer } from './utils/create-shadow-container'

const { container } = createShadowContainer({
  styles: [styleCss, epCss],
  containerClass: 'tailwind'
})

const app = createApp(App)
app.use(ElementPlus)
app.mount(container)
```

## 兼容与注意
- `?style` 导入返回 `HTMLStyleElement`，已原生兼容。
- 在支持 `adoptedStyleSheets` 的浏览器（Chrome/Edge 近版本）可更高效应用 `CSSStyleSheet`，否则自动降级。
- 保持 Tailwind 的 preflight 关闭由项目配置负责；该工具仅负责隔离与注入。
- 用户脚本环境下资源清理：在卸载时调用 `teardown()` 移除宿主，避免残留节点。

## 验证方案
- 构建并在目标页面加载用户脚本，检查 Element Plus 与 Tailwind 样式仅作用于 Shadow DOM 内部。
- 切换不同样式输入方式（`HTMLStyleElement` 与 `string`）验证注入兼容性。
- 调用 `teardown()` 后确认宿主节点移除且不影响宿主页面样式。