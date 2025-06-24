<template>
  <div class="ai-message-adapter-example">
    <h2>AI 消息格式适配示例</h2>
    
    <!-- 配置警告 -->
    <div v-if="!tempApiKey" class="api-key-warning">
      <div class="warning-content">
        <LiaoIcon name="warning" class="warning-icon" />
        <div class="warning-text">
          <h4>⚠️ API Key 未配置</h4>
          <p>要使用 AI 适配功能，请先配置您的通义千问 API Key。</p>
          <p><strong>重要：</strong>请勿在生产环境中将 API Key 硬编码到前端代码！</p>
          <a href="/Docs/Security/ApiKeySafety.md" target="_blank">查看安全配置指南 →</a>
        </div>
      </div>
      <div class="api-key-input">
        <input 
          v-model="tempApiKey" 
          type="password" 
          placeholder="请输入您的 API Key (sk-xxxxxx)"
          @keyup.enter="setApiKey"
        />
        <button @click="setApiKey" :disabled="!tempApiKey.trim()">
          设置 API Key
        </button>
      </div>
    </div>
    
    <!-- 控制面板 -->
    <div class="control-panel">
      <div class="control-group">
        <label>
          <input 
            type="checkbox" 
            v-model="useAiAdapter" 
          />
          启用 AI 适配
        </label>
      </div>
      
      <div class="control-group">
        <label>
          <input 
            type="checkbox" 
            v-model="enableCache" 
          />
          启用缓存
        </label>
      </div>
      
      <div class="control-group">
        <label>
          超时时间 (ms):
          <input 
            type="number" 
            v-model.number="timeout" 
            min="1000" 
            max="30000" 
            step="1000"
          />
        </label>
      </div>
      
      <div class="control-group">
        <button @click="addTestMessage" :disabled="adding">
          {{ adding ? '添加中...' : '添加测试消息' }}
        </button>
        <button @click="clearMessages">清空消息</button>
        <button @click="clearCache">清空缓存</button>
      </div>
    </div>
    
    <!-- 统计信息 -->
    <div class="stats-panel" v-if="useAiAdapter">
      <h3>适配统计</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">处理总数:</span>
          <span class="stat-value">{{ stats.totalProcessed }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">成功数:</span>
          <span class="stat-value">{{ stats.successCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">失败数:</span>
          <span class="stat-value">{{ stats.failureCount }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">缓存命中:</span>
          <span class="stat-value">{{ stats.cacheHits }}</span>
        </div>
      </div>
    </div>
    
    <!-- 原始消息输入 -->
    <div class="input-panel">
      <h3>原始消息格式</h3>
      <textarea 
        v-model="rawMessageInput" 
        placeholder="输入原始消息JSON格式，例如: {&quot;msg&quot;: &quot;你好&quot;, &quot;from&quot;: &quot;user&quot;, &quot;timestamp&quot;: 1640995200000}"
        rows="4"
      ></textarea>
      <button @click="addCustomMessage" :disabled="!rawMessageInput">添加自定义消息</button>
    </div>
    
    <!-- 消息列表 -->
    <div class="message-list-container">
      <LiaoMessageList
        ref="messageListRef"
        :messages="messages"
        :use-ai-adapter="useAiAdapter"
        :ai-adapter-options="aiAdapterOptions"
        :custom-format="customFormatFunction"
        :enable-adapter-cache="enableCache"
        :adapter-timeout="timeout"
        @adapter-success="handleAdapterSuccess"
        @adapter-error="handleAdapterError"
        @adapter-fallback="handleAdapterFallback"
      />
    </div>
    
    <!-- 事件日志 -->
    <div class="log-panel">
      <h3>事件日志</h3>
      <div class="log-container">
        <div 
          v-for="(log, index) in logs" 
          :key="index" 
          :class="['log-item', `log-${log.type}`]"
        >
          <span class="log-time">{{ formatTime(log.time) }}</span>
          <span class="log-type">{{ log.type }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
      <button @click="clearLogs">清空日志</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import LiaoMessageList from '../components/LiaoMessageList/LiaoMessageList.vue';
import type { AiAdapterOptions, CustomFormatFunction } from '../ai-adapter';

// 响应式状态
const useAiAdapter = ref(false); // 默认禁用，等用户配置API Key后再启用
const enableCache = ref(true);
const timeout = ref(5000);
const messages = ref<any[]>([]);
const rawMessageInput = ref('');
const adding = ref(false);
const tempApiKey = ref('');

// 统计信息
const stats = ref({
  totalProcessed: 0,
  successCount: 0,
  failureCount: 0,
  cacheHits: 0
});

// 日志
const logs = ref<Array<{
  time: Date;
  type: 'info' | 'success' | 'error' | 'warning';
  message: string;
}>>([]);

// AI 适配器配置
const aiAdapterOptions = computed<AiAdapterOptions>(() => ({
  enabled: useAiAdapter.value,
  enableCache: enableCache.value,
  timeoutMs: timeout.value,
  apiKey: tempApiKey.value,
  model: 'qwen-turbo-2025-04-28'
}));

// 自定义格式化函数（兜底方案）
const customFormatFunction: CustomFormatFunction = (rawMessage: any) => {
  if (typeof rawMessage === 'string') {
    return {
      content: rawMessage,
      type: 'text',
      isSelf: false,
      time: Date.now()
    };
  }
  
  if (rawMessage && typeof rawMessage === 'object') {
    return {
      content: rawMessage.content || rawMessage.text || rawMessage.msg || JSON.stringify(rawMessage),
      type: 'text',
      isSelf: rawMessage.isSelf || rawMessage.role === 'user',
      time: rawMessage.time || rawMessage.timestamp || Date.now(),
      id: rawMessage.id || Date.now()
    };
  }
  
  return null;
};

// 测试消息格式
const testMessages = [
  // 标准格式
  {
    content: '这是标准格式的消息',
    type: 'text',
    isSelf: true,
    time: Date.now()
  },
  // 需要适配的格式 1
  {
    msg: '你好，我是客户',
    from: 'customer',
    timestamp: Date.now() - 60000,
    user_id: '12345'
  },
  // 需要适配的格式 2
  {
    text: '这是客服回复',
    role: 'assistant',
    created_at: Date.now() - 30000,
    agent_name: '客服小王',
    avatar_url: 'https://example.com/avatar.jpg'
  },
  // 需要适配的格式 3
  {
    message: '系统通知：您的订单已发货',
    type: 'system',
    date: new Date().toISOString(),
    notification_id: 'notify_001'
  },
  // 复杂格式
  {
    data: {
      content: '这是嵌套数据结构',
      metadata: {
        sender: 'user',
        priority: 'high'
      }
    },
    event_time: Date.now() - 120000
  },
  // 图片消息格式
  {
    image_url: 'https://example.com/image.jpg',
    alt_text: '用户上传的图片',
    uploader: 'user_123',
    upload_time: Date.now() - 90000
  }
];

// 添加测试消息
const addTestMessage = async () => {
  if (adding.value) return;
  
  adding.value = true;
  
  try {
    const randomMessage = testMessages[Math.floor(Math.random() * testMessages.length)];
    const messageWithId = {
      ...randomMessage,
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    messages.value.push(messageWithId);
    
    addLog('info', `添加了测试消息: ${JSON.stringify(messageWithId)}`);
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
  } finally {
    adding.value = false;
  }
};

// 添加自定义消息
const addCustomMessage = () => {
  try {
    const parsed = JSON.parse(rawMessageInput.value);
    const messageWithId = {
      ...parsed,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
    
    messages.value.push(messageWithId);
    addLog('info', `添加了自定义消息: ${rawMessageInput.value}`);
    rawMessageInput.value = '';
    
  } catch (error) {
    addLog('error', `自定义消息格式错误: ${error instanceof Error ? error.message : '未知错误'}`);
  }
};

// 清空消息
const clearMessages = () => {
  messages.value = [];
  addLog('info', '清空了所有消息');
};

// 清空缓存
const clearCache = () => {
  // TODO: 调用组件的清空缓存方法
  addLog('info', '清空了适配器缓存');
};

// 事件处理函数
const handleAdapterSuccess = (event: any) => {
  stats.value = { ...event.stats };
  addLog('success', `AI 适配成功: 处理 ${event.processed} 条消息，缓存命中 ${event.cached} 条`);
};

const handleAdapterError = (event: any) => {
  addLog('error', `AI 适配失败: ${event.error}`);
};

const handleAdapterFallback = (event: any) => {
  addLog('warning', `AI 适配回退: ${event.failedCount}/${event.total} 条消息使用兜底方案`);
};

// 工具函数
const addLog = (type: 'info' | 'success' | 'error' | 'warning', message: string) => {
  logs.value.unshift({
    time: new Date(),
    type,
    message
  });
  
  // 限制日志条数
  if (logs.value.length > 100) {
    logs.value = logs.value.slice(0, 100);
  }
};

const clearLogs = () => {
  logs.value = [];
};

const formatTime = (time: Date) => {
  return time.toLocaleTimeString();
};

// 设置 API Key
const setApiKey = () => {
  if (tempApiKey.value.trim()) {
    addLog('info', `API Key 已设置，自动启用 AI 适配器`);
    useAiAdapter.value = true; // 设置API Key后自动启用适配器
  } else {
    addLog('warning', 'API Key 不能为空');
  }
};

// 初始化
onMounted(() => {
  addLog('info', 'AI 消息适配示例已加载');
  
  // 添加一些初始消息
  setTimeout(() => {
    addTestMessage();
  }, 1000);
});
</script>

<style lang="scss" scoped>
.ai-message-adapter-example {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  
  h2, h3 {
    margin-bottom: 16px;
    color: #333;
  }
}

.control-panel {
  background: #f5f5f5;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  
  .control-group {
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    
    label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
    }
    
    input[type="checkbox"] {
      cursor: pointer;
    }
    
    input[type="number"] {
      padding: 4px 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
      width: 100px;
    }
    
    button {
      padding: 8px 16px;
      background: #1890ff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover:not(:disabled) {
        background: #40a9ff;
      }
      
      &:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
    }
  }
}

.stats-panel {
  background: #f0f9ff;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    
    .stat-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 12px;
      background: white;
      border-radius: 4px;
      border: 1px solid #e1f5fe;
      
      .stat-label {
        color: #666;
      }
      
      .stat-value {
        font-weight: bold;
        color: #1890ff;
      }
    }
  }
}

.input-panel {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  
  textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-family: monospace;
    resize: vertical;
    margin-bottom: 12px;
  }
  
  button {
    padding: 8px 16px;
    background: #52c41a;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover:not(:disabled) {
      background: #73d13d;
    }
    
    &:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
  }
}

.message-list-container {
  height: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 20px;
  overflow: hidden;
}

.log-panel {
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
  
  .log-container {
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid #eee;
    border-radius: 4px;
    padding: 8px;
    background: white;
    margin-bottom: 12px;
    
    .log-item {
      display: flex;
      gap: 12px;
      padding: 4px 0;
      border-bottom: 1px solid #f0f0f0;
      font-size: 14px;
      
      &:last-child {
        border-bottom: none;
      }
      
      .log-time {
        color: #999;
        font-size: 12px;
        min-width: 80px;
      }
      
      .log-type {
        min-width: 60px;
        font-weight: bold;
        
        &.log-info { color: #1890ff; }
        &.log-success { color: #52c41a; }
        &.log-error { color: #ff4d4f; }
        &.log-warning { color: #faad14; }
      }
      
      .log-message {
        flex: 1;
        word-break: break-all;
      }
    }
  }
  
  button {
    padding: 6px 12px;
    background: #ff4d4f;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    
    &:hover {
      background: #ff7875;
    }
  }
}

.api-key-warning {
  background: #fffbe6;
  border: 1px solid #ffe58f;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 20px;
  
  .warning-content {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .warning-icon {
      color: #faad14;
    }
    
    .warning-text {
      h4 {
        margin-bottom: 8px;
      }
      
      p {
        margin: 8px 0;
      }
      
      a {
        color: #1890ff;
        text-decoration: none;
      }
    }
  }
  
  .api-key-input {
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 12px;
    
    input {
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    button {
      padding: 8px 16px;
      background: #1890ff;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      
      &:hover:not(:disabled) {
        background: #40a9ff;
      }
      
      &:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
    }
  }
}
</style> 