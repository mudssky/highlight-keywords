<template>
  <!-- 配置面板对话框 -->
  <el-dialog
    :model-value="visible"
    @update:model-value="handleClose"
    title="配置面板"
    width="600px"
    :before-close="handleClose"
    :teleported="false"
    class="config-dialog"
  >
    <el-form :model="form" label-width="120px" class="space-y-4">
      <!-- 高亮样式配置 -->
      <el-form-item label="高亮样式">
        <el-input
          v-model="form.highlightStyle"
          type="textarea"
          :rows="2"
          placeholder="例如: background: yellow; color: black;"
        />
      </el-form-item>

      <!-- 当前选中样式配置 -->
      <el-form-item label="当前选中样式">
        <el-input
          v-model="form.activeStyle"
          type="textarea"
          :rows="2"
          placeholder="例如: background: orange; color: white;"
        />
      </el-form-item>

      <!-- 样式预设 -->
      <el-form-item label="样式预设">
        <el-select
          v-model="form.selectedTheme"
          placeholder="选择预设主题"
          @change="handleThemeChange"
          class="w-full"
        >
          <el-option
            v-for="(theme, key) in themePresets"
            :key="key"
            :label="key"
            :value="key"
          />
        </el-select>
      </el-form-item>

      <!-- 样式预览 -->
      <el-form-item label="样式预览">
        <div class="flex gap-4 items-center">
          <span
            class="preview-highlight px-2 py-1 rounded"
            :style="form.highlightStyle"
          >
            高亮样式
          </span>
          <span
            class="preview-active px-2 py-1 rounded"
            :style="form.activeStyle"
          >
            选中样式
          </span>
        </div>
      </el-form-item>

      <!-- 关键词配置 -->
      <el-form-item label="关键词配置">
        <el-input
          v-model="form.configJson"
          type="textarea"
          :rows="10"
          :placeholder="form.placeholder"
          class="font-mono text-sm"
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="flex justify-between">
        <div class="space-x-2">
          <el-button @click="handleCopyJson" type="info" size="small">
            📋 复制配置
          </el-button>
          <el-button @click="handlePreviewStyle" type="warning" size="small">
            👁️ 预览样式
          </el-button>
        </div>
        <div class="space-x-2">
          <el-button @click="handleClose">取消</el-button>
          <el-button @click="handleUpdateConfig" type="primary">
            更新配置
          </el-button>
        </div>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElDialog, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElButton } from 'element-plus'
import type { FormData, ThemePresets } from '../types'
import { themePresets } from '../config'

interface Props {
  visible: boolean
  form: FormData
}

interface Emits {
  'update:visible': [value: boolean]
  close: []
  themeChange: [theme: string]
  copyJson: []
  previewStyle: []
  updateConfig: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function handleClose() {
  emit('update:visible', false)
  emit('close')
}

function handleThemeChange(theme: string) {
  emit('themeChange', theme)
}

function handleCopyJson() {
  emit('copyJson')
}

function handlePreviewStyle() {
  emit('previewStyle')
}

function handleUpdateConfig() {
  emit('updateConfig')
}
</script>

<style scoped>
.config-dialog :deep(.el-dialog) {
  border-radius: 12px;
}

.config-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  padding: 20px;
}

.config-dialog :deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
}

.config-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.preview-highlight,
.preview-active {
  display: inline-block;
  min-width: 80px;
  text-align: center;
  border: 1px solid #ddd;
}
</style>