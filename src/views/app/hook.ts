import {
  GM_getValue,
  GM_registerMenuCommand,
  GM_setClipboard,
  GM_setValue,
} from '$'
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import {
  cleanKeywords,
  closeHighlight,
  highlightKeywords,
  initHighlighter,
  getHighlighter,
} from '../../util/tools'
import { Highlighter, cn } from '@mudssky/jsutils'
import type {
  DebugLog,
  RuleItem,
  HighlightState,
  PageState,
  FormData,
  DebugInfo,
  DynamicColors,
} from './types'
import {
  CONFIG_NAME,
  themePresets,
  defaultFormData,
  generateDynamicColors,
  validateConfig,
} from './config'
import {
  generateHighlightStyle,
  addDebugLog,
  refreshDebugInfo,
  exportDebugInfo,
  copyToClipboard,
  previewStyle,
} from '@/util/index'

/**
 * 高亮关键词应用的主要逻辑 Hook
 * @returns 返回所有状态和方法
 */
export function useHighlightApp() {
  // 表单引用
  const ruleFormRef = ref<FormInstance>()
  const dialogVisible = ref(false)
  const ruleList = ref<RuleItem[]>([])

  // 高亮状态管理
  const highlightState = reactive<HighlightState>({
    totalCount: 0,
    currentIndex: -1,
    highlighter: null,
    keywords: [],
  })

  // 面板状态管理
  const panelExpanded = ref(false)
  const panelPinned = ref(GM_getValue('panel-pinned', false))
  const panelHidden = ref(false)
  const panelHideTimeout = ref<number | null>(null)

  // 夜间模式状态管理
  const isDarkMode = ref(
    GM_getValue(
      'dark-mode',
      window.matchMedia('(prefers-color-scheme: dark)').matches,
    ),
  )

  // 调试模式状态
  const isDebugMode = ref(false)
  const debugDialogVisible = ref(false)
  const activeDebugTab = ref('basic')
  const debugLogs = ref<DebugLog[]>([])
  const debugInfo = reactive<DebugInfo>({
    currentUrl: '',
    pageTitle: '',
    userAgent: '',
    scriptVersion: '',
    pageLoadTime: 0,
    scriptInitTime: 0,
    highlightTime: 0,
    memoryUsage: '',
    domElementCount: 0,
    textNodeCount: 0,
    highlightElementCount: 0,
    pageHeight: 0,
  })

  // 页面状态
  const pageState = reactive<PageState>({
    globalStyle: undefined,
  })

  // 表单数据
  const form = reactive<FormData>(defaultFormData)

  // 计算属性
  const matchedRuleList = computed(() => {
    return ruleList.value.filter((rule: RuleItem) => {
      var urlPattern = new RegExp(rule.matchUrl)
      console.log({
        match: rule.matchUrl,
        href: window.location.href,
        isMatch: urlPattern.test(window.location.href),
      })
      return urlPattern.test(window.location.href)
    })
  })

  const matchedKeywords = computed(() => {
    const keywordsLists = matchedRuleList.value.map((item) => {
      return item.keywords
    })
    console.log({ keywordsLists, matchedRuleList: matchedRuleList.value })
    // 展开然后去重
    return [...new Set(keywordsLists.flat())]
  })

  // 动态配色方案
  const dynamicColors = computed<DynamicColors>(() =>
    generateDynamicColors(isDarkMode.value),
  )

  // 面板交互处理
  const handlePanelHover = (isHover: boolean) => {
    if (!panelPinned.value && !panelHidden.value) {
      panelExpanded.value = isHover
    }
  }

  const togglePanelPin = () => {
    panelPinned.value = !panelPinned.value
    GM_setValue('panel-pinned', panelPinned.value)
    if (panelPinned.value) {
      panelExpanded.value = true
    } else {
      panelExpanded.value = false
    }
  }

  // 夜间模式切换
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
    GM_setValue('dark-mode', isDarkMode.value)
  }

  const handleClosePanel = () => {
    panelHidden.value = true
    panelExpanded.value = false
    panelPinned.value = false

    // 清除之前的定时器
    if (panelHideTimeout.value) {
      clearTimeout(panelHideTimeout.value)
    }

    // 设置一小时后重新显示
    panelHideTimeout.value = setTimeout(
      () => {
        panelHidden.value = false
      },
      60 * 60 * 1000,
    ) // 1小时
  }

  /**
   * 加载全局样式
   */
  function loadGlobalStyle(styleText: string): void {
    // 移除旧样式
    if (pageState.globalStyle) {
      pageState.globalStyle.remove()
    }

    // 创建新样式
    const style = document.createElement('style')
    style.textContent = styleText
    document.head.appendChild(style)
    pageState.globalStyle = style
  }

  /**
   * 更新高亮样式
   */
  function updateHighlightStyle(): void {
    const highlightStyle = generateHighlightStyle(form.highlightStyle)
    loadGlobalStyle(highlightStyle)
  }

  // 导航功能方法
  const handlePrevious = () => {
    if (highlightState.totalCount === 0) {
      addDebugLog(
        debugLogs.value,
        isDebugMode.value,
        'warn',
        '没有高亮项，无法导航到上一个',
      )
      return
    }

    const highlighter = getHighlighter()
    highlighter.jumpToPreviousOffscreen()

    highlightState.currentIndex = highlighter.getCurrentIndex()
    addDebugLog(
      debugLogs.value,
      isDebugMode.value,
      'info',
      `导航到上一个高亮项，当前索引: ${highlightState.currentIndex + 1}/${
        highlightState.totalCount
      }`,
    )
  }

  const handleNext = () => {
    if (highlightState.totalCount === 0) {
      addDebugLog(
        debugLogs.value,
        isDebugMode.value,
        'warn',
        '没有高亮项，无法导航到下一个',
      )
      return
    }

    const highlighter = getHighlighter()
    highlighter.jumpToNextOffscreen()
    highlightState.currentIndex = highlighter.getCurrentIndex()
    addDebugLog(
      debugLogs.value,
      isDebugMode.value,
      'info',
      `导航到下一个高亮项，当前索引: ${highlightState.currentIndex + 1}/${
        highlightState.totalCount
      }`,
    )
  }

  const handleEnableHighlight = async () => {
    if (matchedKeywords.value.length === 0) {
      ElMessage.warning('当前页面没有匹配的关键词规则')
      return
    }

    try {
      // 确保全局样式已加载
      if (!pageState.globalStyle) {
        loadGlobalStyle(generateHighlightStyle(form.highlightStyle))
      }

      // 初始化高亮器（如果还没有初始化）
      if (!highlightState.highlighter) {
        initHighlighter(document.body)
      }

      await highlightMatchedKeywords()
      ElMessage.success(
        `已启用高亮，找到 ${highlightState.totalCount} 个匹配项`,
      )
    } catch (error) {
      console.error('启用高亮时出错:', error)
      ElMessage.error('启用高亮失败')
    }
  }

  const handleClearHighlight = () => {
    const highlighter = getHighlighter()
    highlighter.remove()

    highlightState.totalCount = 0
    highlightState.currentIndex = -1
    highlightState.keywords = []

    addDebugLog(debugLogs.value, isDebugMode.value, 'info', '已清除所有高亮')
    ElMessage.success('已清除所有高亮')
  }

  // 主题切换处理
  const handleThemeChange = (theme: string) => {
    if (themePresets[theme as keyof typeof themePresets]) {
      const preset = themePresets[theme as keyof typeof themePresets]
      form.highlightStyle = preset.highlight
      form.activeStyle = preset.active
    }
  }

  // 调试相关方法
  const toggleDebugDialog = () => {
    debugDialogVisible.value = !debugDialogVisible.value
    if (debugDialogVisible.value) {
      refreshDebugInfo(debugInfo)
    }
  }

  const handleCloseDebug = () => {
    debugDialogVisible.value = false
  }

  const clearDebugLogs = () => {
    debugLogs.value = []
    addDebugLog(debugLogs.value, isDebugMode.value, 'info', '调试日志已清空')
  }

  // 预览样式
  const handlePreviewStyle = () => {
    previewStyle(form.highlightStyle, form.activeStyle)
  }

  const handleCopyJson = () => {
    copyToClipboard(form.configJson)
  }

  function loadRuleList() {
    const vv = GM_getValue(CONFIG_NAME, [])
    ruleList.value = vv
    form.configJson = JSON.stringify(ruleList.value)
  }

  function handleOpenPanel() {
    dialogVisible.value = true
  }

  function handleClose() {
    dialogVisible.value = false
  }

  const handleUpdateConfig = async () => {
    try {
      const configList = JSON.parse(form.configJson) as RuleItem[]
      const [isValid, errorMessage] = validateConfig(configList)
      if (!isValid) {
        ElMessage.error(errorMessage)
        addDebugLog(debugLogs.value, isDebugMode.value, 'error', errorMessage)
        return
      }
      GM_setValue(CONFIG_NAME, configList)
      ElMessage.success('更新成功')
      loadRuleList()
      dialogVisible.value = false
      addDebugLog(debugLogs.value, isDebugMode.value, 'info', '配置更新成功')
    } catch (error) {
      console.error(error)
      ElMessage.error('配置格式错误')
      addDebugLog(
        debugLogs.value,
        isDebugMode.value,
        'error',
        `配置更新失败：${error}`,
      )
    }
  }

  async function highlightMatchedKeywords() {
    const startTime = performance.now()

    console.log({ matchedKeywords: matchedKeywords.value })
    addDebugLog(
      debugLogs.value,
      isDebugMode.value,
      'info',
      `开始高亮匹配的关键词: ${matchedKeywords.value.join(', ')}`,
    )

    if (matchedKeywords.value.length < 1) {
      addDebugLog(
        debugLogs.value,
        isDebugMode.value,
        'info',
        '没有匹配的关键词',
      )
      return
    }

    try {
      // 使用getHighlighter获取单例实例
      const highlighter = getHighlighter()
      highlightState.highlighter = highlighter
      addDebugLog(
        debugLogs.value,
        isDebugMode.value,
        'info',
        '高亮器实例获取成功',
      )

      // 应用高亮
      const count = await highlighter.apply(matchedKeywords.value, {
        caseSensitive: false,
        wholeWord: false,
      })

      // 更新状态
      highlightState.totalCount = count
      highlightState.currentIndex = count > 0 ? 0 : -1
      highlightState.keywords = matchedKeywords.value

      const endTime = performance.now()
      debugInfo.highlightTime = Math.round(endTime - startTime)

      const message = `成功高亮 ${count} 个匹配项，耗时 ${debugInfo.highlightTime}ms`
      console.log(message)
      addDebugLog(debugLogs.value, isDebugMode.value, 'info', message)
    } catch (error) {
      const errorMessage = `高亮关键词时出错: ${
        error instanceof Error ? error.message : String(error)
      }`
      console.error(errorMessage, error)
      addDebugLog(debugLogs.value, isDebugMode.value, 'error', errorMessage)
    }
  }

  // 生命周期钩子
  onMounted(async () => {
    const initStartTime = performance.now()

    // 初始化调试模式（开发环境或手动开启）
    const defaultDebugMode =
      import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE === 'true'
    isDebugMode.value = GM_getValue('debugMode', defaultDebugMode)
    GM_setValue('debugMode', isDebugMode.value)

    addDebugLog(debugLogs.value, isDebugMode.value, 'info', '脚本开始初始化')

    console.log('init')

    // 挂载时从本地读取配置
    loadRuleList()
    addDebugLog(
      debugLogs.value,
      isDebugMode.value,
      'info',
      `规则列表加载完成，共 ${ruleList.value.length} 条规则`,
    )

    // 恢复面板固定状态
    if (panelPinned.value) {
      panelExpanded.value = true
    }
    addDebugLog(
      debugLogs.value,
      isDebugMode.value,
      'info',
      `面板固定状态: ${panelPinned.value ? '固定' : '浮动'}`,
    )

    console.log({ matchedKeywords: matchedKeywords.value })
    // 如果没有匹配到规则列表，不需要加载全局样式
    if (matchedKeywords.value.length > 0) {
      loadGlobalStyle(generateHighlightStyle(form.highlightStyle))
      // 初始化高亮器
      initHighlighter(document.body)
      addDebugLog(
        debugLogs.value,
        isDebugMode.value,
        'info',
        '高亮器初始化完成',
      )
      await highlightMatchedKeywords()
    }

    GM_registerMenuCommand('打开配置面板', handleOpenPanel)

    GM_registerMenuCommand('切换调试模式', () => {
      isDebugMode.value = !isDebugMode.value
      GM_setValue('debugMode', isDebugMode.value)
      ElMessage.success(`调试模式已${isDebugMode.value ? '开启' : '关闭'}`)
      addDebugLog(
        debugLogs.value,
        isDebugMode.value,
        'info',
        `调试模式已${isDebugMode.value ? '开启' : '关闭'}`,
      )
    })

    const initEndTime = performance.now()
    debugInfo.scriptInitTime = Math.round(initEndTime - initStartTime)
    addDebugLog(
      debugLogs.value,
      isDebugMode.value,
      'info',
      `脚本初始化完成，耗时 ${debugInfo.scriptInitTime}ms`,
    )
  })

  onUnmounted(() => {
    addDebugLog(
      debugLogs.value,
      isDebugMode.value,
      'info',
      '组件卸载，清理资源',
    )

    // 清理高亮
    if (highlightState.highlighter) {
      highlightState.highlighter.remove()
      addDebugLog(debugLogs.value, isDebugMode.value, 'info', '高亮已清理')
    }

    // 清理全局样式
    if (pageState.globalStyle) {
      pageState.globalStyle.remove()
      addDebugLog(debugLogs.value, isDebugMode.value, 'info', '全局样式已清理')
    }

    // 清理定时器
    if (panelHideTimeout.value) {
      clearTimeout(panelHideTimeout.value)
      addDebugLog(debugLogs.value, isDebugMode.value, 'info', '定时器已清理')
    }
  })

  // 返回所有状态和方法
  return {
    // 响应式状态
    ruleFormRef,
    dialogVisible,
    ruleList,
    highlightState,
    panelExpanded,
    panelPinned,
    panelHidden,
    panelHideTimeout,
    isDarkMode,
    isDebugMode,
    debugDialogVisible,
    activeDebugTab,
    debugLogs,
    debugInfo,
    pageState,
    form,

    // 计算属性
    matchedRuleList,
    matchedKeywords,
    dynamicColors,

    // 方法
    handlePanelHover,
    togglePanelPin,
    toggleDarkMode,
    handleClosePanel,
    loadGlobalStyle,
    updateHighlightStyle,
    handlePrevious,
    handleNext,
    handleEnableHighlight,
    handleClearHighlight,
    handleThemeChange,
    toggleDebugDialog,
    handleCloseDebug,
    clearDebugLogs,
    handlePreviewStyle,
    handleCopyJson,
    loadRuleList,
    handleOpenPanel,
    handleClose,
    handleUpdateConfig,
    highlightMatchedKeywords,
    refreshDebugInfo,
    exportDebugInfo,
  }
}
