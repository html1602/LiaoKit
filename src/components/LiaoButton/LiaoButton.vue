<template>
  <button 
    class="liao-button"
    :class="[
      `liao-button--${type}`,
      `liao-button--${size}`,
      {
        'liao-button--disabled': disabled,
        'liao-button--loading': loading
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="liao-button__loading">⌛</span>
    <slot />
  </button>
</template>

<script lang="ts" setup>
interface Props {
  type?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'default';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  disabled: false,
  loading: false
});

const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event);
  }
};
</script>

<style lang="scss" scoped>
.liao-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(38, 105, 255, 0.2);
  }
  
  // 尺寸
  &--small {
    padding: 6px 12px;
    font-size: 12px;
  }
  
  &--medium {
    padding: 8px 16px;
    font-size: 14px;
  }
  
  &--large {
    padding: 12px 24px;
    font-size: 16px;
  }
  
  // 类型
  &--default {
    background: #f8fafc;
    border-color: #e2e8f0;
    color: #475569;
    
    &:hover {
      background: #f1f5f9;
      border-color: #cbd5e1;
    }
  }
  
  &--primary {
    background: #2669ff;
    border-color: #2669ff;
    color: white;
    
    &:hover {
      background: #1e5ae8;
      border-color: #1e5ae8;
    }
  }
  
  &--secondary {
    background: #6366f1;
    border-color: #6366f1;
    color: white;
    
    &:hover {
      background: #5b21b6;
      border-color: #5b21b6;
    }
  }
  
  &--success {
    background: #10b981;
    border-color: #10b981;
    color: white;
    
    &:hover {
      background: #059669;
      border-color: #059669;
    }
  }
  
  &--warning {
    background: #f59e0b;
    border-color: #f59e0b;
    color: white;
    
    &:hover {
      background: #d97706;
      border-color: #d97706;
    }
  }
  
  &--danger {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
      border-color: #dc2626;
    }
  }
  
  // 状态
  &--disabled {
    opacity: 0.5;
    cursor: not-allowed;
    
    &:hover {
      transform: none;
    }
  }
  
  &--loading {
    cursor: wait;
  }
}

.liao-button__loading {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style> 