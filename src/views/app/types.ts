// 调试日志类型定义
export interface DebugLog {
  timestamp: string
  level: 'info' | 'warn' | 'error'
  message: string
}

// 规则项类型定义
export interface RuleItem {
  keywords: string[]
  matchUrl: string
}

// 高亮状态类型定义
export interface HighlightState {
  totalCount: number
  currentIndex: number
  highlighter: any | null
  keywords: string[]
}

// 页面状态类型定义
export interface PageState {
  globalStyle?: HTMLStyleElement
}

// 表单数据类型定义
export interface FormData {
  configJson: string
  defaultHightlightStyle: string
  highlightStyle: string
  activeStyle: string
  selectedTheme: string
  placeholder: string
}

// 调试信息类型定义
export interface DebugInfo {
  currentUrl: string
  pageTitle: string
  userAgent: string
  scriptVersion: string
  pageLoadTime: number
  scriptInitTime: number
  highlightTime: number
  memoryUsage: string
  domElementCount: number
  textNodeCount: number
  highlightElementCount: number
  pageHeight: number
}

// 动态颜色配置类型定义
export interface DynamicColors {
  panelBg: string
  triggerBg: string
  contentBg: string
  infoBg: string
  borderColor: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  buttonPrimary: string
  buttonSecondary: string
  buttonDanger: string
  buttonSuccess: string
}

// 主题预设类型定义
export interface ThemePreset {
  highlight: string
  active: string
}

export type ThemePresets = {
  [key: string]: ThemePreset
}