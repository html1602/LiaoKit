<template>
  <div class="auto-focus-example">
    <div class="example-container">
      <h1>🎯 输入框自动聚焦演示</h1>
      <p class="description">
        演示AI对话场景下输入锁定解除后的自动聚焦功能，提升用户体验。
      </p>
      
      <!-- 功能配置区 -->
      <div class="config-section">
        <h2>🛠️ 配置选项</h2>
        <div class="config-grid">
          <div class="config-item">
            <label>
              <input v-model="enableAutoFocus" type="checkbox" />
              启用自动聚焦
            </label>
          </div>
          <div class="config-item">
            <label>
              <input v-model="simulateAIDelay" type="checkbox" />
              模拟AI回复延迟
            </label>
          </div>
          <div class="config-item">
            <label>AI回复延迟 (ms):</label>
            <input v-model.number="aiReplyDelay" type="range" min="1000" max="5000" />
            <span>{{ aiReplyDelay }}ms</span>
          </div>
        </div>
      </div>
      
      <!-- 演示控制区 -->
      <div class="demo-section">
        <h2>🎮 演示控制</h2>
        <div class="demo-controls">
          <button @click="simulateAIChat" :disabled="isAIReplying" class="primary-btn">
            {{ isAIReplying ? '🤖 AI回复中...' : '🚀 开始AI对话' }}
          </button>
          <button @click="manualLockUnlock" :disabled="isAIReplying" class="secondary-btn">
            {{ isLocked ? '🔓 手动解锁' : '🔒 手动锁定' }}
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
            <h3>🔒 锁定状态</h3>
            <div class="stat-item">
              <span>输入锁定:</span>
              <strong :class="{ 'status-locked': isLocked, 'status-unlocked': !isLocked }">
                {{ isLocked ? '已锁定' : '已解锁' }}
              </strong>
            </div>
            <div class="stat-item">
              <span>锁定原因:</span>
              <strong>{{ lockReason || '无' }}</strong>
            </div>
            <div class="stat-item">
              <span>AI状态:</span>
              <strong :class="{ 'status-replying': isAIReplying }">
                {{ isAIReplying ? '回复中' : '空闲' }}
              </strong>
            </div>
          </div>
          
          <div class="status-card">
            <h3>🎯 聚焦统计</h3>
            <div class="stat-item">
              <span>自动聚焦次数:</span>
              <strong>{{ focusStats.autoFocus }}</strong>
            </div>
            <div class="stat-item">
              <span>手动聚焦次数:</span>
              <strong>{{ focusStats.manualFocus }}</strong>
            </div>
            <div class="stat-item">
              <span>解锁后聚焦:</span>
              <strong>{{ focusStats.unlockFocus }}</strong>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 聊天窗口 -->
      <div class="chat-container">
        <LiaoWindow
          ref="windowRef"
          title="AI助手"
          :default-session-mode="'AI'"
          :width="'100%'"
          :height="'400px'"
          @input-lock-change="handleLockChange"
          @auto-focus-input="handleAutoFocusInput"
        >
          <LiaoMessageList :messages="messages" />
          <LiaoInputArea
            ref="inputAreaRef"
            v-model="currentInput"
            placeholder="输入消息开始对话..."
            @send="handleSendMessage"
            @focus="handleInputFocus"
          />
        </LiaoWindow>
      </div>
      
      <!-- 日志区域 -->
      <div class="log-section">
        <h2>📝 操作日志</h2>
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
import { ref, computed, nextTick } from 'vue';
import LiaoWindow from '../components/LiaoWindow/LiaoWindow.vue';
import LiaoMessageList from '../components/LiaoMessageList/LiaoMessageList.vue';
import LiaoInputArea from '../components/LiaoInputArea/LiaoInputArea.vue';
import type { LockReason } from '../types/session';

// 响应式状态
const windowRef = ref();
const inputAreaRef = ref();
const messages = ref<any[]>([]);
const currentInput = ref('');
const enableAutoFocus = ref(true);
const simulateAIDelay = ref(true);
const aiReplyDelay = ref(2000);
const isAIReplying = ref(false);
const isLocked = ref(false);
const lockReason = ref<LockReason>(null);

// 统计数据
const focusStats = ref({
  autoFocus: 0,
  manualFocus: 0,
  unlockFocus: 0
});

// 日志
const logs = ref<Array<{
  id: number,
  time: string,
  type: 'info' | 'success' | 'warning' | 'error',
  message: string
}>>([]);

// 添加日志
const addLog = (type: 'info' | 'success' | 'warning' | 'error', message: string) => {
  const now = new Date();
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
  
  logs.value.unshift({
    id: Date.now(),
    time,
    type,
    message
  });
  
  // 限制日志数量
  if (logs.value.length > 50) {
    logs.value = logs.value.slice(0, 50);
  }
};

// 处理发送消息
const handleSendMessage = async (message: string) => {
  if (!message.trim()) return;
  
  // 添加用户消息
  messages.value.push({
    id: Date.now(),
    content: message,
    isSelf: true,
    time: new Date(),
    status: 'sent'
  });
  
  addLog('info', `用户发送消息: ${message}`);
  
  // 清空输入
  currentInput.value = '';
  
  // 开始AI对话流程
  await simulateAIChat();
};

// 模拟AI对话
const simulateAIChat = async () => {
  if (isAIReplying.value) return;
  
  isAIReplying.value = true;
  
  // 锁定输入
  if (windowRef.value) {
    windowRef.value.lockInput('AI_REPLYING');
    addLog('warning', 'AI开始回复，输入已锁定');
  }
  
  try {
    // 模拟AI思考时间
    if (simulateAIDelay.value) {
      await new Promise(resolve => setTimeout(resolve, aiReplyDelay.value));
    }
    
    // 添加AI回复
    const aiResponses = [
      '我理解您的问题，让我为您详细解答...',
      '这是一个很好的问题，根据我的分析...',
      '感谢您的提问，我的建议是...',
      '基于您提供的信息，我认为...',
      '让我从几个角度来回答您的问题...'
    ];
    
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    messages.value.push({
      id: Date.now(),
      content: randomResponse,
      isSelf: false,
      name: 'AI助手',
      avatar: '🤖',
      time: new Date(),
      status: 'sent'
    });
    
    addLog('success', `AI回复完成: ${randomResponse.substring(0, 20)}...`);
    
  } catch (error) {
    addLog('error', `AI回复失败: ${error}`);
  } finally {
    // 解锁输入
    if (windowRef.value) {
      windowRef.value.unlockInput();
      addLog('success', 'AI回复完成，输入已解锁');
    }
    
    isAIReplying.value = false;
  }
};

// 手动锁定/解锁
const manualLockUnlock = () => {
  if (!windowRef.value) return;
  
  if (isLocked.value) {
    windowRef.value.unlockInput();
    addLog('info', '手动解锁输入');
  } else {
    windowRef.value.lockInput('CUSTOM');
    addLog('info', '手动锁定输入');
  }
};

// 清空消息
const clearMessages = () => {
  messages.value = [];
  logs.value = [];
  focusStats.value = {
    autoFocus: 0,
    manualFocus: 0,
    unlockFocus: 0
  };
  addLog('info', '清空所有消息和日志');
};

// 处理锁定状态变化
const handleLockChange = ({ locked, reason }: { locked: boolean, reason: LockReason }) => {
  isLocked.value = locked;
  lockReason.value = reason;
  
  if (locked) {
    addLog('warning', `输入已锁定: ${reason}`);
  } else {
    addLog('success', '输入已解锁');
  }
};

// 处理自动聚焦
const handleAutoFocusInput = () => {
  if (enableAutoFocus.value && inputAreaRef.value) {
    nextTick(() => {
      inputAreaRef.value.focusInput();
      focusStats.value.autoFocus++;
      focusStats.value.unlockFocus++;
      addLog('success', '自动聚焦输入框');
    });
  } else {
    addLog('info', '自动聚焦已禁用');
  }
};

// 处理手动聚焦
const handleInputFocus = () => {
  focusStats.value.manualFocus++;
  addLog('info', '手动聚焦输入框');
};
</script>

<style lang="scss" scoped>
.auto-focus-example {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.example-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

h1 {
  color: #2c3e50;
  margin: 0;
  font-size: 28px;
  font-weight: 600;
}

.description {
  color: #7f8c8d;
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
}

.config-section,
.demo-section,
.status-section,
.log-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  color: #34495e;
  margin: 0 0 16px 0;
  font-size: 20px;
  font-weight: 600;
}

.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.config-item {
  display: flex;
  align-items: center;
  gap: 8px;
  
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    color: #2c3e50;
  }
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
  
  input[type="range"] {
    flex: 1;
    margin: 0 8px;
  }
  
  span {
    min-width: 60px;
    font-weight: 600;
    color: #3498db;
  }
}

.demo-controls {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.primary-btn,
.secondary-btn,
.danger-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.primary-btn {
  background: #3498db;
  color: white;
  
  &:hover:not(:disabled) {
    background: #2980b9;
  }
}

.secondary-btn {
  background: #95a5a6;
  color: white;
  
  &:hover:not(:disabled) {
    background: #7f8c8d;
  }
}

.danger-btn {
  background: #e74c3c;
  color: white;
  
  &:hover:not(:disabled) {
    background: #c0392b;
  }
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.status-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  
  h3 {
    margin: 0 0 12px 0;
    color: #2c3e50;
    font-size: 16px;
  }
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  
  span {
    color: #7f8c8d;
  }
  
  strong {
    color: #2c3e50;
    
    &.status-locked {
      color: #e74c3c;
    }
    
    &.status-unlocked {
      color: #27ae60;
    }
    
    &.status-replying {
      color: #f39c12;
    }
  }
}

.chat-container {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 12px;
}

.log-item {
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 14px;
  
  &.info {
    color: #3498db;
  }
  
  &.success {
    color: #27ae60;
  }
  
  &.warning {
    color: #f39c12;
  }
  
  &.error {
    color: #e74c3c;
  }
}

.log-time {
  color: #95a5a6;
  font-family: monospace;
  min-width: 70px;
}

.log-type {
  font-weight: 600;
  min-width: 60px;
}

.log-message {
  flex: 1;
}
</style>