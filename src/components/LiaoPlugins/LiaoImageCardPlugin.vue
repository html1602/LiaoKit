<template>
  <div class="liao-image-card-plugin">
    <div class="liao-image-card-plugin-image-container">
      <img 
        :src="image" 
        :alt="title || '图片'" 
        class="liao-image-card-plugin-image"
        @error="handleImageError"
      />
      <div v-if="imageError" class="liao-image-card-plugin-image-error">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <span>图片加载失败</span>
      </div>
    </div>
    
    <div class="liao-image-card-plugin-content">
      <slot>
        <div v-if="title" class="liao-image-card-plugin-title">{{ title }}</div>
        <div v-if="desc" class="liao-image-card-plugin-desc">{{ desc }}</div>
      </slot>
      
      <div v-if="actions && actions.length" class="liao-image-card-plugin-actions">
        <button
          v-for="(action, index) in actions"
          :key="index"
          class="liao-image-card-plugin-action-btn"
          :class="{ 'liao-image-card-plugin-action-btn-primary': action.primary }"
          :disabled="readonly"
          @click="handleAction(action, index)"
        >
          {{ action.text }}
        </button>
      </div>
    </div>
    
    <div class="liao-image-card-plugin-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import type { PropType } from 'vue';

// 操作按钮类型
interface Action {
  text: string;
  action: string;
  primary?: boolean;
  extend?: Record<string, any>;
}

// 定义Props
const props = defineProps({
  pluginData: {
    type: Object as PropType<{
      image: string;
      title?: string;
      desc?: string;
      actions?: Action[];
    }>,
    default: () => ({})
  },
  status: {
    type: String,
    default: 'normal'
  },
  loading: {
    type: Boolean,
    default: false
  },
  readonly: {
    type: Boolean,
    default: false
  }
});

// 事件
const emit = defineEmits(['action']);

// 获取图片卡片数据
const image = computed(() => props.pluginData.image || '');
const title = computed(() => props.pluginData.title || '');
const desc = computed(() => props.pluginData.desc || '');
const actions = computed(() => props.pluginData.actions || []);

// 图片加载错误状态
const imageError = ref(false);

// 处理图片加载错误
const handleImageError = () => {
  imageError.value = true;
};

// 处理操作按钮点击
const handleAction = (action: Action, index: number) => {
  emit('action', {
    type: 'image-card-action',
    data: {
      action: action.action,
      actionText: action.text,
      index,
      extend: action.extend || null
    }
  });
};
</script>

<style lang="scss" scoped>
.liao-image-card-plugin {
  width: 100%;
  border-radius: $border-radius-md;
  overflow: hidden;
  background-color: $bg-primary;
  border: 1px solid $border-color-card;
  
  &-image-container {
    position: relative;
    width: 100%;
    height: 0;
    padding-bottom: 56.25%; // 16:9 宽高比
    overflow: hidden;
  }
  
  &-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
    
    &:hover {
      transform: scale(1.02);
    }
  }
  
  &-image-error {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: $bg-secondary;
    color: $text-secondary;
    
    svg {
      margin-bottom: $spacing-sm;
    }
  }
  
  &-content {
    padding: $spacing-lg;
  }
  
  &-title {
    font-size: $font-size-lg;
    font-weight: $font-weight-medium;
    color: $text-primary;
    margin-bottom: $spacing-xs;
  }
  
  &-desc {
    font-size: $font-size-md;
    color: $text-secondary;
    margin-bottom: $spacing-md;
    line-height: 1.5;
  }
  
  &-actions {
    margin-top: $spacing-md;
    display: flex;
    flex-wrap: wrap;
    gap: $spacing-sm;
  }
  
  &-action-btn {
    padding: $spacing-sm $spacing-lg;
    background-color: $bg-secondary;
    border: none;
    border-radius: $border-radius-sm;
    color: $text-primary;
    font-size: $font-size-md;
    cursor: pointer;
    transition: all $transition-duration;
    
    &:hover {
      background-color: color.adjust($bg-secondary, $lightness: -5%);
    }
    
    &-primary {
      background-color: $primary-color;
      color: white;
      
      &:hover {
        background-color: color.adjust($primary-color, $lightness: -5%);
      }
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }
  
  &-footer {
    padding: $spacing-md $spacing-lg;
    border-top: 1px solid $border-color-card;
    background-color: $bg-secondary;
  }
}
</style> 