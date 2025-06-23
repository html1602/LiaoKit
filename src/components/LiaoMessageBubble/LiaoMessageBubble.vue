<template>
  <div 
    class="liao-message-bubble"
    :class="[
      `liao-message-bubble-${type}`,
      { 
        'liao-message-bubble-with-avatar': showAvatar,
        'liao-message-bubble-highlight': highlight
      },
      customClass
    ]"
    @click="handleClick"
    @contextmenu="handleContextMenu"
  >
    <div v-if="showAvatar && (type === 'other' || showAvatarSelf)" class="liao-message-bubble-avatar">
      <slot name="avatar">
        <img v-if="avatar" :src="avatar" alt="Avatar" class="liao-message-bubble-avatar-img" />
        <div v-else class="liao-message-bubble-avatar-placeholder">
          <LiaoIcon v-if="type === 'other'" name="robot" size="medium" />
          <LiaoIcon v-else name="user" size="medium" />
        </div>
      </slot>
    </div>
    <div class="liao-message-bubble-content">
      <div v-if="showName && name" class="liao-message-bubble-name">
        <slot name="name">{{ name }}</slot>
      </div>
      <div 
        class="liao-message-bubble-text" 
        :class="{ 
          'with-border': type === 'other',
          'streaming': status === 'streaming'
        }"
      >
        <slot>
          <div v-if="enableMarkdown && isMarkdown" v-html="renderedMarkdown"></div>
          <div v-else>{{ content }}</div>
        </slot>
      </div>
      <div v-if="status === 'sending'" class="liao-message-bubble-status">
        <LiaoIcon name="loading" size="small" class="loading-icon" />
      </div>
      <div v-else-if="status === 'streaming'" class="liao-message-bubble-status">
        <LiaoIcon name="loading" size="small" class="loading-icon" />
        <span>正在输出...</span>
      </div>
      <div v-else-if="status === 'failed'" class="liao-message-bubble-status error">
        <LiaoIcon name="error" size="small" />
        <span>发送失败</span>
      </div>
      <div v-if="showTime" class="liao-message-bubble-time">
        <slot name="time">{{ formattedTime }}</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import type { PropType } from 'vue';
import LiaoIcon from '../LiaoIcon/LiaoIcon.vue';
import { marked } from 'marked';

// 设置marked选项
marked.setOptions({
  breaks: true,
  gfm: true
});

// 气泡消息状态类型
type MessageStatus = 'sending' | 'sent' | 'failed' | 'streaming';

const props = defineProps({
  content: {
    type: String,
    default: ''
  },
  type: {
    type: String as PropType<'self' | 'other' | 'system'>,
    default: 'other'
  },
  avatar: {
    type: String,
    default: ''
  },
  showAvatar: {
    type: Boolean,
    default: true
  },
  showAvatarSelf: {
    type: Boolean,
    default: true
  },
  name: {
    type: String,
    default: ''
  },
  showName: {
    type: Boolean,
    default: false
  },
  time: {
    type: [String, Date, Number],
    default: ''
  },
  showTime: {
    type: Boolean,
    default: false
  },
  timeFormat: {
    type: String,
    default: 'HH:mm'
  },
  highlight: {
    type: Boolean,
    default: false
  },
  status: {
    type: String as PropType<MessageStatus>,
    default: 'sent'
  },
  enableMarkdown: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['click', 'context-menu']);

// 判断内容是否为Markdown
const isMarkdown = computed(() => {
  const content = props.content || '';
  return (
    content.includes('##') || 
    content.includes('**') || 
    content.includes('```') || 
    content.includes('- ') ||
    content.includes('[') && content.includes('](') ||
    content.includes('> ')
  );
});

// 处理Markdown内容
const renderedMarkdown = computed(() => {
  if (!props.enableMarkdown || !isMarkdown.value) {
    return props.content;
  }
  
  try {
    return marked(props.content);
  } catch (e) {
    console.error('Markdown渲染错误:', e);
    return props.content;
  }
});

// 时间格式化
const formattedTime = computed(() => {
  if (!props.time) return '';
  
  let date: Date;
  
  if (props.time instanceof Date) {
    date = props.time;
  } else if (typeof props.time === 'number') {
    date = new Date(props.time);
  } else {
    date = new Date(props.time);
  }
  
  if (isNaN(date.getTime())) {
    return '';
  }
  
  // 简易时间格式化
  const now = new Date();
  const isToday = date.getDate() === now.getDate() && 
                  date.getMonth() === now.getMonth() && 
                  date.getFullYear() === now.getFullYear();
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  if (isToday) {
    return `${hours}:${minutes}`;
  } else {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  }
});

// 处理点击事件
const handleClick = (event: MouseEvent) => {
  emit('click', { event, type: props.type });
};

// 处理右键菜单
const handleContextMenu = (event: MouseEvent) => {
  event.preventDefault();
  emit('context-menu', { event, type: props.type });
};
</script>

<style lang="scss" scoped>

.liao-message-bubble {
  display: flex;
  margin-bottom: $spacing-sm;
  width: fit-content;
  max-width: $bubble-max-width;
  position: relative;
  transition: all $transition-duration-fast;
  
  &-with-avatar {
    margin-top: $spacing-lg;
  }
  
  &-avatar {
    margin-right: $spacing-sm;
    flex-shrink: 0;
    
    &-img {
      width: $avatar-size;
      height: $avatar-size;
      border-radius: $border-radius-circle;
      object-fit: cover;
      border: 1px solid $border-color;
    }
    
    &-placeholder {
      width: $avatar-size;
      height: $avatar-size;
      border-radius: $border-radius-circle;
      background-color: $bg-secondary;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $text-secondary;
      border: 1px solid $border-color;
    }
  }
  
  &-content {
    display: flex;
    flex-direction: column;
  }
  
  &-name {
    font-size: $font-size-sm;
    color: $text-secondary;
    margin-bottom: $spacing-xs;
    font-weight: $font-weight-medium;
  }
  
  &-text {
    padding: $bubble-padding-y $bubble-padding-x;
    border-radius: $bubble-radius;
    background-color: $bubble-bg-other;
    word-break: break-word;
    word-wrap: break-word;
    overflow-wrap: break-word;
    white-space: pre-wrap;
    hyphens: auto;
    line-break: anywhere;
    font-size: $font-size-md;
    position: relative;
    text-align: left;
    
    * {
      text-align: left;
    }
    
    &.with-border {
      border: 1px solid $bubble-border-other;
    }
    
    // 流式输出状态样式
    &.streaming {
      &::after {
        content: '|';
        animation: blink 1s infinite;
        font-weight: bold;
        color: $primary-color;
      }
    }
    
    // Markdown样式覆盖
    :deep(a) {
      color: $primary-color;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    :deep(pre) {
      background-color: $bg-secondary;
      padding: $spacing-md;
      border-radius: $border-radius-sm;
      overflow-x: auto;
      margin: $spacing-sm 0;
      font-size: $font-size-sm;
    }
    
    :deep(code) {
      background-color: $bg-secondary;
      padding: 2px 4px;
      border-radius: $border-radius-sm;
      font-size: $font-size-sm;
    }
    
    :deep(ul), :deep(ol) {
      padding-left: $spacing-lg;
      margin: $spacing-sm 0;
    }
    
    :deep(blockquote) {
      border-left: 4px solid $border-color;
      padding-left: $spacing-md;
      margin: $spacing-sm 0;
      color: $text-secondary;
    }
  }
  
  &-time {
    font-size: $font-size-xs;
    color: $text-secondary;
    margin-top: $spacing-xs;
    align-self: flex-end;
  }
  
  &-status {
    font-size: $font-size-xs;
    margin-top: $spacing-xs;
    display: flex;
    align-items: center;
    color: $text-secondary;
    
    &.error {
      color: $danger-color;
    }
    
    span {
      margin-left: $spacing-xs;
    }
    
    .loading-icon {
      animation: spin 1s linear infinite;
    }
  }
  
  // 自己发送的消息
  &-self {
    flex-direction: row-reverse;
    align-self: flex-end;
    margin-left: auto;
    
    .liao-message-bubble-avatar {
      margin-right: 0;
      margin-left: $spacing-sm;
    }
    
    .liao-message-bubble-text {
      background-color: $bubble-bg-self;
      color: $bubble-text-self;
      border: none;
      // 继承父级的换行样式
      word-break: break-word;
      word-wrap: break-word;
      overflow-wrap: break-word;
      white-space: pre-wrap;
      hyphens: auto;
      line-break: anywhere;
      
      // 自己发送的消息中的Markdown样式覆盖
      :deep(a) {
        color: $bg-primary;
      }
      
      :deep(pre), :deep(code) {
        background-color: rgba(255, 255, 255, 0.1);
      }
      
      :deep(blockquote) {
        border-left-color: rgba(255, 255, 255, 0.3);
        color: rgba(255, 255, 255, 0.8);
      }
    }
    
    .liao-message-bubble-time {
      align-self: flex-start;
    }
  }
  
  // 系统消息
  &-system {
    align-self: center;
    margin: $spacing-md auto;
    
    .liao-message-bubble-text {
      background-color: transparent;
      color: $text-secondary;
      font-size: $font-size-xs;
      text-align: left;
      padding: $spacing-xs $spacing-lg;
      border: none;
    }
  }
  
  // 高亮气泡
  &-highlight {
    .liao-message-bubble-text {
      box-shadow: $shadow-sm;
      animation: highlight 2s ease-in-out;
    }
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

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

@keyframes highlight {
  0%, 100% {
    background-color: $bubble-bg-other;
  }
  50% {
    background-color: $bg-highlight;
  }
}

@media (max-width: 768px) {
  .liao-message-bubble {
    max-width: 90%;
    
    &-avatar {
      &-img, &-placeholder {
        width: 36px;
        height: 36px;
      }
    }
    
    &-text {
      font-size: $font-size-md;
    }
  }
}
</style> 