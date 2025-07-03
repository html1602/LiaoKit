<template>
  <div class="selective-adapter-example">
    <h2>选择性AI适配示例</h2>
    <p>只对AI回复消息使用适配器，用户消息直接跳过</p>
    
    <!-- 配置面板 -->
    <div class="config-panel">
      <div class="config-row">
        <label>
          <input type="checkbox" v-model="useAiAdapter" />
          启用AI适配器
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
      :custom-format="selectiveCustomFormat"
      :show-avatar="true"
      :show-name="true"
      :show-time="true"
      @adapter-success="handleAdapterSuccess"
      @adapter-error="handleAdapterError"
    />

    <!-- 添加测试消息 -->
    <div class="test-panel">
      <h3>测试消息</h3>
      
      <div class="test-buttons">
        <button @click="addUserMessage">添加用户消息</button>
        <button @click="addAiMessageFormat1">添加AI消息(格式1)</button>
        <button @click="addAiMessageFormat2">添加AI消息(格式2)</button>
        <button @click="addAiMessageFormat3">添加AI消息(格式3)</button>
        <button @click="clearMessages">清空消息</button>
      </div>
    </div>

    <!-- 适配日志 -->
    <div class="adapter-logs">
      <h3>适配日志</h3>
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
import type { AiAdapterOptions, CustomFormatFunction } from '../ai-adapter/types'

// 状态管理
const messages = ref<any[]>([])
const useAiAdapter = ref(true)
const apiKey = ref('')
const logs = ref<Array<{
  id: number,
  time: Date,
  type: 'info' | 'success' | 'warning' | 'error',
  message: string
}>>([])

// AI适配器配置
const aiAdapterOptions = computed<AiAdapterOptions>(() => ({
  enabled: useAiAdapter.value,
  apiKey: apiKey.value,
  model: 'qwen-plus',
  enableCache: true,
  timeoutMs: 10000
}))

// 核心：选择性自定义格式化函数
const selectiveCustomFormat: CustomFormatFunction = (rawMessage: any) => {
  // 判断是否为用户消息
  const isUserMessage = 
    rawMessage.isSelf === true ||
    rawMessage.role === 'user' ||
    rawMessage.from === 'user' ||
    rawMessage.sender === 'user' ||
    rawMessage.type === 'user'

  // 如果是用户消息，直接转换为标准格式，跳过AI适配
  if (isUserMessage) {
    addLog('info', `跳过用户消息的AI适配: "${rawMessage.content || rawMessage.text || rawMessage.message}"`)
    
    return {
      id: rawMessage.id || Date.now(),
      content: rawMessage.content || rawMessage.text || rawMessage.message || '',
      type: rawMessage.type || 'text',
      isSelf: true,
      name: rawMessage.name || '用户',
      avatar: rawMessage.avatar || '/user-avatar.png',
      time: rawMessage.time || rawMessage.timestamp || Date.now(),
      status: rawMessage.status || 'sent'
    }
  }

  // 如果是AI消息，返回null让AI适配器处理
  const isAiMessage = 
    rawMessage.isSelf === false ||
    rawMessage.role === 'assistant' ||
    rawMessage.role === 'ai' ||
    rawMessage.from === 'ai' ||
    rawMessage.from === 'assistant' ||
    rawMessage.sender === 'ai' ||
    rawMessage.type === 'assistant'

  if (isAiMessage) {
    addLog('warning', `AI消息将使用适配器处理: "${rawMessage.response || rawMessage.reply || rawMessage.content || '复杂格式'}"`)
    return null // 交给AI适配器处理
  }

  // 其他类型消息的兜底处理
  addLog('info', `未知消息类型，使用兜底方案: "${rawMessage.content || JSON.stringify(rawMessage).substring(0, 50)}"`)
  
  return {
    id: rawMessage.id || Date.now(),
    content: rawMessage.content || rawMessage.text || '[未知格式]',
    type: 'text',
    isSelf: false,
    name: '系统',
    time: Date.now(),
    status: 'sent'
  }
}

// 添加日志
const addLog = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
  logs.value.unshift({
    id: Date.now(),
    time: new Date(),
    type,
    message
  })
  
  // 限制日志数量
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50)
  }
}

// 测试消息生成
const addUserMessage = () => {
  const userMessage = {
    id: Date.now(),
    content: `用户消息 ${Date.now()}`,
    isSelf: true,
    role: 'user',
    time: Date.now()
  }
  
  messages.value.push(userMessage)
  addLog('info', '添加用户消息，将跳过AI适配')
}

const addAiMessageFormat1 = () => {
  // 模拟业务方格式1：简单格式
  const aiMessage = {
    id: Date.now(),
    response: `AI回复消息 ${Date.now()}`,
    from: 'ai',
    timestamp: Date.now(),
    status: 'success'
  }
  
  messages.value.push(aiMessage)
  addLog('warning', '添加AI消息(格式1)，将使用AI适配器处理')
}

const addAiMessageFormat2 = () => {
  // 模拟业务方格式2：复杂嵌套格式
  const aiMessage = {
    id: Date.now(),
    data: {
      reply: {
        text: `复杂格式的AI回复 ${Date.now()}`,
        metadata: {
          model: 'gpt-4',
          tokens: 150
        }
      },
      sender: {
        type: 'assistant',
        name: 'ChatBot',
        avatar: '/ai-avatar.png'
      }
    },
    created_at: new Date().toISOString()
  }
  
  messages.value.push(aiMessage)
  addLog('warning', '添加AI消息(格式2)，复杂嵌套格式需要AI适配')
}

const addAiMessageFormat3 = () => {
  // 模拟业务方格式3：第三方API格式
  const aiMessage = {
    message_id: Date.now(),
    content: {
      type: 'text',
      text: `第三方API格式的回复 ${Date.now()}`
    },
    role: 'assistant',
    author: {
      name: 'AI助手',
      icon_url: '/assistant-avatar.png'
    },
    timestamp: Math.floor(Date.now() / 1000),
    extra_data: {
      confidence: 0.95,
      source: 'third-party-api'
    }
  }
  
  messages.value.push(aiMessage)
  addLog('warning', '添加AI消息(格式3)，第三方API格式需要AI适配')
}

const clearMessages = () => {
  messages.value = []
  logs.value = []
  addLog('info', '清空所有消息和日志')
}

// 适配器事件处理
const handleAdapterSuccess = (event: any) => {
  addLog('success', `AI适配成功: 处理了 ${event.processed} 条消息，缓存命中 ${event.cached} 次`)
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
.selective-adapter-example {
  max-width: 1000px;
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

.adapter-logs {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin-top: 20px;
}

.log-list {
  max-height: 300px;
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

.log-info {
  color: #666;
}

.log-success {
  color: #28a745;
}

.log-warning {
  color: #ffc107;
}

.log-error {
  color: #dc3545;
}
</style> 