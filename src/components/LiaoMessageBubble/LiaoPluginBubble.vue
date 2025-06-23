<template>
  <div 
    class="liao-plugin-bubble"
    :class="[
      `liao-plugin-bubble-${status || 'normal'}`,
      { 'liao-plugin-bubble-loading': loading }
    ]"
    @click="handleClick"
    @contextmenu.prevent="handleContextMenu"
  >
    <!-- 插件内容区域 -->
    <div class="liao-plugin-bubble-content">
      <!-- 如果没有注册插件或找不到对应插件类型，显示默认内容 -->
      <template v-if="!resolvedPlugin">
        <slot>
          <div class="liao-plugin-bubble-unknown">
            <div class="liao-plugin-bubble-unknown-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <div class="liao-plugin-bubble-unknown-text">
              <div class="liao-plugin-bubble-unknown-title">未知插件类型</div>
              <div class="liao-plugin-bubble-unknown-desc">{{ pluginType || '未指定插件类型' }}</div>
            </div>
          </div>
        </slot>
      </template>
      
      <!-- 渲染已注册的插件组件 -->
      <component 
        v-else 
        :is="resolvedPlugin" 
        :plugin-data="pluginData"
        :status="status"
        :loading="loading"
        :readonly="readonly"
        v-bind="$attrs"
        @action="handlePluginAction"
      />
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="liao-plugin-bubble-loading-indicator">
      <svg class="liao-plugin-bubble-spinner" viewBox="0 0 50 50">
        <circle class="liao-plugin-bubble-spinner-circle" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
      </svg>
    </div>
    
    <!-- 错误状态 -->
    <div v-if="status === 'error'" class="liao-plugin-bubble-error-indicator">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="12"></line>
        <line x1="12" y1="16" x2="12.01" y2="16"></line>
      </svg>
      <span>{{ errorMessage || '操作失败，请稍后重试' }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, onBeforeMount, watch } from 'vue';
import type { PropType, Component } from 'vue';
import { PLUGIN_REGISTRY_KEY, type PluginRegistry, registerPlugin } from '../../utils/pluginRegistry';
import type { LiaoSessionState } from '../../types/session';
import { LIAO_SESSION_STATE_KEY } from '../../types/session';

// 导入所有内置插件
import * as builtinPlugins from '../LiaoPlugins';

// 获取全局插件注册表
const globalPlugins = inject<PluginRegistry>(PLUGIN_REGISTRY_KEY, {});

// 注入全局状态管理
const sessionState = inject<LiaoSessionState | null>(LIAO_SESSION_STATE_KEY, null);

// Props定义
const props = defineProps({
  pluginType: {
    type: String,
    default: ''
  },
  pluginData: {
    type: Object,
    default: () => ({})
  },
  status: {
    type: String as PropType<'normal' | 'success' | 'error' | 'warning' | 'info'>,
    default: 'normal'
  },
  loading: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  },
  errorMessage: {
    type: String,
    default: ''
  },
  id: {
    type: [String, Number],
    default: null
  },
  // 新增：消息ID
  messageId: {
    type: [String, Number],
    default: null
  },
  // 新增：是否为必须完成的插件
  pluginRequired: {
    type: Boolean,
    default: false
  }
});

// 事件
const emit = defineEmits(['action', 'click', 'context-menu', 'complete', 'cancel', 'error']);

// 尝试自动注册插件 - 立即执行
function tryAutoRegisterPlugin() {
  if (!props.pluginType || globalPlugins[props.pluginType]) return;
  
  // 尝试多种可能的命名方式
  const possiblePluginKeys = [
    // 标准格式: LiaoFormPlugin
    `Liao${props.pluginType.charAt(0).toUpperCase() + props.pluginType.slice(1)}Plugin`,
    
    // 连字符分隔: LiaoFaqCardPlugin (对应 faq-card)
    `Liao${props.pluginType.split('-').map(part => 
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join('')}Plugin`,
    
    // 驼峰格式: LiaoFormPlugin (对应 form)
    `Liao${props.pluginType}Plugin`
  ];
  
  // 遍历所有可能的插件名称
  for (const key of possiblePluginKeys) {
    const pluginComponent = (builtinPlugins as any)[key];
    if (pluginComponent) {
      console.log(`自动注册插件: ${props.pluginType} (${key})`);
      registerPlugin(props.pluginType, pluginComponent);
      break;
    }
  }
}

// 在组件创建前尝试注册插件
tryAutoRegisterPlugin();

// 监听插件必须完成状态的变化，自动锁定/解锁输入
watch(
  [() => props.pluginRequired, () => props.pluginType, () => props.messageId],
  ([required, pluginType, messageId]) => {
    if (required && pluginType && sessionState) {
      console.log(`🔒 [LiaoPluginBubble] 必须完成的插件: ${pluginType}, 锁定输入`);
      
      // 锁定输入区域
      sessionState.lockInput('PLUGIN_PENDING', {
        id: props.id || messageId || `${pluginType}-${Date.now()}`,
        type: pluginType,
        messageId: messageId,
        required: true,
        data: props.pluginData
      });
    }
  },
  { immediate: true }
);

// 获取已注册的插件组件
const resolvedPlugin = computed(() => {
  if (!props.pluginType) return null;
  // 再次检查是否已注册，如果仍未注册，再次尝试注册
  if (!globalPlugins[props.pluginType]) {
    tryAutoRegisterPlugin();
  }
  
  // 打印插件接收到的数据
  console.group(`🔌 [插件渲染数据] ${props.pluginType.toUpperCase()}`);
  console.log('📦 插件数据（props）:', props);
  console.log('🔐 必须完成:', props.pluginRequired);
  console.groupEnd();
  
  return globalPlugins[props.pluginType] || null;
});

// 在组件挂载前再次确保插件已注册
onBeforeMount(() => {
  if (props.pluginType && !globalPlugins[props.pluginType]) {
    tryAutoRegisterPlugin();
  }
});

// 处理插件内部的操作事件
const handlePluginAction = (actionData: any) => {
  // 打印插件发送的数据
  console.group(`🚀 [插件发送数据] ${props.pluginType.toUpperCase()}`);
  console.log('📦 发送数据（actionData）:', actionData);
  console.log('🔐 必须完成:', props.pluginRequired);
  console.groupEnd();
  
  const enrichedActionData = {
    type: actionData.type,
    data: actionData.data,
    pluginType: props.pluginType,
    pluginData: props.pluginData,
    id: props.id,
    messageId: props.messageId,
    required: props.pluginRequired
  };
  
  // 发送action事件
  emit('action', enrichedActionData);
  
  // 根据动作类型发送相应的事件
  switch (actionData.type) {
    case 'complete':
    case 'submit':
    case 'finish':
      console.log(`✅ [LiaoPluginBubble] 插件完成: ${props.pluginType}`);
      emit('complete', enrichedActionData);
      
      // 如果是必须完成的插件且有全局状态管理，解锁输入
      if (props.pluginRequired && sessionState) {
        console.log(`🔓 [LiaoPluginBubble] 必须完成的插件已完成，解锁输入`);
        sessionState.unlockInput();
      }
      break;
      
    case 'cancel':
    case 'close':
      console.log(`❌ [LiaoPluginBubble] 插件取消: ${props.pluginType}`);
      emit('cancel', enrichedActionData);
      
      // 如果是必须完成的插件，不自动解锁，保持锁定状态
      if (props.pluginRequired) {
        console.log(`⚠️ [LiaoPluginBubble] 必须完成的插件被取消，保持锁定状态`);
      } else {
        // 非必须完成的插件可以解锁
        if (sessionState) {
          sessionState.unlockInput();
        }
      }
      break;
      
    case 'error':
    case 'fail':
      console.error(`💥 [LiaoPluginBubble] 插件错误: ${props.pluginType}`, actionData.data);
      emit('error', enrichedActionData);
      
      // 错误情况下，根据业务需求决定是否解锁
      // 这里默认不解锁必须完成的插件，用户需要重新操作
      if (!props.pluginRequired && sessionState) {
        sessionState.unlockInput();
      }
      break;
  }
};

// 处理整个气泡的点击事件
const handleClick = (event: MouseEvent) => {
  emit('click', {
    event,
    pluginType: props.pluginType,
    pluginData: props.pluginData,
    id: props.id,
    messageId: props.messageId,
    required: props.pluginRequired
  });
};

// 处理右键菜单
const handleContextMenu = (event: MouseEvent) => {
  emit('context-menu', {
    event,
    pluginType: props.pluginType,
    pluginData: props.pluginData,
    id: props.id,
    messageId: props.messageId,
    required: props.pluginRequired
  });
};
</script>

<style lang="scss" scoped>


.liao-plugin-bubble {
  position: relative;
  width: 100%;
  max-width: 90%;
  margin-bottom: $spacing-md;
  transition: all 0.3s ease;
  
  &-content {
    border-radius: $border-radius-md;
    overflow: hidden;
    background-color: $bg-primary;
    border: 1px solid $border-color-card;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  
  // 未知插件类型的样式
  &-unknown {
    padding: $spacing-lg;
    display: flex;
    align-items: center;
    
    &-icon {
      margin-right: $spacing-md;
      color: $warning-color;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    &-text {
      flex: 1;
    }
    
    &-title {
      font-weight: $font-weight-medium;
      margin-bottom: $spacing-xs;
      color: $text-primary;
    }
    
    &-desc {
      font-size: $font-size-sm;
      color: $text-secondary;
    }
  }
  
  // 加载状态
  &-loading {
    pointer-events: none;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(255, 255, 255, 0.7);
      z-index: 1;
      border-radius: $border-radius-md;
    }
  }
  
  &-loading-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  &-spinner {
    width: 30px;
    height: 30px;
    animation: liao-spinner-rotate 2s linear infinite;
    
    &-circle {
      stroke: $primary-color;
      stroke-linecap: round;
      animation: liao-spinner-dash 1.5s ease-in-out infinite;
    }
  }
  
  // 错误状态
  &-error {
    .liao-plugin-bubble-content {
      border-color: $danger-color;
    }
  }
  
  &-error-indicator {
    padding: $spacing-sm;
    background-color: rgba($danger-color, 0.1);
    color: $danger-color;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: $font-size-sm;
    
    svg {
      margin-right: $spacing-xs;
    }
  }
  
  // 其他状态
  &-success .liao-plugin-bubble-content {
    border-color: $success-color;
  }
  
  &-warning .liao-plugin-bubble-content {
    border-color: $warning-color;
  }
  
  &-info .liao-plugin-bubble-content {
    border-color: $info-color;
  }
}

// 动画
@keyframes liao-spinner-rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes liao-spinner-dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .liao-plugin-bubble {
    max-width: 100%;
  }
}
</style> 