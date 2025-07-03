<template>
  <div class="streaming-adapter-example">
    <div class="example-container">
      <h1>🚀 流式输入 + AI适配器 演示</h1>
      <p class="description">
        体验 LiaoKit 流式输入与 AI 消息格式适配器的完美结合。
        本示例展示如何在流式输出过程中智能地处理消息适配。
      </p>
      
      <!-- 功能配置区 -->
      <div class="config-section">
        <h2>🛠️ 配置选项</h2>
        <div class="config-grid">
          <div class="config-item">
            <label>
              <input v-model="useAiAdapter" type="checkbox" />
              启用AI适配器
            </label>
          </div>
          <div class="config-item">
            <label>
              <input v-model="skipUserMessages" type="checkbox" />
              跳过用户消息适配
            </label>
          </div>
          <div class="config-item">
            <label>
              <input v-model="enableCache" type="checkbox" />
              启用适配缓存
            </label>
          </div>
          <div class="config-item">
            <label>流式速度 (ms):</label>
            <input v-model.number="streamingSpeed" type="range" min="20" max="200" />
            <span>{{ streamingSpeed }}ms</span>
          </div>
        </div>
        
        <div class="config-item">
          <label>AI适配器 API Key:</label>
          <input 
            v-model="apiKey" 
            type="password" 
            placeholder="请输入通义千问API Key"
            style="width: 300px; margin-left: 10px;"
          />
        </div>
      </div>
      
      <!-- 演示控制区 -->
      <div class="demo-section">
        <h2>🎮 演示控制</h2>
        <div class="demo-controls">
          <button @click="startStreamingDemo" :disabled="isStreaming" class="primary-btn">
            🔄 开始流式+适配演示
          </button>
          <button @click="addUserMessage" :disabled="isStreaming" class="secondary-btn">
            👤 添加用户消息
          </button>
          <button @click="addMixedMessages" :disabled="isStreaming" class="secondary-btn">
            🔀 添加混合消息
          </button>
          <button @click="clearMessages" class="danger-btn">
            🗑️ 清空消息
          </button>
        </div>
      </div>
      
      <!-- 状态监控区 -->
      <div class="status-section">
        <h2>📊 状态监控</h2>
        <div class="status-grid">
          <div class="status-card">
            <h3>💬 消息统计</h3>
            <div class="stat-item">
              <span>总消息数:</span>
              <strong>{{ messageStats.total }}</strong>
            </div>
            <div class="stat-item">
              <span>流式中:</span>
              <strong>{{ messageStats.streaming }}</strong>
            </div>
            <div class="stat-item">
              <span>用户消息:</span>
              <strong>{{ messageStats.user }}</strong>
            </div>
            <div class="stat-item">
              <span>AI消息:</span>
              <strong>{{ messageStats.ai }}</strong>
            </div>
          </div>
          
          <div class="status-card">
            <h3>🤖 适配统计</h3>
            <div class="stat-item">
              <span>已处理:</span>
              <strong>{{ adapterStats.processed }}</strong>
            </div>
            <div class="stat-item">
              <span>已跳过:</span>
              <strong>{{ adapterStats.skipped }}</strong>
            </div>
            <div class="stat-item">
              <span>流式跳过:</span>
              <strong>{{ adapterStats.streaming }}</strong>
            </div>
            <div class="stat-item">
              <span>缓存命中:</span>
              <strong>{{ adapterStats.cached }}</strong>
            </div>
          </div>
          
          <div class="status-card">
            <h3>⚡ 性能指标</h3>
            <div class="stat-item">
              <span>适配耗时:</span>
              <strong>{{ performance.adaptTime }}ms</strong>
            </div>
            <div class="stat-item">
              <span>流式耗时:</span>
              <strong>{{ performance.streamTime }}ms</strong>
            </div>
            <div class="stat-item">
              <span>跳过率:</span>
              <strong>{{ performance.skipRate }}%</strong>
            </div>
            <div class="stat-item">
              <span>缓存率:</span>
              <strong>{{ performance.cacheRate }}%</strong>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 消息列表 -->
      <div class="message-container">
        <LiaoMessageList
          ref="messageListRef"
          :messages="messages"
          :use-ai-adapter="useAiAdapter"
          :skip-user-message-adapter="skipUserMessages"
          :enable-adapter-cache="enableCache"
          :ai-adapter-options="aiAdapterOptions"
          :show-avatar="true"
          :show-name="true"
          :show-time="true"
          :scroll-to-bottom="true"
          @adapter-success="handleAdapterSuccess"
          @adapter-error="handleAdapterError"
          @adapter-fallback="handleAdapterFallback"
        />
      </div>
      
      <!-- 日志区域 -->
      <div class="log-section">
        <h2>📝 实时日志</h2>
        <div class="log-container">
          <div v-for="(log, index) in logs" :key="index" class="log-item" :class="log.type">
            <span class="log-time">[{{ log.time }}]</span>
            <span class="log-type">{{ log.type.toUpperCase() }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import LiaoMessageList from '../components/LiaoMessageList/LiaoMessageList.vue';
import {
  createStreamingManager,
  StreamingHelper,
  type StreamingMessage
} from '../utils/streaming';

// 响应式状态
const messages = ref<StreamingMessage[]>([]);
const useAiAdapter = ref(true);
const skipUserMessages = ref(true);
const enableCache = ref(true);
const streamingSpeed = ref(80);
const apiKey = ref('');
const isStreaming = ref(false);

// 统计数据
const adapterStats = ref({
  processed: 0,
  skipped: 0,
  streaming: 0,
  cached: 0
});

const performance = ref({
  adaptTime: 0,
  streamTime: 0,
  skipRate: 0,
  cacheRate: 0
});

// 日志系统
const logs = ref<Array<{ time: string; type: string; message: string }>>([]);

// 创建流式管理器
const streamingManager = createStreamingManager(messages);

// 计算属性
const messageStats = computed(() => {
  const total = messages.value.length;
  const streaming = messages.value.filter(msg => msg.status === 'streaming').length;
  const user = messages.value.filter(msg => msg.isSelf).length;
  const ai = total - user;
  
  return { total, streaming, user, ai };
});

const aiAdapterOptions = computed(() => ({
  apiKey: apiKey.value,
  model: 'qwen-plus',
  enableCache: enableCache.value,
  timeoutMs: 10000,
  retryCount: 2
}));

// 日志功能
const addLog = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
  const time = new Date().toLocaleTimeString();
  logs.value.unshift({ time, type, message });
  
  // 保持最多50条日志
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50);
  }
  
  console.log(`[${type.toUpperCase()}] ${message}`);
};

// 生成消息ID
let messageIdCounter = 0;
const generateMessageId = () => `msg_${++messageIdCounter}_${Date.now()}`;

// 添加用户消息
const addUserMessage = () => {
  const userTexts = [
    '你好，我想了解一下产品功能',
    '请帮我分析一下这个数据',
    '能否提供更详细的说明？',
    '我对这个方案有一些疑问',
    '谢谢你的回答，很有帮助！'
  ];
  
  const randomText = userTexts[Math.floor(Math.random() * userTexts.length)];
  
  const userMessage: StreamingMessage = {
    id: generateMessageId(),
    content: randomText,
    isSelf: true,
    name: '用户',
    avatar: '/user-avatar.png',
    time: new Date(),
    status: 'sent',
    type: 'text'
  };
  
  messages.value.push(userMessage);
  addLog('info', `添加用户消息: ${randomText.slice(0, 20)}...`);
};

// 添加混合消息（包含不同格式的消息）
const addMixedMessages = () => {
  // 添加一个需要适配的业务消息
  const businessMessage = {
    id: generateMessageId(),
    text: '根据您的查询，我找到了以下相关信息...',  // 非标准字段
    sender: 'ai-bot',
    timestamp: Date.now(),
    messageType: 'response',
    metadata: {
      source: 'business-system',
      confidence: 0.95
    }
  };
  
  // 添加一个用户消息
  addUserMessage();
  
  // 添加业务消息
  messages.value.push(businessMessage as any);
  
  addLog('info', '添加混合格式消息，测试适配器处理能力');
};

// 开始流式演示
const startStreamingDemo = async () => {
  if (!apiKey.value && useAiAdapter.value) {
    addLog('warning', '请先配置API Key才能使用AI适配器');
    return;
  }
  
  isStreaming.value = true;
  const startTime = Date.now();
  
  addLog('info', '🚀 开始流式+适配演示');
  
  try {
    // 1. 创建流式消息
    const messageId = generateMessageId();
    const streamingMessage = streamingManager.createStreamingMessage({
      id: messageId,
      isSelf: false,
      name: 'AI助手',
      avatar: '/ai-avatar.png'
    });
    
    streamingManager.addStreamingMessage(streamingMessage);
    addLog('info', `📝 创建流式消息 ID: ${messageId}`);
    
    // 2. 模拟流式输出
    const fullText = `这是一个流式输出的AI回复消息。

我会逐步展示以下内容：
• 流式输出过程中不会触发AI适配
• 只有在流式完成后才会进行消息适配
• 这样可以避免对不完整内容的无效适配
• 大大提升了性能并减少了API调用成本

通过智能的状态管理，我们实现了：
✅ 流式过程保持原始状态
✅ 完成后自动触发适配
✅ 用户消息智能跳过
✅ 缓存机制提升性能

这就是 LiaoKit 的强大之处！`;
    
    await StreamingHelper.simulateStreaming(
      streamingManager,
      messageId,
      fullText,
      {
        chunkSize: 2,
        delay: streamingSpeed.value,
        onChunk: (chunk, index) => {
          if (index % 10 === 0) {
            addLog('info', `📄 流式进度: ${index + 1} 块`);
          }
        }
      }
    );
    
    const streamTime = Date.now() - startTime;
    performance.value.streamTime = streamTime;
    
    addLog('success', `✅ 流式输出完成，耗时: ${streamTime}ms`);
    addLog('info', '🤖 流式完成，触发AI适配处理...');
    
  } catch (error) {
    addLog('error', `❌ 流式输出出错: ${error}`);
  } finally {
    isStreaming.value = false;
  }
};

// 清空消息
const clearMessages = () => {
  messages.value = [];
  adapterStats.value = {
    processed: 0,
    skipped: 0,
    streaming: 0,
    cached: 0
  };
  performance.value = {
    adaptTime: 0,
    streamTime: 0,
    skipRate: 0,
    cacheRate: 0
  };
  logs.value = [];
  addLog('info', '🗑️ 已清空所有消息和统计');
};

// 适配器事件处理
const handleAdapterSuccess = (event: any) => {
  const adaptTime = Date.now() - performance.value.streamTime;
  performance.value.adaptTime = adaptTime;
  
  adapterStats.value = {
    processed: event.processed || 0,
    skipped: event.skipped || 0,
    streaming: event.streaming || 0,
    cached: event.cached || 0
  };
  
  // 计算性能指标
  const total = adapterStats.value.processed + adapterStats.value.skipped;
  performance.value.skipRate = total > 0 ? Math.round((adapterStats.value.skipped / total) * 100) : 0;
  performance.value.cacheRate = adapterStats.value.processed > 0 ? 
    Math.round((adapterStats.value.cached / adapterStats.value.processed) * 100) : 0;
  
  addLog('success', 
    `✅ AI适配完成: 处理${event.processed}条, 跳过${event.skipped}条, 流式跳过${event.streaming}条, 缓存${event.cached}条`
  );
};

const handleAdapterError = (event: any) => {
  addLog('error', `❌ AI适配出错: ${event.error}`);
};

const handleAdapterFallback = (event: any) => {
  addLog('warning', `⚠️ AI适配降级: ${event.failedCount}/${event.total}条消息适配失败`);
};

// 初始化
onMounted(() => {
  addLog('info', '🎯 流式输入+AI适配器演示已加载');
  addLog('info', '💡 提示: 请先配置API Key，然后点击演示按钮体验功能');
});
</script>

<style scoped>
.streaming-adapter-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.example-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.example-container > * {
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.example-container > *:last-child {
  border-bottom: none;
}

h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 28px;
}

.description {
  color: #666;
  margin: 10px 0 0 0;
  line-height: 1.6;
}

h2 {
  color: #34495e;
  margin: 0 0 15px 0;
  font-size: 20px;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin-bottom: 15px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.config-item label {
  font-weight: 500;
  color: #555;
}

.config-item input[type="checkbox"] {
  width: 18px;
  height: 18px;
}

.config-item input[type="range"] {
  flex: 1;
}

.config-item input[type="password"] {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.demo-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary-btn, .secondary-btn, .danger-btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.primary-btn {
  background: #3498db;
  color: white;
}

.primary-btn:hover:not(:disabled) {
  background: #2980b9;
}

.secondary-btn {
  background: #95a5a6;
  color: white;
}

.secondary-btn:hover:not(:disabled) {
  background: #7f8c8d;
}

.danger-btn {
  background: #e74c3c;
  color: white;
}

.danger-btn:hover:not(:disabled) {
  background: #c0392b;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.status-card {
  background: #f8f9fa;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.status-card h3 {
  margin: 0 0 12px 0;
  color: #495057;
  font-size: 16px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  padding: 4px 0;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-item span {
  color: #666;
  font-size: 14px;
}

.stat-item strong {
  color: #2c3e50;
  font-weight: 600;
}

.message-container {
  height: 400px;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  overflow: hidden;
}

.log-container {
  height: 200px;
  overflow-y: auto;
  background: #1a1a1a;
  color: #e0e0e0;
  padding: 12px;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  line-height: 1.4;
}

.log-item {
  margin-bottom: 4px;
  display: flex;
  gap: 8px;
}

.log-time {
  color: #888;
  min-width: 70px;
}

.log-type {
  min-width: 60px;
  font-weight: bold;
}

.log-item.info .log-type { color: #3498db; }
.log-item.success .log-type { color: #27ae60; }
.log-item.warning .log-type { color: #f39c12; }
.log-item.error .log-type { color: #e74c3c; }

.log-message {
  flex: 1;
}
</style> 