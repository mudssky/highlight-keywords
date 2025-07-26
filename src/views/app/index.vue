<template>
  <!-- 主面板容器 -->
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
    <div class="flex">
      <!-- 触发按钮组件 -->
      <TriggerButtons
        :is-dark-mode="isDarkMode"
        :panel-pinned="panelPinned"
        :is-debug-mode="isDebugMode"
        :dynamic-colors="dynamicColors"
        @toggle-dark-mode="toggleDarkMode"
        @toggle-panel-pin="togglePanelPin"
        @toggle-debug-dialog="toggleDebugDialog"
        @close-panel="handleClosePanel"
      />

      <!-- 导航面板组件 -->
      <NavigationPanel
        :panel-expanded="panelExpanded"
        :panel-pinned="panelPinned"
        :highlight-state="highlightState"
        :matched-keywords="matchedKeywords"
        :dynamic-colors="dynamicColors"
        :is-dark-mode="isDarkMode"
        @previous="handlePrevious"
        @next="handleNext"
        @enable-highlight="handleEnableHighlight"
        @clear-highlight="handleClearHighlight"
        @open-config="handleOpenPanel"
      />
    </div>
  </div>

  <!-- 配置面板对话框 -->
  <ConfigDialog
    v-model:visible="dialogVisible"
    :form="form"
    :rule-form-ref="ruleFormRef"
    @close="handleClose"
    @copy-json="handleCopyJson"
    @preview-style="handlePreviewStyle"
    @update-config="handleUpdateConfig"
    @theme-change="handleThemeChange"
  />

  <!-- 调试信息对话框 -->
  <DebugDialog
    v-model:visible="debugDialogVisible"
    :active-tab="activeDebugTab"
    :debug-info="debugInfo"
    :highlight-state="highlightState"
    :rule-list="ruleList"
    :matched-rule-list="matchedRuleList"
    :matched-keywords="matchedKeywords"
    :debug-logs="debugLogs"
    @close="handleCloseDebug"
    @clear-logs="clearDebugLogs"
    @export-debug="
      () =>
        exportDebugInfo(
          debugInfo,
          highlightState,
          ruleList,
          matchedRuleList,
          debugLogs,
        )
    "
    @refresh-info="() => refreshDebugInfo(debugInfo)"
  />
</template>

<script setup lang="ts">
import TriggerButtons from './components/TriggerButtons.vue'
import NavigationPanel from './components/NavigationPanel.vue'
import ConfigDialog from './components/ConfigDialog.vue'
import DebugDialog from './components/DebugDialog.vue'
import { useHighlightApp } from './hook'
import { cn } from '@mudssky/jsutils'
// 使用自定义 hook 获取所有状态和方法
const {
  // 响应式状态
  ruleFormRef,
  dialogVisible,
  ruleList,
  highlightState,
  panelExpanded,
  panelPinned,
  panelHidden,
  panelHideTimeout,
  isDarkMode,
  isDebugMode,
  debugDialogVisible,
  activeDebugTab,
  debugLogs,
  debugInfo,
  pageState,
  form,

  // 计算属性
  matchedRuleList,
  matchedKeywords,
  dynamicColors,

  // 方法
  handlePanelHover,
  togglePanelPin,
  toggleDarkMode,
  handleClosePanel,
  loadGlobalStyle,
  updateHighlightStyle,
  handlePrevious,
  handleNext,
  handleEnableHighlight,
  handleClearHighlight,
  handleThemeChange,
  toggleDebugDialog,
  handleCloseDebug,
  clearDebugLogs,
  handlePreviewStyle,
  handleCopyJson,
  loadRuleList,
  handleOpenPanel,
  handleClose,
  handleUpdateConfig,
  highlightMatchedKeywords,
  refreshDebugInfo,
  exportDebugInfo,
} = useHighlightApp()
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
