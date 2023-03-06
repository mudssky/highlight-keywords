<template>
	<el-config-provider :locale="zhCn">
		<app />
	</el-config-provider>
</template>

<script lang="ts" setup >
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import app from './views/app/index.vue'

</script>