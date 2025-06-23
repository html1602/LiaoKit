<template>
  <div 
    class="liao-window"
    :class="[
      { 'liao-window-rounded': rounded },
      { 'liao-window-shadow': shadow },
      customClass
    ]"
    :style="{
      width: width,
      height: height,
      maxWidth: maxWidth,
      maxHeight: maxHeight,
      minWidth: minWidth,
      minHeight: minHeight
    }"
  >
    <slot name="header">
      <LiaoWindowHeader 
        :title="title" 
        :showClose="showClose" 
        :showMinimize="showMinimize" 
        :showMaximize="showMaximize"
        @close="handleClose"
        @minimize="handleMinimize"
        @maximize="handleMaximize"
      />
    </slot>
    <div class="liao-window-body">
      <slot
        :session-mode="sessionMode"
        :is-input-locked="isInputLocked"
        :active-plugin="activePlugin"
        :lock-reason="lockReason"
        :on-lock-input="lockInput"
        :on-unlock-input="unlockInput"
        :on-plugin-complete="handlePluginComplete"
        :on-plugin-cancel="handlePluginCancel"
        :on-plugin-error="handlePluginError"
        :on-emergency-unlock="emergencyUnlock"
      ></slot>
    </div>
    <div v-if="$slots.footer" class="liao-window-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, provide, watch } from 'vue';
import type { PropType } from 'vue';
import LiaoWindowHeader from '../LiaoWindowHeader/LiaoWindowHeader.vue';
import type { SessionMode, LockReason, ActivePlugin, LiaoSessionState } from '../../types/session';
import { LIAO_SESSION_STATE_KEY } from '../../types/session';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: '400px'
  },
  height: {
    type: [String, Number],
    default: '600px'
  },
  maxWidth: {
    type: [String, Number],
    default: '800px'
  },
  maxHeight: {
    type: [String, Number],
    default: '800px'
  },
  minWidth: {
    type: [String, Number],
    default: '320px'
  },
  minHeight: {
    type: [String, Number],
    default: '500px'
  },
  rounded: {
    type: Boolean,
    default: true
  },
  shadow: {
    type: Boolean,
    default: true
  },
  showClose: {
    type: Boolean,
    default: true
  },
  showMinimize: {
    type: Boolean,
    default: true
  },
  showMaximize: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  },
  // 新增：默认会话模式
  defaultSessionMode: {
    type: String as PropType<SessionMode>,
    default: 'human'
  },
  // 新增：是否启用紧急解锁
  enableEmergencyUnlock: {
    type: Boolean,
    default: true
  },
  // 新增：自动解锁超时时间（毫秒）
  autoUnlockTimeout: {
    type: Number,
    default: 30000 // 30秒
  }
});

const emit = defineEmits([
  'close', 
  'minimize', 
  'maximize',
  // 新增：状态变化事件
  'session-mode-change',
  'input-lock-change',
  'plugin-complete',
  'plugin-cancel',
  'plugin-error',
  'emergency-unlock'
]);

// === 全局状态管理 ===
const sessionMode = ref<SessionMode>('human');
const isInputLocked = ref<boolean>(false);
const activePlugin = ref<ActivePlugin | null>(null);
const lockReason = ref<LockReason>(null);

// 自动解锁定时器
let autoUnlockTimer: number | null = null;

// 锁定输入
const lockInput = (reason: LockReason, plugin?: ActivePlugin) => {
  console.log(`🔒 [LiaoWindow] 锁定输入: ${reason}`, plugin);
  
  isInputLocked.value = true;
  lockReason.value = reason;
  
  if (plugin) {
    activePlugin.value = plugin;
  }
  
  // 清除之前的定时器
  if (autoUnlockTimer) {
    clearTimeout(autoUnlockTimer);
    autoUnlockTimer = null;
  }
  
  // 设置自动解锁定时器（仅在启用且有超时时间时）
  if (props.autoUnlockTimeout > 0) {
    autoUnlockTimer = setTimeout(() => {
      console.warn(`⏰ [LiaoWindow] 自动解锁: ${reason} 超时`);
      emergencyUnlock();
    }, props.autoUnlockTimeout);
  }
  
  emit('input-lock-change', { locked: true, reason, plugin });
};

// 解锁输入
const unlockInput = () => {
  console.log(`🔓 [LiaoWindow] 解锁输入`);
  
  isInputLocked.value = false;
  lockReason.value = null;
  activePlugin.value = null;
  
  // 清除自动解锁定时器
  if (autoUnlockTimer) {
    clearTimeout(autoUnlockTimer);
    autoUnlockTimer = null;
  }
  
  emit('input-lock-change', { locked: false, reason: null, plugin: null });
};

// 紧急解锁
const emergencyUnlock = () => {
  console.warn(`🚨 [LiaoWindow] 紧急解锁`);
  
  unlockInput();
  emit('emergency-unlock');
};

// 处理插件完成
const handlePluginComplete = (data: any) => {
  console.log(`✅ [LiaoWindow] 插件完成:`, data);
  
  // 如果当前有活跃插件且是必须完成的，解锁输入
  if (activePlugin.value && activePlugin.value.required) {
    unlockInput();
  }
  
  emit('plugin-complete', data);
};

// 处理插件取消
const handlePluginCancel = (data: any) => {
  console.log(`❌ [LiaoWindow] 插件取消:`, data);
  
  // 如果当前有活跃插件且是必须完成的，保持锁定
  if (activePlugin.value && activePlugin.value.required) {
    console.log(`⚠️ [LiaoWindow] 必须完成的插件被取消，保持锁定状态`);
  } else {
    unlockInput();
  }
  
  emit('plugin-cancel', data);
};

// 处理插件错误
const handlePluginError = (data: any) => {
  console.error(`💥 [LiaoWindow] 插件错误:`, data);
  
  // 错误情况下解锁输入，但可以根据业务需求调整
  unlockInput();
  
  emit('plugin-error', data);
};

// 切换会话模式
const setSessionMode = (mode: SessionMode) => {
  const oldMode = sessionMode.value;
  sessionMode.value = mode;
  
  console.log(`🔄 [LiaoWindow] 会话模式切换: ${oldMode} -> ${mode}`);
  
  emit('session-mode-change', { oldMode, newMode: mode });
};

// 创建状态对象
const sessionState: LiaoSessionState = {
  get sessionMode() { return sessionMode.value; },
  get isInputLocked() { return isInputLocked.value; },
  get activePlugin() { return activePlugin.value; },
  get lockReason() { return lockReason.value; },
  lockInput,
  unlockInput,
  emergencyUnlock
};

// 提供状态给子组件
provide(LIAO_SESSION_STATE_KEY, sessionState);

// 监听会话模式变化
watch(() => props.defaultSessionMode, (newMode) => {
  setSessionMode(newMode);
}, { immediate: true });

const handleClose = () => {
  emit('close');
};

const handleMinimize = () => {
  emit('minimize');
};

const handleMaximize = () => {
  emit('maximize');
};

// 暴露方法给父组件
defineExpose({
  sessionMode: computed(() => sessionMode.value),
  isInputLocked: computed(() => isInputLocked.value),
  activePlugin: computed(() => activePlugin.value),
  lockReason: computed(() => lockReason.value),
  lockInput,
  unlockInput,
  emergencyUnlock,
  setSessionMode
});
</script>

<style lang="scss" scoped>


.liao-window {
  display: flex;
  flex-direction: column;
  background-color: $bg-secondary;
  border: 1px solid $border-color;
  
  &-rounded {
    border-radius: $border-radius-lg;
    overflow: hidden;
  }
  
  &-shadow {
    box-shadow: $shadow-md;
  }
  
  &-body {
    flex: 1;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  &-footer {
    border-top: 1px solid $border-color;
    padding: $spacing-md;
  }
}
</style> 