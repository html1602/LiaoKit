<template>
  <div class="window-content">
    <!-- 用户信息栏 -->
    <div class="user-info-bar">
      <div class="user-avatar">
        <img :src="window.userInfo?.avatar" :alt="window.userInfo?.name" />
      </div>
      <div class="user-details">
        <h4>{{ window.userInfo?.name }}</h4>
        <span class="user-id">ID: {{ window.userInfo?.id }}</span>
      </div>
      <div class="service-info">
        <div class="service-mode">
          <LiaoIcon :name="window.mode === 'AI' ? 'robot' : 'user'" />
          <span>{{ window.mode === 'AI' ? 'AI智能助手' : '人工客服' }}</span>
          <button 
            class="mode-switch-btn" 
            @click="$emit('switch-mode', window.id)"
            :title="`切换到${window.mode === 'AI' ? '人工客服' : 'AI智能助手'}`"
          >
            <LiaoIcon name="switch" />
          </button>
        </div>
        <div class="agent-status">
          <div class="agent-avatar">
            <img :src="window.agentInfo?.avatar" :alt="window.agentInfo?.name" />
          </div>
          <span>{{ window.agentInfo?.name }}</span>
          <span 
            class="status-indicator" 
            :class="`status-indicator--${window.agentInfo?.status}`"
          ></span>
        </div>
      </div>
    </div>

    <!-- 使用LiaoMessageList组件显示消息 -->
    <div class="message-area">
      <LiaoMessageList
        :messages="liaoMessages"
        :show-avatar="true"
        :show-avatar-self="false"
        :show-name="true"
        :show-time="true"
        :show-date-divider="true"
        :loading="false"
        :has-more="false"
        @quick-action-click="handleQuickAction"
        @plugin-action="handlePluginAction"
        @file-preview="handleFilePreview"
        @file-download="handleFileDownload"
        @file-click="handleFileClick"
        @file-retry="handleFileRetry"
        @file-more="handleFileMore"
      />
    </div>

    <!-- 使用LiaoInputArea组件作为输入区域 -->
    <div class="input-area">
      <LiaoInputArea
        v-model="inputValue"
        @send="handleSendMessage"
        placeholder="输入消息..."
        :enable-emoji-input="true"
        :enable-voice-input="false"
        :enable-file-upload="true"
        :device-type="'desktop'"
        @file-upload="handleFileUpload"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted } from 'vue';
import type { PropType } from 'vue';
import LiaoIcon from '../../components/LiaoIcon/LiaoIcon.vue';
import LiaoMessageList from '../../components/LiaoMessageList/LiaoMessageList.vue';
import LiaoInputArea from '../../components/LiaoInputArea/LiaoInputArea.vue';
import type { WindowInfo } from '../../types/window';
import type { Message } from '../../components/LiaoMessageList/LiaoMessageList.vue';

// 消息接口定义
interface SessionMessage {
  id: number;
  type: 'user' | 'agent' | 'ai' | 'system' | 'file';
  content: string;
  timestamp: Date;
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
  fileStatus?: string;
  fileProgress?: number;
  fileError?: string;
}

interface SessionData {
  messages: SessionMessage[];
  inputValue: string;
}

const props = defineProps({
  window: {
    type: Object as PropType<WindowInfo>,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  },
  sessionData: {
    type: Object as PropType<SessionData>,
    default: () => ({ messages: [], inputValue: '' })
  }
});

const emit = defineEmits(['send-message', 'switch-mode']);

// 响应式数据
const inputValue = ref('');

// 同步inputValue与sessionData
watch(() => props.sessionData?.inputValue, (newVal) => {
  if (newVal !== undefined) {
    inputValue.value = newVal;
  }
}, { immediate: true });

watch(inputValue, (newVal) => {
  if (props.sessionData) {
    props.sessionData.inputValue = newVal;
  }
});

// 将sessionData中的消息转换为LiaoMessageList需要的格式
const liaoMessages = computed((): Message[] => {
  if (!props.sessionData?.messages) {
    console.log('没有消息数据');
    return [];
  }
  
  console.log('转换消息数据:', props.sessionData.messages);
  
  return props.sessionData.messages.map((message): Message => {
    // 客服视角：用户消息在左边(isSelf=false)，客服回复在右边(isSelf=true)
    // 文件上传默认为客服操作，所以应该显示在右边
    let isSelf = message.type === 'agent' || message.type === 'ai';
    
    // 特殊处理：文件类型消息默认为客服上传，显示在右边
    if (message.type === 'file') {
      isSelf = true;
    }
    
    const converted: Message = {
      id: message.id.toString(),
      content: message.content,
      type: message.type === 'file' ? 'file' : 'text', // 保持原始类型
      isSelf: isSelf,
      avatar: isSelf ? props.window.agentInfo?.avatar : props.window.userInfo?.avatar,
      name: isSelf ? props.window.agentInfo?.name : props.window.userInfo?.name,
      time: message.timestamp,
      status: 'sent' as const
    };
    
    // 如果是文件类型消息，添加文件相关属性
    if (message.type === 'file') {
      converted.fileName = message.fileName;
      converted.fileSize = message.fileSize;
      converted.fileType = message.fileType;
      converted.fileUrl = message.fileUrl;
      converted.fileStatus = message.fileStatus as any;
      converted.fileProgress = message.fileProgress;
      converted.fileError = message.fileError;
    }
    
    console.log('转换消息:', message, '→', converted);
    return converted;
  });
});

// 处理发送消息
const handleSendMessage = (message: string) => {
  if (!message.trim()) return;
  
  console.log('=== WindowContent 消息发送开始 ===');
  console.log('1. WindowContent 发送消息:', message);
  console.log('2. 窗口ID:', props.window.id);
  
  emit('send-message', props.window.id, message);
  console.log('3. send-message 事件已发送');
  
  inputValue.value = '';
  console.log('=== WindowContent 消息发送结束 ===');
};

// 处理快捷操作
const handleQuickAction = (action: any) => {
  console.log('快捷操作被点击:', action);
  // 可以根据action类型发送对应的消息
  if (action.text) {
    handleSendMessage(action.text);
  }
};

// 处理插件操作
const handlePluginAction = (data: any) => {
  console.log('插件操作:', data);
};

// 处理文件预览
const handleFilePreview = (data: { message: Message, file: any }) => {
  console.log('文件预览:', data);
  // 文件预览功能由LiaoFileBubble组件内部处理
};

// 处理文件下载
const handleFileDownload = (data: { message: Message, file: any }) => {
  console.log('文件下载:', data);
  const { message } = data;
  
  if (message.fileUrl && message.fileName) {
    // 创建下载链接
    const link = document.createElement('a');
    link.href = message.fileUrl;
    link.download = message.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

// 处理文件点击
const handleFileClick = (data: { message: Message, file: any }) => {
  console.log('文件点击:', data);
  // 点击文件时的处理逻辑，通常触发预览
  handleFilePreview(data);
};

// 处理文件重试
const handleFileRetry = (data: { message: Message, file: any }) => {
  console.log('文件重试:', data);
  // 处理文件上传重试逻辑
};

// 处理文件更多操作
const handleFileMore = (data: { message: Message, file: any }) => {
  console.log('文件更多操作:', data);
  // 处理文件的更多操作菜单
};

// 处理文件上传
const handleFileUpload = (files: FileList) => {
  console.log('=== WindowContent 文件上传开始 ===');
  console.log('1. 收到文件:', files);
  
  if (files.length === 0) return;
  
  // 为每个文件创建文件消息
  Array.from(files).forEach((file, index) => {
    console.log(`2. 处理文件 ${index + 1}:`, file.name, file.size, file.type);
    
    // 创建文件消息对象
    const fileMessage = {
      id: Date.now() + index,
      type: 'file' as const,  // 重要：设置为文件类型
      content: '', // 文件消息的content可以为空
      timestamp: new Date(),
      // 文件相关属性
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || 'application/octet-stream',
      fileUrl: URL.createObjectURL(file), // 创建本地预览URL
      fileStatus: 'success' as const, // 设置为成功状态
      fileProgress: 100,
      fileError: ''
    };
    
    console.log('3. 创建的文件消息:', fileMessage);
    
    // 添加到会话数据中
    if (props.sessionData) {
      props.sessionData.messages.push(fileMessage);
      console.log('4. 文件消息已添加到会话数据，当前消息总数:', props.sessionData.messages.length);
    }
  });
  
  console.log('=== WindowContent 文件上传结束 ===');
};

// 监听窗口激活状态，聚焦输入框
watch(() => props.isActive, (newVal) => {
  if (newVal) {
    // 延时聚焦，确保DOM渲染完成
    setTimeout(() => {
      const inputElement = document.querySelector('.liao-input-area input') as HTMLInputElement;
      if (inputElement) {
        inputElement.focus();
      }
    }, 100);
  }
});

onMounted(() => {
  console.log('WindowContent组件已挂载，窗口:', props.window.title);
});
</script>

<style lang="scss" scoped>
.window-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ffffff;
}

.user-info-bar {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  gap: 12px;
  flex-shrink: 0;

  .user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .user-details {
    flex: 1;
    min-width: 0;

    h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-id {
      font-size: 12px;
      color: #64748b;
    }
  }

  .service-info {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;

    .service-mode {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      color: #64748b;

      .mode-switch-btn {
        background: none;
        border: none;
        padding: 4px;
        border-radius: 4px;
        color: #64748b;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: #e2e8f0;
          color: #2563eb;
        }
      }
    }

    .agent-status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;

      .agent-avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .status-indicator {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        
        &--online {
          background: #10b981;
        }
        
        &--busy {
          background: #f59e0b;
        }
        
        &--offline {
          background: #6b7280;
        }
      }
    }
  }
}

.message-area {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.input-area {
  flex-shrink: 0;
  border-top: 1px solid #e2e8f0;
  background: #ffffff;
}

// 响应式设计
@media (max-width: 768px) {
  .user-info-bar {
    padding: 10px 12px;
    
    .user-details h4 {
      font-size: 13px;
    }
    
    .service-info {
      .service-mode {
        font-size: 11px;
      }
      
      .agent-status {
        font-size: 11px;
        
        .agent-avatar {
          width: 18px;
          height: 18px;
        }
      }
    }
  }
}
</style> 