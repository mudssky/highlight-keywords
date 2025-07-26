<template>
  <!-- 展开的面板内容 -->
  <div
    v-if="panelExpanded"
    class="panel-content w-[260px] p-4 backdrop-blur-[10px] rounded-r-xl"
    :class="dynamicColors.contentBg"
  >
    <!-- 匹配信息 -->
    <div
      class="mb-4 p-3 rounded-lg"
      :class="[dynamicColors.infoBg, dynamicColors.borderColor]"
    >
      <div class="text-sm font-medium mb-2" :class="dynamicColors.textPrimary">
        匹配信息
      </div>
      <div class="text-xs space-y-1" :class="dynamicColors.textSecondary">
        <div>关键词: {{ matchedKeywords.length }} 个</div>
        <div>高亮: {{ highlightState.totalCount }} 处</div>
        <div v-if="highlightState.totalCount > 0">
          当前: {{ highlightState.currentIndex + 1 }} /
          {{ highlightState.totalCount }}
        </div>
      </div>
    </div>

    <!-- 导航按钮 -->
    <div class="space-y-2">
      <!-- 上一个/下一个 -->
      <div class="flex gap-2">
        <button
          @click="$emit('previous')"
          :disabled="highlightState.totalCount === 0"
          class="flex-1 px-3 py-2 text-xs font-medium text-white rounded-lg transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          :style="{ background: dynamicColors.buttonPrimary }"
        >
          ⬆️ 上一个
        </button>
        <button
          @click="$emit('next')"
          :disabled="highlightState.totalCount === 0"
          class="flex-1 px-3 py-2 text-xs font-medium text-white rounded-lg transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          :style="{ background: dynamicColors.buttonPrimary }"
        >
          ⬇️ 下一个
        </button>
      </div>

      <!-- 启用高亮 -->
      <button
        @click="$emit('enableHighlight')"
        class="w-full px-3 py-2 text-xs font-medium text-white rounded-lg transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
        :style="{ background: dynamicColors.buttonSuccess }"
      >
        🔍 启用高亮
      </button>

      <!-- 清除高亮 -->
      <button
        @click="$emit('clearHighlight')"
        :disabled="highlightState.totalCount === 0"
        class="w-full px-3 py-2 text-xs font-medium text-white rounded-lg transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
        :style="{ background: dynamicColors.buttonDanger }"
      >
        🧹 清除高亮
      </button>

      <!-- 配置按钮 -->
      <button
        @click="$emit('openConfig')"
        class="w-full px-3 py-2 text-xs font-medium text-white rounded-lg transition-all duration-200 ease-in-out hover:scale-105 active:scale-95"
        :style="{ background: dynamicColors.buttonSecondary }"
      >
        ⚙️ 配置
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { HighlightState, DynamicColors } from '../types'

interface Props {
  panelExpanded: boolean
  highlightState: HighlightState
  matchedKeywords: string[]
  dynamicColors: DynamicColors
}

interface Emits {
  previous: []
  next: []
  enableHighlight: []
  clearHighlight: []
  openConfig: []
}

defineProps<Props>()
defineEmits<Emits>()
</script>
