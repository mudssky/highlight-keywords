import { Highlighter } from '@mudssky/jsutils'

// 全局高亮器实例
let globalHighlighter: Highlighter | null = null

/**
 * 初始化全局高亮器
 * @param container 容器元素，默认为 document.body
 * @returns 高亮器实例
 */
export function initHighlighter(container: HTMLElement = document.body): Highlighter {
  if (globalHighlighter) {
    globalHighlighter.remove()
  }
  
  globalHighlighter = new Highlighter(container, {
    highlightTag: 'span',
    highlightClass: 'highlight-keywords',
    activeClass: 'highlight-active',
    skipTags: ['SCRIPT', 'STYLE', 'NOSCRIPT'],
    scrollOptions: {
      behavior: 'smooth',
      block: 'center',
    },
    enablePerformanceOptimization: true,
  })
  
  return globalHighlighter
}

/**
 * 获取全局高亮器实例
 * @returns 高亮器实例
 */
export function getHighlighter(): Highlighter {
  if (!globalHighlighter) {
    globalHighlighter = initHighlighter()
  }
  return globalHighlighter
}

/**
 * 高亮关键字（使用 Highlighter 类）
 * @param node 节点（兼容旧接口，实际使用全局容器）
 * @param pattern 匹配的正则表达式或关键词字符串
 * @param index 可选。本项目中特定的需求，表示第几组关键词（暂时保留兼容性）
 * @returns 匹配次数
 */
export async function highlightKeyword(
  node: HTMLElement,
  pattern: RegExp | string,
  index?: string
): Promise<number> {
  const highlighter = getHighlighter()
  
  // 如果传入的是正则表达式，需要转换为字符串
  let keyword: string
  if (pattern instanceof RegExp) {
    // 从正则表达式中提取关键词
    keyword = pattern.source.replace(/[\\|()]/g, '')
  } else {
    keyword = pattern
  }
  
  try {
    const count = await highlighter.apply(keyword, {
      caseSensitive: false,
      wholeWord: false,
    })
    return count
  } catch (error) {
    console.error('高亮关键词时出错:', error)
    return 0
  }
}

/**
 * 关闭高亮的函数（使用 Highlighter 类）
 * @param node 节点（兼容旧接口）
 * @param pattern 匹配的正则表达式（兼容旧接口，实际不使用）
 * @param index 关键词的组别（兼容旧接口，实际不使用）
 */
export function closeHighlight(
  node?: HTMLElement,
  pattern?: RegExp,
  index?: string
): void {
  const highlighter = getHighlighter()
  highlighter.remove()
}

/**
 * 清理关键词并生成正则表达式（保留兼容性）
 * @param keywords 要高亮的关键词数组
 * @returns [pattern, wholePattern] 正则表达式数组
 */
export function cleanKeywords(keywords: string[]): [RegExp, RegExp] {
  let wordMatchString = ''
  const words = [...keywords]
  words.forEach((item: string) => {
    // $&在js替换中表示每一次匹配到的内容，\\是斜杠，也就是对每一次匹配到的内容转义。
    let transformString = item.replace(/[.[*?+^$|()/]|\]|\\/g, '\\$&')
    wordMatchString += `|(${transformString})`
  })
  // 移除开头的多余的|
  wordMatchString = wordMatchString.substring(1)
  // 用于关闭高亮时精确匹配
  const wholePattern = new RegExp(`^${wordMatchString}$`, 'i')
  // 用于第一次高亮的关键字匹配正则
  const pattern = new RegExp(wordMatchString, 'i')
  return [pattern, wholePattern]
}

/**
 * 使用 Highlighter 高亮多个关键词
 * @param keywords 关键词数组
 * @param container 容器元素
 * @returns 匹配总数
 */
export async function highlightKeywords(
  keywords: string[],
  container: HTMLElement = document.body
): Promise<number> {
  const highlighter = getHighlighter()
  
  try {
    // 直接使用 Highlighter 的 apply 方法，它原生支持多关键词
    const count = await highlighter.apply(keywords, {
      caseSensitive: false,
      wholeWord: false,
    })
    return count
  } catch (error) {
    console.error('高亮关键词时出错:', error)
    return 0
  }
}
