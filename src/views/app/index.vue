<template>
  <!-- 右侧导航面板 -->
  <div
    v-if="matchedKeywords.length > 0 && !panelHidden"
    class="fixed top-1/2 right-0 -translate-y-1/2 z-[9999] text-sm shadow-2xl transition-all duration-300 ease-out min-h-[350px] overflow-hidden rounded-l-xl backdrop-blur-md"
    :class="
      cn(
        'highlight-nav-panel',
        { 'panel-expanded': panelExpanded, 'panel-pinned': panelPinned },
        panelExpanded || panelPinned ? 'w-[280px]' : 'w-[50px]',
        dynamicColors.borderColor,
        dynamicColors.textPrimary,
        isDarkMode ? 'dark' : '',
      )
    "
    @mouseenter="handlePanelHover(true)"
    @mouseleave="handlePanelHover(false)"
    :style="{
      background: dynamicColors.panelBg,
      boxShadow: isDarkMode
        ? '-6px 0 20px rgba(0, 0, 0, 0.6)'
        : '-6px 0 20px rgba(0, 0, 0, 0.15)',
    }"
  >
    <!-- 始终可见的触发区域 -->
    <div
      class="panel-trigger w-[50px] h-[140px] flex flex-col items-center justify-center cursor-pointer rounded-l-xl backdrop-blur-[10px] gap-1.5"
      :class="dynamicColors.triggerBg"
    >
      <!-- 夜间模式切换按钮 -->
      <div
        @click="toggleDarkMode"
        class="p-1.5 rounded-md transition-all duration-200 ease-in-out cursor-pointer hover:scale-110"
        :class="isDarkMode ? 'bg-yellow-500/30' : 'bg-slate-600/20'"
        :title="isDarkMode ? '切换到日间模式' : '切换到夜间模式'"
      >
        {{ isDarkMode ? '☀️' : '🌙' }}
      </div>

      <!-- 固定/取消固定按钮 -->
      <div
        @click="togglePanelPin"
        class="p-1.5 rounded-md transition-all duration-200 ease-in-out cursor-pointer hover:scale-110"
        :class="panelPinned ? 'bg-blue-500/30' : 'bg-white/10'"
        :title="panelPinned ? '取消固定' : '固定面板'"
      >
        {{ panelPinned ? '📌' : '📍' }}
      </div>

      <!-- 调试信息按钮 -->
      <div
        v-if="isDebugMode"
        @click="toggleDebugDialog"
        class="p-1.5 rounded-md bg-purple-500/20 transition-all duration-200 ease-in-out cursor-pointer hover:scale-110"
        title="调试信息"
      >
        🐛
      </div>

      <!-- 关闭按钮 -->
      <div
        @click="handleClosePanel"
        class="p-1.5 rounded-md bg-red-500/20 transition-all duration-200 ease-in-out cursor-pointer hover:scale-110"
        title="关闭面板（1小时）"
      >
        ✕
      </div>
    </div>

    <!-- 展开的面板内容 -->
    <div
      v-show="panelExpanded || panelPinned"
      class="panel-content absolute top-0 left-[50px] right-0 bottom-0 p-5 flex flex-col justify-center gap-4 rounded-bl-xl"
      :class="dynamicColors.contentBg"
    >
      <!-- 匹配信息 -->
      <div
        class="text-center mb-4 p-3 rounded-lg border"
        :class="[dynamicColors.infoBg, dynamicColors.borderColor]"
      >
        <div class="text-xs mb-2" :class="dynamicColors.textMuted">
          🔍 关键词导航
        </div>
        <div
          class="font-bold text-lg"
          :class="isDarkMode ? 'text-cyan-300' : 'text-blue-600'"
        >
          {{ highlightState.currentIndex + 1 }} /
          {{ highlightState.totalCount }}
        </div>
        <div class="text-xs mt-1" :class="dynamicColors.textMuted">
          共找到 {{ highlightState.totalCount }} 个匹配项
        </div>
      </div>

      <!-- 导航按钮 -->
      <el-space direction="vertical" class="w-full">
        <el-button
          @click="handlePrevious"
          :disabled="highlightState.totalCount === 0"
          size="default"
          :class="cn('w-[150px]', 'dark:!bg-gray-400')"
        >
          ⬆️ 上一个
        </el-button>
        <el-button
          @click="handleNext"
          :disabled="highlightState.totalCount === 0"
          size="default"
          :class="cn('w-[150px]', 'dark:!bg-gray-400')"
        >
          ⬇️ 下一个
        </el-button>
        <el-button
          @click="handleEnableHighlight"
          size="default"
          :class="cn('w-[150px]')"
          :style="{ background: dynamicColors.buttonSuccess }"
        >
          ✨ 启用高亮
        </el-button>
        <el-button
          @click="handleClearHighlight"
          size="default"
          :class="cn('w-[150px]')"
          :style="{ background: dynamicColors.buttonDanger }"
        >
          🗑️ 清除高亮
        </el-button>
      </el-space>
    </div>
  </div>

  <!-- 配置面板对话框 -->
  <el-dialog
    v-model="dialogVisible"
    title="高亮配置面板"
    width="40%"
    :before-close="handleClose"
    class="min-h-[500px]"
  >
    <el-form :model="form" ref="ruleFormRef" label-width="120px">
      <el-form-item
        label="高亮样式"
        prop="highlightStyle"
        :rules="[
          {
            required: true,
            whitespace: true,
            message: '请输入高亮样式',
            trigger: 'change',
          },
        ]"
      >
        <el-input
          v-model="form.highlightStyle"
          placeholder="例如: background: yellow; color: black;"
        />
      </el-form-item>

      <el-form-item label="当前选中样式">
        <el-input
          v-model="form.activeStyle"
          placeholder="例如: background: orange; color: white; outline: 2px solid #ff5722;"
        />
      </el-form-item>

      <el-form-item label="样式预设">
        <el-select
          v-model="form.selectedTheme"
          @change="handleThemeChange"
          placeholder="选择预设主题"
        >
          <el-option label="默认" value="default" />
          <el-option label="深色" value="dark" />
          <el-option label="现代" value="modern" />
          <el-option label="简约" value="minimal" />
        </el-select>
      </el-form-item>

      <el-form-item label="样式预览">
        <div class="p-2.5 border border-gray-300 rounded">
          <span>这是普通文本 </span>
          <span class="preview-highlight" :style="form.highlightStyle"
            >高亮文本</span
          >
          <span> 和 </span>
          <span class="preview-active" :style="form.activeStyle">当前选中</span>
          <span> 的效果预览</span>
        </div>
      </el-form-item>

      <el-form-item label="关键词配置">
        <el-input
          v-model="form.configJson"
          :placeholder="form.placeholder"
          type="textarea"
          :autosize="{ minRows: 6, maxRows: 12 }"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-row justify="end">
        <el-space>
          <el-button @click="handleCopyJson">复制配置</el-button>
          <el-button @click="handlePreviewStyle" type="info"
            >预览样式</el-button
          >
          <el-button @click="handleUpdateConfig" type="primary"
            >更新配置</el-button
          >
        </el-space>
      </el-row>
    </template>
  </el-dialog>

  <!-- 调试信息对话框 -->
  <el-dialog
    v-model="debugDialogVisible"
    title="🐛 油猴脚本调试信息"
    width="60%"
    :before-close="handleCloseDebug"
    class="min-h-[600px]"
  >
    <el-tabs v-model="activeDebugTab" type="border-card">
      <!-- 基本信息 -->
      <el-tab-pane label="📊 基本信息" name="basic">
        <div class="debug-section">
          <h4>🌐 页面信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="当前URL">{{ debugInfo.currentUrl }}</el-descriptions-item>
            <el-descriptions-item label="页面标题">{{ debugInfo.pageTitle }}</el-descriptions-item>
            <el-descriptions-item label="用户代理">{{ debugInfo.userAgent }}</el-descriptions-item>
            <el-descriptions-item label="脚本版本">{{ debugInfo.scriptVersion }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="debug-section">
          <h4>⚙️ 脚本状态</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="调试模式">{{ isDebugMode ? '✅ 开启' : '❌ 关闭' }}</el-descriptions-item>
            <el-descriptions-item label="面板状态">{{ panelPinned ? '📌 固定' : '📍 浮动' }}</el-descriptions-item>
            <el-descriptions-item label="夜间模式">{{ isDarkMode ? '🌙 开启' : '☀️ 关闭' }}</el-descriptions-item>
            <el-descriptions-item label="高亮器状态">{{ highlightState.highlighter ? '✅ 已初始化' : '❌ 未初始化' }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="debug-section">
          <h4>🎯 高亮状态</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="匹配项总数">{{ highlightState.totalCount }}</el-descriptions-item>
            <el-descriptions-item label="当前索引">{{ highlightState.currentIndex + 1 }}</el-descriptions-item>
            <el-descriptions-item label="关键词数量">{{ highlightState.keywords.length }}</el-descriptions-item>
            <el-descriptions-item label="全局样式">{{ pageState.globalStyle ? '✅ 已加载' : '❌ 未加载' }}</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-tab-pane>

      <!-- 配置信息 -->
      <el-tab-pane label="⚙️ 配置信息" name="config">
        <div class="debug-section">
          <h4>📋 规则列表 ({{ ruleList.length }} 条)</h4>
          <el-table :data="ruleList" border style="width: 100%" max-height="300">
            <el-table-column prop="matchUrl" label="匹配URL" width="200" />
            <el-table-column prop="keywords" label="关键词" >
              <template #default="scope">
                <el-tag v-for="keyword in scope.row.keywords" :key="keyword" size="small" class="mr-1">
                  {{ keyword }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="debug-section">
          <h4>✅ 匹配的规则 ({{ matchedRuleList.length }} 条)</h4>
          <el-table :data="matchedRuleList" border style="width: 100%" max-height="200">
            <el-table-column prop="matchUrl" label="匹配URL" width="200" />
            <el-table-column prop="keywords" label="关键词">
              <template #default="scope">
                <el-tag v-for="keyword in scope.row.keywords" :key="keyword" size="small" type="success" class="mr-1">
                  {{ keyword }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="debug-section">
          <h4>🔑 当前关键词 ({{ matchedKeywords.length }} 个)</h4>
          <div class="keywords-display">
            <el-tag v-for="keyword in matchedKeywords" :key="keyword" size="small" type="primary" class="mr-1 mb-1">
              {{ keyword }}
            </el-tag>
          </div>
        </div>
      </el-tab-pane>

      <!-- 性能信息 -->
      <el-tab-pane label="📈 性能信息" name="performance">
        <div class="debug-section">
          <h4>⏱️ 性能指标</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="页面加载时间">{{ debugInfo.pageLoadTime }}ms</el-descriptions-item>
            <el-descriptions-item label="脚本初始化时间">{{ debugInfo.scriptInitTime }}ms</el-descriptions-item>
            <el-descriptions-item label="高亮处理时间">{{ debugInfo.highlightTime }}ms</el-descriptions-item>
            <el-descriptions-item label="内存使用">{{ debugInfo.memoryUsage }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="debug-section">
          <h4>🔧 DOM 信息</h4>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="文档元素总数">{{ debugInfo.domElementCount }}</el-descriptions-item>
            <el-descriptions-item label="文本节点数">{{ debugInfo.textNodeCount }}</el-descriptions-item>
            <el-descriptions-item label="高亮元素数">{{ debugInfo.highlightElementCount }}</el-descriptions-item>
            <el-descriptions-item label="页面高度">{{ debugInfo.pageHeight }}px</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-tab-pane>

      <!-- 控制台日志 -->
      <el-tab-pane label="📝 控制台日志" name="logs">
        <div class="debug-section">
          <div class="flex justify-between items-center mb-3">
            <h4>📝 调试日志</h4>
            <el-space>
              <el-button size="small" @click="clearDebugLogs">清空日志</el-button>
              <el-button size="small" @click="exportDebugInfo">导出调试信息</el-button>
            </el-space>
          </div>
          <div class="logs-container">
            <div v-for="(log, index) in debugLogs" :key="index" class="log-item" :class="`log-${log.level}`">
              <span class="log-time">{{ log.timestamp }}</span>
              <span class="log-level">{{ log.level.toUpperCase() }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <el-row justify="end">
        <el-space>
          <el-button @click="refreshDebugInfo">🔄 刷新信息</el-button>
          <el-button @click="handleCloseDebug">关闭</el-button>
        </el-space>
      </el-row>
    </template>
  </el-dialog>
</template>

<script lang="ts" name="app" setup>
import {
  GM_getValue,
  GM_registerMenuCommand,
  GM_setClipboard,
  GM_setValue,
} from '$'
import {
  computed,
  effect,
  onMounted,
  onUnmounted,
  reactive,
  readonly,
  ref,
} from 'vue'
import { ElMessage, FormInstance } from 'element-plus'

import {
  cleanKeywords,
  closeHighlight,
  highlightKeywords,
  initHighlighter,
  getHighlighter,
} from '../../util/tools'
import { Highlighter, cn } from '@mudssky/jsutils'

// 调试日志类型定义
interface DebugLog {
  timestamp: string
  level: 'info' | 'warn' | 'error'
  message: string
}

interface RuleItem {
  keywords: string[]
  matchUrl: string
}
const configName = 'hightlight-config'

const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const ruleList = ref<RuleItem[]>([])

// 高亮状态管理
const highlightState = reactive({
  totalCount: 0,
  currentIndex: -1,
  highlighter: null as Highlighter | null,
  keywords: [] as string[],
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
const debugInfo = ref({
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
  pageHeight: 0
})

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

// 样式预设
const themePresets = {
  default: {
    highlight: 'background: yellow; color: black;',
    active: 'background: orange; color: white; outline: 2px solid #ff5722;',
  },
  dark: {
    highlight: 'background: #333; color: #fff; border: 1px solid #666;',
    active: 'background: #555; color: #fff; outline: 2px solid #00bcd4;',
  },
  modern: {
    highlight:
      'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 3px; padding: 1px 3px;',
    active:
      'background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; border-radius: 3px; padding: 1px 3px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);',
  },
  minimal: {
    highlight:
      'background: #e3f2fd; color: #1976d2; border-bottom: 2px solid #2196f3;',
    active:
      'background: #ffecb3; color: #f57c00; border-bottom: 2px solid #ff9800; font-weight: bold;',
  },
}

// 动态配色方案（基于夜间模式）
const dynamicColors = computed(() => {
  if (isDarkMode.value) {
    return {
      panelBg:
        'linear-gradient(135deg, rgba(15, 23, 42, 0.95), rgba(30, 41, 59, 0.98))',
      triggerBg: 'bg-slate-700/30',
      contentBg: 'bg-slate-800/20',
      infoBg: 'bg-slate-700/30',
      borderColor: 'border-slate-600/30',
      textPrimary: 'text-slate-100',
      textSecondary: 'text-slate-300',
      textMuted: 'text-slate-400',
      buttonPrimary: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
      buttonSecondary: 'linear-gradient(135deg, #6366f1, #4338ca)',
      buttonDanger: 'linear-gradient(135deg, #ef4444, #dc2626)',
      buttonSuccess: 'linear-gradient(135deg, #10b981, #059669)',
    }
  } else {
    return {
      panelBg:
        'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(248, 250, 252, 0.98))',
      triggerBg: 'bg-white/40',
      contentBg: 'bg-white/20',
      infoBg: 'bg-blue-50/50',
      borderColor: 'border-gray-200/50',
      textPrimary: 'text-gray-800',
      textSecondary: 'text-gray-600',
      textMuted: 'text-gray-500',
      buttonPrimary: 'linear-gradient(135deg, #3b82f6, #2563eb)',
      buttonSecondary: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      buttonDanger: 'linear-gradient(135deg, #f59e0b, #d97706)',
      buttonSuccess: 'linear-gradient(135deg, #10b981, #059669)',
    }
  }
})

const pageState = reactive<{
  globalStyle?: HTMLStyleElement
}>({
  globalStyle: undefined,
})
const form = reactive({
  configJson: '',
  defaultHightlightStyle: 'background:gold;color:black;',
  highlightStyle: 'background:gold;color:black;',
  activeStyle: 'background: orange; color: white; outline: 2px solid #ff5722;',
  selectedTheme: 'default',
  placeholder: `//示例：
	[
        {
            "keywords": ["成年コミック"],
            "matchUrl": "sukebei.nyaa.si",
        },
    ]
	
	`,
})
const matchedRuleList = computed(() => {
  // console.log({ ruleList: JSON.parse(form.configJson) })
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

/**
 * 生成高亮的伪元素
 * @param styleText
 * @param customHighlightname
 */
// function generateHighlightStyle(styleText: string, customHighlightname = 'highlight-keywords') {
// 	return `::highlight(${customHighlightname}){${styleText}}`
// }

/**
 * 通过 CSS 类选择器实现高亮（适配 Highlighter 类）
 */
function generateHighlightStyle(styleText: string) {
  return `.highlight-keywords{${styleText}}`
}
/**
 * 组件挂载时，加载高亮的style标签
 */
function loadGlobalStyle() {
  let style = document.createElement('style')
  style.textContent = generateHighlightStyle(form.defaultHightlightStyle)
  document.head.appendChild(style)
  pageState.globalStyle = style
}

/**
 * 更新高亮的style标签的高亮样式
 * @param styleText
 */
function updateHighlightStyle(styleText: string) {
  if (pageState.globalStyle) {
    pageState.globalStyle.textContent = generateHighlightStyle(styleText)
  }
}

// 导航功能方法
const handlePrevious = () => {
  if (highlightState.totalCount === 0) {
    addDebugLog('warn', '没有高亮项，无法导航到上一个')
    return
  }

  const highlighter = getHighlighter()
  highlighter.previous()

  highlightState.currentIndex = highlighter.getCurrentIndex()
  addDebugLog('info', `导航到上一个高亮项，当前索引: ${highlightState.currentIndex + 1}/${highlightState.totalCount}`)
}

const handleNext = () => {
  if (highlightState.totalCount === 0) {
    addDebugLog('warn', '没有高亮项，无法导航到下一个')
    return
  }

  const highlighter = getHighlighter()
  highlighter.next()

  highlightState.currentIndex = highlighter.getCurrentIndex()
  addDebugLog('info', `导航到下一个高亮项，当前索引: ${highlightState.currentIndex + 1}/${highlightState.totalCount}`)
}

const handleEnableHighlight = async () => {
  if (matchedKeywords.value.length === 0) {
    ElMessage.warning('当前页面没有匹配的关键词规则')
    return
  }

  try {
    // 确保全局样式已加载
    if (!pageState.globalStyle) {
      loadGlobalStyle()
    }

    // 初始化高亮器（如果还没有初始化）
    if (!highlightState.highlighter) {
      initHighlighter(document.body)
    }

    await highlightMatchedKeywords()
    ElMessage.success(`已启用高亮，找到 ${highlightState.totalCount} 个匹配项`)
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
  
  addDebugLog('info', '已清除所有高亮')
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
    refreshDebugInfo()
  }
}

const handleCloseDebug = () => {
  debugDialogVisible.value = false
}

const addDebugLog = (level: 'info' | 'warn' | 'error', message: string) => {
  if (!isDebugMode.value) return
  
  const timestamp = new Date().toLocaleTimeString()
  debugLogs.value.unshift({
    timestamp,
    level,
    message
  })
  
  // 限制日志数量，保留最新的100条
  if (debugLogs.value.length > 100) {
    debugLogs.value = debugLogs.value.slice(0, 100)
  }
  
  // 同时输出到浏览器控制台
  const consoleMethods = {
    info: console.info,
    warn: console.warn,
    error: console.error
  }
  consoleMethods[level](`[HighlightKeywords] ${message}`)
}

const clearDebugLogs = () => {
  debugLogs.value = []
  ElMessage.success('调试日志已清空')
}

const refreshDebugInfo = () => {
  const startTime = performance.now()
  
  // 基本页面信息
  debugInfo.value.currentUrl = window.location.href
  debugInfo.value.pageTitle = document.title
  debugInfo.value.userAgent = navigator.userAgent
  debugInfo.value.scriptVersion = (window as any).GM_info?.script?.version || '未知'
  
  // 性能信息
  debugInfo.value.pageLoadTime = Math.round(performance.timing?.loadEventEnd - performance.timing?.navigationStart) || 0
  debugInfo.value.scriptInitTime = Math.round(performance.now())
  
  // DOM 信息
  debugInfo.value.domElementCount = document.querySelectorAll('*').length
  debugInfo.value.textNodeCount = getTextNodeCount(document.body)
  debugInfo.value.highlightElementCount = document.querySelectorAll('[data-highlight-keyword]').length
  debugInfo.value.pageHeight = Math.max(
    document.body.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.clientHeight,
    document.documentElement.scrollHeight,
    document.documentElement.offsetHeight
  )
  
  // 内存使用（如果支持）
  if ('memory' in performance) {
    const memory = (performance as any).memory
    debugInfo.value.memoryUsage = `${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB / ${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`
  } else {
    debugInfo.value.memoryUsage = '不支持'
  }
  
  const endTime = performance.now()
  addDebugLog('info', `调试信息刷新完成，耗时 ${Math.round(endTime - startTime)}ms`)
}

const getTextNodeCount = (element: Element): number => {
  let count = 0
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
    null
  )
  
  while (walker.nextNode()) {
    count++
  }
  
  return count
}

const exportDebugInfo = () => {
  const exportData = {
    timestamp: new Date().toISOString(),
    debugInfo: debugInfo.value,
    highlightState: {
      totalCount: highlightState.totalCount,
      currentIndex: highlightState.currentIndex,
      keywords: highlightState.keywords
    },
    ruleList: ruleList.value,
    matchedRuleList: matchedRuleList.value,
    logs: debugLogs.value
  }
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `highlight-keywords-debug-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  ElMessage.success('调试信息已导出')
  addDebugLog('info', '调试信息已导出到文件')
}

// 预览样式
const handlePreviewStyle = () => {
  const previewHighlight = document.querySelector(
    '.preview-highlight',
  ) as HTMLElement
  const previewActive = document.querySelector('.preview-active') as HTMLElement

  if (previewHighlight) {
    previewHighlight.style.cssText = form.highlightStyle
  }
  if (previewActive) {
    previewActive.style.cssText = form.activeStyle
  }

  ElMessage.success('样式预览已更新')
}

const handleCopyJson = () => {
  navigator.clipboard.writeText(form.configJson)
  ElMessage.success('复制成功')
}

function loadRuleList() {
  // const vv: any = []
  const vv = GM_getValue(configName, [])
  // console.log({ vv })
  ruleList.value = vv
  form.configJson = JSON.stringify(ruleList.value)
}
function handleOpenPanel() {
  dialogVisible.value = true
}

function handleClose() {
  dialogVisible.value = false
}
/**
 * ajv库打包体积太大了,改用手动校验了
 * @param configList
 */
function validateConfig(configList: RuleItem[]): [boolean, string] {
  const res: [boolean, string] = [false, '配置项格式不对']
  if (!Array.isArray(configList)) {
    return res
  }
  if (
    configList.some((item) => {
      return typeof item !== 'object'
    })
  ) {
    return res
  }
  // 校验关键词
  for (const property of ['keywords', 'matchUrl'] as const) {
    if (
      configList.some((item) => {
        return !(item?.[property] ?? false)
      })
    ) {
      // 存在不满足的属性

      res[1] = `${property} 属性是必须的`
      return res
    }
  }

  for (const item of configList) {
    if (typeof item.matchUrl !== 'string') {
      res[1] = 'matchUrl类型错误'
      return res
    }
    if (!Array.isArray(item.keywords)) {
      res[1] = 'keywords类型错误'
      return res
    }
    for (const keyword of item.keywords) {
      if (typeof keyword !== 'string') {
        res[1] = 'keywords类型错误'
        return res
      }
      if (keyword.trim() === '') {
        console.log('空字符串')

        res[1] = 'keywords不能为空'
        return res
      }
    }
  }
  // 避免空字符串
  return [true, res[1]]
}

const handleUpdateConfig = async () => {
  try {
    const config = JSON.parse(form.configJson)

    // 更新高亮配置
    if (config.keywords && Array.isArray(config.keywords)) {
      highlightState.keywords = config.keywords

      // 使用getHighlighter获取单例实例
      const highlighter = getHighlighter()
      highlightState.highlighter = highlighter

      // 清除之前的高亮
      highlighter.remove()

      // 应用高亮
      const count = await highlighter.apply(config.keywords, {
        caseSensitive: config.caseSensitive || false,
        wholeWord: false,
      })

      highlightState.totalCount = count
      highlightState.currentIndex = highlightState.totalCount > 0 ? 0 : -1

      // 更新样式
      if (config.style) form.highlightStyle = config.style
      if (config.activeStyle) form.activeStyle = config.activeStyle

      ElMessage.success(
        `配置更新成功，找到 ${highlightState.totalCount} 个匹配项`,
      )
    } else {
      ElMessage.warning('配置中未找到有效的关键词数组')
    }

    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('配置格式错误，请检查JSON格式')
  }
}

async function highlightMatchedKeywords() {
  const startTime = performance.now()
  
  console.log({ matchedKeywords: matchedKeywords.value })
  addDebugLog('info', `开始高亮匹配的关键词: ${matchedKeywords.value.join(', ')}`)
  
  if (matchedKeywords.value.length < 1) {
    addDebugLog('info', '没有匹配的关键词')
    return
  }

  try {
    // 使用getHighlighter获取单例实例
    const highlighter = getHighlighter()
    highlightState.highlighter = highlighter
    addDebugLog('info', '高亮器实例获取成功')

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
    debugInfo.value.highlightTime = Math.round(endTime - startTime)
    
    const message = `成功高亮 ${count} 个匹配项，耗时 ${debugInfo.value.highlightTime}ms`
    console.log(message)
    addDebugLog('info', message)
  } catch (error) {
    const errorMessage = `高亮关键词时出错: ${error instanceof Error ? error.message : String(error)}`
    console.error(errorMessage, error)
    addDebugLog('error', errorMessage)
  }
}

onMounted(async () => {
  const initStartTime = performance.now()
  
  // 初始化调试模式（开发环境或手动开启）
  const defaultDebugMode = import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE === 'true'
  isDebugMode.value = GM_getValue('debugMode', defaultDebugMode)
  GM_setValue('debugMode', isDebugMode.value)
  
  addDebugLog('info', '脚本开始初始化')
  
  console.log('init')

  // 挂载时从本地读取配置
  loadRuleList()
  addDebugLog('info', `规则列表加载完成，共 ${ruleList.value.length} 条规则`)

  // 恢复面板固定状态
  if (panelPinned.value) {
    panelExpanded.value = true
  }
  addDebugLog('info', `面板固定状态: ${panelPinned.value ? '固定' : '浮动'}`)

  console.log({ matchedKeywords: matchedKeywords.value })
  // 如果没有匹配到规则列表，不需要加载全局样式
  if (matchedKeywords.value.length > 0) {
    loadGlobalStyle()
    // 初始化高亮器
    initHighlighter(document.body)
    addDebugLog('info', '高亮器初始化完成')
    await highlightMatchedKeywords()
  }

  GM_registerMenuCommand('打开配置面板', handleOpenPanel)
  
  GM_registerMenuCommand('切换调试模式', () => {
    isDebugMode.value = !isDebugMode.value
    GM_setValue('debugMode', isDebugMode.value)
    ElMessage.success(`调试模式已${isDebugMode.value ? '开启' : '关闭'}`)
    addDebugLog('info', `调试模式已${isDebugMode.value ? '开启' : '关闭'}`)
  })
  
  const initEndTime = performance.now()
  debugInfo.value.scriptInitTime = Math.round(initEndTime - initStartTime)
  addDebugLog('info', `脚本初始化完成，耗时 ${debugInfo.value.scriptInitTime}ms`)
})

onUnmounted(() => {
  // 清理高亮
  if (highlightState.highlighter) {
    highlightState.highlighter.remove()
  }

  // 清理全局样式
  if (pageState.globalStyle) {
    pageState.globalStyle.remove()
  }

  // 清理定时器
  if (panelHideTimeout.value) {
    clearTimeout(panelHideTimeout.value)
  }
})
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}

/* 调试面板样式 */
.debug-section {
  margin-bottom: 20px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.debug-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
}

.logs-container {
  max-height: 400px;
  overflow-y: auto;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  padding: 10px;
}

.log-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  margin-bottom: 2px;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
}

.log-time {
  color: #6c757d;
  margin-right: 8px;
  min-width: 80px;
}

.log-level {
  margin-right: 8px;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
  min-width: 50px;
  text-align: center;
}

.log-message {
  flex: 1;
}

.log-info {
  background-color: #d1ecf1;
  border-left: 3px solid #17a2b8;
}

.log-info .log-level {
  background-color: #17a2b8;
  color: white;
}

.log-warn {
  background-color: #fff3cd;
  border-left: 3px solid #ffc107;
}

.log-warn .log-level {
  background-color: #ffc107;
  color: #212529;
}

.log-error {
  background-color: #f8d7da;
  border-left: 3px solid #dc3545;
}

.log-error .log-level {
  background-color: #dc3545;
  color: white;
}

.keywords-display {
  max-height: 200px;
  overflow-y: auto;
  padding: 10px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}
</style>
