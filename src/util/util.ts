import type { DebugLog, DebugInfo } from '@/views/app/types'
import { ElMessage } from 'element-plus'
export function getLocalStorageJSON(keyname: string) {
  const data = localStorage.getItem(keyname)
  return data ? JSON.parse(data) : null
}

export function setLocalStorageJSON(keyname: string, value: string) {
  localStorage.setItem(keyname, value)
}

export function setLocalStorageObj(keyname: string, value: unknown) {
  localStorage.setItem(keyname, JSON.stringify(value))
}

/**
 * 通过 CSS 类选择器实现高亮（适配 Highlighter 类）
 */
export function generateHighlightStyle(styleText: string): string {
  return `.highlight-keywords{${styleText}}`
}

/**
 * 获取文本节点数量
 */
export function getTextNodeCount(element: Element): number {
  let count = 0
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null)

  while (walker.nextNode()) {
    count++
  }

  return count
}

/**
 * 添加调试日志
 */
export function addDebugLog(
  debugLogs: DebugLog[],
  isDebugMode: boolean,
  level: 'info' | 'warn' | 'error',
  message: string,
): void {
  if (!isDebugMode) return

  const timestamp = new Date().toLocaleTimeString()
  debugLogs.unshift({
    timestamp,
    level,
    message,
  })

  // 限制日志数量，保留最新的100条
  if (debugLogs.length > 100) {
    debugLogs.splice(100)
  }

  // 同时输出到浏览器控制台
  const consoleMethods = {
    info: console.info,
    warn: console.warn,
    error: console.error,
  }
  consoleMethods[level](`[HighlightKeywords] ${message}`)
}

/**
 * 刷新调试信息
 */
export function refreshDebugInfo(debugInfo: DebugInfo): void {
  // 基本页面信息
  debugInfo.currentUrl = window.location.href
  debugInfo.pageTitle = document.title
  debugInfo.userAgent = navigator.userAgent
  debugInfo.scriptVersion = (window as any).GM_info?.script?.version || '未知'

  // 性能信息
  debugInfo.pageLoadTime =
    Math.round(
      performance.timing?.loadEventEnd - performance.timing?.navigationStart,
    ) || 0
  debugInfo.scriptInitTime = Math.round(performance.now())

  // DOM 信息
  debugInfo.domElementCount = document.querySelectorAll('*').length
  debugInfo.textNodeCount = getTextNodeCount(document.body)
  debugInfo.highlightElementCount = document.querySelectorAll(
    '[data-highlight-keyword]',
  ).length
  debugInfo.pageHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight,
  )

  // 内存使用（如果支持）
  if ('memory' in performance) {
    const memory = (performance as any).memory
    debugInfo.memoryUsage = `${Math.round(
      memory.usedJSHeapSize / 1024 / 1024,
    )}MB / ${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`
  } else {
    debugInfo.memoryUsage = '不支持'
  }
}

/**
 * 导出调试信息
 */
export function exportDebugInfo(
  debugInfo: DebugInfo,
  highlightState: any,
  ruleList: any[],
  matchedRuleList: any[],
  debugLogs: DebugLog[],
): void {
  const exportData = {
    timestamp: new Date().toISOString(),
    debugInfo,
    highlightState: {
      totalCount: highlightState.totalCount,
      currentIndex: highlightState.currentIndex,
      keywords: highlightState.keywords,
    },
    ruleList,
    matchedRuleList,
    logs: debugLogs,
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `highlight-keywords-debug-${new Date()
    .toISOString()
    .slice(0, 19)
    .replace(/:/g, '-')}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  ElMessage.success('调试信息已导出')
}

/**
 * 复制文本到剪贴板
 */
export function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text)
  ElMessage.success('复制成功')
}

/**
 * 预览样式
 */
export function previewStyle(
  highlightStyle: string,
  activeStyle: string,
): void {
  const previewHighlight = document.querySelector(
    '.preview-highlight',
  ) as HTMLElement
  const previewActive = document.querySelector('.preview-active') as HTMLElement

  if (previewHighlight) {
    previewHighlight.style.cssText = highlightStyle
  }
  if (previewActive) {
    previewActive.style.cssText = activeStyle
  }

  ElMessage.success('样式预览已更新')
}
