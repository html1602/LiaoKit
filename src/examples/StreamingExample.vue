<template>
  <div class="streaming-example">
    <div class="streaming-container">
      <h1>流式输出功能演示</h1>
      <p class="description">体验 LiaoKit 的流式输出功能，包括基础流式效果和 SSE 流式传输。</p>
      
      <!-- 功能选项卡 -->
      <div class="streaming-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          class="tab-button"
          :class="{ active: activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>
      
      <!-- 基础流式演示 -->
      <div v-if="activeTab === 'basic'" class="demo-section">
        <h2>基础流式效果</h2>
        <div class="demo-controls">
          <button @click="demonstrateTypewriter" :disabled="isDemo">打字机效果</button>
          <button @click="demonstrateWordByWord" :disabled="isDemo">逐词输出</button>
          <button @click="demonstrateFastStreaming" :disabled="isDemo">快速流式</button>
          <button @click="demonstrateChunkedStreaming" :disabled="isDemo">分块输出</button>
          <button @click="clearMessages" class="clear-btn">清空消息</button>
        </div>
        
        <div class="parameter-controls">
          <div class="control-group">
            <label>打字速度 (ms):</label>
            <input v-model.number="typeSpeed" type="range" min="20" max="200" />
            <span>{{ typeSpeed }}ms</span>
          </div>
          <div class="control-group">
            <label>分块大小:</label>
            <input v-model.number="chunkSize" type="range" min="1" max="10" />
            <span>{{ chunkSize }} 字符</span>
          </div>
        </div>
      </div>
      
      <!-- SSE流式演示 -->
      <div v-if="activeTab === 'sse'" class="demo-section">
        <h2>SSE 流式传输</h2>
        <div class="demo-controls">
          <button @click="demonstrateSSEReal" :disabled="isDemo">真实 SSE 连接</button>
          <button @click="demonstrateSSEMock" :disabled="isDemo">模拟 SSE 流式</button>
          <button @click="stopSSE" :disabled="!sseManager">停止 SSE</button>
          <button @click="clearMessages" class="clear-btn">清空消息</button>
        </div>
        
        <div class="sse-status" v-if="sseManager">
          <span class="status-label">连接状态:</span>
          <span :class="['status-value', connectionState]">{{ connectionStateText }}</span>
        </div>
        
        <div class="sse-config">
          <div class="control-group">
            <label>SSE 端点:</label>
            <input v-model="sseEndpoint" placeholder="ws://localhost:3001/api/stream" />
          </div>
          <div class="control-group">
            <label>重连次数:</label>
            <input v-model.number="maxRetries" type="number" min="1" max="10" />
          </div>
        </div>
      </div>
      
      <!-- 高级配置 -->
      <div v-if="activeTab === 'advanced'" class="demo-section">
        <h2>高级配置与状态监控</h2>
        
        <div class="status-monitor">
          <h3>当前状态</h3>
          <div class="status-grid">
            <div class="status-item">
              <label>流式消息数量:</label>
              <span>{{ streamingStats.totalMessages }}</span>
            </div>
            <div class="status-item">
              <label>正在流式的消息:</label>
              <span>{{ streamingStats.activeStreaming }}</span>
            </div>
            <div class="status-item">
              <label>总字符数:</label>
              <span>{{ streamingStats.totalCharacters }}</span>
            </div>
            <div class="status-item">
              <label>平均流式速度:</label>
              <span>{{ streamingStats.averageSpeed }}ms/字符</span>
            </div>
          </div>
          
          <div class="debug-message-list" style="margin-top: 20px; max-height: 200px; overflow-y: auto; background: #f8f9fa; padding: 10px; border-radius: 4px;">
            <h4 style="margin: 0 0 10px 0; font-size: 14px;">调试 - 消息列表:</h4>
            <div v-for="(msg, index) in messages" :key="msg.id" style="font-size: 12px; margin-bottom: 5px; padding: 5px; background: white; border-radius: 3px;">
              <strong>{{ index + 1 }}.</strong> 
              ID: {{ msg.id }} | 
              类型: {{ msg.type }} | 
              长度: {{ msg.content.length }} | 
              内容: {{ msg.content.slice(0, 30) }}...
            </div>
          </div>
        </div>
        
        <div class="debug-tools">
          <h3>调试工具</h3>
          <button @click="generateDebugMessage">生成调试消息</button>
          <button @click="addMultipleMessages">批量添加消息测试滚动</button>
          <button @click="testErrorHandling">测试错误处理</button>
          <button @click="showStreamingAPI">显示 API 信息</button>
        </div>
      </div>
      
      <!-- 消息列表容器 -->
      <div class="message-container">
        <LiaoMessageList
          ref="messageListRef"
          :messages="messages"
          :show-avatar="true"
          :show-name="true"
          :show-time="true"
          :scroll-to-bottom="true"
          @quick-action-click="handleQuickAction"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import LiaoMessageList from '../components/LiaoMessageList/LiaoMessageList.vue';
import {
  createStreamingManager,
  StreamingMessageManager,
  StreamingHelper,
  type StreamingMessage
} from '../utils/streaming';
import {
  createSSEStreaming,
  SSEStreamingManager,
  type SSEConnectionState
} from '../utils/streaming-sse';

// 选项卡数据
const tabs = [
  { key: 'basic', label: '基础流式' },
  { key: 'sse', label: 'SSE 流式' },
  { key: 'advanced', label: '高级配置' }
];

// 响应式状态
const activeTab = ref('basic');
const messages = ref<StreamingMessage[]>([]);
const isDemo = ref(false);
const messageIdCounter = ref(0);

// 流式配置参数
const typeSpeed = ref(50);
const chunkSize = ref(3);

// SSE 相关状态
const sseManager = ref<SSEStreamingManager | null>(null);
const connectionState = ref<SSEConnectionState>('disconnected');
const sseEndpoint = ref('ws://localhost:3001/api/stream');
const maxRetries = ref(3);

// 创建流式管理器
const streamingManager = createStreamingManager(messages);

// 计算属性
const connectionStateText = computed(() => {
  const stateMap = {
    connecting: '连接中',
    connected: '已连接',
    disconnected: '已断开',
    error: '连接错误',
    closed: '已关闭'
  };
  return stateMap[connectionState.value] || '未知状态';
});

const streamingStats = computed(() => {
  const totalMessages = messages.value.length;
  const activeStreaming = messages.value.filter(msg => msg.status === 'streaming').length;
  const totalCharacters = messages.value.reduce((sum, msg) => sum + msg.content.length, 0);
  const averageSpeed = typeSpeed.value; // 简化计算
  
  return {
    totalMessages,
    activeStreaming,
    totalCharacters,
    averageSpeed
  };
});

// 生成唯一消息ID
const generateMessageId = () => `msg_${++messageIdCounter.value}_${Date.now()}`;

// 添加系统消息
const addSystemMessage = (content: string) => {
  const message: StreamingMessage = {
    id: generateMessageId(),
    content,
    type: 'text',
    isSelf: false,
    time: new Date(),
    status: 'sent',
    name: '系统',
    avatar: ''
  };
  messages.value.push(message);
  console.log('添加系统消息:', message);
  console.log('当前消息列表长度:', messages.value.length);
};

// 创建流式消息
const createStreamingMessage = (content: string = '') => {
  const message = streamingManager.createStreamingMessage({
    id: generateMessageId(),
    initialContent: content,
    isSelf: false,
    avatar: '/ai-avatar.png',
    name: 'AI助手'
  });
  streamingManager.addStreamingMessage(message);
  return message.id;
};

// 演示打字机效果
const demonstrateTypewriter = async () => {
  if (isDemo.value) return;
  isDemo.value = true;
  
  try {
    addSystemMessage('🤖 开始演示打字机效果...');
    
    const messageId = createStreamingMessage();
    const text = '这是一个打字机效果的演示。每个字符会逐一显示，就像真人在打字一样。您可以调整速度来体验不同的效果。';
    
    await StreamingHelper.typewriterEffect(streamingManager, messageId, text, typeSpeed.value);
    
    addSystemMessage('✅ 打字机效果演示完成');
  } catch (error) {
    console.error('打字机效果演示失败:', error);
    addSystemMessage('❌ 打字机效果演示失败');
  } finally {
    isDemo.value = false;
  }
};

// 演示逐词输出
const demonstrateWordByWord = async () => {
  if (isDemo.value) return;
  isDemo.value = true;
  
  try {
    addSystemMessage('🤖 开始演示逐词输出...');
    
    const messageId = createStreamingMessage();
    const text = '逐词输出 是另一种 流式效果 每个词组 会一次性 显示出来 适合用于 长文本 的快速 阅读场景';
    
    await StreamingHelper.wordByWordStreaming(streamingManager, messageId, text, 300);
    
    addSystemMessage('✅ 逐词输出演示完成');
  } catch (error) {
    console.error('逐词输出演示失败:', error);
    addSystemMessage('❌ 逐词输出演示失败');
  } finally {
    isDemo.value = false;
  }
};

// 演示快速流式
const demonstrateFastStreaming = async () => {
  if (isDemo.value) return;
  isDemo.value = true;
  
  try {
    addSystemMessage('🤖 开始演示快速流式输出...');
    
    const messageId = createStreamingMessage();
    const text = '快速流式输出适合显示较长的文本内容。这种模式下，文本会以较快的速度逐字符显示，给用户一种内容正在实时生成的感觉。这种效果常见于AI聊天机器人的回复场景。';
    
    await StreamingHelper.simulateStreaming(streamingManager, messageId, text, {
      chunkSize: 2,
      delay: 20,
      onChunk: (chunk, index) => {
        console.log(`快速流式: 第${index + 1}块 "${chunk}"`);
      }
    });
    
    addSystemMessage('✅ 快速流式输出演示完成');
  } catch (error) {
    console.error('快速流式演示失败:', error);
    addSystemMessage('❌ 快速流式演示失败');
  } finally {
    isDemo.value = false;
  }
};

// 演示分块输出
const demonstrateChunkedStreaming = async () => {
  if (isDemo.value) return;
  isDemo.value = true;
  
  try {
    addSystemMessage('🤖 开始演示分块输出...');
    
    const messageId = createStreamingMessage();
    const text = '分块输出可以按照指定的块大小来显示内容。这种方式适合模拟网络数据包的传输效果，或者用于显示代码、数据等结构化内容。';
    
    await StreamingHelper.simulateStreaming(streamingManager, messageId, text, {
      chunkSize: chunkSize.value,
      delay: 150,
      onChunk: (chunk, index) => {
        console.log(`分块输出: 第${index + 1}块 (${chunk.length}字符) "${chunk}"`);
      }
    });
    
    addSystemMessage('✅ 分块输出演示完成');
  } catch (error) {
    console.error('分块输出演示失败:', error);
    addSystemMessage('❌ 分块输出演示失败');
  } finally {
    isDemo.value = false;
  }
};

// 演示真实SSE连接
const demonstrateSSEReal = async () => {
  if (isDemo.value) return;
  isDemo.value = true;
  
  try {
    addSystemMessage(`🌐 尝试连接到 SSE 端点: ${sseEndpoint.value}`);
    
    const messageId = createStreamingMessage();
    
    sseManager.value = createSSEStreaming(
      streamingManager,
      {
        maxRetries: maxRetries.value,
        retryDelay: 1000,
        timeout: 10000
      },
      {
        onStateChange: (state) => {
          connectionState.value = state;
          console.log('SSE 连接状态变化:', state);
        },
        onOpen: () => {
          addSystemMessage('✅ SSE 连接已建立');
        },
        onError: (error) => {
          console.error('SSE 连接错误:', error);
          addSystemMessage('❌ SSE 连接失败: ' + (error as Error).message);
        },
        onClose: () => {
          addSystemMessage('🔌 SSE 连接已关闭');
        },
        onRetry: (attempt, maxRetries) => {
          addSystemMessage(`🔄 正在重连... (${attempt}/${maxRetries})`);
        }
      }
    );
    
    sseManager.value.startStreaming(sseEndpoint.value, messageId);
    
  } catch (error) {
    console.error('SSE 连接演示失败:', error);
    addSystemMessage('❌ SSE 连接演示失败: ' + (error as Error).message);
  } finally {
    isDemo.value = false;
  }
};

// 演示模拟SSE流式（细粒度 Markdown 流式展示）
const demonstrateSSEMock = async () => {
  if (isDemo.value) return;
  isDemo.value = true;
  
  try {
    addSystemMessage('🤖 开始模拟 SSE 流式传输（Markdown 打字效果演示）...');
    
    const messageId = createStreamingMessage();
    
    // 模拟 SSE Markdown 内容
    const markdownContent = [
      '# ⚡ SSE 流式 Markdown 示例',
      '',
      '这个示例演示了 **markstream-vue** 在流式输出下的渲染效果：',
      '',
      '- 内容按较小片段持续追加',
      '- 标题、列表、引用会逐步成型',
      '- 适合展示 AI 回复的「打字机」体验',
      '',
      '```ts',
      "function createStreamingDemo() {",
      "  const messageId = createStreamingMessage();",
      "  // 通过 appendToMessage 持续追加内容",
      "}",
      '```',
      '',
      '> 提示：可以切换到「基础流式」标签，体验不同流式策略。',
      '',
      '最后一行：**SSE 模拟流式传输完成！**'
    ].join('\n');
    
    // 将 Markdown 内容拆分为较小片段，模拟更细粒度的 SSE 推送
    const chunks: string[] = [];
    const chunkSizeForDemo = 8;
    for (let i = 0; i < markdownContent.length; i += chunkSizeForDemo) {
      chunks.push(markdownContent.slice(i, i + chunkSizeForDemo));
    }
    
    // 模拟连接状态变化
    connectionState.value = 'connecting';
    await new Promise(resolve => setTimeout(resolve, 500));
    
    connectionState.value = 'connected';
    addSystemMessage('✅ 模拟 SSE 连接已建立');
    
    // 逐片发送数据，形成打字效果
    for (let i = 0; i < chunks.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 60));
      streamingManager.appendToMessage(messageId, chunks[i]);
    }
    
    streamingManager.completeStreaming(messageId);
    connectionState.value = 'closed';
    addSystemMessage('✅ 模拟 SSE 流式 Markdown 传输完成');
    
  } catch (error) {
    console.error('模拟SSE演示失败:', error);
    addSystemMessage('❌ 模拟 SSE 演示失败');
    connectionState.value = 'error';
  } finally {
    isDemo.value = false;
  }
};

// 停止SSE连接
const stopSSE = () => {
  if (sseManager.value) {
    sseManager.value.stopStreaming();
    sseManager.value = null;
    connectionState.value = 'closed';
    addSystemMessage('🛑 SSE 连接已手动停止');
  }
};

// 清空消息
const clearMessages = () => {
  messages.value = [];
  addSystemMessage('🧹 消息列表已清空');
};

// 生成调试消息
const generateDebugMessage = () => {
  const debugInfo = {
    timestamp: new Date().toISOString(),
    messageCount: messages.value.length,
    streamingCount: messages.value.filter(msg => msg.status === 'streaming').length,
    userAgent: navigator.userAgent.slice(0, 50) + '...'
  };
  
  addSystemMessage(`🐛 调试信息: ${JSON.stringify(debugInfo, null, 2)}`);
};

// 批量添加消息测试滚动
const addMultipleMessages = () => {
  for (let i = 1; i <= 10; i++) {
    addSystemMessage(`📝 测试消息 ${i} - 这是用于测试滚动功能的消息。当消息数量增多时，消息列表应该能够正常滚动显示所有内容。`);
  }
  addSystemMessage('✅ 已添加10条测试消息，请检查滚动功能是否正常');
};

// 测试错误处理
const testErrorHandling = async () => {
  if (isDemo.value) return;
  isDemo.value = true;
  
  try {
    addSystemMessage('🧪 测试错误处理机制...');
    
    const messageId = createStreamingMessage('开始测试错误处理...');
    
    // 模拟错误
    await new Promise(resolve => setTimeout(resolve, 1000));
    streamingManager.setStreamingError(messageId, '这是一个模拟的错误信息');
    
    addSystemMessage('✅ 错误处理测试完成');
  } catch (error) {
    console.error('错误处理测试失败:', error);
    addSystemMessage('❌ 错误处理测试失败');
  } finally {
    isDemo.value = false;
  }
};

// 显示API信息
const showStreamingAPI = () => {
  const apiInfo = `
🔧 流式输出 API 信息:

核心类:
- StreamingMessageManager: 核心流式消息管理
- SSEStreamingManager: SSE流式传输管理
- StreamingHelper: 流式效果辅助工具

主要方法:
- appendToMessage(): 追加内容到消息
- completeStreaming(): 完成流式输出
- setStreamingError(): 设置错误状态
- typewriterEffect(): 打字机效果
- wordByWordStreaming(): 逐词输出

状态类型:
- streaming: 正在流式输出
- sent: 发送完成
- failed: 发送失败
- sending: 正在发送
  `;
  
  addSystemMessage(apiInfo);
};

// 处理快捷操作
const handleQuickAction = (action: any) => {
  console.log('快捷操作被触发:', action);
  addSystemMessage(`⚡ 快捷操作: ${action.text || action.label || '未知操作'}`);
};

// 组件挂载时的初始化
onMounted(() => {
  addSystemMessage('🎉 流式输出演示页面已加载');
  addSystemMessage('请选择左侧的演示功能开始体验');
  
  // 添加一些示例消息用于测试滚动
  addSystemMessage('📋 这是第一条测试消息');
  addSystemMessage('📋 这是第二条测试消息');
  addSystemMessage('📋 这是第三条测试消息');
  addSystemMessage('📋 您可以通过这些消息测试滚动功能');
  addSystemMessage('📋 当消息很多时，列表应该能够正常滚动');
});

// 组件卸载时的清理
onUnmounted(() => {
  if (sseManager.value) {
    sseManager.value.stopStreaming();
  }
});
</script>

<style lang="scss" scoped>
.streaming-example {
  min-height: 100vh;
  background-color: #f5f7fa;
  padding: 20px;
}

.streaming-container {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

h1 {
  text-align: center;
  padding: 30px 20px 10px;
  margin: 0;
  color: #333;
  font-size: 2.2rem;
}

.description {
  text-align: center;
  padding: 0 20px 20px;
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.streaming-tabs {
  display: flex;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.tab-button {
  flex: 1;
  padding: 15px 20px;
  background: none;
  border: none;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background-color: #e9ecef;
    color: #333;
  }
  
  &.active {
    color: #4080ff;
    background-color: white;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background-color: #4080ff;
    }
  }
}

.demo-section {
  padding: 30px;
  
  h2 {
    margin: 0 0 20px 0;
    color: #333;
    font-size: 1.5rem;
  }
}

.demo-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 20px;
  
  button {
    padding: 10px 20px;
    background-color: #4080ff;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover:not(:disabled) {
      background-color: #3070ef;
      transform: translateY(-1px);
    }
    
    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
      transform: none;
    }
    
    &.clear-btn {
      background-color: #dc3545;
      
      &:hover:not(:disabled) {
        background-color: #c82333;
      }
    }
  }
}

.parameter-controls {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  label {
    min-width: 120px;
    font-weight: 500;
    color: #333;
  }
  
  input[type="range"] {
    flex: 1;
    min-width: 200px;
  }
  
  input[type="text"], 
  input[type="number"] {
    flex: 1;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 0.9rem;
  }
  
  span {
    min-width: 60px;
    font-weight: 500;
    color: #666;
  }
}

.sse-status {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  
  .status-label {
    font-weight: 500;
    color: #333;
  }
  
  .status-value {
    padding: 4px 12px;
    border-radius: 4px;
    font-size: 0.9rem;
    font-weight: 500;
    
    &.connecting {
      background-color: #fff3cd;
      color: #856404;
    }
    
    &.connected {
      background-color: #d4edda;
      color: #155724;
    }
    
    &.disconnected {
      background-color: #f8d7da;
      color: #721c24;
    }
    
    &.error {
      background-color: #f5c6cb;
      color: #721c24;
    }
    
    &.closed {
      background-color: #e2e3e5;
      color: #383d41;
    }
  }
}

.sse-config {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.status-monitor {
  background-color: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  
  h3 {
    margin: 0 0 15px 0;
    color: #333;
  }
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e9ecef;
  
  label {
    font-weight: 500;
    color: #666;
  }
  
  span {
    font-weight: 600;
    color: #333;
  }
}

.debug-tools {
  background-color: #fff3cd;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #ffeaa7;
  
  h3 {
    margin: 0 0 15px 0;
    color: #856404;
  }
  
  button {
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 8px 16px;
    background-color: #ffc107;
    color: #212529;
    border: none;
    border-radius: 4px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background-color: #e0a800;
    }
  }
}

.message-container {
  height: 400px;
  border-top: 1px solid #e9ecef;
  background-color: #fafbfc;
  overflow: hidden;
  
  :deep(.liao-message-list) {
    height: 100%;
    overflow-y: auto;
    
    /* 自定义滚动条样式 */
    &::-webkit-scrollbar {
      width: 8px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #4080ff;
      border-radius: 4px;
      
      &:hover {
        background: #3070ef;
      }
    }
  }
  
  :deep(.liao-message-list-wrapper) {
    height: 100%;
  }
}

@media (max-width: 768px) {
  .streaming-container {
    margin: 10px;
    border-radius: 8px;
  }
  
  h1 {
    font-size: 1.8rem;
    padding: 20px 15px 10px;
  }
  
  .demo-section {
    padding: 20px 15px;
  }
  
  .demo-controls {
    flex-direction: column;
    
    button {
      width: 100%;
    }
  }
  
  .status-grid {
    grid-template-columns: 1fr;
  }
  
  .control-group {
    flex-direction: column;
    align-items: stretch;
    
    label {
      min-width: auto;
      margin-bottom: 5px;
    }
    
    input[type="range"] {
      min-width: auto;
    }
  }
  
  /* 移动端消息容器优化 */
  .message-container {
    height: 300px; /* 移动端稍微降低高度 */
  }
}
</style> 
