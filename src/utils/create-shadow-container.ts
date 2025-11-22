/**
 * 支持的样式来源：
 * - HTMLStyleElement：通过 `?style` 导入的样式节点
 * - CSSStyleSheet：可用于 adoptedStyleSheets 的样式表
 * - string：原始 CSS 文本，将被注入到 <style> 中
 */
export type StyleSource = HTMLStyleElement | CSSStyleSheet | string

/**
 * Shadow DOM 容器创建的可选配置
 */
export interface ShadowContainerOptions {
  /** ShadowRoot 模式，默认 'open' */
  mode?: 'open' | 'closed'
  /** 宿主元素标签名，默认 'div' */
  hostTag?: keyof HTMLElementTagNameMap
  /** 宿主元素插入位置，默认 document.documentElement */
  attachTo?: Element
  /** 容器的 class（用于 Tailwind 作用域），默认 'tailwind' */
  containerClass?: string
  /** 容器额外属性，例如 data-*，将作为 setAttribute 注入 */
  containerAttrs?: Record<string, string>
  /** 要注入到 Shadow DOM 的样式集合 */
  styles?: StyleSource[]
}

/**
 * Shadow DOM 容器创建结果
 */
export interface ShadowContainerResult {
  /** 宿主元素（挂载 shadowRoot 的元素） */
  host: HTMLElement
  /** 创建的 ShadowRoot */
  shadow: ShadowRoot
  /** 应用挂载容器（建议用于框架根组件挂载） */
  container: HTMLElement
  /** 卸载函数：移除宿主并清理节点 */
  teardown: () => void
}

/**
 * 创建带样式隔离的 Shadow DOM 容器并返回挂载容器
 *
 * 用法示例：
 * const { container } = createShadowContainer({ styles: [styleEl, epEl], containerClass: 'tailwind' })
 * app.mount(container)
 */
export function createShadowContainer(options: ShadowContainerOptions = {}): ShadowContainerResult {
  const {
    mode = 'open',
    hostTag = 'div',
    attachTo = document.documentElement,
    containerClass = 'tailwind',
    containerAttrs = {},
    styles = [],
  } = options

  // 1) 创建宿主并附加 ShadowRoot
  const host = document.createElement(hostTag)
  attachTo.append(host)
  const shadow = host.attachShadow({ mode })

  // 2) 处理样式注入：支持 CSSStyleSheet / 字符串 / HTMLStyleElement
  const supportsAdopted = 'adoptedStyleSheets' in Document.prototype && 'replaceSync' in CSSStyleSheet.prototype
  const sheets: CSSStyleSheet[] = []
  for (const s of styles) {
    if (s instanceof CSSStyleSheet) {
      sheets.push(s)
    } else if (typeof s === 'string') {
      const styleEl = document.createElement('style')
      styleEl.textContent = s
      shadow.appendChild(styleEl)
    } else {
      shadow.appendChild(s)
    }
  }
  // 在支持 adoptedStyleSheets 的环境中更高效地应用样式表
  if (supportsAdopted && sheets.length) {
    shadow.adoptedStyleSheets = [...shadow.adoptedStyleSheets, ...sheets]
  }
  
  // 3) 创建挂载容器并设置类名/属性
  const container = document.createElement('div')
  if (containerClass) container.classList.add(containerClass)
  for (const k in containerAttrs) container.setAttribute(k, containerAttrs[k])
  shadow.appendChild(container)

  // 4) 提供卸载方法，符合用户脚本的资源清理规范
  const teardown = () => {
    host.remove()
  }
  return { host, shadow, container, teardown }
}