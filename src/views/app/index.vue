<template>
  <!-- 右侧导航面板 -->
  <div
    v-if="matchedKeywords.length > 0 && !panelHidden"
    class="fixed top-1/2 right-0 -translate-y-1/2 z-[9999] text-white text-sm shadow-2xl transition-all duration-300 ease-out min-h-[300px] overflow-hidden border border-white/10 rounded-l-xl"
    :class="[
      'highlight-nav-panel',
      { 'panel-expanded': panelExpanded, 'panel-pinned': panelPinned },
      panelExpanded || panelPinned ? 'w-[260px]' : 'w-[50px]',
    ]"
    @mouseenter="handlePanelHover(true)"
    @mouseleave="handlePanelHover(false)"
    style="
      background: linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.9),
        rgba(30, 30, 30, 0.95)
      );
      box-shadow: -6px 0 20px rgba(0, 0, 0, 0.4);
    "
  >
    <!-- 始终可见的触发区域 -->
    <div
      class="panel-trigger w-[50px] h-[120px] flex flex-col items-center justify-center cursor-pointer bg-white/15 rounded-l-xl backdrop-blur-[10px] gap-2"
    >
      <!-- 固定/取消固定按钮 -->
      <div
        @click="togglePanelPin"
        class="p-1.5 rounded-md transition-all duration-200 ease-in-out cursor-pointer"
        :class="panelPinned ? 'bg-blue-500/30' : 'bg-white/10'"
        :title="panelPinned ? '取消固定' : '固定面板'"
      >
        {{ panelPinned ? '📌' : '📍' }}
      </div>

      <!-- 关闭按钮 -->
      <div
        @click="handleClosePanel"
        class="p-1.5 rounded-md bg-red-500/20 transition-all duration-200 ease-in-out cursor-pointer"
        title="关闭面板（1小时）"
      >
        ✕
      </div>
    </div>

    <!-- 展开的面板内容 -->
    <div
      v-show="panelExpanded || panelPinned"
      class="panel-content absolute top-0 left-[50px] right-0 bottom-0 p-5 flex flex-col justify-center gap-4 bg-white/5 rounded-bl-xl"
    >
      <!-- 匹配信息 -->
      <div
        class="text-center mb-4 p-3 bg-white/10 rounded-lg border border-white/20"
      >
        <div class="text-xs opacity-90 mb-2 text-gray-300">🔍 关键词导航</div>
        <div class="font-bold text-lg text-cyan-300">
          {{ highlightState.currentIndex + 1 }} /
          {{ highlightState.totalCount }}
        </div>
        <div class="text-xs opacity-70 mt-1">
          共找到 {{ highlightState.totalCount }} 个匹配项
        </div>
      </div>

      <!-- 导航按钮 -->
      <div class="flex flex-col gap-2.5 justify-center items-center">
        <el-button
          @click="handlePrevious"
          :disabled="highlightState.totalCount === 0"
          size="default"
          class="w-full h-10 rounded-lg border-none text-white font-medium transition-all duration-300 ease-in-out"
          style="background: linear-gradient(135deg, #667eea, #764ba2)"
        >
          ⬆️ 上一个
        </el-button>
        <el-button
          @click="handleNext"
          :disabled="highlightState.totalCount === 0"
          size="default"
          class="w-full h-10 rounded-lg border-none text-white font-medium transition-all duration-300 ease-in-out"
          style="background: linear-gradient(135deg, #667eea, #764ba2)"
        >
          ⬇️ 下一个
        </el-button>
        <el-button
          @click="handleClearHighlight"
          size="default"
          class="w-full h-10 rounded-lg border-none text-white font-medium transition-all duration-300 ease-in-out"
          style="background: linear-gradient(135deg, #ff6b6b, #ee5a24)"
        >
          🗑️ 清除高亮
        </el-button>
      </div>
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
</template>

<script lang="ts" name="app" setup>
import {
  GM_getValue,
  GM_registerMenuCommand,
  GM_setClipboard,
  GM_setValue,
} from '$'
import { computed, onMounted, onUnmounted, reactive, readonly, ref } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'

import {
  cleanKeywords,
  closeHighlight,
  highlightKeywords,
  initHighlighter,
  getHighlighter,
} from '../../util/tools'
import { Highlighter } from '@mudssky/jsutils'

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
const panelPinned = ref(false)
const panelHidden = ref(false)
const panelHideTimeout = ref<number | null>(null)

// 面板交互处理
const handlePanelHover = (isHover: boolean) => {
  if (!panelPinned.value && !panelHidden.value) {
    panelExpanded.value = isHover
  }
}

const togglePanelPin = () => {
  panelPinned.value = !panelPinned.value
  if (panelPinned.value) {
    panelExpanded.value = true
  } else {
    panelExpanded.value = false
  }
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
  if (highlightState.totalCount === 0) return

  const highlighter = getHighlighter()
  highlighter.previous()

  highlightState.currentIndex = highlighter.getCurrentIndex()
}

const handleNext = () => {
  if (highlightState.totalCount === 0) return

  const highlighter = getHighlighter()
  highlighter.next()

  highlightState.currentIndex = highlighter.getCurrentIndex()
}

const handleClearHighlight = () => {
  const highlighter = getHighlighter()
  highlighter.remove()

  highlightState.totalCount = 0
  highlightState.currentIndex = -1
  highlightState.keywords = []
}

// 主题切换处理
const handleThemeChange = (theme: string) => {
  if (themePresets[theme as keyof typeof themePresets]) {
    const preset = themePresets[theme as keyof typeof themePresets]
    form.highlightStyle = preset.highlight
    form.activeStyle = preset.active
  }
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
  console.log({ matchedKeywords: matchedKeywords.value })
  if (matchedKeywords.value.length < 1) {
    return
  }

  try {
    // 使用getHighlighter获取单例实例
    const highlighter = getHighlighter()
    highlightState.highlighter = highlighter

    // 应用高亮
    const count = await highlighter.apply(matchedKeywords.value, {
      caseSensitive: false,
      wholeWord: false,
    })

    // 更新状态
    highlightState.totalCount = count
    highlightState.currentIndex = count > 0 ? 0 : -1
    highlightState.keywords = matchedKeywords.value

    console.log(`成功高亮 ${count} 个匹配项`)
  } catch (error) {
    console.error('高亮关键词时出错:', error)
  }
}

onMounted(async () => {
  console.log('init')

  // 挂载时从本地读取配置
  loadRuleList()
  console.log({ matchedKeywords: matchedKeywords.value })
  // 如果没有匹配到规则列表，不需要加载全局样式
  if (matchedKeywords.value.length > 0) {
    loadGlobalStyle()
    // 初始化高亮器
    initHighlighter(document.body)
    await highlightMatchedKeywords()
  }

  GM_registerMenuCommand('打开配置面板', handleOpenPanel)
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
</style>
