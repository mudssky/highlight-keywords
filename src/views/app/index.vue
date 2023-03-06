<template>
	<el-dialog v-model="dialogVisible" title="配置面板" width="30%" :before-close="handleClose" class="h-[400px]">
		<el-form :model="form">
			<el-form-item label="配置">
				<el-input v-model="form.configJson" :placeholder="form.placeholder" type="textarea" />
			</el-form-item>
		</el-form>

	</el-dialog>
</template>

<script lang="ts" name="app" setup>
import { GM_registerMenuCommand } from '$';
import { onMounted, reactive, ref } from 'vue'

const dialogVisible = ref(true)
const form = reactive({
	configJson: "",
	placeholder: "请输入配置"
})

function handleOpenPanel() {
	dialogVisible.value = true
}

function handleClose() {
	dialogVisible.value = false
}
// const handleClose = (done: () => void) => {
// 	ElMessageBox.confirm('Are you sure to close this dialog?')
// 		.then(() => {
// 			done()
// 		})
// 		.catch(() => {
// 			// catch error
// 		})

// }
onMounted(() => {
	console.log(`the component is now mounted.`)
	GM_registerMenuCommand('打开配置面板', handleOpenPanel)
})

</script>
<style scoped>
.dialog-footer button:first-child {
	margin-right: 10px;
}
</style>
