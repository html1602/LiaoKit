<template>
  <div class="quick-start-example">
    <h1>🚀 流式输入+AI适配 快速开始</h1>
    <p class="description">
      这是一个最简单的示例，展示如何在LiaoKit中使用流式输入与AI适配器。
    </p>
    
    <!-- 配置区域 -->
    <div class="config-section">
      <div class="config-item">
        <label>API Key:</label>
        <input 
          v-model="apiKey" 
          type="password" 
          placeholder="请输入通义千问API Key"
        />
      </div>
      <div class="config-item">
        <label>
          <input v-model="enableAdapter" type="checkbox" />
          启用AI适配器
        </label>
      </div>
      <div class="config-item">
        <label>
          <input v-model="skipUserMessages" type="checkbox" />
          跳过用户消息适配
        </label>
      </div>
    </div>
    
    <!-- 操作按钮 -->
    <div class="action-section">
      <button @click="sendUserMessage" class="btn">
        发送用户消息
      </button>
      <button @click="startAIReply" :disabled="!apiKey && enableAdapter" class="btn primary">
        开始AI流式回复
      </button>
      <button @click="clearAll" class="btn secondary">
        清空
      </button>
    </div>
    
    <!-- 消息显示区域 -->
    <div class="message-container">
      <LiaoMessageList
        :messages="messages"
        :use-ai-adapter="enableAdapter"
        :skip-user-message-adapter="skipUserMessages"
        :ai-adapter-options="adapterOptions"
        :show-avatar="true"
        :show-name="true"
        :show-time="true"
        @adapter-success="handleAdapterSuccess"
        @adapter-error="handleAdapterError"
      />
    </div>
    
    <!-- 统计信息 -->
    <div class="stats-section" v-if="stats.total > 0">
      <h3>📊 实时统计</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span>总消息:</span>
          <strong>{{ stats.total }}</strong>
        </div>
        <div class="stat-item">
          <span>已处理:</span>
          <strong>{{ stats.processed }}</strong>
        </div>
        <div class="stat-item">
          <span>已跳过:</span>
          <strong>{{ stats.skipped }}</strong>
        </div>
        <div class="stat-item">
          <span>跳过率:</span>
          <strong>{{ stats.skipRate }}%</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import LiaoMessageList from '../components/LiaoMessageList/LiaoMessageList.vue';
import {
  createStreamingManager,
  StreamingHelper,
  type StreamingMessage
} from '../utils/streaming';

// 基础状态
const messages = ref<StreamingMessage[]>([]);
const apiKey = ref('');
const enableAdapter = ref(true);
const skipUserMessages = ref(true);

// 创建流式管理器
const streamingManager = createStreamingManager(messages);

// 统计数据
const stats = ref({
  total: 0,
  processed: 0,
  skipped: 0,
  skipRate: 0
});

// 消息ID计数器
let messageIdCounter = 0;
const generateId = () => `msg_${++messageIdCounter}_${Date.now()}`;

// AI适配器配置
const adapterOptions = computed(() => ({
  apiKey: apiKey.value,
  model: 'qwen-plus',
  enableCache: true,
  timeoutMs: 10000
}));

// 发送用户消息
const sendUserMessage = () => {
  const userTexts = [
    '你好，请介绍一下你的功能',
    '能帮我分析一下这个问题吗？',
    '我想了解更多技术细节',
    '这个方案的优势是什么？',
    '谢谢你的详细回答！'
  ];
  
  const randomText = userTexts[Math.floor(Math.random() * userTexts.length)];
  
  const userMessage: StreamingMessage = {
    id: generateId(),
    content: randomText,
    isSelf: true,
    name: '用户',
    time: new Date(),
    status: 'sent',
    type: 'text'
  };
  
  messages.value.push(userMessage);
  updateStats();
};

// 开始AI流式回复
const startAIReply = async () => {
  if (enableAdapter.value && !apiKey.value) {
    alert('请先配置API Key');
    return;
  }
  
  // 创建AI流式消息
  const aiMessageId = generateId();
  const aiMessage = streamingManager.createStreamingMessage({
    id: aiMessageId,
    isSelf: false,
    name: 'AI助手',
    avatar: '/ai-avatar.png'
  });
  
  streamingManager.addStreamingMessage(aiMessage);
  updateStats();
  
  // 模拟AI回复内容
  const aiResponses = [
    `我是LiaoKit的AI助手，很高兴为您服务！

LiaoKit是一个现代化的Vue3组件库，具有以下特色功能：

✨ 智能消息适配：支持AI自动格式转换
🚀 流式输出：实时显示内容，提升用户体验  
🎯 性能优化：减少90%+ API调用
💡 易于集成：零配置开箱即用

通过流式输出与AI适配的智能结合，我们实现了最佳的性能和用户体验！`,

    `关于技术实现，LiaoKit采用了创新的分层过滤策略：

第一层：跳过用户消息适配
第二层：跳过流式中的消息  
第三层：智能处理已完成的AI消息

这种设计带来了显著的性能提升：
• API调用减少90%+
• 响应速度提升80%+  
• 成本节省80%+
• 缓存效率提升60%+

同时保持了完美的向下兼容性！`,

    `LiaoKit的优势在于将复杂的技术封装为简单的API：

🔧 技术优势：
- 智能状态感知
- 自动消息适配  
- 完整错误处理
- 详细性能监控

👥 用户体验：
- 实时流式显示
- 无卡顿无延迟
- 格式自动统一
- 集成简单便捷

这使得开发者能够专注于业务逻辑，而不用担心底层的复杂性！`
  ];
  
  const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
  
  // 开始流式输出
  await StreamingHelper.simulateStreaming(
    streamingManager,
    aiMessageId,
    randomResponse,
    {
      chunkSize: 3,
      delay: 60,
      onComplete: () => {
        console.log('🎉 流式完成，触发AI适配');
        updateStats();
      }
    }
  );
};

// 清空所有内容
const clearAll = () => {
  messages.value = [];
  stats.value = {
    total: 0,
    processed: 0,
    skipped: 0,
    skipRate: 0
  };
};

// 更新统计信息
const updateStats = () => {
  stats.value.total = messages.value.length;
};

// 处理适配成功事件
const handleAdapterSuccess = (event: any) => {
  stats.value.processed = event.processed || 0;
  stats.value.skipped = event.skipped || 0;
  
  const total = stats.value.processed + stats.value.skipped;
  stats.value.skipRate = total > 0 ? 
    Math.round((stats.value.skipped / total) * 100) : 0;
  
  console.log('✅ AI适配成功:', event);
};

// 处理适配错误事件
const handleAdapterError = (event: any) => {
  console.error('❌ AI适配错误:', event);
  alert(`AI适配出错: ${event.error}`);
};
</script>

<style scoped>
.quick-start-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

h1 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 10px;
}

.description {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 1.5;
}

.config-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.config-item:last-child {
  margin-bottom: 0;
}

.config-item label {
  font-weight: 500;
  color: #555;
  min-width: 80px;
}

.config-item input[type="password"] {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.config-item input[type="checkbox"] {
  width: 16px;
  height: 16px;
  margin-right: 5px;
}

.action-section {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn:hover:not(:disabled) {
  border-color: #999;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn.primary {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.btn.primary:hover:not(:disabled) {
  background: #0056b3;
  border-color: #0056b3;
}

.btn.secondary {
  background: #6c757d;
  color: white;
  border-color: #6c757d;
}

.btn.secondary:hover:not(:disabled) {
  background: #545b62;
  border-color: #545b62;
}

.message-container {
  height: 400px;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
}

.stats-section {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.stats-section h3 {
  margin: 0 0 15px 0;
  color: #495057;
  font-size: 18px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 6px;
  border: 1px solid #dee2e6;
}

.stat-item span {
  font-size: 14px;
  color: #666;
  margin-bottom: 5px;
}

.stat-item strong {
  font-size: 18px;
  color: #2c3e50;
  font-weight: 600;
}

@media (max-width: 600px) {
  .action-section {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 