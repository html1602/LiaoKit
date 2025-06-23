<template>
  <div 
    class="liao-app"
    :class="[
      { 'liao-app-window-mode': windowMode },
      customClass
    ]"
  >
    <slot name="header"></slot>
    <div class="liao-app-content">
      <LiaoMessageList
        :messages="messages"
        :loading="loading"
        :empty-text="emptyText"
        :show-avatar="showAvatar"
        :show-name="showName"
        :show-time="showTime"
        :has-more="hasMore"
        :load-more-text="loadMoreText"
        :scroll-to-bottom="scrollToBottom"
        @load-more="handleLoadMore"
        @scroll="handleScroll"
        @scroll-to-top="handleScrollToTop"
        @scroll-to-bottom="handleScrollToBottom"
      >
        <template #message="{ message, index, isLastMessage }">
          <slot 
            name="message" 
            :message="message" 
            :index="index" 
            :isLastMessage="isLastMessage"
          ></slot>
        </template>
        <template #empty>
          <slot name="empty"></slot>
        </template>
        <template #loading>
          <slot name="loading"></slot>
        </template>
        <template #load-more>
          <slot name="load-more"></slot>
        </template>
      </LiaoMessageList>
      <LiaoInputArea
        v-if="showInput"
        v-model="inputValue"
        :placeholder="inputPlaceholder"
        :disabled="inputDisabled"
        :readonly="inputReadonly"
        :rows="inputRows"
        :max-length="inputMaxLength"
        :show-length="showInputLength"
        :expanded="inputExpanded"
        :send-on-enter="sendOnEnter"
        :send-on-ctrl-enter="sendOnCtrlEnter"
        :send-empty="sendEmpty"
        @send="handleSend"
        @focus="handleInputFocus"
        @blur="handleInputBlur"
        @keydown="handleInputKeydown"
        ref="inputAreaRef"
      >
        <template #before>
          <slot name="input-before"></slot>
        </template>
        <template #actions>
          <slot name="input-actions"></slot>
        </template>
        <template #after>
          <slot name="input-after"></slot>
        </template>
      </LiaoInputArea>
      <LiaoQuickActionBar
        v-if="showQuickActions && quickActions.length > 0"
        :actions="quickActions"
        :vertical="quickActionsVertical"
        :fixed="quickActionsFixed"
        :show-label="showQuickActionLabel"
        @action-click="handleQuickAction"
      />
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import type { PropType } from 'vue';
import type { Message } from '../LiaoMessageList/LiaoMessageList.vue';
import type { QuickAction } from '../LiaoQuickActionBar/LiaoQuickActionBar.vue';
import LiaoMessageList from '../LiaoMessageList/LiaoMessageList.vue';
import LiaoInputArea from '../LiaoInputArea/LiaoInputArea.vue';
import LiaoQuickActionBar from '../LiaoQuickActionBar/LiaoQuickActionBar.vue';

const props = defineProps({
  // 基础配置
  windowMode: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String,
    default: ''
  },
  
  // 消息列表相关
  messages: {
    type: Array as PropType<Message[]>,
    default: () => []
  },
  loading: {
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
  showName: {
    type: Boolean,
    default: false
  },
  showTime: {
    type: Boolean,
    default: true
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
  
  // 输入区域相关
  showInput: {
    type: Boolean,
    default: true
  },
  modelValue: {
    type: String,
    default: ''
  },
  inputPlaceholder: {
    type: String,
    default: '请输入...'
  },
  inputDisabled: {
    type: Boolean,
    default: false
  },
  inputReadonly: {
    type: Boolean,
    default: false
  },
  inputRows: {
    type: Number,
    default: 2
  },
  inputMaxLength: {
    type: Number,
    default: 0
  },
  showInputLength: {
    type: Boolean,
    default: true
  },
  inputExpanded: {
    type: Boolean,
    default: false
  },
  sendOnEnter: {
    type: Boolean,
    default: true
  },
  sendOnCtrlEnter: {
    type: Boolean,
    default: false
  },
  sendEmpty: {
    type: Boolean,
    default: false
  },
  
  // 快捷操作栏相关
  showQuickActions: {
    type: Boolean,
    default: false
  },
  quickActions: {
    type: Array as PropType<QuickAction[]>,
    default: () => []
  },
  quickActionsVertical: {
    type: Boolean,
    default: false
  },
  quickActionsFixed: {
    type: Boolean,
    default: false
  },
  showQuickActionLabel: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits([
  'update:modelValue',
  'send',
  'load-more',
  'scroll',
  'scroll-to-top',
  'scroll-to-bottom',
  'input-focus',
  'input-blur',
  'input-keydown',
  'quick-action'
]);

const inputValue = ref(props.modelValue);
const inputAreaRef = ref<InstanceType<typeof LiaoInputArea> | null>(null);

// 发送消息
const handleSend = (message: string) => {
  emit('send', message);
};

// 加载更多消息
const handleLoadMore = () => {
  emit('load-more');
};

// 滚动事件
const handleScroll = (data: any) => {
  emit('scroll', data);
};

// 滚动到顶部
const handleScrollToTop = () => {
  emit('scroll-to-top');
};

// 滚动到底部
const handleScrollToBottom = () => {
  emit('scroll-to-bottom');
};

// 输入框获取焦点
const handleInputFocus = (e: FocusEvent) => {
  emit('input-focus', e);
};

// 输入框失去焦点
const handleInputBlur = (e: FocusEvent) => {
  emit('input-blur', e);
};

// 输入框键盘事件
const handleInputKeydown = (e: KeyboardEvent) => {
  emit('input-keydown', e);
};

// 快捷操作点击
const handleQuickAction = ({ action, index }: { action: QuickAction; index: number }) => {
  emit('quick-action', { action, index });
};

// 公开方法：聚焦输入框
const focusInput = () => {
  if (inputAreaRef.value) {
    inputAreaRef.value.focus();
  }
};

// 公开方法：清空输入框
const clearInput = () => {
  if (inputAreaRef.value) {
    inputAreaRef.value.clear();
  }
};

// 公开方法：发送消息
const send = () => {
  if (inputAreaRef.value) {
    inputAreaRef.value.sendMessage();
  }
};

// 暴露方法
defineExpose({
  focusInput,
  clearInput,
  send
});
</script>

<style lang="scss" scoped>


.liao-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background-color: $bg-primary;
  
  &-window-mode {
    border-radius: $border-radius-lg;
    overflow: hidden;
    box-shadow: $shadow-md;
    border: 1px solid $border-color;
    width: $window-default-width;
    height: $window-default-height;
  }
  
  &-content {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
  }
}
</style> 