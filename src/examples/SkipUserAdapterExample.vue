<template>
  <div class="skip-user-adapter-example">
    <h2>跳过用户消息适配示例</h2>
    <p>组件级别配置，直接跳过用户消息的AI适配，只处理AI回复消息</p>
    
    <!-- 配置面板 -->
    <div class="config-panel">
      <div class="config-row">
        <label>
          <input type="checkbox" v-model="useAiAdapter" />
          启用AI适配器
        </label>
      </div>
      
      <div class="config-row">
        <label>
          <input type="checkbox" v-model="skipUserMessages" />
          🔥 跳过用户消息适配（推荐）
        </label>
      </div>
      
      <div class="config-row">
        <label>API Key:</label>
        <input 
          type="password" 
          v-model="apiKey" 
          placeholder="输入你的通义千问API Key"
          style="width: 300px;"
        />
      </div>
    </div>

    <!-- 消息列表 -->
    <LiaoMessageList
      :messages="messages"
      :use-ai-adapter="useAiAdapter"
      :ai-adapter-options="aiAdapterOptions"
      :skip-user-message-adapter="skipUserMessages"
      :show-avatar="true"
      :show-name="true"
      :show-time="true"
      @adapter-success="handleAdapterSuccess"
      @adapter-error="handleAdapterError"
    />

    <!-- 测试按钮 -->
    <div class="test-panel">
      <h3>测试消息</h3>
      <div class="test-buttons">
        <button @click="addUserMessage">添加用户消息</button>
        <button @click="addComplexAiMessage">添加复杂AI消息</button>
        <button @click="addMixedMessages">添加混合消息</button>
        <button @click="clearMessages">清空消息</button>
      </div>
    </div>

    <!-- 适配统计 -->
    <div class="stats-panel">
      <h3>适配统计</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">处理的消息数</span>
          <span class="stat-value">{{ stats.processed }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">跳过的用户消息</span>
          <span class="stat-value">{{ stats.skipped }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">缓存命中</span>
          <span class="stat-value">{{ stats.cached }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">性能提升</span>
          <span class="stat-value">{{ performanceGain }}%</span>
        </div>
      </div>
    </div>

    <!-- 日志 -->
    <div class="logs-panel">
      <h3>操作日志</h3>
      <div class="log-list">
        <div v-for="log in logs" :key="log.id" :class="`log-item log-${log.type}`">
          <span class="log-time">{{ formatTime(log.time) }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import LiaoMessageList from '../components/LiaoMessageList/LiaoMessageList.vue'
import type { AiAdapterOptions } from '../ai-adapter/types'

// 状态管理
const messages = ref<any[]>([])
const useAiAdapter = ref(true)
const skipUserMessages = ref(true) // 默认启用跳过用户消息
const apiKey = ref('')
const logs = ref<Array<{
  id: number,
  time: Date,
  type: 'info' | 'success' | 'warning' | 'error',
  message: string
}>>([])

// 统计数据
const stats = ref({
  processed: 0,
  skipped: 0,
  cached: 0
})

// AI适配器配置
const aiAdapterOptions = computed<AiAdapterOptions>(() => ({
  enabled: useAiAdapter.value,
  apiKey: apiKey.value,
  model: 'qwen-plus',
  enableCache: true,
  timeoutMs: 10000
}))

// 性能提升计算
const performanceGain = computed(() => {
  const total = stats.value.processed + stats.value.skipped
  if (total === 0) return 0
  return Math.round((stats.value.skipped / total) * 100)
})

// 添加日志
const addLog = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
  logs.value.unshift({
    id: Date.now(),
    time: new Date(),
    type,
    message
  })
  
  if (logs.value.length > 20) {
    logs.value = logs.value.slice(0, 20)
  }
}

// 测试消息生成
const addUserMessage = () => {
  const userMessage = {
    id: `user_${Date.now()}`,
    content: `用户消息 - ${new Date().toLocaleTimeString()}`,
    isSelf: true,
    role: 'user',
    name: '用户',
    avatar: '/user-avatar.png',
    time: Date.now()
  }
  
  messages.value.push(userMessage)
  addLog('info', `添加用户消息，${skipUserMessages.value ? '将跳过' : '将进行'} AI适配`)
}

const addComplexAiMessage = () => {
  // 模拟复杂的AI回复格式
  const complexAiMessage = {
    id: `ai_${Date.now()}`,
    response: {
      data: {
        text: `复杂格式的AI回复 - ${new Date().toLocaleTimeString()}`,
        metadata: {
          model: 'qwen-plus',
          tokens: 120,
          confidence: 0.95
        }
      },
      author: {
        name: 'AI助手',
        type: 'assistant'
      }
    },
    timestamp: Date.now(),
    source: 'third-party-api'
  }
  
  messages.value.push(complexAiMessage)
  addLog('warning', '添加复杂AI消息，需要AI适配处理')
}

const addMixedMessages = () => {
  // 添加一组混合消息
  const mixedMessages = [
    {
      id: `user_${Date.now()}_1`,
      content: '你好，我有个问题想咨询',
      isSelf: true,
      role: 'user',
      time: Date.now()
    },
    {
      id: `ai_${Date.now()}_1`,
      reply: {
        content: '您好！我是AI助手，很高兴为您服务。请问有什么可以帮助您的？',
        sender: 'chatbot',
        confidence: 0.98
      },
      created: Date.now() + 1000
    },
    {
      id: `user_${Date.now()}_2`,
      content: '我想了解一下你们的产品功能',
      isSelf: true,
      role: 'user',
      time: Date.now() + 2000
    },
    {
      id: `ai_${Date.now()}_2`,
      data: {
        response: '我们的产品具有以下核心功能：\n1. 智能对话\n2. 文档处理\n3. 任务自动化\n\n请问您对哪个功能比较感兴趣？',
        bot_info: {
          name: 'ProductBot',
          version: '2.1'
        }
      },
      timestamp: Date.now() + 3000
    }
  ]
  
  messages.value.push(...mixedMessages)
  addLog('info', `添加混合消息组 (${mixedMessages.length}条)，用户消息${skipUserMessages.value ? '跳过适配' : '进行适配'}`)
}

const clearMessages = () => {
  messages.value = []
  stats.value = { processed: 0, skipped: 0, cached: 0 }
  logs.value = []
  addLog('info', '清空所有消息和统计数据')
}

// 适配器事件处理
const handleAdapterSuccess = (event: any) => {
  stats.value = {
    processed: event.processed || 0,
    skipped: event.skipped || 0,
    cached: event.cached || 0
  }
  
  const skipMsg = event.skipped > 0 ? `，跳过 ${event.skipped} 条用户消息` : ''
  addLog('success', `AI适配成功：处理 ${event.processed} 条消息${skipMsg}`)
}

const handleAdapterError = (event: any) => {
  addLog('error', `AI适配失败: ${event.error}`)
}

// 工具函数
const formatTime = (time: Date) => {
  return time.toLocaleTimeString()
}
</script>

<style scoped>
.skip-user-adapter-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.config-panel {
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.config-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.config-row label {
  font-weight: 500;
}

.test-panel {
  background: #f8f9fa;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
}

.test-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.test-buttons button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
  transition: background 0.2s;
}

.test-buttons button:hover {
  background: #0056b3;
}

.stats-panel {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin: 20px 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 10px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 18px;
  font-weight: bold;
  color: #007bff;
}

.logs-panel {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
}

.log-list {
  max-height: 200px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.log-time {
  color: #666;
  font-family: monospace;
  min-width: 80px;
}

.log-message {
  flex: 1;
}

.log-info { color: #666; }
.log-success { color: #28a745; }
.log-warning { color: #ffc107; }
.log-error { color: #dc3545; }
</style> 