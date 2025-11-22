<template>
	<el-config-provider :locale="zhCn" :zIndex="config.zIndex">
		<app />
	</el-config-provider>
</template>

<script lang="ts" setup >
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import { reactive } from 'vue';
import app from './views/app/index.vue'
// 改成cdn导入了
import 'element-plus/dist/index.css'
const config = reactive({
	zIndex: 100
})
</script>