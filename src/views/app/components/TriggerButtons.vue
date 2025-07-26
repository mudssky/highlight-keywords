<template>
  <!-- 始终可见的触发区域 -->
  <div
    class="panel-trigger w-[50px] h-[140px] flex flex-col items-center justify-center cursor-pointer rounded-l-xl backdrop-blur-[10px] gap-1.5"
    :class="dynamicColors.triggerBg"
  >
    <!-- 夜间模式切换按钮 -->
    <div
      @click="onToggleDarkMode"
      class="p-1.5 rounded-md transition-all duration-200 ease-in-out cursor-pointer hover:scale-110"
      :class="isDarkMode ? 'bg-yellow-500/30' : 'bg-slate-600/20'"
      :title="isDarkMode ? '切换到日间模式' : '切换到夜间模式'"
    >
      {{ isDarkMode ? '☀️' : '🌙' }}
    </div>

    <!-- 固定/取消固定按钮 -->
    <div
      @click="onTogglePanelPin"
      class="p-1.5 rounded-md transition-all duration-200 ease-in-out cursor-pointer hover:scale-110"
      :class="panelPinned ? 'bg-blue-500/30' : 'bg-white/10'"
      :title="panelPinned ? '取消固定' : '固定面板'"
    >
      {{ panelPinned ? '📌' : '📍' }}
    </div>

    <!-- 调试信息按钮 -->
    <div
      v-if="isDebugMode"
      @click="onToggleDebugDialog"
      class="p-1.5 rounded-md bg-purple-500/20 transition-all duration-200 ease-in-out cursor-pointer hover:scale-110"
      title="调试信息"
    >
      🐛
    </div>

    <!-- 关闭按钮 -->
    <div
      @click="onClosePanel"
      class="p-1.5 rounded-md bg-red-500/20 transition-all duration-200 ease-in-out cursor-pointer hover:scale-110"
      title="关闭面板（1小时）"
    >
      ✕
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { DynamicColors } from '../types'

interface Props {
  isDarkMode: boolean
  panelPinned: boolean
  isDebugMode: boolean
  dynamicColors: DynamicColors
}

interface Emits {
  toggleDarkMode: []
  togglePanelPin: []
  toggleDebugDialog: []
  closePanel: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()

// 事件处理函数
function onToggleDarkMode() {
  emit('toggleDarkMode')
}

function onTogglePanelPin() {
  emit('togglePanelPin')
}

function onToggleDebugDialog() {
  emit('toggleDebugDialog')
}

function onClosePanel() {
  emit('closePanel')
}
</script>