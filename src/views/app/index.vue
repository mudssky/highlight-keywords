<template>
	<el-dialog v-model="dialogVisible" title="配置面板" width="30%" :before-close="handleClose" class="min-h-[400px]">
		<el-form :model="form">
			<el-form-item label="高亮样式">
				<el-input v-model="form.highlightStyle" />
			</el-form-item>
			<el-form-item label="配置">
				<el-input v-model="form.configJson" :placeholder="form.placeholder" type="textarea" autosize />
			</el-form-item>
		</el-form>
		<el-row justify="end">
			<el-space>
				<el-button @click="handleCopyJson">复制json</el-button>
				<el-button @click="handleUpdateConfig" type="primary">更新配置</el-button>
			</el-space>
		</el-row>
	</el-dialog>
</template>

<script lang="ts" name="app" setup>
import { GM_getValue, GM_registerMenuCommand, GM_setClipboard, GM_setValue } from '$';
import { computed, onMounted, reactive, ref } from 'vue'
import Ajv from 'ajv'
import { ElMessage } from 'element-plus'
import { cleanKeywords, highlightKeyword } from '../../util/tools';

interface RuleItem {
	keywords: string[]
	matchUrl: string
}


const configName = 'hightlight-config'
// 校验json的schema
const schema = {
	type: "array",
	items: {
		type: "object",
		properties: {
			keywords: { type: "array" },
			matchUrl: { type: "string" }
		},
		required: ["keywords", "matchUrl"],
		additionalProperties: false
	}
}

const dialogVisible = ref(false)
const ruleList = ref<RuleItem[]>([])

const pageState = reactive<{
	globalStyle?: HTMLStyleElement
}>({
	globalStyle: undefined
})
const form = reactive({
	configJson: "",
	defaultHightlightStyle: 'background:gold;color:black;',
	highlightStyle: 'background:gold;color:black;',
	placeholder: `//示例：
	[
        {
            "keywords": ["成年コミック"],
            "matchUrl": "sukebei.nyaa.si",
        },
    ]
	
	`
})
const matchedRuleList = computed(() => {
	console.log({ 'fil': ruleList.value })
	return ruleList.value.filter((rule: RuleItem) => {
		var urlPattern = new RegExp(rule.matchUrl);
		return urlPattern.test(window.location.href)
	})
})


const matchedKeywords = computed(() => {
	const keywordsLists = matchedRuleList.value.map((item) => {
		return item.keywords
	})
	// 展开然后去重
	return [...new Set(keywordsLists.flat())];
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
	document.head.appendChild(style);
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
	GM_setClipboard(form.configJson, "text")
}

function loadRuleList() {
	// const vv: any = []
	const vv = GM_getValue(configName, [])
	ruleList.value = vv
	console.log(vv)
	form.configJson = JSON.stringify(ruleList.value)
}
function handleOpenPanel() {
	dialogVisible.value = true
}

function handleClose() {
	dialogVisible.value = false
}
function handleUpdateConfig() {
	const ajv = new Ajv()
	const validate = ajv.compile(schema)
	let list: RuleItem[]

	try {
		list = JSON.parse(form.configJson)
		console.log({ list })
	} catch (error) {
		ElMessage({
			type: 'warning',
			message: 'json解析错误'
		})
		return
	}

	const valid = validate(list)
	console.log({ valid });
	if (!valid) {
		ElMessage({
			type: 'warning',
			message: 'json校验失败:' + validate.errors?.[0].message
		})
		console.error(validate.errors)
		return
	}
	ruleList.value = list
	updateHighlightStyle(form.highlightStyle)
	GM_setValue(configName, list)
	// setLocalStorageJSON(configName, form.configJson)
	handleClose()

}
function highlightMatchedKeywords() {
	// console.log({ matchedKeywords });
	if (matchedKeywords.value.length < 1) {
		return
	}
	const [pattern, _] = cleanKeywords(matchedKeywords.value)
	highlightKeyword(document.body, pattern)
}




onMounted(() => {

	// 挂载时从本地读取配置
	loadRuleList()
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
