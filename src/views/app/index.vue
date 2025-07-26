<template>
  <el-dialog
    v-model="dialogVisible"
    title="配置面板"
    width="30%"
    :before-close="handleClose"
    class="min-h-[400px]"
  >
    <el-form :model="form" ref="ruleFormRef">
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
        <el-input v-model="form.highlightStyle" />
      </el-form-item>
      <el-form-item label="配置">
        <el-input
          v-model="form.configJson"
          :placeholder="form.placeholder"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 10 }"
        />
      </el-form-item>
    </el-form>
    <el-row justify="end">
      <el-space>
        <el-button @click="handleCopyJson">复制json</el-button>
        <el-button @click="handleUpdateConfig" type="primary"
          >更新配置</el-button
        >
      </el-space>
    </el-row>
  </el-dialog>
</template>

<script lang="ts" name="app" setup>
import {
  GM_getValue,
  GM_registerMenuCommand,
  GM_setClipboard,
  GM_setValue,
} from '$'
import { computed, onMounted, reactive, readonly, ref } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import {
  cleanKeywords,
  closeHighlight,
  highlightKeyword,
} from '../../util/tools'

interface RuleItem {
  keywords: string[]
  matchUrl: string
}
const configName = 'hightlight-config'

const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const ruleList = ref<RuleItem[]>([])

const pageState = reactive<{
  globalStyle?: HTMLStyleElement
}>({
  globalStyle: undefined,
})
const form = reactive({
  configJson: '',
  defaultHightlightStyle: 'background:gold;color:black;',
  highlightStyle: 'background:gold;color:black;',
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
 * 通过属性选择器实现高亮
 */
function generateHighlightStyle(styleText: string) {
  return `[data-highlight="yes"]{${styleText}}`
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

function handleCopyJson() {
  GM_setClipboard(form.configJson, 'text')
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

async function handleUpdateConfig() {
  await ruleFormRef.value?.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
  let list: RuleItem[]

  try {
    list = JSON.parse(form.configJson)
    // console.log({ list })
  } catch (error) {
    ElMessage({
      type: 'warning',
      message: 'json解析错误',
    })
    return
  }
  const [valid, errorMessage] = validateConfig(list)
  if (!valid) {
    ElMessage({
      type: 'warning',
      message: errorMessage,
    })
    return
  }
  ruleList.value = list
  updateHighlightStyle(form.highlightStyle)
  GM_setValue(configName, list)
  highlightMatchedKeywords()
  ElMessage({
    type: 'success',
    message: '配置更新成功',
  })
  handleClose()
}

function highlightMatchedKeywords() {
  console.log({ matchedKeywords: matchedKeywords.value })
  if (matchedKeywords.value.length < 1) {
    return
  }

  const [pattern, _] = cleanKeywords(matchedKeywords.value)
  closeHighlight(document.body, pattern)
  highlightKeyword(document.body, pattern)
}

onMounted(() => {
  console.log('init')

  // 挂载时从本地读取配置
  loadRuleList()
  console.log({ matchedKeywords: matchedKeywords.value })
  // 如果没有匹配到规则列表，不需要加载全局样式
  if (matchedKeywords.value.length > 0) {
    loadGlobalStyle()
    highlightMatchedKeywords()
  }
  GM_registerMenuCommand('打开配置面板', handleOpenPanel)
})
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
