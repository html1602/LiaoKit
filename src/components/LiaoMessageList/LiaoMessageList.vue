<template>
  <div class="liao-message-list-wrapper" ref="wrapperRef">
    <div class="liao-message-list liao-scrollable" ref="messageListRef">
      <slot name="before"></slot>
      
      <!-- AI 适配处理状态 -->
      <div v-if="useAiAdapter && adapterProcessing" class="liao-message-list-ai-loading">
        <slot name="ai-loading">
          <div class="liao-message-list-ai-loading-indicator">
            <LiaoIcon name="loading" spin />
            <span>AI 正在处理消息格式...</span>
          </div>
        </slot>
      </div>
      
      <!-- AI 适配错误提示 -->
      <div v-if="useAiAdapter && adapterError" class="liao-message-list-ai-error">
        <slot name="ai-error" :error="adapterError">
          <div class="liao-message-list-ai-error-content">
            <LiaoIcon name="warning" />
            <span>AI 消息适配失败: {{ adapterError }}</span>
          </div>
        </slot>
      </div>
      
      <div v-if="loading" class="liao-message-list-loading">
        <slot name="loading">
          <div class="liao-message-list-loading-indicator">
            <LiaoIcon name="loading" spin />
          </div>
        </slot>
      </div>
      
      <!-- 空状态 -->
      <div v-if="adaptedMessages.length === 0 && !loading && !adapterProcessing" class="liao-message-list-empty">
        <slot name="empty">
          <div class="liao-message-list-empty-text">{{ emptyText }}</div>
        </slot>
      </div>
      
      <!-- 消息列表 -->
      <div class="liao-message-list-container">
        <!-- 加载更多按钮 -->
        <div v-if="hasMore" class="liao-message-list-load-more">
          <slot name="load-more">
            <button
              class="liao-message-list-load-more-btn"
              @click="handleLoadMore"
              :disabled="loadingMore"
            >
              <LiaoIcon v-if="loadingMore" name="loading" spin size="small" />
              <span>{{ loadingMore ? '加载中...' : loadMoreText }}</span>
            </button>
          </slot>
        </div>
        
        <!-- 时间分组 -->
        <template v-for="(group, groupIndex) in messageGroups" :key="groupIndex">
          <!-- 时间分割线 -->
          <div v-if="showDateDivider && group.date" class="liao-message-list-date-divider">
            <span class="liao-message-list-date-text">{{ group.date }}</span>
          </div>
          
          <!-- 消息项 -->
          <div 
            v-for="(message, index) in group.messages" 
            :key="message.id || `${groupIndex}-${index}`" 
            class="liao-message-list-item"
          >
            <slot 
              name="message" 
              :message="message" 
              :index="index" 
              :group-index="groupIndex"
              :isLastMessage="isLastMessage(groupIndex, index, group.messages.length)"
            >
              <!-- 文本消息气泡 -->
              <LiaoMessageBubble
                v-if="!message.type || message.type === 'text'"
                :content="message.content"
                :type="message.isSelf ? 'self' : 'other'"
                :avatar="message.avatar"
                :show-avatar="showAvatar"
                :show-avatar-self="showAvatarSelf"
                :name="message.name"
                :show-name="showName"
                :time="message.time"
                :show-time="showTime"
                :status="message.status"
              />
              
              <!-- 添加消息下方的快捷操作栏 -->
              <LiaoQuickActionBar
                v-if="message.quickActions && message.quickActions.length > 0"
                :actions="message.quickActions"
                @action-click="handleQuickAction"
                class="liao-message-quick-actions"
              />
              
              <!-- 图片消息气泡 -->
              <LiaoImageBubble
                v-else-if="message.type === 'image'"
                :image-url="message.content"
                :alt="message.alt || '图片'"
                :type="message.isSelf ? 'self' : 'other'"
                :avatar="message.avatar"
                :show-avatar="showAvatar"
                :show-avatar-self="showAvatarSelf"
                :name="message.name"
                :show-name="showName"
                :time="message.time"
                :show-time="showTime"
                :status="message.status"
              />

              <!-- 插件消息气泡 -->
              <LiaoPluginBubble
                v-else-if="message.type === 'plugin'"
                :type="message.isSelf ? 'self' : 'other'"
                :avatar="message.avatar"
                :show-avatar="showAvatar"
                :show-avatar-self="showAvatarSelf"
                :name="message.name"
                :show-name="showName"
                :time="message.time"
                :show-time="showTime"
                :plugin-type="message.pluginType || ''"
                :plugin-data="message.pluginData"
                :plugin-required="message.pluginRequired || false"
                :message-id="message.id"
                @action="$emit('plugin-action', { action: $event, message })"
                @complete="$emit('plugin-complete', { message, data: $event })"
                @cancel="$emit('plugin-cancel', { message, data: $event })"
                @error="$emit('plugin-error', { message, data: $event })"
              />
              
              <!-- 文件消息气泡 -->
              <LiaoFileBubble
                v-else-if="message.type === 'file'"
                ref="fileBubbleRefs"
                :fileName="message.fileName"
                :fileSize="message.fileSize"
                :fileType="message.fileType"
                :fileUrl="message.fileUrl"
                :fileStatus="message.fileStatus"
                :fileProgress="message.fileProgress"
                :fileError="message.fileError"
                :messageType="message.isSelf ? 'self' : 'other'"
                :avatar="message.avatar"
                :show-avatar="showAvatar"
                :show-avatar-self="showAvatarSelf"
                :userName="message.name"
                :show-name="showName"
                :time="message.time"
                :show-time="showTime"
                :messageStatus="message.status"
                @preview="$emit('file-preview', { message, file: $event })"
                @download="$emit('file-download', { message, file: $event })"
                @click="$emit('file-click', { message, file: $event })"
                @retry="$emit('file-retry', { message, file: $event })"
                @more="$emit('file-more', { message, file: $event })"
              />
              
              <!-- 其他类型消息通过插槽处理 -->
              <slot
                v-else
                :name="`message-${message.type}`"
                :message="message"
                :index="index"
                :group-index="groupIndex"
              ></slot>
            </slot>
          </div>
        </template>
      </div>
      
      <slot name="after"></slot>
    </div>
    
    <!-- 新消息提示 - 改回放在wrapper内，使用absolute定位相对于wrapper -->
    <div
      v-if="showNewMessageTip && newMessageCount > 0"
      class="liao-message-list-new-message-tip"
      @click="scrollToFirstNewMessage"
    >
      <div class="new-message-tip-content">
        <LiaoIcon name="info" />
        <span>有 {{ newMessageCount }} 条新消息</span>
      </div>
    </div>
    
    <!-- 滚动到底部按钮 -->
    <div
      v-if="showScrollToBottomBtn"
      class="liao-message-list-scroll-to-bottom"
      @click="() => scrollToBottomFn(true)"
    >
      <div class="scroll-icon-container">
        <LiaoIcon name="down" class="scroll-icon-animation icon-1" />
        <LiaoIcon name="down" class="scroll-icon-animation icon-2" />
      </div>
      <span v-if="unreadCount > 0" class="liao-message-list-unread-count">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted, onUnmounted, computed, nextTick, readonly } from 'vue';
import type { PropType } from 'vue';
import LiaoMessageBubble from '../LiaoMessageBubble/LiaoMessageBubble.vue';
import LiaoImageBubble from '../LiaoMessageBubble/LiaoImageBubble.vue';
import LiaoIcon from '../LiaoIcon/LiaoIcon.vue';
import LiaoQuickActionBar from '../LiaoQuickActionBar/LiaoQuickActionBar.vue';
import LiaoPluginBubble from '../LiaoMessageBubble/LiaoPluginBubble.vue';
import LiaoFileBubble from '../LiaoMessageBubble/LiaoFileBubble.vue';
import { formatDate } from '../../utils/date/index.ts';
import { useAiMessageAdapter } from '../../ai-adapter';
import type { AiAdapterOptions, CustomFormatFunction } from '../../ai-adapter';
import { createComponentLogger } from '../../utils/logger';

// 创建组件专用日志器
const logger = createComponentLogger('MessageList');

// 消息类型定义
export interface Message {
  id?: string | number;
  content: string;
  type?: 'text' | 'image' | 'file' | 'system' | string;
  isSelf?: boolean;
  avatar?: string;
  name?: string;
  time?: string | Date | number;
  status?: 'sending' | 'sent' | 'failed' | 'streaming';
  quickActions?: Array<{id: string, text: string, label: string}>;
  pluginType?: string;
  pluginData?: any;
  pluginRequired?: boolean;
  // 文件相关属性
  fileName?: string;
  fileSize?: number;
  fileType?: string;
  fileUrl?: string;
  fileStatus?: 'waiting' | 'uploading' | 'success' | 'error';
  fileProgress?: number;
  fileError?: string;
  [key: string]: any;
}

// 消息分组接口
interface MessageGroup {
  date: string;
  messages: Message[];
}

// 注意：插件注册逻辑已移至组件库入口和LiaoPluginBubble组件中
// 这样可以实现：
// 1. 在应用级别自动注册所有内置插件
// 2. 在单独使用LiaoPluginBubble时也能自动注册所需插件
// 3. 避免重复注册和内存浪费

const props = defineProps({
  messages: {
    type: Array as PropType<Message[]>,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  loadingMore: {
    type: Boolean,
    default: false
  },
  emptyText: {
    type: String,
    default: '暂无消息'
  },
  showAvatar: {
    type: Boolean,
    default: true
  },
  showAvatarSelf: {
    type: Boolean,
    default: true
  },
  showName: {
    type: Boolean,
    default: false
  },
  showTime: {
    type: Boolean,
    default: false
  },
  hasMore: {
    type: Boolean,
    default: false
  },
  loadMoreText: {
    type: String,
    default: '加载更多'
  },
  scrollToBottom: {
    type: Boolean,
    default: true
  },
  scrollThreshold: {
    type: Number,
    default: 100 // 降低滚动阈值，使得用户稍微上划就能看到按钮
  },
  showDateDivider: {
    type: Boolean,
    default: true
  },
  dateDividerFormat: {
    type: String,
    default: 'YYYY年MM月DD日'
  },
  unreadCount: {
    type: Number,
    default: 0
  },
  // AI 消息适配相关 props
  useAiAdapter: {
    type: Boolean,
    default: false
  },
  aiAdapterOptions: {
    type: Object as PropType<AiAdapterOptions>,
    default: () => ({})
  },
  customFormat: {
    type: Function as PropType<CustomFormatFunction>,
    default: undefined
  },
  enableAdapterCache: {
    type: Boolean,
    default: true
  },
  adapterTimeout: {
    type: Number,
    default: 5000
  },
  // 🔥 新增：跳过用户消息适配的配置
  skipUserMessageAdapter: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'load-more', 
  'scroll', 
  'scroll-to-top', 
  'scroll-to-bottom',
  'read-all',
  'quick-action-click',
  'plugin-action',
  'plugin-complete',
  'plugin-cancel',
  'plugin-error',
  'file-preview',
  'file-download',
  'file-click',
  'file-retry',
  'file-more',
  // AI 适配相关事件
  'adapter-success',
  'adapter-error',
  'adapter-fallback'
]);

const messageListRef = ref<HTMLElement | null>(null);
const wrapperRef = ref<HTMLElement | null>(null); // 添加wrapper引用
const fileBubbleRefs = ref<any[]>([]); // 添加文件气泡组件引用
const showScrollToBottomBtn = ref(false);
const isUserScrolling = ref(false);
const scrollTimer = ref<number | null>(null);
const lastScrollTop = ref(0); // 存储上次滚动位置，用于判断滚动方向

// 新消息提示相关状态 - 确保初始值正确
const showNewMessageTip = ref(false);
const newMessageCount = ref(0);
const newMessagesStartIndex = ref(-1); // 记录新消息起始索引

// AI 适配器状态
const adaptedMessages = ref<Message[]>([]);
const adapterProcessing = ref(false);
const adapterError = ref<string | null>(null);

// 初始化 AI 适配器
const { 
  loading: aiAdapterLoading, 
  error: aiAdapterError, 
  stats: aiAdapterStats,
  adaptMessage,
  adaptMessages: adaptMessagesAsync,
  updateOptions,
  clearCache
} = useAiMessageAdapter(
  props.useAiAdapter ? {
    enabled: true,
    enableCache: props.enableAdapterCache,
    timeoutMs: props.adapterTimeout,
    ...props.aiAdapterOptions
  } : { enabled: false }
);

// 快捷操作处理
const handleQuickAction = (action: any) => {
  logger.debug('快捷操作被点击:', action);
  emit('quick-action-click', action);
};

// AI 消息适配处理
const processAiMessages = async () => {
  if (!props.useAiAdapter) {
    adaptedMessages.value = props.messages;
    return;
  }

  adapterProcessing.value = true;
  adapterError.value = null;

  try {
    logger.info('🤖 开始 AI 消息适配，消息数量:', props.messages.length);
    
    // 🔥 核心：组件级别的用户消息过滤
    let messagesToProcess = props.messages;
    let userMessages: Message[] = [];
    let streamingMessages: Message[] = [];
    
    if (props.skipUserMessageAdapter) {
      // 分离用户消息和AI消息
      const { userMsgs, aiMsgs } = separateMessages(props.messages);
      userMessages = userMsgs;
      messagesToProcess = aiMsgs;
      
      logger.debug(`📝 跳过 ${userMsgs.length} 条用户消息的AI适配，处理 ${aiMsgs.length} 条AI消息`);
    }
    
    // 🆕 流式消息处理：分离流式中的消息和已完成的消息
    const { streamingMsgs, completedMsgs } = separateStreamingMessages(messagesToProcess);
    streamingMessages = streamingMsgs;
    messagesToProcess = completedMsgs;
    
    if (streamingMessages.length > 0) {
      logger.debug(`🔄 跳过 ${streamingMessages.length} 条正在流式输出的消息，等待流式完成后再适配`);
    }
    
    // 只对需要适配的消息调用AI适配器
    const results = messagesToProcess.length > 0 
      ? await adaptMessagesAsync(messagesToProcess, props.customFormat)
      : [];
    
    const adaptedAiMessages = results
      .filter(result => result.success && result.message)
      .map(result => result.message!);

    // 合并用户消息、流式消息和适配后的AI消息，保持原始顺序
    adaptedMessages.value = mergeAllMessagesInOrder(
      props.messages, 
      userMessages, 
      streamingMessages, 
      adaptedAiMessages
    );

    // 处理失败的消息
    const failedCount = results.filter(result => !result.success).length;
    if (failedCount > 0) {
      logger.warn(`⚠️ ${failedCount} 条消息适配失败，使用兜底方案`);
      emit('adapter-fallback', { failedCount, total: props.messages.length });
    }

    // 发射成功事件
    emit('adapter-success', {
      processed: results.length,
      cached: results.filter(r => r.fromCache).length,
      skipped: userMessages.length + streamingMessages.length,
      streaming: streamingMessages.length,
      stats: aiAdapterStats
    });

    logger.info('✅ AI 消息适配完成');
    
  } catch (error) {
    logger.error('❌ AI 消息适配出错:', error);
    adapterError.value = error instanceof Error ? error.message : '适配失败';
    
    // 适配失败时使用原始消息
    adaptedMessages.value = props.messages;
    
    emit('adapter-error', { error: adapterError.value, originalMessages: props.messages });
  } finally {
    adapterProcessing.value = false;
  }
};

// 🔥 新增：分离用户消息和AI消息的函数
const separateMessages = (messages: Message[]) => {
  const userMsgs: Message[] = [];
  const aiMsgs: Message[] = [];
  
  messages.forEach(message => {
    const isUserMessage = 
      message.isSelf === true ||
      message.role === 'user' ||
      (message as any).from === 'user' ||
      (message as any).sender === 'user' ||
      (message as any).type === 'user';
    
    if (isUserMessage) {
      userMsgs.push(message);
    } else {
      aiMsgs.push(message);
    }
  });
  
  return { userMsgs, aiMsgs };
};

// 🆕 新增：分离流式消息和已完成消息的函数
const separateStreamingMessages = (messages: Message[]) => {
  const streamingMsgs: Message[] = [];
  const completedMsgs: Message[] = [];
  
  messages.forEach(message => {
    // 检查消息是否正在流式输出
    const isStreaming = message.status === 'streaming';
    
    if (isStreaming) {
      streamingMsgs.push(message);
    } else {
      completedMsgs.push(message);
    }
  });
  
  return { streamingMsgs, completedMsgs };
};

// 🔥 新增：按原始顺序合并消息的函数
const mergeMessagesInOrder = (originalMessages: Message[], userMessages: Message[], adaptedAiMessages: Message[]) => {
  const result: Message[] = [];
  let userIndex = 0;
  let aiIndex = 0;
  
  originalMessages.forEach(originalMessage => {
    const isUserMessage = 
      originalMessage.isSelf === true ||
      originalMessage.role === 'user' ||
      (originalMessage as any).from === 'user' ||
      (originalMessage as any).sender === 'user' ||
      (originalMessage as any).type === 'user';
    
    if (isUserMessage) {
      // 使用原始用户消息
      if (userIndex < userMessages.length) {
        result.push(userMessages[userIndex]);
        userIndex++;
      } else {
        result.push(originalMessage); // 兜底
      }
    } else {
      // 使用适配后的AI消息
      if (aiIndex < adaptedAiMessages.length) {
        result.push(adaptedAiMessages[aiIndex]);
        aiIndex++;
      } else {
        result.push(originalMessage); // 兜底
      }
    }
  });
  
  return result;
};

// 🆕 新增：合并所有类型消息的函数（用户消息、流式消息、适配后的AI消息）
const mergeAllMessagesInOrder = (
  originalMessages: Message[], 
  userMessages: Message[], 
  streamingMessages: Message[], 
  adaptedAiMessages: Message[]
) => {
  const result: Message[] = [];
  let userIndex = 0;
  let streamingIndex = 0;
  let aiIndex = 0;
  
  originalMessages.forEach(originalMessage => {
    const isUserMessage = 
      originalMessage.isSelf === true ||
      originalMessage.role === 'user' ||
      (originalMessage as any).from === 'user' ||
      (originalMessage as any).sender === 'user' ||
      (originalMessage as any).type === 'user';
    
    const isStreamingMessage = originalMessage.status === 'streaming';
    
    if (isUserMessage) {
      // 使用原始用户消息
      if (userIndex < userMessages.length) {
        result.push(userMessages[userIndex]);
        userIndex++;
      } else {
        result.push(originalMessage); // 兜底
      }
    } else if (isStreamingMessage) {
      // 使用原始流式消息（保持流式状态）
      if (streamingIndex < streamingMessages.length) {
        result.push(streamingMessages[streamingIndex]);
        streamingIndex++;
      } else {
        result.push(originalMessage); // 兜底
      }
    } else {
      // 使用适配后的AI消息
      if (aiIndex < adaptedAiMessages.length) {
        result.push(adaptedAiMessages[aiIndex]);
        aiIndex++;
      } else {
        result.push(originalMessage); // 兜底
      }
    }
  });
  
  return result;
};

// 监听消息变化，触发适配
watch(
  () => props.messages,
  async (newMessages) => {
    await processAiMessages();
  },
  { immediate: true, deep: true }
);

// 监听 AI 适配配置变化
watch(
  [() => props.useAiAdapter, () => props.aiAdapterOptions],
  () => {
    if (props.useAiAdapter) {
      updateOptions({
        enabled: true,
        enableCache: props.enableAdapterCache,
        timeoutMs: props.adapterTimeout,
        ...props.aiAdapterOptions
      });
      // 重新处理消息
      processAiMessages();
    } else {
      // 禁用适配时直接使用原始消息
      adaptedMessages.value = props.messages;
    }
  },
  { deep: true }
);

// 按日期对消息分组 - 使用适配后的消息
const messageGroups = computed(() => {
  const messagesToGroup = adaptedMessages.value;
  
  if (!props.showDateDivider) {
    return [{ date: '', messages: messagesToGroup }];
  }
  
  const groups: MessageGroup[] = [];
  let currentDate = '';
  let currentGroup: Message[] = [];
  
  messagesToGroup.forEach(message => {
    // 获取消息日期
    const messageTime = message.time ? new Date(message.time) : new Date();
    const messageDate = formatDate(messageTime, props.dateDividerFormat);
    
    // 如果日期变了，创建新分组
    if (messageDate !== currentDate) {
      if (currentGroup.length > 0) {
        groups.push({
          date: currentDate,
          messages: [...currentGroup]
        });
      }
      currentDate = messageDate;
      currentGroup = [message];
    } else {
      currentGroup.push(message);
    }
  });
  
  // 添加最后一个分组
  if (currentGroup.length > 0) {
    groups.push({
      date: currentDate,
      messages: currentGroup
    });
  }
  
  return groups;
});

// 判断是否为最后一条消息
const isLastMessage = (groupIndex: number, messageIndex: number, groupLength: number) => {
  return (
    groupIndex === messageGroups.value.length - 1 && 
    messageIndex === groupLength - 1
  );
};

// 加载更多
const handleLoadMore = () => {
  emit('load-more');
};

// 滚动到底部
const scrollToBottomFn = async (smooth = true) => {
  await nextTick();
  if (messageListRef.value) {
    const scrollHeight = messageListRef.value.scrollHeight;
    
    if (smooth) {
      messageListRef.value.scrollTo({
        top: scrollHeight,
        behavior: 'smooth'
      });
    } else {
      messageListRef.value.scrollTop = scrollHeight;
    }
    
    // 标记消息已读
    if (props.unreadCount > 0) {
      emit('read-all');
    }
    
    showScrollToBottomBtn.value = false;
  }
};

// 判断是否在底部
const isNearBottom = () => {
  if (!messageListRef.value) return false;
  
  const { scrollHeight, scrollTop, clientHeight } = messageListRef.value;
  // 如果距离底部小于50像素，认为在底部
  const atBottom = scrollHeight - scrollTop - clientHeight < 50;
  // console.log('滚动位置检测:', {
  //   scrollHeight,
  //   scrollTop,
  //   clientHeight,
  //   distanceToBottom: scrollHeight - scrollTop - clientHeight,
  //   atBottom
  // });
  return atBottom;
};

// 设置自动滚动标志
const shouldAutoScroll = ref(props.scrollToBottom);

// 监听滚动事件，决定是否应该自动滚动
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement;
  
  // 判断滚动方向
  const scrollingUp = target.scrollTop < lastScrollTop.value;
  lastScrollTop.value = target.scrollTop;
  
  // 标记用户正在滚动
  isUserScrolling.value = true;
  
  // 清除之前的定时器
  if (scrollTimer.value) {
    window.clearTimeout(scrollTimer.value);
  }
  
  // 设置新的定时器，滚动停止后重置标记
  scrollTimer.value = window.setTimeout(() => {
    isUserScrolling.value = false;
  }, 300);
  
  // 更新自动滚动标志 - 如果用户滚动到底部，开启自动滚动
  shouldAutoScroll.value = isNearBottom();
  
  // 检查滚动位置，决定是否显示回到底部按钮
  const { scrollTop, scrollHeight, clientHeight } = target;
  const distanceToBottom = scrollHeight - scrollTop - clientHeight;
  
  // 只有当距离底部超过阈值时才显示按钮
  if (distanceToBottom > props.scrollThreshold) {
    showScrollToBottomBtn.value = true;
  } else {
    showScrollToBottomBtn.value = false;
  }
  
  // 发送滚动事件
  emit('scroll', {
    scrollTop: target.scrollTop,
    scrollHeight: target.scrollHeight,
    clientHeight: target.clientHeight
  });
  
  // 判断是否滚动到顶部
  if (target.scrollTop <= 5) {
    emit('scroll-to-top');
  }
  
  // 判断是否滚动到底部
  if (target.scrollTop + target.clientHeight >= target.scrollHeight - 10) {
    emit('scroll-to-bottom');
    showScrollToBottomBtn.value = false;
  }
};

// 滚动到第一条新消息
const scrollToFirstNewMessage = async () => {
  try {
    if (newMessagesStartIndex.value >= 0 && messageListRef.value) {
      // 找到所有消息元素
      const messageItems = messageListRef.value.querySelectorAll('.liao-message-list-item');
      
      if (messageItems.length > newMessagesStartIndex.value) {
        // 获取第一条新消息
        const targetMessage = messageItems[newMessagesStartIndex.value];
        
        // 直接使用scrollTop属性滚动
        if (targetMessage && messageListRef.value) {
          // 计算目标消息相对于容器的偏移
          const container = messageListRef.value;
          const containerRect = container.getBoundingClientRect();
          const targetRect = targetMessage.getBoundingClientRect();
          
          // 计算滚动位置
          const scrollTo = container.scrollTop + (targetRect.top - containerRect.top) - 20;
          
          // 滚动到目标位置
          container.scrollTo({
            top: scrollTo,
            behavior: 'smooth'
          });
          
          // 添加高亮效果
          targetMessage.classList.add('liao-message-highlight');
          setTimeout(() => {
            targetMessage.classList.remove('liao-message-highlight');
          }, 1500);
        }
      }
    }
  } catch (error) {
    logger.error('滚动到新消息失败:', error);
  }
  
  // 无论是否成功滚动，都重置提示状态
  setTimeout(() => {
    newMessageCount.value = 0;
    showNewMessageTip.value = false;
    newMessagesStartIndex.value = -1;
  }, 500);
};

// 监听消息变化 - 使用适配后的消息
watch(
  () => adaptedMessages.value.length, // 监听适配后的消息数组长度变化
  (newLength, oldLength) => {
    // 新增：如果正在加载历史消息（由父组件传入的 loadingMore 为 true），则直接返回，避免误触发新消息提示。
    if (props.loadingMore) {
      return;
    }
    // console.log('适配后消息数组长度变化:', { newLength, oldLength });
    
    // 仅在有新增消息时处理
    if (newLength <= oldLength) {
      // console.log('没有新消息，不处理');
      return;
    }

    // 计算新增消息数量
    const addedCount = newLength - oldLength;
    // console.log('新增消息数量:', addedCount);
    
    // 检查是否在底部
    const atBottom = isNearBottom();
    // console.log('是否在底部:', atBottom);
    
    // 检查最新消息是否是自己发送的
    const isSelfMessage = adaptedMessages.value[newLength - 1]?.isSelf;
    // console.log('是自己的消息吗:', isSelfMessage);
    
    if (atBottom || isSelfMessage) {
      nextTick(() => {
        scrollToBottomFn(false);
      });
      // 重置新消息提示
      newMessageCount.value = 0;
      showNewMessageTip.value = false;
      // console.log('在底部或是自己的消息，不显示新消息提示');
    } else {
      // 不在底部，显示新消息提示
      // console.log('不在底部，显示新消息提示');
      if (newMessagesStartIndex.value === -1) {
        // 第一次收到新消息，记录起始索引
        newMessagesStartIndex.value = oldLength;
        // console.log('设置新消息起始索引:', newMessagesStartIndex.value);
      }
      
      // 更新新消息计数
      newMessageCount.value += addedCount;
      showNewMessageTip.value = true;
      
      // 输出状态检查
      // console.log('新消息提示状态:', {
      //   showNewMessageTip: showNewMessageTip.value,
      //   newMessageCount: newMessageCount.value,
      //   newMessagesStartIndex: newMessagesStartIndex.value
      // });
    }
  }
);

// 在用户滚动到底部时重置新消息提示
watch(
  () => shouldAutoScroll.value,
  (newVal) => {
    if (newVal) {
      // 用户滚动到底部，重置新消息提示
      newMessageCount.value = 0;
      showNewMessageTip.value = false;
      newMessagesStartIndex.value = -1;
    }
  }
);

// 监听DOM变化
const observer = ref<MutationObserver | null>(null);

const setupObserver = () => {
  if (messageListRef.value) {
    observer.value = new MutationObserver(() => {
      // 如果应该自动滚动，则滚动到底部
      if (shouldAutoScroll.value) {
        scrollToBottomFn(true);
      }
    });

    observer.value.observe(messageListRef.value, {
      childList: true,
      subtree: true,
      characterData: true, // 监听文本内容变化（对流式响应很重要）
    });
  }
};

onMounted(() => {
  // 初始化时设置自动滚动标志
  shouldAutoScroll.value = props.scrollToBottom;
  
  if (props.scrollToBottom) {
    // 确保初始加载时滚动到底部
    setTimeout(() => {
      scrollToBottomFn(false);
    }, 200); // 给足够时间让DOM渲染
  }

  if (messageListRef.value) {
    // 监听滚动事件
    messageListRef.value.addEventListener('scroll', handleScroll);
  }
  
  // 设置DOM变化观察器
  setupObserver();
});

onUnmounted(() => {
  // 清理滚动事件监听
  if (messageListRef.value) {
    messageListRef.value.removeEventListener('scroll', handleScroll);
  }
  
  // 清理定时器
  if (scrollTimer.value) {
    window.clearTimeout(scrollTimer.value);
  }
  if (observer.value) {
    observer.value.disconnect();
  }
});

// 暴露方法和状态
defineExpose({
  // 原有方法和状态
  scrollToBottom: scrollToBottomFn,
  shouldAutoScroll,
  showNewMessageTip,
  newMessageCount,
  newMessagesStartIndex,
  
  // AI 适配相关方法和状态
  adaptedMessages: readonly(adaptedMessages),
  adapterProcessing: readonly(adapterProcessing),
  adapterError: readonly(adapterError),
  aiAdapterStats: readonly(aiAdapterStats),
  
  // AI 适配器控制方法
  processAiMessages,
  updateAdapterOptions: updateOptions,
  clearAdapterCache: clearCache,
  
  // 手动触发适配
  adaptSingleMessage: adaptMessage,
});

// 监听消息变化，设置文件对象 - 使用适配后的消息
watch(
  () => adaptedMessages.value,
  (newMessages) => {
    // 等待下一次更新后设置文件对象
    nextTick(() => {
      logger.debug('🔍 [文件对象设置] 开始处理适配后消息列表:', newMessages.length);
      
      // 找到所有文件类型的消息
      const fileMessages = newMessages.filter(message => message.type === 'file');
      logger.debug('📁 [文件对象设置] 找到文件消息:', fileMessages.length);
      
      // 获取所有文件气泡组件引用
      const bubbleRefs = fileBubbleRefs.value;
      logger.debug('🎯 [文件对象设置] 气泡引用数量:', bubbleRefs.length);
      
      fileMessages.forEach((message, fileIndex) => {
        logger.debug(`📄 [文件对象设置] 处理文件 ${fileIndex + 1}:`, {
          消息ID: message.id,
          文件名: message.fileName,
          消息索引: newMessages.findIndex(m => m.id === message.id),
          有文件对象: !!message.file,
          有气泡引用: !!bubbleRefs[fileIndex]
        });
        
        if (message.file && bubbleRefs[fileIndex]) {
          try {
            bubbleRefs[fileIndex].setFileObject(message.file);
            logger.debug(`✅ [文件对象设置] 成功设置文件对象: ${message.fileName}`);
          } catch (error) {
            logger.error(`❌ [文件对象设置] 设置失败: ${message.fileName}`, error);
          }
        } else {
          logger.warn(`⚠️ [文件对象设置] 跳过设置:`, {
            文件名: message.fileName,
            原因: !message.file ? '无文件对象' : '无气泡引用'
          });
        }
      });
    });
  },
  { deep: true, immediate: true }
);
</script>

<style lang="scss" scoped>
.liao-message-list-wrapper {
  flex: 1;
  position: relative;
  overflow: hidden; /* 恢复为hidden，保持原有布局 */
}

.liao-message-list {
  height: 100%;
  overflow-y: auto; /* 确保滚动条正常工作 */
  padding: $spacing-md;
  display: flex;
  flex-direction: column;
  background-color: transparent;
  
  &-container {
    display: flex;
    flex-direction: column;
    flex: 1;
  }
  
  &-loading {
    display: flex;
    justify-content: center;
    padding: $spacing-md 0;
    
    &-indicator {
      color: $text-secondary;
    }
  }
  
  // AI 适配状态样式
  &-ai-loading {
    display: flex;
    justify-content: center;
    padding: $spacing-sm 0;
    margin: $spacing-xs 0;
    
    &-indicator {
      display: flex;
      align-items: center;
      color: $primary-color;
      font-size: $font-size-xs;
      
      .liao-icon {
        margin-right: $spacing-xs;
        color: $primary-color;
      }
      
      span {
        color: $text-secondary;
      }
    }
  }
  
  &-ai-error {
    display: flex;
    justify-content: center;
    padding: $spacing-sm $spacing-md;
    margin: $spacing-xs 0;
    background-color: rgba($danger-color, 0.1);
    border-radius: $border-radius-md;
    
    &-content {
      display: flex;
      align-items: center;
      color: $danger-color;
      font-size: $font-size-xs;
      
      .liao-icon {
        margin-right: $spacing-xs;
        color: $danger-color;
      }
      
      span {
        color: $danger-color;
      }
    }
  }
  
  &-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: $spacing-xl 0;
    color: $text-secondary;
    
    &-text {
      font-size: $font-size-sm;
      margin-top: $spacing-md;
    }
  }
  
  &-item {
    display: flex;
    flex-direction: column;
    
    &:not(:last-child) {
      margin-bottom: $spacing-xs;
    }
  }
  
  &-load-more {
    display: flex;
    justify-content: center;
    padding: $spacing-md 0;
    
    &-btn {
      padding: $spacing-xs $spacing-md;
      background-color: $bg-secondary;
      border-radius: $border-radius-md;
      font-size: $font-size-xs;
      color: $text-secondary;
      cursor: pointer;
      border: 1px solid $border-color;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &:hover {
        background-color: color.adjust($bg-secondary, $lightness: -3%);
      }
      
      .liao-icon {
        margin-right: $spacing-xs;
      }
    }
  }
  
  &-date-divider {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: $spacing-lg 0;
    position: relative;
    
    &::before,
    &::after {
      content: '';
      height: 1px;
      background-color: $border-color;
      flex: 1;
    }
    
    &-text {
      font-size: $font-size-xs;
      color: $text-secondary;
      padding: 0 $spacing-md;
      background-color: $bg-primary;
      z-index: 1;
    }
  }
  
  &-scroll-to-bottom {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 10px; // 将位置向下移，更靠近底部
    width: 36px;
    height: 36px;
    border-radius: $border-radius-circle;
    background-color: white;
    color: $primary-color; // 使用主题色作为图标颜色
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05); // 增强阴影效果
    z-index: 10;
    transition: all $transition-duration $transition-timing-function;
    
    .scroll-icon-container {
      position: relative;
      height: 20px;
      width: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    
    .scroll-icon-animation {
      position: absolute;
      animation: scrollDownAnimation 1.5s ease-in-out infinite;
      
      &.icon-2 {
        animation-delay: 0.75s; // 第二个图标延迟播放，形成连续效果
      }
    }
    
    &:hover {
      transform: translateX(-50%) translateY(-2px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.05);
    }
    
    &:active {
      transform: translateX(-50%) translateY(0);
    }
    
    &-unread-count {
      position: absolute;
      top: -4px;
      right: -4px;
      min-width: 18px;
      height: 18px;
      border-radius: 9px;
      background-color: $danger-color;
      color: white;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }
  }
  
  &-new-message-tip {
    position: absolute; 
    right: 20px;
    bottom: 15px; /* 位置下移 */
    padding: 6px 12px; /* 减小内边距 */
    border-radius: 16px;
    background-color: #1890ff; /* 改回蓝底白字，更加醒目 */
    color: white; /* 白色字体 */
    display: flex !important; /* 强制显示 */
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.5); /* 增强阴影效果 */
    z-index: 999 !important; /* 确保最高层级 */
    min-height: 32px; /* 略微增加高度 */
    min-width: 120px; /* 略微增加宽度 */
    font-size: 14px; /* 增加字体大小 */
    border: none; /* 移除边框 */
    animation: fadeInUp 0.5s ease forwards; /* 使用上浮动画，更加明显 */
    opacity: 1 !important; /* 确保显示 */
    visibility: visible !important; /* 确保显示 */
    transform: scale(1.05); /* 略微放大 */
    transition: transform 0.2s ease, background-color 0.2s ease;
    
    .new-message-tip-content {
      display: flex;
      align-items: center;
      
      .liao-icon {
        margin-right: 6px;
        font-size: 16px; /* 增加图标尺寸 */
        color: white; /* 图标白色 */
      }
    }
    
    &:hover {
      background-color: color.adjust(#1890ff, $lightness: -10%); /* 鼠标悬停变深 */
      transform: scale(1.1); /* 悬停时放大效果 */
    }
  }
}

// 滚动条样式
.liao-scrollable {
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: rgba($secondary-color, 0.2);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background-color: rgba($secondary-color, 0.3);
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes highlight {
  0% {
    background-color: transparent;
  }
  30% {
    background-color: rgba(24, 144, 255, 0.2);
  }
  100% {
    background-color: transparent;
  }
}

.liao-message-highlight {
  animation: highlight 1.5s ease-in-out;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: -10px;
    top: 0;
    bottom: 0;
    width: 4px;
    background-color: #1890ff;
    border-radius: 2px;
    animation: fadeOut 1.5s ease-in-out forwards;
  }
}

@keyframes fadeOut {
  0%, 50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes scrollDownAnimation {
  0% {
    transform: translateY(-8px);
    opacity: 0;
  }
  20% {
    transform: translateY(-4px);
    opacity: 1;
  }
  80% {
    transform: translateY(4px);
    opacity: 1;
  }
  100% {
    transform: translateY(8px);
    opacity: 0;
  }
}

@keyframes bounceInUp {
  from,
  60%,
  75%,
  90%,
  to {
    animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
  }

  from {
    opacity: 0;
    transform: translate(-50%, 30px);
  }

  60% {
    opacity: 1;
    transform: translate(-50%, -10px);
  }

  75% {
    transform: translate(-50%, 5px);
  }

  90% {
    transform: translate(-50%, -2px);
  }

  to {
    transform: translate(-50%, 0);
  }
}

@keyframes fadeInRight {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 20px, 0) scale(1.05);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale(1.05);
  }
}

@media (max-width: 768px) {
}

.liao-message-quick-actions {
  margin-top: 4px; /* 减小顶部边距 */
  margin-left: 40px; /* 与消息气泡对齐 */
  margin-bottom: 8px; /* 减小底部边距 */
}
</style> 