<template>
  <div 
    class="liao-window-header"
    :style="backgroundColor ? { backgroundColor } : {}"
  >
    <div class="liao-window-header-left">
      <slot name="left"></slot>
    </div>
    <div class="liao-window-header-title" :style="titleColor ? { color: titleColor } : {}">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="liao-window-header-actions">
      <slot name="actions">
        <button 
          v-if="showMinimize"
          class="liao-window-header-action liao-window-header-minimize"
          @click="handleMinimize"
        >
          <LiaoIcon name="mdi:window-minimize" size="small" :color="minimizeIconColor || iconsColor || 'white'" />
        </button>
        <button 
          v-if="showMaximize"
          class="liao-window-header-action liao-window-header-maximize"
          @click="handleMaximize"
        >
          <LiaoIcon name="mdi:window-maximize" size="small" :color="maximizeIconColor || iconsColor || 'white'" />
        </button>
        <button 
          v-if="showClose"
          class="liao-window-header-action liao-window-header-close"
          @click="handleClose"
        >
          <LiaoIcon name="mdi:close" size="small" :color="closeIconColor || iconsColor || 'white'" />
        </button>
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import LiaoIcon from '../LiaoIcon/LiaoIcon.vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
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
  backgroundColor: {
    type: String,
    default: ''
  },
  titleColor: {
    type: String,
    default: ''
  },
  iconsColor: {
    type: String,
    default: ''
  },
  minimizeIconColor: {
    type: String,
    default: ''
  },
  maximizeIconColor: {
    type: String,
    default: ''
  },
  closeIconColor: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close', 'minimize', 'maximize']);

const handleClose = () => {
  emit('close');
};

const handleMinimize = () => {
  emit('minimize');
};

const handleMaximize = () => {
  emit('maximize');
};
</script>

<style lang="scss" scoped>
.liao-window-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $spacing-md;
  background-color: $header-bg;
  color: $header-text;
  user-select: none;
  height: $header-height;
  
  &-left {
    display: flex;
    align-items: center;
  }
  
  &-title {
    flex: 1;
    font-weight: $font-weight-medium;
    font-size: $font-size-md;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin: 0 $spacing-md;
    color: $header-text;
  }
  
  &-actions {
    display: flex;
    align-items: center;
  }
  
  &-action {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border: none;
    background: transparent;
    border-radius: 6px;
    margin-left: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    color: rgba(255, 255, 255, 0.8);
    padding: 0;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
      color: white;
      transform: scale(1.05);
    }
    
    &:active {
      transform: scale(0.95);
      background-color: rgba(255, 255, 255, 0.25);
    }
    
    &:focus {
      outline: none;
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
  
  &-close {
    &:hover {
      background-color: #ff4757;
      color: white;
      transform: scale(1.05);
    }
    
    &:active {
      background-color: #ff3742;
      transform: scale(0.95);
    }
  }
}
</style> 