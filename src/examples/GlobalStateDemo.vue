<template>
  <div class="global-state-demo">
    <!-- 顶部控制栏 -->
    <div class="demo-header">
      <h2>🎛️ 全局对话状态与消息流管控演示</h2>
      <div class="quick-actions">
        <button @click="switchToAI" :disabled="sessionMode === 'AI'" class="btn btn-primary">
          🤖 切换到AI模式
        </button>
        <button @click="switchToHuman" :disabled="sessionMode === 'human'" class="btn btn-secondary">
          👥 切换到人工模式
        </button>
        <button @click="triggerEmergencyUnlock" class="btn btn-danger">
          🚨 紧急解锁
        </button>
        <button @click="clearLogs" class="btn btn-outline">
          🧹 清空日志
        </button>
      </div>
    </div>

    <!-- 主要演示区域 -->
    <div class="demo-content">
      <!-- 左侧：LiaoWindow 演示区域 -->
      <div class="demo-window-container">
        <LiaoWindow
          ref="windowRef"
          title="智能对话助手"
          :width="'100%'"
          :height="'600px'"
          :default-session-mode="'human'"
          :auto-unlock-timeout="15000"
          :enable-emergency-unlock="true"
          @session-mode-change="handleSessionModeChange"
          @input-lock-change="handleLockChange"
          @plugin-complete="handlePluginComplete"
          @plugin-cancel="handlePluginCancel"
          @plugin-error="handlePluginError"
          @emergency-unlock="handleEmergencyUnlock"
        >
          <template #default="{ 
            sessionMode: currentMode, 
            isInputLocked, 
            activePlugin, 
            lockReason,
            onLockInput,
            onUnlockInput
          }">
            <div class="message-and-input-container">
              <!-- 使用真实的LiaoMessageList组件 -->
              <LiaoMessageList
                ref="messageListRef"
                :messages="formattedMessages"
                :show-avatar="true"
                :show-name="true"
                :show-time="true"
                :loading="isAIThinking"
                empty-text="暂无消息，开始对话吧~"
                @quick-action-click="handleQuickActionClick"
                @plugin-action="handlePluginAction"
                @plugin-complete="handlePluginComplete"
                @plugin-cancel="handlePluginCancel"
                @plugin-error="handlePluginError"
                class="demo-message-list"
              >
                <!-- 自定义AI思考状态 -->
                <template #loading>
                  <div class="ai-thinking-indicator">
                    <div class="thinking-avatar">🤖</div>
                    <div class="thinking-content">
                      <div class="thinking-text">
                        <span class="thinking-dots">正在思考</span>
                        <div class="dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- 插件演示区域 -->
                <template #after>
                  <div v-if="demoPlugin" class="plugin-demo-container">
                    <div class="plugin-demo-header">
                      <h4>🔌 插件演示：{{ demoPlugin.title }}</h4>
                      <span class="plugin-status" :class="demoPlugin.required ? 'required' : 'optional'">
                        {{ demoPlugin.required ? '必须完成' : '可选操作' }}
                      </span>
                    </div>
                    <div class="plugin-demo-content">
                      <p>{{ demoPlugin.description }}</p>
                      <div class="plugin-actions">
                        <button @click="handlePluginDemoAction('complete')" class="btn btn-success">
                          ✅ 完成操作
                        </button>
                        <button @click="handlePluginDemoAction('cancel')" class="btn btn-warning">
                          ❌ 取消操作
                        </button>
                        <button @click="handlePluginDemoAction('error')" class="btn btn-danger">
                          💥 模拟错误
                        </button>
                      </div>
                    </div>
                  </div>
                </template>
              </LiaoMessageList>

              <!-- 使用真实的LiaoInputArea组件 -->
              <LiaoInputArea
                v-model="inputText"
                :disabled="isInputLocked"
                :placeholder="isInputLocked ? `输入已锁定：${getLockReasonText(lockReason)}` : '在这里输入消息...'"
                :enable-emoji-input="true"
                :enable-file-upload="true"
                :enable-camera="true"
                @send="handleSendMessage"
                @file-upload="handleFileUpload"
                @camera-capture="handleCameraCapture"
                class="demo-input-area"
              />
            </div>
          </template>
        </LiaoWindow>
      </div>

      <!-- 右侧：状态控制面板 -->
      <div class="demo-control-panel">
        <!-- 实时状态显示 -->
        <div class="status-panel">
          <h3>📊 实时状态</h3>
          <div class="status-grid">
            <div class="status-item">
              <label>会话模式</label>
              <span class="status-value" :class="'mode-' + sessionMode">
                {{ sessionMode === 'AI' ? '🤖 AI模式' : '👥 人工模式' }}
              </span>
            </div>
            <div class="status-item">
              <label>输入状态</label>
              <span class="status-value" :class="{ locked: isInputLocked }">
                {{ isInputLocked ? '🔒 已锁定' : '🔓 可输入' }}
              </span>
            </div>
            <div class="status-item">
              <label>锁定原因</label>
              <span class="status-value">
                {{ lockReason ? getLockReasonText(lockReason) : '无' }}
              </span>
            </div>
            <div class="status-item">
              <label>活跃插件</label>
              <span class="status-value">
                {{ activePlugin ? `${activePlugin.type} (ID: ${activePlugin.id})` : '无' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 锁定控制 -->
        <div class="control-section">
          <h4>🔒 锁定控制</h4>
          <div class="control-buttons">
            <button @click="lockForAIReply" class="btn btn-sm btn-primary">
              AI回复锁定
            </button>
            <button @click="lockForPlugin" class="btn btn-sm btn-info">
              插件操作锁定
            </button>
            <button @click="lockForForm" class="btn btn-sm btn-warning">
              表单填写锁定
            </button>
            <button @click="lockForVote" class="btn btn-sm btn-purple">
              投票选择锁定
            </button>
            <button @click="lockCustom" class="btn btn-sm btn-secondary">
              自定义锁定
            </button>
            <button @click="unlockInput" class="btn btn-sm btn-success">
              手动解锁
            </button>
          </div>
        </div>

        <!-- 消息流控制 -->
        <div class="control-section">
          <h4>💬 消息流控制</h4>
          <div class="control-buttons">
            <button @click="addUserMessage" class="btn btn-sm btn-user">
              ➕ 用户消息
            </button>
            <button @click="addAssistantMessage" class="btn btn-sm btn-assistant">
              ➕ 助手回复
            </button>
            <button @click="simulateAIThinking" class="btn btn-sm btn-thinking">
              🤔 模拟AI思考
            </button>
            <button @click="clearMessages" class="btn btn-sm btn-outline">
              🗑️ 清空消息
            </button>
          </div>
        </div>

        <!-- 插件演示控制 -->
        <div class="control-section">
          <h4>🔌 插件演示</h4>
          <div class="control-buttons">
            <button @click="showRequiredPlugin" class="btn btn-sm btn-required">
              必须插件
            </button>
            <button @click="showOptionalPlugin" class="btn btn-sm btn-optional">
              可选插件
            </button>
            <button @click="hidePlugin" class="btn btn-sm btn-outline">
              隐藏插件
            </button>
          </div>
        </div>

        <!-- 状态日志 -->
        <div class="log-panel">
          <h4>📝 状态变化日志</h4>
          <div class="log-container">
            <div 
              v-for="(log, index) in stateLogs" 
              :key="index" 
              class="log-item"
              :class="'log-' + log.type"
            >
              <span class="log-time">{{ formatTime(log.timestamp) }}</span>
              <span class="log-message">{{ log.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, nextTick, onMounted, computed } from 'vue';
import LiaoWindow from '../components/LiaoWindow/LiaoWindow.vue';
import LiaoMessageList from '../components/LiaoMessageList/LiaoMessageList.vue';
import LiaoInputArea from '../components/LiaoInputArea/LiaoInputArea.vue';
import type { SessionMode, LockReason, ActivePlugin } from '../types/session';
import type { Message } from '../components/LiaoMessageList/LiaoMessageList.vue';

// 组件引用
const windowRef = ref();
const messageListRef = ref();

// 基础状态
const sessionMode = ref<SessionMode>('human');
const isInputLocked = ref(false);
const activePlugin = ref<ActivePlugin | null>(null);
const lockReason = ref<LockReason>(null);
const inputText = ref('');
const isAIThinking = ref(false);

// 消息列表 - 使用LiaoMessageList兼容的格式
const messages = ref<Message[]>([
  {
    id: 1,
    type: 'text',
    content: '您好！我是智能对话助手，可以为您演示全局状态管理功能。',
    isSelf: false,
    name: '智能助手',
    avatar: '🤖',
    time: new Date(Date.now() - 60000).toLocaleTimeString(),
    status: 'sent'
  },
  {
    id: 2,
    type: 'text',
    content: '演示一下状态控制功能',
    isSelf: true,
    name: '用户',
    avatar: '👤',
    time: new Date(Date.now() - 30000).toLocaleTimeString(),
    status: 'sent'
  },
  {
    id: 3,
    type: 'text',
    content: '好的！您可以通过右侧的控制面板体验各种状态变化，包括会话模式切换、输入锁定控制、插件系统演示等。',
    isSelf: false,
    name: '智能助手',
    avatar: '🤖',
    time: new Date(Date.now() - 10000).toLocaleTimeString(),
    status: 'sent'
  }
]);

// 格式化消息以适配LiaoMessageList
const formattedMessages = computed(() => {
  return messages.value.map(msg => ({
    ...msg,
    avatar: msg.isSelf ? '👤' : (sessionMode.value === 'AI' ? '🤖' : '👨‍💼')
  }));
});

// 插件演示状态
const demoPlugin = ref<{
  id: string;
  type: string;
  title: string;
  description: string;
  required: boolean;
} | null>(null);

// 状态日志
interface StateLog {
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  timestamp: number;
}

const stateLogs = ref<StateLog[]>([]);

// 添加状态日志
const addLog = (type: StateLog['type'], message: string) => {
  stateLogs.value.unshift({
    type,
    message,
    timestamp: Date.now()
  });
  
  // 限制日志数量
  if (stateLogs.value.length > 50) {
    stateLogs.value = stateLogs.value.slice(0, 50);
  }
};

// 格式化时间
const formatTime = (timestamp: number) => {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 获取锁定原因文本
const getLockReasonText = (reason: LockReason) => {
  const reasonMap = {
    'AI_REPLYING': 'AI正在回复中',
    'PLUGIN_PENDING': '插件操作待完成',
    'FORM_REQUIRED': '表单填写必须完成',
    'VOTE_REQUIRED': '投票选择必须完成',
    'CUSTOM': '自定义锁定'
  };
  return reason ? reasonMap[reason] : '未知原因';
};

// ===== 会话模式控制 =====
const switchToAI = () => {
  windowRef.value?.setSessionMode('AI');
  addLog('info', '切换到AI模式');
};

const switchToHuman = () => {
  windowRef.value?.setSessionMode('human');
  addLog('info', '切换到人工模式');
};

// ===== 锁定控制 =====
const lockForAIReply = () => {
  windowRef.value?.lockInput('AI_REPLYING');
  addLog('warning', '触发AI回复锁定');
};

const lockForPlugin = () => {
  const plugin: ActivePlugin = {
    id: 'demo-plugin-' + Date.now(),
    type: 'demo',
    required: true
  };
  windowRef.value?.lockInput('PLUGIN_PENDING', plugin);
  addLog('warning', '触发插件操作锁定');
};

const lockForForm = () => {
  windowRef.value?.lockInput('FORM_REQUIRED');
  addLog('warning', '触发表单填写锁定');
};

const lockForVote = () => {
  windowRef.value?.lockInput('VOTE_REQUIRED');
  addLog('warning', '触发投票选择锁定');
};

const lockCustom = () => {
  windowRef.value?.lockInput('CUSTOM');
  addLog('warning', '触发自定义锁定');
};

const unlockInput = () => {
  windowRef.value?.unlockInput();
  addLog('success', '手动解锁输入');
};

const triggerEmergencyUnlock = () => {
  windowRef.value?.emergencyUnlock();
  addLog('error', '触发紧急解锁');
};

// ===== 消息流控制 =====
const handleSendMessage = (content: string) => {
  if (!content.trim() || isInputLocked.value) return;
  
  const message: Message = {
    id: Date.now(),
    type: 'text',
    content: content,
    isSelf: true,
    name: '用户',
    avatar: '👤',
    time: new Date().toLocaleTimeString(),
    status: 'sent'
  };
  
  messages.value.push(message);
  inputText.value = '';
  
  addLog('info', `用户发送消息: ${message.content.substring(0, 20)}...`);
  
  // 模拟AI回复
  if (sessionMode.value === 'AI') {
    simulateAIReply();
  }
};

const addUserMessage = () => {
  const message: Message = {
    id: Date.now(),
    type: 'text',
    content: '这是一条演示用户消息',
    isSelf: true,
    name: '用户',
    avatar: '👤',
    time: new Date().toLocaleTimeString(),
    status: 'sent'
  };
  messages.value.push(message);
  addLog('info', '添加用户消息');
};

const addAssistantMessage = () => {
  const message: Message = {
    id: Date.now(),
    type: 'text',
    content: '这是一条演示助手回复消息',
    isSelf: false,
    name: '智能助手',
    avatar: sessionMode.value === 'AI' ? '🤖' : '👨‍💼',
    time: new Date().toLocaleTimeString(),
    status: 'sent'
  };
  messages.value.push(message);
  addLog('info', '添加助手消息');
};

const simulateAIThinking = () => {
  if (isAIThinking.value) return;
  
  isAIThinking.value = true;
  windowRef.value?.lockInput('AI_REPLYING');
  addLog('info', '开始模拟AI思考');
  
  setTimeout(() => {
    isAIThinking.value = false;
    windowRef.value?.unlockInput();
    
    const message: Message = {
      id: Date.now(),
      type: 'text',
      content: '这是AI思考后的回复内容',
      isSelf: false,
      name: '智能助手',
      avatar: '🤖',
      time: new Date().toLocaleTimeString(),
      status: 'sent'
    };
    messages.value.push(message);
    
    addLog('success', 'AI思考完成并回复');
  }, 3000);
};

const simulateAIReply = () => {
  setTimeout(() => {
    simulateAIThinking();
  }, 500);
};

const clearMessages = () => {
  messages.value = [];
  addLog('info', '清空所有消息');
};

// ===== 插件演示控制 =====
const showRequiredPlugin = () => {
  demoPlugin.value = {
    id: 'required-demo-' + Date.now(),
    type: 'form',
    title: '表单填写插件',
    description: '这是一个必须完成的插件演示，完成前输入将被锁定。',
    required: true
  };
  
  const plugin: ActivePlugin = {
    id: demoPlugin.value.id,
    type: demoPlugin.value.type,
    required: true
  };
  
  windowRef.value?.lockInput('PLUGIN_PENDING', plugin);
  addLog('warning', '显示必须完成插件');
};

const showOptionalPlugin = () => {
  demoPlugin.value = {
    id: 'optional-demo-' + Date.now(),
    type: 'info',
    title: '信息展示插件',
    description: '这是一个可选的插件演示，不会锁定输入。',
    required: false
  };
  
  addLog('info', '显示可选插件');
};

const hidePlugin = () => {
  demoPlugin.value = null;
  windowRef.value?.unlockInput();
  addLog('info', '隐藏插件');
};

const handlePluginDemoAction = (action: 'complete' | 'cancel' | 'error') => {
  if (!demoPlugin.value) return;
  
  switch (action) {
    case 'complete':
      handlePluginComplete({ plugin: demoPlugin.value, result: 'success' });
      break;
    case 'cancel':
      handlePluginCancel({ plugin: demoPlugin.value, reason: 'user_cancel' });
      break;
    case 'error':
      handlePluginError({ plugin: demoPlugin.value, error: 'demo_error' });
      break;
  }
  
  demoPlugin.value = null;
};

// ===== 文件和摄像头处理 =====
const handleFileUpload = (files: FileList) => {
  addLog('info', `文件上传: ${files.length} 个文件`);
  // 可以在这里处理文件上传逻辑
};

const handleCameraCapture = (file: File) => {
  addLog('info', `拍摄照片: ${file.name}`);
  // 可以在这里处理拍摄的照片
};

// ===== 快捷操作处理 =====
const handleQuickActionClick = (action: any) => {
  addLog('info', `快捷操作: ${action.text || action.label}`);
};

// ===== 事件处理 =====
const handleSessionModeChange = ({ oldMode, newMode }: { oldMode: SessionMode; newMode: SessionMode }) => {
  sessionMode.value = newMode;
  addLog('info', `会话模式从 ${oldMode} 切换到 ${newMode}`);
};

const handleLockChange = ({ locked, reason, plugin }: { locked: boolean; reason: LockReason; plugin: ActivePlugin | null }) => {
  isInputLocked.value = locked;
  lockReason.value = reason;
  activePlugin.value = plugin;
  
  if (locked) {
    addLog('warning', `输入已锁定: ${getLockReasonText(reason)}`);
  } else {
    addLog('success', '输入已解锁');
  }
};

const handlePluginComplete = (data: any) => {
  addLog('success', `插件完成: ${data.plugin?.type || 'unknown'}`);
  windowRef.value?.unlockInput();
};

const handlePluginCancel = (data: any) => {
  addLog('warning', `插件取消: ${data.plugin?.type || 'unknown'}`);
  // 无论是必须插件还是可选插件，取消操作都应该解锁输入框
  windowRef.value?.unlockInput();
};

const handlePluginError = (data: any) => {
  addLog('error', `插件错误: ${data.plugin?.type || 'unknown'}`);
  windowRef.value?.emergencyUnlock();
};

const handleEmergencyUnlock = () => {
  addLog('error', '紧急解锁已触发');
};

const handlePluginAction = (data: any) => {
  addLog('info', `插件操作: ${data.action?.type || 'unknown'}`);
};

// ===== 其他控制 =====
const clearLogs = () => {
  stateLogs.value = [];
  addLog('info', '日志已清空');
};

// 初始化
onMounted(() => {
  addLog('success', '全局状态演示页面已加载');
});
</script>

<style scoped>
.global-state-demo {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.demo-header {
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.demo-header h2 {
  margin: 0;
  color: #1f2937;
  font-weight: 600;
}

.quick-actions {
  display: flex;
  gap: 0.75rem;
}

.demo-content {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
  height: calc(100vh - 200px);
}

.demo-window-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.message-and-input-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.demo-message-list {
  flex: 1;
  background: #f8fafc;
  overflow-y: auto;
}

.demo-input-area {
  border-top: 1px solid #e1e8ed;
  background: white;
}

.ai-thinking-indicator {
  display: flex;
  align-items: center;
  padding: 1rem;
  gap: 0.75rem;
  background: white;
  margin: 0.5rem;
  border-radius: 18px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.thinking-avatar {
  font-size: 1.5rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #e5f3ff;
  border-radius: 50%;
}

.thinking-content {
  flex: 1;
}

.thinking-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.thinking-dots .dots {
  display: flex;
  gap: 2px;
}

.thinking-dots .dots span {
  width: 4px;
  height: 4px;
  background: #6b7280;
  border-radius: 50%;
  animation: thinking 1.4s infinite;
}

.thinking-dots .dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.thinking-dots .dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes thinking {
  0%, 60%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  30% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

.plugin-demo-container {
  background: #f0f9ff;
  border: 2px dashed #0ea5e9;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem;
}

.plugin-demo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.plugin-demo-header h4 {
  margin: 0;
  color: #0369a1;
  font-size: 0.875rem;
}

.plugin-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

.plugin-status.required {
  background: #fef2f2;
  color: #dc2626;
}

.plugin-status.optional {
  background: #f0fdf4;
  color: #16a34a;
}

.plugin-demo-content p {
  margin: 0 0 0.75rem 0;
  font-size: 0.875rem;
  color: #374151;
}

.plugin-actions {
  display: flex;
  gap: 0.5rem;
}

.demo-control-panel {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: fit-content;
  max-height: 100%;
  overflow-y: auto;
}

.status-panel h3 {
  margin: 0 0 1rem 0;
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
}

.status-grid {
  display: grid;
  gap: 0.75rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #e5e7eb;
}

.status-item label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.status-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
}

.status-value.mode-AI {
  color: #2563eb;
}

.status-value.mode-human {
  color: #16a34a;
}

.status-value.locked {
  color: #dc2626;
}

.control-section h4 {
  margin: 0 0 0.75rem 0;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
}

.control-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.log-panel h4 {
  margin: 0 0 0.75rem 0;
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
}

.log-container {
  background: #f9fafb;
  border-radius: 8px;
  padding: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
}

.log-item {
  display: flex;
  gap: 0.5rem;
  padding: 0.5rem 0;
  font-size: 0.8rem;
  border-bottom: 1px solid #e5e7eb;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  color: #6b7280;
  font-family: monospace;
  white-space: nowrap;
}

.log-message {
  flex: 1;
}

.log-info {
  color: #2563eb;
}

.log-warning {
  color: #d97706;
}

.log-error {
  color: #dc2626;
}

.log-success {
  color: #16a34a;
}

/* 按钮样式 */
.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8rem;
}

.btn-primary {
  background: #2563eb;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1d4ed8;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #4b5563;
}

.btn-danger {
  background: #dc2626;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}

.btn-success {
  background: #16a34a;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #15803d;
}

.btn-warning {
  background: #d97706;
  color: white;
}

.btn-warning:hover:not(:disabled) {
  background: #b45309;
}

.btn-info {
  background: #0ea5e9;
  color: white;
}

.btn-info:hover:not(:disabled) {
  background: #0284c7;
}

.btn-purple {
  background: #7c3aed;
  color: white;
}

.btn-purple:hover:not(:disabled) {
  background: #6d28d9;
}

.btn-outline {
  background: transparent;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-outline:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #6b7280;
}

.btn-user {
  background: #3b82f6;
  color: white;
}

.btn-user:hover:not(:disabled) {
  background: #2563eb;
}

.btn-assistant {
  background: #10b981;
  color: white;
}

.btn-assistant:hover:not(:disabled) {
  background: #059669;
}

.btn-thinking {
  background: #f59e0b;
  color: white;
}

.btn-thinking:hover:not(:disabled) {
  background: #d97706;
}

.btn-required {
  background: #ef4444;
  color: white;
}

.btn-required:hover:not(:disabled) {
  background: #dc2626;
}

.btn-optional {
  background: #22c55e;
  color: white;
}

.btn-optional:hover:not(:disabled) {
  background: #16a34a;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .demo-content {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr auto;
    gap: 1rem;
  }

  .demo-control-panel {
    height: auto;
    max-height: 300px;
  }

  .control-buttons {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .global-state-demo {
    padding: 1rem;
  }

  .demo-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .quick-actions {
    flex-wrap: wrap;
    justify-content: center;
  }

  .demo-content {
    height: calc(100vh - 160px);
  }
}
</style> 