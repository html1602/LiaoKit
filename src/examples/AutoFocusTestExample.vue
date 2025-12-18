<template>
  <div class="auto-focus-test">
    <h1>🎯 自动聚焦功能测试</h1>
    <p>这个示例用于测试AI回复后的自动聚焦功能是否正常工作</p>
    
    <div class="test-controls">
      <button @click="simulateAIReply" :disabled="isReplying">模拟AI回复</button>
      <button @click="manualFocus">手动聚焦</button>
      <button @click="clearMessages">清空消息</button>
    </div>
    
    <div class="status-info">
      <p>输入锁定状态: {{ isLocked ? '已锁定' : '未锁定' }}</p>
      <p>锁定原因: {{ lockReason || '无' }}</p>
      <p>聚焦次数: {{ focusCount }}</p>
    </div>
    
    <div class="chat-window">
      <LiaoWindow
        ref="windowRef"
        title="自动聚焦测试"
        :width="'500px'"
        :height="'400px'"
        @input-lock-change="handleLockChange"
        @auto-focus-input="handleAutoFocusInput"
      >
        <LiaoMessageList :messages="messages" />
        <LiaoInputArea
          ref="inputAreaRef"
          v-model="inputText"
          placeholder="输入消息测试自动聚焦..."
          @send="handleSendMessage"
          @focus="handleInputFocus"
        />
      </LiaoWindow>
    </div>
    
    <div class="logs">
      <h3>操作日志:</h3>
      <div class="log-list">
        <div v-for="log in logs" :key="log.id" class="log-item">
          [{{ log.time }}] {{ log.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, nextTick } from 'vue';
import LiaoWindow from '../components/LiaoWindow/LiaoWindow.vue';
import LiaoMessageList from '../components/LiaoMessageList/LiaoMessageList.vue';
import LiaoInputArea from '../components/LiaoInputArea/LiaoInputArea.vue';
import type { LockReason } from '../types/session';

const windowRef = ref();
const inputAreaRef = ref();
const inputText = ref('');
const messages = ref<any[]>([]);
const isLocked = ref(false);
const lockReason = ref<LockReason>(null);
const isReplying = ref(false);
const focusCount = ref(0);
const logs = ref<Array<{ id: number; time: string; message: string }>>([]);

// 添加日志
const addLog = (message: string) => {
  const now = new Date();
  const time = now.toLocaleTimeString();
  logs.value.unshift({
    id: Date.now(),
    time,
    message
  });
  if (logs.value.length > 20) {
    logs.value = logs.value.slice(0, 20);
  }
};

// 处理锁定状态变化
const handleLockChange = (lockInfo: any) => {
  isLocked.value = lockInfo.locked;
  lockReason.value = lockInfo.reason;
  addLog(`输入锁定状态变化: ${lockInfo.locked ? '锁定' : '解锁'}, 原因: ${lockInfo.reason || '无'}`);
};

// 处理自动聚焦事件
const handleAutoFocusInput = () => {
  addLog('收到自动聚焦事件');
  if (inputAreaRef.value) {
    (inputAreaRef.value as any).focusInput();
    focusCount.value++;
    addLog('已执行自动聚焦');
  } else {
    addLog('错误: 无法找到输入区域引用');
  }
};

// 处理输入框聚焦
const handleInputFocus = () => {
  addLog('输入框获得焦点');
};

// 处理发送消息
const handleSendMessage = (message: string) => {
  if (!message.trim()) return;
  
  // 添加用户消息
  const userMessage = {
    id: `user-${Date.now()}`,
    content: message,
    isSelf: true,
    time: new Date(),
    status: 'sending'
  };
  
  messages.value.push(userMessage);
  inputText.value = '';
  addLog(`发送消息: ${message}`);
  
  // 更新用户消息状态为已发送
  nextTick(() => {
    userMessage.status = 'sent';
    addLog('用户消息状态更新为已发送');
  });
};

// 模拟AI回复
const simulateAIReply = async () => {
  if (isReplying.value) return;
  
  isReplying.value = true;
  addLog('开始模拟AI回复');
  
  // 锁定输入
  if (windowRef.value) {
    windowRef.value.lockInput('AI_REPLYING');
    addLog('已锁定输入 - AI回复中');
  }
  
  // 添加AI消息
  const aiMessage = {
    id: `ai-${Date.now()}`,
    content: '',
    isSelf: false,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    name: 'AI助手',
    time: new Date(),
    status: 'streaming'
  };
  
  messages.value.push(aiMessage);
  
  // 模拟流式回复
  const fullResponse = '这是一个测试回复，用于验证自动聚焦功能是否正常工作。';
  let currentText = '';
  
  for (let i = 0; i < fullResponse.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 50));
    currentText += fullResponse[i];
    aiMessage.content = currentText;
  }
  
  // 完成回复
  aiMessage.status = 'sent';
  addLog('AI回复完成，准备解锁输入');
  
  // 解锁输入（这应该触发自动聚焦）
  if (windowRef.value) {
    windowRef.value.unlockInput();
    addLog('已解锁输入 - 应该触发自动聚焦');
  }
  
  isReplying.value = false;
};

// 手动聚焦
const manualFocus = () => {
  if (inputAreaRef.value) {
    (inputAreaRef.value as any).focusInput();
    focusCount.value++;
    addLog('手动执行聚焦');
  }
};

// 清空消息
const clearMessages = () => {
  messages.value = [];
  logs.value = [];
  focusCount.value = 0;
  addLog('已清空消息和日志');
};

// 初始化
addLog('自动聚焦测试组件已加载');
</script>

<style scoped>
.auto-focus-test {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.test-controls {
  margin: 20px 0;
  display: flex;
  gap: 10px;
}

.test-controls button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.test-controls button:hover {
  background: #f5f5f5;
}

.test-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status-info {
  background: #f9f9f9;
  padding: 15px;
  border-radius: 4px;
  margin: 20px 0;
}

.status-info p {
  margin: 5px 0;
}

.chat-window {
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}

.logs {
  margin-top: 20px;
}

.log-list {
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  max-height: 200px;
  overflow-y: auto;
}

.log-item {
  font-family: monospace;
  font-size: 12px;
  margin: 2px 0;
  color: #666;
}
</style>