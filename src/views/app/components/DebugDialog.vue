<template>
  <!-- 调试信息对话框 -->
  <el-dialog
    :model-value="visible"
    @update:model-value="handleClose"
    title="🐛 调试信息"
    width="800px"
    :before-close="handleClose"
    class="debug-dialog"
  >
    <el-tabs :model-value="activeTab" @update:model-value="(value) => $emit('update:activeTab', value as string)" class="debug-tabs">
      <!-- 基本信息 -->
      <el-tab-pane label="📋 基本信息" name="basic">
        <div class="debug-section">
          <h4>脚本状态</h4>
          <div class="debug-grid">
            <div class="debug-item">
              <span class="label">当前URL:</span>
              <span class="value">{{ debugInfo.currentUrl }}</span>
            </div>
            <div class="debug-item">
              <span class="label">页面标题:</span>
              <span class="value">{{ debugInfo.pageTitle }}</span>
            </div>
            <div class="debug-item">
              <span class="label">脚本版本:</span>
              <span class="value">{{ debugInfo.scriptVersion }}</span>
            </div>
            <div class="debug-item">
              <span class="label">用户代理:</span>
              <span class="value text-xs">{{ debugInfo.userAgent }}</span>
            </div>
          </div>

          <h4>高亮状态</h4>
          <div class="debug-grid">
            <div class="debug-item">
              <span class="label">总计数:</span>
              <span class="value">{{ highlightState.totalCount }}</span>
            </div>
            <div class="debug-item">
              <span class="label">当前索引:</span>
              <span class="value">{{ highlightState.currentIndex }}</span>
            </div>
            <div class="debug-item">
              <span class="label">关键词数:</span>
              <span class="value">{{ highlightState.keywords.length }}</span>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 配置信息 -->
      <el-tab-pane label="⚙️ 配置信息" name="config">
        <div class="debug-section">
          <h4>规则列表 ({{ ruleList.length }})</h4>
          <div class="debug-list">
            <div v-for="(rule, index) in ruleList" :key="index" class="debug-rule">
              <div class="rule-header">
                <span class="rule-index">#{{ index + 1 }}</span>
                <span class="rule-url">{{ rule.matchUrl }}</span>
              </div>
              <div class="rule-keywords">
                <span v-for="keyword in rule.keywords" :key="keyword" class="keyword-tag">
                  {{ keyword }}
                </span>
              </div>
            </div>
          </div>

          <h4>匹配规则 ({{ matchedRuleList.length }})</h4>
          <div class="debug-list">
            <div v-for="(rule, index) in matchedRuleList" :key="index" class="debug-rule matched">
              <div class="rule-header">
                <span class="rule-index">#{{ index + 1 }}</span>
                <span class="rule-url">{{ rule.matchUrl }}</span>
              </div>
              <div class="rule-keywords">
                <span v-for="keyword in rule.keywords" :key="keyword" class="keyword-tag">
                  {{ keyword }}
                </span>
              </div>
            </div>
          </div>

          <h4>当前关键词 ({{ matchedKeywords.length }})</h4>
          <div class="keyword-list">
            <span v-for="keyword in matchedKeywords" :key="keyword" class="keyword-tag active">
              {{ keyword }}
            </span>
          </div>
        </div>
      </el-tab-pane>

      <!-- 性能信息 -->
      <el-tab-pane label="📊 性能信息" name="performance">
        <div class="debug-section">
          <h4>性能指标</h4>
          <div class="debug-grid">
            <div class="debug-item">
              <span class="label">页面加载时间:</span>
              <span class="value">{{ debugInfo.pageLoadTime }}ms</span>
            </div>
            <div class="debug-item">
              <span class="label">脚本初始化时间:</span>
              <span class="value">{{ debugInfo.scriptInitTime }}ms</span>
            </div>
            <div class="debug-item">
              <span class="label">内存使用:</span>
              <span class="value">{{ debugInfo.memoryUsage }}</span>
            </div>
          </div>

          <h4>DOM 信息</h4>
          <div class="debug-grid">
            <div class="debug-item">
              <span class="label">DOM 元素数:</span>
              <span class="value">{{ debugInfo.domElementCount }}</span>
            </div>
            <div class="debug-item">
              <span class="label">文本节点数:</span>
              <span class="value">{{ debugInfo.textNodeCount }}</span>
            </div>
            <div class="debug-item">
              <span class="label">高亮元素数:</span>
              <span class="value">{{ debugInfo.highlightElementCount }}</span>
            </div>
            <div class="debug-item">
              <span class="label">页面高度:</span>
              <span class="value">{{ debugInfo.pageHeight }}px</span>
            </div>
          </div>
        </div>
      </el-tab-pane>

      <!-- 控制台日志 -->
      <el-tab-pane label="📝 控制台日志" name="logs">
        <div class="debug-section">
          <div class="log-header">
            <h4>日志记录 ({{ debugLogs.length }})</h4>
            <div class="log-actions">
              <el-button @click="$emit('clearLogs')" size="small" type="warning">
                🧹 清空日志
              </el-button>
              <el-button @click="$emit('exportDebug')" size="small" type="success">
                📤 导出调试信息
              </el-button>
            </div>
          </div>
          <div class="log-container">
            <div v-if="debugLogs.length === 0" class="no-logs">
              暂无日志记录
            </div>
            <div v-else class="log-list">
              <div
                v-for="(log, index) in debugLogs"
                :key="index"
                class="log-item"
                :class="`log-${log.level}`"
              >
                <span class="log-time">{{ log.timestamp }}</span>
                <span class="log-level">{{ log.level.toUpperCase() }}</span>
                <span class="log-message">{{ log.message }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <template #footer>
      <div style="display: flex; justify-content: space-between;">
        <el-button @click="$emit('refreshInfo')" type="info">
          🔄 刷新信息
        </el-button>
        <el-button @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ElDialog, ElTabs, ElTabPane, ElButton } from 'element-plus'
import type { DebugInfo, DebugLog, HighlightState, RuleItem } from '../types'

interface Props {
  visible: boolean
  activeTab: string
  debugInfo: DebugInfo
  debugLogs: DebugLog[]
  highlightState: HighlightState
  ruleList: RuleItem[]
  matchedRuleList: RuleItem[]
  matchedKeywords: string[]
}

interface Emits {
  'update:visible': [value: boolean]
  'update:activeTab': [value: string]
  close: []
  refreshInfo: []
  clearLogs: []
  exportDebug: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function handleClose() {
  emit('update:visible', false)
  emit('close')
}
</script>

<style scoped>
.debug-dialog :deep(.el-dialog) {
  border-radius: 12px;
}

.debug-dialog :deep(.el-dialog__header) {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
  border-radius: 12px 12px 0 0;
  padding: 20px;
}

.debug-dialog :deep(.el-dialog__title) {
  color: white;
  font-weight: 600;
}

.debug-dialog :deep(.el-dialog__body) {
  padding: 24px;
  max-height: 600px;
  overflow-y: auto;
}

.debug-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.debug-section h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
  margin-bottom: 0.75rem;
}

.debug-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .debug-grid {
    grid-template-columns: 1fr 1fr;
  }
}

.debug-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
}

.debug-item .label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
}

.debug-item .value {
  font-size: 0.875rem;
  color: #111827;
  font-family: monospace;
  word-break: break-all;
}

.debug-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 15rem;
  overflow-y: auto;
}

.debug-rule {
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  border-left: 4px solid #d1d5db;
}

.debug-rule.matched {
  background-color: #f0fdf4;
  border-left-color: #4ade80;
}

.rule-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.rule-index {
  font-size: 0.75rem;
  font-weight: 700;
  color: #6b7280;
  background-color: #e5e7eb;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
}

.rule-url {
  font-size: 0.875rem;
  font-family: monospace;
  color: #2563eb;
}

.rule-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.keyword-tag {
  font-size: 0.75rem;
  background-color: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
}

.keyword-tag.active {
  background-color: #dcfce7;
  color: #166534;
}

.keyword-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.log-actions {
  display: flex;
  gap: 0.5rem;
}

.log-container {
  background-color: #111827;
  border-radius: 0.5rem;
  padding: 1rem;
  max-height: 20rem;
  overflow-y: auto;
}

.no-logs {
  color: #9ca3af;
  text-align: center;
  padding: 2rem 0;
}

.log-list {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-family: monospace;
  font-size: 0.875rem;
}

.log-item {
  display: flex;
  gap: 0.75rem;
  padding: 0.25rem 0;
}

.log-time {
  color: #9ca3af;
  font-size: 0.75rem;
  min-width: 80px;
}

.log-level {
  font-size: 0.75rem;
  font-weight: 700;
  min-width: 50px;
}

.log-message {
  flex: 1;
  word-break: break-all;
}

.log-info .log-level {
  color: #60a5fa;
}

.log-info .log-message {
  color: #d1d5db;
}

.log-warn .log-level {
  color: #fbbf24;
}

.log-warn .log-message {
  color: #fde047;
}

.log-error .log-level {
  color: #f87171;
}

.log-error .log-message {
  color: #fca5a5;
}
</style>